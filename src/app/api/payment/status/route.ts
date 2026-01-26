import { NextRequest, NextResponse } from 'next/server';
import { getOrderStatus } from '@/lib/selcom/client';
import { getPaymentByOrderId } from '@/lib/supabase/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    const payment = await getPaymentByOrderId(orderId);

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

    try {
      const selcomStatus = await getOrderStatus(orderId);
      const paymentData = selcomStatus.data[0];

      if (paymentData?.payment_status === 'COMPLETED') {
        return NextResponse.json({
          status: 'completed',
          cvId: payment.cv_id,
          transactionId: paymentData.transid,
          message: 'Payment successful! Your CV is ready for download.',
        });
      }

      return NextResponse.json({
        status: paymentData?.payment_status?.toLowerCase() || 'pending',
        message: getStatusMessage(paymentData?.payment_status),
      });
    } catch {
      return NextResponse.json({
        status: payment.status,
        message: 'Waiting for payment confirmation...',
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

function getStatusMessage(status?: string): string {
  switch (status) {
    case 'PENDING':
      return 'Waiting for payment...';
    case 'INPROGRESS':
      return 'Processing payment...';
    case 'COMPLETED':
      return 'Payment successful!';
    case 'CANCELLED':
    case 'USERCANCELLED':
      return 'Payment was cancelled.';
    case 'REJECTED':
      return 'Payment was rejected.';
    default:
      return 'Checking payment status...';
  }
}
