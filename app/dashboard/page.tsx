'use client';

import React from 'react';

export default function JobsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Jobs Tracker</h2>
      <p className="text-zinc-400 max-w-sm">
        This is a placeholder for the Jobs page. Real-time application tracking and AI assistance will be configured here.
      </p>
    </div>
  );
}
