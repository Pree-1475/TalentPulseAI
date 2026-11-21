'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Building2,
  Briefcase,
  Layers,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { SkillDemandAnalysis, SkillCategory } from '@/types';
import { SkillDetailModal } from '@/components/SkillDetailModal';

const CATEGORIES: Array<'All' | SkillCategory> = [
  'All',
  'Programming Languages',
  'Frameworks & Libraries',
  'Cloud Technologies',
  'Databases',
  'AI & Machine Learning',
  'Technical Skills',
  'Soft Skills',
  'Management & Leadership',
  'Domain-Specific',
];

const INDUSTRIES = ['All', 'Technology', 'Financial Services', 'Consulting', 'Healthcare', 'E-commerce'];

export default function SkillExplorerPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Skill Explorer...</div>}>
      <SkillExplorerContent />
    </React.Suspense>
  );
}

function SkillExplorerContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [skills, setSkills] = useState<SkillDemandAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedClassification, setSelectedClassification] = useState<string>('All');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSkills(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredSkills = skills.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedClassification !== 'All' && item.classification !== selectedClassification) return false;
    if (selectedIndustry !== 'All') {
      const hasIndustry = item.topIndustries.some(
        (ti) => ti.industry.toLowerCase() === selectedIndustry.toLowerCase()
      );
      if (!hasIndustry) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const inName = item.skillName.toLowerCase().includes(q);
      const inCategory = item.category.toLowerCase().includes(q);
      const inRoles = item.topRoles.some((r) => r.role.toLowerCase().includes(q));
      if (!inName && !inCategory && !inRoles) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Interactive Skill Explorer
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Search, filter, and inspect granular market metrics across all recognized technical and behavioral competencies.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 border border-slate-200/80 rounded-xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill name, related role (e.g. PyTorch, Cloud Architect, Payments)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none w-full md:w-44"
            >
              <option value="All">All Industries</option>
              {INDUSTRIES.filter((i) => i !== 'All').map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>

            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none w-full md:w-40"
            >
              <option value="All">All Momentum</option>
              <option value="Rising">Rising Only</option>
              <option value="Stable">Stable Only</option>
              <option value="Declining">Declining Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-[11px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredSkills.length}</strong> competencies matching criteria
        </span>
        {(search || selectedCategory !== 'All' || selectedIndustry !== 'All' || selectedClassification !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedIndustry('All');
              setSelectedClassification('All');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Grid of Skill Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading skill catalog...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-xl text-center">
          <p className="text-sm font-semibold text-slate-700">No skills match the selected filters</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting search keywords or categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((sk) => (
            <div
              key={sk.skillId}
              onClick={() => setSelectedSkillId(sk.skillId)}
              className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {sk.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      sk.classification === 'Rising'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sk.classification === 'Declining'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {sk.classification === 'Rising' && <TrendingUp className="w-3 h-3" />}
                    {sk.classification === 'Declining' && <TrendingDown className="w-3 h-3" />}
                    {sk.classification === 'Stable' && <Minus className="w-3 h-3" />}
                    {sk.classification}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {sk.skillName}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {sk.aiInsight}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Demand Share</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {sk.currentDemandPct.toFixed(1)}%
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Period &Delta;%</span>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      sk.pctChange > 0
                        ? 'text-emerald-600'
                        : sk.pctChange < 0
                        ? 'text-rose-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {sk.pctChange >= 0 ? `+${sk.pctChange.toFixed(1)}%` : `${sk.pctChange.toFixed(1)}%`}
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skillId={selectedSkillId}
        onClose={() => setSelectedSkillId(null)}
      />
    </div>
  );
}
