import crypto from 'crypto';

const SNIPPE_BASE_URL = 'https://api.snippe.sh';
const SNIPPE_API_KEY = process.env.SNIPPE_API_KEY!;

export interface SnippePaymentData {
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'voided' | 'expired';
  amount: { currency: string; value: number };
  payment_type: string;
  expires_at: string;
  payment_url?: string;
  payment_qr_code?: string;
  payment_token?: string;
}

export interface SnippeResponse<T> {
  status: string;
  code: number;
  data: T;
}

export async function createMobilePayment(params: {
  amount: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  webhookUrl: string;
  metadata?: Record<string, string>;
  idempotencyKey: string;
}): Promise<SnippeResponse<SnippePaymentData>> {
  const response = await fetch(`${SNIPPE_BASE_URL}/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SNIPPE_API_KEY}`,
      'Idempotency-Key': params.idempotencyKey,
    },
    body: JSON.stringify({
      payment_type: 'mobile',
      details: {
        amount: params.amount,
        currency: 'TZS',
      },
      phone_number: params.phoneNumber,
      customer: {
        firstname: params.firstName,
        lastname: params.lastName,
        email: params.email,
      },
      webhook_url: params.webhookUrl,
      metadata: params.metadata,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to create payment');
  }
  return result as SnippeResponse<SnippePaymentData>;
}

export async function triggerPush(reference: string, phone?: string): Promise<void> {
  const body = phone ? JSON.stringify({ phone }) : undefined;
  const response = await fetch(`${SNIPPE_BASE_URL}/v1/payments/${reference}/push`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SNIPPE_API_KEY}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body,
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to trigger USSD push');
  }
}

export async function getPaymentStatus(reference: string): Promise<SnippeResponse<SnippePaymentData>> {
  const response = await fetch(`${SNIPPE_BASE_URL}/v1/payments/${reference}`, {
    headers: {
      'Authorization': `Bearer ${SNIPPE_API_KEY}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get payment status');
  }
  return result as SnippeResponse<SnippePaymentData>;
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
