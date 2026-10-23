'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is SarkariExamHub?',
    a: 'SarkariExamHub is an independent educational platform for government exam preparation in India. It provides study materials, AI-assisted question banks, chapter-wise practice, and online mock tests — all in one place.',
  },
  {
    q: 'Is SarkariExamHub a government website?',
    a: 'No. SarkariExamHub is an independent educational platform and is not affiliated with, endorsed by, or connected to any government body. We do not publish official exam notifications or dates.',
  },
  {
    q: 'Which exams does the platform cover?',
    a: 'We cover ICDS/Anganwadi, Panchayat, Clerkship, State PSC (including WBCS), SSC (CGL, CHSL, MTS, GD), Railway, Banking, Police/Constable, and Group C/D recruitment examinations. Exam categories are configurable and managed by administrators.',
  },
  {
    q: 'How does the AI Question Importer work?',
    a: 'Teachers upload a PDF containing questions, options, answers, and explanations. The system extracts text (with OCR for scanned pages), uses AI to identify and structure MCQs, then presents them for teacher review and approval before they enter the question bank.',
  },
  {
    q: 'Can I sell my own study materials?',
    a: 'Yes. Teachers and institutes can sell individual PDFs, bundles, courses, chapter-wise practice sets, paid test series, and mock exam packages. Each organization has its own storefront.',
  },
  {
    q: 'Are PDFs protected against piracy?',
    a: 'PDFs are stored in private storage with server-side authentication, short-lived access URLs, personalized watermarks, and a restricted in-browser viewer. However, screenshots and screen recording cannot be fully prevented by any web application.',
  },
  {
    q: 'How are mock tests scored?',
    a: 'Mock tests are scored using server-side logic with support for negative marking. Teachers control when results and explanations are released. Students see marks, accuracy, and topic-wise performance after results are published.',
  },
  {
    q: 'Can other teachers or coaching institutes use the platform?',
    a: 'Yes. SarkariExamHub is available as a SaaS platform with configurable plans (Free, Starter, Pro, and Institute). Each organization gets its own workspace with separate students, content, and branding.',
  },
  {
    q: 'What languages are supported?',
    a: 'The platform supports English, Bengali, and Hindi content where the selected extraction tools permit. Multilingual interface switching is planned for when translations are ready.',
  },
  {
    q: 'How do payments work?',
    a: 'Student purchases and teacher SaaS subscriptions are processed separately. We use Razorpay for Indian payments with server-side signature verification. No raw card details are ever stored.',
  },
];

export default function FaqPage() {
  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to common questions about SarkariExamHub."
      />
      <PageContainer>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <Card key={idx}>
                <AccordionItem value={`item-${idx}`} className="border-b-0">
                  <CardHeader>
                    <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>

          <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-6 text-center">
            <h2 className="font-bold text-primary">Still have questions?</h2>
            <p className="mt-1 text-sm text-muted-foreground">We are happy to help.</p>
            <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}