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
  Eye,
  X,
  Flame,
  ChevronRight,
  Building2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Source, SourceType } from '@/types';

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
    { name: 'Stripe Careers', url: 'https://careers.stripe.com/jobs', type: 'Financial Services' },
    { name: 'Anthropic AI', url: 'https://boards.greenhouse.io/anthropic', type: 'Technology' },
    { name: 'McKinsey Digital', url: 'https://careers.mckinsey.com/technology', type: 'Consulting' },
    { name: 'Optum Healthcare', url: 'https://optum.wd1.myworkdayjobs.com/Careers', type: 'Healthcare' },
    { name: 'Shopify Engineering', url: 'https://www.shopify.com/careers/engineering', type: 'E-commerce' },
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
          `Crawl completed successfully. Captured ${json.data.jobsExtracted} postings, extracted ${json.data.skillsExtracted} skills (${json.data.newJobsSaved} new records stored).`
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
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Job Market Data Collection
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Ingest career portals and listings using Firecrawl. Extracted descriptions are deduplicated via SHA-256 and fed into the AI skill normalizer.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Career URL</span>
        </button>
      </div>

      {/* Crawl Notice Alert */}
      {crawlNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{crawlNotice}</span>
          </div>
          <button
            onClick={() => setCrawlNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Preset Ingestion Templates */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Quick Ingestion Presets by Sector
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Public Career Domains</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {presetSources.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNewUrl(preset.url);
                setNewName(preset.name);
                setNewType(preset.type);
                setShowAddModal(true);
              }}
              className="p-2.5 text-left border border-slate-200 hover:border-blue-400 rounded-md bg-white hover:bg-slate-50 transition-colors group"
            >
              <div className="text-[10px] text-slate-400 font-medium">{preset.type}</div>
              <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate mt-0.5">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sources Data Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Configured Portals ({sources.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Deduplication: SHA-256 (Company + Title + Snippet)
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading career sources...</div>
        ) : sources.length === 0 ? (
          <div className="p-12 text-center border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-500">No career sources registered yet.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3.5">Organization</th>
                    <th className="py-2.5 px-3.5">Vertical</th>
                    <th className="py-2.5 px-3.5">Career URL</th>
                    <th className="py-2.5 px-3.5">Status</th>
                    <th className="py-2.5 px-3.5">Captured Postings</th>
                    <th className="py-2.5 px-3.5">Last Ingest</th>
                    <th className="py-2.5 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sources.map((src) => {
                    const isCrawling = crawlingId === src.id;

                    return (
                      <tr key={src.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3.5 font-semibold text-slate-900">
                          {src.sourceName}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          {src.sourceType}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-[11px] text-slate-500 max-w-[220px] truncate">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 inline-flex items-center gap-1"
                          >
                            <span className="truncate">{src.url}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-400" />
                          </a>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                src.crawlStatus === 'completed'
                                  ? 'bg-emerald-500'
                                  : src.crawlStatus === 'in_progress'
                                  ? 'bg-blue-500 animate-pulse'
                                  : src.crawlStatus === 'failed'
                                  ? 'bg-rose-500'
                                  : 'bg-slate-300'
                              }`}
                            />
                            <span className="capitalize">{src.crawlStatus.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-slate-800 tabular-nums">
                          {src.jobCount} roles
                        </td>
                        <td className="py-3 px-3.5 text-slate-400 text-[11px] tabular-nums">
                          {src.lastCrawlDate
                            ? new Date(src.lastCrawlDate).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleViewJobs(src)}
                              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                              title="Inspect Extracted Openings"
                              aria-label="Inspect Extracted Openings"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTriggerCrawl(src.id)}
                              disabled={isCrawling}
                              className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                              title="Trigger crawl now"
                            >
                              <Play className={`w-3 h-3 ${isCrawling ? 'animate-spin' : ''}`} />
                              <span>{isCrawling ? 'Crawling...' : 'Crawl'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSource(src.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                              title="Remove Source"
                              aria-label="Remove Source"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Career URL */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">
                Register New Career Source
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Public Career URL *
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://company.com/careers"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Acme Tech"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Industry Vertical
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as SourceType)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Technology">Technology</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Firecrawl parses public listings in compliance with robots.txt. Postings are cryptographically hashed via SHA-256 to ensure zero duplicate database insertions.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-2xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Save Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer: Inspect Extracted Job Descriptions */}
      {viewingJobsSource && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex justify-end"
          onClick={() => setViewingJobsSource(null)}
        >
          <div
            className="bg-white w-full max-w-4xl min-h-screen shadow-2xl flex flex-col border-l border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {viewingJobsSource.sourceType} &bull; Collected Postings
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {viewingJobsSource.sourceName}
                </h3>
              </div>
              <button
                onClick={() => setViewingJobsSource(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
              {/* Job List */}
              <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 max-h-52 md:max-h-none overflow-y-auto divide-y divide-slate-100 text-xs flex-shrink-0">
                {loadingJobs ? (
                  <div className="p-6 text-center text-slate-400">Loading postings...</div>
                ) : sourceJobs.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    No postings found. Trigger a crawl to collect roles.
                  </div>
                ) : (
                  sourceJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedJob?.id === job.id
                          ? 'bg-blue-50/70 border-l-2 border-blue-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 truncate">{job.jobTitle}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">{job.location}</div>
                      <span className="text-[10px] text-blue-600 font-medium mt-1 block">
                        {job.extractedSkillsCount || 0} skills normalized
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Job Detail */}
              <div className="w-full md:w-2/3 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                {selectedJob ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{selectedJob.jobTitle}</h4>
                      <div className="flex items-center gap-3 text-slate-500 mt-1">
                        <span>{selectedJob.company}</span>
                        <span>&bull;</span>
                        <span>{selectedJob.location}</span>
                        <span>&bull;</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Hash: {selectedJob.contentHash.slice(0, 8)}
                        </span>
                      </div>
                    </div>

                    {/* Extracted Skills */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Normalized Skills Identified
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.extractedSkills && selectedJob.extractedSkills.length > 0 ? (
                          selectedJob.extractedSkills.map((sk: any, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium"
                            >
                              {sk.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">No skills mapped</span>
                        )}
                      </div>
                    </div>

                    {/* Description Text */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Extracted Job Description Text
                      </span>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 leading-relaxed font-sans whitespace-pre-line max-h-96 overflow-y-auto">
                        {selectedJob.description}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    Select a job posting from the left to view description and extracted skills.
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
