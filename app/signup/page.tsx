'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Loader2, Mail, Lock, User, Briefcase, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import { toast } from 'sonner';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const { signUp } = useAuth();
  const [role, setRole] = useState<UserRole>(
    initialRoleParam === 'admin'
      ? 'super_admin'
      : initialRoleParam === 'teacher'
      ? 'teacher'
      : 'student'
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRoleParam === 'admin') {
      setRole('super_admin');
    } else if (initialRoleParam === 'teacher') {
      setRole('teacher');
    }
  }, [initialRoleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(
      role === 'super_admin'
        ? 'Platform Administrator account created!'
        : role === 'teacher'
        ? 'Teacher account created! Welcome to your Educator Portal.'
        : 'Student account created! Welcome to SarkariExamHub.'
    );

    if (role === 'super_admin') {
      router.push('/admin');
    } else if (role === 'teacher') {
      router.push('/teacher');
    } else {
      router.push('/student');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-primary">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === 'super_admin'
              ? 'Full platform management, publishing studio, & multi-tenant controls'
              : role === 'teacher'
              ? 'Publish question banks, tests, and study materials'
              : 'Start preparing for government exams today'}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {/* Role Toggle Selector */}
          <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-lg bg-secondary/50 p-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center justify-center gap-1 rounded-md py-2 text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex items-center justify-center gap-1 rounded-md py-2 text-xs font-semibold transition-all ${
                role === 'teacher'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 shrink-0" /> Educator
            </button>
            <button
              type="button"
              onClick={() => setRole('super_admin')}
              className={`flex items-center justify-center gap-1 rounded-md py-2 text-xs font-semibold transition-all ${
                role === 'super_admin'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder={role === 'teacher' ? 'Prof. Animesh Sen' : 'e.g. Rahul Sharma'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : role === 'teacher' ? (
                'Register as Teacher'
              ) : (
                'Sign Up as Student'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}