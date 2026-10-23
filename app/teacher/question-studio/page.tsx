'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Languages,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Eye,
  Edit3,
  ArrowRight,
  BookOpen,
  ArrowLeftRight,
  Check,
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
import { SUPPORTED_LANGUAGES, getLanguage, isRTL } from '@/lib/languages';
import { INITIAL_MULTILINGUAL_QUESTIONS } from '@/lib/question-bank-data';
import { MultilingualQuestion, LanguageCode, QuestionTranslation } from '@/lib/types';
import { examCategoryInfo } from '@/lib/navigation';

export default function MultilingualQuestionStudioPage() {
  const [questions, setQuestions] = useState<MultilingualQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [targetLang, setTargetLang] = useState<LanguageCode>('bn');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [csvText, setCsvText] = useState<string>('');

  // Editable fields for translation in side-by-side view
  const [editTranslation, setEditTranslation] = useState<{
    question: string;
    options: [string, string, string, string];
    explanation: string;
    status: 'pending_review' | 'verified' | 'rejected';
    review_notes: string;
  }>({
    question: '',
    options: ['', '', '', ''],
    explanation: '',
    status: 'pending_review',
    review_notes: '',
  });

  // Load from localStorage or INITIAL_MULTILINGUAL_QUESTIONS
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sarkari_multilingual_questions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          setSelectedQuestionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    setQuestions(INITIAL_MULTILINGUAL_QUESTIONS);
    setSelectedQuestionId(INITIAL_MULTILINGUAL_QUESTIONS[0].id);
  }, []);

  // Save to localStorage whenever questions change
  const saveQuestions = (updated: MultilingualQuestion[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem('sarkari_multilingual_questions', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
  };

  const selectedQuestion = useMemo(() => {
    return questions.find((q) => q.id === selectedQuestionId) || questions[0];
  }, [questions, selectedQuestionId]);

  // Sync edit state whenever selected question or target language changes
  useEffect(() => {
    if (!selectedQuestion) return;
    const existing = selectedQuestion.translations[targetLang];
    if (existing) {
      setEditTranslation({
        question: existing.question,
        options: [...existing.options] as [string, string, string, string],
        explanation: existing.explanation || '',
        status: existing.status,
        review_notes: existing.review_notes || '',
      });
    } else {
      // Empty draft
      setEditTranslation({
        question: '',
        options: ['', '', '', ''],
        explanation: '',
        status: 'pending_review',
        review_notes: 'Translation not yet created for this language.',
      });
    }
  }, [selectedQuestion, targetLang]);

  // Trigger Gemini AI Translation
  const handleAITranslate = async () => {
    if (!selectedQuestion) return;
    const srcLang = selectedQuestion.source_language || 'en';
    const srcTranslation = selectedQuestion.translations[srcLang] || Object.values(selectedQuestion.translations)[0];

    if (!srcTranslation) return;

    setIsTranslating(true);
    try {
      const res = await fetch('/api/questions/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLanguage: srcLang,
          targetLanguage: targetLang,
          question: srcTranslation.question,
          options: srcTranslation.options,
          correctOption: selectedQuestion.correct_option,
          explanation: srcTranslation.explanation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newTrans: QuestionTranslation = {
          language_code: targetLang,
          question: data.translatedQuestion,
          options: data.translatedOptions,
          explanation: data.translatedExplanation,
          status: 'pending_review',
          review_notes: data.translationNotes,
        };

        const updatedQuestions = questions.map((q) => {
          if (q.id === selectedQuestion.id) {
            return {
              ...q,
              translations: {
                ...q.translations,
                [targetLang]: newTrans,
              },
              updated_at: new Date().toISOString(),
            };
          }
          return q;
        });

        saveQuestions(updatedQuestions);
        setEditTranslation({
          question: newTrans.question,
          options: newTrans.options,
          explanation: newTrans.explanation,
          status: 'pending_review',
          review_notes: data.translationNotes,
        });
      } else {
        alert(data.error || 'Failed to translate question');
      }
    } catch (err: any) {
      alert('Translation service error: ' + err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  // Update translation status (Verified, Pending, Rejected)
  const handleSaveTranslationStatus = (status: 'pending_review' | 'verified' | 'rejected') => {
    if (!selectedQuestion) return;

    const newTrans: QuestionTranslation = {
      language_code: targetLang,
      question: editTranslation.question,
      options: editTranslation.options,
      explanation: editTranslation.explanation,
      status,
      review_notes: editTranslation.review_notes,
      verified_by: status === 'verified' ? 'Educator Verified' : undefined,
      verified_at: status === 'verified' ? new Date().toISOString() : undefined,
    };

    const updatedQuestions = questions.map((q) => {
      if (q.id === selectedQuestion.id) {
        return {
          ...q,
          translations: {
            ...q.translations,
            [targetLang]: newTrans,
          },
          updated_at: new Date().toISOString(),
        };
      }
      return q;
    });

    saveQuestions(updatedQuestions);
    setEditTranslation((prev) => ({ ...prev, status }));
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const srcText = q.translations[q.source_language]?.question || '';
      const matchesSearch =
        q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srcText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.topic && q.topic.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject = filterSubject === 'all' || q.category_slug === filterSubject;
      const targetTrans = q.translations[targetLang];
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'untranslated' && !targetTrans) ||
        (targetTrans && targetTrans.status === filterStatus);

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [questions, searchQuery, filterSubject, filterStatus, targetLang]);

  // Form state for creating a new question
  const [newQuestionForm, setNewQuestionForm] = useState({
    subject: 'General Awareness',
    category_slug: 'state-psc',
    topic: '',
    difficulty: 'Moderate' as 'Easy' | 'Moderate' | 'Hard',
    correct_option: 0,
    source_language: 'en' as LanguageCode,
    question: '',
    opt0: '',
    opt1: '',
    opt2: '',
    opt3: '',
    explanation: '',
    page_ref: '',
  });

  const handleCreateQuestion = () => {
    if (!newQuestionForm.question || !newQuestionForm.opt0 || !newQuestionForm.opt1) {
      alert('Please fill question and at least 2 options');
      return;
    }

    const newQ: MultilingualQuestion = {
      id: `mq-${Date.now()}`,
      source_language: newQuestionForm.source_language,
      category_slug: newQuestionForm.category_slug,
      subject: newQuestionForm.subject,
      topic: newQuestionForm.topic || undefined,
      difficulty: newQuestionForm.difficulty,
      correct_option: newQuestionForm.correct_option,
      page_ref: newQuestionForm.page_ref || undefined,
      translations: {
        [newQuestionForm.source_language]: {
          language_code: newQuestionForm.source_language,
          question: newQuestionForm.question,
          options: [
            newQuestionForm.opt0,
            newQuestionForm.opt1,
            newQuestionForm.opt2 || 'None of the above',
            newQuestionForm.opt3 || 'All of the above',
          ],
          explanation: newQuestionForm.explanation,
          status: 'verified',
          verified_by: 'Author',
          verified_at: new Date().toISOString(),
        },
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveQuestions([newQ, ...questions]);
    setSelectedQuestionId(newQ.id);
    setShowNewModal(false);
  };

  // CSV Import handler
  const handleImportCSV = () => {
    if (!csvText.trim()) return;
    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    const imported: MultilingualQuestion[] = [];

    // Parse CSV lines
    lines.forEach((line, index) => {
      // skip header if present
      if (index === 0 && (line.toLowerCase().includes('question') || line.toLowerCase().includes('opt'))) {
        return;
      }
      const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 6) {
        const [q, o0, o1, o2, o3, corr, exp, subj, cat] = parts;
        imported.push({
          id: `csv-${Date.now()}-${index}`,
          source_language: 'en',
          category_slug: cat || 'state-psc',
          subject: subj || 'General Studies',
          difficulty: 'Moderate',
          correct_option: parseInt(corr, 10) || 0,
          translations: {
            en: {
              language_code: 'en',
              question: q,
              options: [o0 || '', o1 || '', o2 || '', o3 || ''],
              explanation: exp || '',
              status: 'pending_review',
            },
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    });

    if (imported.length > 0) {
      saveQuestions([...imported, ...questions]);
      setSelectedQuestionId(imported[0].id);
      setShowImportModal(false);
      setCsvText('');
      alert(`Successfully imported ${imported.length} questions into the Multilingual Question Bank!`);
    } else {
      alert('Could not parse valid questions. Please format as: Question, OptionA, OptionB, OptionC, OptionD, CorrectIndex(0-3), Explanation, Subject, Category');
    }
  };

  const targetLangMeta = getLanguage(targetLang);
  const targetIsRTL = isRTL(targetLang);

  return (
    <div>
      <PageHeader
        title="Multilingual Question Studio"
        description="Create, translate, and verify competitive examination questions across 15 Indian languages with side-by-side integrity review."
      >
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button onClick={() => setShowNewModal(true)} className="bg-primary text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> New Question
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Import CSV / Excel
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teacher">
              <ArrowRight className="mr-2 h-4 w-4" /> Teacher Portal
            </Link>
          </Button>
        </div>
      </PageHeader>

      <PageContainer>
        {/* Languages Toolbar */}
        <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-foreground">Target Review Language:</span>
              <Select value={targetLang} onValueChange={(v: string) => setTargetLang(v as LanguageCode)}>
                <SelectTrigger className="w-56 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="font-semibold">{lang.nativeName}</span> ({lang.name})
                      {lang.dir === 'rtl' ? ' [RTL]' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs sm:text-sm"
                />
              </div>

              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-40 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(examCategoryInfo).map(([slug, info]) => (
                    <SelectItem key={slug} value={slug}>
                      {info.name}
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
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="untranslated">Untranslated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Studio Grid: Questions List + Side-by-Side Reviewer */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Question Bank Items (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Questions ({filteredQuestions.length})
              </p>
              <Badge variant="secondary" className="text-[11px]">
                Target: {targetLangMeta.name}
              </Badge>
            </div>

            <div className="max-h-[750px] space-y-2.5 overflow-y-auto pr-1">
              {filteredQuestions.map((q) => {
                const isSelected = q.id === selectedQuestion?.id;
                const srcTrans = q.translations[q.source_language] || Object.values(q.translations)[0];
                const targetTrans = q.translations[targetLang];

                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-tight">
                        {q.subject}
                      </Badge>
                      {targetTrans ? (
                        targetTrans.status === 'verified' ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </span>
                        ) : targetTrans.status === 'rejected' ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                            <AlertTriangle className="h-3 w-3" /> Pending
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] font-medium text-muted-foreground">Untranslated</span>
                      )}
                    </div>

                    <p className="line-clamp-2 text-xs font-medium text-foreground">
                      {srcTrans?.question || 'Empty Question'}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Diff: {q.difficulty}</span>
                      <div className="flex gap-1">
                        {Object.keys(q.translations).map((code) => (
                          <span
                            key={code}
                            className={`rounded px-1 text-[9px] font-bold uppercase ${
                              code === targetLang
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredQuestions.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No questions match your filter criteria.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Side-by-Side Question & Translation Review (8 cols) */}
          <div className="lg:col-span-8">
            {selectedQuestion ? (
              <Card className="border-border">
                <CardHeader className="border-b bg-muted/30 pb-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground">{selectedQuestion.subject}</Badge>
                        {selectedQuestion.topic && <Badge variant="outline">{selectedQuestion.topic}</Badge>}
                        <Badge variant="secondary">{selectedQuestion.difficulty}</Badge>
                      </div>
                      <CardTitle className="mt-2 text-base font-bold text-foreground">
                        Translation & Option-Mapping Verification
                      </CardTitle>
                    </div>

                    <Button
                      onClick={handleAITranslate}
                      disabled={isTranslating}
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {isTranslating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Translating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" /> AI Translate to {targetLangMeta.name}
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Side-by-Side Comparison Container */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Source Question (English or original) */}
                    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Original ({getLanguage(selectedQuestion.source_language).name})
                        </span>
                        <Badge variant="secondary" className="text-[10px]">Source</Badge>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Question Statement</Label>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {selectedQuestion.translations[selectedQuestion.source_language]?.question ||
                            Object.values(selectedQuestion.translations)[0]?.question}
                        </p>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Options (A-D)</Label>
                        <div className="mt-2 space-y-2">
                          {(
                            selectedQuestion.translations[selectedQuestion.source_language]?.options ||
                            Object.values(selectedQuestion.translations)[0]?.options ||
                            []
                          ).map((opt, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 rounded-md border p-2 text-xs font-medium ${
                                i === selectedQuestion.correct_option
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200'
                                  : 'border-border bg-card'
                              }`}
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-[10px]">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {i === selectedQuestion.correct_option && (
                                <Badge className="bg-emerald-600 text-[9px]">Correct</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Official Explanation</Label>
                        <p className="mt-1 rounded border bg-card p-2 text-xs text-muted-foreground">
                          {selectedQuestion.translations[selectedQuestion.source_language]?.explanation ||
                            'No explanation provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Target Translation Review & Edit */}
                    <div
                      className={`space-y-4 rounded-lg border p-4 ${
                        targetIsRTL ? 'border-primary/40 bg-accent/5' : 'border-border bg-card'
                      }`}
                      dir={targetIsRTL ? 'rtl' : 'ltr'}
                    >
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent">
                          {targetLangMeta.nativeName} ({targetLangMeta.name})
                          {targetIsRTL ? ' [RTL Mode]' : ''}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {editTranslation.status === 'verified' && (
                            <Badge className="bg-emerald-600 text-[10px]">Verified</Badge>
                          )}
                          {editTranslation.status === 'pending_review' && (
                            <Badge variant="outline" className="border-amber-500 text-amber-600 text-[10px]">
                              Pending Review
                            </Badge>
                          )}
                          {editTranslation.status === 'rejected' && (
                            <Badge variant="destructive" className="text-[10px]">
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Translated Question Statement
                        </Label>
                        <Textarea
                          value={editTranslation.question}
                          onChange={(e) =>
                            setEditTranslation((prev) => ({ ...prev, question: e.target.value }))
                          }
                          placeholder={`Enter or generate ${targetLangMeta.name} translation...`}
                          className="mt-1 min-h-[70px] text-sm font-medium"
                          dir={targetIsRTL ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Translated Options (Must preserve 1:1 match)
                        </Label>
                        <div className="mt-2 space-y-2">
                          {editTranslation.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-[10px]">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <Input
                                value={opt}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditTranslation((prev) => {
                                    const nextOpts = [...prev.options] as [string, string, string, string];
                                    nextOpts[i] = val;
                                    return { ...prev, options: nextOpts };
                                  });
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + i)} in ${targetLangMeta.name}`}
                                className={`text-xs ${
                                  i === selectedQuestion.correct_option ? 'border-emerald-500' : ''
                                }`}
                                dir={targetIsRTL ? 'rtl' : 'ltr'}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Translated Explanation
                        </Label>
                        <Textarea
                          value={editTranslation.explanation}
                          onChange={(e) =>
                            setEditTranslation((prev) => ({ ...prev, explanation: e.target.value }))
                          }
                          placeholder={`Explanation in ${targetLangMeta.name}...`}
                          className="mt-1 min-h-[60px] text-xs"
                          dir={targetIsRTL ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Reviewer Notes</Label>
                        <Input
                          value={editTranslation.review_notes}
                          onChange={(e) =>
                            setEditTranslation((prev) => ({ ...prev, review_notes: e.target.value }))
                          }
                          placeholder="e.g. Verified mathematical terms and option mapping."
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Teacher Verification Actions */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ArrowLeftRight className="h-4 w-4 text-primary" />
                      <span>Option A in source strictly maps to Option A in translation.</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSaveTranslationStatus('rejected')}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveTranslationStatus('pending_review')}
                      >
                        <AlertTriangle className="mr-1.5 h-4 w-4 text-amber-500" /> Save as Pending
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleSaveTranslationStatus('verified')}
                      >
                        <Check className="mr-1.5 h-4 w-4" /> Verify & Publish Translation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                Select a question from the left sidebar to start review.
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {/* New Question Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Multilingual Master Question</DialogTitle>
            <DialogDescription>
              Create the master question in your primary language. You can then translate it into 15 Indian languages using AI.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exam Category</Label>
                <Select
                  value={newQuestionForm.category_slug}
                  onValueChange={(v: string) => setNewQuestionForm((p) => ({ ...p, category_slug: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(examCategoryInfo).map(([slug, info]) => (
                      <SelectItem key={slug} value={slug}>
                        {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  className="mt-1"
                  value={newQuestionForm.subject}
                  onChange={(e) => setNewQuestionForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Indian National Movement"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Topic</Label>
                <Input
                  className="mt-1"
                  value={newQuestionForm.topic}
                  onChange={(e) => setNewQuestionForm((p) => ({ ...p, topic: e.target.value }))}
                  placeholder="e.g. Partition of Bengal"
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select
                  value={newQuestionForm.difficulty}
                  onValueChange={(v: 'Easy' | 'Moderate' | 'Hard') =>
                    setNewQuestionForm((p) => ({ ...p, difficulty: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Source Language</Label>
                <Select
                  value={newQuestionForm.source_language}
                  onValueChange={(v: LanguageCode) =>
                    setNewQuestionForm((p) => ({ ...p, source_language: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name} ({l.nativeName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Question Statement *</Label>
              <Textarea
                className="mt-1"
                rows={3}
                value={newQuestionForm.question}
                onChange={(e) => setNewQuestionForm((p) => ({ ...p, question: e.target.value }))}
                placeholder="Enter complete question text..."
              />
            </div>

            <div className="space-y-2">
              <Label>Four Options * (Mark the correct radio)</Label>
              {[0, 1, 2, 3].map((idx) => {
                const key = `opt${idx}` as 'opt0' | 'opt1' | 'opt2' | 'opt3';
                const isCorrect = newQuestionForm.correct_option === idx;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNewQuestionForm((p) => ({ ...p, correct_option: idx }))}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      value={newQuestionForm[key]}
                      onChange={(e) => setNewQuestionForm((p) => ({ ...p, [key]: e.target.value }))}
                      className={isCorrect ? 'border-emerald-500' : ''}
                    />
                    {isCorrect && <Badge className="bg-emerald-600 text-[10px]">Correct</Badge>}
                  </div>
                );
              })}
            </div>

            <div>
              <Label>Explanation</Label>
              <Textarea
                className="mt-1"
                rows={2}
                value={newQuestionForm.explanation}
                onChange={(e) => setNewQuestionForm((p) => ({ ...p, explanation: e.target.value }))}
                placeholder="Detailed rationale for why this option is correct..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuestion} className="bg-primary text-primary-foreground">
              Save Master Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Import Questions from CSV</DialogTitle>
            <DialogDescription>
              Paste comma-separated rows. Format:
              <br />
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                Question, OptionA, OptionB, OptionC, OptionD, CorrectIndex(0-3), Explanation, Subject, Category
              </code>
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`"What is the SI unit of power?","Joule","Watt","Newton","Pascal",1,"Watt is Joule per second.","General Science","railway"`}
              className="font-mono text-xs"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportCSV} className="bg-primary text-primary-foreground">
              Import Rows
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
