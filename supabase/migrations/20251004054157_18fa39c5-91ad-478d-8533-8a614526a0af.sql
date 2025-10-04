-- Update delete_user_complete to accept the admin user ID for verification
CREATE OR REPLACE FUNCTION delete_user_complete(
  target_user_id uuid,
  admin_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the admin_user_id is an approved admin
  IF NOT is_approved_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Access denied: Only approved administrators can delete users';
  END IF;

  -- Prevent self-deletion
  IF target_user_id = admin_user_id THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  -- Delete from profiles table (this will cascade to related tables due to foreign keys)
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  -- Note: The actual auth.users deletion will be handled by the edge function
  -- using the Supabase Admin API since we can't delete from auth.users directly
END;
$$;