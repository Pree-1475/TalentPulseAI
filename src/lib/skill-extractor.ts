import type { Job, Skill, JobSkill, SkillCategory } from '@/types';

// Canonical Normalization Map
export const CANONICAL_SKILL_MAP: Record<string, { canonical: string; category: SkillCategory }> = {
  // Programming Languages
  js: { canonical: 'JavaScript', category: 'Programming Languages' },
  javascript: { canonical: 'JavaScript', category: 'Programming Languages' },
  ts: { canonical: 'TypeScript', category: 'Programming Languages' },
  typescript: { canonical: 'TypeScript', category: 'Programming Languages' },
  py: { canonical: 'Python', category: 'Programming Languages' },
  python: { canonical: 'Python', category: 'Programming Languages' },
  golang: { canonical: 'Go', category: 'Programming Languages' },
  go: { canonical: 'Go', category: 'Programming Languages' },
  rust: { canonical: 'Rust', category: 'Programming Languages' },
  java: { canonical: 'Java', category: 'Programming Languages' },
  csharp: { canonical: 'C#', category: 'Programming Languages' },
  'c#': { canonical: 'C#', category: 'Programming Languages' },
  'c++': { canonical: 'C++', category: 'Programming Languages' },
  cpp: { canonical: 'C++', category: 'Programming Languages' },
  php: { canonical: 'Legacy PHP', category: 'Programming Languages' },
  'legacy php': { canonical: 'Legacy PHP', category: 'Programming Languages' },
  ruby: { canonical: 'Ruby', category: 'Programming Languages' },
  swift: { canonical: 'Swift', category: 'Programming Languages' },
  kotlin: { canonical: 'Kotlin', category: 'Programming Languages' },

  // Frameworks & Libraries
  react: { canonical: 'React', category: 'Frameworks & Libraries' },
  'react.js': { canonical: 'React', category: 'Frameworks & Libraries' },
  reactjs: { canonical: 'React', category: 'Frameworks & Libraries' },
  nextjs: { canonical: 'Next.js', category: 'Frameworks & Libraries' },
  'next.js': { canonical: 'Next.js', category: 'Frameworks & Libraries' },
  next: { canonical: 'Next.js', category: 'Frameworks & Libraries' },
  vue: { canonical: 'Vue.js', category: 'Frameworks & Libraries' },
  'vue.js': { canonical: 'Vue.js', category: 'Frameworks & Libraries' },
  angular: { canonical: 'Angular', category: 'Frameworks & Libraries' },
  'angularjs (1.x)': { canonical: 'AngularJS (1.x)', category: 'Frameworks & Libraries' },
  angularjs: { canonical: 'AngularJS (1.x)', category: 'Frameworks & Libraries' },
  node: { canonical: 'Node.js', category: 'Frameworks & Libraries' },
  'node.js': { canonical: 'Node.js', category: 'Frameworks & Libraries' },
  nodejs: { canonical: 'Node.js', category: 'Frameworks & Libraries' },
  fastapi: { canonical: 'FastAPI', category: 'Frameworks & Libraries' },
  django: { canonical: 'Django', category: 'Frameworks & Libraries' },
  express: { canonical: 'Express.js', category: 'Frameworks & Libraries' },
  'express.js': { canonical: 'Express.js', category: 'Frameworks & Libraries' },
  tailwind: { canonical: 'Tailwind CSS', category: 'Frameworks & Libraries' },
  'tailwind css': { canonical: 'Tailwind CSS', category: 'Frameworks & Libraries' },
  tailwindcss: { canonical: 'Tailwind CSS', category: 'Frameworks & Libraries' },

  // Cloud Technologies
  aws: { canonical: 'AWS', category: 'Cloud Technologies' },
  'amazon web services': { canonical: 'AWS', category: 'Cloud Technologies' },
  gcp: { canonical: 'Google Cloud', category: 'Cloud Technologies' },
  'google cloud': { canonical: 'Google Cloud', category: 'Cloud Technologies' },
  'google cloud platform': { canonical: 'Google Cloud', category: 'Cloud Technologies' },
  azure: { canonical: 'Azure', category: 'Cloud Technologies' },
  'microsoft azure': { canonical: 'Azure', category: 'Cloud Technologies' },
  k8s: { canonical: 'Kubernetes', category: 'Cloud Technologies' },
  kubernetes: { canonical: 'Kubernetes', category: 'Cloud Technologies' },
  docker: { canonical: 'Docker', category: 'Cloud Technologies' },
  terraform: { canonical: 'Terraform', category: 'Cloud Technologies' },
  'on-premise virtualization': { canonical: 'On-premise Virtualization', category: 'Cloud Technologies' },
  vmware: { canonical: 'On-premise Virtualization', category: 'Cloud Technologies' },

  // Databases
  postgres: { canonical: 'PostgreSQL', category: 'Databases' },
  postgresql: { canonical: 'PostgreSQL', category: 'Databases' },
  mongo: { canonical: 'MongoDB', category: 'Databases' },
  mongodb: { canonical: 'MongoDB', category: 'Databases' },
  redis: { canonical: 'Redis', category: 'Databases' },
  mysql: { canonical: 'MySQL', category: 'Databases' },
  snowflake: { canonical: 'Snowflake', category: 'Databases' },
  dynamodb: { canonical: 'DynamoDB', category: 'Databases' },

  // AI & Machine Learning
  ml: { canonical: 'Machine Learning', category: 'AI & Machine Learning' },
  'machine learning': { canonical: 'Machine Learning', category: 'AI & Machine Learning' },
  'generative ai': { canonical: 'Generative AI', category: 'AI & Machine Learning' },
  genai: { canonical: 'Generative AI', category: 'AI & Machine Learning' },
  'gen ai': { canonical: 'Generative AI', category: 'AI & Machine Learning' },
  llm: { canonical: 'Generative AI', category: 'AI & Machine Learning' },
  llms: { canonical: 'Generative AI', category: 'AI & Machine Learning' },
  pytorch: { canonical: 'PyTorch', category: 'AI & Machine Learning' },
  tensorflow: { canonical: 'TensorFlow', category: 'AI & Machine Learning' },
  rag: { canonical: 'RAG Systems', category: 'AI & Machine Learning' },
  'rag systems': { canonical: 'RAG Systems', category: 'AI & Machine Learning' },
  'vector databases': { canonical: 'RAG Systems', category: 'AI & Machine Learning' },

  // Technical Skills
  'system design': { canonical: 'System Design', category: 'Technical Skills' },
  'distributed systems': { canonical: 'System Design', category: 'Technical Skills' },
  'rest apis': { canonical: 'REST APIs', category: 'Technical Skills' },
  rest: { canonical: 'REST APIs', category: 'Technical Skills' },
  restful: { canonical: 'REST APIs', category: 'Technical Skills' },
  graphql: { canonical: 'GraphQL', category: 'Technical Skills' },
  'ci/cd': { canonical: 'CI/CD Pipelines', category: 'Technical Skills' },
  'ci/cd pipelines': { canonical: 'CI/CD Pipelines', category: 'Technical Skills' },
  cicd: { canonical: 'CI/CD Pipelines', category: 'Technical Skills' },
  kafka: { canonical: 'Kafka', category: 'Technical Skills' },

  // Soft Skills
  'cross-functional collaboration': { canonical: 'Cross-functional Collaboration', category: 'Soft Skills' },
  collaboration: { canonical: 'Cross-functional Collaboration', category: 'Soft Skills' },
  'problem solving': { canonical: 'Problem Solving', category: 'Soft Skills' },
  communication: { canonical: 'Communication', category: 'Soft Skills' },

  // Management & Leadership
  'agile & scrum': { canonical: 'Agile & Scrum', category: 'Management & Leadership' },
  agile: { canonical: 'Agile & Scrum', category: 'Management & Leadership' },
  scrum: { canonical: 'Agile & Scrum', category: 'Management & Leadership' },
  'technical leadership': { canonical: 'Technical Leadership', category: 'Management & Leadership' },
  mentorship: { canonical: 'Technical Leadership', category: 'Management & Leadership' },

  // Domain-Specific
  'payment systems': { canonical: 'Payment Systems', category: 'Domain-Specific' },
  payments: { canonical: 'Payment Systems', category: 'Domain-Specific' },
  'hipaa compliance': { canonical: 'HIPAA Compliance', category: 'Domain-Specific' },
  hipaa: { canonical: 'HIPAA Compliance', category: 'Domain-Specific' },
  fintech: { canonical: 'Payment Systems', category: 'Domain-Specific' },
};

