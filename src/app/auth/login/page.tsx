'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  const { signIn, claimAnonymousCVs } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }

      const anonymousId = localStorage.getItem('cv_anonymous_id');
      if (anonymousId) {
        const claimed = await claimAnonymousCVs(anonymousId);
        if (claimed > 0) {
          localStorage.removeItem('cv_anonymous_id');
        }
      }

      router.push(redirectTo);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cv-blue-500 to-cyan-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-cv-blue-600">CV Chap Chap</span>
          </Link>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your CVs</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/auth/forgot-password" className="text-cv-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href={`/auth/register?redirect=${redirectTo}`} className="text-cv-blue-600 hover:underline font-medium">
              Sign up free
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <Link href="/template" className="text-sm text-gray-500 hover:text-gray-700">
              ← Continue without account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
