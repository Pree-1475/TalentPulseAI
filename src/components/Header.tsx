'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  RefreshCw,
  Database,
  Flame,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
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
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search skills, languages, frameworks (e.g. Python, AWS)..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </form>

      {/* Integration Badges & Actions */}
      <div className="flex items-center gap-3">
        {/* Status Indicators Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5" title={status.mongodbConnected ? 'MongoDB Atlas Connected' : 'Local Persistent Storage Active'}>
            <Database className={`w-3.5 h-3.5 ${status.mongodbConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="text-[11px]">{status.mongodbConnected ? 'Atlas DB' : 'Local Store'}</span>
          </div>

          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1.5" title={status.firecrawlConfigured ? 'Firecrawl API Active' : 'Firecrawl Demo Simulation'}>
            <Flame className={`w-3.5 h-3.5 ${status.firecrawlConfigured ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-[11px]">{status.firecrawlConfigured ? 'Firecrawl' : 'Crawl Demo'}</span>
          </div>

          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1.5" title={`LLM Engine: ${status.llmProvider}`}>
            <Cpu className={`w-3.5 h-3.5 ${status.llmConfigured ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="text-[11px]">
              {status.llmProvider === 'gemini' ? 'Gemini AI' : status.llmProvider === 'openai' ? 'OpenAI' : 'NLP Engine'}
            </span>
          </div>
        </div>

        {/* Reseed Button */}
        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          title="Reset database to baseline records"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Reset Baseline</span>
        </button>

        {/* User Profile / Organization */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center">
            HR
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-slate-900 leading-tight">Talent Ops</span>
            <span className="text-[10px] text-slate-500">Enterprise Workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
}
