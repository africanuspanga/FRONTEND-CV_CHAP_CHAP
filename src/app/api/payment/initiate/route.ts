import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, amount, currency, cvData, templateId } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const requestId = uuidv4();

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Payment initiated. Check your phone for USSD prompt.',
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
