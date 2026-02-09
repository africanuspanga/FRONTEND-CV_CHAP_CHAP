-- 1. Profiles table updates + indexes
-- Run this first in Supabase SQL Editor

-- Add new columns to profiles (safe: uses IF NOT EXISTS pattern via DO block)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone_verified') THEN
    ALTER TABLE public.profiles ADD COLUMN phone_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'auth_provider') THEN
    ALTER TABLE public.profiles ADD COLUMN auth_provider text DEFAULT 'email';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login') THEN
    ALTER TABLE public.profiles ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Create indexes for scale (100k+ users)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_anonymous_id ON public.cvs(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_cvs_status ON public.cvs(status);
CREATE INDEX IF NOT EXISTS idx_payments_cv_id ON public.payments(cv_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_request_id ON public.payments(request_id);
