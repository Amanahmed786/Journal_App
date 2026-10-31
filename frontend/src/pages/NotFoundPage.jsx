import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white">404</h1>
          <h2 className="mt-1 text-lg font-semibold text-slate-700 dark:text-slate-300">Page not found</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The requested view does not exist or you may need to authenticate first.
          </p>
        </div>
        <div>
          <a
            href="#/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
