# Gabriel Revnew x Gusto - Deployment (with live research)

This version includes a live PEO research engine on the Targeting Agent tab. It needs an
API key set in Vercel. Without the key, the site still works fully; the research box just
falls back to "enter details manually" and everything else is unaffected.

## 1. Upload the files
Replace the repo contents with everything in this zip (the `app` folder includes
`app/api/research/route.js`, which powers live research). Commit.

## 2. Add your API key in Vercel (required for live research)
Vercel dashboard -> your project -> Settings -> Environment Variables. Add:
- Name: ANTHROPIC_API_KEY   Value: your Anthropic API key
- (optional) Name: APOLLO_API_KEY   Value: your Apollo key (adds firmographics)
Set them for Production (and Preview if you want). Then redeploy (Deployments -> ... -> Redeploy)
so the new variables are picked up.

## 3. Test
- Gate -> GUSTOWINS -> letter -> 9 tabs
- Targeting Agent tab -> My Day top 10 -> type a company in Live Research -> "Research & score"
- If you see "MANUAL MODE", the key isn't set yet or the call failed; manual scoring still works.

## Notes
- Keys live ONLY in Vercel env vars, never in the code. Keep the repo private.
- Password: GUSTOWINS (in app/page.jsx). Search engines told not to index (robots: noindex).
