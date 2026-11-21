'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  GraduationCap,
  Network,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';
import { AiInsight, AiInsightType } from '@/types';

export default function InsightsPage() {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchInsights = (force = false) => {
    if (force) setRefreshing(true);
    const method = force ? 'POST' : 'GET';
    fetch('/api/insights', { method })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setInsights(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchInsights(false);
  }, []);

  const getInsightIcon = (type: AiInsightType) => {
    switch (type) {
      case 'emerging':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-rose-600" />;
      case 'industry_shift':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'recruitment':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'upskilling':
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      case 'skill_combinations':
        return <Network className="w-5 h-5 text-amber-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBadgeColor = (type: AiInsightType) => {
    switch (type) {
      case 'emerging':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'declining':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'industry_shift':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'recruitment':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'upskilling':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'skill_combinations':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredInsights = activeFilter === 'all'
    ? insights
    : insights.filter((i) => i.insightType === activeFilter);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>AI Strategic Workforce Insights</span>
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            LLM-synthesized executive briefings grounded in database observations. Distinguishes observed empirical shifts from tactical HR recommendations.
          </p>
        </div>

        <button
          onClick={() => fetchInsights(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Regenerate Strategic Insights</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Insights' },
          { id: 'emerging', label: '1. Emerging Skills' },
          { id: 'declining', label: '2. Declining Skills' },
          { id: 'industry_shift', label: '3. Industry Shifts' },
          { id: 'recruitment', label: '4. Recruitment Priorities' },
          { id: 'upskilling', label: '5. Upskilling Pathways' },
          { id: 'skill_combinations', label: '6. Co-Occurrence Clusters' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-colors ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insights Cards List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Synthesizing strategic workforce intelligence...
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No insights found for this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className="p-6 bg-white border border-slate-200/80 rounded-xl shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mt-0.5">
                    {getInsightIcon(insight.insightType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getBadgeColor(
                          insight.insightType
                        )}`}
                      >
                        {insight.insightType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(insight.generatedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {insight.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Observed Description */}
              <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200/60">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Empirical Observation (Grounded in crawl records)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {insight.description}
                </p>
              </div>

              {/* Supporting Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {insight.supportingStatistics.map((stat, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between"
                  >
                    <span className="text-[10px] text-slate-400 font-medium">{stat.label}</span>
                    <span className="text-sm font-bold text-slate-800 mt-1">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Actionable HR Recommendations */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Actionable HR Strategic Recommendations</span>
                </div>
                <div className="space-y-1.5">
                  {insight.actionableRecommendations.map((rec, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-950"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Involved Tags */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px]">Associated Competencies:</span>
                <div className="flex flex-wrap gap-1">
                  {insight.skillsInvolved.map((sk, skIdx) => (
                    <span
                      key={skIdx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
