import { NextResponse } from 'next/server';
import { calculateSkillIntelligence } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const analyses = await calculateSkillIntelligence();

    const rising = analyses.filter((a) => a.classification === 'Rising');
    const stable = analyses.filter((a) => a.classification === 'Stable');
    const declining = analyses.filter((a) => a.classification === 'Declining');
    const insufficient = analyses.filter((a) => a.classification === 'Insufficient historical data');

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalSkills: analyses.length,
          risingCount: rising.length,
          stableCount: stable.length,
          decliningCount: declining.length,
          insufficientDataCount: insufficient.length,
        },
        rising,
        stable,
        declining,
        all: analyses,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
