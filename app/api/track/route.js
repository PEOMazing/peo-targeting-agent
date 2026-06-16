// View-tracking route: receives a session summary and emails it via Resend.
// Env: RESEND_API_KEY (required), TRACK_EMAIL_TO (your inbox), TRACK_EMAIL_FROM (optional verified sender).
export const runtime = "nodejs";

export async function GET() {
  // Health check: visit /api/track in a browser to see if tracking is configured.
  const hasKey = !!process.env.RESEND_API_KEY;
  const hasTo = !!process.env.TRACK_EMAIL_TO;
  const ready = hasKey && hasTo;
  return Response.json({
    tracking: ready ? "configured" : "NOT configured",
    RESEND_API_KEY: hasKey ? "set" : "MISSING",
    TRACK_EMAIL_TO: hasTo ? "set" : "MISSING",
    TRACK_EMAIL_FROM: process.env.TRACK_EMAIL_FROM ? "set (custom sender)" : "using default onboarding@resend.dev",
    note: ready
      ? "Tracking is on. If emails still don't arrive, check that TRACK_EMAIL_TO matches your Resend account email (the default sender can only email the account owner until you verify a domain)."
      : "Set the MISSING vars in Vercel, then redeploy.",
  }, { status: 200 });
}

export async function POST(req) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.TRACK_EMAIL_TO;
  // Fail silent-OK: never break the visitor's experience if tracking isn't configured.
  if (!key || !to) return Response.json({ ok: true, skipped: true }, { status: 200 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }

  const visitor = String(body.visitor || "anonymous").slice(0, 60);
  const event = String(body.event || "session").slice(0, 20);
  const tabs = Array.isArray(body.tabs) ? body.tabs.slice(0, 40) : [];
  const totalSec = Math.max(0, Math.round(Number(body.totalSec) || 0));
  const ua = String(body.ua || "").slice(0, 200);
  const ref = String(body.ref || "").slice(0, 200);
  const when = new Date().toLocaleString("en-US", { timeZone: "America/Denver" });

  const fmt = (s) => { s = Math.round(s); if (s < 60) return s + "s"; const m = Math.floor(s / 60); return m + "m " + (s % 60) + "s"; };
  const rows = tabs
    .filter((t) => t && t.label)
    .map((t) => `<tr><td style="padding:4px 12px 4px 0;">${String(t.label).slice(0,40)}</td><td style="padding:4px 0;text-align:right;font-variant-numeric:tabular-nums;">${fmt(t.sec)}</td></tr>`)
    .join("");

  const title = event === "open"
    ? `${visitor} just opened your Gusto site`
    : `${visitor} — session summary (${fmt(totalSec)})`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#232A35;max-width:520px;">
      <div style="background:#F45D48;color:#fff;padding:12px 16px;border-radius:8px 8px 0 0;font-weight:700;">${title}</div>
      <div style="border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px;padding:16px;">
        <p style="margin:0 0 4px;"><b>Visitor:</b> ${visitor}</p>
        <p style="margin:0 0 4px;"><b>When:</b> ${when} (MT)</p>
        <p style="margin:0 0 12px;"><b>Total time:</b> ${fmt(totalSec)}</p>
        ${rows ? `<table style="width:100%;border-collapse:collapse;font-size:14px;"><thead><tr><th style="text-align:left;border-bottom:1px solid #eee;padding-bottom:4px;">Section</th><th style="text-align:right;border-bottom:1px solid #eee;padding-bottom:4px;">Time</th></tr></thead><tbody>${rows}</tbody></table>` : '<p style="color:#888;">No section detail in this event.</p>'}
        <p style="margin:14px 0 0;font-size:11px;color:#999;">${ref ? "Referrer: " + ref + "<br>" : ""}${ua}</p>
      </div>
    </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.TRACK_EMAIL_FROM || "Site Tracking <onboarding@resend.dev>",
        to: [to],
        subject: title,
        html,
      }),
    });
    if (!r.ok) return Response.json({ ok: false }, { status: 200 });
    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json({ ok: false }, { status: 200 });
  }
}
