import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/snippe/client';
import { getPaymentByOrderId } from '@/lib/supabase/database';
import { createClient as createServiceClient } from '@supabase/supabase-js';

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const maxDuration = 30;

interface SnippeWebhookPayload {
  id: string;
  type: 'payment.completed' | 'payment.failed';
  api_version: string;
  created_at: string;
  data: {
    reference: string;
    external_reference?: string;
    status: string;
    amount: { value: number; currency: string };
    channel?: { type: string; provider: string };
    customer?: { phone?: string; name?: string; email?: string };
    metadata?: Record<string, string>;
    failure_reason?: string;
    completed_at?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    const webhookSecret = process.env.SNIPPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('X-Webhook-Signature') || '';
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid Snippe webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      console.warn('SNIPPE_WEBHOOK_SECRET not set — skipping signature verification');
    }

    const body: SnippeWebhookPayload = JSON.parse(rawBody);

    console.log('Received Snippe webhook:', {
      event_id: body.id,
      type: body.type,
      reference: body.data?.reference,
    });

    const { reference, metadata } = body.data;
    const isSuccess = body.type === 'payment.completed';

    if (isSuccess) {
      const serviceSupabase = getServiceSupabase();

      // Use service role client to update payment status (anon key blocked by RLS)
      const updateData: Record<string, unknown> = {
        status: 'completed',
        transaction_id: body.data.external_reference,
        completed_at: new Date().toISOString(),
      };
      const { data: updatedPayment, error: payUpdateError } = await serviceSupabase
        .from('payments')
        .update(updateData)
        .eq('request_id', reference)
        .select()
        .single();

      if (payUpdateError) {
        console.error('Failed to update payment status:', payUpdateError);
      }

      // Mark CV as paid
      const cvId = metadata?.cv_id || updatedPayment?.cv_id;
      if (cvId) {
        await serviceSupabase
          .from('cvs')
          .update({ status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', cvId);
      }

      // Record affiliate conversion if applicable
      try {
        const payment = await getPaymentByOrderId(reference);
        if (payment?.affiliate_id) {

          const { data: affiliate } = await serviceSupabase
            .from('affiliates')
            .select('id, commission_rate')
            .eq('id', payment.affiliate_id)
            .single();

          if (affiliate) {
            const amount = body.data.amount?.value || 5000;
            const commission = (amount * affiliate.commission_rate) / 100;
            let customerUserId: string | null = null;
            if (payment.cv_id) {
              const { data: paymentCV } = await serviceSupabase
                .from('cvs')
                .select('user_id')
                .eq('id', payment.cv_id)
                .single();
              customerUserId = paymentCV?.user_id || null;
            }

            await serviceSupabase.rpc('record_affiliate_conversion', {
              p_affiliate_id: affiliate.id,
              p_payment_id: payment.id,
              p_customer_user_id: customerUserId,
              p_amount: amount,
              p_commission: commission,
            });

            console.log(`Affiliate conversion recorded: ${affiliate.id}, commission: ${commission}`);
          }
        }
      } catch (affError) {
        console.error('Affiliate conversion recording failed:', affError);
      }

      console.log(`Payment completed for reference ${reference}`);
    } else {
      const serviceSupabase = getServiceSupabase();
      await serviceSupabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('request_id', reference);
      console.log(`Payment failed for reference ${reference}: ${body.data.failure_reason}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
