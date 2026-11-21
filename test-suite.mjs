// Verification test suite for TalentPulse AI backend and core algorithms
import assert from 'assert';
import { normalizeSkill, CANONICAL_SKILL_MAP } from './src/lib/skill-extractor.ts';
import { classifySkillDemand, RISING_THRESHOLD_PCT, DECLINING_THRESHOLD_PCT } from './src/lib/analytics.ts';
import { computeJobHash } from './src/lib/firecrawl.ts';
import { calculateSkillIntelligence, getDashboardMetrics } from './src/lib/analytics.ts';
import { generateOrRefreshAiInsights } from './src/lib/ai-insights.ts';

console.log('--- STARTING TALENTPULSE AI TEST SUITE ---');

// Test 1: Skill Normalization Engine
console.log('Testing Skill Normalization and Taxonomy...');
const testCases = [
  { raw: 'js', expectedName: 'JavaScript', expectedCat: 'Programming Languages' },
  { raw: 'JS', expectedName: 'JavaScript', expectedCat: 'Programming Languages' },
  { raw: 'TypeScript', expectedName: 'TypeScript', expectedCat: 'Programming Languages' },
  { raw: 'AWS', expectedName: 'AWS', expectedCat: 'Cloud Technologies' },
  { raw: 'Amazon Web Services', expectedName: 'AWS', expectedCat: 'Cloud Technologies' },
  { raw: 'k8s', expectedName: 'Kubernetes', expectedCat: 'Cloud Technologies' },
  { raw: 'ml', expectedName: 'Machine Learning', expectedCat: 'AI & Machine Learning' },
  { raw: 'genai', expectedName: 'Generative AI', expectedCat: 'AI & Machine Learning' },
  { raw: 'Legacy PHP', expectedName: 'Legacy PHP', expectedCat: 'Programming Languages' },
  { raw: 'angularjs (1.x)', expectedName: 'AngularJS (1.x)', expectedCat: 'Frameworks & Libraries' },
];

for (const tc of testCases) {
  const norm = normalizeSkill(tc.raw);
  assert.strictEqual(norm.normalizedName, tc.expectedName, `Expected ${tc.expectedName} but got ${norm.normalizedName} for "${tc.raw}"`);
  assert.strictEqual(norm.category, tc.expectedCat, `Expected category ${tc.expectedCat} for "${tc.raw}"`);
}
console.log('✓ All 10 skill normalization test cases passed successfully!');

// Test 2: Statistical Classification Engine
console.log('Testing Mathematical Trend Classification Rules...');
assert.strictEqual(classifySkillDemand(24.5, true), 'Rising', 'Demand +24.5% must be classified as Rising');
assert.strictEqual(classifySkillDemand(12.0, true), 'Rising', 'Demand +12.0% (threshold boundary) must be classified as Rising');
assert.strictEqual(classifySkillDemand(5.2, true), 'Stable', 'Demand +5.2% must be classified as Stable');
assert.strictEqual(classifySkillDemand(0.0, true), 'Stable', 'Demand 0.0% must be classified as Stable');
assert.strictEqual(classifySkillDemand(-7.5, true), 'Stable', 'Demand -7.5% must be classified as Stable');
assert.strictEqual(classifySkillDemand(-10.0, true), 'Declining', 'Demand -10.0% (threshold boundary) must be classified as Declining');
assert.strictEqual(classifySkillDemand(-45.0, true), 'Declining', 'Demand -45.0% must be classified as Declining');
assert.strictEqual(classifySkillDemand(35.0, false), 'Insufficient historical data', 'Insufficient data flag must override numeric prediction');
console.log('✓ All 8 statistical classification boundary conditions verified!');

// Test 3: Deduplication Hashing
console.log('Testing Content Hashing and Deduplication...');
const hash1 = computeJobHash('Stripe', 'Staff Engineer', 'Scaling global payment rails using TypeScript.');
const hash2 = computeJobHash('stripe ', 'staff engineer', 'Scaling global payment rails using TypeScript.');
const hash3 = computeJobHash('Stripe', 'Staff Engineer', 'Completely different role description.');

assert.strictEqual(hash1, hash2, 'Case and whitespace variations of company and title should produce identical deduplication hash');
assert.notStrictEqual(hash1, hash3, 'Different descriptions should produce different hashes');
console.log('✓ SHA-256 deduplication hashing validated!');

// Test 4: Database Layer & Analytics Calculations
console.log('Testing Database and Analytics Calculation Engine...');
async function runDataTests() {
  const metrics = await getDashboardMetrics();
  assert(metrics.totalJobsAnalyzed >= 10, 'Expected at least 10 baseline jobs analyzed');
  assert(metrics.uniqueSkillsIdentified >= 20, 'Expected at least 20 unique skills');
  assert(metrics.risingSkillsCount > 0, 'Expected at least 1 rising skill');
  assert(metrics.stableSkillsCount > 0, 'Expected at least 1 stable skill');
  assert(metrics.decliningSkillsCount > 0, 'Expected at least 1 declining skill');
  assert(metrics.topDemandedSkills.length === 10, 'Expected exactly 10 top demanded skills');
  assert(metrics.skillDemandTrends.length === 4, 'Expected 4 quarters in trend timeline (Q1-Q4)');
  console.log(`✓ Metrics verified: ${metrics.totalJobsAnalyzed} jobs, ${metrics.uniqueSkillsIdentified} skills, ${metrics.risingSkillsCount} rising, ${metrics.stableSkillsCount} stable, ${metrics.decliningSkillsCount} declining.`);

  // Test AI Insights
  const insights = await generateOrRefreshAiInsights(false);
  assert(insights.length >= 6, 'Expected at least 6 strategic AI insight categories');
  console.log(`✓ AI Insights verified: ${insights.length} comprehensive strategic briefings generated.`);

  console.log('\n===============================================================');
  console.log('🎉 ALL AUTOMATED TALENTPULSE AI SYSTEM TESTS PASSED (100%)');
  console.log('===============================================================\n');
}

runDataTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
