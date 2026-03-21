import { NextResponse } from 'next/server';

export const maxDuration = 30;

// PDF generation is handled client-side using @react-pdf/renderer.
// Both GET and POST return 410 so any stale callers get a clear error.
export async function GET() {
  return NextResponse.json(
    { error: 'PDF generation has moved to client-side.' },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'PDF generation has moved to client-side.' },
    { status: 410 }
  );
}
