import { NextResponse } from 'next/server';

// PDF generation has been moved to client-side using @react-pdf/renderer's pdf() function
// to avoid Turbopack JSX runtime incompatibility with react-pdf on the server.
// See src/app/(builder)/preview/page.tsx handleDownloadCV
export async function POST() {
  return NextResponse.json(
    { error: 'PDF generation has moved to client-side. Please update your client.' },
    { status: 410 }
  );
}
