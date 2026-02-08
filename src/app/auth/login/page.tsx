'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText, Eye, EyeOff } from 'lucide-react';
import { GoogleButton } from '@/components/auth/google-button';
import { AuthDivider } from '@/components/auth/auth-divider';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const { signIn, claimAnonymousCVs } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(identifier.trim(), password);
      if (error) {
        setError(error.message);
        return;
      }

      const anonymousId = localStorage.getItem('cv_anonymous_id');
      if (anonymousId) {
        const claimed = await claimAnonymousCVs(anonymousId);
        if (claimed > 0) localStorage.removeItem('cv_anonymous_id');
      }

      router.push(redirectTo);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center pb-2">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2 mx-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cv-blue-500 to-cyan-400 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-cv-blue-600">CV Chap Chap</span>
        </Link>
      </CardHeader>

      <CardContent>
        <GoogleButton />
        <AuthDivider />

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Phone number or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="h-11"
            autoComplete="username"
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-xs text-cv-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href={`/auth/register?redirect=${redirectTo}`} className="text-cv-blue-600 hover:underline font-semibold">
            Sign up
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link href="/template" className="text-xs text-gray-400 hover:text-gray-600">
            Continue without account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="w-full max-w-md h-96 bg-white rounded-lg animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
