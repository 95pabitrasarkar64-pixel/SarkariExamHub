import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TESTS } from '@/lib/mock-test-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testId, answers, timeSpentSeconds, userId } = body;

    if (!testId) {
      return NextResponse.json({ error: 'testId is required' }, { status: 400 });
    }

    const test = MOCK_TESTS.find((t) => t.id === testId);
    if (!test) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    // Server-Authoritative Evaluation:
    // Compare student submitted answers with server-side answer keys
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const evaluatedQuestions = test.questions.map((q, idx) => {
      const studentAnswer = answers?.[idx];
      const isUnattempted = studentAnswer === undefined || studentAnswer === null;
      const isCorrect = !isUnattempted && studentAnswer === q.correctOption;

      if (isUnattempted) {
        unattempted++;
      } else if (isCorrect) {
        correct++;
      } else {
        incorrect++;
      }

      return {
        id: q.id,
        subject: q.subject,
        question: q.question,
        options: q.options,
        studentAnswer: isUnattempted ? null : studentAnswer,
        correctOption: q.correctOption,
        isCorrect,
        isUnattempted,
        explanation: q.explanation,
      };
    });

    const rawScore = correct * test.positiveMarks - incorrect * test.negativeMarks;
    const totalScore = Math.max(0, Number(rawScore.toFixed(2)));
    const totalAttempted = correct + incorrect;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
    const maxScore = test.questions.length * test.positiveMarks;

    return NextResponse.json({
      success: true,
      testId: test.id,
      title: test.title,
      totalQuestions: test.questions.length,
      maxScore,
      totalScore,
      correct,
      incorrect,
      unattempted,
      accuracy,
      timeSpentSeconds: timeSpentSeconds || 0,
      evaluatedQuestions, // Released only AFTER submission
      evaluatedAt: new Date().toISOString(),
      userId: userId || 'anonymous',
    });
  } catch (error: any) {
    console.error('Server-side exam evaluation error:', error);
    return NextResponse.json(
      { error: 'Internal server error evaluating exam.' },
      { status: 500 }
    );
  }
}
