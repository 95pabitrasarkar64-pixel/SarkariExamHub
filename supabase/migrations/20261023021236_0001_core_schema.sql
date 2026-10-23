/*
# SarkariExamHub — Core Schema (Phase 1)

Creates the foundational tables for the SarkariExamHub platform:
- profiles: extends auth.users with role, org_id, and display info
- org_memberships: maps users to organizations with a role (created before organizations policies)
- organizations: multi-tenant workspaces for teachers/institutes
- org_settings: per-organization configuration
- exam_categories: configurable exam categories (ICDS, SSC, Railway, etc.)
- saas_plans: configurable subscription plans for the SaaS billing system
- subscriptions: active subscriptions for organizations
- audit_events: security audit trail

Security:
- RLS enabled on every table.
- profiles: users can read/update only their own profile.
- organizations: members can read their own org; owners can manage.
- org_memberships: members can read memberships in their own org.
- exam_categories: public read (anon + authenticated) so the public site can display them.
- saas_plans: public read so pricing page can display them.
- subscriptions: only org members can read.
- audit_events: no direct client access (service_role only).

Important notes:
- A trigger auto-creates a profile row when a new auth.users record is created.
- The default role for new users is 'student'.
- Super admin must be set manually via SQL by an operator.
*/

-- =========================================================
-- profiles table
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('super_admin','org_owner','teacher','student')),
  org_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- =========================================================
-- organizations table (no FK to org_memberships yet)
-- =========================================================
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON organizations TO authenticated;

-- =========================================================
-- org_memberships table (now organizations exists)
-- =========================================================
CREATE TABLE IF NOT EXISTS org_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'teacher' CHECK (role IN ('org_owner','teacher','student')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_memberships_org ON org_memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_user ON org_memberships(user_id);

ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON org_memberships TO authenticated;

DROP POLICY IF EXISTS "select_memberships_in_own_org" ON org_memberships;
CREATE POLICY "select_memberships_in_own_org"
ON org_memberships FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM org_memberships om2
    WHERE om2.org_id = org_memberships.org_id
    AND om2.user_id = auth.uid()
    AND om2.role IN ('org_owner','teacher')
  )
);

DROP POLICY IF EXISTS "insert_membership_as_owner" ON org_memberships;
CREATE POLICY "insert_membership_as_owner"
ON org_memberships FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM org_memberships om2
    WHERE om2.org_id = org_memberships.org_id
    AND om2.user_id = auth.uid()
    AND om2.role = 'org_owner'
  )
);

DROP POLICY IF EXISTS "delete_membership_as_owner" ON org_memberships;
CREATE POLICY "delete_membership_as_owner"
ON org_memberships FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM org_memberships om2
    WHERE om2.org_id = org_memberships.org_id
    AND om2.user_id = auth.uid()
    AND om2.role = 'org_owner'
  )
);

-- Now add org policies that reference org_memberships
DROP POLICY IF EXISTS "select_org_as_member" ON organizations;
CREATE POLICY "select_org_as_member"
ON organizations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.org_id = organizations.id
    AND org_memberships.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "insert_org_as_owner" ON organizations;
CREATE POLICY "insert_org_as_owner"
ON organizations FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_org_as_member" ON organizations;
CREATE POLICY "update_org_as_member"
ON organizations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.org_id = organizations.id
    AND org_memberships.user_id = auth.uid()
    AND org_memberships.role IN ('org_owner','teacher')
  )
);

-- =========================================================
-- org_settings table
-- =========================================================
CREATE TABLE IF NOT EXISTS org_settings (
  org_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  primary_color text DEFAULT '#1e3a5f',
  accent_color text DEFAULT '#f97316',
  custom_domain text,
  default_language text DEFAULT 'en',
  is_branding_enabled boolean DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON org_settings TO authenticated;

DROP POLICY IF EXISTS "select_own_org_settings" ON org_settings;
CREATE POLICY "select_own_org_settings"
ON org_settings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.org_id = org_settings.org_id
    AND org_memberships.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "modify_own_org_settings" ON org_settings;
CREATE POLICY "modify_own_org_settings"
ON org_settings FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.org_id = org_settings.org_id
    AND org_memberships.user_id = auth.uid()
    AND org_memberships.role IN ('org_owner','teacher')
  )
);

DROP POLICY IF EXISTS "update_own_org_settings" ON org_settings;
CREATE POLICY "update_own_org_settings"
ON org_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.org_id = org_settings.org_id
    AND org_memberships.user_id = auth.uid()
    AND org_memberships.role IN ('org_owner','teacher')
  )
);

-- =========================================================
-- exam_categories table
-- =========================================================
CREATE TABLE IF NOT EXISTS exam_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exam_categories_active ON exam_categories(is_active, display_order);

ALTER TABLE exam_categories ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON exam_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON exam_categories TO authenticated;

DROP POLICY IF EXISTS "public_read_exam_categories" ON exam_categories;
CREATE POLICY "public_read_exam_categories"
ON exam_categories FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "manage_exam_categories_admin" ON exam_categories;
CREATE POLICY "manage_exam_categories_admin"
ON exam_categories FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

