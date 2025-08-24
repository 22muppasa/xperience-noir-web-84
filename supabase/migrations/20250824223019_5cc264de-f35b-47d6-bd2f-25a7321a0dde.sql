
-- Update RLS policies to require approval for admin access
DROP POLICY IF EXISTS "Approved admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Approved admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Approved admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Approved admins can insert profiles" ON public.profiles;

-- Create new RLS policies that check both role and approval status
CREATE POLICY "Approved admins can view all profiles" ON public.profiles
FOR SELECT USING (is_approved_admin());

CREATE POLICY "Approved admins can update all profiles" ON public.profiles
FOR UPDATE USING (is_approved_admin())
WITH CHECK (is_approved_admin());

CREATE POLICY "Approved admins can delete profiles" ON public.profiles
FOR DELETE USING (is_approved_admin());

CREATE POLICY "Approved admins can insert profiles" ON public.profiles
FOR INSERT WITH CHECK (is_approved_admin());

-- Update other admin-only tables to use approval check
DROP POLICY IF EXISTS "Admins can manage all programs" ON public.programs;
CREATE POLICY "Approved admins can manage all programs" ON public.programs
FOR ALL USING (is_approved_admin());

DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can update all enrollments" ON public.enrollments;
CREATE POLICY "Approved admins can view all enrollments" ON public.enrollments
FOR SELECT USING (is_approved_admin());
CREATE POLICY "Approved admins can update all enrollments" ON public.enrollments
FOR UPDATE USING (is_approved_admin());

-- Update admin settings policies
DROP POLICY IF EXISTS "Only admins can access admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Only admins can manage admin settings" ON public.admin_settings;
CREATE POLICY "Only approved admins can manage admin settings" ON public.admin_settings
FOR ALL USING (is_approved_admin())
WITH CHECK (is_approved_admin());

-- Update volunteer applications policies
DROP POLICY IF EXISTS "Admins can view all volunteer applications" ON public.volunteer_applications;
DROP POLICY IF EXISTS "Admins can update volunteer applications" ON public.volunteer_applications;
DROP POLICY IF EXISTS "Admins can delete volunteer applications" ON public.volunteer_applications;
CREATE POLICY "Approved admins can view all volunteer applications" ON public.volunteer_applications
FOR SELECT USING (is_approved_admin());
CREATE POLICY "Approved admins can update volunteer applications" ON public.volunteer_applications
FOR UPDATE USING (is_approved_admin());
CREATE POLICY "Approved admins can delete volunteer applications" ON public.volunteer_applications
FOR DELETE USING (is_approved_admin());

-- Update kids work policies
DROP POLICY IF EXISTS "Admins can manage all kids work" ON public.kids_work;
CREATE POLICY "Approved admins can manage all kids work" ON public.kids_work
FOR ALL USING (is_approved_admin());

-- Update child registration requests policies
DROP POLICY IF EXISTS "Admins can manage all registration requests" ON public.child_registration_requests;
CREATE POLICY "Approved admins can manage all registration requests" ON public.child_registration_requests
FOR ALL USING (is_approved_admin());

-- Update parent child relationships policies
DROP POLICY IF EXISTS "Admins can manage all relationships" ON public.parent_child_relationships;
CREATE POLICY "Approved admins can manage all relationships" ON public.parent_child_relationships
FOR ALL USING (is_approved_admin());

-- Update child association requests policies  
DROP POLICY IF EXISTS "Admins can view all requests" ON public.child_association_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON public.child_association_requests;
CREATE POLICY "Approved admins can view all requests" ON public.child_association_requests
FOR SELECT USING (is_approved_admin());
CREATE POLICY "Approved admins can update all requests" ON public.child_association_requests
FOR UPDATE USING (is_approved_admin());

-- Create function to approve/reject users
CREATE OR REPLACE FUNCTION public.update_user_approval_status(
  target_user_id uuid,
  new_status text,
  admin_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only approved admins can update approval status
  IF NOT is_approved_admin() THEN
    RAISE EXCEPTION 'Access denied: Only approved administrators can update user approval status';
  END IF;

  -- Validate status
  IF new_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid approval status. Must be pending, approved, or rejected';
  END IF;

  -- Update the profile
  UPDATE public.profiles 
  SET 
    approval_status = new_status,
    approved_by = CASE WHEN new_status = 'approved' THEN auth.uid() ELSE NULL END,
    approved_at = CASE WHEN new_status = 'approved' THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;
