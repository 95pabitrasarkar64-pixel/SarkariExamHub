'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Timer,
  Clock,
  CheckCircle2,
  ListChecks,
  RotateCcw,
  Award,
  Play,
  Filter,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { MOCK_TESTS } from '@/lib/mock-test-data';
import { examCategoryInfo, examCategorySlugs } from '@/lib/navigation';

const features = [
  { icon: Timer, title: 'Timed Examinations', desc: 'Precise countdown timer with automatic submission on expiry.' },
  { icon: ListChecks, title: 'Question Grid', desc: 'Navigate freely, mark for review, and track answered vs unanswered.' },
  { icon: CheckCircle2, title: 'Negative Marking', desc: 'Authentic exam pattern with -0.25, -0.33, or -0.50 score calculation.' },
  { icon: RotateCcw, title: 'Instant Solutions', desc: 'Detailed step-by-step explanations revealed right after submission.' },
];

export default function MockTestsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTests = MOCK_TESTS.filter((test) => {
    const matchesSearch =
      !search ||
      test.title.toLowerCase().includes(search.toLowerCase()) ||
      test.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <PageHeader
        title="Online Mock Tests"
        description="Take timed MCQ examinations with realistic question patterns, instant scoring, detailed explanations, and performance analytics."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tests by title or exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="sm:w-64 bg-white">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {examCategorySlugs.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {examCategoryInfo[slug]?.name || slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <PageContainer>
        {/* Core Exam Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm text-primary">{f.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Mock Tests List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Available Examinations</h2>
          <span className="text-sm text-muted-foreground">
            {filteredTests.length} test{filteredTests.length === 1 ? '' : 's'} available
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredTests.map((test) => (
            <Card key={test.id} className="flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary">
                    {test.categoryName}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      {test.difficulty}
                    </Badge>
                    <Badge className="bg-success text-white text-xs">
                      Free Attempt
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg leading-snug mt-2">{test.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {test.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary/50 p-2.5 text-center text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Questions</span>
                    <span className="font-bold text-primary">{test.totalQuestions} MCQs</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Duration</span>
                    <span className="font-bold text-primary">{test.durationMinutes} Mins</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Neg. Mark</span>
                    <span className="font-bold text-destructive">-{test.negativeMarks}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    Language: <strong className="text-primary">{test.language}</strong>
                  </span>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/mock-tests/take?testId=${test.id}`}>
                      <Play className="mr-1.5 h-4 w-4 fill-current" /> Start Test
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground rounded-xl border border-dashed border-border p-8">
            No mock tests match your current search or category filter. Try clearing your filters.
          </div>
        )}

        <div className="mt-10 flex items-start gap-3 rounded-lg border border-info/30 bg-info/5 p-4">
          <Award className="mt-0.5 h-5 w-5 shrink-0 text-info" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-info font-semibold">Examiner Notice:</strong> Mock tests on SarkariExamHub faithfully reproduce actual exam negative marking patterns, time limits, and question distribution to train your speed and accuracy under real conditions.
          </p>
        </div>
      </PageContainer>
    </div>
  );
}