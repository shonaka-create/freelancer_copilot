-- AssetFreelance Supabase Database Schema

-- users: Auth is handled by Supabase Auth, but this extends profile data
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  tagline TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- clients: Information about the companies/individuals the freelancer works with
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  platform TEXT, -- 'CrowdWorks', 'Lancers', 'Direct', 'X', etc.
  score INTEGER DEFAULT 0, -- Customer scoring (0-100)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- applications: Track freelance applications
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'pending', 'negotiating', 'won', 'lost'
  proposal_text TEXT,
  applied_at TIMESTAMPTZ,
  lost_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- projects: Won applications become projects
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  price NUMERIC,
  deadline_at TIMESTAMPTZ,
  upsell_alert_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- milestones: specific deliverables or follow-ups for a project
CREATE TABLE public.milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed'
  type TEXT DEFAULT 'delivery', -- 'delivery', 'follow-up', 'upsell'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security) Policies Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Note: Policies need to be created for each table so users can only access their own data.
-- Example for clients:
-- CREATE POLICY "Users can manage their own clients" ON public.clients
--   FOR ALL USING (auth.uid() = user_id);
