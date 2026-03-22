import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/snippe/client';
import { getPaymentByOrderId } from '@/lib/supabase/database';
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { createClient as createServiceClient } from '@supabase/supabase-js';

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, resetAt } = rateLimit(`pay:status:${ip}`, 30);
  if (!success) return rateLimitResponse(resetAt);

  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('orderId');

    if (!reference) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    // Check our DB first
    const payment = await getPaymentByOrderId(reference);

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'completed') {
      return NextResponse.json({
        status: 'completed',
        cvId: payment.cv_id,
        transactionId: payment.transaction_id,
        message: 'Payment successful! Your CV is ready for download.',
      });
    }

    if (payment.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        message: 'Payment failed. Please try again.',
      });
    }

    // Poll Snippe for live status
    try {
      const snippeStatus = await getPaymentStatus(reference);
      const { status } = snippeStatus.data;

      if (status === 'completed') {
        // Persist to DB in case webhook was missed/delayed
        try {
          const svc = getServiceSupabase();
          await svc.from('payments').update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          }).eq('request_id', reference).eq('status', 'pending');
          if (payment.cv_id) {
            await svc.from('cvs').update({ status: 'paid', updated_at: new Date().toISOString() }).eq('id', payment.cv_id);
          }
        } catch {
          // non-fatal — DB update is best-effort here
        }
        return NextResponse.json({
          status: 'completed',
          cvId: payment.cv_id,
          message: 'Payment successful! Your CV is ready for download.',
        });
      }

      if (status === 'failed' || status === 'voided' || status === 'expired') {
        return NextResponse.json({
          status: 'failed',
          message: getStatusMessage(status),
        });
      }

      return NextResponse.json({
        status: 'pending',
        message: 'Waiting for payment confirmation...',
      });
    } catch {
      return NextResponse.json({
        status: payment.status,
        message: 'Checking payment status...',
      });
    }

  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to get payment status' },
      { status: 500 }
    );
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'completed': return 'Payment successful!';
    case 'failed': return 'Payment was declined. Please try again.';
    case 'voided': return 'Payment was cancelled.';
    case 'expired': return 'Payment expired. Please try again.';
    default: return 'Checking payment status...';
  }
}