export interface ExtractedSkillRaw {
  skillName: string;
  category: SkillCategory;
  confidence: number;
}

// Normalizer
export function normalizeSkill(rawName: string, fallbackCategory?: SkillCategory): { name: string; normalizedName: string; category: SkillCategory } {
  const clean = rawName.trim().toLowerCase();
  const cleanNoParens = clean.replace(/[\(\)]/g, '').replace(/\s+/g, ' ').trim();
  
  if (CANONICAL_SKILL_MAP[clean]) {
    const entry = CANONICAL_SKILL_MAP[clean];
    return {
      name: entry.canonical,
      normalizedName: entry.canonical,
      category: entry.category,
    };
  }

  if (CANONICAL_SKILL_MAP[cleanNoParens]) {
    const entry = CANONICAL_SKILL_MAP[cleanNoParens];
    return {
      name: entry.canonical,
      normalizedName: entry.canonical,
      category: entry.category,
    };
  }

  // Proper Title-Casing if unknown
  const titleCased = rawName
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name: titleCased,
    normalizedName: titleCased,
    category: fallbackCategory || 'Technical Skills',
  };
}

// LLM Prompt for extraction
const EXTRACTION_PROMPT = `
You are an expert HR Technology AI that analyzes job descriptions and extracts required professional and technical skills.
Analyze the following job posting and extract all relevant skills into structured JSON.

Extract skills across these 9 exact categories:
1. "Technical Skills"
2. "Programming Languages"
3. "Frameworks & Libraries"
4. "Cloud Technologies"
5. "Databases"
6. "AI & Machine Learning"
7. "Soft Skills"
8. "Management & Leadership"
9. "Domain-Specific"

Return a strictly valid JSON array of objects with the exact schema:
[
  {
    "skillName": "string",
    "category": "one of the 9 categories above",
    "confidence": 0.95
  }
]

Do not return Markdown code blocks. Return ONLY the JSON array.
`;

