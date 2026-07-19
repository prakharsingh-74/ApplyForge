'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import { toast } from 'sonner';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // States for verification OTP
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || 'Registration failed.');
      } else if (data) {
        if (data.requireEmailVerification) {
          toast.success('Registration successful! A verification code has been sent to your email.');
          setNeedsVerification(true);
        } else {
          toast.success('Welcome! Your account has been created.');
          if (data.accessToken) {
            document.cookie = `insforge-token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
            window.location.href = '/dashboard';
          } else {
            router.replace('/sign-in');
          }
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }

    setVerifying(true);
    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email,
        otp,
      });

      if (error) {
        toast.error(error.message || 'Invalid code. Please try again.');
      } else if (data) {
        toast.success('Email verified successfully! Welcome aboard.');
        document.cookie = `insforge-token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        window.location.href = '/dashboard';
      }
    } catch (err) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const { data, error } = await insforge.auth.resendVerificationEmail({
        email,
      });

      if (error) {
        toast.error(error.message || 'Failed to resend code.');
      } else if (data?.success) {
        toast.success('Verification code resent successfully.');
      }
    } catch (err) {
      toast.error('Failed to resend code. Please try again.');
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
            {needsVerification ? 'Verify Your Email' : 'Create an Account'}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {needsVerification 
              ? `We sent a 6-digit verification code to ${email}`
              : 'Join ApplyForge today and track your career opportunities'
            }
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {!needsVerification ? (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

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
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Password
                </label>
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Sign Up'
                )}
                <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label htmlFor="otp" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 text-center tracking-[0.5em] text-lg font-bold rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="relative w-full py-3.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm shadow-lg shadow-green-600/10 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                {verifying ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify & Sign In'
                )}
                <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Didn't receive the code? Resend Code
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
