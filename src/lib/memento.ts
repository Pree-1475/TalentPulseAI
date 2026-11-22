/**
 * Memento Historical Skill Trend Store
 *
 * Implements the Memento Pattern for historical skill trend preservation.
 * Supports dual-mode persistence:
 * 1. Momento Cloud Serverless Cache (@gomomento/sdk) when MOMENTO_AUTH_TOKEN is provided.
 * 2. Memento Snapshot Engine (local fallback store) for zero-downtime offline execution.
 */

import { SkillSnapshot } from '@/types';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

// Momento SDK types
let CacheClient: any = null;
let Configurations: any = null;
let CredentialProvider: any = null;
let CreateCache: any = null;
let CacheGet: any = null;
let CacheSet: any = null;

// Dynamically load @gomomento/sdk to avoid startup crashes if not configured
async function loadMomentoSdk() {
  if (!CacheClient) {
    try {
      const sdk = await import('@gomomento/sdk');
      CacheClient = sdk.CacheClient;
      Configurations = sdk.Configurations;
      CredentialProvider = sdk.CredentialProvider;
      CreateCache = sdk.CreateCache;
      CacheGet = sdk.CacheGet;
      CacheSet = sdk.CacheSet;
    } catch (err) {
      console.warn('Momento SDK not available, using Memento Engine:', err);
    }
  }
}

let momentoClientInstance: any = null;
const CACHE_NAME = process.env.MOMENTO_CACHE_NAME || 'talentpulse-memento';
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year TTL for historical trends

/**
 * Get or initialize Momento Cloud client if token is available
 */
export async function getMomentoClient(): Promise<any | null> {
  const token = process.env.MOMENTO_AUTH_TOKEN?.trim();
  if (!token) return null;

  if (momentoClientInstance) return momentoClientInstance;

  try {
    await loadMomentoSdk();
    if (!CacheClient || !Configurations || !CredentialProvider) return null;

    momentoClientInstance = new CacheClient({
      configuration: Configurations.Laptop.v1(),
      credentialProvider: CredentialProvider.fromString(token),
      defaultTtlSeconds: DEFAULT_TTL_SECONDS,
    });

    // Ensure cache exists
    const createRes = await momentoClientInstance.createCache(CACHE_NAME);
    if (createRes instanceof CreateCache.Success) {
      console.log(`[Memento Cloud] Cache "${CACHE_NAME}" created successfully`);
    } else if (createRes instanceof CreateCache.AlreadyExists) {
      console.log(`[Memento Cloud] Connected to existing cache "${CACHE_NAME}"`);
    }

    return momentoClientInstance;
  } catch (err) {
    console.warn('[Memento Cloud] Initialization error, falling back to local Memento Engine:', err);
    momentoClientInstance = null;
    return null;
  }
}

/**
 * Get Memento subsystem operational status
 */
export async function getMementoStatus(): Promise<{
  connected: boolean;
  provider: 'momento-cloud' | 'memento-engine';
  snapshotCount: number;
}> {
  const token = process.env.MOMENTO_AUTH_TOKEN?.trim();
  const client = await getMomentoClient();

  const snapshots = await getMementoSnapshots();

  if (client && token) {
    return {
      connected: true,
      provider: 'momento-cloud',
      snapshotCount: snapshots.length,
    };
  }

  return {
    connected: true,
    provider: 'memento-engine',
    snapshotCount: snapshots.length,
  };
}

/**
 * Retrieve all historical skill trend snapshots from Memento
 */
export async function getMementoSnapshots(skillId?: string): Promise<SkillSnapshot[]> {
  const client = await getMomentoClient();

  // Try Momento Cloud first if connected
  if (client) {
    try {
      const indexKey = 'memento:snapshots:all';
      const res = await client.get(CACHE_NAME, indexKey);
      if (res instanceof CacheGet.Hit) {
        const parsed: SkillSnapshot[] = JSON.parse(res.valueString());
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (skillId) {
            return parsed.filter((s) => s.skillId === skillId);
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Memento Cloud] Cache read failed, falling back to Memento Engine:', err);
    }
  }

  // Fallback to Memento snapshot store
  const localStore = readLocalStore();
  if (skillId) {
    return localStore.snapshots.filter((s) => s.skillId === skillId);
  }
  return localStore.snapshots;
}

/**
 * Save historical skill trend snapshots to Memento
 */
export async function saveMementoSnapshots(snapshots: SkillSnapshot[]): Promise<void> {
  if (snapshots.length === 0) return;

  // 1. Save to local Memento engine
  const store = readLocalStore();
  snapshots.forEach((newSnap) => {
    const idx = store.snapshots.findIndex(
      (s) => s.skillId === newSnap.skillId && s.timePeriod === newSnap.timePeriod
    );
    if (idx >= 0) {
      store.snapshots[idx] = newSnap;
    } else {
      store.snapshots.push(newSnap);
    }
  });
  writeLocalStore(store);

  // 2. Sync to Momento Cloud if available
  const client = await getMomentoClient();
  if (client) {
    try {
      // Save entire array for instant O(1) bulk retrieval
      const indexKey = 'memento:snapshots:all';
      await client.set(CACHE_NAME, indexKey, JSON.stringify(store.snapshots));

      // Also save individual snapshots by key
      for (const snap of snapshots) {
        const itemKey = `memento:snapshot:${snap.skillId}:${snap.timePeriod}`;
        await client.set(CACHE_NAME, itemKey, JSON.stringify(snap));
      }
      console.log(`[Memento Cloud] Synced ${snapshots.length} historical skill snapshots`);
    } catch (err) {
      console.warn('[Memento Cloud] Sync failed:', err);
    }
  }
}

// ----------------- Local Memento Engine Storage Helpers -----------------

const STORE_PATH = path.join(process.cwd(), 'data', 'talentpulse_store.json');

function readLocalStore(): { snapshots: SkillSnapshot[] } {
  try {
    if (existsSync(STORE_PATH)) {
      const data = readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return { snapshots: parsed.snapshots || [] };
    }
  } catch (err) {
    console.error('Error reading local Memento store:', err);
  }
  return { snapshots: [] };
}

function writeLocalStore(store: { snapshots: SkillSnapshot[] }) {
  try {
    if (existsSync(STORE_PATH)) {
      const raw = readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      parsed.snapshots = store.snapshots;
      writeFileSync(STORE_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error writing to local Memento store:', err);
  }
}
