'use client';

import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Key,
} from 'lucide-react';

export default function SettingsPage() {
  const [status, setStatus] = useState<{
    mongodbConnected: boolean;
    firecrawlConfigured: boolean;
    llmConfigured: boolean;
    llmProvider: string;
    mementoConfigured?: boolean;
    mementoProvider?: string;
    mementoSnapshotCount?: number;
  }>({
    mongodbConnected: false,
    firecrawlConfigured: false,
    llmConfigured: false,
    llmProvider: 'heuristic_engine',
    mementoConfigured: true,
    mementoProvider: 'memento-engine',
    mementoSnapshotCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchStatus = () => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.systemStatus) {
          setStatus(json.data.systemStatus);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reseed sample data and recalculate all metrics?')) return;
    setResetting(true);
    setResetMessage(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setResetMessage('Database successfully re-seeded with realistic Q1–Q4 2026 baseline records.');
        fetchStatus();
      } else {
        alert(json.error || 'Failed to reseed');
      }
    } catch (err: any) {
      alert(err.message || 'Error reseeding data');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          System Integrations &amp; Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Review system persistence, live web crawling capabilities, and the AI skill normalization engine.
        </p>
      </div>

      {resetMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{resetMessage}</span>
          </div>
          <button onClick={() => setResetMessage(null)} className="font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Integration Status Rows */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Core Engine Status
        </h2>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white text-xs">
          {/* Memento Historical Skill Trend Store */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.mementoConfigured ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                <span>
                  Historical Trend Store:{' '}
                  {status.mementoProvider === 'momento-cloud'
                    ? 'Momento Cloud Serverless Cache'
                    : 'Memento Snapshot Engine'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                {status.mementoProvider === 'momento-cloud'
                  ? 'Connected to Momento Cloud. Stores longitudinal skill snapshots (Q1–Q4) for demand velocity calculations.'
                  : 'Operating in local Memento Engine mode. Preserves historical skill trend snapshots across time periods.'}
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {status.mementoProvider === 'momento-cloud' ? 'Momento Cloud Active' : 'Memento Engine Active'}
            </span>
          </div>

          {/* MongoDB Atlas */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.mongodbConnected ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                <span>Storage Layer: {status.mongodbConnected ? 'MongoDB Atlas' : 'Local Persistent Storage'}</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                {status.mongodbConnected
                  ? 'Connected to remote MongoDB Atlas cluster with active indexes.'
                  : 'Operating in file-backed local storage mode (data/talentpulse_store.json).'}
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {status.mongodbConnected ? 'Online' : 'Embedded Mode'}
            </span>
          </div>

          {/* Firecrawl Crawler */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.firecrawlConfigured ? 'bg-emerald-500' : 'bg-blue-400'
                  }`}
                />
                <span>Web Ingestion: {status.firecrawlConfigured ? 'Firecrawl API' : 'Domain Scraper Simulator'}</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                {status.firecrawlConfigured
                  ? 'Firecrawl API key configured. Live career pages are crawled and parsed.'
                  : 'Operating in sector-tailored domain scraper simulation mode.'}
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {status.firecrawlConfigured ? 'Live API' : 'Simulator Active'}
            </span>
          </div>

          {/* LLM Engine */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.llmConfigured ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                <span>
                  Intelligence Engine:{' '}
                  {status.llmProvider === 'gemini'
                    ? 'Google Gemini 1.5 Flash'
                    : status.llmProvider === 'openai'
                    ? 'OpenAI GPT-4o-mini'
                    : 'Deterministic Heuristic NLP Model'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                {status.llmConfigured
                  ? 'Live LLM API extraction and prompt synthesis active.'
                  : 'Operating with 300+ canonical skill taxonomy dictionary and regex boundary matching.'}
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {status.llmConfigured ? 'Live Model' : 'Heuristic Model'}
            </span>
          </div>
        </div>
      </div>

      {/* Environment Variable Setup Instructions */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Key className="w-3.5 h-3.5 text-blue-600" />
          <span>Environment Variable Configuration</span>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed">
          To connect your production credentials, add the following variables to your <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">.env.local</code> file:
        </p>

        <div className="p-4 bg-slate-900 text-slate-200 rounded-md font-mono text-xs overflow-x-auto space-y-1">
          <div><span className="text-slate-500"># Momento Cloud Auth Token (Optional - for Momento Cloud)</span></div>
          <div>MOMENTO_AUTH_TOKEN=eyJhbGciOi...</div>
          <div>MOMENTO_CACHE_NAME=talentpulse-memento</div>
          <div className="pt-2"><span className="text-slate-500"># MongoDB Atlas Connection URI</span></div>
          <div>MONGODB_URI=mongodb+srv://&lt;user&gt;:&lt;password&gt;@cluster0.mongodb.net/talentpulse?retryWrites=true&amp;w=majority</div>
          <div className="pt-2"><span className="text-slate-500"># Firecrawl API Key (https://firecrawl.dev)</span></div>
          <div>FIRECRAWL_API_KEY=fc_live_...</div>
          <div className="pt-2"><span className="text-slate-500"># LLM API Key (Provide Gemini or OpenAI)</span></div>
          <div>GEMINI_API_KEY=AIzaSy...</div>
          <div><span className="text-slate-500"># or: OPENAI_API_KEY=sk-proj-...</span></div>
        </div>
      </div>

      {/* Database Reseeding Action */}
      <div className="p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs bg-slate-50/50">
        <div>
          <span className="font-semibold text-slate-900 block">Reset Baseline Dataset</span>
          <span className="text-slate-500 text-[11px]">
            Restores the 40+ curated multi-sector career postings and Q1–Q4 2026 demand snapshots.
          </span>
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-md text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting Data...' : 'Reset to Baseline'}</span>
        </button>
      </div>
    </div>
  );
}
