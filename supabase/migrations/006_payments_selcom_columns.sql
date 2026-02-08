-- Add Selcom-specific columns to payments table
-- Run this in Supabase SQL Editor

ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS order_id VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS selcom_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS selcom_transid VARCHAR(100),
ADD COLUMN IF NOT EXISTS selcom_result VARCHAR(50),
ADD COLUMN IF NOT EXISTS selcom_resultcode VARCHAR(10),
ADD COLUMN IF NOT EXISTS channel VARCHAR(50),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS affiliate_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS raw_response JSONB;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_selcom_transid ON public.payments(selcom_transid);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Allow anonymous users to insert payments (for non-logged-in CV purchases)
DROP POLICY IF EXISTS "Anyone can insert payments" ON public.payments;
CREATE POLICY "Anyone can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (true);

-- Allow updates to payments via webhook (service role handles this, but just in case)
DROP POLICY IF EXISTS "Service can update payments" ON public.payments;
CREATE POLICY "Service can update payments"
  ON public.payments FOR UPDATE
  USING (true);
