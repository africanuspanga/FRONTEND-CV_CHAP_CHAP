import { NextRequest, NextResponse } from 'next/server';
import { triggerPush } from '@/lib/snippe/client';
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, resetAt } = rateLimit(`pay:ussd:${ip}`, 5);
  if (!success) return rateLimitResponse(resetAt);

  try {
    const { reference, phone } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'reference is required' },
        { status: 400 }
      );
    }

    let formattedPhone: string | undefined;
    if (phone) {
      const clean = phone.replace(/\D/g, '');
      formattedPhone = clean.startsWith('0') ? `255${clean.slice(1)}` : clean;
    }

    await triggerPush(reference, formattedPhone);

    return NextResponse.json({
      success: true,
      message: 'Payment request sent to your phone. Please enter your PIN to confirm.',
    });

  } catch (error) {
    console.error('Push USSD error:', error);
    return NextResponse.json(
      { error: 'Failed to send payment request' },
      { status: 500 }
    );
  }
}
