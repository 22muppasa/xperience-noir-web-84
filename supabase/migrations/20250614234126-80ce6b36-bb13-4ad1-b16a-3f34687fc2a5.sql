
-- Check and create storage buckets only if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'kids-work', 'kids-work', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'video/quicktime']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'kids-work');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'program-images', 'program-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'program-images');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'social-posts', 'social-posts', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'social-posts');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');

-- Create RLS policies for kids-work bucket (drop if exists first)
DROP POLICY IF EXISTS "Users can view kids work files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload kids work files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own kids work files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own kids work files" ON storage.objects;

CREATE POLICY "Users can view kids work files" ON storage.objects
FOR SELECT USING (bucket_id = 'kids-work');

CREATE POLICY "Authenticated users can upload kids work files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'kids-work' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own kids work files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'kids-work' AND 
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own kids work files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'kids-work' AND 
  auth.uid() = owner
);

-- Create RLS policies for program-images bucket
DROP POLICY IF EXISTS "Anyone can view program images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload program images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update program images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete program images" ON storage.objects;

CREATE POLICY "Anyone can view program images" ON storage.objects
FOR SELECT USING (bucket_id = 'program-images');

CREATE POLICY "Admins can upload program images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'program-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update program images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'program-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete program images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'program-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create RLS policies for social-posts bucket
DROP POLICY IF EXISTS "Anyone can view social post images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload social post images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update social post images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete social post images" ON storage.objects;

CREATE POLICY "Anyone can view social post images" ON storage.objects
FOR SELECT USING (bucket_id = 'social-posts');

CREATE POLICY "Admins can upload social post images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'social-posts' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update social post images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'social-posts' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete social post images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'social-posts' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create RLS policies for avatars bucket
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid() = owner
);

-- Add file management columns to existing tables
ALTER TABLE kids_work 
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS storage_path TEXT;

ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS storage_path TEXT;

ALTER TABLE social_posts 
ADD COLUMN IF NOT EXISTS storage_path TEXT;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Create file uploads tracking table
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  bucket_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on file_uploads
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for file_uploads
DROP POLICY IF EXISTS "Users can view their own uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can create their own uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can update their own uploads" ON file_uploads;
DROP POLICY IF EXISTS "Admins can view all uploads" ON file_uploads;

CREATE POLICY "Users can view their own uploads" ON file_uploads
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads" ON file_uploads
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" ON file_uploads
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all uploads" ON file_uploads
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
