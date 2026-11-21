'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Database,
  Flame,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Key,
  Info,
} from 'lucide-react';

export default function SettingsPage() {
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
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          System Integrations &amp; Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your database persistence, web crawler API, and LLM processing engine.
        </p>
      </div>

      {resetMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{resetMessage}</span>
          </div>
          <button onClick={() => setResetMessage(null)} className="font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MongoDB Card */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Database
              </span>
              <Database
                className={`w-5 h-5 ${
                  status.mongodbConnected ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">MongoDB Atlas</h3>
            <p className="text-xs text-slate-500 mt-1">
              {status.mongodbConnected
                ? 'Connected to remote MongoDB Atlas cluster with active indexes.'
                : 'Operating in Local Persistent Storage mode (fallback JSON database).'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                status.mongodbConnected ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-semibold text-slate-700">
              {status.mongodbConnected ? 'Atlas Connected' : 'Resilient Local Store Active'}
            </span>
          </div>
        </div>

        {/* Firecrawl Card */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Web Crawler
              </span>
              <Flame
                className={`w-5 h-5 ${
                  status.firecrawlConfigured ? 'text-amber-500' : 'text-slate-400'
                }`}
              />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">Firecrawl API</h3>
            <p className="text-xs text-slate-500 mt-1">
              {status.firecrawlConfigured
                ? 'Firecrawl API key loaded. Real career pages are scraped live.'
                : 'No API key detected. Operating in high-fidelity career page mock simulator.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                status.firecrawlConfigured ? 'bg-emerald-500' : 'bg-blue-400'
              }`}
            />
            <span className="text-[11px] font-semibold text-slate-700">
              {status.firecrawlConfigured ? 'Live API Scraping' : 'High-Fidelity Demo Simulation'}
            </span>
          </div>
        </div>

        {/* LLM Engine Card */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Intelligence Engine
              </span>
              <Cpu
                className={`w-5 h-5 ${
                  status.llmConfigured ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              {status.llmProvider === 'gemini'
                ? 'Gemini 1.5 Flash'
                : status.llmProvider === 'openai'
                ? 'OpenAI GPT-4o-mini'
                : 'Heuristic NLP Model'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {status.llmConfigured
                ? 'Live LLM API extraction and prompt synthesis enabled.'
                : 'Operating in 300+ skill taxonomy dictionary with regex boundary extraction.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                status.llmConfigured ? 'bg-emerald-500' : 'bg-indigo-400'
              }`}
            />
            <span className="text-[11px] font-semibold text-slate-700">
              {status.llmConfigured ? 'Live LLM Configured' : 'Heuristic Engine Operational'}
            </span>
          </div>
        </div>
      </div>

      {/* Environment Variable Setup Instructions */}
      <div className="bg-white p-6 border border-slate-200/80 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            Environment Variable Configuration Guide
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          To transition from demo/offline mode to full cloud execution, set the following environment variables in your <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">.env.local</code> file in the project root:
        </p>

        <div className="p-4 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
          <div><span className="text-slate-500"># MongoDB Atlas URI (or leave blank to use persistent local JSON store)</span></div>
          <div><span className="text-emerald-400">MONGODB_URI</span>=mongodb+srv://&lt;user&gt;:&lt;password&gt;@cluster0.mongodb.net/talentpulse?retryWrites=true&amp;w=majority</div>
          <div className="pt-2"><span className="text-slate-500"># Firecrawl API Key for live website crawling (https://firecrawl.dev)</span></div>
          <div><span className="text-amber-400">FIRECRAWL_API_KEY</span>=fc_live_...</div>
          <div className="pt-2"><span className="text-slate-500"># LLM API Key (Provide Gemini or OpenAI)</span></div>
          <div><span className="text-indigo-400">GEMINI_API_KEY</span>=AIzaSy...</div>
          <div><span className="text-slate-500"># or: OPENAI_API_KEY=sk-proj-...</span></div>
        </div>
      </div>

      {/* Database Reseeding Action */}
      <div className="bg-white p-6 border border-slate-200/80 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Reset Demo Baseline Dataset</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Restores the 40+ curated multi-sector career postings and Q1–Q4 2026 historical demand snapshots.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting Data...' : 'Reset to Baseline'}</span>
        </button>
      </div>
    </div>
  );
}
