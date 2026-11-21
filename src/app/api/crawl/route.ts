import { NextRequest, NextResponse } from 'next/server';
import { getSource, updateSource, saveJobs, saveSkill, saveJobSkills, getJobs, getJobSkills, saveSnapshots } from '@/lib/db';
import { crawlSourceUrl } from '@/lib/firecrawl';
import { extractSkillsFromJob } from '@/lib/skill-extractor';
import { SkillSnapshot } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceId } = body;

    if (!sourceId) {
      return NextResponse.json({ success: false, error: 'sourceId is required' }, { status: 400 });
    }

    const source = await getSource(sourceId);
    if (!source) {
      return NextResponse.json({ success: false, error: 'Source not found' }, { status: 404 });
    }

    // Update status to in_progress
    await updateSource(sourceId, { crawlStatus: 'in_progress' });

    // Execute crawl via Firecrawl (or fallback)
    const crawlResult = await crawlSourceUrl(source);

    if (crawlResult.status === 'failed') {
      await updateSource(sourceId, {
        crawlStatus: 'failed',
        errorMessage: crawlResult.errorMessage || 'Crawl failed',
      });
      return NextResponse.json({ success: false, error: crawlResult.errorMessage }, { status: 500 });
    }

    // Save extracted jobs with deduplication
    const saveJobResult = await saveJobs(crawlResult.jobsExtracted);

    // Run AI skill extraction for each new job
    let totalExtractedSkills = 0;
    for (const job of crawlResult.jobsExtracted) {
      const extraction = await extractSkillsFromJob(job);
      totalExtractedSkills += extraction.skills.length;

      // Save new skills into catalog
      for (const sk of extraction.skills) {
        await saveSkill(sk);
      }
      // Save job-to-skill junction mappings
      await saveJobSkills(extraction.jobSkills);
    }

    // Recalculate snapshot for current period (2026-Q4)
    const allJobs = await getJobs();
    const allJobSkills = await getJobSkills();
    const currentPeriod = '2026-Q4';
    const totalJobs = allJobs.length || 1;

    // Aggregate by skill
    const skillStats: Record<string, { name: string; category: any; count: number; jobs: Set<string>; industries: Record<string, number> }> = {};
    allJobSkills.forEach((js) => {
      if (!skillStats[js.skillId]) {
        skillStats[js.skillId] = {
          name: js.skillName,
          category: js.category,
          count: 0,
          jobs: new Set(),
          industries: {},
        };
      }
      skillStats[js.skillId].count += 1;
      skillStats[js.skillId].jobs.add(js.jobId);
      const ind = js.industry || 'Technology';
      skillStats[js.skillId].industries[ind] = (skillStats[js.skillId].industries[ind] || 0) + 1;
    });

    const newSnapshots: SkillSnapshot[] = Object.entries(skillStats).map(([skillId, stat]) => ({
      id: `snap-${skillId}-${currentPeriod}`,
      skillId,
      skillName: stat.name,
      normalizedName: stat.name,
      category: stat.category,
      timePeriod: currentPeriod,
      mentionCount: stat.count,
      uniqueJobCount: stat.jobs.size,
      industryBreakdown: stat.industries,
      demandPercentage: Number(((stat.jobs.size / totalJobs) * 100).toFixed(1)),
      calculatedDate: new Date().toISOString(),
    }));

    await saveSnapshots(newSnapshots);

    // Update source status to completed
    await updateSource(sourceId, {
      crawlStatus: 'completed',
      lastCrawlDate: new Date().toISOString(),
      jobCount: (source.jobCount || 0) + saveJobResult.insertedCount,
      errorMessage: crawlResult.errorMessage,
    });

    return NextResponse.json({
      success: true,
      data: {
        sourceId,
        isLiveCrawl: crawlResult.isLiveCrawl,
        jobsExtracted: crawlResult.jobsExtracted.length,
        newJobsSaved: saveJobResult.insertedCount,
        duplicatesIgnored: saveJobResult.duplicateCount,
        skillsExtracted: totalExtractedSkills,
        durationMs: crawlResult.durationMs,
        notice: crawlResult.errorMessage,
      },
    });
  } catch (err: any) {
    console.error('Crawl execution error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
