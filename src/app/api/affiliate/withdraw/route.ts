import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MIN_WITHDRAWAL = 5000; // TZS 5,000 minimum

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, phone } = body;

    if (!amount || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < MIN_WITHDRAWAL) {
      return NextResponse.json(
        { error: `Minimum withdrawal is TZS ${MIN_WITHDRAWAL.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Get affiliate record
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('id, available_balance, status')
      .eq('user_id', user.id)
      .single();

    if (affError || !affiliate) {
      return NextResponse.json({ error: 'Affiliate account not found' }, { status: 404 });
    }

    if (affiliate.status !== 'approved') {
      return NextResponse.json({ error: 'Affiliate account is not approved' }, { status: 403 });
    }

    if (affiliate.available_balance < amount) {
      return NextResponse.json(
        { error: `Insufficient balance. Available: TZS ${Number(affiliate.available_balance).toLocaleString()}` },
        { status: 400 }
      );
    }

    // Check for pending withdrawal
    const { data: pendingPayout } = await supabase
      .from('affiliate_payouts')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .in('status', ['pending', 'processing'])
      .limit(1);

    if (pendingPayout && pendingPayout.length > 0) {
      return NextResponse.json(
        { error: 'You already have a pending withdrawal request' },
        { status: 409 }
      );
    }

    // Create payout request
    const { data: payout, error: payoutError } = await supabase
      .from('affiliate_payouts')
      .insert({
        affiliate_id: affiliate.id,
        amount,
        phone,
        status: 'pending',
      })
      .select()
      .single();

    if (payoutError) {
      console.error('Payout creation error:', payoutError);
      return NextResponse.json({ error: payoutError.message }, { status: 500 });
    }

    // Deduct from available balance (hold the funds)
    await supabase
      .from('affiliates')
      .update({
        available_balance: affiliate.available_balance - amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', affiliate.id);

    return NextResponse.json({ payout });
  } catch (error) {
    console.error('Withdraw error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
