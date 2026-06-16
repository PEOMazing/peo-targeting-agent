// CRM account-research route for Vantage.
// Fast path: Claude Haiku (2x+ faster), no web search, streamed. Deep path: Sonnet + web search.
// Streaming keeps the connection alive so we never hit the function timeout wall mid-generation.
export const runtime = "nodejs";
export const maxDuration = 60;

const USE_APOLLO = process.env.APOLLO_MCP === "on";
const FAST_MODEL = "claude-haiku-4-5-20251001";
const DEEP_MODEL = "claude-sonnet-4-6";

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({
    research: hasKey ? "configured" : "NOT configured",
    ANTHROPIC_API_KEY: hasKey ? "set" : "MISSING",
    fast_model: FAST_MODEL,
    deep_model: DEEP_MODEL,
    apollo_mcp: USE_APOLLO ? "on" : "off",
    note: hasKey ? "Research is on. Fast path uses Haiku + streaming." : "Set ANTHROPIC_API_KEY in Vercel, then redeploy.",
  }, { status: 200 });
}

async function streamClaude(key, prompt, deep, maxTokens) {
  const body = {
    model: deep ? DEEP_MODEL : FAST_MODEL,
    max_tokens: maxTokens,
    stream: true,
    messages: [{ role: "user", content: prompt }],
  };
  if (deep) {
    body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }];
    if (USE_APOLLO) body.mcp_servers = [{ type: "url", url: "https://mcp.apollo.io/mcp", name: "apollo" }];
  }
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
  };
  if (deep && USE_APOLLO) headers["anthropic-beta"] = "mcp-client-2025-04-04";

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), deep ? 58000 : 30000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers, body: JSON.stringify(body), signal: ctrl.signal,
    });
    if (!r.ok) { const errText = await r.text(); return { ok: false, status: r.status, detail: errText.slice(0, 400) }; }

    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buf = "", text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        const s = line.trim();
        if (!s.startsWith("data:")) continue;
        const payload = s.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "content_block_delta" && evt.delta && evt.delta.type === "text_delta") {
            text += evt.delta.text;
          }
        } catch {}
      }
    }
    return { ok: true, text };
  } catch (e) {
    return { ok: false, aborted: e && e.name === "AbortError", detail: String(e).slice(0, 200) };
  } finally {
    clearTimeout(timer);
  }
}

function parseBrief(text) {
  text = (text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  let parsed = null;
  const greedy = text.match(/\{[\s\S]*\}/);
  if (greedy) { try { parsed = JSON.parse(greedy[0]); } catch {} }
  if (!parsed) { try { parsed = JSON.parse(text); } catch {} }
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
  return parsed;
}

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ ok: false, message: "Research is not configured (ANTHROPIC_API_KEY missing in Vercel)." }, { status: 200 });

  let input;
  try { input = await req.json(); } catch { return Response.json({ ok: false, message: "Bad request" }, { status: 400 }); }
  const prompt = (input && input.prompt || "").trim();
  if (!prompt) return Response.json({ ok: false, message: "Empty request" }, { status: 400 });
  const deep = !!(input && input.deep);

  const t0 = Date.now();
  const res = await streamClaude(key, prompt, deep, deep ? 1400 : 900);
  const elapsed = Date.now() - t0;

  if (!res.ok) {
    const msg = res.aborted
      ? "Research timed out. Try again — it usually works on the second attempt."
      : "Research call failed" + (res.status ? " (" + res.status + ")." : ".");
    return Response.json({ ok: false, message: msg, detail: res.detail, elapsed }, { status: 200 });
  }
  const parsed = parseBrief(res.text);
  if (!parsed) return Response.json({ ok: false, message: "No data returned — try again.", elapsed }, { status: 200 });
  return Response.json({ ok: true, result: parsed, elapsed }, { status: 200 });
}
