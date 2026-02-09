import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ valid: false, error: 'No code provided' });
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, full_name, referral_code')
      .eq('referral_code', code)
      .eq('status', 'approved')
      .single();

    if (!affiliate) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      affiliate_id: affiliate.id,
      name: affiliate.full_name,
    });
  } catch (error) {
    console.error('Validate code error:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' });
  }
}
