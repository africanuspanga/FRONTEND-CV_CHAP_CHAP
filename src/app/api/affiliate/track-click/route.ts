import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referral_code, landing_page } = body;

    if (!referral_code) {
      return NextResponse.json({ error: 'Missing referral code' }, { status: 400 });
    }

    // Use service role to bypass RLS for click tracking
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find the affiliate
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('referral_code', referral_code)
      .eq('status', 'approved')
      .single();

    if (affError || !affiliate) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // Record the click
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    await supabase.from('referral_clicks').insert({
      affiliate_id: affiliate.id,
      ip_address: ip.split(',')[0].trim(),
      user_agent: userAgent,
      landing_page: landing_page || '/',
    });

    // Increment click count
    await supabase.rpc('increment_affiliate_clicks', { aff_id: affiliate.id });

    return NextResponse.json({ success: true, affiliate_id: affiliate.id });
  } catch (error) {
    console.error('Track click error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
