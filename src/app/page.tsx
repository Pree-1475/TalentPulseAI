'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { DashboardMetrics } from '@/types';
import { StatusBanner } from '@/components/StatusBanner';
import { SkillDetailModal } from '@/components/SkillDetailModal';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Toggleable chart series visibility
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    Python: true,
    'Generative AI': true,
    TypeScript: true,
    AWS: true,
    Kubernetes: true,
    'Legacy PHP': true,
  });

  const fetchMetrics = () => {
    setRefreshing(true);
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const toggleSeries = (skillName: string) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium text-slate-500">
          Loading market intelligence analytics...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center border border-slate-200 rounded-lg">
        <p className="text-xs text-slate-600">Failed to load analytics data.</p>
        <button
          onClick={fetchMetrics}
          className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const seriesColors: Record<string, string> = {
    Python: '#2563eb', // Enterprise Blue
    'Generative AI': '#16a34a', // Emerald Green
    TypeScript: '#6366f1', // Indigo
    AWS: '#d97706', // Amber
    Kubernetes: '#0891b2', // Cyan
    'Legacy PHP': '#dc2626', // Red (declining)
  };

  return (
    <div className="space-y-8">
      {/* 1. Context Banner */}
      <StatusBanner isDemoMode={data.isDemoMode} />

      {/* 2. Main Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Market Skill Demand Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time synthesis of technical and behavioral skill demand based on job description crawling and AI extraction.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchMetrics}
            disabled={refreshing}
            className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/sources"
            className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-2xs"
          >
            <span>Run New Crawl</span>
          </Link>
        </div>
      </div>

      {/* 3. Open Horizontal KPI Metric Row (NO SEPARATE CARDS) */}
      <div className="border-y border-slate-200 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x divide-slate-200">
        {/* Jobs Analyzed */}
        <div className="px-2 sm:px-4 lg:first:pl-0">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Jobs Analyzed
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tabular-nums">
            {data.totalJobsAnalyzed}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">5 sectors</span>
        </div>

        {/* Unique Skills */}
        <div className="px-2 sm:px-4">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Unique Skills
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tabular-nums">
            {data.uniqueSkillsIdentified}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">Normalized taxonomy</span>
        </div>

        {/* Rising Skills */}
        <div className="px-2 sm:px-4">
          <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">Rising</span>
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1 tabular-nums">
            {data.risingSkillsCount}
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-700 font-medium mt-0.5 block truncate">
            &ge; +12% Demand
          </span>
        </div>

        {/* Stable Skills */}
        <div className="px-2 sm:px-4">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <Minus className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">Stable</span>
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1 tabular-nums">
            {data.stableSkillsCount}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 block truncate">Consistent baseline</span>
        </div>

        {/* Declining Skills */}
        <div className="px-2 sm:px-4 col-span-2 sm:col-span-1 lg:last:pr-0">
          <span className="text-[10px] sm:text-[11px] font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span className="truncate">Declining</span>
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-rose-700 mt-1 tabular-nums">
            {data.decliningSkillsCount}
          </div>
          <span className="text-[10px] sm:text-[11px] text-rose-700 font-medium mt-0.5 block truncate">
            &le; -10% Contraction
          </span>
        </div>
      </div>

      {/* 4. Main Analytics Layout: Dominant Trend Chart (68%) + Top Competencies (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Dominant Trend Chart (8 cols ~ 67%) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Skill Demand Trends Over Time
              </h2>
              <p className="text-[11px] text-slate-500">
                Share of job postings requiring each technology across 2026 quarters
              </p>
            </div>

            {/* Interactive series toggle buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              {Object.keys(seriesColors).map((name) => {
                const isVisible = visibleSeries[name] !== false;
                const color = seriesColors[name];
                return (
                  <button
                    key={name}
                    onClick={() => toggleSeries(name)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all border flex items-center gap-1 ${
                      isVisible
                        ? 'bg-slate-50 text-slate-800 border-slate-200'
                        : 'bg-white text-slate-300 border-slate-100 line-through'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isVisible ? color : '#cbd5e1' }}
                    />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.skillDemandTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  unit="%"
                  domain={[0, 90]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '6px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                />
                {visibleSeries['Python'] && (
                  <Line
                    type="monotone"
                    dataKey="Python"
                    stroke={seriesColors['Python']}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                )}
                {visibleSeries['Generative AI'] && (
                  <Line
                    type="monotone"
                    dataKey="Generative AI"
                    stroke={seriesColors['Generative AI']}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                )}
                {visibleSeries['TypeScript'] && (
                  <Line
                    type="monotone"
                    dataKey="TypeScript"
                    stroke={seriesColors['TypeScript']}
                    strokeWidth={1.5}
                    dot={{ r: 3 }}
                  />
                )}
                {visibleSeries['AWS'] && (
                  <Line
                    type="monotone"
                    dataKey="AWS"
                    stroke={seriesColors['AWS']}
                    strokeWidth={1.5}
                    dot={{ r: 3 }}
                  />
                )}
                {visibleSeries['Kubernetes'] && (
                  <Line
                    type="monotone"
                    dataKey="Kubernetes"
                    stroke={seriesColors['Kubernetes']}
                    strokeWidth={1.5}
                    dot={{ r: 3 }}
                  />
                )}
                {visibleSeries['Legacy PHP'] && (
                  <Line
                    type="monotone"
                    dataKey="Legacy PHP"
                    stroke={seriesColors['Legacy PHP']}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Demanded Competencies Ranked List (4 cols ~ 33%) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Top Demanded Competencies
              </h2>
              <p className="text-[11px] text-slate-500">
                Highest share of job descriptions mentioning skill
              </p>
            </div>
            <Link
              href="/skills"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {data.topDemandedSkills.slice(0, 7).map((skill, idx) => (
              <div
                key={skill.id}
                onClick={() => setSelectedSkillId(skill.id)}
                className="group cursor-pointer space-y-1 hover:bg-slate-50/60 p-1.5 rounded transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px] w-3">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-semibold text-slate-900">
                      {skill.demandPercentage}%
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        skill.pctChange > 0
                          ? 'text-emerald-700'
                          : skill.pctChange < 0
                          ? 'text-rose-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {skill.pctChange >= 0 ? `+${skill.pctChange}%` : `${skill.pctChange}%`}
                    </span>
                  </div>
                </div>

                {/* Subtle horizontal indicator */}
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-1 bg-slate-800 group-hover:bg-blue-600 rounded-full transition-colors"
                    style={{ width: `${Math.min(100, skill.demandPercentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Contextual Intelligence & Recent Activity (Open Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
        {/* Sector Breakdowns (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Demand Concentration by Target Industry
            </h3>
            <p className="text-[11px] text-slate-500">
              Observed skill demand clusters within monitored verticals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {data.demandByIndustry.slice(0, 4).map((ind, idx) => (
              <div
                key={idx}
                className="p-3 border border-slate-200 rounded-md bg-white text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ind.industry}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 tabular-nums font-normal">
                    {ind.count} openings
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {ind.topSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Ingestion Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Ingestion Activity
              </h3>
              <p className="text-[11px] text-slate-500">
                Audited crawler jobs &amp; AI extraction events
              </p>
            </div>
            <Link
              href="/sources"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Sources &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {data.recentActivity.map((act) => (
              <div key={act.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      act.status === 'success'
                        ? 'bg-emerald-500'
                        : act.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div>
                    <p className="text-slate-800 font-medium text-xs">{act.description}</p>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {act.type} event
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap tabular-nums">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Skill Detail Drawer/Modal */}
      <SkillDetailModal
        skillId={selectedSkillId}
        onClose={() => setSelectedSkillId(null)}
      />
    </div>
  );
}
