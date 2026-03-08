import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { CVData } from '@/types/cv';
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export const maxDuration = 30;

const GENERIC_ERROR = 'Please copy the exact message after payment';

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface ParsedReceipt {
  merchantName: string;
  merchantNumber: string;
  amount: string;
  transId: string;
  ref: string;
  channel: string;
  from: string;
  date: string;
}

function parseSelcomReceipt(text: string): ParsedReceipt | null {
  const trimmed = text.trim();

  if (trimmed.length < 120 || trimmed.length > 300) return null;

  const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length < 7) return null;

  if (!lines[0].toLowerCase().includes('selcom')) return null;

  const merchantName = lines[1] || '';
  const merchantNumber = lines[2]?.replace(/^Merchant#?\s*/i, '').trim() || '';
  const amount = lines[3]?.trim() || '';
  const transId = lines[4]?.replace(/^TransID\s*/i, '').trim() || '';
  const ref = lines[5]?.replace(/^Ref\s*/i, '').trim() || '';
  const channel = lines[6]?.replace(/^Channel\s*/i, '').trim() || '';
  const from = lines[7]?.replace(/^From\s*/i, '').trim() || '';
  const date = lines[8]?.trim() || '';

  return { merchantName, merchantNumber, amount, transId, ref, channel, from, date };
}

function validateReceipt(parsed: ParsedReceipt): boolean {
  // Merchant must be DRIFTMARK TECHNOLOGI (Selcom truncates the name)
  const merchantUpper = parsed.merchantName.toUpperCase();
  if (!merchantUpper.includes('DRIFTMARK') || !merchantUpper.includes('TECHNOLOGI')) {
    return false;
  }

  // Amount must be exactly 5000
  const amountClean = parsed.amount.replace(/[^0-9.]/g, '');
  if (parseFloat(amountClean) !== 5000) {
    return false;
  }

  // Date/time format must match (e.g. 03/10/2025 2:00:51 PM)
  const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s*(AM|PM)/i;
  if (!datePattern.test(parsed.date)) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, resetAt } = rateLimit(`pay:receipt:${ip}`, 5);
  if (!success) return rateLimitResponse(resetAt);

  try {
    const body = await request.json();
    const {
      receiptText,
      cvData,
      templateId,
      anonymousId,
      referral_code,
    } = body as {
      receiptText: string;
      cvData: CVData;
      templateId: string;
      anonymousId?: string;
      referral_code?: string;
    };

    if (!receiptText || !cvData || !templateId) {
      return NextResponse.json(
        { error: 'Receipt text, CV data, and template ID are required' },
        { status: 400 }
      );
    }

    const parsed = parseSelcomReceipt(receiptText);
    if (!parsed) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400 }
      );
    }

    if (!validateReceipt(parsed)) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400 }
      );
    }

    const serviceSupabase = getServiceSupabase();

    // Save the CV
    const { data: cv, error: cvError } = await serviceSupabase
      .from('cvs')
      .insert({
        template_id: templateId,
        data: cvData,
        anonymous_id: anonymousId || crypto.randomUUID(),
        status: 'paid',
      })
      .select()
      .single();

    if (cvError) throw cvError;

    const orderId = `CV-${cv.id.slice(0, 8)}-${Date.now()}`;

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

    // Save the payment as completed
    const insertData: Record<string, unknown> = {
      cv_id: cv.id,
      request_id: orderId,
      amount: 5000,
      currency: 'TZS',
      status: 'completed',
      phone_number: parsed.from.replace(/\D/g, ''),
      transaction_id: parsed.transId,
      selcom_reference: parsed.ref,
      completed_at: new Date().toISOString(),
      raw_callback: { manual_receipt: receiptText, parsed },
    };
    if (affiliateId) insertData.affiliate_id = affiliateId;

    const { data: payment, error: payError } = await serviceSupabase
      .from('payments')
      .insert(insertData)
      .select()
      .single();

    if (payError) throw payError;

    // Record affiliate conversion if applicable
    if (affiliateId && payment) {
      try {
        const { data: affiliate } = await serviceSupabase
          .from('affiliates')
          .select('id, commission_rate')
          .eq('id', affiliateId)
          .single();

        if (affiliate) {
          const commission = (5000 * affiliate.commission_rate) / 100;
          await serviceSupabase.rpc('record_affiliate_conversion', {
            p_affiliate_id: affiliate.id,
            p_payment_id: payment.id,
            p_customer_user_id: null,
            p_amount: 5000,
            p_commission: commission,
          });
        }
      } catch (affError) {
        console.error('Affiliate conversion recording failed:', affError);
      }
    }

    return NextResponse.json({
      success: true,
      cvId: cv.id,
      orderId,
      transId: parsed.transId,
    });

  } catch (error) {
    console.error('Receipt verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify receipt. Please try again or contact support.' },
      { status: 500 }
    );
  }
}
