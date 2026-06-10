import Anthropic from '@anthropic-ai/sdk';
import { scoreCompany } from '../../../lib/score';
import { qualify, signalsFromEnrichment, reconcileScore } from '../../../lib/qualify';
import { matchPartner } from '../../../lib/partners';
import { apolloEnabled, enrichCompanies, normalizeDomain } from '../../../lib/apollo';
import { getOpenings, jobsEnabled } from '../../../lib/jobs';

export const runtime = 'nodejs';
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const WEB_SEARCH = process.env.COACH_WEB_SEARCH !== '0';

const SYSTEM = `You research a company for a PEO (co-employment HR/payroll/benefits) sales team and return STRUCTURED SIGNALS used to qualify or disqualify it.

Use web search to find current facts. Use ONLY what you can verify; if something is unknown, use null (or false only when you have evidence it's false). NEVER fabricate numbers, funding, or HR details. If authoritative facts are provided (industry, location, founding year), treat those as ground truth. For EMPLOYEE COUNT: firmographic estimates often UNDERCOUNT distributed or field staff — property management with on-site teams, franchises, restaurants, construction crews, multi-location operators. Independently research the company's TRUE total headcount including on-site/field employees (use signals like number of locations/properties times typical staff per site, careers pages, news), and report your best estimate in "employees" with your "confidence".

Output ONLY valid JSON, no markdown, matching exactly:
{
  "name": "", "domain": "", "employees": <int|null>, "industry": "", "state": "<HQ state|>",
  "foundedYear": <int|null>,
  "multiState": <bool|null>, "remoteFirst": <bool|null>,
  "hiring": "none"|"some"|"heavy"|null, "openRoles": <int|null>,
  "recentFunding": <bool|null>, "fundingStage": "<e.g. Series A|null>",
  "hrTeamSize": <int|null>, "noHrTeam": <bool|null>, "founderLed": <bool|null>,
  "enterpriseHRIS": <bool|null>, "publiclyTraded": <bool|null>, "international": <bool|null>,
  "contractorHeavy": <bool|null>, "excludedIndustry": "<category|false>",
  "franchiseHeavy": <bool|null>, "prefersInHouse": <bool|null>, "financialRedFlags": <bool|null>,
  "complianceHeavyIndustry": <bool|null>, "professionalServices": <bool|null>,
  "technologies": ["..."],
  "summary": "<2-3 sentence plain-English research summary>",
  "confidence": "low"|"medium"|"high"
}`;

function extractText(content) {
  return (content || []).filter((x) => x.type === 'text').map((x) => x.text).join('').trim();
}

export async function POST(req) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'Missing ANTHROPIC_API_KEY environment variable.' }, { status: 500 });
    }
    const b = await req.json();
    const company = (b.company || '').toString().slice(0, 200);
    const domain = normalizeDomain((b.domain || '').toString());
    if (!company && !domain) return Response.json({ error: 'Enter a company name or domain.' }, { status: 400 });

    // 1) Authoritative firmographics from Apollo (accurate headcount/industry/location/tech).
    let apolloOrg = null;
    if (apolloEnabled() && domain) {
      try { const [r] = await enrichCompanies([{ name: company, domain }]); if (r?.org) apolloOrg = r.org; } catch {}
    }

    // 2) AI for the softer signals + summary. Feed it the Apollo facts as ground truth.
    const facts = apolloOrg
      ? `\n\nAUTHORITATIVE FACTS (ground truth — do not contradict): Industry: ${apolloOrg.industry || 'unknown'}; HQ State: ${apolloOrg.state || 'unknown'}; Founded: ${apolloOrg.foundedYear ?? 'unknown'}.\nFirmographic employee estimate (this often UNDERCOUNTS field/on-site staff — research the true total and report it in "employees"): ${apolloOrg.employees ?? 'unknown'}.`
      : '';
    const userPrompt = `Research this company and return the signals JSON:\nCompany: ${company || apolloOrg?.name || '(unknown)'}\nDomain/website: ${domain || '(unknown)'}${facts}\n\nFind the softer signals especially: recent funding, whether they have a dedicated HR team, multi-state/remote workforce, public/international status, and any disqualifying signals. Output ONLY the JSON.`;
    const tools = WEB_SEARCH ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }] : undefined;

    let text = '';
    try {
      const msg = await anthropic.messages.create({ model: MODEL, max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: userPrompt }], ...(tools ? { tools } : {}) });
      text = extractText(msg.content);
    } catch (e) {
      if (tools) { const msg = await anthropic.messages.create({ model: MODEL, max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: userPrompt }] }); text = extractText(msg.content); }
      else throw e;
    }

    const clean = text.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1').replace(/```json\s*/i, '').replace(/```/g, '').trim();
    let s = {};
    try { s = JSON.parse(clean); } catch { if (!apolloOrg) return Response.json({ error: 'Could not parse research. Try a domain, or connect Apollo for exact data.' }, { status: 502 }); }

    // 3) Build the org. Apollo wins on industry/location/tech; headcount is reconciled.
    const apolloEmp = apolloOrg && typeof apolloOrg.employees === 'number' ? apolloOrg.employees : null;
    const aiEmp = typeof s.employees === 'number' ? s.employees : null;
    let employees = apolloEmp;
    let employeesSource = apolloOrg ? 'apollo' : (aiEmp != null ? 'web' : null);
    let employeesAlt = null;
    if (apolloEmp != null && aiEmp != null) {
      employeesAlt = apolloEmp;
      if (aiEmp > apolloEmp) { employees = aiEmp; employeesSource = 'web (higher than Apollo)'; }
      else { employees = apolloEmp; employeesSource = 'apollo'; employeesAlt = aiEmp !== apolloEmp ? aiEmp : null; }
    } else if (apolloEmp == null && aiEmp != null) {
      employees = aiEmp; employeesSource = 'web';
    }

    const org = apolloOrg
      ? { ...apolloOrg, employees, description: apolloOrg.description || s.summary || '' }
      : {
          name: s.name || company, domain: s.domain || domain, employees,
          industry: s.industry || '', state: s.state || '', foundedYear: s.foundedYear || null,
          technologies: Array.isArray(s.technologies) ? s.technologies : [], keywords: [], description: s.summary || '',
        };

    let openings = typeof s.openRoles === 'number' ? s.openRoles : (s.hiring === 'heavy' ? 6 : s.hiring === 'some' ? 2 : null);
    if (apolloOrg && jobsEnabled()) { try { const o = await getOpenings(org.name); if (o?.count != null) openings = o.count; } catch {} }

    const sc = scoreCompany(org, { openings });
    const merged = { ...s, ...signalsFromEnrichment(org) };
    const qualification = qualify(merged);
    const rec = reconcileScore(sc.score, sc.band, qualification);

    const result = {
      name: org.name, domain: org.domain, employees: org.employees, industry: org.industry, state: org.state,
      openings, incumbent: sc.incumbent, partner: matchPartner(org),
      score: rec.score, band: rec.band, reasons: sc.reasons, org,
      qualification, summary: s.summary || org.description || '',
      confidence: apolloOrg ? 'high' : (s.confidence || 'medium'),
      researched: true, source: apolloOrg ? 'apollo' : 'ai',
      employeesSource, employeesAlt,
    };
    return Response.json({ result });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
