
-- Drop existing conflicting policy
DROP POLICY IF EXISTS "Admins can manage all kids work" ON public.kids_work;

-- Create children table for proper child management
CREATE TABLE public.children (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parent_child_relationships table for flexible family structures
CREATE TABLE public.parent_child_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'parent' CHECK (relationship_type IN ('parent', 'guardian', 'family_member')),
  can_view_work BOOLEAN NOT NULL DEFAULT true,
  can_receive_notifications BOOLEAN NOT NULL DEFAULT true,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Add child_id to enrollments table
ALTER TABLE public.enrollments 
ADD COLUMN child_id UUID REFERENCES public.children(id);

-- Add child_id to kids_work table for direct association
ALTER TABLE public.kids_work 
ADD COLUMN child_id UUID REFERENCES public.children(id);

-- Enable RLS on new tables
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;

-- RLS policies for children table
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

-- RLS policies for parent_child_relationships table
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

-- Update kids_work RLS to include child-based access
DROP POLICY IF EXISTS "Users can view kids work" ON public.kids_work;
CREATE POLICY "Parents can view their children's work" 
  ON public.kids_work 
  FOR SELECT 
  USING (
    -- Direct parent-customer access (existing)
    parent_customer_id = auth.uid() 
    OR 
    -- Access through enrollment relationship (existing)
    EXISTS (
      SELECT 1 FROM public.enrollments e 
      WHERE e.id = kids_work.enrollment_id 
      AND e.customer_id = auth.uid()
    )
    OR
    -- New: Access through child relationship
    EXISTS (
      SELECT 1 FROM public.parent_child_relationships pcr 
      WHERE pcr.child_id = kids_work.child_id 
      AND pcr.parent_id = auth.uid() 
      AND pcr.can_view_work = true
    )
  );

-- Recreate admin policy for kids work
CREATE POLICY "Admins can manage all kids work" 
  ON public.kids_work 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to automatically update child info when enrollments are created
CREATE OR REPLACE FUNCTION public.handle_enrollment_child_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  child_record public.children;
BEGIN
  -- Only process if child_id is not already set and we have child_name
  IF NEW.child_id IS NULL AND NEW.child_name IS NOT NULL AND NEW.child_name != '' THEN
    -- Try to find existing child with same name and parent
    SELECT c.* INTO child_record
    FROM public.children c
    JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
    WHERE c.first_name = NEW.child_name 
    AND pcr.parent_id = NEW.customer_id
    LIMIT 1;
    
    -- If child doesn't exist, create new one
    IF child_record.id IS NULL THEN
      INSERT INTO public.children (first_name, last_name)
      VALUES (NEW.child_name, '')
      RETURNING * INTO child_record;
      
      -- Create parent-child relationship
      INSERT INTO public.parent_child_relationships (parent_id, child_id, assigned_by)
      VALUES (NEW.customer_id, child_record.id, NEW.customer_id);
    END IF;
    
    -- Set the child_id in the enrollment
    NEW.child_id = child_record.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for enrollment child creation
CREATE TRIGGER enrollment_child_creation_trigger
  BEFORE INSERT OR UPDATE ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_enrollment_child_creation();

-- Create function to sync kids_work with child_id when enrollment_id is set
CREATE OR REPLACE FUNCTION public.sync_kids_work_child()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If enrollment_id is set but child_id is not, get child_id from enrollment
  IF NEW.enrollment_id IS NOT NULL AND NEW.child_id IS NULL THEN
    SELECT e.child_id INTO NEW.child_id
    FROM public.enrollments e
    WHERE e.id = NEW.enrollment_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for kids_work child sync
CREATE TRIGGER kids_work_child_sync_trigger
  BEFORE INSERT OR UPDATE ON public.kids_work
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_kids_work_child();
