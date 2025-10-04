-- Fix the is_approved_admin function to properly handle enum comparison
CREATE OR REPLACE FUNCTION public.is_approved_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND role = 'admin'::user_role
    AND approval_status = 'approved'
  );
$$;