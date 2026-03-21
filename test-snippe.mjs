/**
 * Snippe Payment API – Local Test Script
 * Run: node test-snippe.mjs
 *
 * Tests:
 *  1. Create a mobile payment (1000 TZS)
 *  2. Trigger USSD push to phone
 *  3. Poll payment status
 *
 * Set these before running (or add to your shell):
 *   export SNIPPE_API_KEY=your_key_here
 *   export TEST_PHONE=255XXXXXXXXX
 */

const SNIPPE_BASE_URL = 'https://api.snippe.sh';
const API_KEY = process.env.SNIPPE_API_KEY;
const TEST_PHONE = process.env.TEST_PHONE || '255682152148'; // change to your test number

if (!API_KEY) {
  console.error('ERROR: SNIPPE_API_KEY env var is not set.');
  console.error('Run: export SNIPPE_API_KEY=your_key_here');
  process.exit(1);
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function log(label, data) {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`[${label}]`);
  console.log(JSON.stringify(data, null, 2));
}

async function snippeRequest(path, options = {}) {
  const url = `${SNIPPE_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  return { ok: res.ok, status: res.status, data };
}

// ─── Step 1: Create Payment ───────────────────────────────────────────────────

async function createPayment() {
  console.log('\nSTEP 1: Creating payment (1000 TZS)...');
  console.log(`Phone: ${TEST_PHONE}`);

  const idempotencyKey = `test-${Date.now()}`;

  const { ok, status, data } = await snippeRequest('/v1/payments', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({
      payment_type: 'mobile',
      details: {
        amount: 1000,
        currency: 'TZS',
      },
      phone_number: TEST_PHONE,
      customer: {
        firstname: 'Test',
        lastname: 'User',
        email: 'test@cvchapchap.com',
      },
      webhook_url: 'https://www.cvchapchap.com/api/payment/webhook',
      metadata: {
        cv_id: 'test-cv-local',
        note: 'local test run',
      },
    }),
  });

  log(`CREATE PAYMENT — HTTP ${status}`, data);

  if (!ok || data?.status !== 'success') {
    console.error('\nFailed to create payment. Stopping.');
    process.exit(1);
  }

  return data.data.reference;
}

// ─── Step 2: Trigger USSD Push ───────────────────────────────────────────────

async function triggerPush(reference) {
  console.log(`\nSTEP 2: Triggering USSD push for reference: ${reference}`);

  const { ok, status, data } = await snippeRequest(`/v1/payments/${reference}/push`, {
    method: 'POST',
    body: JSON.stringify({ phone: TEST_PHONE }),
  });

  log(`TRIGGER PUSH — HTTP ${status}`, data);

  if (!ok) {
    console.warn('Push trigger failed (may still work if auto-push is on).');
  }
}

// ─── Step 3: Poll Status ─────────────────────────────────────────────────────

async function pollStatus(reference, maxAttempts = 20, intervalMs = 5000) {
  console.log(`\nSTEP 3: Polling payment status every ${intervalMs / 1000}s (max ${maxAttempts} attempts)...`);
  console.log('Enter your PIN on your phone when the USSD prompt appears.\n');

  for (let i = 1; i <= maxAttempts; i++) {
    await new Promise(r => setTimeout(r, i === 1 ? 2000 : intervalMs));

    const { ok, status, data } = await snippeRequest(`/v1/payments/${reference}`);

    const payStatus = data?.data?.status || 'unknown';
    console.log(`[Poll ${i}/${maxAttempts}] HTTP ${status} — payment status: ${payStatus}`);

    if (payStatus === 'completed') {
      log('PAYMENT COMPLETED', data.data);
      console.log('\nSUCCESS — Snippe payment flow works!');
      return;
    }

    if (['failed', 'voided', 'expired'].includes(payStatus)) {
      log('PAYMENT ENDED', data.data);
      console.log(`\nPayment ended with status: ${payStatus}`);
      return;
    }
  }

  console.log('\nPolling timed out — payment still pending.');
  console.log('Check the Snippe dashboard for the final status.');
}

// ─── Main ────────────────────────────────────────────────────────────────────

(async () => {
  console.log('=== Snippe Payment Test ===');
  console.log(`API URL: ${SNIPPE_BASE_URL}`);
  console.log(`Test phone: ${TEST_PHONE}`);
  console.log(`Amount: 1000 TZS`);

  const reference = await createPayment();
  console.log(`\nReference: ${reference}`);

  await triggerPush(reference);
  await pollStatus(reference);
})();
