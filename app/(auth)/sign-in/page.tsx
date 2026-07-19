'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import { toast } from 'sonner';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle error message returned from OAuth callback
    const status = searchParams.get('insforge_status');
    const errorMsg = searchParams.get('insforge_error');
    if (status === 'error' && errorMsg) {
      toast.error(`Authentication error: ${errorMsg}`);
    }
  }, [searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || 'Invalid email or password.');
      } else if (data) {
        toast.success('Successfully signed in!');
        // Force cookie sync
        document.cookie = `insforge-token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        
        // Use full reload redirect to ensure cookie propagates to Next.js proxy
        window.location.href = '/dashboard';
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await insforge.auth.signInWithOAuth('google', {
        redirectTo: `${window.location.origin}/dashboard`,
      });

      if (error) {
        toast.error(error.message || 'Failed to start Google Sign In.');
        setLoading(false);
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md px-6 z-10">
        {/* Brand logo & header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 mb-4 shadow-lg shadow-indigo-500/20">
            <span className="text-white text-xl font-bold tracking-tight">A</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text">
            Welcome to ApplyForge
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to track and optimize your job applications
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In with Email'
              )}
              <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-3 text-zinc-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-900 transition-all duration-200 font-semibold text-sm disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.24.61 4.45 1.64l2.452-2.452C17.38 1.571 14.935 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.06-1.352-.185-1.955H12.24z" />
            </svg>
            Google
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link href="/sign-up" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-all">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-zinc-500 text-sm">Loading...</span>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
