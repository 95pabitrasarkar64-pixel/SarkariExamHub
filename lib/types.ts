export type UserRole = 'super_admin' | 'org_owner' | 'teacher' | 'student';

export type AppRole = UserRole;

export type ExamCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  org_id: string | null;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export type OrgMembership = {
  id: string;
  org_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
};
