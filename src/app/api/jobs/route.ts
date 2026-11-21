import { NextRequest, NextResponse } from 'next/server';
import { getJobs, getJobSkills } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get('industry') || undefined;
    const sourceId = searchParams.get('sourceId') || undefined;
    const search = searchParams.get('search') || undefined;

    const [jobs, allJobSkills] = await Promise.all([
      getJobs({ industry, sourceId, search }),
      getJobSkills(),
    ]);

    // Attach extracted skills to each job
    const jobsWithSkills = jobs.map((job) => {
      const skillsForJob = allJobSkills.filter((js) => js.jobId === job.id);
      return {
        ...job,
        extractedSkills: skillsForJob.map((s) => ({
          name: s.skillName,
          category: s.category,
        })),
        extractedSkillsCount: skillsForJob.length,
      };
    });

    return NextResponse.json({ success: true, count: jobsWithSkills.length, data: jobsWithSkills });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
