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

  const getInsightCategoryBadge = (type: AiInsightType) => {
    switch (type) {
      case 'emerging':
        return 'Emerging Competencies';
      case 'declining':
        return 'Declining Competencies';
      case 'industry_shift':
        return 'Industry Shifts';
      case 'recruitment':
        return 'Recruitment Priorities';
      case 'upskilling':
        return 'Workforce Upskilling';
      case 'skill_combinations':
        return 'Co-occurrence Clusters';
      default:
        return type;
    }
  };

  const filteredInsights = activeFilter === 'all'
    ? insights
    : insights.filter((i) => i.insightType === activeFilter);

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            AI Strategic Workforce Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            LLM-synthesized executive briefings grounded in database observations. Clearly distinguishes observed empirical shifts from tactical HR recommendations.
          </p>
        </div>

        <button
          onClick={() => fetchInsights(true)}
          disabled={refreshing}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Regenerate Insights</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 text-xs">
        {[
          { id: 'all', label: 'All Findings' },
          { id: 'emerging', label: 'Emerging Skills' },
          { id: 'declining', label: 'Declining Skills' },
          { id: 'industry_shift', label: 'Industry Shifts' },
          { id: 'recruitment', label: 'Recruitment Priorities' },
          { id: 'upskilling', label: 'Upskilling Pathways' },
          { id: 'skill_combinations', label: 'Skill Clusters' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editorial Layout of Insights */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Compiling strategic workforce insights...
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 border border-slate-200 rounded-md">
          No insights available for this category.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInsights.map((insight, idx) => (
            <article
              key={insight.id}
              className="p-6 border border-slate-200 rounded-lg bg-white space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {getInsightCategoryBadge(insight.insightType)}
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(insight.generatedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {insight.skillsInvolved.map((sk, skIdx) => (
                    <span
                      key={skIdx}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Factual Description */}
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-slate-900">
                  {insight.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {insight.description}
                </p>
              </div>

              {/* Supporting Numerical Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 border-y border-slate-100 text-xs">
                {insight.supportingStatistics.map((stat, sIdx) => (
                  <div key={sIdx} className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                      {stat.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actionable HR Recommendations */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider block">
                  Actionable Strategic Recommendations
                </span>
                <div className="space-y-1.5">
                  {insight.actionableRecommendations.map((rec, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-start gap-2 text-slate-700 leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
