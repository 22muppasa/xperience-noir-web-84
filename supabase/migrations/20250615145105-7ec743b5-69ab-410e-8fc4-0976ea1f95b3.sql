
-- Create RLS policies with IF NOT EXISTS checks

-- Programs table policies
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published programs" ON public.programs;
CREATE POLICY "Anyone can view published programs" 
  ON public.programs 
  FOR SELECT 
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage all programs" ON public.programs;
CREATE POLICY "Admins can manage all programs" 
  ON public.programs 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Enrollments table policies  
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
CREATE POLICY "Users can view their own enrollments" 
  ON public.enrollments 
  FOR SELECT 
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.enrollments;
CREATE POLICY "Users can create their own enrollments" 
  ON public.enrollments 
  FOR INSERT 
  WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
CREATE POLICY "Admins can view all enrollments" 
  ON public.enrollments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can update all enrollments" ON public.enrollments;
CREATE POLICY "Admins can update all enrollments" 
  ON public.enrollments 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Messages table policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "Recipients can update message status" ON public.messages;
CREATE POLICY "Recipients can update message status" 
  ON public.messages 
  FOR UPDATE 
  USING (recipient_id = auth.uid());

-- Kids work table policies
ALTER TABLE public.kids_work ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their kids work" ON public.kids_work;
CREATE POLICY "Parents can view their kids work" 
  ON public.kids_work 
  FOR SELECT 
  USING (parent_customer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all kids work" ON public.kids_work;
CREATE POLICY "Admins can manage all kids work" 
  ON public.kids_work 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Notifications table policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Add foreign keys only if they don't exist
DO $$
BEGIN
  -- Check and add enrollments customer_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'enrollments_customer_id_fkey'
  ) THEN
    ALTER TABLE public.enrollments 
    ADD CONSTRAINT enrollments_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES public.profiles(id);
  END IF;

  -- Check and add enrollments program_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'enrollments_program_id_fkey'
  ) THEN
    ALTER TABLE public.enrollments 
    ADD CONSTRAINT enrollments_program_id_fkey 
    FOREIGN KEY (program_id) REFERENCES public.programs(id);
  END IF;

  -- Check and add kids_work parent_customer_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'kids_work_parent_customer_id_fkey'
  ) THEN
    ALTER TABLE public.kids_work 
    ADD CONSTRAINT kids_work_parent_customer_id_fkey 
    FOREIGN KEY (parent_customer_id) REFERENCES public.profiles(id);
  END IF;

  -- Check and add messages sender_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_sender_id_fkey'
  ) THEN
    ALTER TABLE public.messages 
    ADD CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES public.profiles(id);
  END IF;

  -- Check and add messages recipient_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_recipient_id_fkey'
  ) THEN
    ALTER TABLE public.messages 
    ADD CONSTRAINT messages_recipient_id_fkey 
    FOREIGN KEY (recipient_id) REFERENCES public.profiles(id);
  END IF;
END $$;

-- Create trigger function and trigger
CREATE OR REPLACE FUNCTION public.set_enrollment_customer_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.customer_id = auth.uid();
  NEW.enrolled_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_enrollment_customer_id_trigger ON public.enrollments;
CREATE TRIGGER set_enrollment_customer_id_trigger
  BEFORE INSERT ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_enrollment_customer_id();

-- Create function to get admin profiles
CREATE OR REPLACE FUNCTION public.get_admin_profiles()
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  email text
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.first_name, p.last_name, p.email
  FROM public.profiles p
  WHERE p.role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
