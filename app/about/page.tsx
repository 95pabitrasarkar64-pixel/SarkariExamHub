import { Target, Heart, Shield, Users, Award, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader, PageContainer } from '@/components/site/page-components';

export const metadata = {
  title: 'About Us',
  description: 'Learn about SarkariExamHub — an independent educational platform for government exam preparation in India.',
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About SarkariExamHub"
        description="An independent educational platform built for government exam aspirants across India."
      />
      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h2 className="text-xl font-bold text-primary">Our Mission</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              SarkariExamHub was created to give government job aspirants a single, organized
              destination for exam preparation. We bring together study materials, AI-assisted
              question banks, chapter-wise practice, and online mock tests — all designed for
              affordable Android phones and low-bandwidth connections.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-primary" />
                <CardTitle className="mt-2">Built by Educators</CardTitle>
                <CardDescription>
                  Founded by a Reasoning and Quantitative Aptitude educator who understands the
                  needs of both students and teachers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-accent" />
                <CardTitle className="mt-2">Accessible Learning</CardTitle>
                <CardDescription>
                  Mobile-first, fast-loading pages designed for low-cost Android phones across
                  India.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-success" />
                <CardTitle className="mt-2">Secure & Private</CardTitle>
                <CardDescription>
                  Server-side access control, row-level security, and protected content delivery
                  keep data safe.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-info" />
                <CardTitle className="mt-2">For Everyone</CardTitle>
                <CardDescription>
                  Students, individual teachers, and coaching institutes — each gets tools
                  tailored to their needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <h3 className="font-semibold text-warning">Important Disclaimer</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  SarkariExamHub is an independent educational platform. We are not affiliated
                  with, endorsed by, or connected to any government body. We do not publish
                  official exam notifications, dates, or eligibility requirements. Examination
                  categories on this platform are for preparation purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}