DROP POLICY IF EXISTS "update_exam_categories_admin" ON exam_categories;
CREATE POLICY "update_exam_categories_admin"
ON exam_categories FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

DROP POLICY IF EXISTS "delete_exam_categories_admin" ON exam_categories;
CREATE POLICY "delete_exam_categories_admin"
ON exam_categories FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

-- =========================================================
-- saas_plans table
-- =========================================================
CREATE TABLE IF NOT EXISTS saas_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price_monthly numeric(10,2) NOT NULL DEFAULT 0,
  price_annual numeric(10,2) NOT NULL DEFAULT 0,
  student_limit int,
  storage_mb int,
  ai_quota int,
  active_exam_limit int,
  teacher_seat_limit int DEFAULT 1,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saas_plans ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON saas_plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON saas_plans TO authenticated;

DROP POLICY IF EXISTS "public_read_saas_plans" ON saas_plans;
CREATE POLICY "public_read_saas_plans"
ON saas_plans FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "manage_plans_admin" ON saas_plans;
CREATE POLICY "manage_plans_admin"
ON saas_plans FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

DROP POLICY IF EXISTS "update_plans_admin" ON saas_plans;
CREATE POLICY "update_plans_admin"
ON saas_plans FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

DROP POLICY IF EXISTS "delete_plans_admin" ON saas_plans;
CREATE POLICY "delete_plans_admin"
ON saas_plans FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
);

-- =========================================================
-- subscriptions table
-- =========================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES saas_plans(id),
  status text NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing','active','past_due','canceled','expired')),
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','annual')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(org_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON subscriptions TO authenticated;

DROP POLICY IF EXISTS "read_own_subscriptions" ON subscriptions;
CREATE POLICY "read_own_subscriptions"
ON subscriptions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM org_memberships
    WHERE org_memberships.org_id = subscriptions.org_id
    AND org_memberships.user_id = auth.uid()
  )
);

-- =========================================================
-- audit_events table (service role only — no client grants)
-- =========================================================
CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- Trigger: auto-create profile on auth.users insert
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'student',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;

-- =========================================================
-- Seed exam categories
-- =========================================================
INSERT INTO exam_categories (slug, name, description, icon, display_order, is_active)
VALUES
  ('icds-anganwadi', 'ICDS & Anganwadi', 'ICDS and Anganwadi recruitment examinations', 'baby', 1, true),
  ('panchayat', 'Panchayat', 'Panchayat and rural development recruitment examinations', 'landmark', 2, true),
  ('clerkship', 'Clerkship', 'Clerk-grade and clerical recruitment examinations', 'filetext', 3, true),
  ('state-psc', 'State PSC', 'State Public Service Commission examinations including WBCS', 'building', 4, true),
  ('ssc', 'SSC', 'SSC CGL, CHSL, MTS, GD and other SSC examinations', 'briefcase', 5, true),
  ('railway', 'Railway', 'Railway recruitment examinations (RRB, RRC)', 'train', 6, true),
  ('banking', 'Banking', 'Banking examinations (IBPS, SBI, RBI)', 'banknote', 7, true),
  ('police-constable', 'Police & Constable', 'Police and constable recruitment examinations', 'shield', 8, true),
  ('group-c-d', 'Group C & D', 'Group C and Group D government recruitment examinations', 'users', 9, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- =========================================================
-- Seed SaaS plans
-- =========================================================
INSERT INTO saas_plans (name, slug, description, price_monthly, price_annual, student_limit, storage_mb, ai_quota, active_exam_limit, teacher_seat_limit, features, is_active, display_order)
VALUES
  ('Free', 'free', 'Get started with basic teaching tools', 0, 0, 50, 500, 50, 5, 1, '["Basic dashboard","50 students","500 MB storage","5 active exams","Basic AI imports"]'::jsonb, true, 1),
  ('Starter', 'starter', 'Grow with PDF selling and AI question imports', 499, 4990, 200, 2000, 500, 20, 2, '["Everything in Free","200 students","2 GB storage","20 active exams","PDF selling","AI question imports","Basic reports"]'::jsonb, true, 2),
  ('Pro', 'pro', 'Advanced reporting and custom branding', 1499, 14990, 1000, 10000, 2000, 100, 5, '["Everything in Starter","1000 students","10 GB storage","100 active exams","Advanced reports","Custom branding","Expanded AI usage"]'::jsonb, true, 3),
  ('Institute', 'institute', 'Full institute management with multiple teachers', 3999, 39990, 5000, 50000, 10000, 500, 20, '["Everything in Pro","5000 students","50 GB storage","500 active exams","20 teacher seats","Institute-wide reporting","Shared resources"]'::jsonb, true, 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_annual = EXCLUDED.price_annual,
  student_limit = EXCLUDED.student_limit,
  storage_mb = EXCLUDED.storage_mb,
  ai_quota = EXCLUDED.ai_quota,
  active_exam_limit = EXCLUDED.active_exam_limit,
  teacher_seat_limit = EXCLUDED.teacher_seat_limit,
  features = EXCLUDED.features,
  updated_at = now();