'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Briefcase,
  Layers,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Building2,
  Clock,
  ArrowRight,
  Filter,
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
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DashboardMetrics, SkillCategory } from '@/types';
import { StatusBanner } from '@/components/StatusBanner';
import { SkillDetailModal } from '@/components/SkillDetailModal';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-500">
          Synthesizing Job Market Intelligence...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
        <p className="text-slate-600">Failed to load analytics data.</p>
        <button
          onClick={fetchMetrics}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <StatusBanner isDemoMode={data.isDemoMode} />

      {/* Header section with Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Market Skill Demand Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time synthesis of technical and behavioral skill demand based on job description crawling and AI extraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
          <Link
            href="/sources"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
          >
            <span>Run New Crawl</span>
          </Link>
        </div>
      </div>

      {/* 5 Top-Level KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Jobs */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jobs Analyzed
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {data.totalJobsAnalyzed}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <span className="text-emerald-600 font-semibold">100% verified</span>
            <span>across 5 sectors</span>
          </div>
        </div>

        {/* Unique Skills */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unique Skills
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {data.uniqueSkillsIdentified}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <span>Canonical taxonomy</span>
          </div>
        </div>

        {/* Rising Skills */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Rising Skills
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">
            {data.risingSkillsCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <span>&ge; +12% Demand Growth</span>
          </div>
        </div>

        {/* Stable Skills */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Stable Skills
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Minus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-2">
            {data.stableSkillsCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium mt-1">
            <span>Consistent baseline</span>
          </div>
        </div>

        {/* Declining Skills */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:border-rose-200 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Declining Skills
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-2">
            {data.decliningSkillsCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
            <span>&le; -10% Contraction</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Demand Trends Over Time & Top 10 Most Demanded Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Over Time (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 border border-slate-200/80 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Skill Demand Trends Over Time
              </h2>
              <p className="text-[11px] text-slate-500">
                Percentage of job openings requiring each key technology across 2026 quarters
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              Historical Timeline
            </span>
          </div>

          <div className="h-72 w-full">
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
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="Python"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Generative AI"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="TypeScript"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="AWS"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Kubernetes"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Legacy PHP"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Most Demanded Skills (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 border border-slate-200/80 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
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
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data.topDemandedSkills.slice(0, 7)}
                margin={{ left: 10, right: 20, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}% of jobs`, 'Demand']}
                />
                <Bar
                  dataKey="demandPercentage"
                  fill="#4f46e5"
                  radius={[0, 4, 4, 0]}
                  onClick={(entry) => setSelectedSkillId(entry.id)}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Distribution & Category Demand & Industry Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distribution Donut */}
        <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Demand Momentum Distribution
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Proportion of tracked skills by demand velocity
            </p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.classificationDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.classificationDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {data.classificationDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value} skills</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demand by Category */}
        <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Demand by Skill Category
              </h3>
              <p className="text-[11px] text-slate-500">
                Distribution across standard technical domains
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-3">
            {data.demandByCategory.slice(0, 5).map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium truncate max-w-[170px]">
                    {cat.category}
                  </span>
                  <span className="text-slate-500 font-medium">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, cat.percentage * 2.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand by Industry */}
        <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Demand by Target Industry
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Top skill clusters within monitored sectors
            </p>
          </div>

          <div className="space-y-2.5 my-3">
            {data.demandByIndustry.slice(0, 4).map((ind, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ind.industry}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{ind.count} openings</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {ind.topSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/intelligence"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>Explore Industry Heatmaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom Section: Recent Ingestion Activity Feed */}
      <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Recent System Activity
            </h3>
            <p className="text-[11px] text-slate-500">
              Live crawler execution, AI extraction logs, and historical index calculations
            </p>
          </div>
          <Link
            href="/sources"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Manage Data Sources &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {data.recentActivity.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    act.status === 'success'
                      ? 'bg-emerald-500'
                      : act.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`}
                />
                <div>
                  <p className="text-xs font-medium text-slate-800">{act.description}</p>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {act.type} event
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                <Clock className="w-3 h-3" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
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
