-- 2. Row-Level Security policies
-- Run this second in Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert for trigger (service role creates profile on signup)
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CVs: users can CRUD their own CVs
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

-- Payments: users can view their own payments
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
