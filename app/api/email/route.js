import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 30;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

const SYSTEM = `You write B2B sales outreach for a PEO (Professional Employer Organization) sales team. Given a prospect and deal context, write a short first-touch email and a 3-step follow-up sequence.

Adapt tone and content to the MOTION:
- "Upsell to PEO": an existing payroll customer (often already on Gusto). Warm — "you already trust us for payroll, here's the natural step up." Reference the existing relationship.
- "Displacement": already on a competitor PEO. Respectful challenger — invite a re-evaluation at renewal on cost, service, and fit. Never disparage the incumbent; offer a comparison.
- "No incumbent": no PEO/HR platform detected. Educational — why a growing SMB like them benefits; create the need without pressure.

RULES:
- Each email under ~140 words, plain and human, ONE clear CTA (usually a brief call). Subject lines under ~7 words.
- No spammy clichés, no fabricated stats or savings figures, no false urgency.
- You MAY reference the approved proof point if one is provided; never invent any other customer story or number.
- Use only the facts provided; never invent specifics.
- Follow-up steps spaced over ~2 weeks (day 3, day 7, day 14), each with a DISTINCT purpose (e.g., value-add, angle/social proof, polite breakup).

Output ONLY valid JSON, no markdown:
{
  "initial": { "subject": "", "body": "" },
  "sequence": [
    { "day": 3, "purpose": "", "subject": "", "body": "" },
    { "day": 7, "purpose": "", "subject": "", "body": "" },
    { "day": 14, "purpose": "", "subject": "", "body": "" }
  ]
}`;

export async function POST(req) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'Missing ANTHROPIC_API_KEY environment variable.' }, { status: 500 });
    }
    const b = await req.json();
    const name = (b.name || 'the prospect').toString().slice(0, 200);
    const motion = (b.motion || 'Upsell to PEO').toString().slice(0, 60);
    const vendor = b.incumbent?.vendor || '';
    const industry = (b.industry || '').toString().slice(0, 120);
    const employees = (b.employees || '').toString().slice(0, 20);
    const state = (b.state || '').toString().slice(0, 60);
    const openings = typeof b.openings === 'number' ? b.openings : null;
    const angle = (b.upsellAngle || '').toString().slice(0, 800);
    const points = Array.isArray(b.talkingPoints) ? b.talkingPoints.slice(0, 6) : [];
    const proof = Array.isArray(b.caseStudies) && b.caseStudies[0] ? b.caseStudies[0].summary : '';

    const userPrompt = [
      `Prospect: ${name}`,
      `Motion: ${motion}${vendor ? ` (incumbent/current: ${vendor})` : ''}`,
      industry ? `Industry: ${industry}` : '',
      employees ? `Headcount: ${employees}` : '',
      state ? `State: ${state}` : '',
      openings != null ? `Hiring: ~${openings} open roles (growth signal only)` : '',
      angle ? `Core angle: ${angle}` : '',
      points.length ? `Talking points to draw from:\n- ${points.join('\n- ')}` : '',
      proof ? `Approved proof point you MAY cite (do not invent others): ${proof}` : '',
      `\nWrite the first-touch email and 3-step follow-up sequence as JSON.`,
    ].filter(Boolean).join('\n');

    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1600,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = (msg.content || []).filter((x) => x.type === 'text').map((x) => x.text).join('').trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    let data;
    try { data = JSON.parse(clean); }
    catch { return Response.json({ error: 'Model returned unparseable output. Try again.' }, { status: 502 }); }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
