-- Fix missing columns and ensure admin profile exists
-- Run this in Supabase SQL Editor
-- Add missing columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email';

-- Add missing columns to cvs
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Add missing columns to payments (if not already added by 006)
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Ensure the admin profile exists and has the correct role
-- (The create-admin script may have created the auth user but the
-- profile trigger might not have fired, or RLS blocked the insert)
INSERT INTO public.profiles (id, email, full_name, role, created_at)
SELECT
  id,
  email,
  'Admin',
  'admin',
  NOW()
FROM auth.users
WHERE email = 'admin@cvchapchap.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Make sure RLS policies allow users to read their own profile
-- (Re-apply base policies in case they were dropped)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CVs policies
DROP POLICY IF EXISTS "Users can view own CVs" ON public.cvs;
CREATE POLICY "Users can view own CVs"
  ON public.cvs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own CVs" ON public.cvs;
CREATE POLICY "Users can insert own CVs"
  ON public.cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own CVs" ON public.cvs;
CREATE POLICY "Users can update own CVs"
  ON public.cvs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own CVs" ON public.cvs;
CREATE POLICY "Users can delete own CVs"
  ON public.cvs FOR DELETE
  USING (auth.uid() = user_id);

-- Payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cvs
      WHERE cvs.id = payments.cv_id
      AND cvs.user_id = auth.uid()
    )
  );

-- Admin bypass policies (re-apply from 005)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view all cvs" ON public.cvs;
CREATE POLICY "Admins can view all cvs"
  ON public.cvs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update all cvs" ON public.cvs;
CREATE POLICY "Admins can update all cvs"
  ON public.cvs FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete cvs" ON public.cvs;
CREATE POLICY "Admins can delete cvs"
  ON public.cvs FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments;
CREATE POLICY "Admins can update all payments"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
