import { Users, Brain, FileText, Timer, TrendingUp, DollarSign, CheckCircle2, ArrowRight, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/site/page-components';

export const metadata = {
  title: 'For Teachers',
  description: 'Build and grow your teaching business with SarkariExamHub — AI question imports, mock tests, PDF selling, and student management.',
};

const features = [
  { icon: Brain, title: 'AI Question Importer', desc: 'Upload PDFs and auto-extract structured MCQs with answers and explanations.' },
  { icon: FileText, title: 'Sell PDFs & Courses', desc: 'Create products with descriptions, pricing, free samples, and discount codes.' },
  { icon: Timer, title: 'Build Mock Tests', desc: 'Configure duration, marks, negative marking, randomization, and result release.' },
  { icon: Users, title: 'Manage Students', desc: 'Add students, track progress, view results, and send announcements.' },
  { icon: TrendingUp, title: 'Sales & Reports', desc: 'View sales summaries, exam results, and student performance analytics.' },
  { icon: DollarSign, title: 'Earn Revenue', desc: 'Keep your earnings from selling materials. SaaS subscription is separate.' },
];

import Link from 'next/link';

export default function ForTeachersPage() {
  return (
    <div>
      <PageHeader
        title="For Teachers"
        description="Build your teaching business with AI-powered tools, a storefront, and a complete exam engine."
      >
        <div className="mt-6 flex gap-3">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/signup?role=teacher">
              Start Teaching <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {features.map((f) => (
            <Card key={f.title} className="transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-primary">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Dashboard</CardTitle>
            <CardDescription>Everything you need in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                'Total students', 'Active courses', 'Published PDFs', 'Question bank size',
                'Available examinations', 'Recent results', 'Sales summaries', 'AI import jobs',
                'Storage usage', 'Subscription usage', 'Recent activity', 'Quick actions',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Quick Actions</CardTitle>
              <CardDescription>Get things done fast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Upload PDF', 'Import Questions Using AI', 'Create MCQ Test', 'Create Course',
                'Add Student', 'Publish Study Material', 'View Examination Results'].map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5 text-accent" /> {a}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-accent/20">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-accent" />
              <CardTitle className="mt-2">Sell Your Content</CardTitle>
              <CardDescription>Monetize your expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sell individual PDFs, bundles, courses, chapter-wise practice sets, paid test
                series, and mock exam packages. Set your own prices, offer free samples, and
                create discount codes. Student purchases are kept separate from your SaaS
                subscription billing.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}