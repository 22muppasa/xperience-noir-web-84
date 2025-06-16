
-- Update kids_work table to support Google Drive links
ALTER TABLE public.kids_work 
ADD COLUMN google_drive_link TEXT,
ADD COLUMN google_drive_file_id TEXT,
ADD COLUMN link_status TEXT DEFAULT 'active';

-- Create function to check enrollment limits
CREATE OR REPLACE FUNCTION public.check_enrollment_capacity(program_id_param UUID)
RETURNS TABLE(
  current_count INTEGER,
  max_participants INTEGER,
  is_full BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(COUNT(e.id)::INTEGER, 0) as current_count,
    COALESCE(p.max_participants, 0) as max_participants,
    CASE 
      WHEN p.max_participants IS NULL THEN FALSE
      WHEN COUNT(e.id) >= p.max_participants THEN TRUE
      ELSE FALSE
    END as is_full
  FROM public.programs p
  LEFT JOIN public.enrollments e ON p.id = e.program_id AND e.status != 'cancelled'
  WHERE p.id = program_id_param
  GROUP BY p.id, p.max_participants;
END;
$$;

-- Create function to get enrollment capacity info for multiple programs
CREATE OR REPLACE FUNCTION public.get_programs_with_capacity()
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  price NUMERIC,
  duration TEXT,
  start_date DATE,
  end_date DATE,
  max_participants INTEGER,
  image_url TEXT,
  status program_status,
  current_enrollments INTEGER,
  is_full BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.duration,
    p.start_date,
    p.end_date,
    p.max_participants,
    p.image_url,
    p.status,
    COALESCE(COUNT(e.id)::INTEGER, 0) as current_enrollments,
    CASE 
      WHEN p.max_participants IS NULL THEN FALSE
      WHEN COUNT(e.id) >= p.max_participants THEN TRUE
      ELSE FALSE
    END as is_full
  FROM public.programs p
  LEFT JOIN public.enrollments e ON p.id = e.program_id AND e.status != 'cancelled'
  GROUP BY p.id, p.title, p.description, p.price, p.duration, p.start_date, p.end_date, p.max_participants, p.image_url, p.status
  ORDER BY p.start_date ASC;
END;
$$;
