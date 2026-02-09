import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get affiliate record
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (affError || !affiliate) {
      return NextResponse.json({ error: 'Affiliate account not found' }, { status: 404 });
    }

    // Get recent conversions
    const { data: conversions } = await supabase
      .from('referral_conversions')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get recent payouts
    const { data: payouts } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get clicks this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyClicks } = await supabase
      .from('referral_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('affiliate_id', affiliate.id)
      .gte('created_at', startOfMonth.toISOString());

    // Get conversions this month
    const { count: monthlyConversions } = await supabase
      .from('referral_conversions')
      .select('*', { count: 'exact', head: true })
      .eq('affiliate_id', affiliate.id)
      .gte('created_at', startOfMonth.toISOString());

    return NextResponse.json({
      affiliate,
      conversions: conversions || [],
      payouts: payouts || [],
      monthlyClicks: monthlyClicks || 0,
      monthlyConversions: monthlyConversions || 0,
    });
  } catch (error) {
    console.error('Affiliate stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
