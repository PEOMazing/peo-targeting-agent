import { enrichCompanies, apolloEnabled } from '../../../lib/apollo';
import { scoreCompany } from '../../../lib/score';
import { getOpenings, jobsEnabled, pMap } from '../../../lib/jobs';
import { matchPartner } from '../../../lib/partners';
import { qualify, signalsFromEnrichment, reconcileScore } from '../../../lib/qualify';
import { DEMO_PROSPECTS } from '../../../lib/demodata';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DEMO = process.env.DEMO_MODE === '1';

export async function POST(req) {
  try {
    const { companies } = await req.json();

    // Demo mode (forced, or whenever Apollo isn't configured): use sample prospects
    // so a shared link is fully explorable. Clearly flagged to the client.
    const useDemo = DEMO || !apolloEnabled();

    if (useDemo) {
      const results = DEMO_PROSPECTS.map((org) => {
        const op = typeof org._openings === 'number' ? org._openings : null;
        const sc = scoreCompany(org, { openings: op });
        const q = qualify(signalsFromEnrichment(org));
        const rec = reconcileScore(sc.score, sc.band, q);
        return {
          name: org.name, domain: org.domain, employees: org.employees, industry: org.industry, state: org.state,
          openings: op,
          incumbent: sc.incumbent, partner: matchPartner(org),
          score: rec.score, band: rec.band, reasons: sc.reasons, org, error: null,
          qualification: q, qualPartial: true,
        };
      }).sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
      return Response.json({ apolloEnabled: false, jobsEnabled: false, demo: true, count: results.length, results });
    }

    if (!Array.isArray(companies) || companies.length === 0) {
      return Response.json({ error: 'No companies provided.' }, { status: 400 });
    }
    const capped = companies.slice(0, 50);
    const enriched = await enrichCompanies(capped);

    const openings = await pMap(enriched, async (r) => {
      const nm = r.org?.name || r.input?.name;
      const o = await getOpenings(nm);
      return o?.count ?? null;
    }, 5);

    const results = enriched.map((r, i) => {
      const sc = scoreCompany(r.org, { openings: openings[i] });
      const q = qualify(signalsFromEnrichment(r.org));
      const rec = reconcileScore(sc.score, sc.band, q);
      return {
        name: r.org?.name || r.input.name || r.input.domain, domain: r.input.domain,
        employees: r.org?.employees ?? null, industry: r.org?.industry || '', state: r.org?.state || '',
        openings: openings[i], incumbent: sc.incumbent, partner: matchPartner(r.org),
        score: rec.score, band: rec.band, reasons: sc.reasons, org: r.org, error: r.error || null,
        qualification: q, qualPartial: true,
      };
    });

    results.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    return Response.json({ apolloEnabled: apolloEnabled(), jobsEnabled: jobsEnabled(), demo: false, count: results.length, results });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
