import { NextRequest, NextResponse } from 'next/server';
import { generateOrRefreshAiInsights } from '@/lib/ai-insights';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const insights = await generateOrRefreshAiInsights(false);
    return NextResponse.json({ success: true, count: insights.length, data: insights });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const insights = await generateOrRefreshAiInsights(true);
    return NextResponse.json({ success: true, count: insights.length, data: insights });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
