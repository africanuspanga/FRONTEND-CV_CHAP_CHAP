-- 4. Claim anonymous CVs function
-- Run this fourth in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.claim_anonymous_cvs(
  p_user_id uuid,
  p_anonymous_id text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  claimed_count integer;
BEGIN
  -- Only claim CVs that have no user_id (truly anonymous)
  UPDATE public.cvs
  SET
    user_id = p_user_id,
    anonymous_id = NULL,
    updated_at = NOW()
  WHERE
    anonymous_id = p_anonymous_id
    AND (user_id IS NULL OR user_id = p_user_id)
    AND is_deleted = false;

  GET DIAGNOSTICS claimed_count = ROW_COUNT;
  RETURN claimed_count;
END;
$$;
