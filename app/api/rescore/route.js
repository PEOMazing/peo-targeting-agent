import { scoreCompany } from '../../../lib/score';
import { qualify, signalsFromEnrichment } from '../../../lib/qualify';
import { matchPartner } from '../../../lib/partners';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };

export async function POST(req) {
  try {
    const b = await req.json();
    const base = b.baseOrg || {};
    const org = {
      ...base,
      name: b.name || base.name || '',
      domain: b.domain || base.domain || '',
      employees: b.employees === '' || b.employees == null ? base.employees ?? null : num(b.employees),
      industry: b.industry != null ? b.industry : base.industry || '',
      state: b.state != null ? b.state : base.state || '',
      foundedYear: b.foundedYear != null ? (num(b.foundedYear) ?? base.foundedYear) : base.foundedYear ?? null,
    };
    // Incumbent is a service relationship Apollo can't see — set it explicitly.
    if (b.incumbentVendor && b.incumbentVendor.trim()) {
      org.technologies = [b.incumbentVendor.trim(), ...((base.technologies || []).filter((t) => t))];
    }
    const openings = b.openings === '' || b.openings == null ? null : num(b.openings);
    const sc = scoreCompany(org, { openings });
    const qualification = qualify({ ...signalsFromEnrichment(org), employees: org.employees });

    const result = {
      name: org.name, domain: org.domain, employees: org.employees, industry: org.industry, state: org.state,
      openings, incumbent: sc.incumbent, partner: matchPartner(org),
      score: sc.score, band: sc.band, reasons: sc.reasons, org,
      qualification, summary: org.description || '', confidence: 'high', researched: true, source: 'manual',
    };
    return Response.json({ result });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
