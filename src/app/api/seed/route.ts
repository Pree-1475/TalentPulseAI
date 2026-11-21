import { NextResponse } from 'next/server';
import { resetDatabaseToDemo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await resetDatabaseToDemo();
    return NextResponse.json({ success: true, message: 'Database reset to demo state with rich realistic records' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
