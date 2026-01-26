import crypto from 'crypto';

const SELCOM_BASE_URL = process.env.SELCOM_BASE_URL || 'https://apigw.selcommobile.com';
const SELCOM_API_KEY = process.env.SELCOM_API_KEY!;
const SELCOM_API_SECRET = process.env.SELCOM_API_SECRET!;
const SELCOM_VENDOR = process.env.SELCOM_VENDOR_ID!;

type SelcomHeaders = Record<string, string>;

function generateTimestamp(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, '+03:00');
}

function generateDigest(timestamp: string, data: Record<string, unknown>, signedFields: string[]): string {
  const parts = [`timestamp=${timestamp}`];
  
  for (const field of signedFields) {
    const value = data[field];
    if (value !== undefined && value !== null) {
      parts.push(`${field}=${value}`);
    }
  }
  
  const stringToSign = parts.join('&');
  
  const hmac = crypto.createHmac('sha256', SELCOM_API_SECRET);
  hmac.update(stringToSign);
  return hmac.digest('base64');
}

function generateAuthHeader(): string {
  const encoded = Buffer.from(SELCOM_API_KEY).toString('base64');
  return `SELCOM ${encoded}`;
}

function buildHeaders(data: Record<string, unknown>, signedFields: string[]): SelcomHeaders {
  const timestamp = generateTimestamp();
  const digest = generateDigest(timestamp, data, signedFields);
  
  return {
    'Content-Type': 'application/json',
    'Authorization': generateAuthHeader(),
    'Digest-Method': 'HS256',
    'Digest': digest,
    'Timestamp': timestamp,
    'Signed-Fields': signedFields.join(','),
  };
}

export interface CreateOrderResponse {
  reference: string;
  resultcode: string;
  result: string;
  message: string;
  data: Array<{
    gateway_buyer_uuid?: string;
    payment_token: string;
    qr?: string;
    payment_gateway_url: string;
  }>;
}

export interface WalletPaymentResponse {
  reference: string;
  resultcode: string;
  result: string;
  message: string;
  data: unknown[];
}

export interface OrderStatusResponse {
  reference: string;
  resultcode: string;
  result: string;
  message: string;
  data: Array<{
    order_id: string;
    creation_date: string;
    amount: string;
    payment_status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'USERCANCELLED' | 'REJECTED' | 'INPROGRESS';
    transid?: string;
    channel?: string;
    reference?: string;
    phone?: string;
  }>;
}

export async function createOrderMinimal(params: {
  orderId: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  webhookUrl: string;
  redirectUrl?: string;
  cancelUrl?: string;
}): Promise<CreateOrderResponse> {
  const data = {
    vendor: SELCOM_VENDOR,
    order_id: params.orderId,
    buyer_email: params.buyerEmail,
    buyer_name: params.buyerName,
    buyer_phone: params.buyerPhone,
    amount: params.amount,
    currency: 'TZS',
    webhook: Buffer.from(params.webhookUrl).toString('base64'),
    redirect_url: params.redirectUrl ? Buffer.from(params.redirectUrl).toString('base64') : undefined,
    cancel_url: params.cancelUrl ? Buffer.from(params.cancelUrl).toString('base64') : undefined,
    buyer_remarks: 'CV Download Payment',
    merchant_remarks: 'CV CHAP CHAP',
    no_of_items: 1,
    expiry: 30,
  };

  const signedFields = [
    'vendor', 'order_id', 'buyer_email', 'buyer_name', 'buyer_phone',
    'amount', 'currency', 'webhook', 'buyer_remarks', 'merchant_remarks', 'no_of_items'
  ];

  const headers = buildHeaders(data, signedFields);

  const response = await fetch(`${SELCOM_BASE_URL}/v1/checkout/create-order-minimal`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    console.error('Selcom create order error:', result);
    throw new Error(result.message || 'Failed to create order');
  }

  return result as CreateOrderResponse;
}

export async function triggerWalletPayment(params: {
  transId: string;
  orderId: string;
  msisdn: string;
}): Promise<WalletPaymentResponse> {
  const data = {
    transid: params.transId,
    order_id: params.orderId,
    msisdn: params.msisdn,
  };

  const signedFields = ['transid', 'order_id', 'msisdn'];
  const headers = buildHeaders(data, signedFields);

  const response = await fetch(`${SELCOM_BASE_URL}/v1/checkout/wallet-payment`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    console.error('Selcom wallet payment error:', result);
    throw new Error(result.message || 'Failed to trigger wallet payment');
  }

  return result as WalletPaymentResponse;
}

export async function getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
  const data = { order_id: orderId };
  const signedFields = ['order_id'];
  const headers = buildHeaders(data, signedFields);

  const response = await fetch(
    `${SELCOM_BASE_URL}/v1/checkout/order-status?order_id=${orderId}`,
    {
      method: 'GET',
      headers,
    }
  );

  const result = await response.json();
  
  if (!response.ok) {
    console.error('Selcom order status error:', result);
    throw new Error(result.message || 'Failed to get order status');
  }

  return result as OrderStatusResponse;
}

export function verifyWebhookSignature(
  timestamp: string,
  digest: string,
  data: Record<string, unknown>,
  signedFieldsHeader: string
): boolean {
  const signedFields = signedFieldsHeader.split(',');
  const expectedDigest = generateDigest(timestamp, data, signedFields);
  return digest === expectedDigest;
}
