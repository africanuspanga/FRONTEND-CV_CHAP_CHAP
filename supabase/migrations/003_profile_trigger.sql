-- 3. Auto-create profile on signup
-- Run this third in Supabase SQL Editor
-- Critical for Google OAuth and phone OTP flows

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, auth_provider, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.phone, NEW.raw_user_meta_data ->> 'phone', NULL),
    CASE
      WHEN NEW.raw_app_meta_data ->> 'provider' = 'google' THEN 'google'
      WHEN NEW.phone IS NOT NULL THEN 'phone'
      ELSE 'email'
    END,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    auth_provider = EXCLUDED.auth_provider,
    last_login = NOW();

  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
