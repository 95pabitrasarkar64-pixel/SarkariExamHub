import { AlertCircle } from 'lucide-react';
import { PageHeader, PageContainer } from '@/components/site/page-components';

export function LegalLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
          {children}
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p>
              <strong className="text-warning">Legal Notice:</strong> These documents are
              templates provided for informational purposes only and do not constitute legal
              advice. Professional legal review is recommended before deployment. SarkariExamHub
              does not guarantee compliance with every applicable law.
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}