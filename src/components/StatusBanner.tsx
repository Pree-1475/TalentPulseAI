'use client';

import React from 'react';
import Link from 'next/link';
import { Info, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface StatusBannerProps {
  isDemoMode?: boolean;
}

export function StatusBanner({ isDemoMode = false }: StatusBannerProps) {
  return (
    <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Active Job Market Intelligence
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Q1–Q4 2026 Live Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Observing verified career postings across Technology, FinTech, Healthcare, and E-commerce.
            Calculate rising vs declining skills with transparent statistical models.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <Link
          href="/sources"
          className="text-xs font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors whitespace-nowrap"
        >
          Add Career URL
        </Link>
        <Link
          href="/reports"
          className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Export Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
