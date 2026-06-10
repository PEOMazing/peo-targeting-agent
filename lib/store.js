// Airtable-backed store for the learning loop.
// Degrades gracefully: if env vars aren't set, every function is a safe no-op
// and the app keeps working as a stateless generator.

const API = 'https://api.airtable.com/v0';

function cfg() {
  const key = process.env.AIRTABLE_API_KEY;
  const base = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || 'Deals';
  if (!key || !base) return null;
  return { key, base, table: encodeURIComponent(table) };
}

export function storeEnabled() {
  return !!cfg();
}

async function airtable(path, opts = {}) {
  const c = cfg();
  if (!c) throw new Error('Airtable not configured');
  const res = await fetch(`${API}/${c.base}/${c.table}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${c.key}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Airtable ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

export async function saveDeal({ inputs, brief }) {
  if (!storeEnabled()) return null;
  const data = await airtable('', {
    method: 'POST',
    body: JSON.stringify({
      typecast: true,
      fields: {
        Company: inputs.company || '',
        Employees: String(inputs.employees || ''),
        State: inputs.state || '',
        Industry: inputs.industry || '',
        CurrentSetup: inputs.current || '',
        FitScore: Number(brief.fitScore) || 0,
        FitLabel: brief.fitLabel || '',
        Brief: JSON.stringify(brief),
        Outcome: 'Pending',
        WhatWorked: '',
        Notes: '',
      },
    }),
  });
  return data.id;
}

export async function updateOutcome(id, { outcome, whatWorked, notes }) {
  if (!storeEnabled()) return null;
  const fields = {};
  if (outcome) fields.Outcome = outcome;
  if (Array.isArray(whatWorked)) fields.WhatWorked = whatWorked.join(', ');
  else if (typeof whatWorked === 'string') fields.WhatWorked = whatWorked;
  if (notes != null) fields.Notes = notes;
  const data = await airtable(`/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ typecast: true, fields }),
  });
  return data.id;
}

export async function listDeals(limit = 100) {
  if (!storeEnabled()) return [];
  const data = await airtable(`?pageSize=${Math.min(limit, 100)}`);
  const records = (data.records || []).map((r) => ({
    id: r.id,
    createdTime: r.createdTime,
    company: r.fields.Company || '',
    state: r.fields.State || '',
    industry: r.fields.Industry || '',
    employees: r.fields.Employees || '',
    fitScore: r.fields.FitScore ?? null,
    fitLabel: r.fields.FitLabel || '',
    outcome: r.fields.Outcome || 'Pending',
    whatWorked: r.fields.WhatWorked || '',
  }));
  records.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
  return records;
}

const band = (s) => (s >= 75 ? 'Strong' : s >= 50 ? 'Good' : s >= 25 ? 'Moderate' : 'Weak');

export function computeStats(records) {
  const total = records.length;
  const won = records.filter((r) => r.outcome === 'Won').length;
  const lost = records.filter((r) => r.outcome === 'Lost').length;
  const pending = records.filter((r) => r.outcome === 'Pending').length;
  const decided = won + lost;
  const winRate = decided ? Math.round((won / decided) * 100) : null;

  const bands = {};
  for (const r of records) {
    if (r.fitScore == null) continue;
    const b = band(r.fitScore);
    bands[b] = bands[b] || { won: 0, lost: 0 };
    if (r.outcome === 'Won') bands[b].won++;
    else if (r.outcome === 'Lost') bands[b].lost++;
  }
  const order = ['Strong', 'Good', 'Moderate', 'Weak'];
  const byBand = order
    .filter((b) => bands[b])
    .map((b) => {
      const v = bands[b];
      const d = v.won + v.lost;
      return { band: b, won: v.won, lost: v.lost, winRate: d ? Math.round((v.won / d) * 100) : null };
    });

  return { total, won, lost, pending, decided, winRate, byBand };
}

// Compact learnings string injected into the generation prompt (Phase 2 seam,
// kept lightweight here so the loop actually closes in Phase 1).
export async function getLearnings({ state, industry }) {
  if (!storeEnabled()) return null;
  try {
    const records = await listDeals(100);
    if (!records.length) return null;
    const stats = computeStats(records);

    const ind = (industry || '').toLowerCase().split(' ')[0];
    const match = records.filter(
      (r) =>
        (state && r.state && r.state.toLowerCase() === state.toLowerCase()) ||
        (ind && r.industry && r.industry.toLowerCase().includes(ind))
    );

    const wins = records.filter((r) => r.outcome === 'Won');
    const tally = {};
    for (const w of wins) {
      (w.whatWorked || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((t) => (tally[t] = (tally[t] || 0) + 1));
    }
    const topWorked = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t, c]) => `${t} (won ${c})`);

    return { stats, matchCount: match.length, topWorked };
  } catch {
    return null;
  }
}
