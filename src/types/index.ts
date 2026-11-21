export type SkillCategory =
  | 'Technical Skills'
  | 'Programming Languages'
  | 'Frameworks & Libraries'
  | 'Cloud Technologies'
  | 'Databases'
  | 'AI & Machine Learning'
  | 'Soft Skills'
  | 'Management & Leadership'
  | 'Domain-Specific';

export type DemandClassification = 'Rising' | 'Stable' | 'Declining' | 'Insufficient historical data';

export type CrawlStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export type SourceType =
  | 'Technology'
  | 'Financial Services'
  | 'Consulting'
  | 'Healthcare'
  | 'E-commerce'
  | 'Other';

export interface Source {
  _id?: any;
  id: string;
  url: string;
  sourceName: string;
  sourceType: SourceType;
  createdDate: string;
  lastCrawlDate?: string;
  crawlStatus: CrawlStatus;
  jobCount: number;
  errorMessage?: string;
}

export interface Job {
  _id?: any;
  id: string;
  jobTitle: string;
  company: string;
  description: string;
  location: string;
  industry: SourceType | string;
  sourceUrl: string;
  sourceId?: string;
  postedDate: string;
  crawledDate: string;
  contentHash: string;
  extractedSkillsCount?: number;
}

export interface Skill {
  _id?: any;
  id: string;
  name: string;
  normalizedName: string;
  category: SkillCategory;
  createdDate?: string;
}

export interface JobSkill {
  _id?: any;
  id: string;
  jobId: string;
  skillId: string;
  skillName: string;
  normalizedName: string;
  category: SkillCategory;
  extractionConfidence: number; // 0.0 to 1.0
  extractionDate: string;
  jobTitle: string;
  company: string;
  industry: string;
}

export interface SkillSnapshot {
  _id?: any;
  id: string;
  skillId: string;
  skillName: string;
  normalizedName: string;
  category: SkillCategory;
  timePeriod: string; // e.g. "2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4"
  mentionCount: number;
  uniqueJobCount: number;
  industryBreakdown: Record<string, number>;
  demandPercentage: number; // 0 to 100% of jobs in that period
  calculatedDate: string;
}

export interface SkillDemandAnalysis {
  skillId: string;
  skillName: string;
  normalizedName: string;
  category: SkillCategory;
  currentMentions: number;
  previousMentions: number;
  currentDemandPct: number;
  previousDemandPct: number;
  pctChange: number; // relative change percentage
  classification: DemandClassification;
  aiInsight: string;
  historicalTrend: {
    period: string;
    mentions: number;
    demandPct: number;
  }[];
  topIndustries: {
    industry: string;
    count: number;
    percentage: number;
  }[];
  topRoles: {
    role: string;
    count: number;
  }[];
  hasSufficientData: boolean;
}

export type AiInsightType =
  | 'emerging'
  | 'declining'
  | 'industry_shift'
  | 'recruitment'
  | 'upskilling'
  | 'skill_combinations';

export interface AiInsight {
  _id?: any;
  id: string;
  insightType: AiInsightType;
  title: string;
  description: string;
  supportingStatistics: {
    label: string;
    value: string | number;
  }[];
  actionableRecommendations: string[];
  skillsInvolved: string[];
  generatedDate: string;
  isAiGenerated: boolean;
}

export interface DashboardMetrics {
  totalJobsAnalyzed: number;
  uniqueSkillsIdentified: number;
  risingSkillsCount: number;
  stableSkillsCount: number;
  decliningSkillsCount: number;
  skillDemandTrends: {
    period: string;
    [skillName: string]: number | string;
  }[];
  topDemandedSkills: {
    id: string;
    name: string;
    category: SkillCategory;
    count: number;
    demandPercentage: number;
    classification: DemandClassification;
    pctChange: number;
  }[];
  classificationDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  demandByCategory: {
    category: SkillCategory;
    count: number;
    percentage: number;
  }[];
  demandByIndustry: {
    industry: string;
    count: number;
    topSkills: string[];
  }[];
  recentActivity: {
    id: string;
    type: 'crawl' | 'extraction' | 'analysis' | 'insight';
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'info' | 'error';
    meta?: Record<string, any>;
  }[];
  isDemoMode: boolean;
  systemStatus: {
    mongodbConnected: boolean;
    firecrawlConfigured: boolean;
    llmConfigured: boolean;
    llmProvider: 'gemini' | 'openai' | 'heuristic_engine';
  };
}
