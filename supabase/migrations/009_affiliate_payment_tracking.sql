-- ============================================
-- 009: Add affiliate_id to payments for referral tracking
-- ============================================

ALTER TABLE payments ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES affiliates(id);

CREATE INDEX IF NOT EXISTS idx_payments_affiliate_id ON payments(affiliate_id);
