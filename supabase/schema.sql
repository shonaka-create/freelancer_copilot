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

-- ────────────────────────────────────────────────────────────
-- RLS Policies
-- ────────────────────────────────────────────────────────────

-- user_profiles: 自分のプロフィールのみ読み書き可
CREATE POLICY "Users can manage own profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- applications: 自分の案件のみ
CREATE POLICY "Users can manage own applications" ON public.applications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- clients: 自分のクライアントのみ
CREATE POLICY "Users can manage own clients" ON public.clients
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- projects: 自分のプロジェクトのみ
CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- Trigger: auth.users へのサインアップ時に user_profiles を自動作成
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 既存ユーザーの user_profiles を補完（初回セットアップ時に実行）
-- ────────────────────────────────────────────────────────────
INSERT INTO public.user_profiles (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;