// Extract using Gemini API
async function extractWithGemini(jobText: string, apiKey: string): Promise<ExtractedSkillRaw[]> {
  const candidateModels = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: EXTRACTION_PROMPT },
                { text: `JOB POSTING:\n${jobText}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          }
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // try next candidate model
    }
  }

  throw new Error('All Gemini candidate models returned non-OK status');
}

// Extract using OpenAI API
async function extractWithOpenAI(jobText: string, apiKey: string): Promise<ExtractedSkillRaw[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: `JOB POSTING:\n${jobText}` }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  const parsed = JSON.parse(content);
  if (Array.isArray(parsed)) return parsed;
  if (parsed.skills && Array.isArray(parsed.skills)) return parsed.skills;
  return [];
}

// High-precision Fallback Heuristic Dictionary Parser
function extractWithHeuristics(jobText: string): ExtractedSkillRaw[] {
  const extracted: ExtractedSkillRaw[] = [];
  const text = ` ${jobText.toLowerCase()} `;

  const keys = Object.keys(CANONICAL_SKILL_MAP);
  const foundMap = new Set<string>();

  for (const key of keys) {
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#\\+])${escapeRegex(key)}(?:$|[^a-zA-Z0-9_#\\+])`, 'i');
    if (regex.test(text)) {
      const canonical = CANONICAL_SKILL_MAP[key];
      if (!foundMap.has(canonical.canonical)) {
        foundMap.add(canonical.canonical);
        extracted.push({
          skillName: canonical.canonical,
          category: canonical.category,
          confidence: 0.95,
        });
      }
    }
  }

  return extracted;
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Main skill extraction entry point
export async function extractSkillsFromJob(job: Job): Promise<{
  skills: Skill[];
  jobSkills: JobSkill[];
  method: 'gemini' | 'openai' | 'heuristic';
}> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let rawSkills: ExtractedSkillRaw[] = [];
  let method: 'gemini' | 'openai' | 'heuristic' = 'heuristic';

  const fullJobText = `Title: ${job.jobTitle}\nCompany: ${job.company}\nIndustry: ${job.industry}\nDescription:\n${job.description}`;

  if (geminiKey && geminiKey.trim() !== '') {
    try {
      rawSkills = await extractWithGemini(fullJobText, geminiKey.trim());
      method = 'gemini';
    } catch (err) {
      console.warn('Gemini extraction failed, falling back to heuristics:', err);
      rawSkills = extractWithHeuristics(fullJobText);
      method = 'heuristic';
    }
  } else if (openaiKey && openaiKey.trim() !== '') {
    try {
      rawSkills = await extractWithOpenAI(fullJobText, openaiKey.trim());
      method = 'openai';
    } catch (err) {
      console.warn('OpenAI extraction failed, falling back to heuristics:', err);
      rawSkills = extractWithHeuristics(fullJobText);
      method = 'heuristic';
    }
  } else {
    rawSkills = extractWithHeuristics(fullJobText);
    method = 'heuristic';
  }

  // Normalize and deduplicate
  const skillEntityMap = new Map<string, Skill>();
  const jobSkills: JobSkill[] = [];
  const now = new Date().toISOString();

  rawSkills.forEach((raw, idx) => {
    const normalized = normalizeSkill(raw.skillName, raw.category);
    const skillId = `sk-${normalized.normalizedName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    if (!skillEntityMap.has(normalized.normalizedName)) {
      skillEntityMap.set(normalized.normalizedName, {
        id: skillId,
        name: normalized.name,
        normalizedName: normalized.normalizedName,
        category: normalized.category,
        createdDate: now,
      });
    }

    jobSkills.push({
      id: `js-${job.id}-${skillId}-${idx}`,
      jobId: job.id,
      skillId: skillId,
      skillName: normalized.name,
      normalizedName: normalized.normalizedName,
      category: normalized.category,
      extractionConfidence: raw.confidence || 0.9,
      extractionDate: now,
      jobTitle: job.jobTitle,
      company: job.company,
      industry: String(job.industry),
    });
  });

  return {
    skills: Array.from(skillEntityMap.values()),
    jobSkills,
    method,
  };
}
