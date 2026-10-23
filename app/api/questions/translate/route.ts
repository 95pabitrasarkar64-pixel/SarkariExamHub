import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { getLanguage } from '@/lib/languages';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sourceLanguage = 'en',
      targetLanguage,
      question,
      options,
      correctOption,
      explanation,
    } = body;

    if (!targetLanguage || !question || !Array.isArray(options) || options.length !== 4) {
      return NextResponse.json(
        { error: 'Invalid input. Required: targetLanguage, question, options (array of 4 strings).' },
        { status: 400 }
      );
    }

    const sourceLangMeta = getLanguage(sourceLanguage);
    const targetLangMeta = getLanguage(targetLanguage);

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is present, invoke GoogleGenAI
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemPrompt = `You are an expert bilingual government competitive examination translator specializing in Indian languages (Bengali, Hindi, Assamese, Odia, Punjabi, Gujarati, Marathi, Tamil, Telugu, Kannada, Malayalam, Urdu, Nepali, Sanskrit).
Your task is to accurately translate a Multiple Choice Question (MCQ), its 4 options, and explanation from ${sourceLangMeta.name} to ${targetLangMeta.name} (${targetLangMeta.nativeName}).

CRITICAL INTEGRITY RULES:
1. PRESERVE 1:1 OPTION MAPPING: Option 0 in the output MUST be the exact translation of Option 0 in input; Option 1 maps to Option 1, etc. Do NOT reorder or shuffle options!
2. MATHEMATICAL & LOGICAL FORMULAS: Keep numbers, algebraic variables (x, y, P, R, T), chemical formulas, units (kg, m/s, %, ₹, Ohm) accurate.
3. CONTEXTUAL ACCURACY: For Indian constitution, history, and administrative terms, use official terminology recognized by public service commissions (e.g. WBPSC, UPSC, SSC).
4. RTL SCRIPT: If target is Urdu (ur), output proper Urdu Nastaliq unicode text.
5. Provide a clear, natural translation of the explanation that matches the correct answer at index ${correctOption}.`;

      const userPrompt = `Translate this competitive exam question:
Source Language: ${sourceLangMeta.name} (${sourceLanguage})
Target Language: ${targetLangMeta.name} (${targetLanguage})

Question:
"${question}"

Options:
[0]: "${options[0]}"
[1]: "${options[1]}"
[2]: "${options[2]}"
[3]: "${options[3]}"

Correct Option Index: ${correctOption}
Explanation:
"${explanation || ''}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translatedQuestion: {
                type: Type.STRING,
                description: 'The translated question statement in the target Indian language.',
              },
              translatedOptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of exactly 4 translated options mapped 1:1 to original positions [0, 1, 2, 3].',
              },
              translatedExplanation: {
                type: Type.STRING,
                description: 'The translated explanation in the target Indian language.',
              },
              translationNotes: {
                type: Type.STRING,
                description: 'Brief quality remarks or notes on technical terminology used.',
              },
            },
            required: ['translatedQuestion', 'translatedOptions', 'translatedExplanation'],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);

      // Verify that options array is exactly 4
      const finalOptions = Array.isArray(parsed.translatedOptions) && parsed.translatedOptions.length === 4
        ? parsed.translatedOptions
        : options.map((opt: string) => `[${targetLangMeta.name}] ${opt}`);

      return NextResponse.json({
        success: true,
        sourceLanguage,
        targetLanguage,
        translatedQuestion: parsed.translatedQuestion || question,
        translatedOptions: finalOptions,
        translatedExplanation: parsed.translatedExplanation || explanation || '',
        translationNotes: parsed.translationNotes || 'AI translation generated with 1:1 option mapping preservation.',
        status: 'pending_review',
      });
    }

    // Fallback simulation for offline/test environments without API key
    return NextResponse.json({
      success: true,
      sourceLanguage,
      targetLanguage,
      translatedQuestion: `[${targetLangMeta.nativeName}] ${question}`,
      translatedOptions: options.map((opt: string, i: number) => `[${targetLangMeta.code.toUpperCase()}] ${opt}`),
      translatedExplanation: explanation ? `[${targetLangMeta.nativeName}] ${explanation}` : '',
      translationNotes: 'Generated in local preview mode. Configure GEMINI_API_KEY in Secrets for live AI translations.',
      status: 'pending_review',
    });
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to translate question' },
      { status: 500 }
    );
  }
}
