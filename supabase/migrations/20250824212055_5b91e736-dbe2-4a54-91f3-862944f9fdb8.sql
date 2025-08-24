
-- Add approval status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN approved_by UUID REFERENCES public.profiles(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to be approved (so current users aren't locked out)
UPDATE public.profiles SET approval_status = 'approved', approved_at = NOW() WHERE approval_status = 'pending';

-- Create RLS policy to prevent unapproved users from accessing admin functions
CREATE POLICY "Only approved users can access admin functions"
ON public.profiles
FOR SELECT
USING (
  approval_status = 'approved' OR 
  id = auth.uid() OR -- Users can always see their own profile
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND approval_status = 'approved'
  )
);

-- Update auth context to check approval status
CREATE OR REPLACE FUNCTION public.is_approved_admin(user_id uuid)
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
