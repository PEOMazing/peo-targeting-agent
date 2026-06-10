import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 45;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const WEB_SEARCH = process.env.COACH_WEB_SEARCH !== '0'; // on unless explicitly disabled

const BASE_SYSTEM = `You are a real-time sales coach for reps selling a PEO (co-employment HR, payroll, and benefits) solution to SMBs. Reps message you mid-call with objections or quick questions. Reply FAST and SHORT — 2-4 sentences or a few tight bullets, phrased so the rep can say it almost word-for-word. Practical, not theoretical. No preamble like "Great question."

GUARDRAILS (non-negotiable):
- Never fabricate savings numbers, statistics, or customer stories. Keep savings "illustrative" until formally quoted. Only cite a customer example if one is explicitly provided to you.
- Benefits network / provider coverage: you may name major hospitals, health systems, or providers in a market as general context, but NEVER claim a specific provider is "in our network" or covered. Tell the rep to verify network participation — coverage varies by plan and carrier.
- Don't disparage competitors; redirect to fit and value.
- If unsure, say so and suggest how the rep can find out.

When asked about a local market (top hospitals, major employers, providers in an area), use web search for current, accurate names, and present them as references to verify — not as in-network guarantees.`;

function buildSystem(ctx) {
  if (!ctx) return BASE_SYSTEM;
  const lines = [
    ctx.name ? `Current prospect: ${ctx.name}` : '',
    ctx.industry ? `Industry: ${ctx.industry}` : '',
    ctx.employees ? `Headcount: ${ctx.employees}` : '',
    ctx.state ? `State: ${ctx.state}` : '',
    ctx.motion ? `Motion: ${ctx.motion}${ctx.incumbent?.vendor ? ` (current: ${ctx.incumbent.vendor})` : ''}` : '',
    ctx.upsellAngle ? `Working angle: ${ctx.upsellAngle}` : '',
    Array.isArray(ctx.caseStudies) && ctx.caseStudies[0] ? `Approved proof point you MAY cite: ${ctx.caseStudies[0].summary}` : '',
  ].filter(Boolean);
  return `${BASE_SYSTEM}\n\nCONTEXT FOR THIS CALL (tailor your answers to it):\n${lines.join('\n')}`;
}

function extractText(content) {
  return (content || []).filter((x) => x.type === 'text').map((x) => x.text).join('').trim();
}

export async function POST(req) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'Missing ANTHROPIC_API_KEY environment variable.' }, { status: 500 });
    }
    const b = await req.json();
    const messages = (Array.isArray(b.messages) ? b.messages : [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    if (!messages.length) return Response.json({ error: 'No message.' }, { status: 400 });

    const system = buildSystem(b.context);
    const tools = WEB_SEARCH ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }] : undefined;

    let reply = '';
    try {
      const msg = await anthropic.messages.create({ model: MODEL, max_tokens: 900, system, messages, ...(tools ? { tools } : {}) });
      reply = extractText(msg.content);
    } catch (e) {
      // Web search may not be enabled on the account — retry once without tools.
      if (tools) {
        const msg = await anthropic.messages.create({ model: MODEL, max_tokens: 900, system, messages });
        reply = extractText(msg.content);
      } else {
        throw e;
      }
    }

    return Response.json({ reply: reply || 'Sorry — I couldn\'t generate a response. Try rephrasing.' });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
