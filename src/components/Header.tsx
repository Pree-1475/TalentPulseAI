'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  RotateCcw,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [status, setStatus] = useState<{
    mongodbConnected: boolean;
    firecrawlConfigured: boolean;
    llmConfigured: boolean;
    llmProvider: string;
  }>({
    mongodbConnected: false,
    firecrawlConfigured: false,
    llmConfigured: false,
    llmProvider: 'heuristic_engine',
  });
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.systemStatus) {
          setStatus(json.data.systemStatus);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/skills?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleResetData = async () => {
    if (!confirm('Reset sample records to default baseline (Q1–Q4 2026)? Any newly crawled jobs will be replaced.')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        window.location.reload();
      }
    } catch (e) {
      alert('Failed to reset demo dataset');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Mobile Menu & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search skills, languages, frameworks (e.g. Python, AWS)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </form>
      </div>

      {/* Integration Badges & Controls */}
      <div className="flex items-center gap-3">
        {/* Compact Status Indicators (Restrained Text + Status Dot) */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 font-medium">
          {/* Storage Status */}
          <div className="flex items-center gap-1.5" title={status.mongodbConnected ? 'Connected to MongoDB Atlas' : 'Local Persistent Storage Mode'}>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status.mongodbConnected ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px] text-slate-600">
              {status.mongodbConnected ? 'Atlas DB' : 'Local Store'}
            </span>
          </div>

          <span className="text-slate-200">/</span>

          {/* Crawler Status */}
          <div className="flex items-center gap-1.5" title={status.firecrawlConfigured ? 'Firecrawl API Active' : 'Demo Crawler Simulation Mode'}>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status.firecrawlConfigured ? 'bg-emerald-500' : 'bg-blue-400'
              }`}
            />
            <span className="text-[11px] text-slate-600">
              {status.firecrawlConfigured ? 'Firecrawl' : 'Crawl Demo'}
            </span>
          </div>

          <span className="text-slate-200">/</span>

          {/* AI Status */}
          <div className="flex items-center gap-1.5" title={`Skill Normalization Engine: ${status.llmProvider}`}>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status.llmConfigured ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px] text-slate-600">
              {status.llmProvider === 'gemini'
                ? 'Gemini AI'
                : status.llmProvider === 'openai'
                ? 'OpenAI'
                : 'NLP Engine'}
            </span>
          </div>
        </div>

        {/* Reset Baseline Action */}
        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors disabled:opacity-50"
          title="Reset database to default baseline dataset"
        >
          <RotateCcw className={`w-3 h-3 text-slate-400 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline text-[11px] font-medium">Reset Baseline</span>
        </button>

        {/* User Workspace Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-6 h-6 rounded bg-slate-900 text-white font-semibold text-[10px] flex items-center justify-center tracking-tight">
            HR
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-slate-900 leading-tight">Talent Ops</span>
            <span className="text-[10px] text-slate-400">Enterprise</span>
          </div>
        </div>
      </div>
    </header>
  );
}
