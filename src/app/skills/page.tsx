'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
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
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Interactive Skill Explorer
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Search, filter, and inspect market metrics across all recognized technical and behavioral competencies.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3 text-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill name, related role (e.g. PyTorch, Cloud Architect, Payments)..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full md:w-auto">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500 w-full sm:w-40"
            >
              <option value="All">All Sectors</option>
              {INDUSTRIES.filter((i) => i !== 'All').map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>

            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500 w-full sm:w-36"
            >
              <option value="All">All Velocity</option>
              <option value="Rising">Rising Only</option>
              <option value="Stable">Stable Only</option>
              <option value="Declining">Declining Only</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 text-[11px]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-slate-700">{filteredSkills.length}</strong> competencies
        </span>
        {(search || selectedCategory !== 'All' || selectedIndustry !== 'All' || selectedClassification !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedIndustry('All');
              setSelectedClassification('All');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* High-Density Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading catalog...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="p-12 border border-slate-200 rounded-md text-center text-xs text-slate-500">
          No competencies match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSkills.map((sk) => (
            <div
              key={sk.skillId}
              onClick={() => setSelectedSkillId(sk.skillId)}
              className="p-4 border border-slate-200 hover:border-blue-400 rounded-md bg-white hover:bg-slate-50/50 cursor-pointer transition-colors flex flex-col justify-between group text-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {sk.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                      sk.classification === 'Rising'
                        ? 'text-emerald-700 font-semibold'
                        : sk.classification === 'Declining'
                        ? 'text-rose-700 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {sk.classification === 'Rising' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                    {sk.classification === 'Declining' && <TrendingDown className="w-3 h-3 text-rose-600" />}
                    {sk.classification === 'Stable' && <Minus className="w-3 h-3 text-slate-400" />}
                    <span>{sk.classification}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sk.skillName}
                </h3>

                <p className="text-slate-500 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">
                  {sk.aiInsight}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3 tabular-nums">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Demand</span>
                    <span className="font-semibold text-slate-800">{sk.currentDemandPct.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Velocity</span>
                    <span
                      className={`font-semibold ${
                        sk.pctChange > 0
                          ? 'text-emerald-700'
                          : sk.pctChange < 0
                          ? 'text-rose-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {sk.pctChange >= 0 ? `+${sk.pctChange.toFixed(1)}%` : `${sk.pctChange.toFixed(1)}%`}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
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
