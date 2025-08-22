
-- Add a new RLS policy to allow public read access to specific non-sensitive settings
CREATE POLICY "Public can view external programs setting" 
ON public.admin_settings 
FOR SELECT 
USING (setting_key = 'external_programs');
