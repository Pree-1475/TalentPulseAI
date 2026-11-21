'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe,
  Plus,
  Play,
  RotateCw,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Building2,
  MapPin,
  ChevronRight,
  Eye,
  X,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Source, Job, SourceType } from '@/types';

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawlingId, setCrawlingId] = useState<string | null>(null);
  const [crawlNotice, setCrawlNotice] = useState<string | null>(null);

  // New source form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<SourceType>('Technology');
  const [submitting, setSubmitting] = useState(false);

  // Job viewer modal state
  const [viewingJobsSource, setViewingJobsSource] = useState<Source | null>(null);
  const [sourceJobs, setSourceJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const presetSources: Array<{ name: string; url: string; type: SourceType }> = [
    { name: 'Stripe Engineering', url: 'https://careers.stripe.com/jobs', type: 'Financial Services' },
    { name: 'Anthropic AI', url: 'https://boards.greenhouse.io/anthropic', type: 'Technology' },
    { name: 'McKinsey Digital', url: 'https://careers.mckinsey.com/technology', type: 'Consulting' },
    { name: 'Optum Healthcare', url: 'https://optum.wd1.myworkdayjobs.com/Careers', type: 'Healthcare' },
    { name: 'Shopify Core Commerce', url: 'https://www.shopify.com/careers/engineering', type: 'E-commerce' },
  ];

  const fetchSources = () => {
    fetch('/api/sources')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSources(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          sourceName: newName,
          sourceType: newType,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNewUrl('');
        setNewName('');
        setShowAddModal(false);
        fetchSources();
      } else {
        alert(json.error || 'Failed to add source');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating source');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerCrawl = async (sourceId: string) => {
    setCrawlingId(sourceId);
    setCrawlNotice(null);
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });
      const json = await res.json();
      if (json.success) {
        setCrawlNotice(
          `Crawl successful! Extracted ${json.data.jobsExtracted} jobs and ${json.data.skillsExtracted} skills (${json.data.newJobsSaved} new records stored).`
        );
        fetchSources();
      } else {
        alert(json.error || 'Crawl failed');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to execute crawl');
    } finally {
      setCrawlingId(null);
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to remove this data source?')) return;
    try {
      const res = await fetch(`/api/sources?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchSources();
      }
    } catch (e) {
      alert('Failed to delete source');
    }
  };

  const handleViewJobs = (source: Source) => {
    setViewingJobsSource(source);
    setLoadingJobs(true);
    setSelectedJob(null);
    fetch(`/api/jobs?sourceId=${source.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setSourceJobs(json.data);
          if (json.data.length > 0) {
            setSelectedJob(json.data[0]);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingJobs(false));
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Job Market Data Collection
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ingest career portals and listings using Firecrawl. Extracted descriptions are deduplicated via SHA-256 and fed directly into the LLM skill normalizer.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Source URL</span>
        </button>
      </div>

      {/* Crawl Notice Banner */}
      {crawlNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{crawlNotice}</span>
          </div>
          <button
            onClick={() => setCrawlNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Preset Quick Ingestion Cards */}
      <div className="bg-white p-5 border border-slate-200/80 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Preset Target Career Portals by Sector
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Publicly Accessible Domains</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {presetSources.map((preset, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between hover:border-indigo-300 transition-colors"
            >
              <div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  {preset.type}
                </span>
                <div className="text-xs font-semibold text-slate-900 mt-1.5 truncate">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  {preset.url}
                </div>
              </div>
              <button
                onClick={async () => {
                  setNewUrl(preset.url);
                  setNewName(preset.name);
                  setNewType(preset.type);
                  setShowAddModal(true);
                }}
                className="mt-3 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium text-left flex items-center gap-1"
              >
                <span>Use Template</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Monitored Sources Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              Configured Career Page Sources ({sources.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Automated deduplication &amp; content-hash checks enabled
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading sources...</div>
        ) : sources.length === 0 ? (
          <div className="p-12 text-center">
            <Globe className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No career sources added yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Add a publicly accessible careers URL or click a preset above to begin crawling.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Source Organization</th>
                  <th className="py-3 px-4">Industry Vertical</th>
                  <th className="py-3 px-4">Career URL</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Processed Openings</th>
                  <th className="py-3 px-4">Last Crawl</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sources.map((src) => {
                  const isCrawling = crawlingId === src.id;

                  return (
                    <tr key={src.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {src.sourceName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {src.sourceType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 max-w-[200px] truncate">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600 flex items-center gap-1"
                        >
                          <span className="truncate">{src.url}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            src.crawlStatus === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : src.crawlStatus === 'in_progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : src.crawlStatus === 'failed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {src.crawlStatus === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          {src.crawlStatus === 'in_progress' && <RotateCw className="w-3 h-3 animate-spin" />}
                          {src.crawlStatus === 'failed' && <AlertTriangle className="w-3 h-3" />}
                          {src.crawlStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {src.jobCount} jobs
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {src.lastCrawlDate
                          ? new Date(src.lastCrawlDate).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewJobs(src)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Inspect Extracted Job Postings"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTriggerCrawl(src.id)}
                            disabled={isCrawling}
                            className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                            title="Execute crawl immediately"
                          >
                            <Play className={`w-3 h-3 ${isCrawling ? 'animate-spin' : ''}`} />
                            <span>{isCrawling ? 'Crawling...' : 'Crawl'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSource(src.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Remove Source"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add New Source */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                Register New Career Portal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Public Career Page URL *
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://company.com/careers"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Organization / Portal Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Acme Tech Careers"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Industry Vertical
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as SourceType)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Technology">Technology</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 leading-relaxed">
                Firecrawl respects robots.txt directives and adheres to standard ethical scraping rate limits. Newly extracted postings will be assigned a cryptographic content-hash to eliminate duplicate job insertions.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Save & Prepare Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Drawer: Inspect Source Job Postings */}
      {viewingJobsSource && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-4xl min-h-screen shadow-2xl flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  {viewingJobsSource.sourceType}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Extracted Job Openings: {viewingJobsSource.sourceName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing descriptions captured by Firecrawl and processed by the AI Skill Extractor
                </p>
              </div>
              <button
                onClick={() => setViewingJobsSource(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
              {/* Job List */}
              <div className="w-1/3 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100">
                {loadingJobs ? (
                  <div className="p-6 text-center text-xs text-slate-400">Loading jobs...</div>
                ) : sourceJobs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No jobs found for this source yet. Try running a crawl!
                  </div>
                ) : (
                  sourceJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-3 cursor-pointer text-xs transition-colors ${
                        selectedJob?.id === job.id
                          ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 truncate">{job.jobTitle}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">{job.location}</div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-indigo-600 font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>{job.extractedSkillsCount || 0} skills normalized</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Job Detail */}
              <div className="w-2/3 p-6 overflow-y-auto space-y-4">
                {selectedJob ? (
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {selectedJob.jobTitle}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {selectedJob.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {selectedJob.location}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Hash: {selectedJob.contentHash.slice(0, 8)}...
                      </span>
                    </div>

                    {/* Extracted Skills Badges */}
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Normalized Skills Extracted by LLM:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.extractedSkills && selectedJob.extractedSkills.length > 0 ? (
                          selectedJob.extractedSkills.map((sk: any, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded bg-white text-indigo-700 border border-indigo-200 text-xs font-medium shadow-2xs"
                            >
                              {sk.name}{' '}
                              <span className="text-[10px] text-slate-400">({sk.category})</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No skills mapped yet</span>
                        )}
                      </div>
                    </div>

                    {/* Raw Job Description */}
                    <div className="mt-4">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Job Posting Description Snippet
                      </h5>
                      <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line max-h-96 overflow-y-auto">
                        {selectedJob.description}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 py-12">
                    Select a job from the left panel to inspect description and extracted skills.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
