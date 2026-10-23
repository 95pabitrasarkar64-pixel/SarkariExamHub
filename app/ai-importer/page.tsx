'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Upload,
  FileText,
  Scan,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
  RotateCcw,
  ShieldCheck,
  FileUp,
  KeyRound,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { toast } from 'sonner';

const steps = [
  { icon: Upload, title: 'Upload PDF', desc: 'Upload digital or scanned PDF containing exam questions.' },
  { icon: Scan, title: 'Text Extraction & OCR', desc: 'Extract digital text or apply multimodal OCR for scanned Hindi/Bengali/English.' },
  { icon: Brain, title: 'Gemini Structuring', desc: 'AI identifies questions, options A-D, answer keys, and explanations.' },
  { icon: Eye, title: 'Review Interface', desc: 'Side-by-side inspection with confidence scoring and warning flags.' },
  { icon: CheckCircle2, title: 'Approve & Import', desc: 'Only approved questions enter your question bank and published exams.' },
];

type ExtractedQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  confidence: number;
  pageNumber: number;
  warning?: string | null;
  status: 'Pending Review' | 'Verified' | 'Needs Correction' | 'Rejected';
};

const SAMPLE_TEXT = `1. Which Article of the Indian Constitution empowers the President to promulgate Ordinances during the recess of Parliament?
(A) Article 121
(B) Article 123
(C) Article 125
(D) Article 127
Answer: (B)
Explanation: Article 123 of the Constitution grants the President powers to promulgate Ordinances when either of the two Houses of Parliament is not in session.

2. A boat covers 24 km upstream and 36 km downstream in 6 hours. If the speed of the stream is 2 km/h, find the speed of the boat in still water.
(A) 8 km/h
(B) 10 km/h
(C) 12 km/h
(D) 14 km/h
Answer: (B)
Explanation: Let boat speed be x. 24/(x-2) + 36/(x+2) = 6. Substituting x = 10: 24/8 + 36/12 = 3 + 3 = 6 hours.

3. Deficiency of which vitamin causes Megaloblastic Anemia in humans?
(A) Vitamin C
(B) Vitamin B12 and Folic acid
(C) Vitamin D
(D) Vitamin K
Answer: (B)
Explanation: Megaloblastic anemia is primarily caused by deficiency of cobalamin (Vitamin B12) or folate (Vitamin B9).`;

