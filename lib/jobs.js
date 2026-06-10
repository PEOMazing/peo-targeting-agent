// Hiring-velocity signal via the Adzuna jobs API (free developer tier).
// Directional, not exact: matches by company name as an exact phrase.
// Degrades to {count:null} if ADZUNA_APP_ID / ADZUNA_APP_KEY aren't set.

const BASE = 'https://api.adzuna.com/v1/api/jobs';
const COUNTRY = (process.env.ADZUNA_COUNTRY || 'us').toLowerCase();

export function jobsEnabled() {
  return !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);
}

export async function getOpenings(companyName) {
  if (!jobsEnabled() || !companyName) return { count: null, titles: [] };
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID,
    app_key: process.env.ADZUNA_APP_KEY,
    what_phrase: companyName,
    results_per_page: '10',
    'content-type': 'application/json',
  });
  try {
    const res = await fetch(`${BASE}/${COUNTRY}/search/1?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { count: null, titles: [], error: `Adzuna ${res.status}` };
    const data = await res.json();
    const titles = (data.results || []).slice(0, 5).map((r) => r.title).filter(Boolean);
    return { count: typeof data.count === 'number' ? data.count : null, titles };
  } catch (e) {
    return { count: null, titles: [], error: e.message };
  }
}

// Simple concurrency-limited map so a list doesn't fire 50 requests at once.
export async function pMap(items, fn, concurrency = 5) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}
