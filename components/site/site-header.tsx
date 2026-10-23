'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import { navLinks, resourceLinks } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src="/assets/aistudio/SARKARIEXAMHUB_Academic_Logo_244f6d21.png"
              alt="SarkariExamHub Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg sm:text-xl font-black tracking-tight uppercase">
              <span className="text-primary">SARKARI</span>
              <span className="text-accent">EXAM</span>
              <span className="text-primary">HUB</span>
            </span>
            <span className="hidden items-center gap-1.5 text-[9.5px] font-semibold tracking-tight text-foreground/85 sm:flex">
              <span className="h-[1.5px] w-2.5 rounded-full bg-accent" />
              All Government Exams. One Destination.
              <span className="h-[1.5px] w-2.5 rounded-full bg-accent" />
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground',
                isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
                Resources
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {resourceLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {profile?.role === 'student' && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/student">My Dashboard</Link>
                </Button>
              )}
              {(profile?.role === 'teacher' || profile?.role === 'org_owner') && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/teacher">Teacher Dashboard</Link>
                </Button>
              )}
              {profile?.role === 'super_admin' && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-primary lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary',
                  isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {resourceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {user ? (
              <>
                {profile?.role === 'student' && (
                  <Link href="/student" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-primary">
                    My Dashboard
                  </Link>
                )}
                {(profile?.role === 'teacher' || profile?.role === 'org_owner') && (
                  <Link href="/teacher" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-primary">
                    Teacher Dashboard
                  </Link>
                )}
                <Button variant="outline" size="sm" className="mt-2" onClick={() => { signOut(); setMobileOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button asChild size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}