import Anthropic from '@anthropic-ai/sdk';
import { scoreCompany } from '../../../lib/score';
import { qualify } from '../../../lib/qualify';
import { matchPartner } from '../../../lib/partners';

export const runtime = 'nodejs';
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const WEB_SEARCH = process.env.COACH_WEB_SEARCH !== '0';

const SYSTEM = `You research a company for a PEO (co-employment HR/payroll/benefits) sales team and return STRUCTURED SIGNALS used to qualify or disqualify it.

Use web search to find current facts. Use ONLY what you can verify; if something is unknown, use null (or false only when you have evidence it's false). NEVER fabricate numbers, funding, or HR details.

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
    const domain = (b.domain || '').toString().slice(0, 200);
    if (!company && !domain) return Response.json({ error: 'Enter a company name or domain.' }, { status: 400 });

    const userPrompt = `Research this company and return the signals JSON:\nCompany: ${company || '(unknown)'}\nDomain/website: ${domain || '(unknown)'}\n\nFind: employee count, industry, HQ state, founding year, hiring activity & open roles, recent funding, whether they have a dedicated HR team, multi-state/remote workforce, HR tech stack, public/international status, and any disqualifying signals. Output ONLY the JSON.`;
    const tools = WEB_SEARCH ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }] : undefined;

    let text = '';
    try {
      const msg = await anthropic.messages.create({ model: MODEL, max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: userPrompt }], ...(tools ? { tools } : {}) });
      text = extractText(msg.content);
    } catch (e) {
      if (tools) {
        const msg = await anthropic.messages.create({ model: MODEL, max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: userPrompt }] });
        text = extractText(msg.content);
      } else throw e;
    }

    const clean = text.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1').replace(/```json\s*/i, '').replace(/```/g, '').trim();
    let s;
    try { s = JSON.parse(clean); }
    catch { return Response.json({ error: 'Could not parse research. Try a more specific name or add the domain.' }, { status: 502 }); }

    const org = {
      name: s.name || company, domain: s.domain || domain,
      employees: typeof s.employees === 'number' ? s.employees : null,
      industry: s.industry || '', state: s.state || '', foundedYear: s.foundedYear || null,
      technologies: Array.isArray(s.technologies) ? s.technologies : [],
      keywords: [], description: s.summary || '',
    };
    const openings = typeof s.openRoles === 'number' ? s.openRoles : (s.hiring === 'heavy' ? 6 : s.hiring === 'some' ? 2 : null);
    const sc = scoreCompany(org, { openings });
    const qualification = qualify(s);

    const result = {
      name: org.name, domain: org.domain, employees: org.employees, industry: org.industry, state: org.state,
      openings, incumbent: sc.incumbent, partner: matchPartner(org),
      score: sc.score, band: sc.band, reasons: sc.reasons, org,
      qualification, summary: s.summary || '', confidence: s.confidence || 'medium', researched: true,
    };
    return Response.json({ result });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
