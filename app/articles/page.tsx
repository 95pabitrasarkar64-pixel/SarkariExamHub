'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Globe2,
  Filter,
  Layers,
  GraduationCap,
  Bell,
} from 'lucide-react';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ARTICLE_CATEGORIES, INITIAL_ARTICLES } from '@/lib/article-data';
import { Article } from '@/lib/types';
import { SUPPORTED_LANGUAGES, getLanguage } from '@/lib/languages';

export default function ArticlesPublicPortalPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sarkari_published_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed.filter((a) => a.status === 'published'));
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read articles from localStorage', e);
    }
    setArticles(INITIAL_ARTICLES.filter((a) => a.status === 'published'));
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
      const matchesLang = selectedLanguage === 'all' || a.language === selectedLanguage;

      return matchesSearch && matchesCat && matchesLang;
    });
  }, [articles, searchQuery, selectedCategory, selectedLanguage]);

  const featuredArticle = filteredArticles[0] || articles[0];
  const regularArticles = filteredArticles.slice(1);

  return (
    <div>
      <PageHeader
        title="Daily Government Exam Articles & Syllabus Guides"
        description="Authentic subject-wise blueprints, official marking schemes, and preparation strategies verified against commission gazettes."
      >
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/mock-tests">
              <GraduationCap className="mr-2 h-4 w-4 text-accent" /> Practice Related Mock Tests
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/exams">All Exam Categories</Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        {/* Search & Language Filter Bar */}
        <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by exam (WBCS, ICDS, SSC, Railway, Panchayat)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-44 text-xs font-medium">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.nativeName} ({l.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              All Topics
            </button>
            {ARTICLE_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Hero Article */}
        {featuredArticle && (
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-3">
              <Sparkles className="h-4 w-4" />
              Featured Educational Guide
            </div>

            <Card className="overflow-hidden border-primary/20 shadow-sm transition-all hover:border-primary/40">
              <div className="grid md:grid-cols-12">
                <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className="bg-primary text-primary-foreground">
                        {featuredArticle.category_name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getLanguage(featuredArticle.language).nativeName}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" /> Gazette Verified
                      </span>
                    </div>

                    <Link href={`/articles/${featuredArticle.slug}`}>
                      <h2 className="text-xl sm:text-2xl font-black text-foreground hover:text-primary transition-colors leading-tight">
                        {featuredArticle.title}
                      </h2>
                    </Link>

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>By {featuredArticle.author.name}</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {featuredArticle.read_time_minutes} min read
                      </span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{' '}
                        {featuredArticle.published_at
                          ? new Date(featuredArticle.published_at).toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>

                    <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href={`/articles/${featuredArticle.slug}`}>
                        Read Full Guide <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-4 bg-muted/40 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Key Syllabus Focus
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-card border px-2.5 py-1 text-xs font-medium text-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                    <strong className="text-primary block font-semibold mb-1">
                      Official Portal Citations Included
                    </strong>
                    All exam notifications and syllabi reference verified commission portals (WBPSC, SSC, RRB).
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">
              Latest Articles & Strategy Handbooks ({filteredArticles.length})
            </h3>
            {selectedCategory !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-muted-foreground"
              >
                Clear Topic Filter
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((art) => (
              <Card
                key={art.id}
                className="flex flex-col justify-between border-border transition-all hover:border-primary/40 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      {art.category_name}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  </div>

                  <Link href={`/articles/${art.slug}`}>
                    <CardTitle className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </CardTitle>
                  </Link>

                  <CardDescription className="text-xs text-muted-foreground line-clamp-3 mt-2 leading-relaxed">
                    {art.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {art.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {art.read_time_minutes} min
                    </span>
                    <Link
                      href={`/articles/${art.slug}`}
                      className="font-semibold text-primary hover:text-accent flex items-center gap-1"
                    >
                      Read Article <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              No published articles found matching your search. Browse all categories or clear filters.
            </div>
          )}
        </div>

        {/* Subscribe / Notification Banner */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h4 className="text-lg font-bold text-primary flex items-center justify-center sm:justify-start gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Never Miss Official Exam Updates & Syllabus Gazettes
            </h4>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              We publish daily authenticated breakdown guides for WBCS, West Bengal Panchayat, ICDS Supervisor, SSC, and Railway examinations.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex gap-2 justify-center">
            <Button asChild className="bg-primary text-primary-foreground">
              <Link href="/mock-tests">Start Free Mock Test</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/categories">View All Exams</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
