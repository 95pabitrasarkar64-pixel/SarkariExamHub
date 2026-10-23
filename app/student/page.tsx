'use client';

import { useAuth } from '@/lib/auth-context';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Timer,
  Award,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  User,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, profile } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile?.full_name || user?.email?.split('@')[0] || 'Aspirant'}!`}
        description="Track your exam preparation, practice mock tests, and review study materials."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/mock-tests">
              <Timer className="mr-2 h-4 w-4" /> Start Mock Test
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/materials">
              <FileText className="mr-2 h-4 w-4" /> Browse Materials
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/test-series">
              <TrendingUp className="mr-2 h-4 w-4" /> View Test Series
            </Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tests Attempted</p>
                  <p className="mt-1 text-2xl font-bold text-primary">12</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Timer className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                  <p className="mt-1 text-2xl font-bold text-success">78.4%</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study PDFs</p>
                  <p className="mt-1 text-2xl font-bold text-primary">9</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Rank</p>
                  <p className="mt-1 text-2xl font-bold text-accent">#142</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Award className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Mock Tests */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Mock Test Attempts</CardTitle>
                  <CardDescription>Review your latest scores and solutions</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/mock-tests">All Tests <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'SSC CGL Tier 1 — Full Mock #04', score: '154 / 200', date: 'Yesterday', status: 'Completed', acc: '82%' },
                    { title: 'Railway RRB NTPC Reasoning Set', score: '28 / 30', date: '3 days ago', status: 'Completed', acc: '93%' },
                    { title: 'State PSC (WBCS) Prelims Mock #02', score: '136 / 200', date: '5 days ago', status: 'Completed', acc: '74%' },
                    { title: 'ICDS Supervisor Mock Exam 1', score: '88 / 100', date: '1 week ago', status: 'Completed', acc: '88%' },
                  ].map((test, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-secondary/40">
                      <div>
                        <p className="font-medium text-sm text-primary">{test.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3" /> {test.date} &middot; Accuracy: {test.acc}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-primary">{test.score}</span>
                        <div><Badge variant="outline" className="text-[10px] mt-0.5">{test.status}</Badge></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Active Courses & Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Target Exam Categories</CardTitle>
                <CardDescription>Examinations you are actively preparing for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { name: 'Staff Selection Commission (SSC)', slug: 'ssc', topics: '14 Topics Active' },
                    { name: 'Railway Recruitment (RRB)', slug: 'railway', topics: '10 Topics Active' },
                    { name: 'State PSC / WBCS', slug: 'state-psc', topics: '18 Topics Active' },
                    { name: 'ICDS & Anganwadi', slug: 'icds-anganwadi', topics: '8 Topics Active' },
                  ].map((cat) => (
                    <Link key={cat.slug} href={`/exams?category=${cat.slug}`}>
                      <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-primary">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.topics}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Profile & Quick Links */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{profile?.full_name || 'Student Aspirant'}</CardTitle>
                    <CardDescription className="text-xs">{user?.email || 'Logged in'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Account Role:</span>
                    <span className="font-medium text-primary capitalize">{profile?.role || 'Student'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Membership:</span>
                    <span className="font-medium text-success">Active Free Tier</span>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full text-xs" size="sm">
                  <Link href="/materials">Browse More Study Material</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-base text-accent">Study Tip of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Regular timed sectional practice in Reasoning and Quantitative Aptitude improves
                  speed by up to 35% within 3 weeks. Attempt at least 2 mini-quizzes daily!
                </p>
                <Button asChild size="sm" className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/test-series">Explore Chapter Practice</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
