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

// Clean environment variables by stripping quotes if present (copy-paste protection)
function cleanEnv(val: string | undefined): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '');
}

// ─── Vercel KV (primary) ───────────────────────────────────────────────────────
async function tryVercelKV(): Promise<{ get: () => Promise<Database | null>; set: (db: Database) => Promise<void> } | null> {
  try {
    const kvUrl   = cleanEnv(process.env.KV_REST_API_URL);
    const kvToken = cleanEnv(process.env.KV_REST_API_TOKEN);
    if (!kvUrl || !kvToken) return null;

    console.log(`[DB] Attempting Vercel KV connection to URL: ${kvUrl.slice(0, 30)}...`);

    return {
      async get() {
        const res = await fetch(`${kvUrl}/get/${DB_KEY}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
          cache: 'no-store'
        });
        console.log(`[DB] Vercel KV GET status: ${res.status}`);
        if (!res.ok) {
          const text = await res.text();
          console.error(`[DB] Vercel KV GET error details: ${text}`);
          return null;
        }
        const json = await res.json();
        if (!json.result) return null;
        return JSON.parse(json.result) as Database;
      },
      async set(db: Database) {
        const res = await fetch(`${kvUrl}/set/${DB_KEY}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.stringify(db))
        });
        console.log(`[DB] Vercel KV SET status: ${res.status}`);
        if (!res.ok) {
          const text = await res.text();
          console.error(`[DB] Vercel KV SET error details: ${text}`);
        }
      }
    };
  } catch (e: any) {
    console.error('[DB] tryVercelKV setup error:', e.message);
    return null;
  }
}

// ─── Upstash REST (secondary) ─────────────────────────────────────────────────
async function tryUpstash(): Promise<{ get: () => Promise<Database | null>; set: (db: Database) => Promise<void> } | null> {
  try {
    const url   = cleanEnv(process.env.UPSTASH_REDIS_REST_URL);
    const token = cleanEnv(process.env.UPSTASH_REDIS_REST_TOKEN);
    if (!url || !token) return null;

    console.log(`[DB] Attempting Upstash REST connection to URL: ${url.slice(0, 30)}...`);

    return {
      async get() {
        // Standard REST fetch for Upstash Redis
        const res = await fetch(`${url}/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['GET', DB_KEY]),
          cache: 'no-store'
        });
        console.log(`[DB] Upstash REST GET status: ${res.status}`);
        if (!res.ok) {
          const text = await res.text();
          console.error(`[DB] Upstash REST GET error details: ${text}`);
          return null;
        }
        const json = await res.json();
        if (!json.result) return null;
        return JSON.parse(json.result) as Database;
      },
      async set(db: Database) {
        const res = await fetch(`${url}/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['SET', DB_KEY, JSON.stringify(db)])
        });
        console.log(`[DB] Upstash REST SET status: ${res.status}`);
        if (!res.ok) {
          const text = await res.text();
          console.error(`[DB] Upstash REST SET error details: ${text}`);
        }
      }
    };
  } catch (e: any) {
    console.error('[DB] tryUpstash setup error:', e.message);
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
      if (data) {
        console.log(`[DB] Successfully read data from remote database.`);
        return {
          users:     data.users     || [],
          exams:     data.exams     || [],
          questions: data.questions || [],
          results:   data.results   || []
        };
      }
      console.log(`[DB] Remote database is empty. Initializing with default schema...`);
      await store.set(defaultDB);
      return { ...defaultDB };
    }
  } catch (e) {
    console.error('[DB] readDB error:', e);
  }
  console.warn('[DB] Falling back to in-memory store (volatile local memory only).');
  return memoryDB;
}

export async function writeDB(db: Database): Promise<void> {
  try {
    const store = await getStore();
    if (store) {
      await store.set(db);
      console.log(`[DB] Successfully wrote data to remote database.`);
      return;
    }
  } catch (e) {
    console.error('[DB] writeDB error:', e);
  }
  console.warn('[DB] Saved data locally in-memory only (will be lost on restart).');
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
