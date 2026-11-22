'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface StatusBannerProps {
  isDemoMode?: boolean;
}

export function StatusBanner({ isDemoMode = false }: StatusBannerProps) {
  return (
    <div className="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Context Information */}
      <div className="flex items-center gap-2.5 text-xs text-slate-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        <span className="font-semibold text-slate-900">Active Job Market Intelligence</span>
        <span className="text-slate-300">&bull;</span>
        <span className="text-slate-500 font-mono text-[11px]">Q1–Q4 2026 Live Tracking</span>
        <span className="hidden md:inline text-slate-300">&bull;</span>
        <span className="hidden md:inline text-slate-500">
          Technology &bull; FinTech &bull; Healthcare &bull; E-commerce &bull; Consulting
        </span>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
        <Link
          href="/sources"
          className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors text-center flex-1 sm:flex-initial border border-slate-200 sm:border-transparent"
        >
          Add Career URL
        </Link>
        <Link
          href="/reports"
          className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1 shadow-2xs flex-1 sm:flex-initial"
        >
          <span>Export Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
