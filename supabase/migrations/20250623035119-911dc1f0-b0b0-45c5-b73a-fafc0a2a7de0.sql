
-- Create enum for portfolio project status
CREATE TYPE portfolio_status AS ENUM ('draft', 'published', 'archived');

-- Create portfolio_projects table
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  project_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  duration TEXT,
  team_size TEXT,
  status portfolio_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio_projects
CREATE POLICY "Admins can do everything with portfolio projects"
  ON public.portfolio_projects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for public to read published projects (for consulting page)
CREATE POLICY "Anyone can view published portfolio projects"
  ON public.portfolio_projects
  FOR SELECT
  USING (status = 'published');

-- Create trigger to update updated_at column
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_portfolio_projects_status_sort ON public.portfolio_projects(status, sort_order);
CREATE INDEX idx_portfolio_projects_created_by ON public.portfolio_projects(created_by);
