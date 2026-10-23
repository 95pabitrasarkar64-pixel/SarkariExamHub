'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Calendar,
  Award,
  Target,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { examCategoryInfo, examCategorySlugs } from '@/lib/navigation';

const testSeriesList = [
  {
    id: 'ts-1',
    title: 'SSC CGL 2026 Tier 1 & 2 All-India Test Series',
    category: 'ssc',
    categoryName: 'SSC',
    totalTests: '45 Mock Tests',
    breakdown: '20 Full Mocks + 25 Sectional Tests',
    languages: 'English & Hindi',
    validity: '12 Months',
    price: '₹499',
    freeSample: true,
    features: ['All India Ranking & Percentile', 'Detailed step-by-step solutions', 'Negative marking (-0.50) simulator'],
  },
  {
    id: 'ts-2',
    title: 'WBCS (West Bengal Civil Service) Prelims Test Series',
    category: 'state-psc',
    categoryName: 'State PSC',
    totalTests: '30 Full Mocks',
    breakdown: '200 Questions / 2.5 Hours Each',
    languages: 'English & Bengali',
    validity: '6 Months',
    price: '₹399',
    freeSample: true,
    features: ['West Bengal GK & Indian History emphasis', 'Subject-wise analytics', 'Curated by WBCS toppers'],
  },
  {
    id: 'ts-3',
    title: 'Railway RRB NTPC & Group D Comprehensive Series',
    category: 'railway',
    categoryName: 'Railway',
    totalTests: '35 Mock Tests',
    breakdown: '15 Full Mocks + 20 Speed Drills',
    languages: 'English, Hindi & Bengali',
    validity: '8 Months',
    price: '₹299',
    freeSample: true,
    features: ['Maths & Reasoning shortcuts', 'Current Affairs 2026 coverage', 'CBT test interface simulation'],
  },
  {
    id: 'ts-4',
    title: 'ICDS Anganwadi Supervisor & Worker Special Mock Series',
    category: 'icds-anganwadi',
    categoryName: 'ICDS & Anganwadi',
    totalTests: '25 Mock Tests',
    breakdown: '15 Full-length + 10 Subject Quizzes',
    languages: 'Bengali & English',
    validity: '6 Months',
    price: '₹199',
    freeSample: true,
    features: ['Nutrition, Public Health & Child Welfare focus', 'Bengali language mock tests', 'Instant answer key with notes'],
  },
  {
    id: 'ts-5',
    title: 'WBPSC Clerkship 2026 Practice & Mock Series',
    category: 'clerkship',
    categoryName: 'Clerkship',
    totalTests: '20 Mock Tests',
    breakdown: '10 Full Tests + 10 English & GK Sets',
    languages: 'English & Bengali',
    validity: '6 Months',
    price: '₹249',
    freeSample: true,
    features: ['English Grammar & Arithmetic focus', 'Rank predictor', 'Mobile-friendly testing interface'],
  },
  {
    id: 'ts-6',
    title: 'Banking IBPS PO / SBI Clerk Prelims Speed Test Series',
    category: 'banking',
    categoryName: 'Banking',
    totalTests: '50 Mock Tests',
    breakdown: '30 Sectional + 20 Full Prelims Mocks',
    languages: 'English & Hindi',
    validity: '12 Months',
    price: '₹599',
    freeSample: true,
    features: ['Strict 20-min sectional timer', 'Puzzles & Data Interpretation mastery', 'Instant performance graph'],
  },
];

export default function TestSeriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSeries = testSeriesList.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div>
      <PageHeader
        title="Test Series"
        description="Structured chapter-wise practice and full-length mock exam series designed for comprehensive government exam preparation."
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-72">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exam Categories</SelectItem>
                {examCategorySlugs.map((slug) => (
                  <SelectItem key={slug} value={slug}>
                    {examCategoryInfo[slug]?.name || slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild variant="outline" className="bg-white">
            <Link href="/mock-tests">
              <Target className="mr-2 h-4 w-4 text-accent" /> Try Free Daily Quizzes
            </Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        {/* Value Proposition Highlights */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Chapter-wise</Badge>
                <Target className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-2 text-lg">Topic-Focused Drills</CardTitle>
              <CardDescription>Build solid fundamentals subject by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Sectional practice with progressive difficulty
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Detailed step-by-step explanations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Accuracy & weak-area diagnostic reports
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Full-length</Badge>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-2 text-lg">Full-Length Mocks</CardTitle>
              <CardDescription>Simulate the exact exam hall pressure</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Real pattern with exact negative marking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Auto-submit timer & question navigation grid
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  State & All-India rank benchmarking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-all hover:border-accent/30 hover:shadow-md border-accent/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-accent text-accent-foreground">Bilingual</Badge>
                <Award className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="mt-2 text-lg">Vernacular Support</CardTitle>
              <CardDescription>English, Bengali & Hindi questions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  High-quality questions in state languages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Low-data optimized for mobile 4G phones
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Unlimited re-attempts for revision
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Test Series Cards Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Available Test Series Packages</h2>
            <span className="text-sm text-muted-foreground">
              Showing {filteredSeries.length} package{filteredSeries.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSeries.map((series) => (
            <Card key={series.id} className="flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary">
                    {series.categoryName}
                  </Badge>
                  {series.freeSample && (
                    <Badge className="bg-success text-white text-[10px]">
                      1 Free Mock Included
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-2 text-lg leading-snug">{series.title}</CardTitle>
                <CardDescription className="text-xs font-medium text-accent">
                  {series.totalTests} &middot; {series.breakdown}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium text-primary">Languages:</span> {series.languages}</p>
                  <p><span className="font-medium text-primary">Validity:</span> {series.validity}</p>
                </div>

                <div className="space-y-1.5">
                  {series.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">{series.price}</span>
                    <span className="text-xs text-muted-foreground"> / one-time</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/mock-tests">Free Demo</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href="/signup">Enroll Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Progress CTA */}
        <div className="mt-12 rounded-xl border border-border bg-secondary/30 p-8 text-center">
          <TrendingUp className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h2 className="text-xl font-bold text-primary">Track Your Rank & Percentile</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            View marks, accuracy, topic-wise speed analysis, and compare your score with thousands of aspirants across West Bengal and India.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">
                Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mock-tests">Attempt Sample Test</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}