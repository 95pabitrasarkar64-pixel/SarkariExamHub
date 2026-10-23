import Link from 'next/link';
import { FileText, Lock, Eye, Shield, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/site/page-components';

export const metadata = {
  title: 'PDF Library',
  description: 'Browse secure, watermarked PDF study materials on SarkariExamHub.',
};

export default function PdfLibraryPage() {
  return (
    <div>
      <PageHeader
        title="PDF Library"
        description="Secure, watermarked study materials accessible through our protected document viewer."
      />
      <PageContainer>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Protected Document Library</CardTitle>
              <CardDescription>
                Our PDF library uses server-side authentication, short-lived access URLs, and
                personalized watermarks to protect content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-sm">Secure Access</p>
                  <p className="text-sm text-muted-foreground">
                    PDFs are stored in private storage. Access is verified server-side before
                    any document is served.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-sm">Watermarked Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Each document is watermarked with the student&apos;s name, ID, and order
                    reference across all pages.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-sm">In-Browser Viewer</p>
                  <p className="text-sm text-muted-foreground">
                    Read materials in our browser-based viewer with restricted download, print,
                    and copy controls.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-muted-foreground">
                <strong className="text-warning">Limitation:</strong> Screenshots, screen
                recording, and external cameras cannot be prevented by any web application. Our
                controls reduce casual sharing but cannot guarantee complete piracy prevention.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browse PDFs</CardTitle>
              <CardDescription>Find materials by exam and subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/materials">
                  <FileText className="mr-2 h-4 w-4" /> Browse All PDFs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/student">
                  <Download className="mr-2 h-4 w-4" /> My Library
                </Link>
              </Button>
              <p className="pt-2 text-center text-xs text-muted-foreground">
                Sign in to access your purchased materials
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}