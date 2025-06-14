
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'customer');

-- Create enum for program status
CREATE TYPE public.program_status AS ENUM ('draft', 'published', 'archived');

-- Create enum for enrollment status
CREATE TYPE public.enrollment_status AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- Create enum for message status
CREATE TYPE public.message_status AS ENUM ('unread', 'read', 'archived');

-- Create enum for post status
CREATE TYPE public.post_status AS ENUM ('draft', 'scheduled', 'published');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programs table (for camps/bootcamps)
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  price DECIMAL(10,2),
  max_participants INTEGER,
  start_date DATE,
  end_date DATE,
  status program_status DEFAULT 'draft',
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  child_age INTEGER,
  status enrollment_status DEFAULT 'pending',
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(customer_id, program_id, child_name)
);

-- Create kids_work table
CREATE TABLE public.kids_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_posts table
CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status post_status DEFAULT 'draft',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status message_status DEFAULT 'unread',
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status message_status DEFAULT 'unread',
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert their profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for programs
CREATE POLICY "Anyone can view published programs" ON public.programs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage programs" ON public.programs
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for enrollments
CREATE POLICY "Customers can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create their own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own enrollments" ON public.enrollments
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all enrollments" ON public.enrollments
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all enrollments" ON public.enrollments
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for kids_work
CREATE POLICY "Customers can view work for their enrollments" ON public.kids_work
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE id = kids_work.enrollment_id AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all kids work" ON public.kids_work
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for social_posts
CREATE POLICY "Anyone can view published posts" ON public.social_posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Admins can manage social posts" ON public.social_posts
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update message status" ON public.messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS Policies for contact_submissions
CREATE POLICY "Admins can view all contact submissions" ON public.contact_submissions
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('kids-work', 'kids-work', true),
  ('social-posts', 'social-posts', true),
  ('projects', 'projects', true),
  ('attachments', 'attachments', false);

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for kids-work bucket
CREATE POLICY "Kids work images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'kids-work');

CREATE POLICY "Admins can upload kids work" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'kids-work' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage kids work" ON storage.objects
  FOR ALL USING (bucket_id = 'kids-work' AND public.is_admin(auth.uid()));

-- Storage policies for social-posts bucket
CREATE POLICY "Social post images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'social-posts');

CREATE POLICY "Admins can manage social post images" ON storage.objects
  FOR ALL USING (bucket_id = 'social-posts' AND public.is_admin(auth.uid()));

-- Storage policies for projects bucket
CREATE POLICY "Project images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "Admins can manage project images" ON storage.objects
  FOR ALL USING (bucket_id = 'projects' AND public.is_admin(auth.uid()));

-- Storage policies for attachments bucket (private)
CREATE POLICY "Users can view attachments in their messages" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attachments' AND
    EXISTS (
      SELECT 1 FROM public.messages 
      WHERE attachment_url LIKE '%' || name || '%' 
      AND (sender_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can upload attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated');
