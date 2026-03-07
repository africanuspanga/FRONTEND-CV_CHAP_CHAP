import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { CVData } from '@/types/cv';
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export const maxDuration = 30;

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

  // Message length must be in a realistic range for Selcom receipts
  if (trimmed.length < 120 || trimmed.length > 300) return null;

  const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length < 7) return null;

  // First line should be "Selcom Pay" (case-insensitive)
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

function validateReceipt(parsed: ParsedReceipt): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Validate merchant name
  //    Selcom truncates to ~20 chars so it shows "DRIFTMARK TECHNOLOGI" (not TECHNOLOGIES).
  //    Any receipt showing "TECHNOLOGIES" is fake.
  const merchantUpper = parsed.merchantName.toUpperCase();

  if (!merchantUpper.includes('DRIFTMARK')) {
    errors.push('Merchant name does not match. Please ensure you paid to DRIFTMARK TECHNOLOGIES via Selcom.');
  } else if (!merchantUpper.includes('TECHNOLOGI')) {
    errors.push('Merchant name does not match. Please ensure you paid to DRIFTMARK TECHNOLOGIES via Selcom.');
  }

  // 2. Validate amount - must be exactly TZS 5,000.00
  const amountClean = parsed.amount.replace(/[^0-9.]/g, '');
  const amountNum = parseFloat(amountClean);
  if (isNaN(amountNum) || amountNum !== 5000) {
    errors.push('Payment amount must be exactly TZS 5,000.00');
  }

  // 3. Validate TransID exists and has reasonable length
  if (!parsed.transId || parsed.transId.length < 5) {
    errors.push('Invalid transaction ID.');
  }

  // 4. Validate Ref exists
  if (!parsed.ref || parsed.ref.length < 4) {
    errors.push('Invalid reference number.');
  }

  // 5. Validate From (phone number)
  const phoneClean = parsed.from.replace(/\D/g, '');
  if (!phoneClean || phoneClean.length < 9) {
    errors.push('Invalid sender phone number in receipt.');
  }

  return { valid: errors.length === 0, errors };
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

    // Parse the receipt
    const parsed = parseSelcomReceipt(receiptText);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Could not read the receipt. Please paste the full Selcom payment message exactly as received.' },
        { status: 400 }
      );
    }

    // Validate the receipt
    const validation = validateReceipt(parsed);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(' ') },
        { status: 400 }
      );
    }

    const serviceSupabase = getServiceSupabase();

    // Check if this TransID or Ref was already used (prevent reuse)
    const { data: existingByTransId } = await serviceSupabase
      .from('payments')
      .select('id')
      .eq('transaction_id', parsed.transId)
      .maybeSingle();

    if (existingByTransId) {
      return NextResponse.json(
        { error: 'This receipt has already been used. Each payment receipt can only be used once.' },
        { status: 400 }
      );
    }

    const { data: existingByRef } = await serviceSupabase
      .from('payments')
      .select('id')
      .eq('selcom_reference', parsed.ref)
      .maybeSingle();

    if (existingByRef) {
      return NextResponse.json(
        { error: 'This payment reference has already been used. Each payment can only be used once.' },
        { status: 400 }
      );
    }

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
