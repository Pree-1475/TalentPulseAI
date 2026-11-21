import { NextRequest, NextResponse } from 'next/server';
import { calculateSkillIntelligence } from '@/lib/analytics';
import { getJobs, getJobSkills } from '@/lib/db';

export const dynamic = 'force-dynamic';

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'skills';

    if (type === 'skills') {
      const analyses = await calculateSkillIntelligence();
      const headers = [
        'Skill Name',
        'Category',
        'Demand Classification',
        'Current Mentions',
        'Demand Percentage (%)',
        'Period Delta (%)',
        'Primary Industry',
        'Related Job Roles',
        'AI Trend Insight',
      ];

      const rows = analyses.map((a) => [
        escapeCsvCell(a.skillName),
        escapeCsvCell(a.category),
        escapeCsvCell(a.classification),
        escapeCsvCell(a.currentMentions),
        escapeCsvCell(a.currentDemandPct.toFixed(1)),
        escapeCsvCell(a.pctChange >= 0 ? `+${a.pctChange.toFixed(1)}%` : `${a.pctChange.toFixed(1)}%`),
        escapeCsvCell(a.topIndustries[0]?.industry || 'Cross-industry'),
        escapeCsvCell(a.topRoles.slice(0, 3).map((r) => r.role).join(', ')),
        escapeCsvCell(a.aiInsight),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="talentpulse_skill_demand_${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'jobs') {
      const [jobs, jobSkills] = await Promise.all([getJobs(), getJobSkills()]);
      const headers = [
        'Job Title',
        'Company',
        'Industry',
        'Location',
        'Source URL',
        'Extracted Skills Count',
        'Key Extracted Skills',
        'Crawled Date',
      ];

      const rows = jobs.map((j) => {
        const skills = jobSkills.filter((js) => js.jobId === j.id).map((js) => js.skillName);
        return [
          escapeCsvCell(j.jobTitle),
          escapeCsvCell(j.company),
          escapeCsvCell(j.industry),
          escapeCsvCell(j.location),
          escapeCsvCell(j.sourceUrl),
          escapeCsvCell(skills.length),
          escapeCsvCell(skills.slice(0, 6).join('; ')),
          escapeCsvCell(j.crawledDate),
        ];
      });

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="talentpulse_jobs_analyzed_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid export type. Use "skills" or "jobs"' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
