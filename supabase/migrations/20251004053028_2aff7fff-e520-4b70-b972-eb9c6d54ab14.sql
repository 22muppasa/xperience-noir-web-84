-- Create a function to handle complete user deletion (profiles and related data)
-- The auth.users deletion will be handled by the edge function
CREATE OR REPLACE FUNCTION delete_user_complete(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only approved admins can delete users
  IF NOT is_approved_admin() THEN
    RAISE EXCEPTION 'Access denied: Only approved administrators can delete users';
  END IF;

  -- Prevent self-deletion
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  -- Delete from profiles table (this will cascade to related tables due to foreign keys)
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  -- Note: The actual auth.users deletion will be handled by the edge function
  -- using the Supabase Admin API since we can't delete from auth.users directly
END;
$$;