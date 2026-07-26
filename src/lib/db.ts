import { kv } from '@vercel/kv';

export type QuestionType = 'mcq' | 'tf';

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

// Fallback in-memory database for local dev without Vercel KV setup
let localFallbackDb: Database = { ...defaultDB };

export async function readDB(): Promise<Database> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("Vercel KV not configured. Using in-memory fallback.");
    return localFallbackDb;
  }
  
  try {
    const data = await kv.get<Database>('ymh_db');
    if (!data) {
      await kv.set('ymh_db', defaultDB);
      return defaultDB;
    }
    return data;
  } catch (error) {
    console.error("Failed to read from Vercel KV", error);
    return localFallbackDb; // Fallback
  }
}

export async function writeDB(db: Database): Promise<void> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    localFallbackDb = db;
    return;
  }

  try {
    await kv.set('ymh_db', db);
  } catch (error) {
    console.error("Failed to write to Vercel KV", error);
  }
}

export function generateId() {
  return crypto.randomUUID();
}
