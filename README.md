# Gabriel Revnew x Gusto — Deployment

Candidate microsite + working tools (Vantage CRM with My Day prospecting). Some features need
keys in Vercel env. Without them the site still works; those features degrade gracefully.

## 1. Upload everything in this zip to the repo root, then commit.

## 2. Vercel env vars (Settings -> Environment Variables, set for Production)
- ANTHROPIC_API_KEY   (required for AI research in My Day / account briefs)
- APOLLO_API_KEY      (optional, enriches research firmographics)
- RESEND_API_KEY      (optional, turns on per-person view tracking emails)
- TRACK_EMAIL_TO      (your inbox, where view reports are sent)
- TRACK_EMAIL_FROM    (optional, a verified Resend sender; defaults to onboarding@resend.dev)
Redeploy after adding so they attach.

## 3. Per-person view tracking
Send each person their own link with a ?v= tag, e.g.
  https://your-site.vercel.app/?v=ritu
  https://your-site.vercel.app/?v=peter
When they unlock the site you get an email that they opened it, and a session summary
(which tabs, how long on each) when they leave. No name capture, no cookies — the name
comes only from the link you sent. If RESEND_API_KEY / TRACK_EMAIL_TO aren't set, tracking
is simply off and nothing breaks.

## 4. Test
- Gate -> GUSTOWINS -> letter -> tabs
- CRM & Tools -> My Day (scored prospects, Add all HOT, Add to Account List), pipeline, ROI, PDF
- Resources: download the competitive PDF
- Open ?v=test yourself and confirm you get the email

## Notes
- Vantage saves deals to the rep's browser (localStorage). Autosave is on; no Save button.
- Keys live only in Vercel env vars, never in code. Keep the repo private.
- Password: GUSTOWINS (in app/page.jsx). Search engines told not to index.
