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
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && skillId) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skillId, onClose]);

  if (!skillId) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-2xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white min-h-screen shadow-2xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-start justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {data?.category || 'Skill Competency'}
              </span>
              {data && (
                <span
                  className={`text-[10px] sm:text-[11px] font-medium flex items-center gap-1 ${
                    data.classification === 'Rising'
                      ? 'text-emerald-700 font-semibold'
                      : data.classification === 'Declining'
                      ? 'text-rose-700 font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  &bull;
                  {data.classification === 'Rising' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                  {data.classification === 'Declining' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                  {data.classification === 'Stable' && <Minus className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{data.classification}</span>
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {data?.skillName || 'Loading skill details...'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Close skill details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading || !data ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
            {/* Open KPI Metric Row */}
            <div className="grid grid-cols-3 divide-x divide-slate-200 py-3 border-y border-slate-200 text-center">
              <div className="px-1.5 sm:px-3">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                  Market Share
                </span>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  {data.currentDemandPct.toFixed(1)}%
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400">of active postings</span>
              </div>

              <div className="px-1.5 sm:px-3">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                  Velocity
                </span>
                <div
                  className={`text-lg sm:text-2xl font-bold mt-0.5 tabular-nums ${
                    data.pctChange > 0
                      ? 'text-emerald-700'
                      : data.pctChange < 0
                      ? 'text-rose-700'
                      : 'text-slate-800'
                  }`}
                >
                  {data.pctChange >= 0 ? `+${data.pctChange.toFixed(1)}%` : `${data.pctChange.toFixed(1)}%`}
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400">vs prev period</span>
              </div>

              <div className="px-1.5 sm:px-3">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                  Mentions
                </span>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  {data.currentMentions}
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400">in tracked jobs</span>
              </div>
            </div>

            {/* AI Grounded Market Explanation */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 mb-1.5 font-semibold text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Grounded Trend Analysis</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {data.aiInsight}
              </p>
            </div>

            {/* Historical Demand Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Quarterly Demand Trajectory (% of jobs)
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Q1–Q4 '26</span>
              </div>
              <div className="h-44 w-full">
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
                        backgroundColor: '#0f172a',
                        borderRadius: '6px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: any) => [`${val}%`, 'Demand Share']}
                    />
                    <Line
                      type="monotone"
                      dataKey="demandPct"
                      stroke={data.classification === 'Rising' ? '#16a34a' : data.classification === 'Declining' ? '#dc2626' : '#2563eb'}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Industries & Related Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Industry Distribution</span>
                </div>
                <div className="space-y-1.5">
                  {data.topIndustries.length === 0 ? (
                    <span className="text-xs text-slate-400">No industry data</span>
                  ) : (
                    data.topIndustries.map((ind, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                        <span className="text-slate-600 truncate max-w-[150px]">{ind.industry}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-medium tabular-nums">
                            {ind.count} jobs
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
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
                        className="text-xs py-1 flex items-center justify-between border-b border-slate-100"
                      >
                        <span className="text-slate-700 truncate font-medium">{role.role}</span>
                        <span className="text-slate-400 text-[11px] tabular-nums">{role.count} posts</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sample Career Postings */}
            {data.matchingJobs && data.matchingJobs.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tracked Openings Requiring {data.skillName}
                </h4>
                <div className="space-y-2">
                  {data.matchingJobs.map((mj, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50/70 border border-slate-200 rounded-md flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{mj.jobTitle}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {mj.company} &bull; {mj.industry}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 tabular-nums">
                        {(mj.extractionConfidence * 100).toFixed(0)}% Confidence
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
