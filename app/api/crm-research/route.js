// CRM account-research route for Vantage: Claude + web search.
// Apollo MCP is OFF by default (it was failing and doubling latency). Flip USE_APOLLO to true
// only once the Apollo MCP connector is actually authorized for your API key.
export const runtime = "nodejs";
export const maxDuration = 60;

const USE_APOLLO = process.env.APOLLO_MCP === "on"; // opt-in; off = fast path

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({
    research: hasKey ? "configured" : "NOT configured",
    ANTHROPIC_API_KEY: hasKey ? "set" : "MISSING",
    apollo_mcp: USE_APOLLO ? "on" : "off (fast web-search path)",
    note: hasKey ? "Research is on." : "Set ANTHROPIC_API_KEY in Vercel, then redeploy.",
  }, { status: 200 });
}

async function callClaude(key, prompt, useApollo, maxTokens, useWebSearch) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  };
  // Fast path sends no tools at all (pure model knowledge, ~3-6s).
  if (useWebSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }];
  }
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
  };
  if (useApollo) {
    body.mcp_servers = [{ type: "url", url: "https://mcp.apollo.io/mcp", name: "apollo" }];
    headers["anthropic-beta"] = "mcp-client-2025-04-04";
  }
  // Abort before Vercel's wall so we return a clean message instead of a hung timeout.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), useWebSearch ? 55000 : 20000);
  try {
    return await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify(body), signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ ok: false, message: "Research is not configured (ANTHROPIC_API_KEY missing in Vercel)." }, { status: 200 });

  let input;
  try { input = await req.json(); } catch { return Response.json({ ok: false, message: "Bad request" }, { status: 400 }); }
  const prompt = (input && input.prompt || "").trim();
  if (!prompt) return Response.json({ ok: false, message: "Empty request" }, { status: 400 });
  const deep = !!(input && input.deep); // deep = use web search (slower, more specific)

  try {
    // Fast path (default): no web search, pure model knowledge, ~3-6s.
    // Deep path: web search enabled (capped), up to ~1 min.
    let r = await callClaude(key, prompt, deep, deep ? 1400 : 1100, deep);
    if (!r.ok) {
      const t = await r.text();
      return Response.json({ ok: false, message: "Research call failed (" + r.status + ").", detail: t.slice(0, 400) }, { status: 200 });
    }
    const data = await r.json();
    let text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    // Robust JSON extraction: strip markdown fences, then try the largest {...} block.
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed = null;
    // strategy 1: first { to last } (greedy)
    const greedy = text.match(/\{[\s\S]*\}/);
    if (greedy) { try { parsed = JSON.parse(greedy[0]); } catch {} }
    // strategy 2: if that failed, the whole trimmed text might already be JSON
    if (!parsed) { try { parsed = JSON.parse(text); } catch {} }
    // strategy 3: find a balanced object by scanning braces
    if (!parsed) {
      const start = text.indexOf("{");
      if (start >= 0) {
        let depth = 0, end = -1;
        for (let i = start; i < text.length; i++) {
          if (text[i] === "{") depth++;
          else if (text[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
        }
        if (end > start) { try { parsed = JSON.parse(text.slice(start, end + 1)); } catch {} }
      }
    }
    if (!parsed) return Response.json({ ok: false, message: "No data returned — try again." }, { status: 200 });
    return Response.json({ ok: true, result: parsed }, { status: 200 });
  } catch (e) {
    const msg = (e && e.name === "AbortError")
      ? "Research took too long and timed out. Try again — it usually works on the second attempt."
      : "Research is unavailable right now.";
    return Response.json({ ok: false, message: msg, detail: String(e).slice(0, 200) }, { status: 200 });
  }
}
