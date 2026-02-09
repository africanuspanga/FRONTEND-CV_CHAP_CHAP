import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/selcom/client';
import { updatePaymentStatus, getCVById, updateCVStatus, getPaymentByOrderId } from '@/lib/supabase/database';
import { createClient as createServiceClient } from '@supabase/supabase-js';

interface SelcomWebhookPayload {
  result: string;
  resultcode: string;
  order_id: string;
  transid: string;
  reference: string;
  channel: string;
  msisdn: string;
  amount: string;
  utilityref?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const timestamp = request.headers.get('Timestamp') || '';
    const digest = request.headers.get('Digest') || '';
    const signedFields = request.headers.get('Signed-Fields') || '';

    const body: SelcomWebhookPayload = await request.json();

    console.log('Received Selcom webhook:', {
      order_id: body.order_id,
      resultcode: body.resultcode,
      transid: body.transid,
    });

    if (process.env.SELCOM_API_SECRET) {
      const isValid = verifyWebhookSignature(
        timestamp,
        digest,
        body as unknown as Record<string, unknown>,
        signedFields
      );

      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const orderId = body.order_id;
    const isSuccess = body.resultcode === '000';

    if (isSuccess) {
      await updatePaymentStatus(orderId, 'completed', body.transid);

      const cvIdMatch = orderId.match(/^CV-([a-f0-9-]+)-/);
      if (cvIdMatch) {
        const cvId = cvIdMatch[1];
        const cv = await getCVById(cvId);
        if (cv) {
          await updateCVStatus(cv.id, 'paid');
        }
      }

      // Record affiliate conversion if payment has an affiliate
      try {
        const payment = await getPaymentByOrderId(orderId);
        if (payment?.affiliate_id) {
          const serviceSupabase = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );

          // Get affiliate commission rate
          const { data: affiliate } = await serviceSupabase
            .from('affiliates')
            .select('id, commission_rate')
            .eq('id', payment.affiliate_id)
            .single();

          if (affiliate) {
            const amount = Number(body.amount) || 5000;
            const commission = (amount * affiliate.commission_rate) / 100;

            // Look up the CV to get the user_id
            const paymentCV = payment.cv_id ? await getCVById(payment.cv_id) : null;

            await serviceSupabase.rpc('record_affiliate_conversion', {
              p_affiliate_id: affiliate.id,
              p_payment_id: payment.id,
              p_customer_user_id: paymentCV?.user_id || null,
              p_amount: amount,
              p_commission: commission,
            });

            console.log(`Affiliate conversion recorded: ${affiliate.id}, commission: ${commission}`);
          }
        }
      } catch (affError) {
        console.error('Affiliate conversion recording failed:', affError);
        // Don't fail the webhook for affiliate errors
      }

      console.log(`Payment completed for order ${orderId}`);
    } else {
      await updatePaymentStatus(orderId, 'failed');
      console.log(`Payment failed for order ${orderId}: ${body.message}`);
    }

    return NextResponse.json({
      result: 'SUCCESS',
      resultcode: '000',
      message: 'Webhook processed successfully',
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
