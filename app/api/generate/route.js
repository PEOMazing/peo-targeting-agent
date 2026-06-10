import Anthropic from '@anthropic-ai/sdk';
import { saveDeal, getLearnings, storeEnabled } from '../../../lib/store';
import { matchCaseStudies } from '../../../lib/casestudies';

export const runtime = 'nodejs';
export const maxDuration = 30;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

const SYSTEM = `You are a sales-enablement engine for a PEO (Professional Employer Organization) sales team selling into SMBs — including upselling payroll-only customers into a full PEO co-employment offering. Given a prospect, produce a concise, rep-ready deal brief.

You understand PEO economics: the billing unit is the worksite employee (WSE). Revenue comes from an admin fee (often PEPM — per employee per month — or a percentage of payroll) plus margin on benefits, workers' compensation, and payroll float. Co-employment gives small businesses access to large-group benefits rates, bundled workers' comp, and shared compliance burden. Strong fit: SMBs lacking in-house HR/benefits, wanting better benefits rates, in one or few states, growing, with a clean comp risk profile. Weaker fit: very large employers with mature HR, high-risk comp classes, or those wanting full carrier control.

CRITICAL HONESTY RULE: Use ONLY the facts provided. If a data point (hiring activity, attrition, exact headcount) is not given, do NOT invent it — either omit it or note it's unknown. Never fabricate statistics about the company. You may reference an APPROVED PROOF POINT only if one is provided below — never invent a customer name, company, or savings figure of your own.

Output ONLY valid JSON — no markdown, no code fences, no preamble — matching exactly:
{
  "fitScore": <integer 0-100>,
  "fitLabel": "Strong fit" | "Good fit" | "Moderate fit" | "Weak fit",
  "fitRationale": "<2-3 sentences grounded in the provided data>",
  "upsellAngle": "<2-3 sentences: the specific payroll-only -> PEO upsell angle for THIS company>",
  "projectedSavings": "<2-3 sentences, ILLUSTRATIVE range, state assumptions, explicitly an estimate not a quote>",
  "talkingPoints": ["<4-6 punchy, prospect-specific points>"],
  "objections": [{"objection": "<likely objection>", "response": "<crisp rep response>"}],
  "compBenefitsAngle": "<2-3 sentences on the workers' comp + benefits hook for THIS prospect>",
  "coaching": ["<3 short, deal-specific coaching tips for the rep — how to run THIS conversation well>"],
  "recommendedNextStep": "<one concrete next action>",
  "disclaimer": "Estimates are illustrative and not a binding quote."
}
Provide exactly 3 objections and exactly 3 coaching tips. Be specific. No generic filler. Tight enough to use live on a call.`;

