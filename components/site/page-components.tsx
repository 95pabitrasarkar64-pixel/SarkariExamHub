import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('border-b border-border bg-secondary/30', className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('container mx-auto px-4 py-12 md:py-16', className)}>{children}</div>;
}