import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GEMINI_API_KEY is not configured in the server environment.',
          code: 'MISSING_API_KEY',
          message:
            'Please add GEMINI_API_KEY to your environment variables (.env.local or cloud environment) to enable AI question extraction.',
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { text, fileBase64, mimeType, examCategory, language } = body;

    if (!text && !fileBase64) {
      return NextResponse.json(
        { error: 'Either "text" or "fileBase64" must be provided for extraction.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are an expert examination data ingestion engine for SarkariExamHub, an Indian competitive exams platform (SSC, WBCS/State PSC, Railway, ICDS, Banking, Police).
Your task is to ingest study documents, test papers, or scanned OCR text, and extract all Multiple Choice Questions (MCQs) into clean, structured data.

CRITICAL ACCURACY RULES:
1. Extract the question stem faithfully. Support English, Hindi, and Bengali script.
2. Extract 4 distinct options (A, B, C, D). If fewer than 4 are found, record what exists and add a warning.
3. Identify the correct answer if an answer key or solution explanation exists in the document.
4. If NO answer key is present for a question, mark correctAnswer as "Uncertain - Not in source text" and set confidence to <= 60.
5. NEVER invent answers, options, or explanations that are absent.
6. Provide a concise, clear explanation.
7. Classify the subject (e.g., Quantitative Aptitude, General Intelligence & Reasoning, General Awareness, English Comprehension, Regional Language) and topic.
8. Flag any warnings: contradictions in answer key, missing diagrams, unclear OCR artifacts, or unreadable equations.

Output MUST strictly be a JSON object with a single key "questions" containing an array of objects with the following schema:
{
  "questions": [
    {
      "id": number,
      "question": string,
      "options": string[],
      "correctAnswer": string, // e.g. "B" or "Option B: 54 km/h" or "Uncertain"
      "correctOptionIndex": number, // 0 for A, 1 for B, 2 for C, 3 for D, or -1 if uncertain
      "explanation": string,
      "subject": string,
      "topic": string,
      "pageNumber": number,
      "confidence": number, // integer 0-100
      "warnings": string | null
    }
  ]
}`;

    let contents: any;

    if (fileBase64) {
      contents = {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType || 'application/pdf',
            },
          },
          {
            text: `Extract all MCQs from this document. Target Category: ${examCategory || 'Government Recruitment'}. Language: ${language || 'Auto-detect'}. Return the JSON object as specified.`,
          },
        ],
      };
    } else {
      contents = `Extract all MCQs from the following text:\n\n${text}\n\nTarget Category: ${examCategory || 'Government Recruitment'}. Language: ${language || 'Auto-detect'}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2, // low temperature for high extraction fidelity
      },
    });

    const responseText = response.text || '';
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Fallback clean markdown blocks if any
      const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const questions = Array.isArray(parsed?.questions) ? parsed.questions : (Array.isArray(parsed) ? parsed : []);

    return NextResponse.json({
      success: true,
      extractedCount: questions.length,
      questions,
      source: fileBase64 ? 'file_upload' : 'text_ocr',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI Question Extraction Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to extract questions using Gemini API.',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
