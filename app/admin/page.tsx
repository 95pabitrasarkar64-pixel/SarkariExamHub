'use client';

import { useAuth } from '@/lib/auth-context';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Building2, Users, FileText, Database, ArrowRight, Newspaper, Languages } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();

  return (
    <div>
      <PageHeader
        title="Platform Administration"
        description="Global system administration, organization workspaces, multilingual question banks, and daily article publishing."
      >
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/admin/articles">
              <Newspaper className="mr-2 h-4 w-4 text-accent" /> Article Publishing Studio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/teacher/question-studio">
              <Languages className="mr-2 h-4 w-4 text-primary" /> Multilingual Question Studio
            </Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-primary/30 shadow-sm">
            <CardHeader>
              <Newspaper className="h-8 w-8 text-accent" />
              <CardTitle className="mt-2 text-lg">Article Studio</CardTitle>
              <CardDescription>Daily publishing, scheduling & AI writing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">Daily CMS</p>
              <Button asChild className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
                <Link href="/admin/articles">Manage Articles</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2 text-lg">Organizations</CardTitle>
              <CardDescription>Multi-tenant institutes & coaching centers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">24 Active</p>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href="/for-institutes">Manage Workspaces</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-accent" />
              <CardTitle className="mt-2 text-lg">Platform Users</CardTitle>
              <CardDescription>Students, teachers & super admins</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">1,890 Total</p>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href="/categories">View Categories</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
              <CardTitle className="mt-2 text-lg">SaaS Plans & Config</CardTitle>
              <CardDescription>Pricing tiers, quotas & payment verification</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">4 Plans</p>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href="/pricing">Configure Pricing</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
