import { GoogleAuth } from '@/components/google-auth';
import { LogoIcon } from '@/components/icons';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0 animated-gradient" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/discover" className="flex items-center gap-3 mb-4">
            <LogoIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary-foreground tracking-tight drop-shadow-lg">
              Buzz App Uganda
            </h1>
          </Link>
          <p className="text-muted-foreground drop-shadow-sm">Discover the hottest nightlife spots in Uganda</p>
        </div>

        <GoogleAuth />

        <p className="mt-8 text-center text-sm text-muted-foreground drop-shadow-sm">
          <Link href="/discover" className="underline hover:text-primary">
            Or continue exploring as a guest
          </Link>
        </p>
      </div>
    </div>
  );
}
