
-- Fix RLS policies for children table
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Parents can view their children" ON public.children;
DROP POLICY IF EXISTS "Admins can view all children" ON public.children;

-- Create proper RLS policies for children table
CREATE POLICY "Parents can view their children" 
  ON public.children 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_relationships pcr 
      WHERE pcr.child_id = children.id 
      AND pcr.parent_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all children" 
  ON public.children 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow public read access for child search functionality
CREATE POLICY "Public can search children for association requests" 
  ON public.children 
  FOR SELECT 
  USING (true);

-- Fix RLS policies for parent_child_relationships table
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own relationships" ON public.parent_child_relationships;
DROP POLICY IF EXISTS "Admins can manage all relationships" ON public.parent_child_relationships;
DROP POLICY IF EXISTS "Parents can request relationships" ON public.parent_child_relationships;

-- Create proper RLS policies for parent_child_relationships table
CREATE POLICY "Users can view their own relationships" 
  ON public.parent_child_relationships 
  FOR SELECT 
  USING (parent_id = auth.uid());

CREATE POLICY "Admins can manage all relationships" 
  ON public.parent_child_relationships 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Parents can request relationships" 
  ON public.parent_child_relationships 
  FOR INSERT 
  WITH CHECK (parent_id = auth.uid());

-- Add a status column to track approval workflow
ALTER TABLE public.parent_child_relationships 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing relationships to approved status
UPDATE public.parent_child_relationships 
SET status = 'approved' 
WHERE status IS NULL OR status = 'pending';

-- Create function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create notifications table for approval workflow if it doesn't exist
CREATE TABLE IF NOT EXISTS public.child_association_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  UNIQUE(parent_id, child_id)
);

-- Enable RLS on requests table
ALTER TABLE public.child_association_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for requests table
CREATE POLICY "Users can view their own requests" 
  ON public.child_association_requests 
  FOR SELECT 
  USING (parent_id = auth.uid());

CREATE POLICY "Users can create their own requests" 
  ON public.child_association_requests 
  FOR INSERT 
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Admins can view all requests" 
  ON public.child_association_requests 
  FOR SELECT 
  USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all requests" 
  ON public.child_association_requests 
  FOR UPDATE 
  USING (public.get_current_user_role() = 'admin');
