
-- Create a table for child registration requests
CREATE TABLE public.child_registration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on child registration requests
ALTER TABLE public.child_registration_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for child registration requests
CREATE POLICY "Parents can view their own registration requests" 
  ON public.child_registration_requests 
  FOR SELECT 
  USING (parent_id = auth.uid());

CREATE POLICY "Parents can create registration requests" 
  ON public.child_registration_requests 
  FOR INSERT 
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Admins can manage all registration requests" 
  ON public.child_registration_requests 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to check if child name already exists
CREATE OR REPLACE FUNCTION public.check_child_name_exists(
  first_name_param TEXT,
  last_name_param TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.children 
    WHERE LOWER(first_name) = LOWER(first_name_param) 
    AND LOWER(last_name) = LOWER(last_name_param)
  );
END;
$$;

-- Function to handle approved child registration
CREATE OR REPLACE FUNCTION public.create_child_from_registration(
  registration_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reg_record public.child_registration_requests;
  new_child_id UUID;
BEGIN
  -- Get the registration record
  SELECT * INTO reg_record
  FROM public.child_registration_requests
  WHERE id = registration_id AND status = 'approved';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Registration request not found or not approved';
  END IF;
  
  -- Create the child
  INSERT INTO public.children (
    first_name,
    last_name,
    date_of_birth,
    emergency_contact_name,
    emergency_contact_phone,
    medical_notes
  ) VALUES (
    reg_record.first_name,
    reg_record.last_name,
    reg_record.date_of_birth,
    reg_record.emergency_contact_name,
    reg_record.emergency_contact_phone,
    reg_record.medical_notes
  ) RETURNING id INTO new_child_id;
  
  -- Create parent-child relationship
  INSERT INTO public.parent_child_relationships (
    parent_id,
    child_id,
    relationship_type,
    assigned_by,
    status
  ) VALUES (
    reg_record.parent_id,
    new_child_id,
    'parent',
    reg_record.reviewed_by,
    'approved'
  );
  
  RETURN new_child_id;
END;
$$;
