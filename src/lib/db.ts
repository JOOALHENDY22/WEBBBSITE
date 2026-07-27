// Database Layer
// Priority: 1) Vercel KV  2) Upstash REST  3) In-memory (dev only)

export type Database = {
  users: any[];
  exams: any[];
  questions: any[];
  results: any[];
};

const defaultDB: Database = {
  users: [],
  exams: [],
  questions: [],
  results: []
};

// In-memory store used ONLY when no external DB is configured
let memoryDB: Database = {
  users: [],
  exams: [],
  questions: [],
  results: []
};

const DB_KEY = 'ymh_db';

// ─── Vercel KV (primary) ───────────────────────────────────────────────────────
async function tryVercelKV(): Promise<{ get: () => Promise<Database | null>; set: (db: Database) => Promise<void> } | null> {
  try {
    const kvUrl   = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (!kvUrl || !kvToken) return null;

    return {
      async get() {
        const res = await fetch(`${kvUrl}/get/${DB_KEY}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
          cache: 'no-store'
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.result) return null;
        return JSON.parse(json.result) as Database;
      },
      async set(db: Database) {
        await fetch(`${kvUrl}/set/${DB_KEY}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.stringify(db))
        });
      }
    };
  } catch {
    return null;
  }
}

// ─── Upstash REST (secondary) ─────────────────────────────────────────────────
async function tryUpstash(): Promise<{ get: () => Promise<Database | null>; set: (db: Database) => Promise<void> } | null> {
  try {
    const url   = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;

    return {
      async get() {
        const res = await fetch(`${url}/get/${DB_KEY}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.result) return null;
        return JSON.parse(json.result) as Database;
      },
      async set(db: Database) {
        await fetch(`${url}/set/${DB_KEY}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.stringify(db))
        });
      }
    };
  } catch {
    return null;
  }
}

async function getStore() {
  return (await tryVercelKV()) || (await tryUpstash()) || null;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function readDB(): Promise<Database> {
  try {
    const store = await getStore();
    if (store) {
      const data = await store.get();
      if (data) return {
        users:     data.users     || [],
        exams:     data.exams     || [],
        questions: data.questions || [],
        results:   data.results   || []
      };
      // First run - initialize
      await store.set(defaultDB);
      return { ...defaultDB };
    }
  } catch (e) {
    console.error('[DB] readDB error:', e);
  }
  // Fallback: in-memory (data won't persist across requests on Vercel)
  return memoryDB;
}

export async function writeDB(db: Database): Promise<void> {
  try {
    const store = await getStore();
    if (store) {
      await store.set(db);
      return;
    }
  } catch (e) {
    console.error('[DB] writeDB error:', e);
  }
  // Fallback: in-memory
  memoryDB = db;
}

// Pure JS UUID v4 generator - safe for edge runtimes, Node.js, and browser
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
