# Gabriel Revnew x Gusto — Deployment

Full candidate microsite plus two working tools (the Prospecting Agent and the Vantage CRM).
Both AI features need an API key in Vercel. Without it, the site still works; the research
buttons fall back to a clear "not configured" message.

## 1. Upload everything in this zip to the repo root
Includes app/ (with app/api/ and app/crm-tool/), public/, and the config files. Commit.

## 2. Add your API key in Vercel (required for live research)
Settings -> Environment Variables:
- ANTHROPIC_API_KEY = your Anthropic API key   (required)
- APOLLO_API_KEY = your Apollo key              (optional, enriches the Prospecting Agent)
Set for Production, then redeploy so the variables attach.

## 3. Test
- Gate -> GUSTOWINS -> letter -> tabs
- Prospecting Agent: My Day, plus live research
- Resources: download the competitive PDF
- CRM & Tools -> Open Vantage (/crm-tool): pipeline, account brief research, ROI engine, PDF packet

## Notes
- Vantage saves deals to the rep's browser (localStorage). Clearing the cache clears the deals.
- Keys live only in Vercel env vars, never in code. Keep the repo private.
- Password: GUSTOWINS (in app/page.jsx). Search engines told not to index.
