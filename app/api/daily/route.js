import { scoreCompany } from '../../../lib/score';
import { qualify, signalsFromEnrichment, reconcileScore } from '../../../lib/qualify';
import { matchPartner } from '../../../lib/partners';
import { DAILY_POOL, FOLLOWUP_POOL } from '../../../lib/demodata';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toResult(org, extra = {}) {
  const op = typeof org._openings === 'number' ? org._openings : null;
  const sc = scoreCompany(org, { openings: op });
  const q = qualify(signalsFromEnrichment(org));
  const rec = reconcileScore(sc.score, sc.band, q);
  return {
    name: org.name, domain: org.domain, employees: org.employees, industry: org.industry, state: org.state,
    openings: op, incumbent: sc.incumbent, partner: matchPartner(org),
    score: rec.score, band: rec.band, reasons: sc.reasons, org,
    qualification: q, qualPartial: true, ...extra,
  };
}

export async function GET() {
  try {
    const targets = DAILY_POOL.map((o) => toResult(o, { whyNow: o.whyNow }))
      .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    const followUps = FOLLOWUP_POOL.map((o) => toResult(o, {
      lastTouchType: o.lastTouchType, lastTouchDaysAgo: o.lastTouchDaysAgo, nextAction: o.nextAction,
    }));
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return Response.json({ demo: true, date, targets, followUps });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
