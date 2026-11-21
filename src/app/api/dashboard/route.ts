import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getDashboardMetrics();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in /api/dashboard:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve dashboard metrics' },
      { status: 500 }
    );
  }
}
