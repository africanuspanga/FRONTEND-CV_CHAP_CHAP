import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function generateReferralCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 6);
  const random = Math.random().toString(36).substring(2, 6);
  return `${clean}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, email, phone } = body;

    if (!full_name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already has an affiliate account
    const { data: existing } = await supabase
      .from('affiliates')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `You already have an affiliate account (status: ${existing.status})` },
        { status: 409 }
      );
    }

    const referralCode = generateReferralCode(full_name);

    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_id: user.id,
        full_name,
        email,
        phone,
        referral_code: referralCode,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Affiliate registration error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ affiliate: data });
  } catch (error) {
    console.error('Affiliate register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
