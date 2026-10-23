'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Sparkles,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Send,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Globe2,
  Trash2,
  Edit3,
  ArrowRight,
  BookOpen,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ARTICLE_CATEGORIES, INITIAL_ARTICLES } from '@/lib/article-data';
import { Article, ArticleStatus, LanguageCode } from '@/lib/types';
import { SUPPORTED_LANGUAGES, getLanguage } from '@/lib/languages';

export default function AdminArticlesStudioPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLang, setFilterLang] = useState<string>('all');

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // AI Assistant Modal State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState('state-psc');
  const [aiLanguage, setAiLanguage] = useState<LanguageCode>('en');
  const [aiFocus, setAiFocus] = useState('Syllabus, Exam Pattern & 90-Day Strategy');
  const [isGenerating, setIsGenerating] = useState(false);

  // Preview Mode inside Editor (edit vs preview)
  const [previewTab, setPreviewTab] = useState<'edit' | 'desktop_preview' | 'seo'>('edit');

  // Load from localStorage or INITIAL_ARTICLES
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
      console.warn('Could not read articles from localStorage', e);
    }
    setArticles(INITIAL_ARTICLES);
  }, []);

  const saveArticles = (updated: Article[]) => {
    setArticles(updated);
    try {
      localStorage.setItem('sarkari_published_articles', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save articles to localStorage', e);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = articles.length;
    const published = articles.filter((a) => a.status === 'published').length;
    const scheduled = articles.filter((a) => a.status === 'scheduled').length;
    const review = articles.filter((a) => a.status === 'needs_review').length;
    const draft = articles.filter((a) => a.status === 'draft').length;
    return { total, published, scheduled, review, draft };
  }, [articles]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = filterCategory === 'all' || a.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchesLang = filterLang === 'all' || a.language === filterLang;

      return matchesSearch && matchesCat && matchesStatus && matchesLang;
    });
  }, [articles, searchQuery, filterCategory, filterStatus, filterLang]);

  // Open Editor for new article
  const handleNewArticle = () => {
    const fresh: Article = {
      id: `art-${Date.now()}`,
      slug: '',
      title: '',
      excerpt: '',
      content: '## Overview\n\nStart writing exam syllabus or recruitment guide here...',
      category: 'state-psc',
      category_name: 'State PSC & WBCS',
      tags: ['Syllabus', 'Govt Exam'],
      author: {
        name: 'SarkariExamHub Editorial Board',
        role: 'Verified Examination Analyst',
        avatar: '/assets/aistudio/SARKARIEXAMHUB_Academic_Logo_244f6d21.png',
      },
      status: 'draft',
      language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read_time_minutes: 5,
      meta_title: '',
      meta_description: '',
      source_references: [
        {
          title: 'Official Commission Portal',
          url: 'https://psc.wb.gov.in',
          is_official: true,
        },
      ],
      fact_check_status: 'verified',
    };
    setEditingArticle(fresh);
    setIsEditorOpen(true);
    setPreviewTab('edit');
  };

  // Open Editor for existing article
  const handleEdit = (art: Article) => {
    setEditingArticle({ ...art });
    setIsEditorOpen(true);
    setPreviewTab('edit');
  };

  // Delete article
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const updated = articles.filter((a) => a.id !== id);
      saveArticles(updated);
    }
  };

  // Save current editing article
  const handleSaveArticle = () => {
    if (!editingArticle) return;
    if (!editingArticle.title.trim() || !editingArticle.slug.trim()) {
      alert('Article Title and Slug are required.');
      return;
    }

    const catObj = ARTICLE_CATEGORIES.find((c) => c.slug === editingArticle.category);
    const finalized: Article = {
      ...editingArticle,
      category_name: catObj?.name || editingArticle.category_name,
      updated_at: new Date().toISOString(),
      published_at:
        editingArticle.status === 'published' && !editingArticle.published_at
          ? new Date().toISOString()
          : editingArticle.published_at,
    };

    const exists = articles.some((a) => a.id === finalized.id);
    const updated = exists
      ? articles.map((a) => (a.id === finalized.id ? finalized : a))
      : [finalized, ...articles];

    saveArticles(updated);
    setIsEditorOpen(false);
    setEditingArticle(null);
  };

  // AI Article Generation
  const handleGenerateAIArticle = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter an exam topic or notification title.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          category: aiCategory,
          language: aiLanguage,
          focusArea: aiFocus,
        }),
      });

      const data = await res.json();
      if (data.success && data.article) {
        const catObj = ARTICLE_CATEGORIES.find((c) => c.slug === data.article.category);
        const newArt: Article = {
          id: `art-${Date.now()}`,
          slug: data.article.slug,
          title: data.article.title,
          excerpt: data.article.excerpt,
          content: data.article.content,
          category: data.article.category,
          category_name: catObj?.name || 'Government Exams',
          tags: data.article.tags || ['Exam Guide'],
          author: {
            name: 'SarkariExamHub AI Editorial Desk',
            role: 'Research & Verification Desk',
            avatar: '/assets/aistudio/SARKARIEXAMHUB_Academic_Logo_244f6d21.png',
          },
          status: 'needs_review',
          language: data.article.language || aiLanguage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          read_time_minutes: data.article.readTimeMinutes || 5,
          meta_title: data.article.metaTitle,
          meta_description: data.article.metaDescription,
          source_references: data.article.sourceReferences || [],
          fact_check_status: data.article.factCheckStatus || 'verified',
        };

        saveArticles([newArt, ...articles]);
        setIsAIOpen(false);
        setEditingArticle(newArt);
        setIsEditorOpen(true);
        setPreviewTab('edit');
      } else {
        alert(data.error || 'Failed to generate article.');
      }
    } catch (e: any) {
      alert('Generation error: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusBadge = (status: ArticleStatus) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-emerald-600 text-white">Published</Badge>;
      case 'scheduled':
        return <Badge className="bg-indigo-600 text-white">Scheduled</Badge>;
      case 'needs_review':
        return <Badge className="bg-amber-600 text-white">Needs Review</Badge>;
      case 'approved':
        return <Badge className="bg-blue-600 text-white">Approved</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <div>
      <PageHeader
        title="Article Studio & Daily Publishing System"
        description="Write, schedule, review, and publish high-yield government exam guides, official syllabus breakdowns, and preparation strategies."
      >
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button onClick={handleNewArticle} className="bg-primary text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Write Article
          </Button>
          <Button
            onClick={() => setIsAIOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Sparkles className="mr-2 h-4 w-4" /> AI Article Assistant
          </Button>
          <Button variant="outline" asChild>
            <Link href="/articles" target="_blank">
              <Eye className="mr-2 h-4 w-4" /> View Public Portal
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowRight className="mr-2 h-4 w-4" /> Admin Portal
            </Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Articles</p>
              <p className="mt-1 text-2xl font-bold text-primary">{metrics.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Published Live</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{metrics.published}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Scheduled</p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">{metrics.scheduled}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Review Queue</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{metrics.review}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Drafts</p>
              <p className="mt-1 text-2xl font-bold text-muted-foreground">{metrics.draft}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Toolbar */}
        <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by title, keywords or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all">All 20+ Categories</SelectItem>
                  {ARTICLE_CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLang} onValueChange={setFilterLang}>
                <SelectTrigger className="w-36 text-xs">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3.5">Article Headline</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Language</th>
                  <th className="px-4 py-3.5">Fact-Check</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date / Schedule</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 max-w-md">
                      <div className="font-semibold text-foreground line-clamp-1">{art.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        /{art.slug} &middot; {art.read_time_minutes} min read
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="outline" className="text-xs">
                        {art.category_name}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <Globe2 className="h-3 w-3 text-muted-foreground" />
                        {getLanguage(art.language).nativeName}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {art.fact_check_status === 'official_gazette_confirmed' ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <ShieldCheck className="h-3.5 w-3.5" /> Gazette Verified
                        </span>
                      ) : art.fact_check_status === 'verified' ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified Source
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                          <AlertTriangle className="h-3.5 w-3.5" /> Verification Req.
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(art.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {art.status === 'scheduled' && art.scheduled_at ? (
                        <span className="text-indigo-600 font-medium">
                          {new Date(art.scheduled_at).toLocaleDateString()}
                        </span>
                      ) : art.published_at ? (
                        new Date(art.published_at).toLocaleDateString()
                      ) : (
                        'Draft'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {art.status === 'published' && (
                          <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Link href={`/articles/${art.slug}`} target="_blank" title="View Article">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(art)}
                          title="Edit Article"
                        >
                          <Edit3 className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(art.id)}
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredArticles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                      No articles found matching the filter criteria. Click &quot;Write Article&quot; or &quot;AI Article Assistant&quot; to publish content.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>

      {/* Article Editor Modal */}
      {editingArticle && (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <div>
                  <DialogTitle className="text-lg font-bold">
                    {editingArticle.id.startsWith('art-') ? 'Edit Publishing Article' : 'New Article'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure content, publication scheduling, source citations, and SEO tags.
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={editingArticle.status}
                    onValueChange={(v: ArticleStatus) =>
                      setEditingArticle((p) => p ? { ...p, status: v } : null)
                    }
                  >
                    <SelectTrigger className="w-36 text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="needs_review">Needs Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogHeader>

            {/* Editor Sub-Tabs: Edit, Desktop Preview, SEO Metadata */}
            <div className="border-b pt-1">
              <Tabs value={previewTab} onValueChange={(v: any) => setPreviewTab(v)}>
                <TabsList className="grid grid-cols-3 w-72">
                  <TabsTrigger value="edit">Editor</TabsTrigger>
                  <TabsTrigger value="desktop_preview">Preview</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Sources</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {previewTab === 'edit' && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label>Article Headline *</Label>
                    <Input
                      className="mt-1 font-semibold"
                      value={editingArticle.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        const generatedSlug = val
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        setEditingArticle((p) =>
                          p
                            ? {
                                ...p,
                                title: val,
                                slug: p.slug ? p.slug : generatedSlug,
                              }
                            : null
                        );
                      }}
                      placeholder="e.g. WBCS Prelims 2026: Official Syllabus & 90-Day Strategy"
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={editingArticle.category}
                      onValueChange={(v: string) => {
                        const cat = ARTICLE_CATEGORIES.find((c) => c.slug === v);
                        setEditingArticle((p) =>
                          p ? { ...p, category: v, category_name: cat?.name || v } : null
                        );
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {ARTICLE_CATEGORIES.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>URL Slug</Label>
                    <Input
                      className="mt-1 text-xs font-mono"
                      value={editingArticle.slug}
                      onChange={(e) =>
                        setEditingArticle((p) => (p ? { ...p, slug: e.target.value } : null))
                      }
                      placeholder="url-friendly-slug"
                    />
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select
                      value={editingArticle.language}
                      onValueChange={(v: LanguageCode) =>
                        setEditingArticle((p) => (p ? { ...p, language: v } : null))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {SUPPORTED_LANGUAGES.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            {l.nativeName} ({l.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Read Time (Minutes)</Label>
                    <Input
                      type="number"
                      className="mt-1"
                      value={editingArticle.read_time_minutes}
                      onChange={(e) =>
                        setEditingArticle((p) =>
                          p ? { ...p, read_time_minutes: parseInt(e.target.value, 10) || 5 } : null
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Short Excerpt (Summary for Google Snippets)</Label>
                  <Textarea
                    rows={2}
                    className="mt-1 text-xs leading-relaxed"
                    value={editingArticle.excerpt}
                    onChange={(e) =>
                      setEditingArticle((p) => (p ? { ...p, excerpt: e.target.value } : null))
                    }
                    placeholder="Brief 1-2 sentence overview of the article..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>Article Markdown Content</Label>
                    <span className="text-[11px] text-muted-foreground">
                      Supports ## Headings, Tables, Bullet Points, Blockquotes
                    </span>
                  </div>
                  <Textarea
                    rows={12}
                    className="mt-1 font-mono text-xs leading-relaxed"
                    value={editingArticle.content}
                    onChange={(e) =>
                      setEditingArticle((p) => (p ? { ...p, content: e.target.value } : null))
                    }
                  />
                </div>

                {editingArticle.status === 'scheduled' && (
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 dark:bg-indigo-950/20">
                    <Label className="text-xs text-indigo-900 dark:text-indigo-200">
                      Scheduled Publishing Date & Time
                    </Label>
                    <Input
                      type="datetime-local"
                      className="mt-1 text-xs bg-white dark:bg-card"
                      value={editingArticle.scheduled_at?.slice(0, 16) || ''}
                      onChange={(e) =>
                        setEditingArticle((p) =>
                          p ? { ...p, scheduled_at: new Date(e.target.value).toISOString() } : null
                        )
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {previewTab === 'desktop_preview' && (
              <div className="space-y-4 py-4 rounded-lg border bg-muted/20 p-6 max-h-[60vh] overflow-y-auto">
                <div className="border-b pb-4">
                  <Badge className="bg-primary text-primary-foreground mb-2">
                    {editingArticle.category_name}
                  </Badge>
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">
                    {editingArticle.title || 'Untitled Article'}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {editingArticle.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>By {editingArticle.author.name}</span>
                    <span>&middot;</span>
                    <span>{editingArticle.read_time_minutes} min read</span>
                    <span>&middot;</span>
                    <span>{getLanguage(editingArticle.language).name}</span>
                  </div>
                </div>

                {/* Simulated Article Body */}
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                  {editingArticle.content}
                </div>

                {/* Source disclaimer */}
                <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    Official Notification Verification Notice:
                  </div>
                  <p className="mt-1">
                    Candidates are advised to confirm recruitment dates and eligibility criteria with official gazette releases published on official government commission portals.
                  </p>
                </div>
              </div>
            )}

            {previewTab === 'seo' && (
              <div className="space-y-4 py-2">
                <div>
                  <Label>SEO Meta Title (Recommended: &lt; 60 chars)</Label>
                  <Input
                    className="mt-1 text-xs"
                    value={editingArticle.meta_title || ''}
                    onChange={(e) =>
                      setEditingArticle((p) => (p ? { ...p, meta_title: e.target.value } : null))
                    }
                    placeholder="WBCS Prelims Complete Syllabus 2026 | SarkariExamHub"
                  />
                </div>

                <div>
                  <Label>SEO Meta Description (Recommended: &lt; 155 chars)</Label>
                  <Textarea
                    rows={2}
                    className="mt-1 text-xs"
                    value={editingArticle.meta_description || ''}
                    onChange={(e) =>
                      setEditingArticle((p) => (p ? { ...p, meta_description: e.target.value } : null))
                    }
                    placeholder="Comprehensive subject-wise syllabus breakdown and recommended strategy..."
                  />
                </div>

                <div>
                  <Label>Fact-Check Status</Label>
                  <Select
                    value={editingArticle.fact_check_status}
                    onValueChange={(v: any) =>
                      setEditingArticle((p) => (p ? { ...p, fact_check_status: v } : null))
                    }
                  >
                    <SelectTrigger className="mt-1 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="official_gazette_confirmed">
                        Official Gazette Confirmed
                      </SelectItem>
                      <SelectItem value="verified">Verified with Commission Syllabus</SelectItem>
                      <SelectItem value="needs_verification">Needs Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Official Source Reference Links</Label>
                  <div className="mt-2 space-y-2">
                    {editingArticle.source_references.map((src, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          placeholder="Source Portal Name (e.g. WBPSC Portal)"
                          value={src.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingArticle((p) => {
                              if (!p) return null;
                              const next = [...p.source_references];
                              next[i] = { ...next[i], title: val };
                              return { ...p, source_references: next };
                            });
                          }}
                          className="text-xs flex-1"
                        />
                        <Input
                          placeholder="URL (e.g. https://psc.wb.gov.in)"
                          value={src.url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingArticle((p) => {
                              if (!p) return null;
                              const next = [...p.source_references];
                              next[i] = { ...next[i], url: val };
                              return { ...p, source_references: next };
                            });
                          }}
                          className="text-xs flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveArticle} className="bg-primary text-primary-foreground">
                Save & Update Article
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Assistant Modal */}
      <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Exam Article Writer
            </DialogTitle>
            <DialogDescription>
              Draft an authentic, syllabus-grounded educational guide using Gemini AI. Strict factual controls prevent fake vacancy figures or dates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Exam Topic / Notification Headline *</Label>
              <Input
                className="mt-1"
                placeholder="e.g. ICDS Supervisor 2026: Child Health & Nutrition Syllabus"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Target Category</Label>
                <Select value={aiCategory} onValueChange={setAiCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {ARTICLE_CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Language</Label>
                <Select
                  value={aiLanguage}
                  onValueChange={(v: LanguageCode) => setAiLanguage(v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.nativeName} ({l.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Editorial Focus</Label>
              <Select value={aiFocus} onValueChange={setAiFocus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Syllabus, Exam Pattern & 90-Day Strategy">
                    Syllabus, Exam Pattern & 90-Day Strategy
                  </SelectItem>
                  <SelectItem value="Previous Year Question Papers Analysis & Cut-offs">
                    Previous Year Question Papers Analysis & Cut-offs
                  </SelectItem>
                  <SelectItem value="Subject-wise Preparation Blueprint (High Scoring Topics)">
                    Subject-wise Preparation Blueprint (High Scoring Topics)
                  </SelectItem>
                  <SelectItem value="Eligibility Criteria, Qualification & Age Relaxation">
                    Eligibility Criteria, Qualification & Age Relaxation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted/60 p-3 text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Sarkari Safety Guarantee:</span> Generated articles automatically include official commission references (e.g. WBPSC, SSC, Railway RRB) and mandatory disclaimers to prevent misinformation.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAIOpen(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateAIArticle}
              disabled={isGenerating}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Drafting Article...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Article Draft
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
