import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X } from 'lucide-react';

export default function DemoBanner() {
  const { isDemo, dismissDemoBanner } = useAuth();

  if (!isDemo) return null;

  return (
    <div className="bg-gradient-to-r from-violet-600 via-brand-600 to-indigo-600 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
          <span>
            <strong>Recruiter Demo Session:</strong> You are browsing as an interactive guest account with sample entries pre-seeded!
          </span>
        </div>
        <button
          onClick={dismissDemoBanner}
          className="shrink-0 p-1 hover:bg-white/20 rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
