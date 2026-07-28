// Database Layer - Supabase PostgreSQL
// Uses Supabase REST API (PostgREST) with fetch - no external packages needed

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
}

function restUrl(table: string, query = "") {
  return `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`;
}

// ─── Generic CRUD helpers ─────────────────────────────────────────────────────

export async function dbSelect<T = any>(table: string, query = "select=*"): Promise<T[]> {
  const res = await fetch(restUrl(table, query), {
    headers: getHeaders(),
    cache: "no-store"
  });
  if (!res.ok) {
    console.error(`[DB] SELECT ${table} error: ${res.status}`, await res.text());
    return [];
  }
  return await res.json();
}

export async function dbInsert<T = any>(table: string, data: any): Promise<T | null> {
  const res = await fetch(restUrl(table), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    console.error(`[DB] INSERT ${table} error: ${res.status}`, await res.text());
    return null;
  }
  const result = await res.json();
  return Array.isArray(result) ? result[0] : result;
}

export async function dbUpdate<T = any>(table: string, filter: string, data: any): Promise<T | null> {
  const res = await fetch(restUrl(table, filter), {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    console.error(`[DB] UPDATE ${table} error: ${res.status}`, await res.text());
    return null;
  }
  const result = await res.json();
  return Array.isArray(result) ? result[0] : result;
}

export async function dbDelete(table: string, filter: string): Promise<boolean> {
  const res = await fetch(restUrl(table, filter), {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) {
    console.error(`[DB] DELETE ${table} error: ${res.status}`, await res.text());
    return false;
  }
  return true;
}

// Pure JS UUID v4 generator - safe for all runtimes
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
