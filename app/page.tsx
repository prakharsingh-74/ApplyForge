'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('insforge-token='));

    if (hasToken) {
      insforge.auth.getCurrentUser().then(({ data }) => {
        if (data?.user) {
          setIsAuthenticated(true);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-sans text-zinc-100">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 h-20 border-b border-zinc-900 bg-zinc-950/20 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-base font-bold">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ApplyForge</span>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-8 w-20 bg-zinc-900 rounded-xl animate-pulse" />
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <main className="max-w-3xl px-6 text-center z-10 pt-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Track and organize your job search
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-none mb-6">
          Forge Your Path to a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
            New Career Opportunity
          </span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          ApplyForge is a modern job application tracker designed to simplify your job hunt. Add opportunities, organize statuses, track salaries, and keep detailed interview logs in one dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {loading ? (
            <div className="h-14 w-40 bg-zinc-900 rounded-2xl animate-pulse" />
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xl shadow-indigo-600/20 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xl shadow-indigo-600/20 transition-all duration-200"
              >
                Get Started for Free
              </Link>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all duration-200"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-zinc-600 text-xs font-semibold">
        © {new Date().getFullYear()} ApplyForge. Powered by InsForge.
      </footer>
    </div>
  );
}
