// CRM account-research route for Vantage: Claude + web search, with optional Apollo MCP.
// Tries Apollo MCP first; if that errors (e.g. 400), retries without MCP so research still works.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({
    research: hasKey ? "configured" : "NOT configured",
    ANTHROPIC_API_KEY: hasKey ? "set" : "MISSING",
    note: hasKey ? "Research is on. Apollo MCP is attempted first, with a web-search-only fallback." : "Set ANTHROPIC_API_KEY in Vercel, then redeploy.",
  }, { status: 200 });
}

async function callClaude(key, prompt, useApollo) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
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
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers, body: JSON.stringify(body),
  });
  return r;
}

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ ok: false, message: "Research is not configured (ANTHROPIC_API_KEY missing in Vercel)." }, { status: 200 });

  let input;
  try { input = await req.json(); } catch { return Response.json({ ok: false, message: "Bad request" }, { status: 400 }); }
  const prompt = (input && input.prompt || "").trim();
  if (!prompt) return Response.json({ ok: false, message: "Empty request" }, { status: 400 });

  try {
    // Attempt 1: with Apollo MCP
    let r = await callClaude(key, prompt, true);
    // If Apollo MCP causes a failure, retry without it (web search still gives a useful brief)
    if (!r.ok) {
      r = await callClaude(key, prompt, false);
    }
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
