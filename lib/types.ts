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

// ==========================================
// MODULE 1: MULTILINGUAL QUESTION BANK TYPES
// ==========================================

export type LanguageCode =
  | 'en'
  | 'bn'
  | 'hi'
  | 'as'
  | 'or'
  | 'pa'
  | 'gu'
  | 'mr'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'ur'
  | 'ne'
  | 'sa';

export type TranslationVerificationStatus = 'pending_review' | 'verified' | 'rejected';

export type QuestionTranslation = {
  language_code: LanguageCode;
  question: string;
  options: [string, string, string, string]; // Strict 4-option array
  explanation: string;
  status: TranslationVerificationStatus;
  review_notes?: string;
  verified_by?: string;
  verified_at?: string;
};

export type MultilingualQuestion = {
  id: string;
  source_language: LanguageCode;
  category_slug: string;
  subject: string;
  topic?: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  correct_option: number; // 0 for A, 1 for B, 2 for C, 3 for D
  page_ref?: string;
  translations: Partial<Record<LanguageCode, QuestionTranslation>>;
  created_at: string;
  updated_at: string;
};

// ==========================================
// MODULE 2: ARTICLE & EDITORIAL TYPES
// ==========================================

export type ArticleStatus =
  | 'draft'
  | 'needs_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export type ArticleSourceReference = {
  title: string;
  url: string;
  is_official: boolean;
};

export type ArticleCategoryConfig = {
  slug: string;
  name: string;
  description: string;
  icon?: string;
  badgeColor?: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  category_name: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  featured_image?: string;
  status: ArticleStatus;
  language: LanguageCode;
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
  read_time_minutes: number;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  source_references: ArticleSourceReference[];
  fact_check_status: 'verified' | 'needs_verification' | 'official_gazette_confirmed';
  views_count?: number;
};
