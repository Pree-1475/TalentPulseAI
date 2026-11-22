'use client';

import React, { useEffect, useState } from 'react';
import {
  Download,
  Printer,
  Table,
  CheckCircle2,
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
        Compiling executive workforce report...
      </div>
    );
  }

  const rising = analyses.filter((a) => a.classification === 'Rising');
  const stable = analyses.filter((a) => a.classification === 'Stable');
  const declining = analyses.filter((a) => a.classification === 'Declining');

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Workforce Intelligence &amp; Skill Demand Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Generate formal executive briefings, download raw CSV datasets, or print/export official PDF reports.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleExportCsv('skills')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Skills CSV</span>
          </button>
          <button
            onClick={() => handleExportCsv('jobs')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            <Table className="w-3.5 h-3.5 text-slate-500" />
            <span>Jobs CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="border border-slate-200 rounded-lg p-8 max-w-5xl mx-auto space-y-8 bg-white">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
              TalentPulse AI &bull; Executive Market Briefing
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Job Market Skill Demand &amp; Workforce Planning Report
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Coverage: Q1 2026 &ndash; Q4 2026</span>
              <span>&bull;</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
              <span>&bull;</span>
              <span>Standard: Deterministic Relative Velocity Delta (&Delta;%)</span>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-semibold text-slate-900">Talent Acquisition &amp; Strategy</div>
            <div className="text-slate-400">Enterprise Edition</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            1. High-Level Market Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Postings Analyzed</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                {metrics?.totalJobsAnalyzed || 0}
              </span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium block text-[11px]">Rising Competencies</span>
              <span className="text-2xl font-bold text-emerald-700 tabular-nums">
                {rising.length}
              </span>
            </div>
            <div>
              <span className="text-slate-600 font-medium block text-[11px]">Stable Competencies</span>
              <span className="text-2xl font-bold text-slate-800 tabular-nums">
                {stable.length}
              </span>
            </div>
            <div>
              <span className="text-rose-700 font-medium block text-[11px]">Declining Competencies</span>
              <span className="text-2xl font-bold text-rose-700 tabular-nums">
                {declining.length}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Top Demanded Skills Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            2. Top Demanded Skills Across Monitored Openings
          </h3>
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Skill</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Momentum</th>
                  <th className="py-2.5 px-3">Market Share (%)</th>
                  <th className="py-2.5 px-3">Period &Delta;%</th>
                  <th className="py-2.5 px-3">Primary Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyses.slice(0, 8).map((sk, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{sk.skillName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sk.category}</td>
                    <td className="py-2.5 px-3 font-medium">
                      <span
                        className={
                          sk.classification === 'Rising'
                            ? 'text-emerald-700'
                            : sk.classification === 'Declining'
                            ? 'text-rose-700'
                            : 'text-slate-600'
                        }
                      >
                        {sk.classification}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 tabular-nums">
                      {sk.currentDemandPct.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Surging Demand Leaders (&ge; +12% growth)
            </h4>
            <div className="space-y-2 text-xs">
              {rising.slice(0, 3).map((r, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-md space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-900">{r.skillName}</span>
                    <span className="text-emerald-700 font-mono tabular-nums">+{r.pctChange.toFixed(1)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{r.aiInsight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Contracting Competencies (&le; -10% decline)
            </h4>
            <div className="space-y-2 text-xs">
              {declining.slice(0, 3).map((d, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-md space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-900">{d.skillName}</span>
                    <span className="text-rose-700 font-mono tabular-nums">{d.pctChange.toFixed(1)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{d.aiInsight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Strategic Recommendations */}
        <div className="space-y-3 pt-4 border-t border-slate-200 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            3. Actionable Workforce Planning Advice
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.slice(0, 4).map((ins, idx) => (
              <div key={idx} className="p-3.5 border border-slate-200 rounded-md space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {ins.insightType.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900">{ins.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{ins.description}</p>
                <div className="pt-1">
                  {ins.actionableRecommendations.slice(0, 1).map((rec, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5 text-[11px] text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>TalentPulse AI Enterprise Analytics &bull; Confidential Executive Briefing</span>
          <span>End of Document</span>
        </div>
      </div>
    </div>
  );
}
