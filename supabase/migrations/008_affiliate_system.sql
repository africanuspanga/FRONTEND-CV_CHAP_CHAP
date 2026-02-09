-- ============================================
-- 008: Affiliate System Tables & RLS Policies
-- ============================================

-- 1. Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 20.00, -- 20% default
  total_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_withdrawn NUMERIC(12,2) NOT NULL DEFAULT 0,
  available_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_clicks INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);

-- 2. Referral clicks tracking
CREATE TABLE IF NOT EXISTS referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  landing_page TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_clicks_affiliate_id ON referral_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_created_at ON referral_clicks(created_at);

-- 3. Referral conversions (successful payments)
CREATE TABLE IF NOT EXISTS referral_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  customer_user_id UUID REFERENCES auth.users(id),
  amount NUMERIC(12,2) NOT NULL, -- payment amount
  commission NUMERIC(12,2) NOT NULL, -- affiliate commission earned
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'reversed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_conversions_affiliate_id ON referral_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_payment_id ON referral_conversions(payment_id);

-- 4. Affiliate payouts (withdrawal requests)
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  phone TEXT NOT NULL, -- M-Pesa number for payout
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected')),
  admin_note TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON affiliate_payouts(status);

-- 5. Promo codes (optional, for affiliate-specific discount codes)
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_affiliate_id ON promo_codes(affiliate_id);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Affiliates: users can read their own, admin can read all
DROP POLICY IF EXISTS "Affiliates can view own record" ON affiliates;
CREATE POLICY "Affiliates can view own record" ON affiliates
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert affiliate application" ON affiliates;
CREATE POLICY "Users can insert affiliate application" ON affiliates
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Affiliates can update own record" ON affiliates;
CREATE POLICY "Affiliates can update own record" ON affiliates
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage all affiliates" ON affiliates;
CREATE POLICY "Admin can manage all affiliates" ON affiliates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Referral clicks: affiliates can view own, admin can view all
DROP POLICY IF EXISTS "Affiliates can view own clicks" ON referral_clicks;
CREATE POLICY "Affiliates can view own clicks" ON referral_clicks
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can insert clicks" ON referral_clicks;
CREATE POLICY "Anyone can insert clicks" ON referral_clicks
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage all clicks" ON referral_clicks;
CREATE POLICY "Admin can manage all clicks" ON referral_clicks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Referral conversions: affiliates can view own, admin can manage all
DROP POLICY IF EXISTS "Affiliates can view own conversions" ON referral_conversions;
CREATE POLICY "Affiliates can view own conversions" ON referral_conversions
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin can manage all conversions" ON referral_conversions;
CREATE POLICY "Admin can manage all conversions" ON referral_conversions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Affiliate payouts: affiliates can view/create own, admin can manage all
DROP POLICY IF EXISTS "Affiliates can view own payouts" ON affiliate_payouts;
CREATE POLICY "Affiliates can view own payouts" ON affiliate_payouts
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Affiliates can request payouts" ON affiliate_payouts;
CREATE POLICY "Affiliates can request payouts" ON affiliate_payouts
  FOR INSERT WITH CHECK (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin can manage all payouts" ON affiliate_payouts;
CREATE POLICY "Admin can manage all payouts" ON affiliate_payouts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Promo codes: public read for active codes, admin can manage
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON promo_codes;
CREATE POLICY "Anyone can read active promo codes" ON promo_codes
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage all promo codes" ON promo_codes;
CREATE POLICY "Admin can manage all promo codes" ON promo_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Service role bypass for API routes (clicks, conversions)
DROP POLICY IF EXISTS "Service role full access affiliates" ON affiliates;
CREATE POLICY "Service role full access affiliates" ON affiliates
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access clicks" ON referral_clicks;
CREATE POLICY "Service role full access clicks" ON referral_clicks
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access conversions" ON referral_conversions;
CREATE POLICY "Service role full access conversions" ON referral_conversions
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access payouts" ON affiliate_payouts;
CREATE POLICY "Service role full access payouts" ON affiliate_payouts
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access promo_codes" ON promo_codes;
CREATE POLICY "Service role full access promo_codes" ON promo_codes
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Helper Functions
-- ============================================

-- Increment affiliate click count
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(aff_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE affiliates
  SET total_clicks = total_clicks + 1, updated_at = now()
  WHERE id = aff_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Record a conversion and update affiliate balances
CREATE OR REPLACE FUNCTION record_affiliate_conversion(
  p_affiliate_id UUID,
  p_payment_id UUID,
  p_customer_user_id UUID,
  p_amount NUMERIC,
  p_commission NUMERIC
)
RETURNS UUID AS $$
DECLARE
  v_conversion_id UUID;
BEGIN
  INSERT INTO referral_conversions (affiliate_id, payment_id, customer_user_id, amount, commission, status)
  VALUES (p_affiliate_id, p_payment_id, p_customer_user_id, p_amount, p_commission, 'confirmed')
  RETURNING id INTO v_conversion_id;

  UPDATE affiliates
  SET total_earnings = total_earnings + p_commission,
      available_balance = available_balance + p_commission,
      total_conversions = total_conversions + 1,
      updated_at = now()
  WHERE id = p_affiliate_id;

  RETURN v_conversion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
