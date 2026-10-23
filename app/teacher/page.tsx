'use client';

import { useAuth } from '@/lib/auth-context';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Brain,
  FileText,
  Timer,
  Users,
  Upload,
  BarChart3,
  CheckCircle2,
  Settings,
  PlusCircle,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user, profile } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Teacher Portal — ${profile?.full_name || user?.email?.split('@')[0] || 'Educator'}`}
        description="Manage your question banks, AI imports, mock test series, and student enrollments."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/ai-importer">
              <Brain className="mr-2 h-4 w-4" /> AI Question Importer
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/mock-tests">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Mock Test
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">
              <Settings className="mr-2 h-4 w-4" /> Subscription Plans
            </Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="mt-1 text-2xl font-bold text-primary">184</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Question Bank</p>
                  <p className="mt-1 text-2xl font-bold text-primary">1,450</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Brain className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published Tests</p>
                  <p className="mt-1 text-2xl font-bold text-primary">8</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <Timer className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published PDFs</p>
                  <p className="mt-1 text-2xl font-bold text-primary">15</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & AI Processing Status */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">AI Document Ingestion</CardTitle>
              <CardDescription>
                Extract MCQs, answer keys, and explanations automatically from digital and scanned PDFs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/ai-importer">Launch AI Importer</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Timer className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Exam Engine</CardTitle>
              <CardDescription>
                Configure timed mock examinations with negative marking and auto-submission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/mock-tests">Manage Examinations</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Performance Analytics</CardTitle>
              <CardDescription>
                Analyze student pass percentages, question difficulty ratings, and discrimination indices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/for-teachers">View Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
