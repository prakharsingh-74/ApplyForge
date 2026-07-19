'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState({ used: 42, total: 100 });

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data, error }) => {
      if (error) {
        toast.error('Session error: ' + error.message);
        handleSignOut();
      } else if (data?.user) {
        setUser(data.user);
      } else {
        handleSignOut();
      }
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await insforge.auth.signOut();
      document.cookie = 'insforge-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      router.replace('/sign-in');
      router.refresh();
    } catch {
      document.cookie = 'insforge-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      router.replace('/sign-in');
      router.refresh();
    }
  };

  const navItems = [
    {
      name: 'Jobs',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Resume',
      href: '/dashboard/resume',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: 'Application Status',
      href: '/dashboard/status',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  const getPageTitle = () => {
    const active = navItems.find((item) => item.href === pathname);
    if (active) return active.name;
    if (pathname === '/dashboard/billing') return 'Billing';
    if (pathname === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans">
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header: Logo and App Name */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {/* App Name */}
            {!isCollapsed && (
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap animate-in fade-in duration-200">
                JobBuddy AI
              </span>
            )}
          </div>

          {/* Collapse/Expand Toggle button (only desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800 items-center justify-center transition-all duration-200"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }
                `}
              >
                <div className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-indigo-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="whitespace-nowrap animate-in fade-in duration-200">{item.name}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-20 scale-0 group-hover:scale-100 bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-semibold px-3 py-2 rounded-lg shadow-xl pointer-events-none transition-all duration-150 origin-left whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 space-y-4 flex-shrink-0 bg-zinc-900/50">
          {/* Billing / Credits Section */}
          <div className={`transition-all duration-300 ${isCollapsed ? 'px-1' : 'px-1'}`}>
            {isCollapsed ? (
              <Link
                href="/dashboard/billing"
                className="flex items-center justify-center p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800/80 transition-all duration-200 relative group"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {/* Collapsed Tooltip */}
                <div className="absolute left-20 scale-0 group-hover:scale-100 bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-semibold p-3 rounded-xl shadow-xl pointer-events-none transition-all duration-150 origin-left whitespace-nowrap z-50">
                  <p className="font-bold text-white">Credits: {credits.used} / {credits.total}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Click to view Billing</p>
                </div>
              </Link>
            ) : (
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Credits Remaining</span>
                  <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    {credits.total - credits.used} left
                  </span>
                </div>
                {/* Credits Progress bar */}
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(credits.used / credits.total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-400">{credits.used} / {credits.total} Used</span>
                  <Link
                    href="/dashboard/billing"
                    className="text-indigo-400 hover:text-indigo-300 hover:underline text-[11px] font-semibold"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Settings and User Information */}
          <div className="space-y-1">
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
                ${pathname === '/dashboard/settings'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }
              `}
            >
              <svg className="w-5 h-5 flex-shrink-0 text-zinc-400 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!isCollapsed && (
                <span className="whitespace-nowrap animate-in fade-in duration-200">Profile Settings</span>
              )}
              {isCollapsed && (
                <div className="absolute left-20 scale-0 group-hover:scale-100 bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-semibold px-3 py-2 rounded-lg shadow-xl pointer-events-none transition-all duration-150 origin-left whitespace-nowrap z-50">
                  Profile Settings
                </div>
              )}
            </Link>

            {/* Logout Option */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group relative"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isCollapsed && (
                <span className="whitespace-nowrap animate-in fade-in duration-200">Sign Out</span>
              )}
              {isCollapsed && (
                <div className="absolute left-20 scale-0 group-hover:scale-100 bg-zinc-950 border border-zinc-800 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg shadow-xl pointer-events-none transition-all duration-150 origin-left whitespace-nowrap z-50">
                  Sign Out
                </div>
              )}
            </button>
          </div>

          {/* User info bubble */}
          {!isCollapsed && user && (
            <div className="flex items-center gap-3 px-1.5 py-1 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-indigo-400 uppercase">
                {user.email?.[0] || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-300 truncate">
                  {user.profile?.name || 'User'}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}
      >
        {/* Header Bar */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Ambient indicator / status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              System Active
            </div>
          </div>
        </header>

        {/* Inner Content Page */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="h-full bg-zinc-900/10 border border-zinc-900/60 rounded-3xl p-6 lg:p-8 min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
