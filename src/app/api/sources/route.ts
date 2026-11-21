import { NextRequest, NextResponse } from 'next/server';
import { getSources, saveSource, deleteSource } from '@/lib/db';
import { Source, SourceType } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sources = await getSources();
    return NextResponse.json({ success: true, data: sources });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, sourceName, sourceType } = body;

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'A valid HTTP/HTTPS career page URL is required.' },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();
    let name = sourceName?.trim();
    if (!name) {
      try {
        const u = new URL(cleanUrl);
        const host = u.hostname.replace('www.', '').replace('careers.', '').replace('jobs.', '').split('.')[0];
        name = host.charAt(0).toUpperCase() + host.slice(1);
      } catch (e) {
        name = 'Career Portal';
      }
    }

    const newSource: Source = {
      id: `src-${Date.now()}`,
      url: cleanUrl,
      sourceName: name,
      sourceType: (sourceType as SourceType) || 'Technology',
      createdDate: new Date().toISOString(),
      crawlStatus: 'pending',
      jobCount: 0,
    };

    const saved = await saveSource(newSource);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Source ID is required' }, { status: 400 });
    }
    const deleted = await deleteSource(id);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
