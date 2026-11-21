import { NextRequest, NextResponse } from 'next/server';
import { calculateSkillIntelligence } from '@/lib/analytics';
import { getJobSkills } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skillId = params.id;
    const analyses = await calculateSkillIntelligence();
    const skillData = analyses.find((a) => a.skillId.toLowerCase() === skillId.toLowerCase());

    if (!skillData) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    // Get specific job postings referencing this skill
    const jobSkills = await getJobSkills({ skillId: skillData.skillId });

    return NextResponse.json({
      success: true,
      data: {
        ...skillData,
        matchingJobs: jobSkills.slice(0, 10).map((js) => ({
          jobId: js.jobId,
          jobTitle: js.jobTitle,
          company: js.company,
          industry: js.industry,
          extractionConfidence: js.extractionConfidence,
        })),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
