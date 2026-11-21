'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Building2,
  Briefcase,
  Calendar,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { SkillDemandAnalysis } from '@/types';

interface SkillDetailModalProps {
  skillId: string | null;
  onClose: () => void;
}

export function SkillDetailModal({ skillId, onClose }: SkillDetailModalProps) {
  const [data, setData] = useState<(SkillDemandAnalysis & { matchingJobs?: any[] }) | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!skillId) {
      setData(null);
      return;
    }

    setLoading(true);
    fetch(`/api/skills/${skillId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [skillId]);

  if (!skillId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-2xl bg-white min-h-screen shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {data?.category || 'Skill Competency'}
              </span>
              {data && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    data.classification === 'Rising'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : data.classification === 'Declining'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {data.classification === 'Rising' && <TrendingUp className="w-3 h-3" />}
                  {data.classification === 'Declining' && <TrendingDown className="w-3 h-3" />}
                  {data.classification === 'Stable' && <Minus className="w-3 h-3" />}
                  {data.classification}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {data?.skillName || 'Loading skill details...'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading || !data ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-500 font-medium">Market Penetration</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {data.currentDemandPct.toFixed(1)}%
                </div>
                <span className="text-[11px] text-slate-500">of active job postings</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-500 font-medium">Period Velocity</span>
                <div
                  className={`text-2xl font-bold mt-1 ${
                    data.pctChange > 0
                      ? 'text-emerald-600'
                      : data.pctChange < 0
                      ? 'text-rose-600'
                      : 'text-slate-800'
                  }`}
                >
                  {data.pctChange >= 0 ? `+${data.pctChange.toFixed(1)}%` : `${data.pctChange.toFixed(1)}%`}
                </div>
                <span className="text-[11px] text-slate-500">vs previous period</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-500 font-medium">Total Mentions</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{data.currentMentions}</div>
                <span className="text-[11px] text-slate-500">in verified descriptions</span>
              </div>
            </div>

            {/* AI Grounded Market Explanation */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Grounded Trend Analysis</span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed font-normal">
                {data.aiInsight}
              </p>
            </div>

            {/* Historical Demand Chart */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Historical Demand Trajectory (% of jobs)
                </h3>
                <span className="text-[11px] text-slate-400">Quarterly Progression</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.historicalTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      unit="%"
                      domain={[0, 'dataMax + 15']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val}%`, 'Demand %']}
                    />
                    <Line
                      type="monotone"
                      dataKey="demandPct"
                      stroke={data.classification === 'Rising' ? '#10b981' : data.classification === 'Declining' ? '#ef4444' : '#3b82f6'}
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Industries & Related Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Industry Breakdown</span>
                </div>
                <div className="space-y-2">
                  {data.topIndustries.length === 0 ? (
                    <span className="text-xs text-slate-400">No industry data</span>
                  ) : (
                    data.topIndustries.map((ind, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 truncate max-w-[150px]">{ind.industry}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, ind.percentage)}%` }}
                            />
                          </div>
                          <span className="text-slate-700 font-semibold w-8 text-right">
                            {ind.count}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Associated Job Roles</span>
                </div>
                <div className="space-y-1.5">
                  {data.topRoles.length === 0 ? (
                    <span className="text-xs text-slate-400">No role data</span>
                  ) : (
                    data.topRoles.slice(0, 5).map((role, i) => (
                      <div
                        key={i}
                        className="text-xs p-1.5 bg-slate-50 rounded border border-slate-100 flex items-center justify-between"
                      >
                        <span className="text-slate-800 truncate font-medium">{role.role}</span>
                        <span className="text-slate-400 text-[11px]">{role.count} posts</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Verified Postings Referencing this Skill */}
            {data.matchingJobs && data.matchingJobs.length > 0 && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
                  Sample Career Postings Requiring This Competency
                </h4>
                <div className="space-y-2">
                  {data.matchingJobs.map((mj, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{mj.jobTitle}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {mj.company} &bull; {mj.industry}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white text-indigo-600 border border-slate-200">
                        {(mj.extractionConfidence * 100).toFixed(0)}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
