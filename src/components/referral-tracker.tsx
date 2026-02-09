'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const REFERRAL_KEY = 'referral_code';
const REFERRAL_EXPIRY_KEY = 'referral_code_expiry';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (!refCode) return;

    // Store referral code with 30-day expiry
    localStorage.setItem(REFERRAL_KEY, refCode);
    localStorage.setItem(REFERRAL_EXPIRY_KEY, String(Date.now() + THIRTY_DAYS_MS));

    // Track the click
    fetch('/api/affiliate/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: refCode,
        landing_page: window.location.pathname,
      }),
    }).catch(() => {
      // Silently fail - click tracking is non-critical
    });
  }, [searchParams]);

  return null;
}

export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;

  const code = localStorage.getItem(REFERRAL_KEY);
  const expiry = localStorage.getItem(REFERRAL_EXPIRY_KEY);

  if (!code || !expiry) return null;

  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(REFERRAL_KEY);
    localStorage.removeItem(REFERRAL_EXPIRY_KEY);
    return null;
  }

  return code;
}
