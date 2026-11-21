import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';
import type {
  Source,
  Job,
  Skill,
  JobSkill,
  SkillSnapshot,
  AiInsight,
} from '@/types';
import {
  INITIAL_SOURCES,
  INITIAL_JOBS,
  INITIAL_SKILLS,
  INITIAL_SNAPSHOTS,
  INITIAL_AI_INSIGHTS,
} from './initial-data';

// Database store interface
interface DBStore {
  sources: Source[];
  jobs: Job[];
  skills: Skill[];
  jobSkills: JobSkill[];
  snapshots: SkillSnapshot[];
  aiInsights: AiInsight[];
}

const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'data');
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, 'talentpulse_store.json');

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let isMongoAttempted = false;
let isMongoAvailable = false;

// Ensure local directory exists
function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    try {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    } catch (e) {
      // ignore
    }
  }
}

// Read local store
function readLocalStore(): DBStore {
  ensureLocalDir();
  if (fs.existsSync(LOCAL_STORAGE_FILE)) {
    try {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.warn('Failed to parse local store file, reinitializing', err);
    }
  }

  // Generate initial JobSkills from initial jobs and skills
  const initialJobSkills: JobSkill[] = [];
  INITIAL_JOBS.forEach((job) => {
    // Map skills mentioned in the job description
    INITIAL_SKILLS.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.name}\\b`, 'i');
      if (regex.test(job.description) || regex.test(job.jobTitle)) {
        initialJobSkills.push({
          id: `js-${job.id}-${skill.id}`,
          jobId: job.id,
          skillId: skill.id,
          skillName: skill.name,
          normalizedName: skill.normalizedName,
          category: skill.category,
          extractionConfidence: 0.95,
          extractionDate: job.crawledDate,
          jobTitle: job.jobTitle,
          company: job.company,
          industry: job.industry,
        });
      }
    });
  });

  const defaultStore: DBStore = {
    sources: INITIAL_SOURCES,
    jobs: INITIAL_JOBS,
    skills: INITIAL_SKILLS,
    jobSkills: initialJobSkills,
    snapshots: INITIAL_SNAPSHOTS,
    aiInsights: INITIAL_AI_INSIGHTS,
  };

  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(defaultStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write initial local store:', err);
  }

  return defaultStore;
}

// Write local store
function writeLocalStore(store: DBStore) {
  ensureLocalDir();
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to local storage file:', err);
  }
}

// Initialize MongoDB connection if configured
export async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    return null;
  }

  if (mongoDb && isMongoAvailable) {
    return mongoDb;
  }

  if (isMongoAttempted && !isMongoAvailable) {
    return null;
  }

  isMongoAttempted = true;

  try {
    mongoClient = new MongoClient(uri, {
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
      tlsAllowInvalidCertificates: true,
    });
    await mongoClient.connect();
    mongoDb = mongoClient.db();
    isMongoAvailable = true;
    console.log('Connected successfully to MongoDB Atlas');

    // Create indexes asynchronously
    mongoDb.collection('jobs').createIndex({ contentHash: 1 }, { unique: true }).catch(() => {});
    mongoDb.collection('skills').createIndex({ normalizedName: 1 }, { unique: true }).catch(() => {});
    mongoDb.collection('job_skills').createIndex({ jobId: 1, skillId: 1 }).catch(() => {});
    mongoDb.collection('skill_snapshots').createIndex({ skillId: 1, timePeriod: 1 }).catch(() => {});

    return mongoDb;
  } catch (err: any) {
    console.warn('MongoDB connection failed, operating with resilient persistent storage:', err.message || err);
    isMongoAvailable = false;
    return null;
  }
}

export async function getSystemStatus() {
  const db = await getMongoDb();
  const hasFirecrawl = Boolean(process.env.FIRECRAWL_API_KEY && process.env.FIRECRAWL_API_KEY.trim() !== '');
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '');

  let llmProvider: 'gemini' | 'openai' | 'heuristic_engine' = 'heuristic_engine';
  if (hasGemini) llmProvider = 'gemini';
  else if (hasOpenAI) llmProvider = 'openai';

  return {
    mongodbConnected: Boolean(db),
    firecrawlConfigured: hasFirecrawl,
    llmConfigured: hasGemini || hasOpenAI,
    llmProvider,
  };
}

// ----------------- Data Access Operations -----------------

export async function getSources(): Promise<Source[]> {
  const db = await getMongoDb();
  if (db) {
    const records = await db.collection<Source>('sources').find().sort({ createdDate: -1 }).toArray();
    if (records.length > 0) return records;
  }
  const store = readLocalStore();
  return store.sources;
}

export async function getSource(id: string): Promise<Source | null> {
  const db = await getMongoDb();
  if (db) {
    const res = await db.collection<Source>('sources').findOne({ id });
    if (res) return res;
  }
  const store = readLocalStore();
  return store.sources.find((s) => s.id === id) || null;
}

export async function saveSource(source: Source): Promise<Source> {
  const db = await getMongoDb();
  if (db) {
    await db.collection<Source>('sources').updateOne(
      { id: source.id },
      { $set: source },
      { upsert: true }
    );
  }
  const store = readLocalStore();
  const idx = store.sources.findIndex((s) => s.id === source.id);
  if (idx >= 0) {
    store.sources[idx] = source;
  } else {
    store.sources.unshift(source);
  }
  writeLocalStore(store);
  return source;
}

export async function updateSource(id: string, updates: Partial<Source>): Promise<Source | null> {
  const db = await getMongoDb();
  if (db) {
    await db.collection<Source>('sources').updateOne({ id }, { $set: updates });
  }
  const store = readLocalStore();
  const idx = store.sources.findIndex((s) => s.id === id);
  if (idx >= 0) {
    store.sources[idx] = { ...store.sources[idx], ...updates };
    writeLocalStore(store);
    return store.sources[idx];
  }
  return null;
}

export async function deleteSource(id: string): Promise<boolean> {
  const db = await getMongoDb();
  if (db) {
    await db.collection('sources').deleteOne({ id });
  }
  const store = readLocalStore();
  const initialLength = store.sources.length;
  store.sources = store.sources.filter((s) => s.id !== id);
  writeLocalStore(store);
  return store.sources.length < initialLength;
}

export async function getJobs(filter?: { industry?: string; sourceId?: string; search?: string }): Promise<Job[]> {
  const db = await getMongoDb();
  let jobs: Job[] = [];
  if (db) {
    const query: any = {};
    if (filter?.industry && filter.industry !== 'All') query.industry = filter.industry;
    if (filter?.sourceId) query.sourceId = filter.sourceId;
    if (filter?.search) {
      query.$or = [
        { jobTitle: { $regex: filter.search, $options: 'i' } },
        { company: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ];
    }
    jobs = await db.collection<Job>('jobs').find(query).sort({ postedDate: -1 }).toArray();
  } else {
    const store = readLocalStore();
    jobs = store.jobs;
    if (filter?.industry && filter.industry !== 'All') {
      jobs = jobs.filter((j) => j.industry.toLowerCase() === filter.industry?.toLowerCase());
    }
    if (filter?.sourceId) {
      jobs = jobs.filter((j) => j.sourceId === filter.sourceId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.jobTitle.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
  }
  return jobs;
}

export async function getJob(id: string): Promise<Job | null> {
  const db = await getMongoDb();
  if (db) {
    const found = await db.collection<Job>('jobs').findOne({ id });
    if (found) return found;
  }
  const store = readLocalStore();
  return store.jobs.find((j) => j.id === id) || null;
}

export async function saveJob(job: Job): Promise<{ saved: boolean; isDuplicate: boolean }> {
  const db = await getMongoDb();
  if (db) {
    const existing = await db.collection<Job>('jobs').findOne({ contentHash: job.contentHash });
    if (existing) {
      return { saved: false, isDuplicate: true };
    }
    await db.collection<Job>('jobs').insertOne(job);
  }
  const store = readLocalStore();
  const exists = store.jobs.some((j) => j.contentHash === job.contentHash);
  if (exists) {
    return { saved: false, isDuplicate: true };
  }
  store.jobs.unshift(job);
  writeLocalStore(store);
  return { saved: true, isDuplicate: false };
}

export async function saveJobs(newJobs: Job[]): Promise<{ insertedCount: number; duplicateCount: number }> {
  let insertedCount = 0;
  let duplicateCount = 0;

  for (const job of newJobs) {
    const res = await saveJob(job);
    if (res.saved) insertedCount++;
    if (res.isDuplicate) duplicateCount++;
  }

  return { insertedCount, duplicateCount };
}

export async function getSkills(): Promise<Skill[]> {
  const db = await getMongoDb();
  if (db) {
    const skills = await db.collection<Skill>('skills').find().toArray();
    if (skills.length > 0) return skills;
  }
  const store = readLocalStore();
  return store.skills;
}

export async function saveSkill(skill: Skill): Promise<Skill> {
  const db = await getMongoDb();
  if (db) {
    await db.collection<Skill>('skills').updateOne(
      { normalizedName: skill.normalizedName },
      { $set: skill },
      { upsert: true }
    );
  }
  const store = readLocalStore();
  const idx = store.skills.findIndex((s) => s.normalizedName === skill.normalizedName);
  if (idx >= 0) {
    store.skills[idx] = skill;
  } else {
    store.skills.push(skill);
  }
  writeLocalStore(store);
  return skill;
}

export async function getJobSkills(filter?: { jobId?: string; skillId?: string }): Promise<JobSkill[]> {
  const db = await getMongoDb();
  if (db) {
    const query: any = {};
    if (filter?.jobId) query.jobId = filter.jobId;
    if (filter?.skillId) query.skillId = filter.skillId;
    const records = await db.collection<JobSkill>('job_skills').find(query).toArray();
    if (records.length > 0) return records;
  }
  const store = readLocalStore();
  let js = store.jobSkills;
  if (filter?.jobId) js = js.filter((item) => item.jobId === filter.jobId);
  if (filter?.skillId) js = js.filter((item) => item.skillId === filter.skillId);
  return js;
}

export async function saveJobSkills(jobSkills: JobSkill[]): Promise<void> {
  if (jobSkills.length === 0) return;
  const db = await getMongoDb();
  if (db) {
    for (const js of jobSkills) {
      await db.collection<JobSkill>('job_skills').updateOne(
        { jobId: js.jobId, skillId: js.skillId },
        { $set: js },
        { upsert: true }
      );
    }
  }
  const store = readLocalStore();
  jobSkills.forEach((newItem) => {
    const idx = store.jobSkills.findIndex((existing) => existing.jobId === newItem.jobId && existing.skillId === newItem.skillId);
    if (idx >= 0) {
      store.jobSkills[idx] = newItem;
    } else {
      store.jobSkills.push(newItem);
    }
  });
  writeLocalStore(store);
}

export async function getSnapshots(skillId?: string): Promise<SkillSnapshot[]> {
  const db = await getMongoDb();
  if (db) {
    const query: any = skillId ? { skillId } : {};
    const records = await db.collection<SkillSnapshot>('skill_snapshots').find(query).sort({ timePeriod: 1 }).toArray();
    if (records.length > 0) return records;
  }
  const store = readLocalStore();
  if (skillId) {
    return store.snapshots.filter((s) => s.skillId === skillId);
  }
  return store.snapshots;
}

export async function saveSnapshots(snapshots: SkillSnapshot[]): Promise<void> {
  if (snapshots.length === 0) return;
  const db = await getMongoDb();
  if (db) {
    for (const snap of snapshots) {
      await db.collection<SkillSnapshot>('skill_snapshots').updateOne(
        { skillId: snap.skillId, timePeriod: snap.timePeriod },
        { $set: snap },
        { upsert: true }
      );
    }
  }
  const store = readLocalStore();
  snapshots.forEach((newSnap) => {
    const idx = store.snapshots.findIndex((s) => s.skillId === newSnap.skillId && s.timePeriod === newSnap.timePeriod);
    if (idx >= 0) {
      store.snapshots[idx] = newSnap;
    } else {
      store.snapshots.push(newSnap);
    }
  });
  writeLocalStore(store);
}

export async function getAiInsights(): Promise<AiInsight[]> {
  const db = await getMongoDb();
  if (db) {
    const records = await db.collection<AiInsight>('ai_insights').find().sort({ generatedDate: -1 }).toArray();
    if (records.length > 0) return records;
  }
  const store = readLocalStore();
  return store.aiInsights;
}

export async function saveAiInsight(insight: AiInsight): Promise<void> {
  const db = await getMongoDb();
  if (db) {
    await db.collection<AiInsight>('ai_insights').updateOne(
      { id: insight.id },
      { $set: insight },
      { upsert: true }
    );
  }
  const store = readLocalStore();
  const idx = store.aiInsights.findIndex((i) => i.id === insight.id);
  if (idx >= 0) {
    store.aiInsights[idx] = insight;
  } else {
    store.aiInsights.unshift(insight);
  }
  writeLocalStore(store);
}

export async function resetDatabaseToDemo(): Promise<void> {
  const store: DBStore = {
    sources: INITIAL_SOURCES,
    jobs: INITIAL_JOBS,
    skills: INITIAL_SKILLS,
    jobSkills: [],
    snapshots: INITIAL_SNAPSHOTS,
    aiInsights: INITIAL_AI_INSIGHTS,
  };

  INITIAL_JOBS.forEach((job) => {
    INITIAL_SKILLS.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.name}\\b`, 'i');
      if (regex.test(job.description) || regex.test(job.jobTitle)) {
        store.jobSkills.push({
          id: `js-${job.id}-${skill.id}`,
          jobId: job.id,
          skillId: skill.id,
          skillName: skill.name,
          normalizedName: skill.normalizedName,
          category: skill.category,
          extractionConfidence: 0.95,
          extractionDate: job.crawledDate,
          jobTitle: job.jobTitle,
          company: job.company,
          industry: job.industry,
        });
      }
    });
  });

  writeLocalStore(store);

  const db = await getMongoDb();
  if (db) {
    await db.collection('sources').deleteMany({});
    await db.collection('jobs').deleteMany({});
    await db.collection('skills').deleteMany({});
    await db.collection('job_skills').deleteMany({});
    await db.collection('skill_snapshots').deleteMany({});
    await db.collection('ai_insights').deleteMany({});

    await db.collection('sources').insertMany(store.sources as any);
    await db.collection('jobs').insertMany(store.jobs as any);
    await db.collection('skills').insertMany(store.skills as any);
    await db.collection('job_skills').insertMany(store.jobSkills as any);
    await db.collection('skill_snapshots').insertMany(store.snapshots as any);
    await db.collection('ai_insights').insertMany(store.aiInsights as any);
  }
}
