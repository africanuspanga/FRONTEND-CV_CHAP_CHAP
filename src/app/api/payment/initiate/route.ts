import { NextRequest, NextResponse } from 'next/server';
import { createOrderMinimal } from '@/lib/selcom/client';
import { createCV, createPayment } from '@/lib/supabase/database';
import { CVData } from '@/types/cv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cvData, 
      templateId, 
      phone, 
      email, 
      name,
      anonymousId 
    } = body as {
      cvData: CVData;
      templateId: string;
      phone: string;
      email: string;
      name: string;
      anonymousId?: string;
    };

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone.match(/^255\d{9}$/) && !cleanPhone.match(/^0\d{9}$/)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Use format: 255XXXXXXXXX or 0XXXXXXXXX' },
        { status: 400 }
      );
    }

    const msisdn = cleanPhone.startsWith('0') 
      ? `255${cleanPhone.slice(1)}` 
      : cleanPhone;

    const cv = await createCV({
      templateId,
      cvData,
      anonymousId,
    });

    const orderId = `CV-${cv.id.slice(0, 8)}-${Date.now()}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cvchapchap.co.tz';
    const webhookUrl = `${baseUrl}/api/payment/webhook`;

    const selcomOrder = await createOrderMinimal({
      orderId,
      buyerEmail: email || `${msisdn}@cvchapchap.co.tz`,
      buyerName: name || `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
      buyerPhone: msisdn,
      amount: 5000,
      webhookUrl,
      redirectUrl: `${baseUrl}/payment/success?order=${orderId}`,
      cancelUrl: `${baseUrl}/payment/cancelled?order=${orderId}`,
    });

    if (selcomOrder.resultcode !== '000') {
      console.error('Selcom order creation failed:', selcomOrder);
      return NextResponse.json(
        { error: selcomOrder.message || 'Failed to create payment order' },
        { status: 400 }
      );
    }

    const paymentToken = selcomOrder.data[0]?.payment_token;
    await createPayment(cv.id, orderId);

    return NextResponse.json({
      success: true,
      orderId,
      cvId: cv.id,
      paymentToken,
      paymentGatewayUrl: selcomOrder.data[0]?.payment_gateway_url 
        ? Buffer.from(selcomOrder.data[0].payment_gateway_url, 'base64').toString('utf-8')
        : null,
      msisdn,
      amount: 5000,
      currency: 'TZS',
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
