
-- Drop existing policies on kids_work table
DROP POLICY IF EXISTS "Admins can manage all kids work" ON public.kids_work;
DROP POLICY IF EXISTS "Customers can view their kids work" ON public.kids_work;
DROP POLICY IF EXISTS "Users can view kids work" ON public.kids_work;

-- Add notifications table for kids work uploads
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  related_work_id UUID REFERENCES public.kids_work(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing notification policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

-- Create policy for users to see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for admins to create notifications
CREATE POLICY "Admins can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update kids_work table to better track parent associations
ALTER TABLE public.kids_work 
ADD COLUMN IF NOT EXISTS parent_customer_id UUID REFERENCES auth.users(id);

-- Create function to notify parents when work is uploaded
CREATE OR REPLACE FUNCTION public.notify_parent_on_work_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert notification for the parent when work is uploaded
  IF NEW.parent_customer_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_work_id)
    VALUES (
      NEW.parent_customer_id,
      'New Kids Work Uploaded',
      'New work has been uploaded for ' || COALESCE((
        SELECT child_name FROM enrollments WHERE id = NEW.enrollment_id
      ), 'your child'),
      'kids_work',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for notifications
DROP TRIGGER IF EXISTS on_kids_work_uploaded ON public.kids_work;
CREATE TRIGGER on_kids_work_uploaded
  AFTER INSERT ON public.kids_work
  FOR EACH ROW 
  EXECUTE FUNCTION public.notify_parent_on_work_upload();

-- Enable RLS on kids_work
ALTER TABLE public.kids_work ENABLE ROW LEVEL SECURITY;

-- Allow customers to view work for their children
CREATE POLICY "Customers can view their kids work" 
  ON public.kids_work 
  FOR SELECT 
  USING (
    auth.uid() = parent_customer_id OR
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE id = enrollment_id AND customer_id = auth.uid()
    )
  );

-- Allow admins to manage all kids work
CREATE POLICY "Admins can manage all kids work" 
  ON public.kids_work 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for kids work if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('kids-work', 'kids-work', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Kids work upload access" ON storage.objects;
DROP POLICY IF EXISTS "Kids work read access" ON storage.objects;

-- Allow authenticated users to upload to kids-work bucket
CREATE POLICY "Kids work upload access" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'kids-work' AND 
    auth.role() = 'authenticated'
  );

-- Allow public read access to kids work files
CREATE POLICY "Kids work read access" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'kids-work');
