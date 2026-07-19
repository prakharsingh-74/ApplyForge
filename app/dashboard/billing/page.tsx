'use client';

import React from 'react';

export default function BillingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Billing & Credits</h2>
      <p className="text-zinc-400 max-w-sm">
        This is a placeholder for the Billing page. View invoice history, manage subscriptions, and purchase extra JobBuddy AI credits here.
      </p>
    </div>
  );
}
