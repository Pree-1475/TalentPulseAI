# TalentPulse AI — Skill Demand Monitor

**TalentPulse AI** is a production-grade, full-stack Workforce Intelligence and Skill Demand Monitoring platform designed for HR leaders, talent acquisition teams, and workforce planners. It tracks evolving technical and behavioral competencies across publicly accessible job boards, normalizes skills using LLM parsing, stores chronological snapshots in MongoDB, and deterministically computes skill momentum (Rising, Stable, and Declining).

---

## 1. System Architecture

```mermaid
flowchart TD
    A[Public Career Portals & URLs] -->|Crawl & Markdown Extraction| B[Firecrawl API / High-Fidelity Simulator]
    B -->|SHA-256 Content Hash Deduplication| C[Job Ingestion Pipeline]
    C -->|Unstructured Job Text| D[AI Skill Extractor\nGemini 1.5 Flash / OpenAI / Heuristic NLP]
    D -->|Canonical Alias Mapping & 9-Category Normalization| E[Skills & JobSkills Catalog]
    E -->|Chronological Grouping Q1-Q4| F[MongoDB Atlas / Persistent Store]
    F -->|Deterministic &Delta;% Formula| G[Demand Intelligence Engine]
    G -->|Statistical Rules| H[Classifications:\nRising >= 12% | Stable | Declining <= -10%]
    H -->|LLM Contextualization| I[AI Strategic Market Insights]
    I --> J[Enterprise SaaS Dashboard]
    I --> K[Interactive Skill Explorer]
    I --> L[Printable PDF & CSV Reports]
```

### Key Architectural Pillars:
1. **Firecrawl Ingestion**: Directly connects to `https://api.firecrawl.dev/v1/scrape` to parse career pages into markdown. Includes automatic SHA-256 cryptographic deduplication (`company::title::snippet`). If no API key is configured or rate limits are reached, the platform transitions to a high-fidelity simulator tailored to the target domain and sector.
2. **AI Skill Extraction**: Multi-model support for Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), and a deterministic 300+ skill taxonomy dictionary with regex boundary extraction. Normalizes variations (`js` &rarr; `JavaScript`, `k8s` &rarr; `Kubernetes`, `aws` &rarr; `AWS`).
3. **Skill Demand Intelligence**: Strictly separates mathematical calculations from LLM interpretations. Relies on:
   $$\Delta\% = \frac{\text{Demand Pct}_2 - \text{Demand Pct}_1}{\text{Demand Pct}_1} \times 100$$
   - **Rising**: $\ge +12.0\%$ relative growth.
   - **Stable**: Between $-10.0\%$ and $+12.0\%$.
   - **Declining**: $\le -10.0\%$ relative contraction.
   - **Insufficient historical data**: When fewer than 2 comparative time periods exist.
4. **Dual Persistence Layer**: Connects natively to MongoDB Atlas via the official `mongodb` driver. If `MONGODB_URI` is omitted or network access is restricted, the platform transparently switches to an embedded file-backed JSON database (`data/talentpulse_store.json`) with an identical collection API.
5. **Modern Enterprise SaaS UI**: Built with Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Recharts, and Lucide icons. Includes a collapsible navigation sidebar, real-time status pills, interactive deep-dive skill modals, and print-ready PDF styling.

---

## 2. Folder Structure

