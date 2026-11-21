'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Table,
} from 'lucide-react';
import { DashboardMetrics, SkillDemandAnalysis, AiInsight } from '@/types';

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [analyses, setAnalyses] = useState<SkillDemandAnalysis[]>([]);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then((r) => r.json()),
      fetch('/api/analytics').then((r) => r.json()),
      fetch('/api/insights').then((r) => r.json()),
    ])
      .then(([dashRes, anaRes, insRes]) => {
        if (dashRes.success) setMetrics(dashRes.data);
        if (anaRes.success) setAnalyses(anaRes.data.all);
        if (insRes.success) setInsights(insRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = (type: 'skills' | 'jobs') => {
    window.location.href = `/api/export?type=${type}`;
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Compiling Executive Workforce Report...
      </div>
    );
  }

  const rising = analyses.filter((a) => a.classification === 'Rising');
  const stable = analyses.filter((a) => a.classification === 'Stable');
  const declining = analyses.filter((a) => a.classification === 'Declining');

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Workforce Intelligence &amp; Skill Demand Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal executive briefings, download raw CSV datasets, or print/export official PDF reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCsv('skills')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Skills CSV</span>
          </button>
          <button
            onClick={() => handleExportCsv('jobs')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Table className="w-4 h-4 text-slate-500" />
            <span>Export Jobs CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8 max-w-5xl mx-auto space-y-8">
        {/* Report Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                TalentPulse AI &bull; Executive Market Briefing
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Job Market Skill Demand &amp; Workforce Planning Report
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
              <span>Coverage: Q1 2026 &ndash; Q4 2026</span>
              <span>&bull;</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span>&bull;</span>
              <span>Classification Standard: Relative Velocity Delta (&Delta;%)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-900">Talent Acquisition &amp; Strategy</div>
            <div className="text-[11px] text-slate-400">Enterprise Edition</div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            1. High-Level Market Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500">Postings Analyzed</span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {metrics?.totalJobsAnalyzed || 0}
              </div>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-emerald-700 font-semibold">Rising Competencies</span>
              <div className="text-2xl font-bold text-emerald-700 mt-0.5">{rising.length}</div>
            </div>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <span className="text-[11px] text-blue-700 font-semibold">Stable Competencies</span>
              <div className="text-2xl font-bold text-blue-700 mt-0.5">{stable.length}</div>
            </div>
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
              <span className="text-[11px] text-rose-700 font-semibold">Declining Competencies</span>
              <div className="text-2xl font-bold text-rose-700 mt-0.5">{declining.length}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Top Demanded Skills Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            2. Top 10 Most Demanded Skills Across All Monitored Openings
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Skill</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Momentum</th>
                  <th className="py-2.5 px-3">Demand %</th>
                  <th className="py-2.5 px-3">Period &Delta;%</th>
                  <th className="py-2.5 px-3">Primary Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyses.slice(0, 8).map((sk, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{sk.skillName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sk.category}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          sk.classification === 'Rising'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sk.classification === 'Declining'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {sk.classification}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {sk.currentDemandPct.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {sk.pctChange >= 0 ? `+${sk.pctChange.toFixed(1)}%` : `${sk.pctChange.toFixed(1)}%`}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {sk.topIndustries[0]?.industry || 'Cross-industry'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Rising vs Declining Breakout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-xs uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>Surging Demand Leaders (&ge; +12% growth)</span>
            </div>
            <div className="space-y-2 mt-3">
              {rising.slice(0, 4).map((r, i) => (
                <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-900">{r.skillName}</span>
                    <span className="text-emerald-600">+{r.pctChange.toFixed(1)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{r.aiInsight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold text-xs uppercase">
              <TrendingDown className="w-4 h-4" />
              <span>Contracting Paradigms (&le; -10% decline)</span>
            </div>
            <div className="space-y-2 mt-3">
              {declining.slice(0, 4).map((d, i) => (
                <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-900">{d.skillName}</span>
                    <span className="text-rose-600">{d.pctChange.toFixed(1)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{d.aiInsight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Strategic AI HR Recommendations */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            3. Strategic AI Workforce Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.slice(0, 4).map((ins, idx) => (
              <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {ins.insightType.replace('_', ' ')}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{ins.title}</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{ins.description}</p>
                <div className="space-y-1 pt-1">
                  {ins.actionableRecommendations.slice(0, 1).map((rec, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5 text-[11px] text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <span>TalentPulse AI Enterprise Analytics &bull; Confidential Internal Report</span>
          <span>End of Report</span>
        </div>
      </div>
    </div>
  );
}
