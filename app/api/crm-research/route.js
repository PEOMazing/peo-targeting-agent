// CRM account-research route for Vantage: Claude + Apollo MCP + web search.
// Key from Vercel env (ANTHROPIC_API_KEY). The prompt is built client-side and passed through.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json({ ok: false, message: "Research is not configured (ANTHROPIC_API_KEY missing in Vercel)." }, { status: 200 });
  }
  let input;
  try { input = await req.json(); } catch { return Response.json({ ok: false, message: "Bad request" }, { status: 400 }); }
  const prompt = (input && input.prompt || "").trim();
  if (!prompt) return Response.json({ ok: false, message: "Empty request" }, { status: 400 });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
        mcp_servers: [{ type: "url", url: "https://mcp.apollo.io/mcp", name: "apollo" }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return Response.json({ ok: false, message: "Research call failed (" + r.status + ").", detail: t.slice(0, 300) }, { status: 200 });
    }
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return Response.json({ ok: false, message: "No data returned — try again." }, { status: 200 });
    let parsed;
    try { parsed = JSON.parse(m[0]); } catch { return Response.json({ ok: false, message: "Could not parse research result." }, { status: 200 }); }
    return Response.json({ ok: true, result: parsed }, { status: 200 });
  } catch (e) {
    return Response.json({ ok: false, message: "Research is unavailable right now." }, { status: 200 });
  }
}
