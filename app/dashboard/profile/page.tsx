'use client';

import React from 'react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">User Profile</h2>
      <p className="text-zinc-400 max-w-sm">
        This is a placeholder for the Profile page. Configure your personal profile details, experience levels, and job search goals.
      </p>
    </div>
  );
}
