import { Building2, Users, BarChart3, Palette, Layers, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/site/page-components';

export const metadata = {
  title: 'For Coaching Institutes',
  description: 'Manage your entire coaching institute on SarkariExamHub with multiple teachers, shared resources, and institute-wide reporting.',
};

import Link from 'next/link';

export default function ForInstitutesPage() {
  return (
    <div>
      <PageHeader
        title="For Coaching Institutes"
        description="Manage your entire institute with multiple teacher accounts, shared resources, and institute-wide analytics."
      >
        <div className="mt-6 flex gap-3">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/pricing">
              Explore Institute Plans <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {[
            { icon: Users, title: 'Multiple Teacher Accounts', desc: 'Add up to 20 teacher seats (Institute plan) with individual logins and roles.' },
            { icon: Layers, title: 'Shared Resources', desc: 'Question banks, PDFs, and exam templates shared across all teachers in the institute.' },
            { icon: BarChart3, title: 'Institute-wide Reports', desc: 'Aggregate analytics across all teachers, students, courses, and exams.' },
            { icon: Palette, title: 'Custom Branding', desc: 'Logo, colors, and white-label options to match your institute identity.' },
            { icon: Building2, title: 'Student Management', desc: 'Bulk enrollment, student rosters, and access control across the institute.' },
            { icon: Shield, title: 'Data Isolation', desc: 'Your institute data is tenant-isolated with database-level row-level security.' },
          ].map((f) => (
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

        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle>Institute Plan Highlights</CardTitle>
            <CardDescription>Everything you need to run a coaching institute</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                '5,000 students capacity',
                '50 GB storage',
                '10,000 AI processing quota',
                '500 active examinations',
                '20 teacher seats',
                'Institute-wide reporting',
                'Shared question bank & resources',
                'Custom branding & white-label',
                'Priority support',
                'Subscription management',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/pricing">View Pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}