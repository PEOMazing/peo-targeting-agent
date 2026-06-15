// Invoice extraction: accepts a base64 PDF or image of a carrier invoice / benefit summary,
// returns per-tier monthly medical rates so the rep can pre-fill the comparison.
export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6"; // vision/document reading benefits from the stronger model

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({
    extract: hasKey ? "configured" : "NOT configured",
    ANTHROPIC_API_KEY: hasKey ? "set" : "MISSING",
    accepts: "base64 PDF or image (png/jpg)",
  }, { status: 200 });
}

const PROMPT = `You are reading a health-insurance carrier invoice or benefit summary for a small business. Extract the CURRENT monthly premium rate for each enrollment tier. Tiers map to these keys:
- eeOnly = "Employee Only" / "EE" / "Single"
- eeSpouse = "Employee + Spouse" / "EE+SP" / "Two-party (spouse)"
- eeChild = "Employee + Child(ren)" / "EE+CH" / "Parent + child"
- family = "Family" / "EE+Family"
Return ONLY minified JSON, no prose, no markdown, of exactly this shape:
{"planName":"<carrier/plan name if visible, else ''>","rates":{"eeOnly":<monthly $ number or null>,"eeSpouse":<number or null>,"eeChild":<number or null>,"family":<number or null>},"confidence":"high|medium|low","note":"<one short line on what you saw or couldn't find>"}
If the document shows total monthly cost per tier rather than per-employee rate, return the per-employee monthly rate (total divided by the number enrolled in that tier if shown; otherwise the listed rate). If a tier isn't present, use null. Never guess wildly; if unsure, lower the confidence.`;

export async function POST(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ ok: false, message: "Extraction is not configured (ANTHROPIC_API_KEY missing in Vercel)." }, { status: 200 });

  let input;
  try { input = await req.json(); } catch { return Response.json({ ok: false, message: "Bad request" }, { status: 400 }); }
  const data = input && input.data;        // base64 (no data: prefix)
  const mediaType = input && input.mediaType; // e.g. application/pdf, image/png
  if (!data || !mediaType) return Response.json({ ok: false, message: "No file provided." }, { status: 400 });

  // Build the content block: PDF -> document, image -> image
  const isPdf = mediaType === "application/pdf";
  const fileBlock = isPdf
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data } }
    : { type: "image", source: { type: "base64", media_type: mediaType, data } };

  const body = {
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: "user", content: [fileBlock, { type: "text", text: PROMPT }] }],
  };
  const headers = { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 55000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify(body), signal: ctrl.signal });
    if (!r.ok) { const t = await r.text(); return Response.json({ ok: false, message: "Extraction failed (" + r.status + ").", detail: t.slice(0, 300) }, { status: 200 }); }
    const out = await r.json();
    let text = (out.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    let parsed = null;
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { parsed = JSON.parse(m[0]); } catch {} }
    if (!parsed) { try { parsed = JSON.parse(text); } catch {} }
    if (!parsed) return Response.json({ ok: false, message: "Could not read rates from that file. Enter them by hand." }, { status: 200 });
    return Response.json({ ok: true, result: parsed }, { status: 200 });
  } catch (e) {
    const msg = (e && e.name === "AbortError") ? "Reading the file took too long. Try again or enter rates by hand." : "Extraction unavailable right now.";
    return Response.json({ ok: false, message: msg }, { status: 200 });
  } finally {
    clearTimeout(timer);
  }
}
