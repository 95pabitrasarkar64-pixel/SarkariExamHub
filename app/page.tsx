'use client';

import Link from 'next/link';
import {
  GraduationCap,
  Brain,
  FileText,
  Timer,
  BookOpen,
  TrendingUp,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  Building2,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { examCategoryInfo, examCategorySlugs } from '@/lib/navigation';

export default function HomePage() {
  const examCategories = examCategorySlugs.map((slug) => ({
    slug,
    ...examCategoryInfo[slug],
  }));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.08),transparent_50%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur animate-fade-in">
              <Sparkles className="h-4 w-4 text-accent" />
              AI-Powered Question Importer Now Available
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl animate-slide-up">
              All Government Exams.
              <br />
              <span className="text-accent">One Destination.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-lg animate-slide-up">
              Prepare for government recruitment examinations with organized study materials,
              AI-assisted question banks, chapter-wise practice, and online mock tests&mdash;all
              in one platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/exams">
                  Explore Exams
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/mock-tests">Take a Mock Test</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/materials">Browse Study Materials</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/70 animate-fade-in">
              <Link href="/signup" className="inline-flex items-center gap-1 hover:text-white">
                <GraduationCap className="h-4 w-4" /> Start Practising
              </Link>
              <span>|</span>
              <Link href="/for-teachers" className="inline-flex items-center gap-1 hover:text-white">
                <Users className="h-4 w-4" /> Register as a Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories */}
      <section className="border-b border-border bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary md:text-3xl">Exam Categories</h2>
            <p className="mt-2 text-muted-foreground">
              Find preparation resources for your target examination
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examCategories.map((cat, idx) => (
              <Link key={cat.slug} href={`/exams?category=${cat.slug}`}>
                <Card
                  className="group h-full cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-lg animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-primary">
                          {cat.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-muted-foreground">
                          {cat.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/categories">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-secondary/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary md:text-3xl">
              Everything you need to prepare
            </h2>
            <p className="mt-2 text-muted-foreground">
              A complete toolkit for students, teachers, and coaching institutes
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="AI Question Importer"
              description="Upload PDFs and automatically extract MCQs with options, correct answers, and explanations using AI."
              href="/ai-importer"
            />
            <FeatureCard
              icon={FileText}
              title="PDF Library"
              description="Access organized study materials and PDFs with a secure, watermarked document viewer."
              href="/pdf-library"
            />
            <FeatureCard
              icon={Timer}
              title="Online Mock Tests"
              description="Take timed examinations with instant scoring, detailed explanations, and performance analytics."
              href="/mock-tests"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Test Series"
              description="Enroll in structured test series covering chapter-wise practice and full-length mock exams."
              href="/test-series"
            />
            <FeatureCard
              icon={Search}
              title="Search & Filter"
              description="Find resources by exam, subject, topic, language, and content type with powerful filtering."
              href="/exams"
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="Row-level security, server-side access control, and protected content delivery."
              href="/about"
            />
          </div>
        </div>
      </section>

      {/* For Teachers & Institutes */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="overflow-hidden border-primary/20">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">For Teachers</CardTitle>
                    <CardDescription>Build and grow your teaching business</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {[
                  'Upload and sell PDFs, courses, and test series',
                  'AI-powered question extraction from PDFs',
                  'Create timed mock tests with negative marking',
                  'Track student progress and results',
                  'Manage your own student roster',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
                <Button asChild className="mt-4 w-full">
                  <Link href="/for-teachers">Start Teaching</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-accent/20">
              <CardHeader className="bg-accent/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">For Coaching Institutes</CardTitle>
                    <CardDescription>Manage your entire institute on one platform</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {[
                  'Multiple teacher accounts with shared resources',
                  'Institute-wide reporting and analytics',
                  'Custom branding and white-label options',
                  'Bulk student management and enrollment',
                  'Subscription-based access with flexible plans',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
                <Button asChild className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/for-institutes">Explore Institute Plans</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary md:text-3xl">How it works</h2>
            <p className="mt-2 text-muted-foreground">Get started in three simple steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              icon={GraduationCap}
              title="Create your account"
              description="Sign up as a student to access study materials, or as a teacher to build your teaching business."
            />
            <StepCard
              number="2"
              icon={BookOpen}
              title="Explore & enroll"
              description="Browse exam categories, find study materials, enroll in test series, or create your own content."
            />
            <StepCard
              number="3"
              icon={Award}
              title="Practice & track"
              description="Take mock tests, review explanations, track your progress, and improve your scores over time."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-16 text-white md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to start your preparation?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Join SarkariExamHub today and take the first step toward your government career.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group h-full cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mb-2 font-semibold text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: typeof GraduationCap;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
        <Icon className="h-7 w-7" />
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
        {number}
      </div>
      <h3 className="mb-2 font-semibold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}