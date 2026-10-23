'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  BookOpen,
  ArrowRight,
  FileText,
  Timer,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { examCategoryInfo, examCategorySlugs } from '@/lib/navigation';
import { MOCK_TESTS } from '@/lib/mock-test-data';

type CategoryDetails = {
  posts: string[];
  stages: string[];
  pattern: {
    duration: string;
    questions: string;
    negativeMarking: string;
    sections: { name: string; marks: string }[];
  };
  keyTopics: string[];
};

const CATEGORY_DETAILS: Record<string, CategoryDetails> = {
  ssc: {
    posts: ['Assistant Section Officer', 'Income Tax Inspector', 'Preventive Officer', 'Sub-Inspector CBI', 'Auditor'],
    stages: ['Tier 1 (Computer Based Examination)', 'Tier 2 (Objective + Data Entry Speed Test)'],
    pattern: {
      duration: '60 minutes',
      questions: '100 Questions (200 Marks)',
      negativeMarking: '0.50 marks per incorrect response',
      sections: [
        { name: 'General Intelligence & Reasoning', marks: '25 Qs / 50 Marks' },
        { name: 'General Awareness', marks: '25 Qs / 50 Marks' },
        { name: 'Quantitative Aptitude', marks: '25 Qs / 50 Marks' },
        { name: 'English Comprehension', marks: '25 Qs / 50 Marks' },
      ],
    },
    keyTopics: ['Number System & Algebra', 'Syllogism & Puzzles', 'Indian Polity & Modern History', 'Error Spotting & Vocab'],
  },
  'state-psc': {
    posts: ['WBCS (Executive)', 'Commercial Tax Officer', 'Assistant Labour Commissioner', 'Panchayat Development Officer'],
    stages: ['Preliminary Examination (200 Marks)', 'Main Examination (6 Compulsory + 2 Optional Papers)', 'Personality Test'],
    pattern: {
      duration: '150 minutes (2.5 Hours)',
      questions: '200 Objective Questions',
      negativeMarking: '0.33 marks per incorrect response',
      sections: [
        { name: 'English Composition', marks: '25 Marks' },
        { name: 'General Science', marks: '25 Marks' },
        { name: 'History of India & National Movement', marks: '50 Marks' },
        { name: 'Geography of India & West Bengal', marks: '25 Marks' },
        { name: 'Indian Polity and Economy', marks: '25 Marks' },
        { name: 'General Mental Ability', marks: '25 Marks' },
      ],
    },
    keyTopics: ['Bengal Renaissance & National Movement', 'West Bengal Physiography & River Systems', 'Fundamental Rights & DPSP'],
  },
  railway: {
    posts: ['Commercial Apprentice', 'Station Master', 'Goods Train Manager', 'Junior Clerk cum Typist', 'Track Maintainer'],
    stages: ['1st Stage CBT (Screening)', '2nd Stage CBT (Scoring)', 'Typing Skill Test / CBAT', 'Document Verification'],
    pattern: {
      duration: '90 minutes',
      questions: '100 MCQs (100 Marks)',
      negativeMarking: '1/3rd (0.33) marks per wrong response',
      sections: [
        { name: 'General Awareness', marks: '40 Questions' },
        { name: 'Mathematics', marks: '30 Questions' },
        { name: 'General Intelligence & Reasoning', marks: '30 Questions' },
      ],
    },
    keyTopics: ['Railway GK & Headquarters', 'Basic Physics & Chemistry', 'Time & Work, Pipes & Cisterns', 'Coding-Decoding'],
  },
  'icds-anganwadi': {
    posts: ['Anganwadi Supervisor (Female)', 'Anganwadi Worker', 'Anganwadi Helper'],
    stages: ['Written Examination (Part-I: 90 Marks)', 'Viva-Voce / Interview (Part-II: 10 Marks)'],
    pattern: {
      duration: '90 minutes',
      questions: '100 MCQs (Partially descriptive for higher tiers)',
      negativeMarking: '0.25 marks per wrong answer',
      sections: [
        { name: 'General Knowledge & Current Affairs', marks: '20 Marks' },
        { name: 'Arithmetic & Mental Ability', marks: '20 Marks' },
        { name: 'Public Health, Nutrition & Child Welfare', marks: '30 Marks' },
        { name: 'English & Bengali Language Skills', marks: '20 Marks' },
      ],
    },
    keyTopics: ['Vitamins, Minerals & Malnutrition', 'Universal Immunization Schedule', 'West Bengal Kanyashree & Schemes'],
  },
  clerkship: {
    posts: ['Lower Division Clerk (LDC)', 'Lower Division Assistant (LDA) in Govt. of WB Secretariats and Directorates'],
    stages: ['Part-I (Objective MCQ, 100 Marks)', 'Part-II (Conventional Written: English & Bengali, 100 Marks)'],
    pattern: {
      duration: '90 minutes',
      questions: '100 Questions (100 Marks)',
      negativeMarking: '0.25 marks per wrong answer',
      sections: [
        { name: 'English Grammar & Vocabulary', marks: '30 Marks' },
        { name: 'General Studies & Everyday Science', marks: '40 Marks' },
        { name: 'Arithmetic & Number Relations', marks: '30 Marks' },
      ],
    },
    keyTopics: ['Idioms, Prepositions & One Word Substitution', 'Indian Geography & Current Affairs', 'Profit & Loss, Averages'],
  },
  banking: {
    posts: ['Probationary Officer (PO)', 'Clerk / Junior Associate', 'Specialist Officer (IT/Marketing/Law)'],
    stages: ['Preliminary Exam (100 Marks, 60 mins)', 'Mains Examination (200 Marks)', 'Interview / Group Discussion'],
    pattern: {
      duration: '60 minutes (20 mins per section strictly timed)',
      questions: '100 Questions',
      negativeMarking: '0.25 marks per wrong answer',
      sections: [
        { name: 'English Language', marks: '30 Qs / 30 Marks (20 mins)' },
        { name: 'Quantitative Aptitude', marks: '35 Qs / 35 Marks (20 mins)' },
        { name: 'Reasoning Ability', marks: '35 Qs / 35 Marks (20 mins)' },
      ],
    },
    keyTopics: ['Floor & Seating Puzzles', 'Data Interpretation (Bar/Pie/Radar)', 'Quadratic Equations & Approximation'],
  },
  'police-constable': {
    posts: ['Police Constable (Male/Female)', 'Sub-Inspector (UB & AB)', 'Wireless Operator'],
    stages: ['Preliminary Written Test', 'Physical Measurement & Efficiency Test (PMT/PET)', 'Final Written Exam', 'Interview'],
    pattern: {
      duration: '60 minutes',
      questions: '100 Questions (100 Marks)',
      negativeMarking: '0.25 marks per wrong answer',
      sections: [
        { name: 'General Awareness & GK', marks: '40 Marks' },
        { name: 'Elementary Mathematics (10th Std)', marks: '30 Marks' },
        { name: 'Reasoning', marks: '30 Marks' },
      ],
    },
    keyTopics: ['Indian Constitution & Law enforcement overview', 'Percentages & Mensuration', 'Series & Blood Relations'],
  },
  panchayat: {
    posts: ['Gram Panchayat Karmee', 'Panchayat Secretary', 'Executive Assistant', 'Nirman Sahayak'],
    stages: ['Written Examination (85 Marks)', 'Interview (15 Marks)'],
    pattern: {
      duration: '90 minutes',
      questions: '85 MCQs',
      negativeMarking: '0.25 marks per wrong response',
      sections: [
        { name: 'English & Vernacular', marks: '25 Marks' },
        { name: 'Arithmetic', marks: '25 Marks' },
        { name: 'General Knowledge & Rural Development', marks: '35 Marks' },
      ],
    },
    keyTopics: ['Gram Panchayat Act 1973', 'Panchayati Raj Schemes & Funds', 'Civic Duties and General Science'],
  },
  'group-c-d': {
    posts: ['Peon', 'Orderly', 'Night Guard', 'Laboratory Attendant', 'Store Keeper'],
    stages: ['Written Test (MCQ)', 'Interview / Trade Test'],
    pattern: {
      duration: '60 minutes',
      questions: '100 MCQs',
      negativeMarking: 'None or 0.25 depending on recruitment board',
      sections: [
        { name: 'General Studies', marks: '40 Marks' },
        { name: 'Basic Mathematics', marks: '30 Marks' },
        { name: 'Language & Mental Ability', marks: '30 Marks' },
      ],
    },
    keyTopics: ['Basic Everyday Science', 'Simple Arithmetic', 'State Symbols & Important Dates'],
  },
};

function ExamsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);

  const categories = examCategorySlugs.map((slug) => ({ slug, ...examCategoryInfo[slug] }));

  const activeCategoryInfo = category !== 'all' ? examCategoryInfo[category] : null;
  const activeDetails = category !== 'all' ? CATEGORY_DETAILS[category] : null;

  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        !search ||
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || cat.slug === category;
      return matchesSearch && matchesCategory;
    });
  }, [categories, search, category]);

  const categoryMockTests = useMemo(() => {
    if (category === 'all') return MOCK_TESTS;
    return MOCK_TESTS.filter((t) => t.category === category);
  }, [category]);

  const handleSelectCategory = (slug: string) => {
    setCategory(slug);
    router.replace(`/exams?category=${slug}`, { scroll: false });
  };

  return (
    <div>
      <PageHeader
        title={activeCategoryInfo ? `${activeCategoryInfo.name} Preparation Hub` : 'Government Recruitment Exams'}
        description={
          activeCategoryInfo
            ? activeCategoryInfo.description
            : 'Explore syllabus, examination patterns, sectional marks, mock tests, and official study materials across Indian recruitment boards.'
        }
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exams, subjects, or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Select value={category} onValueChange={handleSelectCategory}>
            <SelectTrigger className="sm:w-64 bg-white">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exam Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <PageContainer>
        {/* If a specific category is selected, show the detailed Category Hub */}
        {category !== 'all' && activeCategoryInfo && activeDetails ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectCategory('all')}
                className="text-muted-foreground hover:text-primary"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to All Categories
              </Button>
              <Badge className="bg-primary text-white text-xs">
                Active Category: {activeCategoryInfo.name}
              </Badge>
            </div>

            {/* Hub Tabs */}
            <Tabs defaultValue="pattern" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md bg-secondary">
                <TabsTrigger value="pattern">Exam Pattern</TabsTrigger>
                <TabsTrigger value="mocks">Mock Tests ({categoryMockTests.length})</TabsTrigger>
                <TabsTrigger value="syllabus">Syllabus & Posts</TabsTrigger>
              </TabsList>

              {/* Tab 1: Exam Pattern & Structure */}
              <TabsContent value="pattern" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-primary">Examination Scheme & Marking</CardTitle>
                      <CardDescription>Official scoring format and time limits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted-foreground">Test Duration:</span>
                        <span className="font-semibold text-primary">{activeDetails.pattern.duration}</span>
                      </div>
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted-foreground">Question Volume:</span>
                        <span className="font-semibold text-primary">{activeDetails.pattern.questions}</span>
                      </div>
                      <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted-foreground">Negative Marking:</span>
                        <span className="font-semibold text-destructive">{activeDetails.pattern.negativeMarking}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Selection Stages
                        </p>
                        <div className="space-y-1.5">
                          {activeDetails.stages.map((stage, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                              <span>{stage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-primary">Sectional Marks Breakdown</CardTitle>
                      <CardDescription>Mark distribution across test papers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {activeDetails.pattern.sections.map((sec, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                          <span className="font-medium text-primary">{sec.name}</span>
                          <Badge variant="secondary" className="text-xs font-semibold">
                            {sec.marks}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab 2: Category Mock Tests */}
              <TabsContent value="mocks" className="mt-6">
                {categoryMockTests.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {categoryMockTests.map((t) => (
                      <Card key={t.id} className="flex flex-col justify-between hover:border-primary/40 transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">{t.difficulty}</Badge>
                            <span className="text-xs text-muted-foreground">{t.durationMinutes} mins</span>
                          </div>
                          <CardTitle className="text-base mt-2">{t.title}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">{t.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-xs text-muted-foreground">
                              {t.totalQuestions} Questions &middot; -{t.negativeMarks} Neg.
                            </span>
                            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                              <Link href={`/mock-tests/take?testId=${t.id}`}>
                                <Play className="mr-1.5 h-3.5 w-3.5 fill-current" /> Attempt Now
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-xl border border-dashed border-border p-8">
                    <p className="text-muted-foreground text-sm">
                      Additional mock tests are being prepared for this category.
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-3">
                      <Link href="/mock-tests">Browse All Mock Tests</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Syllabus & Posts */}
              <TabsContent value="syllabus" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-primary">Popular Job Profiles & Cadres</CardTitle>
                      <CardDescription>Major recruitments notified under this board</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {activeDetails.posts.map((post, idx) => (
                        <div key={idx} className="flex items-center gap-2 rounded-lg bg-secondary/40 p-2.5 text-xs font-medium text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span>{post}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-primary">Core High-Yield Syllabus Topics</CardTitle>
                      <CardDescription>Focus areas with maximum question frequency</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {activeDetails.keyTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-xs text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* "All Categories" View */
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cat) => (
                <Card
                  key={cat.slug}
                  className="group flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-lg cursor-pointer"
                  onClick={() => handleSelectCategory(cat.slug)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-bold text-primary group-hover:text-accent transition-colors">
                          {cat.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs leading-relaxed line-clamp-2">
                          {cat.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs font-medium text-accent hover:text-accent/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCategory(cat.slug);
                      }}
                    >
                      Explore Syllabus & Mocks
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground rounded-xl border border-dashed border-border p-8">
                No exams match your search criteria. Try a different search keyword.
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );
}

export default function ExamsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading exams...</div>}>
      <ExamsContent />
    </Suspense>
  );
}