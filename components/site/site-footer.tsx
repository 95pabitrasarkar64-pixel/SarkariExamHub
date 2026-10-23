import Link from 'next/link';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { navLinks, companyLinks, legalLinks } from '@/lib/navigation';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">SarkariExamHub</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              All Government Exams. One Destination. Prepare for government recruitment
              examinations with organized study materials, AI-assisted question banks, and
              online mock tests.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-xs text-muted-foreground">
                SarkariExamHub is an independent educational platform and is not an official
                government website. We do not represent any government body.
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-primary">Explore</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-primary">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-primary">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SarkariExamHub. All rights reserved. SarkariExamHub
            is an independent educational platform and is not affiliated with or endorsed by any
            government body.
          </p>
        </div>
      </div>
    </footer>
  );
}
