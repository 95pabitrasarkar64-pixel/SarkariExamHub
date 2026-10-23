'use client';

import { useAuth } from '@/lib/auth-context';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Building2, Users, FileText, Database, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, profile } = useAuth();

  return (
    <div>
      <PageHeader
        title="Platform Administration"
        description="Global system administration, organization workspaces, and SaaS plan management."
      />

      <PageContainer>
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2 text-lg">Organizations</CardTitle>
              <CardDescription>Multi-tenant institutes and teacher workspaces</CardDescription>
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
              <CardDescription>Students, teachers, and organization owners</CardDescription>
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
              <ShieldCheck className="h-8 w-8 text-success" />
              <CardTitle className="mt-2 text-lg">SaaS Plans & Config</CardTitle>
              <CardDescription>Pricing tiers, quotas, and feature flags</CardDescription>
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
