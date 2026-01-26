import { NextRequest, NextResponse } from 'next/server';
import { triggerWalletPayment } from '@/lib/selcom/client';

export async function POST(request: NextRequest) {
  try {
    const { orderId, msisdn } = await request.json();

    if (!orderId || !msisdn) {
      return NextResponse.json(
        { error: 'orderId and msisdn are required' },
        { status: 400 }
      );
    }

    const cleanPhone = msisdn.replace(/\D/g, '');
    const formattedMsisdn = cleanPhone.startsWith('0') 
      ? `255${cleanPhone.slice(1)}` 
      : cleanPhone;

    const transId = `PUSH-${orderId}-${Date.now()}`;

    const result = await triggerWalletPayment({
      transId,
      orderId,
      msisdn: formattedMsisdn,
    });

    if (result.resultcode === '111' || result.resultcode === '000') {
      return NextResponse.json({
        success: true,
        message: 'Payment request sent to your phone. Please enter your PIN to confirm.',
        reference: result.reference,
        status: 'pending',
      });
    }

    return NextResponse.json({
      success: false,
      error: result.message || 'Failed to send payment request',
      resultcode: result.resultcode,
    }, { status: 400 });

  } catch (error) {
    console.error('Push USSD error:', error);
    return NextResponse.json(
      { error: 'Failed to send payment request' },
      { status: 500 }
    );
  }
}
