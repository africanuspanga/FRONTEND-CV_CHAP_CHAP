-- Admin RLS Bypass Policies
-- Run this in your Supabase SQL Editor to allow admin users to read/update all rows

-- Drop existing admin policies first (safe to run multiple times)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all cvs" ON cvs;
DROP POLICY IF EXISTS "Admins can update all cvs" ON cvs;
DROP POLICY IF EXISTS "Admins can delete cvs" ON cvs;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON payments;

-- Profiles: admin can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Profiles: admin can update all profiles (e.g. change roles)
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CVs: admin can read all CVs
CREATE POLICY "Admins can view all cvs"
  ON cvs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CVs: admin can update all CVs
CREATE POLICY "Admins can update all cvs"
  ON cvs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CVs: admin can delete CVs
CREATE POLICY "Admins can delete cvs"
  ON cvs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payments: admin can read all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payments: admin can update all payments
CREATE POLICY "Admins can update all payments"
  ON payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
