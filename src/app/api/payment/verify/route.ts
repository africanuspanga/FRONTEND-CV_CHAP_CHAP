import { NextResponse } from 'next/server';

// This endpoint has been removed. Payment verification happens via:
// 1. Selcom webhook at /api/payment/webhook
// 2. Receipt verification at /api/payment/verify-receipt
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been removed. Use the official payment flow.' },
    { status: 410 }
  );
}
