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

async function callClaude(key, prompt, useApollo, maxTokens) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
    tools: [{ type: "web_search_20250305", name: "web_search" }],
  };
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
  };
  if (useApollo) {
    body.mcp_servers = [{ type: "url", url: "https://mcp.apollo.io/mcp", name: "apollo" }];
    headers["anthropic-beta"] = "mcp-client-2025-04-04";
  }
  return fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify(body) });
}

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ ok: false, message: "Research is not configured (ANTHROPIC_API_KEY missing in Vercel)." }, { status: 200 });

  let input;
  try { input = await req.json(); } catch { return Response.json({ ok: false, message: "Bad request" }, { status: 400 }); }
  const prompt = (input && input.prompt || "").trim();
  if (!prompt) return Response.json({ ok: false, message: "Empty request" }, { status: 400 });

  try {
    // Fast path: web-search-only (Apollo skipped unless explicitly enabled). Trimmed token budget.
    let r = await callClaude(key, prompt, USE_APOLLO, 1100);
    // Only fall back if Apollo was on AND failed.
    if (!r.ok && USE_APOLLO) r = await callClaude(key, prompt, false, 1100);
    if (!r.ok) {
      const t = await r.text();
      return Response.json({ ok: false, message: "Research call failed (" + r.status + ").", detail: t.slice(0, 400) }, { status: 200 });
    }
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return Response.json({ ok: false, message: "No data returned — try again." }, { status: 200 });
    let parsed;
    try { parsed = JSON.parse(m[0]); } catch { return Response.json({ ok: false, message: "Could not parse research result." }, { status: 200 }); }
    return Response.json({ ok: true, result: parsed }, { status: 200 });
  } catch (e) {
    return Response.json({ ok: false, message: "Research is unavailable right now.", detail: String(e).slice(0, 200) }, { status: 200 });
  }
}
