
-- Insert the external_programs setting into the admin_settings table if it doesn't exist
INSERT INTO public.admin_settings (setting_key, setting_value, description)
VALUES (
  'external_programs',
  '{"enabled": false, "link": "", "description": ""}',
  'External program link configuration'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Create RLS policy to ensure only admins can access admin settings (if not already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_settings' 
    AND policyname = 'Only admins can manage admin settings'
  ) THEN
    CREATE POLICY "Only admins can manage admin settings"
      ON public.admin_settings
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'admin'::user_role
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'admin'::user_role
        )
      );
  END IF;
END $$;
