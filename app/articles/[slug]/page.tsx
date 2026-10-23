'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import {
  Calendar,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Share2,
  Bookmark,
  Check,
  ArrowLeft,
  GraduationCap,
  AlertTriangle,
  Globe2,
  Award,
  BookOpen,
} from 'lucide-react';
import { PageContainer } from '@/components/site/page-components';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INITIAL_ARTICLES } from '@/lib/article-data';
import { Article } from '@/lib/types';
import { getLanguage, isRTL } from '@/lib/languages';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [articles, setArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sarkari_published_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read articles', e);
    }
    setArticles(INITIAL_ARTICLES);
  }, []);

  const article = useMemo(() => {
    return articles.find((a) => a.slug === slug) || INITIAL_ARTICLES.find((a) => a.slug === slug);
  }, [articles, slug]);

  const langMeta = useMemo(() => {
    return article ? getLanguage(article.language) : getLanguage('en');
  }, [article]);

  const articleIsRTL = useMemo(() => {
    return article ? isRTL(article.language) : false;
  }, [article]);

  // Social share handler
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!article || typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`*${article.title}*\nRead verified syllabus breakdown on SarkariExamHub:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    if (!article || typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-foreground">Article Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested exam article may be unpublished or the URL has changed.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
          </Link>
        </Button>
      </div>
    );
  }

  // Schema.org JSON-LD structured data for Google Search SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    inLanguage: article.language,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SarkariExamHub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sarkariexamhub.in/assets/aistudio/SARKARIEXAMHUB_Academic_Logo_244f6d21.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sarkariexamhub.in/articles/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Breadcrumb Navigation */}
      <div className="border-b bg-muted/30 py-3">
        <div className="container mx-auto px-4 flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link href="/articles" className="hover:text-primary">
            Daily Articles
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link
            href={`/articles/category/${article.category}`}
            className="hover:text-primary font-medium text-foreground"
          >
            {article.category_name}
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-12 py-6">
          {/* Main Article Content (8 cols) */}
          <main className="lg:col-span-8 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-primary text-primary-foreground">
                  {article.category_name}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Globe2 className="h-3 w-3" />
                  {langMeta.nativeName} ({langMeta.name})
                </Badge>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Official Portal Verified
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
                {article.title}
              </h1>

              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>

              {/* Author and Metadata Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y py-3.5">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                    <Image
                      src={article.author.avatar || '/assets/aistudio/SARKARIEXAMHUB_Academic_Logo_244f6d21.png'}
                      alt={article.author.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{article.author.name}</p>
                    <p className="text-[11px] text-muted-foreground">{article.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recent'}
                  </span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    {article.read_time_minutes} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Official Portal Notice Banner */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-4 text-xs text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-emerald-900 dark:text-emerald-100">
                    SarkariExamHub Authenticity Verification
                  </strong>
                  <p className="mt-1 leading-relaxed">
                    This syllabus guide has been cross-referenced with official public commission notifications. Candidates are strictly advised to verify application windows and cutoff scores on the designated government portals below.
                  </p>
                  {article.source_references && article.source_references.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {article.source_references.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 font-semibold text-emerald-800 shadow-sm border border-emerald-200 hover:bg-emerald-100 dark:bg-card dark:text-emerald-200"
                        >
                          {src.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Markdown Body */}
            <article
              className={`prose prose-slate max-w-none text-foreground dark:prose-invert font-sans leading-relaxed ${
                articleIsRTL ? 'text-right' : 'text-left'
              }`}
              dir={articleIsRTL ? 'rtl' : 'ltr'}
            >
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="mt-8 mb-3 text-xl sm:text-2xl font-bold text-primary border-b pb-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="mt-6 mb-2 text-lg font-bold text-foreground" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4 rounded-lg border">
                      <table className="w-full text-left text-xs sm:text-sm" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="bg-muted px-4 py-2 font-bold text-foreground border-b" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-4 py-2 border-b text-foreground" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-accent bg-accent/5 p-4 rounded-r-lg my-4 italic text-foreground text-sm"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 my-3 space-y-1 text-sm sm:text-base text-foreground" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5 my-3 space-y-1 text-sm sm:text-base text-foreground" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="my-3 text-sm sm:text-base leading-relaxed text-foreground/90" {...props} />
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </article>

            {/* Social Share & Action Bar */}
            <div className="rounded-xl border bg-card p-5 mt-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Share this Guide with Fellow Aspirants</h4>
                  <p className="text-xs text-muted-foreground">
                    Help study groups and candidates access authentic syllabus information.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShareWhatsApp}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShareTelegram}
                    className="text-sky-600 hover:text-sky-700"
                  >
                    Telegram
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    {copied ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Share2 className="mr-1.5 h-3.5 w-3.5" /> Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Related Mock Test Call to Action */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Badge className="bg-accent text-accent-foreground mb-2">Practice Now</Badge>
                <h3 className="text-lg font-bold text-primary">
                  Ready to test your knowledge on this syllabus?
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                  Attempt timed, negative-marking enabled mock tests matching the latest official pattern on SarkariExamHub.
                </p>
              </div>

              <Button asChild className="bg-primary text-primary-foreground shrink-0">
                <Link href="/mock-tests">
                  <GraduationCap className="mr-2 h-4 w-4 text-accent" /> Start Mock Test
                </Link>
              </Button>
            </div>
          </main>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Practice Card */}
            <Card className="border-primary/20 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-accent" />
                  <h3 className="font-bold text-sm text-foreground">SarkariExamHub Test Series</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Boost your exam percentile with full-length sectional tests, detailed solutions, and all-India rank percentiles.
                </p>
                <Button asChild size="sm" className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/test-series">Explore Test Series</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Official Source Citations Box */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-foreground">Official Source Citations</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {article.source_references?.map((src, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        {src.title} <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Related Articles in same Category */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <h3 className="font-bold text-sm text-foreground mb-3">
                  More in {article.category_name}
                </h3>
                <div className="space-y-3">
                  {articles
                    .filter((a) => a.id !== article.id && a.status === 'published')
                    .slice(0, 4)
                    .map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/articles/${rel.slug}`}
                        className="block rounded-lg p-2.5 hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                      >
                        <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{rel.read_time_minutes} min read</span>
                          <span>&middot;</span>
                          <span>{new Date(rel.published_at || rel.created_at).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
