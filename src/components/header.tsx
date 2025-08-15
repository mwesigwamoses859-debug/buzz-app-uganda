import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoIcon } from './icons';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/discover" className="flex items-center gap-3">
          <LogoIcon className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary-foreground tracking-tight">
            Buzz App Uganda
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Notifications</span>
          </Button>
           <Button asChild>
              <Link href="/">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}