```
TalentPulseAI/
├── .env.example                # Template of environment variables
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration and path aliases
├── tailwind.config.ts          # Tailwind CSS theme configuration
├── postcss.config.mjs          # PostCSS processor configuration
├── next.config.mjs             # Next.js configuration
├── README.md                   # Complete architectural and setup guide
├── test-suite.mjs              # Automated system test suite (100% passing)
├── data/                       # Persistent file store (when MongoDB is offline)
│   └── talentpulse_store.json
└── src/
    ├── types/
    │   └── index.ts            # Data models, interfaces, and category definitions
    ├── lib/
    │   ├── db.ts               # MongoDB driver & fallback persistent store
    │   ├── initial-data.ts     # Curated multi-sector baseline dataset (Q1-Q4 2026)
    │   ├── firecrawl.ts        # Firecrawl scraper client, parsers & deduplication
    │   ├── skill-extractor.ts  # LLM extractor, normalizer & taxonomy dictionary
    │   ├── analytics.ts        # Statistical trend formulas & dashboard aggregations
    │   └── ai-insights.ts      # Strategic HR recommendations generator
    ├── components/
    │   ├── AppShell.tsx        # Responsive layout wrapper
    │   ├── Sidebar.tsx         # Collapsible enterprise navigation
    │   ├── Header.tsx          # Global search, integration status & reseed trigger
    │   ├── StatusBanner.tsx    # Workspace data-source status banner
    │   └── SkillDetailModal.tsx # Interactive deep-dive drawer for any skill
    └── app/
        ├── layout.tsx          # Root HTML metadata and font configuration
        ├── globals.css         # Tailwind base styles and print media rules
        ├── page.tsx            # Main Analytics Dashboard
        ├── sources/
        │   └── page.tsx        # Career Portal Ingestion & Firecrawl Crawler
        ├── intelligence/
        │   └── page.tsx        # Demand Velocity & Statistical Classification
        ├── skills/
        │   └── page.tsx        # Interactive Skill Explorer & Filter Directory
        ├── insights/
        │   └── page.tsx        # AI Strategic Workforce Insights (6 Categories)
        ├── reports/
        │   └── page.tsx        # Executive Briefing, CSV Export & PDF Printable View
        ├── settings/
        │   └── page.tsx        # System Integrations, Status Monitor & Database Reseed
        └── api/
            ├── dashboard/route.ts   # Top KPIs, time-series charts & distributions
            ├── sources/route.ts     # Source URLs management (GET, POST, DELETE)
            ├── crawl/route.ts       # Firecrawl trigger & automated pipeline execution
            ├── jobs/route.ts        # Job descriptions with extracted skills
            ├── skills/route.ts      # Filtered skills intelligence catalog
            ├── skills/[id]/route.ts # Individual skill deep-dive analytics
            ├── analytics/route.ts   # Classification summary & velocity calculations
            ├── insights/route.ts    # Strategic HR recommendations (GET, POST refresh)
            ├── export/route.ts      # Streaming CSV export for skills and jobs
            └── seed/route.ts        # One-click restore to baseline demo records
```

---

## 3. Database Schema

The database contains 6 collections indexed for query performance:

### 1. `sources`
- `id` (String, unique): Primary identifier (`src-1`).
- `url` (String): Public career portal URL.
- `sourceName` (String): Display name of organization.
- `sourceType` (Enum): `Technology`, `Financial Services`, `Consulting`, `Healthcare`, `E-commerce`, or `Other`.
- `createdDate` (ISO Date): Timestamp when source was registered.
- `lastCrawlDate` (ISO Date): Timestamp of most recent crawler execution.
- `crawlStatus` (Enum): `pending`, `in_progress`, `completed`, `failed`.
- `jobCount` (Number): Total unique openings collected from this portal.

### 2. `jobs`
- `id` (String, unique): Job post identifier (`job-1`).
- `jobTitle` (String): Extracted job title.
- `company` (String): Employer or hiring organization.
- `description` (String): Full or summarized job description.
- `location` (String): Remote, hybrid, or physical location.
- `industry` (String): Target industry vertical.
- `sourceUrl` (String): Origin careers URL.
- `sourceId` (String): Reference to `sources.id`.
- `postedDate` (ISO Date): Date listed on portal.
- `crawledDate` (ISO Date): Date ingested by crawler.
- `contentHash` (String, unique index): SHA-256 hash of `company::title::snippet`.

### 3. `skills`
- `id` (String, unique): Canonical identifier (`sk-python`).
- `name` (String): Display name.
- `normalizedName` (String, unique index): Canonical normalized form (`Python`).
- `category` (Enum): One of the 9 canonical skill categories:
  - Technical Skills
  - Programming Languages
  - Frameworks & Libraries
  - Cloud Technologies
  - Databases
  - AI & Machine Learning
  - Soft Skills
  - Management & Leadership
  - Domain-Specific

### 4. `job_skills` (Junction)
- `id` (String, unique): Primary junction ID (`js-job1-sk1`).
- `jobId` (String, index): Reference to `jobs.id`.
- `skillId` (String, index): Reference to `skills.id`.
- `skillName` (String): Display name at time of extraction.
- `normalizedName` (String): Normalized name.
- `category` (Enum): Category classification.
- `extractionConfidence` (Number): Confidence score (0.00 &ndash; 1.00).
- `extractionDate` (ISO Date): Timestamp of extraction.
- `jobTitle`, `company`, `industry`: Denormalized for zero-join reporting.