export async function POST(req) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'Missing ANTHROPIC_API_KEY environment variable.' }, { status: 500 });
    }

    const b = await req.json();
    const enr = b.enrichment || null;
    const heuristicScore = typeof b.heuristicScore === 'number' ? b.heuristicScore : null;
    const incumbent = b.incumbent || null;
    const openings = typeof b.openings === 'number' ? b.openings : null;
    const partner = b.partner || null;

    const company = (b.company || enr?.name || 'Unnamed prospect').toString().slice(0, 200);
    const employees = (b.employees || enr?.employees || '').toString().slice(0, 20);
    const state = (b.state || enr?.state || '').toString().slice(0, 60);
    const industry = (b.industry || enr?.industry || '').toString().slice(0, 120);
    const current = (b.current || '').toString().slice(0, 120);
    const quote = (b.quote || '').toString().slice(0, 6000);

    let learnings = null;
    try { learnings = await getLearnings({ state, industry }); } catch { learnings = null; }

    const proof = matchCaseStudies({ industry, state, employees: Number(employees) || null });
    let proofBlock = '';
    if (proof.length) {
      proofBlock = `\nAPPROVED PROOF POINT (you MAY reference this as an example; do NOT invent any other customer story or figure):\n- ${proof[0].summary}\n`;
    }

    let learningsNote = '';
    if (learnings && learnings.stats && learnings.stats.decided > 0) {
      const s = learnings.stats;
      learningsNote =
        `\n\nFIELD LEARNINGS (from this team's past deals — sharpen the brief, don't force):\n` +
        `- Overall win rate: ${s.winRate}% across ${s.decided} decided deals.\n` +
        (learnings.matchCount ? `- ${learnings.matchCount} comparable past deal(s) by state/industry.\n` : '') +
        (learnings.topWorked?.length ? `- Angles that have closed most often: ${learnings.topWorked.join('; ')}.\n` : '');
    }

    let enrichBlock = '';
    if (enr) {
      enrichBlock =
        `\nVERIFIED ENRICHMENT (Apollo — treat as the only known facts):\n` +
        `- Name: ${enr.name || 'unknown'}\n` +
        `- Domain: ${enr.domain || 'unknown'}\n` +
        `- Employees: ${enr.employees ?? 'unknown'}\n` +
        `- Industry: ${enr.industry || 'unknown'}\n` +
        `- HQ: ${[enr.city, enr.state, enr.country].filter(Boolean).join(', ') || 'unknown'}\n` +
        `- Revenue: ${enr.revenue || 'unknown'}\n` +
        `- Founded: ${enr.foundedYear || 'unknown'}\n` +
        (enr.keywords?.length ? `- Keywords: ${enr.keywords.join(', ')}\n` : '') +
        (enr.technologies?.length ? `- Tech detected: ${enr.technologies.slice(0, 15).join(', ')}\n` : '') +
        (enr.description ? `- Description: ${enr.description.slice(0, 400)}\n` : '') +
        (incumbent ? `- Incumbent HR/payroll vendor: ${incumbent.vendor || incumbent.category} (suggested motion: ${incumbent.motion}). Frame the brief around this motion — upsell, displacement, or no-incumbent (fresh PEO sale).\n` : '') +
        (openings != null ? `- Open roles (hiring velocity): ~${openings}. Use this only as a growth/timing signal; do not invent specific roles.\n` : '') +
        (partner ? `- Channel partner: their advisor "${partner.name}" (${partner.type}) is a ${partner.tier} channel partner who has influenced ${partner.influencedDeals} deals. Suggest looping in this partner as a warm path in; reference the existing relationship, do not overstate it.\n` : '') +
        (heuristicScore != null ? `\nThe team's targeting model scored this account ${heuristicScore}/100 for PEO fit. Reflect that in fitScore unless the data clearly says otherwise.\n` : '');
    }

    const userPrompt = [
      `Prospect: ${company}`,
      `Headcount (WSEs): ${employees || 'unknown'}`,
      `Primary state(s): ${state || 'unknown'}`,
      `Industry: ${industry || 'unknown'}`,
      `Current setup: ${current || 'payroll-only / unknown'}`,
      enrichBlock,
      proofBlock,
      quote ? `\nPasted competitor PEO quote (normalize and reference):\n"""\n${quote}\n"""` : '',
      learningsNote,
      `\nGenerate the rep-ready PEO deal brief as JSON.`,
    ].join('\n');

    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1300,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = (msg.content || []).filter((x) => x.type === 'text').map((x) => x.text).join('').trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    let data;
    try {
      data = JSON.parse(clean);
    } catch {
      return Response.json({ error: 'Model returned unparseable output. Try again.', raw: clean.slice(0, 500) }, { status: 502 });
    }

    // The heuristic (targeting) score is the one we rank and learn against.
    if (heuristicScore != null) data.fitScore = heuristicScore;
    data.caseStudies = proof;

    let recordId = null;
    try {
      recordId = await saveDeal({ inputs: { company, employees, state, industry, current }, brief: data });
    } catch { recordId = null; }

    data._recordId = recordId;
    data._stored = storeEnabled();
    data._usedLearnings = !!learningsNote;
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
