import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SarkariExamHub — All Government Exams. One Destination.',
    template: '%s | SarkariExamHub',
  },
  description:
    'Prepare for government recruitment examinations with organized study materials, AI-assisted question banks, chapter-wise practice, and online mock tests—all in one platform.',
  keywords: [
    'government exam preparation',
    'ICDS exam preparation',
    'Anganwadi recruitment preparation',
    'Panchayat exam preparation',
    'Clerkship exam preparation',
    'State PSC preparation',
    'SSC mock tests',
    'Railway mock tests',
    'Banking practice questions',
    'Police recruitment preparation',
    'government exam MCQs',
    'government exam study PDFs',
  ],
  openGraph: {
    title: 'SarkariExamHub — All Government Exams. One Destination.',
    description:
      'Prepare for government recruitment examinations with organized study materials, AI-assisted question banks, chapter-wise practice, and online mock tests.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
