# PEO Targeting Agent

Feed it a list of payroll-only clients (or a single domain). It **enriches each company via Apollo, ranks the list by PEO-fit likelihood, and writes the payroll → PEO upsell brief on demand** — then learns from every logged outcome.

Stack: Next.js 14 · Anthropic API · Apollo.io API · Airtable (optional).

---

## The flow

1. **Target & Rank** — paste domains (one per line, or `Name, domain`) or upload a CSV. Each company is enriched via Apollo and scored 0-100 by a transparent heuristic (headcount band, industry fit, benefits-gap proxy, maturity). The list ranks highest-fit first, with the reasons shown.
2. Tap any row → a full brief: fit rationale, the **upsell angle**, illustrative savings, talking points, objection handling, comp/benefits hook.
3. Log the outcome (Won / Lost / what resonated). That's the training signal.
4. **Deals & Learning** shows win rate by fit band — i.e. whether the score actually predicts wins.

## How "learning" works (honest version)

Today: a transparent **heuristic** score (no labels yet, so weights are hand-set and visible in `lib/score.js`). The brief generator also folds in field learnings from past outcomes.

Once outcomes accumulate (realistically a few hundred): those become labeled examples to train a real **propensity model** (logistic regression / gradient boosting) that learns the feature weights from your actual conversions. The outcome capture here is the data pipeline that makes that possible. That is the real "learns why it was a good fit." It is not model fine-tuning, and you can't do it on day one.

## Signals used

- **Firmographics** (Apollo): headcount band, industry, founding year, revenue, location.
- **Incumbent vendor** (Apollo technographics): detects an existing PEO (TriNet/Insperity/Justworks) → displacement, Gusto/payroll → upsell, or none → greenfield. This sets the motion. It's an inferred signal, not ground truth.
- **Hiring velocity** (Adzuna): count of current open roles by company name — a growth/timing signal. Directional (matched by name), not exact.

**Intentionally excluded: LinkedIn gender demographics.** Scraping it violates LinkedIn ToS, the data is unreliable, and scoring sales targets on a protected characteristic is a real legal/discrimination liability — especially pitching a compliance-first HR company. The firmographic + hiring + incumbent signals are both legal and more predictive.

## Adzuna setup (hiring velocity)

Sign up at developer.adzuna.com (free tier) for an `app_id` and `app_key`; set `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`. Optional `ADZUNA_COUNTRY` (default `us`). Without these, hiring velocity is simply skipped and scored neutral.

## Run / deploy

```bash
npm install
cp .env.example .env.local   # paste your keys
npm run dev
```
Deploy: push to GitHub → import to Vercel → set env vars → deploy.

## Apollo setup

Create an API key in Apollo: Settings → Integrations → API. Set `APOLLO_API_KEY`. The app uses Bulk Organization Enrichment (`POST /organizations/bulk_enrich`, batches of 10). Enrichment consumes Apollo credits; runs are capped at 50 companies.

## Airtable setup (the learning loop)

Table named `Deals` with fields: `Company`, `Employees`, `State`, `Industry`, `CurrentSetup`, `FitScore` (Number), `FitLabel`, `Brief` (Long text), `Outcome`, `WhatWorked` (Long text), `Notes` (Long text). Create a scoped Personal Access Token → `AIRTABLE_API_KEY`; base id (`app...`) → `AIRTABLE_BASE_ID`. Without these the app runs but won't persist or learn.

## Files

- `app/page.js` — Target & Rank UI + brief panel + Deals dashboard.
- `app/api/score` — enrich (Apollo) + heuristic score + rank.
- `app/api/generate` — per-company brief, grounded ONLY in provided data.
- `app/api/feedback`, `app/api/deals` — outcome capture + stats.
- `lib/apollo.js` — Apollo client (batched, fails safe).
- `lib/score.js` — the heuristic scorer (tunable weights = future model features).
- `lib/store.js` — Airtable layer (swappable).

## Roadmap

- Job-postings enrichment for hiring-velocity signal.
- Trained propensity model once labeled outcomes exist.
- OpenClaw skill + heartbeat: nightly auto-scan the base, score, draft, deliver over Telegram.

## Share a live link (demo mode)

To send someone a working link they can explore without you wiring every integration:

1. Deploy to Vercel and set **only** `ANTHROPIC_API_KEY` (required for live briefs, emails, and the coach).
2. Set `DEMO_MODE=1`. The Target & Rank list, the channel-partner flags, and the Deals & Learning dashboard all populate with clearly-labeled **sample data**, while briefs / emails / coach run live on real AI.
3. Share the URL. Add `APOLLO_API_KEY`, `ADZUNA_*`, and `AIRTABLE_*` later to switch from sample data to live data.

Everything sample-sourced is labeled in the UI ("Demo data", "Sample for demonstration purposes").

## Channel partners

`lib/partners.js` is a sample channel-partner registry (brokers/CPAs with influenced-deal counts). The app flags when a prospect's advisor is a partner and suggests looping them in.

Honest note on data: Apollo does **not** reliably return a company's CPA or broker — that advisor relationship comes from your CRM/partner team. In production, feed `matchPartner()` from that data. The app also opportunistically detects a partner name if it appears in enrichment text, but the registry/CRM is the real source.
