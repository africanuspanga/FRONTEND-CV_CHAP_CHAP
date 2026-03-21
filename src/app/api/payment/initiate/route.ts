import { NextRequest, NextResponse } from 'next/server';
import { createMobilePayment } from '@/lib/snippe/client';
import { CVData } from '@/types/cv';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export const maxDuration = 30;

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, resetAt } = rateLimit(`pay:init:${ip}`, 5);
  if (!success) return rateLimitResponse(resetAt);

  try {
    const body = await request.json();
    const {
      cvData,
      templateId,
      phone,
      email,
      name,
      anonymousId,
      referral_code,
    } = body as {
      cvData: CVData;
      templateId: string;
      phone: string;
      email: string;
      name: string;
      anonymousId?: string;
      referral_code?: string;
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

    const serviceSupabase = getServiceSupabase();

    const { data: cv, error: cvError } = await serviceSupabase
      .from('cvs')
      .insert({
        template_id: templateId,
        data: cvData,
        anonymous_id: anonymousId || crypto.randomUUID(),
        status: 'draft',
      })
      .select()
      .single();

    if (cvError) throw cvError;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cvchapchap.com';
    const webhookUrl = `${baseUrl}/api/payment/webhook`;
    const idempotencyKey = `cv-${cv.id}-${Date.now()}`;

    const firstName = cvData.personalInfo.firstName || name?.split(' ')[0] || 'Customer';
    const lastName = cvData.personalInfo.lastName || name?.split(' ').slice(1).join(' ') || 'User';
    const customerEmail = email || cvData.personalInfo.email || `${msisdn}@cvchapchap.com`;

    const snippeResponse = await createMobilePayment({
      amount: 5000,
      phoneNumber: msisdn,
      firstName,
      lastName,
      email: customerEmail,
      webhookUrl,
      metadata: {
        cv_id: cv.id,
        template_id: templateId,
      },
      idempotencyKey,
    });

    if (snippeResponse.status !== 'success') {
      console.error('Snippe payment creation failed:', snippeResponse);
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 400 }
      );
    }

    const { reference } = snippeResponse.data;

    // Look up affiliate from referral code
    let affiliateId: string | null = null;
    if (referral_code) {
      const { data: affiliate } = await serviceSupabase
        .from('affiliates')
        .select('id')
        .eq('referral_code', referral_code)
        .eq('status', 'approved')
        .single();
      if (affiliate) {
        affiliateId = affiliate.id;
      }
    }

    const insertData: Record<string, unknown> = {
      cv_id: cv.id,
      request_id: reference,
      amount: 5000,
      currency: 'TZS',
      status: 'pending',
      phone_number: msisdn,
    };
    if (affiliateId) insertData.affiliate_id = affiliateId;

    const { error: payError } = await serviceSupabase
      .from('payments')
      .insert(insertData);

    if (payError) throw payError;

    await serviceSupabase
      .from('cvs')
      .update({ status: 'pending_payment' })
      .eq('id', cv.id);

    return NextResponse.json({
      success: true,
      reference,
      cvId: cv.id,
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
