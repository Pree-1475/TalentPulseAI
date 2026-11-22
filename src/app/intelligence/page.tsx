'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  ArrowUpDown,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { SkillDemandAnalysis } from '@/types';
import { SkillDetailModal } from '@/components/SkillDetailModal';

export default function IntelligencePage() {
  const [analyses, setAnalyses] = useState<SkillDemandAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'demand' | 'change' | 'mentions'>('change');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.all) {
          setAnalyses(json.data.all);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredAnalyses = analyses
    .filter((a) => {
      if (filterClass !== 'All' && a.classification !== filterClass) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.skillName.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.topIndustries.some((ti) => ti.industry.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'change') {
        valA = a.pctChange;
        valB = b.pctChange;
      } else if (sortField === 'demand') {
        valA = a.currentDemandPct;
        valB = b.currentDemandPct;
      } else if (sortField === 'mentions') {
        valA = a.currentMentions;
        valB = b.currentMentions;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  const risingCount = analyses.filter((a) => a.classification === 'Rising').length;
  const stableCount = analyses.filter((a) => a.classification === 'Stable').length;
  const decliningCount = analyses.filter((a) => a.classification === 'Declining').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Skill Demand Intelligence &amp; Velocity
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Deterministic statistical momentum calculation derived from comparative quarterly snapshots. Classifications are rule-based and derived from verified posting observations.
        </p>
      </div>

      {/* Transparent Statistical Methodology Box */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-300">
            Mathematical Formulation &amp; Classification Boundaries
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          Relative velocity is computed as:
          <span className="font-mono text-blue-300 ml-1">
            &Delta;% = ((DemandPct&#8322; - DemandPct&#8321;) / DemandPct&#8321;) &times; 100
          </span>
          . The LLM provides contextual interpretation based strictly on these empirical metrics.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span><strong>Rising:</strong> &ge; +12.0% relative growth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span><strong>Stable:</strong> Between -10.0% and +12.0%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span><strong>Declining:</strong> &le; -10.0% relative drop</span>
          </div>
        </div>
      </div>

      {/* Open Segmented Filter Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 text-xs overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: 'All', label: 'All Monitored Skills', count: analyses.length },
          { id: 'Rising', label: 'Rising Skills', count: risingCount, color: 'text-emerald-700' },
          { id: 'Stable', label: 'Stable Skills', count: stableCount, color: 'text-slate-600' },
          { id: 'Declining', label: 'Declining Skills', count: decliningCount, color: 'text-rose-700' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterClass(tab.id)}
            className={`pb-2.5 font-medium transition-colors relative flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              filterClass === tab.id
                ? 'text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[11px] tabular-nums font-mono ${tab.color || 'text-slate-400'}`}>
              ({tab.count})
            </span>
            {filterClass === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by skill, category, or industry..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="change">Period Change (&Delta;%)</option>
            <option value="demand">Current Demand (% Roles)</option>
            <option value="mentions">Total Mentions</option>
          </select>

          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="p-1 border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Intelligence Table */}
      <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Calculating intelligence metrics...</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No skills matched the specified criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Skill / Competency</th>
                  <th className="py-2.5 px-3.5">Category</th>
                  <th className="py-2.5 px-3.5">Momentum</th>
                  <th className="py-2.5 px-3.5">Period &Delta;%</th>
                  <th className="py-2.5 px-3.5">Market Share (% Roles)</th>
                  <th className="py-2.5 px-3.5">Primary Sector</th>
                  <th className="py-2.5 px-3.5">AI Statistical Explanation</th>
                  <th className="py-2.5 px-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAnalyses.map((a) => (
                  <tr
                    key={a.skillId}
                    onClick={() => setSelectedSkillId(a.skillId)}
                    className="hover:bg-slate-50/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3.5 font-semibold text-slate-900 group-hover:text-blue-600">
                      {a.skillName}
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      {a.category}
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          a.classification === 'Rising'
                            ? 'text-emerald-700 font-semibold'
                            : a.classification === 'Declining'
                            ? 'text-rose-700 font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        {a.classification === 'Rising' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                        {a.classification === 'Declining' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                        {a.classification === 'Stable' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{a.classification}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-mono font-semibold tabular-nums">
                      <span
                        className={
                          a.pctChange > 0
                            ? 'text-emerald-700'
                            : a.pctChange < 0
                            ? 'text-rose-700'
                            : 'text-slate-600'
                        }
                      >
                        {a.pctChange >= 0 ? `+${a.pctChange.toFixed(1)}%` : `${a.pctChange.toFixed(1)}%`}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-slate-800 tabular-nums">
                      {a.currentDemandPct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      {a.topIndustries[0]?.industry || 'Cross-industry'}
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 max-w-xs truncate text-[11px]">
                      {a.aiInsight}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSkillId(a.skillId);
                        }}
                        className="text-slate-400 group-hover:text-blue-600 p-1"
                        aria-label={`View ${a.skillName} details`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skillId={selectedSkillId}
        onClose={() => setSelectedSkillId(null)}
      />
    </div>
  );
}