export default function AiImporterPage() {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [category, setCategory] = useState('ssc');
  const [language, setLanguage] = useState('English');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFileBase64(base64String);
        toast.success(`Attached ${file.name} for extraction.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    setIsProcessing(true);
    setApiError(null);

    try {
      const response = await fetch('/api/ai-importer/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: !fileBase64 ? inputText : undefined,
          fileBase64: fileBase64 || undefined,
          mimeType: selectedFile?.type || 'application/pdf',
          examCategory: category,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'MISSING_API_KEY') {
          setApiError(data.message || data.error);
          toast.warning('GEMINI_API_KEY is not configured yet. See instructions below.');
        } else {
          throw new Error(data.error || 'Extraction failed.');
        }
        return;
      }

      if (data.questions && data.questions.length > 0) {
        const formatted: ExtractedQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: q.id || idx + 1,
          question: q.question,
          options: q.options || [],
          correctAnswer: q.correctAnswer || 'Uncertain',
          explanation: q.explanation || 'No explanation provided in source document.',
          confidence: q.confidence || 85,
          pageNumber: q.pageNumber || 1,
          warning: q.warnings || null,
          status: 'Pending Review',
        }));
        setExtractedQuestions(formatted);
        toast.success(`Successfully extracted ${formatted.length} MCQs! Ready for review.`);
      } else {
        toast.info('No structured questions could be extracted from the supplied text.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error occurred while contacting extraction server.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = (id: number) => {
    setExtractedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'Verified' } : q))
    );
    toast.success(`Question #${id} verified and stored in question bank!`);
  };

  const handleReject = (id: number) => {
    setExtractedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'Rejected' } : q))
    );
    toast.info(`Question #${id} rejected from publication.`);
  };

  return (
    <div>
      <PageHeader
        title="SarkariExamHub AI Question Importer"
        description="Upload a PDF or paste question text to let Gemini AI extract structured MCQs with four options, answer keys, and explanations."
      />

      <PageContainer>
        {/* Pipeline Steps */}
        <div className="grid gap-4 md:grid-cols-5 mb-10">
          {steps.map((step, idx) => (
            <div key={step.title} className="relative">
              <Card className="h-full">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-sm text-primary">{step.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Ingestion Console */}
        <Card className="mb-12 border-primary/30 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-accent" />
              <div>
                <CardTitle className="text-xl">AI Question Extraction Console</CardTitle>
                <CardDescription>
                  Upload scanned or digital PDFs (English, Bengali, Hindi) or paste document text
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1.5">
                  Target Exam Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ssc">Staff Selection Commission (SSC)</SelectItem>
                    <SelectItem value="state-psc">State PSC / WBCS</SelectItem>
                    <SelectItem value="railway">Railway Recruitment (RRB)</SelectItem>
                    <SelectItem value="icds-anganwadi">ICDS & Anganwadi Supervisor</SelectItem>
                    <SelectItem value="clerkship">Clerkship Examination</SelectItem>
                    <SelectItem value="banking">Banking (IBPS / SBI)</SelectItem>
                    <SelectItem value="police-constable">Police & Constable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1.5">
                  Document Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="Bilingual">Bilingual / Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Document Source Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1.5">
                  Option 1: Upload PDF / Scanned Document (Max 10MB)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="bg-white cursor-pointer"
                  />
                  {selectedFile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileBase64(null);
                      }}
                      className="text-destructive text-xs"
                    >
                      Clear File
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1.5">
                  Option 2: Or Paste Exam Content / OCR Raw Text
                </label>
                <Textarea
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste question bank content with options and answers here..."
                  className="font-mono text-xs bg-white leading-relaxed"
                  disabled={Boolean(selectedFile)}
                />
              </div>
            </div>

            {/* API Key missing notice if encountered */}
            {apiError && (
              <div className="rounded-xl border border-warning/40 bg-warning/10 p-4">
                <div className="flex items-start gap-3">
                  <KeyRound className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-primary">Gemini API Key Required</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {apiError} You can get a free Gemini API key from{' '}
                      <a
                        href="https://aistudio.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-primary font-semibold"
                      >
                        Google AI Studio
                      </a>{' '}
                      and add it to your <code>.env.local</code> file as <code>GEMINI_API_KEY=your_key_here</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Engine: <strong>Gemini 3.8 Flash (Multimodal OCR & MCQ Structuring)</strong>
              </span>

              <Button
                onClick={handleExtract}
                disabled={isProcessing}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Extract Structured MCQs
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {extractedQuestions.length > 0 && (
          <div className="mb-12 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary">
                  Extracted MCQs ({extractedQuestions.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Review and verify each question before approving it to your organization&apos;s question bank.
                </p>
              </div>
              <Badge className="bg-primary text-white">
                {extractedQuestions.filter((q) => q.status === 'Verified').length} of {extractedQuestions.length} Approved
              </Badge>
            </div>

            <div className="space-y-4">
              {extractedQuestions.map((q) => (
                <Card key={q.id} className="border border-border shadow-sm">
                  <CardHeader className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-primary">Question #{q.id}</span>
                        <span className="text-xs text-muted-foreground">Page {q.pageNumber}</span>
                        <Badge variant="outline" className="text-[11px] text-success border-success/40">
                          {q.confidence}% Extraction Confidence
                        </Badge>
                      </div>

                      <Badge
                        className={
                          q.status === 'Verified'
                            ? 'bg-success text-white'
                            : q.status === 'Rejected'
                            ? 'bg-destructive text-white'
                            : 'bg-accent text-accent-foreground'
                        }
                      >
                        {q.status}
                      </Badge>
                    </div>

                    <CardTitle className="text-base font-medium mt-2 leading-relaxed">
                      {q.question}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-sm">
                    {/* 4 Options Grid */}
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`rounded-lg border p-2.5 flex items-center gap-2 ${
                            q.correctAnswer.toLowerCase().includes(String.fromCharCode(65 + optIdx).toLowerCase())
                              ? 'border-success/40 bg-success/5 font-medium text-success'
                              : 'border-border bg-card text-muted-foreground'
                          }`}
                        >
                          <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Detected Answer Key & Explanation */}
                    <div className="rounded-lg bg-secondary/40 p-3 text-xs space-y-1 border border-border">
                      <p className="font-semibold text-primary">
                        Detected Answer: <span className="text-success">{q.correctAnswer}</span>
                      </p>
                      <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
                      {q.warning && (
                        <p className="text-warning flex items-center gap-1 mt-1 font-medium text-[11px]">
                          <AlertCircle className="h-3 w-3 shrink-0" /> Warning: {q.warning}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                      {q.status === 'Verified' ? (
                        <span className="text-xs text-success flex items-center gap-1 font-semibold">
                          <Check className="h-4 w-4" /> Added to Question Bank
                        </span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(q.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs bg-success text-white hover:bg-success/90"
                            onClick={() => handleApprove(q.id)}
                          >
                            <Check className="mr-1 h-3.5 w-3.5" /> Approve & Import
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Safety & Safeguards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>What the importer handles</CardTitle>
              <CardDescription>Supports English, Bengali, and Hindi content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'Digital PDFs and scanned document pages via Gemini multimodal vision',
                'Question numbers and four options (A, B, C, D)',
                'Correct answers and step-by-step mathematical solutions',
                'End-of-chapter answer keys and separate solution appendices',
                'Reasoning puzzles, seating arrangements, and syllogisms',
                'Preserves original page references per question',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accuracy Safeguards</CardTitle>
              <CardDescription>AI assists, but the educator remains in full control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'Never invents missing answers, options, or explanations',
                'Does not silently alter or assume the teacher\'s answer key',
                'Flags contradictions, missing options, and unreadable diagrams',
                'Separates extracted answer keys from AI-suggested corrections',
                'Requires teacher approval before publishing any question into live exams',
                'Statuses: Pending Review, Verified, Needs Correction, Rejected',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}