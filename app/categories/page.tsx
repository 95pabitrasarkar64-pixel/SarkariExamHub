import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { examCategoryInfo, examCategorySlugs } from '@/lib/navigation';

export const metadata = {
  title: 'Exam Categories',
  description: 'Browse all government exam preparation categories on SarkariExamHub.',
};

export default function CategoriesPage() {
  const categories = examCategorySlugs.map((slug) => ({ slug, ...examCategoryInfo[slug] }));

  return (
    <div>
      <PageHeader
        title="Exam Categories"
        description="Explore preparation resources organized by examination category."
      />
      <PageContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.slug} className="group transition-all hover:border-primary/30 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    {cat.image ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded bg-white p-0.5 shadow-xs">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <BookOpen className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-primary">{cat.name}</CardTitle>
                    <CardDescription className="mt-1">{cat.description}</CardDescription>
                  </div>
                </div>
                <Link
                  href={`/exams?category=${cat.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  View resources <ArrowRight className="h-4 w-4" />
                </Link>
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}