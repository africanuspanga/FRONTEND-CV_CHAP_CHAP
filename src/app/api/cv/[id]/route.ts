import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Fetch a paid CV by its ID so clients can recover data if local state is lost.
// The UUID is unguessable, so no additional auth is needed.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('cvs')
      .select('data, template_id, status')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    // Only return data for paid CVs
    if (data.status !== 'paid') {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    return NextResponse.json({ cvData: data.data, templateId: data.template_id });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
