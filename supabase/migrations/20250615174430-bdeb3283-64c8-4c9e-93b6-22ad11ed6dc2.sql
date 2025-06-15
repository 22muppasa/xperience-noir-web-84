
-- Add notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('kids_work', 'enrollment', 'messages', 'system')),
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  digest_frequency TEXT NOT NULL DEFAULT 'immediate' CHECK (digest_frequency IN ('immediate', 'daily', 'weekly', 'disabled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Add work collections table for organizing kids work
CREATE TABLE public.work_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add junction table for work collection items
CREATE TABLE public.work_collection_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.work_collections(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES public.kids_work(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, work_id)
);

-- Add tags table for better work organization
CREATE TABLE public.work_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add junction table for work tags
CREATE TABLE public.kids_work_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id UUID NOT NULL REFERENCES public.kids_work(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.work_tags(id) ON DELETE CASCADE,
  UNIQUE(work_id, tag_id)
);

-- Add child milestones table for progress tracking
CREATE TABLE public.child_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('academic', 'creative', 'social', 'physical', 'emotional')),
  achieved_date DATE NOT NULL,
  notes TEXT,
  recorded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add additional emergency contacts table
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  can_pickup BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add audit log table for tracking changes
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_work_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_preferences
CREATE POLICY "Users can manage their own notification preferences"
  ON public.notification_preferences
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS policies for work_collections
CREATE POLICY "Users can view collections for their children"
  ON public.work_collections
  FOR SELECT
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.parent_child_relationships pcr
      WHERE pcr.parent_id = auth.uid() AND pcr.child_id = work_collections.child_id
    )
  );

CREATE POLICY "Users can create collections for their children"
  ON public.work_collections
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.parent_child_relationships pcr
      WHERE pcr.parent_id = auth.uid() AND pcr.child_id = work_collections.child_id
    )
  );

CREATE POLICY "Users can update their own collections"
  ON public.work_collections
  FOR UPDATE
  USING (auth.uid() = created_by);

-- RLS policies for work_collection_items
CREATE POLICY "Users can view collection items for accessible collections"
  ON public.work_collection_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.work_collections wc
      WHERE wc.id = work_collection_items.collection_id
      AND (
        wc.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.parent_child_relationships pcr
          WHERE pcr.parent_id = auth.uid() AND pcr.child_id = wc.child_id
        )
      )
    )
  );

-- RLS policies for work_tags (publicly readable, admin manageable)
CREATE POLICY "Anyone can view work tags"
  ON public.work_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage work tags"
  ON public.work_tags
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS policies for kids_work_tags
CREATE POLICY "Users can view tags for accessible work"
  ON public.kids_work_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.kids_work kw
      WHERE kw.id = kids_work_tags.work_id
      AND (
        kw.parent_customer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.parent_child_relationships pcr
          WHERE pcr.parent_id = auth.uid() AND pcr.child_id = kw.child_id AND pcr.can_view_work = true
        )
      )
    )
  );

-- RLS policies for child_milestones
CREATE POLICY "Users can view milestones for their children"
  ON public.child_milestones
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_relationships pcr
      WHERE pcr.parent_id = auth.uid() AND pcr.child_id = child_milestones.child_id
    ) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can add milestones for their children"
  ON public.child_milestones
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.parent_child_relationships pcr
      WHERE pcr.parent_id = auth.uid() AND pcr.child_id = child_milestones.child_id
    ) OR
    public.is_admin(auth.uid())
  );

-- RLS policies for emergency_contacts
CREATE POLICY "Users can manage emergency contacts for their children"
  ON public.emergency_contacts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_child_relationships pcr
      WHERE pcr.parent_id = auth.uid() AND pcr.child_id = emergency_contacts.child_id
    ) OR
    public.is_admin(auth.uid())
  );

-- RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (table_name, record_id, action, old_values, new_values, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers for sensitive tables
CREATE TRIGGER audit_parent_child_relationships
  AFTER INSERT OR UPDATE OR DELETE ON public.parent_child_relationships
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_children
  AFTER INSERT OR UPDATE OR DELETE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Create function for real-time work notifications
CREATE OR REPLACE FUNCTION public.notify_work_upload_realtime()
RETURNS TRIGGER AS $$
BEGIN
  -- Send real-time notification via pg_notify
  PERFORM pg_notify(
    'work_uploaded',
    json_build_object(
      'work_id', NEW.id,
      'child_id', NEW.child_id,
      'parent_id', NEW.parent_customer_id,
      'title', NEW.title
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for real-time notifications
CREATE TRIGGER notify_work_upload_realtime_trigger
  AFTER INSERT ON public.kids_work
  FOR EACH ROW EXECUTE FUNCTION public.notify_work_upload_realtime();

-- Insert default notification preferences for existing users
INSERT INTO public.notification_preferences (user_id, notification_type)
SELECT DISTINCT p.id, unnest(ARRAY['kids_work', 'enrollment', 'messages', 'system'])
FROM public.profiles p
ON CONFLICT (user_id, notification_type) DO NOTHING;

-- Insert some default work tags
INSERT INTO public.work_tags (name, color) VALUES
  ('Art', '#F59E0B'),
  ('Music', '#8B5CF6'),
  ('Reading', '#10B981'),
  ('Math', '#3B82F6'),
  ('Science', '#06B6D4'),
  ('Creative Writing', '#F97316'),
  ('Drama', '#EC4899'),
  ('Sports', '#84CC16')
ON CONFLICT (name) DO NOTHING;
