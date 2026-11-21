'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
  ArrowUpDown,
  Filter,
  Search,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { SkillDemandAnalysis, DemandClassification } from '@/types';
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Skill Demand Intelligence &amp; Velocity
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Algorithmic classification of technical and professional skill trajectories derived from chronological observation snapshots.
        </p>
      </div>

      {/* Transparent Statistical Methodology Box */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-xl shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Transparent Classification Methodology &amp; Mathematical Formulation
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Classifications are strictly deterministic and never hallucinated by generative models.
          For periods \(T_1\) and \(T_2\), relative demand change is formulated as:
          <span className="font-mono text-indigo-300 ml-1">
            &Delta;% = ((DemandPct&#8322; - DemandPct&#8321;) / DemandPct&#8321;) &times; 100
          </span>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span><strong>Rising:</strong> &ge; +12.0% relative surge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span><strong>Stable:</strong> Between -10.0% and +12.0%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span><strong>Declining:</strong> &le; -10.0% relative drop</span>
          </div>
        </div>
      </div>

      {/* Segment Selector & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterClass('All')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterClass === 'All'
              ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            All Monitored
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{analyses.length}</div>
          <span className="text-[11px] text-slate-400">Total skills indexed</span>
        </button>

        <button
          onClick={() => setFilterClass('Rising')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterClass === 'Rising'
              ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-600'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
              Rising Skills
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{risingCount}</div>
          <span className="text-[11px] text-emerald-600">Surging demand</span>
        </button>

        <button
          onClick={() => setFilterClass('Stable')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterClass === 'Stable'
              ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
              : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
              Stable Skills
            </span>
            <Minus className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{stableCount}</div>
          <span className="text-[11px] text-blue-600">Core market baselines</span>
        </button>

        <button
          onClick={() => setFilterClass('Declining')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterClass === 'Declining'
              ? 'bg-white border-rose-600 shadow-sm ring-1 ring-rose-600'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-700 font-semibold uppercase tracking-wider">
              Declining Skills
            </span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{decliningCount}</div>
          <span className="text-[11px] text-rose-600">Sunsetting frameworks</span>
        </button>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="bg-white p-4 border border-slate-200/80 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by skill, category, or industry..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Sort By:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="change">Demand Change (&Delta;%)</option>
            <option value="demand">Current Demand (% of roles)</option>
            <option value="mentions">Total Mentions</option>
          </select>

          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900"
            title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Intelligence Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Calculating analytics...</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No skills matched your search and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Skill / Competency</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Period &Delta;%</th>
                  <th className="py-3 px-4">Market Share (% Roles)</th>
                  <th className="py-3 px-4">Primary Industry</th>
                  <th className="py-3 px-4">AI Statistical Explanation</th>
                  <th className="py-3 px-4 text-right">Deep Dive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAnalyses.map((a) => (
                  <tr
                    key={a.skillId}
                    onClick={() => setSelectedSkillId(a.skillId)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-indigo-600">
                      {a.skillName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {a.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          a.classification === 'Rising'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : a.classification === 'Declining'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : a.classification === 'Stable'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {a.classification === 'Rising' && <TrendingUp className="w-3 h-3" />}
                        {a.classification === 'Declining' && <TrendingDown className="w-3 h-3" />}
                        {a.classification === 'Stable' && <Minus className="w-3 h-3" />}
                        {a.classification}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={
                          a.pctChange > 0
                            ? 'text-emerald-600'
                            : a.pctChange < 0
                            ? 'text-rose-600'
                            : 'text-slate-600'
                        }
                      >
                        {a.pctChange >= 0 ? `+${a.pctChange.toFixed(1)}%` : `${a.pctChange.toFixed(1)}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {a.currentDemandPct.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {a.topIndustries[0]?.industry || 'Technology'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {a.aiInsight}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSkillId(a.skillId);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50"
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
