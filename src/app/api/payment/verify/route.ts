import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, paymentMessage } = body;

    if (!requestId || !paymentMessage) {
      return NextResponse.json(
        { error: 'Request ID and payment message are required' },
        { status: 400 }
      );
    }

    const isValid = paymentMessage.toLowerCase().includes('selcom') ||
                    paymentMessage.toLowerCase().includes('confirmed') ||
                    paymentMessage.toLowerCase().includes('success') ||
                    paymentMessage.includes('TZS');

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment confirmation' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
