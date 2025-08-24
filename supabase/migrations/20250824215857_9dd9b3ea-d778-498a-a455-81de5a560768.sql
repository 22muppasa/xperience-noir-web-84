
-- Drop all existing RLS policies on profiles table to start clean
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update user roles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert their profile" ON public.profiles;
DROP POLICY IF EXISTS "Auth users can select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Only approved users can access admin functions" ON public.profiles;
DROP POLICY IF EXISTS "Select profiles for auth users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Update the existing security definer function to be more comprehensive
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

-- Create a new security definer function to check if user is approved admin
CREATE OR REPLACE FUNCTION public.is_approved_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND role = 'admin' 
    AND approval_status = 'approved'
  );
$$;

-- Create a function to check if user can access their own profile
CREATE OR REPLACE FUNCTION public.can_access_own_profile(profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT profile_id = auth.uid();
$$;

-- Create new simplified RLS policies that don't cause recursion
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (can_access_own_profile(id));

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (can_access_own_profile(id))
WITH CHECK (can_access_own_profile(id));

CREATE POLICY "Approved admins can view all profiles"
ON public.profiles
FOR SELECT
USING (is_approved_admin());

CREATE POLICY "Approved admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (is_approved_admin())
WITH CHECK (is_approved_admin());

CREATE POLICY "Approved admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (is_approved_admin());

CREATE POLICY "Approved admins can delete profiles"
ON public.profiles
FOR DELETE
USING (is_approved_admin());

-- Allow new users to create their profile during signup
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (can_access_own_profile(id));
