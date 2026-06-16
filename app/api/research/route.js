// Live PEO research route: Apollo firmographics + Claude (web search) reconciliation + scoring.
// Keys come from Vercel env vars. ANTHROPIC_API_KEY required; APOLLO_API_KEY optional.
export const runtime = "nodejs";
export const maxDuration = 60;

const SIGNAL_LIBRARY = [
  { id: "benefits_q", label: "Asked about benefits / health coverage", pts: 25 },
  { id: "renewal", label: "Benefits or comp renewal in ~90 days", pts: 20 },
  { id: "new_state", label: "Just registered in a new state", pts: 18 },
  { id: "sweet_spot", label: "Headcount in the 10-49 sweet spot", pts: 15 },
  { id: "hourly", label: "Hourly / blue-collar workforce (EWA + comp fit)", pts: 15 },
  { id: "crossed_25", label: "Recently crossed 25 employees", pts: 12 },
  { id: "lost_candidate", label: "Lost a hire over benefits", pts: 20 },
  { id: "comp_claims", label: "Workers' comp mod climbing / claims rising", pts: 15 },
  { id: "multistate", label: "Already multi-state", pts: 10 },
  { id: "growth", label: "Hiring / growing fast", pts: 10 },
  { id: "partner", label: "Accountant-partner referral", pts: 18 },
  { id: "no_health", label: "Offers no group health today", pts: 8 },
];

async function apolloLookup(domain, name) {
  const key = process.env.APOLLO_API_KEY;
  if (!key) return null;
  try {
    const body = domain ? { domain } : { q_organization_name: name };
    const r = await fetch("https://api.apollo.io/v1/organizations/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", "X-Api-Key": key },
      body: JSON.stringify(body),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const o = j.organization || null;
    if (!o) return null;
    return {
      employees: typeof o.estimated_num_employees === "number" ? o.estimated_num_employees : null,
      industry: o.industry || null,
      state: o.state || null,
      foundedYear: o.founded_year || null,
      website: o.website_url || null,
    };
  } catch { return null; }
}

export async function POST(req) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return Response.json({ ok: false, reason: "no_key", message: "Live research is not configured (ANTHROPIC_API_KEY missing). Enter details manually." }, { status: 200 });
  }
  let input;
  try { input = await req.json(); } catch { return Response.json({ ok: false, reason: "bad_request" }, { status: 400 }); }
  const company = (input?.company || "").trim();
  const domain = (input?.domain || "").trim();
  if (!company && !domain) return Response.json({ ok: false, reason: "empty" }, { status: 400 });

  const apollo = await apolloLookup(domain, company);

  const facts = apollo
    ? `\n\nAUTHORITATIVE FIRMOGRAPHIC FACTS (treat industry/state/founded as ground truth; the employee figure often UNDERCOUNTS field/on-site staff so verify it independently):\n- Firmographic employee estimate: ${apollo.employees ?? "unknown"}\n- Industry: ${apollo.industry || "unknown"}\n- HQ State: ${apollo.state || "unknown"}\n- Founded: ${apollo.foundedYear ?? "unknown"}`
    : "";

  const sys = `You are a PEO sales research analyst. Research the company below using web search and return ONLY a JSON object, no prose, no markdown fences.

Use web search to find current facts. Use ONLY what you can verify; if unknown, use null. NEVER fabricate numbers, funding, or HR details. If authoritative facts are provided, treat industry/location/founding as ground truth.

For EMPLOYEE COUNT: firmographic estimates often UNDERCOUNT distributed or field staff (property management, franchises, restaurants, construction crews, multi-location operators). Independently research TRUE total headcount including on-site/field employees (locations x typical staff per site, careers pages, news) and report your best estimate.

Determine which of these PEO-propensity SIGNALS are TRUE for this company based on what you find. Signal IDs and meaning:
- new_state: expanded to a new state recently
- sweet_spot: total headcount is roughly 10-49
- hourly: workforce is substantially hourly/blue-collar (construction, trades, logistics, restaurants, healthcare staffing, field services)
- crossed_25: recently grew past ~25 employees
- multistate: operates in more than one state
- growth: actively hiring or growing fast
- no_health: appears to offer no group health benefits
Only include a signal ID if you have a real basis for it. Do not guess benefits_q, renewal, lost_candidate, comp_claims, or partner — those are internal CRM signals you cannot observe, so never return them.

Return exactly this shape:
{"employees": <number|null>, "employeesConfidence": "<low|medium|high>", "industry": "<string|null>", "states": "<comma-separated abbreviations|null>", "summary": "<one sentence, plain, on what they do and why PEO-relevant>", "signals": ["<signal_id>", ...]}`;

  const userMsg = `Company: ${company || domain}${domain ? `\nDomain: ${domain}` : ""}${facts}`;

  let ai;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: sys,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return Response.json({ ok: false, reason: "anthropic_error", message: "Live research call failed. Enter details manually.", detail: t.slice(0, 300) }, { status: 200 });
    }
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const m = clean.match(/\{[\s\S]*\}/);
    ai = m ? JSON.parse(m[0]) : null;
  } catch (e) {
    return Response.json({ ok: false, reason: "exception", message: "Live research is unavailable right now. Enter details manually." }, { status: 200 });
  }
  if (!ai) return Response.json({ ok: false, reason: "parse", message: "Could not read the research result. Enter details manually." }, { status: 200 });

  // Reconcile headcount: prefer the higher, better-sourced number, show both.
  const apolloEmp = apollo && typeof apollo.employees === "number" ? apollo.employees : null;
  const aiEmp = typeof ai.employees === "number" ? ai.employees : null;
  let employees = aiEmp ?? apolloEmp;
  let employeesAlt = null;
  let employeesSource = aiEmp != null ? "web research" : (apolloEmp != null ? "apollo" : null);
  if (apolloEmp != null && aiEmp != null) {
    if (aiEmp >= apolloEmp) { employees = aiEmp; employeesSource = "web research"; employeesAlt = apolloEmp; }
    else { employees = apolloEmp; employeesSource = "apollo"; employeesAlt = aiEmp; }
  }

  // Derive observable signals from reconciled facts (don't trust the model to do math).
  const states = ai.states || (apollo && apollo.state) || null;
  const stateCount = states ? states.split(",").map((s) => s.trim()).filter(Boolean).length : 0;
  let signals = Array.isArray(ai.signals) ? ai.signals.filter((id) => SIGNAL_LIBRARY.some((s) => s.id === id)) : [];
  const add = (id) => { if (!signals.includes(id)) signals.push(id); };
  const rm = (id) => { signals = signals.filter((s) => s !== id); };
  if (employees != null) {
    if (employees >= 10 && employees <= 49) add("sweet_spot"); else rm("sweet_spot");
  }
  if (stateCount >= 2) add("multistate");
  // never allow unobservable CRM signals from research
  ["benefits_q", "renewal", "lost_candidate", "comp_claims", "partner"].forEach(rm);

  const pts = signals.reduce((s, id) => s + (SIGNAL_LIBRARY.find((x) => x.id === id)?.pts || 0), 0);
  const score = Math.min(99, 25 + pts);

  return Response.json({
    ok: true,
    company: company || domain,
    employees, employeesAlt, employeesSource,
    employeesConfidence: ai.employeesConfidence || "low",
    industry: ai.industry || (apollo && apollo.industry) || null,
    states,
    summary: ai.summary || null,
    signals, score,
    apolloUsed: !!apollo,
  }, { status: 200 });
}
