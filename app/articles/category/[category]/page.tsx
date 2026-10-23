'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ARTICLE_CATEGORIES, INITIAL_ARTICLES } from '@/lib/article-data';
import { Article } from '@/lib/types';
import { getLanguage } from '@/lib/languages';

export default function ArticleCategoryArchivePage() {
  const params = useParams();
  const categorySlug = params?.category as string;

  const [articles, setArticles] = useState<Article[]>([]);

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
      console.warn('Could not read articles', e);
    }
    setArticles(INITIAL_ARTICLES.filter((a) => a.status === 'published'));
  }, []);

  const categoryConfig = useMemo(() => {
    return ARTICLE_CATEGORIES.find((c) => c.slug === categorySlug) || {
      slug: categorySlug,
      name: categorySlug ? categorySlug.replace(/-/g, ' ').toUpperCase() : 'Category',
      description: 'Examination guides and syllabus breakdowns.',
    };
  }, [categorySlug]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => a.category === categorySlug);
  }, [articles, categorySlug]);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30 py-3">
        <div className="container mx-auto px-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/articles" className="hover:text-primary">
            Daily Articles
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-foreground">{categoryConfig.name}</span>
        </div>
      </div>

      <PageHeader
        title={`${categoryConfig.name} — Exam Articles & Syllabus`}
        description={categoryConfig.description}
      >
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/mock-tests">
              <GraduationCap className="mr-2 h-4 w-4 text-accent" /> Practice {categoryConfig.name} Mocks
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" /> All Categories
            </Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Published Guides in this Category ({filteredArticles.length})
          </h2>
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
                    {getLanguage(art.language).nativeName}
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
                <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {art.read_time_minutes} min read
                  </span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="font-semibold text-primary hover:text-accent flex items-center gap-1"
                  >
                    Read Guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
            No published articles in this category yet. Browse all articles or visit the mock test series.
          </div>
        )}
      </PageContainer>
    </div>
  );
}
