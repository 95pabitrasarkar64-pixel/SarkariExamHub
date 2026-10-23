import { createClient, SupabaseClient, User, Session, AuthChangeEvent } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

export const DEFAULT_SAAS_PLANS = [
  {
    id: '1',
    name: 'Free',
    slug: 'free',
    description: 'Get started with basic teaching tools',
    price_monthly: 0,
    price_annual: 0,
    student_limit: 50,
    storage_mb: 500,
    ai_quota: 50,
    active_exam_limit: 5,
    teacher_seat_limit: 1,
    features: ['Basic dashboard', '50 students', '500 MB storage', '5 active exams', 'Basic AI imports'],
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    name: 'Starter',
    slug: 'starter',
    description: 'Grow with PDF selling and AI question imports',
    price_monthly: 499,
    price_annual: 4990,
    student_limit: 200,
    storage_mb: 2000,
    ai_quota: 500,
    active_exam_limit: 20,
    teacher_seat_limit: 2,
    features: ['Everything in Free', '200 students', '2 GB storage', '20 active exams', 'PDF selling', 'AI question imports', 'Basic reports'],
    is_active: true,
    display_order: 2,
  },
  {
    id: '3',
    name: 'Pro',
    slug: 'pro',
    description: 'Advanced reporting and custom branding',
    price_monthly: 1499,
    price_annual: 14990,
    student_limit: 1000,
    storage_mb: 10000,
    ai_quota: 2000,
    active_exam_limit: 100,
    teacher_seat_limit: 5,
    features: ['Everything in Starter', '1000 students', '10 GB storage', '100 active exams', 'Advanced reports', 'Custom branding', 'Expanded AI usage'],
    is_active: true,
    display_order: 3,
  },
  {
    id: '4',
    name: 'Institute',
    slug: 'institute',
    description: 'Full institute management with multiple teachers',
    price_monthly: 3999,
    price_annual: 39990,
    student_limit: 5000,
    storage_mb: 50000,
    ai_quota: 10000,
    active_exam_limit: 500,
    teacher_seat_limit: 20,
    features: ['Everything in Pro', '5000 students', '50 GB storage', '500 active exams', '20 teacher seats', 'Institute-wide reporting', 'Shared resources'],
    is_active: true,
    display_order: 4,
  },
];

// In-browser mock storage helpers
const STORAGE_KEY_USER = 'sarkari_mock_user';
const STORAGE_KEY_PROFILES = 'sarkari_mock_profiles';

function getStoredMockUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredMockUser(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  } catch {
    // ignore
  }
}

function getStoredProfiles(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredProfile(profile: any) {
  if (typeof window === 'undefined' || !profile?.id) return;
  try {
    const profiles = getStoredProfiles();
    profiles[profile.id] = { ...profiles[profile.id], ...profile };
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch {
    // ignore
  }
}

type AuthCallback = (event: AuthChangeEvent, session: Session | null) => void;
const authListeners = new Set<AuthCallback>();

function notifyAuthListeners(event: AuthChangeEvent, session: Session | null) {
  authListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (err) {
      console.error('Auth listener error:', err);
    }
  });
}

function createMockSupabaseClient() {
  return {
    auth: {
      async getSession() {
        const user = getStoredMockUser();
        const session = user
          ? ({
              access_token: 'mock-token',
              refresh_token: 'mock-refresh',
              expires_in: 3600,
              token_type: 'bearer',
              user,
            } as Session)
          : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange(callback: AuthCallback) {
        authListeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListeners.delete(callback);
              },
            },
          },
        };
      },
      async signInWithPassword({ email }: { email: string; password?: string }) {
        const user: User = {
          id: 'user-' + btoa(email).slice(0, 8),
          app_metadata: {},
          user_metadata: { full_name: email.split('@')[0] },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email,
        };
        setStoredMockUser(user);
        const session: Session = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user,
        };
        notifyAuthListeners('SIGNED_IN', session);
        return { data: { user, session }, error: null };
      },
      async signUp({
        email,
        options,
      }: {
        email: string;
        password?: string;
        options?: { data?: { full_name?: string; role?: string } };
      }) {
        const fullName = options?.data?.full_name || email.split('@')[0];
        const role = options?.data?.role || 'student';
        const user: User = {
          id: 'user-' + btoa(email).slice(0, 8),
          app_metadata: {},
          user_metadata: { full_name: fullName, role },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email,
        };
        setStoredMockUser(user);
        saveStoredProfile({
          id: user.id,
          email,
          full_name: fullName,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        const session: Session = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user,
        };
        notifyAuthListeners('SIGNED_IN', session);
        return { data: { user, session }, error: null };
      },
      async signOut() {
        setStoredMockUser(null);
        notifyAuthListeners('SIGNED_OUT', null);
        return { error: null };
      },
    },
    from(table: string) {
      let currentFilterKey: string | null = null;
      let currentFilterVal: any = null;

      const queryBuilder: any = {
        select: (_cols?: string) => queryBuilder,
        eq: (key: string, val: any) => {
          currentFilterKey = key;
          currentFilterVal = val;
          return queryBuilder;
        },
        order: () => queryBuilder,
        limit: () => queryBuilder,
        then: (onfulfilled: (res: any) => any, onrejected?: (err: any) => any) => {
          let resultData: any = [];
          if (table === 'saas_plans') {
            resultData = DEFAULT_SAAS_PLANS;
          } else if (table === 'profiles') {
            const profiles = getStoredProfiles();
            if (currentFilterKey === 'id' && currentFilterVal) {
              resultData = profiles[currentFilterVal] ? [profiles[currentFilterVal]] : [];
            } else {
              resultData = Object.values(profiles);
            }
          }
          return Promise.resolve({ data: resultData, error: null }).then(onfulfilled, onrejected);
        },
        maybeSingle: async () => {
          if (table === 'profiles') {
            const profiles = getStoredProfiles();
            const profile = currentFilterVal ? profiles[currentFilterVal] : null;
            if (profile) return { data: profile, error: null };
            const user = getStoredMockUser();
            if (user && (!currentFilterVal || currentFilterVal === user.id)) {
              const defaultProfile = {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || 'Student Aspirant',
                role: 'student',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              saveStoredProfile(defaultProfile);
              return { data: defaultProfile, error: null };
            }
            return { data: null, error: null };
          }
          return { data: null, error: null };
        },
        single: async () => {
          const res = await queryBuilder.maybeSingle();
          return res;
        },
        upsert: async (record: any) => {
          if (table === 'profiles' && record?.id) {
            saveStoredProfile(record);
          }
          return { data: record, error: null };
        },
        insert: async (record: any) => {
          if (table === 'profiles' && record?.id) {
            saveStoredProfile(record);
          }
          return { data: record, error: null };
        },
        update: async (record: any) => {
          if (table === 'profiles' && currentFilterKey === 'id') {
            saveStoredProfile({ id: currentFilterVal, ...record });
          }
          return { data: record, error: null };
        },
      };

      return queryBuilder;
    },
  };
}

let realClient: SupabaseClient | null = null;
if (isConfigured) {
  try {
    realClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize real client, falling back to mock:', err);
  }
}

export const supabase = (realClient || createMockSupabaseClient()) as unknown as SupabaseClient;
