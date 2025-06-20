
-- Create admin_settings table to store application configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy that only allows admins to access admin settings
CREATE POLICY "Only admins can access admin settings" 
  ON public.admin_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at 
  BEFORE UPDATE ON public.admin_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create linkedin_posts_cache table to cache LinkedIn posts for performance
CREATE TABLE public.linkedin_posts_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  linkedin_post_id TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  linkedin_url TEXT NOT NULL,
  last_synced TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security for linkedin_posts_cache
ALTER TABLE public.linkedin_posts_cache ENABLE ROW LEVEL SECURITY;

-- Create policy that allows public read access to cached LinkedIn posts
CREATE POLICY "Public can view cached LinkedIn posts" 
  ON public.linkedin_posts_cache 
  FOR SELECT 
  USING (true);

-- Create policy that only allows admins to modify cached LinkedIn posts
CREATE POLICY "Only admins can modify cached LinkedIn posts" 
  ON public.linkedin_posts_cache 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
