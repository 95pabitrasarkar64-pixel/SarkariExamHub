'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Timer,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Award,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MOCK_TESTS, MockTest, MockQuestion } from '@/lib/mock-test-data';

function ExamEngine() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get('testId') || 'ssc-cgl-tier1-mini';

  const test: MockTest = useMemo(() => {
    return MOCK_TESTS.find((t) => t.id === testId) || MOCK_TESTS[0];
  }, [testId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });

  const [secondsRemaining, setSecondsRemaining] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeTakenSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  // Mark question as visited when switching
  useEffect(() => {
    setVisited((prev) => ({ ...prev, [currentIndex]: true }));
  }, [currentIndex]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  const handleToggleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleNext = () => {
    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const [serverResult, setServerResult] = useState<any>(null);

  const submitToServer = async () => {
    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test.id,
          answers,
          timeSpentSeconds: timeTakenSeconds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setServerResult(data);
      }
    } catch (e) {
      console.error('Server evaluation error:', e);
    }
    setIsSubmitted(true);
    setShowSubmitModal(false);
  };

  const handleAutoSubmit = () => {
    submitToServer();
  };

  const handleConfirmSubmit = () => {
    submitToServer();
  };

  const handleRestart = () => {
    setAnswers({});
    setMarkedForReview({});
    setVisited({ 0: true });
    setCurrentIndex(0);
    setSecondsRemaining(test.durationMinutes * 60);
    setTimeTakenSeconds(0);
    setServerResult(null);
    setIsSubmitted(false);
  };

  // Score calculations
  const results = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    test.questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans === undefined) {
        unattempted++;
      } else if (ans === q.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const totalScore = Math.max(
      0,
      Number(
        (correct * test.positiveMarks - incorrect * test.negativeMarks).toFixed(2)
      )
    );
    const totalAttempted = correct + incorrect;
    const accuracy =
      totalAttempted > 0
        ? Math.round((correct / totalAttempted) * 100)
        : 0;

    return {
      correct,
      incorrect,
      unattempted,
      totalScore,
      accuracy,
      totalQuestions: test.questions.length,
      maxPossibleScore: test.questions.length * test.positiveMarks,
    };
  }, [answers, test]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = test.questions[currentIndex];

  // If submitted, show the comprehensive Scorecard & Detailed Solutions view
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-secondary/30 py-8 px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header Card */}
          <Card className="border-primary/20">
            <CardHeader className="text-center bg-primary text-white rounded-t-xl py-8">
              <Award className="mx-auto h-12 w-12 text-accent mb-2" />
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Examination Performance Report
              </CardTitle>
              <CardDescription className="text-white/80 text-sm">
                {test.title} &middot; SarkariExamHub Evaluator
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Score summary grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-center">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Marks
                  </p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {results.totalScore}{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      / {results.maxPossibleScore}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{test.positiveMarks} / -{test.negativeMarks} marking
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Accuracy
                  </p>
                  <p className="text-3xl font-bold text-accent mt-1">
                    {results.accuracy}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {results.correct} of {results.correct + results.incorrect} attempted
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Time Spent
                  </p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {formatTime(timeTakenSeconds)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Limit: {test.durationMinutes} mins
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Response Breakdown
                  </p>
                  <div className="flex justify-center gap-3 mt-2 text-xs font-medium">
                    <span className="text-success flex items-center gap-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {results.correct}
                    </span>
                    <span className="text-destructive flex items-center gap-0.5">
                      <XCircle className="h-3.5 w-3.5" /> {results.incorrect}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <HelpCircle className="h-3.5 w-3.5" /> {results.unattempted}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Correct / Wrong / Left
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Retake Test
                </Button>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/mock-tests">
                    <BookOpen className="mr-2 h-4 w-4" /> Browse More Tests
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/student">
                    My Student Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Detailed Solutions & Explanations</h3>
            {test.questions.map((q, idx) => {
              const studentAnswer = answers[idx];
              const isCorrect = studentAnswer === q.correctOption;
              const isUnattempted = studentAnswer === undefined;

              return (
                <Card
                  key={q.id}
                  className={`border-l-4 ${
                    isUnattempted
                      ? 'border-l-muted-foreground/40'
                      : isCorrect
                      ? 'border-l-success'
                      : 'border-l-destructive'
                  }`}
                >
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-primary">
                        Question {idx + 1} &middot; <span className="text-muted-foreground">{q.subject}</span>
                      </span>
                      {isUnattempted ? (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Unattempted
                        </Badge>
                      ) : isCorrect ? (
                        <Badge className="bg-success text-white text-xs">
                          Correct (+{test.positiveMarks})
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive text-white text-xs">
                          Incorrect (-{test.negativeMarks})
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-medium mt-1 leading-relaxed">
                      {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0 text-sm">
                    {/* Options list */}
                    <div className="grid gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isStudentChoice = studentAnswer === optIdx;
                        const isCorrectChoice = q.correctOption === optIdx;

                        let style = 'border-border bg-card';
                        if (isCorrectChoice) {
                          style = 'border-success bg-success/10 font-medium text-success-foreground';
                        } else if (isStudentChoice && !isCorrect) {
                          style = 'border-destructive bg-destructive/10 font-medium text-destructive';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-3 rounded-lg border p-3 ${style}`}
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrectChoice && (
                              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                            )}
                            {isStudentChoice && !isCorrect && (
                              <XCircle className="h-4 w-4 text-destructive shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground border border-border">
                      <strong className="text-primary font-semibold block mb-1">
                        Explanation:
                      </strong>
                      {q.explanation}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Interface
  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      {/* Top sticky test control bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-border px-4 py-3 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-sm sm:text-base text-primary truncate max-w-xs sm:max-w-md">
              {test.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {test.categoryName} &middot; {test.questions.length} Questions &middot; {test.totalMarks} Marks
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer countdown */}
            <div
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-mono font-bold ${
                secondsRemaining < 120
                  ? 'bg-destructive/10 text-destructive animate-pulse'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              <Timer className="h-4 w-4" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="container mx-auto flex-1 p-4 grid gap-6 lg:grid-cols-4">
        {/* Question Panel (3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
          <Card className="flex-1 flex flex-col justify-between">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Question {currentIndex + 1} of {test.questions.length}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-success font-medium">+{test.positiveMarks}</span>
                  <span>/</span>
                  <span className="text-destructive font-medium">-{test.negativeMarks}</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-accent mt-2">
                Subject: {currentQuestion.subject}
              </p>
              <CardTitle className="text-base sm:text-lg font-medium text-primary mt-2 leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-3 flex-1">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left flex items-start gap-3 rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary font-medium text-primary'
                        : 'border-border bg-white hover:border-primary/40 hover:bg-secondary/40 text-foreground'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'border border-muted-foreground/30 text-muted-foreground'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-sm leading-snug">{optionText}</span>
                  </button>
                );
              })}
            </CardContent>

            {/* Bottom action bar */}
            <div className="border-t border-border p-4 bg-secondary/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearResponse}
                  disabled={answers[currentIndex] === undefined}
                >
                  Clear Response
                </Button>
                <Button
                  variant={markedForReview[currentIndex] ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={handleToggleMarkForReview}
                >
                  {markedForReview[currentIndex] ? 'Unmark Review' : 'Mark for Review'}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-white"
                  onClick={handleNext}
                  disabled={currentIndex === test.questions.length - 1}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Question Grid & Legend (1 col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-primary">Question Palette</CardTitle>
              <CardDescription className="text-xs">
                Jump directly to any question
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question numbers grid */}
              <div className="grid grid-cols-5 gap-2">
                {test.questions.map((_, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = answers[idx] !== undefined;
                  const isMarked = markedForReview[idx];
                  const hasVisited = visited[idx];

                  let colorClass = 'bg-secondary text-muted-foreground border-border';
                  if (isMarked) {
                    colorClass = 'bg-accent text-accent-foreground border-accent font-bold';
                  } else if (isAnswered) {
                    colorClass = 'bg-success text-white border-success font-bold';
                  } else if (hasVisited) {
                    colorClass = 'bg-destructive/15 text-destructive border-destructive/30 font-medium';
                  }

                  if (isCurrent) {
                    colorClass += ' ring-2 ring-primary ring-offset-1';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 w-9 rounded-lg border text-xs flex items-center justify-center transition-all ${colorClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-success" />
                  <span>Answered ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-accent" />
                  <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-destructive/20 border border-destructive/30" />
                  <span>Unanswered ({test.questions.length - Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded border-2 border-primary" />
                  <span>Current Question</span>
                </div>
              </div>

              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2"
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Examination
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Test Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to end your test? Once submitted, your score and detailed solutions will be generated.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Questions:</span>
              <span className="font-semibold text-primary">{test.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Answered:</span>
              <span className="font-semibold text-success">{Object.keys(answers).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unanswered:</span>
              <span className="font-semibold text-destructive">
                {test.questions.length - Object.keys(answers).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Marked for Review:</span>
              <span className="font-semibold text-accent">
                {Object.values(markedForReview).filter(Boolean).length}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Continue Test
            </Button>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleConfirmSubmit}
            >
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ExamTakePage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center">Loading examination...</div>}>
      <ExamEngine />
    </Suspense>
  );
}
