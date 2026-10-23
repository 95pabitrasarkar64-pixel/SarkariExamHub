'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, PageContainer } from '@/components/site/page-components';
import { supabase } from '@/lib/supabase';

type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_annual: number;
  student_limit: number | null;
  storage_mb: number | null;
  ai_quota: number | null;
  active_exam_limit: number | null;
  teacher_seat_limit: number;
  features: string[];
  is_active: boolean;
  display_order: number;
};

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    supabase
      .from('saas_plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPlans(data as unknown as Plan[]);
        setLoading(false);
      });
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `\u20B9${price.toLocaleString('en-IN')}`;
  };

  const isPopular = (slug: string) => slug === 'pro';

  return (
    <div>
      <PageHeader
        title="SaaS Pricing"
        description="Choose a plan that grows with your teaching business or coaching institute."
      >
        <div className="mt-6 inline-flex rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${billing === 'annual' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
          >
            Annual (Save 2 months)
          </button>
        </div>
      </PageHeader>

      <PageContainer>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${isPopular(plan.slug) ? 'border-accent shadow-lg ring-2 ring-accent/20' : ''}`}
              >
                {isPopular(plan.slug) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(billing === 'monthly' ? plan.price_monthly : plan.price_annual)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.price_monthly > 0 ? `/${billing === 'monthly' ? 'month' : 'year'}` : ''}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="flex-1 space-y-2">
                    {plan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`mt-6 w-full ${isPopular(plan.slug) ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                    variant={isPopular(plan.slug) ? 'default' : 'outline'}
                  >
                    {plan.slug === 'free' ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-xl border border-border bg-secondary/30 p-6">
          <h2 className="font-bold text-primary">Plan Comparison</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium text-muted-foreground">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} className="py-2 text-center font-semibold text-primary">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Students', key: 'student_limit' },
                  { label: 'Storage', key: 'storage_mb', suffix: ' MB' },
                  { label: 'AI Quota', key: 'ai_quota' },
                  { label: 'Active Exams', key: 'active_exam_limit' },
                  { label: 'Teacher Seats', key: 'teacher_seat_limit' },
                ].map((row) => (
                  <tr key={row.key} className="border-b border-border">
                    <td className="py-2 text-muted-foreground">{row.label}</td>
                    {plans.map((p) => (
                      <td key={p.id} className="py-2 text-center">
                        {(p as Record<string, unknown>)[row.key] as number | null ?? '—'}
                        {row.suffix && (p as Record<string, unknown>)[row.key] ? row.suffix : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          All plans include Row Level Security, multi-tenant data isolation, and server-side
          access control. Prices are configurable by the platform administrator.
        </p>
      </PageContainer>
    </div>
  );
}