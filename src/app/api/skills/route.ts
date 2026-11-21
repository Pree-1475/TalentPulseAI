import { NextRequest, NextResponse } from 'next/server';
import { calculateSkillIntelligence } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const classification = searchParams.get('classification');
    const search = searchParams.get('search');
    const industry = searchParams.get('industry');

    let analyses = await calculateSkillIntelligence();

    if (category && category !== 'All') {
      analyses = analyses.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    if (classification && classification !== 'All') {
      analyses = analyses.filter((a) => a.classification.toLowerCase() === classification.toLowerCase());
    }

    if (industry && industry !== 'All') {
      analyses = analyses.filter((a) =>
        a.topIndustries.some((ti) => ti.industry.toLowerCase() === industry.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      analyses = analyses.filter(
        (a) =>
          a.skillName.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.topRoles.some((r) => r.role.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, count: analyses.length, data: analyses });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