### 5. `skill_snapshots`
- `id` (String, unique): Snapshot ID (`snap-sk1-2026-Q4`).
- `skillId` (String, composite index with `timePeriod`).
- `skillName` (String): Skill name.
- `timePeriod` (String): Time window (e.g. `2026-Q1`, `2026-Q2`, `2026-Q3`, `2026-Q4`).
- `mentionCount` (Number): Total occurrences in the period.
- `uniqueJobCount` (Number): Number of distinct jobs mentioning this skill.
- `demandPercentage` (Number): Percentage of jobs requiring this skill in the period.
- `industryBreakdown` (Object): Map of industry names to mention frequencies.
- `calculatedDate` (ISO Date): Timestamp of calculation.

### 6. `ai_insights`
- `id` (String, unique): Primary ID (`insight-1`).
- `insightType` (Enum): `emerging`, `declining`, `industry_shift`, `recruitment`, `upskilling`, `skill_combinations`.
- `title` (String): Concise executive headline.
- `description` (String): Factual summary grounded in database metrics.
- `supportingStatistics` (Array): Numerical evidence `{ label, value }`.
- `actionableRecommendations` (Array of Strings): Prescriptive HR recommendations.
- `skillsInvolved` (Array of Strings): Key skill names referenced.
- `generatedDate` (ISO Date): Generation timestamp.

---

## 4. API Documentation

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/dashboard` | Returns top KPI metrics, time-series chart data, category/industry breakdowns, and system status. | None |
| `GET` | `/api/sources` | Lists all monitored career page sources with crawl history. | None |
| `POST` | `/api/sources` | Adds a new career page source to monitor. | Body: `{ url, sourceName, sourceType }` |
| `DELETE` | `/api/sources` | Removes a monitored career source. | Query: `?id=src-1` |
| `POST` | `/api/crawl` | Triggers a Firecrawl crawl, executes LLM extraction, hashes duplicates, and updates snapshots. | Body: `{ sourceId }` |
| `GET` | `/api/jobs` | Returns collected job descriptions with extracted skills. | Query: `?industry=Technology&search=Python` |
| `GET` | `/api/skills` | Returns skills catalog with demand intelligence metrics. | Query: `?category=Cloud&classification=Rising` |
| `GET` | `/api/skills/[id]` | Returns deep-dive historical timeline, industry breakdown, and matching job postings for a skill. | Path: `/api/skills/sk-python` |
| `GET` | `/api/analytics` | Returns quantitative breakdown of rising, stable, and declining skills. | None |
| `GET` | `/api/insights` | Retrieves executive AI strategic insights across 6 categories. | None |
| `POST` | `/api/insights` | Re-analyzes current database numbers and regenerates strategic insights. | None |
| `GET` | `/api/export` | Streams CSV file download for skills or jobs. | Query: `?type=skills` or `?type=jobs` |
| `POST` | `/api/seed` | Restores database to default baseline records spanning Q1–Q4 2026. | None |

---

## 5. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# MongoDB Atlas Connection URI (leave blank to run in resilient local JSON storage mode)
MONGODB_URI=mongodb://localhost:27017/talentpulse

# Firecrawl API Key (https://firecrawl.dev)
# Leave blank to use the built-in high-fidelity domain scraper simulator
FIRECRAWL_API_KEY=

# LLM API Provider (Provide at least one for live LLM extraction; otherwise heuristic engine activates)
GEMINI_API_KEY=
# or
OPENAI_API_KEY=

# Application URL
NEXT_PUBLIC_APP_NAME=TalentPulse AI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. Setup and Execution Instructions

### Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### Installation
```bash
# Clone or navigate to the project directory
cd TalentPulseAI

# Install dependencies
npm install
```

### Development Server
```bash
# Start the local Next.js development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Production Build & Execution
```bash
# Build the optimized production bundle
npm run build

# Start the production server
npm run start
```

### Automated Test Suite Execution
```bash
# Run the automated backend test suite
node --experimental-strip-types test-suite.mjs
```

---

## 7. Known Limitations & Future Enhancements

1. **JavaScript-Heavy Single Page App Portals**: Some career portals (e.g. customized Workday or Greenhouse implementations) render job lists dynamically via client-side JavaScript. Firecrawl handles most modern SPAs with `waitFor` delays; for complex portals with pagination buttons, integrating Firecrawl's multi-page crawl endpoint (`/v1/crawl`) with webhook callbacks is recommended.
2. **Salary Extraction**: While currently parsing titles, locations, descriptions, and technical competencies, adding automated salary range extraction (base salary, bonus, equity) will provide compensation-vs-skill correlation analytics.
3. **Multi-Tenant Org Isolation**: The current release provides an enterprise-wide workspace with customizable data sources. Adding role-based access control (RBAC) will allow multiple HR teams to manage private crawler pipelines.
