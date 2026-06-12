"use client";

import React, { useState } from "react";

/* ============================================================
   GABE × GUSTO — HEAD OF PEO SALES
   Interview microsite: background, PEO Targeting Agent,
   certification course, landscape, SWOT, success keys, 90-day plan.
   Gusto-branded: guava (#F45D48), warm cream, DM Sans.
   ============================================================ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root {
  --bg: #FFF9F3;
  --surface: #FFFFFF;
  --ink: #232A35;
  --ink-soft: #5B6573;
  --rule: #EDE2D6;
  --guava: #F45D48;
  --guava-deep: #D9402B;
  --guava-soft: #FDEAE6;
  --green: #0A8754;
  --green-soft: #E4F3EC;
  --error: #B3422E;
  --error-soft: #F7E6E1;
  --gold: #B07C2B;
}
* { box-sizing: border-box; }
.peo-app {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  padding: 0 0 72px 0;
}
.shell { max-width: 920px; margin: 0 auto; padding: 0 20px; }
.serif { font-family: 'DM Sans', sans-serif; font-weight: 800; letter-spacing: -0.01em; }
.mono { font-family: 'IBM Plex Mono', monospace; }

.topbar { background: var(--surface); border-bottom: 1px solid var(--rule); padding: 14px 0 0; position: sticky; top: 0; z-index: 20; }
.topbar-inner { max-width: 920px; margin: 0 auto; padding: 0 20px; }
.brandline { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.wordmark { font-weight: 800; font-size: 19px; letter-spacing: -0.01em; }
.wordmark .x { color: var(--guava); }
.eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); }

.tabbar { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
.tabbar::-webkit-scrollbar { display: none; }
.tab {
  border: none; background: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
  color: var(--ink-soft); padding: 10px 13px 12px; white-space: nowrap;
  border-bottom: 3px solid transparent;
}
.tab:hover { color: var(--ink); }
.tab.active { color: var(--ink); font-weight: 700; border-bottom-color: var(--guava); }
.tab:focus-visible { outline: 2px solid var(--guava); outline-offset: -2px; }

.hero { padding: 36px 0 24px; }
.hero h1 { font-weight: 800; font-size: clamp(30px, 5vw, 46px); line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 14px; }
.hero h1 .hl { color: var(--guava); }
.hero p.lede { color: var(--ink-soft); max-width: 62ch; margin: 0 0 18px; font-size: 16px; line-height: 1.6; }

.card { background: var(--surface); border: 1px solid var(--rule); border-radius: 14px; padding: 28px clamp(18px, 4vw, 34px); }
.card h2 { font-weight: 800; font-size: 25px; letter-spacing: -0.01em; margin: 0 0 4px; }
.card h3 { font-size: 16px; font-weight: 700; margin: 26px 0 8px; }
.card p { font-size: 14.5px; line-height: 1.65; margin: 0 0 12px; }
.card ul { margin: 0 0 14px; padding-left: 20px; }
.card li { font-size: 14.5px; line-height: 1.6; margin-bottom: 7px; }
.kicker { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--guava); margin-bottom: 8px; }
.section-gap { margin-top: 16px; }

.callout { border-left: 3px solid var(--guava); background: var(--guava-soft); border-radius: 0 10px 10px 0; padding: 13px 16px; margin: 16px 0; font-size: 14px; line-height: 1.6; }
.callout .tag { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .12em; color: var(--guava-deep); display: block; margin-bottom: 4px; }

.ledger-table { width: 100%; border-collapse: collapse; margin: 14px 0 18px; font-size: 13.5px; }
.ledger-table th { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-soft); text-align: left; padding: 8px 10px; border-bottom: 2px solid var(--ink); }
.ledger-table td { padding: 9px 10px; border-bottom: 1px solid var(--rule); vertical-align: top; line-height: 1.5; }
.ledger-table td:first-child { font-weight: 700; white-space: nowrap; }

.ledger-row {
  display: flex; align-items: center; gap: 14px; background: var(--surface);
  border: 1px solid var(--rule); border-radius: 12px; padding: 16px 18px;
  margin-bottom: 10px; cursor: pointer; transition: border-color .15s, transform .15s;
  text-align: left; width: 100%; font-family: 'DM Sans', sans-serif; color: var(--ink);
}
.ledger-row:hover { border-color: var(--guava); transform: translateX(2px); }
.ledger-row:focus-visible { outline: 2px solid var(--guava); outline-offset: 2px; }
.row-num { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); width: 34px; flex-shrink: 0; }
.row-main { flex: 1; min-width: 0; }
.row-title { font-weight: 700; font-size: 16px; margin: 0 0 2px; }
.row-sub { color: var(--ink-soft); font-size: 13px; margin: 0; }
.row-status { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .08em; flex-shrink: 0; }

.seal {
  display: inline-flex; align-items: center; justify-content: center;
  width: 58px; height: 58px; border-radius: 50%;
  border: 2px solid var(--green);
  box-shadow: inset 0 0 0 2px var(--surface), inset 0 0 0 3.5px var(--green);
  color: var(--green); font-family: 'IBM Plex Mono', monospace; font-size: 8.5px;
  font-weight: 600; letter-spacing: .1em; text-align: center; line-height: 1.25;
  transform: rotate(-8deg); flex-shrink: 0; background: var(--green-soft);
}
.seal.big { width: 120px; height: 120px; font-size: 13px; border-width: 3px;
  box-shadow: inset 0 0 0 4px var(--surface), inset 0 0 0 6px var(--green);
  animation: stampIn .45s cubic-bezier(.2,1.6,.4,1) both; }
@keyframes stampIn {
  0% { transform: rotate(-8deg) scale(2.2); opacity: 0; }
  60% { transform: rotate(-8deg) scale(.92); opacity: 1; }
  100% { transform: rotate(-8deg) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .seal.big { animation: none; }
  .ledger-row, .ledger-row:hover { transition: none; transform: none; }
}

.progress-strip { display: flex; gap: 6px; margin: 18px 0 26px; }
.progress-cell { flex: 1; height: 8px; border-radius: 4px; background: var(--rule); }
.progress-cell.done { background: var(--green); }
.progress-cell.partial { background: var(--guava); }

.crumb { background: none; border: none; color: var(--guava-deep); font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .06em; cursor: pointer; padding: 0; margin: 18px 0 14px; }
.crumb:hover { text-decoration: underline; }

.lesson-nav { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
.lesson-pill { border: 1px solid var(--rule); background: var(--surface); border-radius: 999px; padding: 6px 13px; font-size: 12.5px; cursor: pointer; color: var(--ink-soft); font-family: 'DM Sans', sans-serif; }
.lesson-pill.active { border-color: var(--ink); color: var(--ink); font-weight: 700; }
.lesson-pill.done { border-color: var(--green); color: var(--green); }
.lesson-pill.quiz { border-style: dashed; }

.btn { border: none; border-radius: 999px; padding: 11px 22px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.btn.primary { background: var(--guava); color: #fff; }
.btn.primary:hover { background: var(--guava-deep); }
.btn.ghost { background: none; border: 1.5px solid var(--rule); color: var(--ink); }
.btn.ghost:hover { border-color: var(--ink); }
.btn:focus-visible { outline: 2px solid var(--guava); outline-offset: 2px; }
.btn-row { display: flex; justify-content: space-between; gap: 10px; margin-top: 28px; flex-wrap: wrap; }

.q-count { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); letter-spacing: .08em; margin-bottom: 10px; }
.q-text { font-weight: 800; font-size: 21px; line-height: 1.35; letter-spacing: -0.01em; margin: 0 0 20px; }
.opt { display: block; width: 100%; text-align: left; border: 1px solid var(--rule); background: var(--surface); border-radius: 10px; padding: 13px 16px; margin-bottom: 9px; font-size: 14.5px; line-height: 1.5; cursor: pointer; font-family: 'DM Sans', sans-serif; color: var(--ink); transition: border-color .12s; }
.opt:hover:not(:disabled) { border-color: var(--guava); }
.opt:focus-visible { outline: 2px solid var(--guava); outline-offset: 1px; }
.opt:disabled { cursor: default; }
.opt.correct { border-color: var(--green); background: var(--green-soft); }
.opt.wrong { border-color: var(--error); background: var(--error-soft); }
.opt .opt-key { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); margin-right: 10px; }
.explain { border-left: 3px solid var(--green); background: var(--green-soft); padding: 13px 16px; border-radius: 0 10px 10px 0; font-size: 14px; line-height: 1.6; margin-top: 14px; }
.explain.miss { border-color: var(--error); background: var(--error-soft); }
.explain .tag { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .12em; display: block; margin-bottom: 4px; }

.score-wrap { text-align: center; padding: 20px 0 8px; }
.score-num { font-family: 'IBM Plex Mono', monospace; font-size: 44px; font-weight: 600; }
.score-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 22px; }

/* ---- microsite-specific ---- */
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; margin: 20px 0; }
.stat { background: var(--surface); border: 1px solid var(--rule); border-radius: 12px; padding: 16px; }
.stat .v { font-weight: 800; font-size: 21px; letter-spacing: -0.01em; }
.stat .l { font-size: 12.5px; color: var(--ink-soft); margin-top: 3px; line-height: 1.4; }
.timeline { border-left: 2px solid var(--rule); margin: 8px 0 8px 6px; padding-left: 22px; }
.t-item { position: relative; padding-bottom: 22px; }
.t-item:last-child { padding-bottom: 4px; }
.t-item::before { content: ""; position: absolute; left: -28.5px; top: 5px; width: 11px; height: 11px; border-radius: 50%; background: var(--guava); border: 2.5px solid var(--bg); }
.t-when { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .1em; color: var(--ink-soft); }
.t-role { font-weight: 700; font-size: 15.5px; margin: 3px 0 4px; }
.t-desc { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin: 0; }
.t-list { margin: 7px 0 0; padding-left: 18px; }
.t-list li { font-size: 13.5px; color: var(--ink-soft); line-height: 1.55; margin-bottom: 5px; }
.t-list b { color: var(--ink); }
.swot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 16px; }
.swot-cell { border-radius: 14px; padding: 20px 22px; border: 1px solid var(--rule); background: var(--surface); }
.swot-cell h3 { margin: 0 0 10px; font-size: 15px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
.swot-cell.s h3 { color: var(--green); } .swot-cell.s { border-top: 4px solid var(--green); }
.swot-cell.w h3 { color: var(--error); } .swot-cell.w { border-top: 4px solid var(--error); }
.swot-cell.o h3 { color: var(--guava-deep); } .swot-cell.o { border-top: 4px solid var(--guava); }
.swot-cell.t h3 { color: var(--gold); } .swot-cell.t { border-top: 4px solid var(--gold); }
.swot-cell ul { margin: 0; padding-left: 18px; }
.swot-cell li { font-size: 13.5px; line-height: 1.55; margin-bottom: 7px; }
.vs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; margin: 14px 0 4px; }
.vs-col h4 { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; margin: 0 0 8px; }
.vs-col.good h4 { color: var(--green); }
.vs-col.bad h4 { color: var(--error); }
.vs-col ul { margin: 0; padding-left: 18px; }
.vs-col li { font-size: 13.5px; line-height: 1.55; margin-bottom: 6px; }
.win { border-left: 3px solid var(--green); background: var(--green-soft); border-radius: 0 10px 10px 0; padding: 13px 16px; margin: 12px 0 0; font-size: 14px; line-height: 1.6; }
.win .tag { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .12em; color: var(--green); display: block; margin-bottom: 4px; }
.key-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 12px; margin-top: 16px; }
.key-card { background: var(--surface); border: 1px solid var(--rule); border-radius: 14px; padding: 20px 22px; }
.key-card .kn { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .12em; color: var(--guava); }
.key-card h3 { margin: 6px 0 8px; font-size: 15.5px; font-weight: 800; }
.key-card p { font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); margin: 0 0 8px; }
.key-card .gusto { font-size: 13px; line-height: 1.55; margin: 0; border-top: 1px dashed var(--rule); padding-top: 8px; }
.key-card .gusto b { color: var(--guava-deep); }
.phase { background: var(--surface); border: 1px solid var(--rule); border-radius: 14px; padding: 24px 26px; margin-bottom: 14px; }
.phase-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 6px; }
.phase-days { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .1em; color: #fff; background: var(--guava); border-radius: 999px; padding: 4px 12px; }
.phase h3 { margin: 0; font-size: 18px; font-weight: 800; }
.phase .theme { color: var(--ink-soft); font-size: 13.5px; margin: 4px 0 12px; }
.gate { min-height: 88vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
.gate-card { background: var(--surface); border: 1px solid var(--rule); border-radius: 18px; padding: 44px 38px; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 8px 40px rgba(35,42,53,0.06); }
.gate-card p.gate-copy { font-size: 14px; line-height: 1.6; color: var(--ink-soft); margin: 0 0 22px; }
.gate-input { width: 100%; border: 1.5px solid var(--rule); border-radius: 10px; padding: 13px 14px; font-size: 15px; font-family: 'DM Sans', sans-serif; margin: 0 0 10px; text-align: center; letter-spacing: .08em; background: var(--bg); color: var(--ink); }
.gate-input:focus { outline: none; border-color: var(--guava); box-shadow: 0 0 0 3px var(--guava-soft); }
.gate-err { color: var(--error); font-size: 13px; margin: 12px 0 0; }
.letter-overlay { position: fixed; inset: 0; background: rgba(35, 42, 53, 0.55); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 50; }
.letter-card { background: var(--surface); border: 1px solid var(--rule); border-radius: 18px; padding: 40px clamp(26px, 5vw, 44px); max-width: 580px; width: 100%; max-height: 86vh; overflow-y: auto; box-shadow: 0 16px 60px rgba(35,42,53,0.25); animation: letterIn .35s cubic-bezier(.2,1.2,.4,1) both; }
@keyframes letterIn { 0% { transform: translateY(14px) scale(.97); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .letter-card { animation: none; } }
.letter-card .salutation { font-weight: 800; font-size: 20px; letter-spacing: -0.01em; margin: 14px 0 14px; }
.letter-card p.body { font-size: 14.5px; line-height: 1.7; margin: 0 0 14px; }
.letter-card .signoff { font-weight: 700; font-size: 15px; margin: 20px 0 0; }
.letter-card .signoff .sig { color: var(--guava-deep); }
.footer { text-align: center; margin-top: 48px; }
.footer .eyebrow { display: block; }
`;

const COURSE = [
  {
    id: "fundamentals",
    num: "01",
    title: "PEO Fundamentals & Co-Employment",
    tagline: "Legal architecture, liability allocation, the CSA, the CPEO statute, and industry economics.",
    lessons: [
      {
        title: "What a PEO is — and where the industry came from",
        blocks: [
          { t: "p", x: "A Professional Employer Organization enters a co-employment relationship with its clients. The PEO becomes the administrative employer of the client's workers — worksite employees (WSEs) — for payroll, employment tax filing, benefits sponsorship, and workers' compensation. The client remains the worksite employer with full direction and control of the work itself: hiring, firing, pay decisions, scheduling, supervision, and running the business. The relationship is contractual, defined in a Client Service Agreement, not a status imposed by statute." },
          { t: "p", x: "The industry's origin story matters because buyers' lawyers remember it. The model grew out of 1970s–80s 'employee leasing,' which exploded after a 1982 tax law (TEFRA) created a pension safe harbor that let owners exclude leased workers from retirement plans — a loophole closed in 1986. The 1990s and early 2000s brought real abuses: undercapitalized operators, unfunded health plans, and 'SUTA dumping' — shuffling payroll between entities to shed bad unemployment ratings, which Congress outlawed in the SUTA Dumping Prevention Act of 2004." },
          { t: "p", x: "The modern industry is the regulated descendant of that era: state registration and licensing regimes in the large majority of states, the ESAC accreditation program with bonded financial assurance, IRS certification (CPEO) since 2017, and a rebrand from 'staff leasing' to 'professional employer organization.' Today 500+ PEOs serve more than 230,000 client businesses and four-million-plus WSEs, with industry revenue of roughly $414 billion — more than quadruple its 2012 size. (Note for lesson seven: that headline figure is gross billings, including pass-through payroll — the distinction that separates operators from press-release readers.)" },
          { t: "callout", tag: "WHY THE HISTORY MATTERS", x: "When a prospect's attorney or CPA bristles at 'leasing my employees,' they're reacting to the 1990s version of this industry. Naming the history — and the licensing, bonding, ESAC, and CPEO regimes built in response — is how you show you know more about their objection than they do." },
        ],
      },
      {
        title: "The legal architecture of co-employment",
        blocks: [
          { t: "p", x: "Precision here separates operators from brochure-readers. Three terms get conflated constantly and must never be conflated by you:" },
          { t: "list", items: [
            "Co-employment is a contractual allocation. The CSA divides employer responsibilities between PEO and client by agreement. It is voluntary, defined, and priced.",
            "Joint employment is a liability doctrine. Courts and agencies (FLSA wage-hour cases, NLRB) impose joint-employer status on companies based on actual control over workers — regardless of what any contract says. A client can't contract its way out of liability for hours it controls.",
            "Employee leasing / EOR is full employer substitution. The provider is the sole legal employer. A PEO is not this — the client is always a common-law employer of its own people.",
          ]},
          { t: "p", x: "State law frames the whole arrangement. Most states have PEO-specific statutes covering registration or licensing, financial capacity requirements (audited financials, bonding, or working capital minimums), how unemployment insurance is reported (client-level vs PEO-level accounts), and how workers' compensation may be written (master policy vs multiple-coordinated-policy states). A PEO's ability to even operate a given billing structure differs by state — which is why multi-state deals require more than a rate card." },
          { t: "p", x: "On the federal tax side, wages are reported under the PEO's EIN (with special rules for certified PEOs under IRC Section 3511, covered in lesson five). For everything else — discrimination law, wage and hour, leave statutes, OSHA — the analysis runs on common-law employment and actual control, which is why the client never stops being an employer in the eyes of the EEOC or the Department of Labor." },
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"Co-employment doesn't mean someone else is liable for how you manage people. It means the administrative and tax employer obligations move to a specialist, while you remain the employer for everything you actually control.\"" },
        ],
      },
      {
        title: "Liability: who actually owns what",
        blocks: [
          { t: "p", x: "Buyers assume a PEO is an insurance policy against all employment liability. It isn't, and the rep who pretends otherwise creates the lawsuit that ends the relationship. The real allocation, in the typical CSA:" },
          { t: "table", head: ["Exposure", "Typically owns it", "Why"], rows: [
            ["Federal employment tax remittance", "PEO (solely, if CPEO)", "Wages paid under PEO's EIN; Section 3511 makes a CPEO solely liable"],
            ["Wage & hour (overtime, misclassification)", "Client (primary)", "Client controls hours, duties, and exempt/non-exempt decisions; PEO advises"],
            ["Discrimination / harassment claims", "Client (primary), PEO has exposure", "Driven by workplace conduct the client controls; EPLI coverage usually offered through the PEO"],
            ["Workplace safety / OSHA", "Client", "The worksite and its hazards belong to the client; PEO provides safety resources"],
            ["Benefits plan administration", "PEO (as plan sponsor)", "PEO sponsors the plans and carries fiduciary/administrative duties for them"],
            ["Workers' comp claims handling", "PEO / carrier", "Coverage and claims run through the PEO's program"],
          ]},
          { t: "p", x: "Two CSA mechanisms govern the edges: indemnification provisions (each party indemnifies the other for failures in its allocated lane) and insurance requirements, including Employment Practices Liability Insurance. EPLI offered through a PEO often comes with meaningful deductibles and conduct conditions — clients should know that an EPLI policy is not a license to skip documented terminations." },
          { t: "callout", tag: "FIELD NOTE", x: "Selling honestly on liability is a competitive weapon. The rep who says 'we take all the employment risk off your plate' loses the deal the moment the buyer's attorney reads the CSA. Walk the allocation table instead — it builds the kind of trust that survives legal review." },
        ],
      },
      {
        title: "Inside the Client Service Agreement",
        blocks: [
          { t: "p", x: "The CSA is the product. Everything else is implementation. A consultant should be able to read any PEO's CSA and brief a client on six provisions:" },
          { t: "list", items: [
            "Allocation of responsibilities. The schedule defining which employer obligations the PEO assumes, which the client retains, and which are shared. This is the legal heart of co-employment.",
            "Pricing exhibits. Where the billing structure actually lives — admin fee or rate, what's bundled, pass-through definitions, and the PEO's rights to adjust rates (especially SUTA and comp 'true-ups' and benefits renewals).",
            "Termination and notice. Typical notice runs 30 days; some agreements require longer or impose timing constraints. Map the notice period against the benefits renewal date and January 1 before a client signs anything.",
            "Benefits exit terms. What happens to coverage on termination — end-of-month cutoffs, COBRA administration responsibility, and whether the PEO offers any transition assistance. This is where unprepared exits get ugly.",
            "Indemnification and insurance. The two-way obligations described in the liability lesson, plus required coverages and limits.",
            "Employment screening and credit conditions. PEOs underwrite clients too — payment terms, deposit or prefunding requirements, and the PEO's right to terminate for credit deterioration.",
          ]},
          { t: "p", x: "Notice the asymmetry of attention: buyers obsess over year-one price and skim everything above. The consultant who walks a buyer through termination, benefits exit, and rate-adjustment rights before signing is doing the job the industry's reputation was built without." },
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"I'm going to show you the three paragraphs of this agreement you'll care about in year two: how rates can move, how you leave, and what happens to your people's coverage if you do.\"" },
        ],
      },
      {
        title: "CPEO: Section 3511, Form 8973, and why certification matters",
        blocks: [
          { t: "p", x: "The Certified PEO program was created by the Small Business Efficiency Act (enacted in late 2014), with the IRS issuing the first certifications in 2017. It added two sections to the tax code — 7705 (certification requirements) and 3511 (tax treatment) — and turned a marketing claim ('we're financially solid') into a federal status with teeth." },
          { t: "list", items: [
            "Sole federal tax liability. Under Section 3511, a CPEO is solely liable for federal employment taxes on wages it pays to WSEs under a CPEO contract. With a non-certified PEO, the IRS can pursue the client if the PEO collects and fails to remit — the client can pay its payroll taxes twice.",
            "Successor-employer treatment. A CPEO is treated as a successor employer, so FICA and FUTA wage bases don't restart when a client joins or leaves mid-year. With non-certified arrangements, mid-year EIN transitions can restart wage bases — a quantifiable duplicated-tax cost.",
            "Tax credits stay with the client. Section 3511(d) keeps specified credits computed at the customer level — WOTC, the R&D payroll tax offset, FICA tip credit, and others. Without that protection, moving wages to another EIN could strand credits. For a startup claiming the R&D payroll offset, this is a deal-level issue, not a footnote.",
            "Form 8973. Each CPEO–customer relationship is reported to the IRS on Form 8973, filed at the start and end of every service contract. It's the paper trail that makes the sole-liability and successor rules operate.",
          ]},
          { t: "p", x: "Certification itself requires annual audited financials, quarterly assertions verified by a CPA, background and experience standards for responsible individuals, and a bond — generally the greater of $50,000 or 10% of the prior year's federal employment tax liability, capped at $1 million. Maintaining certification is an ongoing compliance burden, which is exactly why it signals financial discipline." },
          { t: "p", x: "Keep CPEO distinct from ESAC accreditation. ESAC is the industry's independent accreditation program, backed by surety bonding that protects clients if an accredited PEO fails to remit payroll, taxes, or contributions. CPEO is federal tax status; ESAC is financial assurance. The strongest operators hold both, and you should know the credential set of every PEO you put in front of a client." },
        ],
      },
      {
        title: "Benefits architecture: master plans, ERISA, ACA, and the 401(k) MEP",
        blocks: [
          { t: "p", x: "Benefits are the engine of most PEO deals, so a consultant needs to understand how the plans are actually structured — not just quote the rates." },
          { t: "list", items: [
            "Health plans. National PEOs sponsor fully insured group health plans with major carriers, covering WSEs across all client companies. Because the plan covers employees of many unrelated employers, its regulatory treatment (single-employer plan vs multiple employer welfare arrangement, or MEWA) has been a long-running question in ERISA law, and states layer their own insurance regulation on top. The practical takeaway: plan structure, carrier strength, and the PEO's underwriting discipline determine whether year-one rates survive to year three.",
            "Underwriting reality. The master plan doesn't suspend underwriting — it pools it. The carrier prices the PEO's whole book, and the PEO decides how to allocate renewal increases across clients. A PEO that underprices to win deals pays for it at book renewal, and so do its clients. Always ask how a PEO allocates renewals: book-wide, by client experience, or a blend.",
            "ACA mechanics. Applicable Large Employer status is determined by the client's own full-time employee count — joining a PEO does not change whether the employer mandate applies. Coverage offered through the PEO's plan on the client's behalf can satisfy the client's offer obligation (the regulations bless this where the client pays more for employees who enroll), and the PEO typically handles the 1094/1095 reporting machinery.",
            "Retirement. PEO 401(k) programs are typically structured as Multiple Employer Plans (MEPs), with each client adopting into the PEO-sponsored plan. Clients get pooled pricing, delegated administration, and meaningful relief from day-to-day fiduciary tasks — though adopting employers always retain some fiduciary responsibility, starting with the decision to use the arrangement at all.",
          ]},
          { t: "callout", tag: "FIELD NOTE", x: "The most expert question in a benefits-driven deal isn't 'what are the rates?' — it's 'show me this book's renewal history and tell me how increases get allocated.' Rates buy the first year. Renewal philosophy is the product." },
        ],
      },
      {
        title: "Why SMBs buy — and how PEOs make money",
        blocks: [
          { t: "p", x: "The sweet spot is roughly 5 to 100 employees — big enough to feel HR pain, too small to buy enterprise infrastructure on their own paper. The value stack, in the order buyers usually feel it: benefits access through master plans, compliance offload across states and statutes, workers' comp through the master program (often pay-as-you-go), and an HR function the founder no longer has to improvise. The industry's benchmark research backs the stack with numbers worth memorizing:" },
          { t: "table", head: ["Benchmark", "The number", "Why it sells"], rows: [
            ["ROI", "~27% average annual ROI — roughly $1,273 back per $1,000 spent", "The fee pays for itself; the headline economics of the category"],
            ["Cost vs savings", "~$1,395 spent per employee vs ~$1,775 saved per employee annually", "Net-positive per head before counting the owner's time"],
            ["Growth", "4.3% annual growth vs 1.6% for comparable businesses", "PEO clients grow more than twice as fast"],
            ["Survival", "50% less likely to go out of business", "The risk story, for the founder who's lived close calls"],
            ["Turnover", "12% lower employee turnover", "Benefits and HR quality showing up where it costs the most"],
            ["Profitability", "16% higher than non-PEO peers", "The bottom-line close"],
            ["Scale", "500+ PEOs, 230,000+ clients, ~$414B in industry revenue — quadrupled since 2012", "A category in structural growth, not a niche"],
            ["Penetration", "Only ~17% of SMB employers use a PEO", "The market is mostly unconverted — category education wins deals incumbents never see"],
            ["Client profile", "Nearly two-thirds of PEO clients have 10–49 employees; almost half are in professional services, manufacturing, or construction", "Defines the ICP — and proves blue-collar is core PEO territory, not adjacent"],
          ]},
          { t: "callout", tag: "SOURCE DISCIPLINE", x: "These are NAPEO-commissioned benchmarks. Quote them as industry research, keep them current, and close on the prospect's own census and invoices — their numbers beat any benchmark, and the rep who uses both is unbeatable." },
          { t: "p", x: "Now the other side of the ledger. A PEO's revenue comes from a handful of places, and knowing them makes you dangerous in any pricing conversation:" },
          { t: "list", items: [
            "Administrative fees. The disclosed PEPM or percent-of-payroll fee — the only component most buyers ever see.",
            "Workers' comp spread. The difference between what the PEO charges (net rates by class code) and its actual program cost, net of claims. Strong risk selection makes this a profit center.",
            "SUTA spread. In states permitting PEO-level reporting, the gap between a billed 'company rate' and the PEO's actual experience rate.",
            "Benefits load. Margin layered into health and ancillary rates above true premium cost.",
            "Float and scale. Interest on funds held between collection and remittance, plus the operating leverage of running one platform across thousands of clients.",
          ]},
          { t: "p", x: "One more concept that marks an operator: gross billings versus net revenue. PEO 'revenue' headlines usually quote gross billings — which include client payroll passing through. The real business is net service revenue: fees plus spreads. When you evaluate a PEO's financial strength, or read a public PEO's earnings, that's the number that matters." },
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"I'll tell you exactly how every PEO in this comparison makes its money on your account — fee, comp spread, tax spread, and benefits load. Once you see all four, you can compare anything they put in front of you.\"" },
        ],
      },
    ],
    quiz: [
      { q: "What's the correct distinction between co-employment and joint employment?", opts: ["They're synonyms", "Co-employment is a contractual allocation of employer responsibilities; joint employment is a liability doctrine imposed by courts and agencies based on actual control", "Joint employment requires a CSA", "Co-employment only exists in licensing states"], a: 1, x: "Co-employment is voluntary and defined by the CSA. Joint-employer liability (FLSA, NLRB) attaches based on real-world control regardless of contract language — which is why clients can't contract away liability for what they actually control." },
      { q: "A client's attorney asks who bears primary wage-and-hour exposure (overtime, exempt misclassification) in a PEO relationship. The accurate answer:", opts: ["The PEO, because it runs payroll", "The client, because it controls hours, duties, and classification decisions — the PEO advises", "The workers' comp carrier", "Neither — co-employment eliminates it"], a: 1, x: "Wage-and-hour liability follows control of the work. The PEO calculates and pays what it's told; the client decides who works when and how roles are classified. Honest reps say this before the attorney does." },
      { q: "Under IRC Section 3511, a CPEO is:", opts: ["Exempt from FUTA", "Solely liable for federal employment taxes on wages paid to WSEs under a CPEO contract", "Required to use client EINs", "Jointly liable with the client"], a: 1, x: "Sole liability is the headline protection of certification: if taxes go unremitted, the IRS looks to the CPEO, not the client. With a non-certified PEO, the client can end up paying its payroll taxes twice." },
      { q: "Form 8973 is:", opts: ["The CPEO bond application", "A workers' comp rate filing", "The form reporting the start and end of each CPEO–customer service contract to the IRS", "The annual ESAC attestation"], a: 2, x: "Form 8973 creates the IRS paper trail for each CPEO–client relationship — it's what makes sole liability and successor-employer treatment operate on real accounts." },
      { q: "The CPEO bond requirement is generally:", opts: ["A flat $1 million", "Greater of $50,000 or 10% of the prior year's federal employment tax liability, capped at $1 million", "5% of gross billings", "Optional for ESAC members"], a: 1, x: "Greater of $50K or 10% of federal employment tax liability, with a $1M cap — alongside annual audited financials and CPA-verified quarterly assertions. Certification is an ongoing compliance regime, not a one-time stamp." },
      { q: "Why does Section 3511(d) matter to a startup claiming the R&D payroll tax offset?", opts: ["It doubles the credit", "It keeps specified credits (R&D offset, WOTC, FICA tip credit) computed at the customer level, so joining a CPEO doesn't strand them", "It defers the credit to year three", "It converts the credit to a deduction"], a: 1, x: "Specified credits stay with the customer under a CPEO arrangement. For an R&D-heavy startup, losing the payroll tax offset by moving wages to another EIN would be a deal-killer — 3511(d) is why it isn't." },
      { q: "A client asks whether joining a PEO changes their ACA Applicable Large Employer status. Correct answer:", opts: ["Yes — the PEO's total WSE count makes everyone an ALE", "Yes — co-employment exempts them from the mandate", "No — ALE status is determined by the client's own full-time employee count; PEO plan offers can satisfy the client's obligation", "Only in licensing states"], a: 2, x: "ALE status runs on the client's own common-law workforce. The PEO doesn't make a 20-person company an ALE, and it doesn't exempt a 80-person company. What the PEO does provide is the plan offer and the 1094/1095 reporting machinery." },
      { q: "PEO-sponsored 401(k) programs are typically structured as:", opts: ["SEP-IRAs", "Individual client plans administered separately", "A Multiple Employer Plan (MEP) that client companies adopt into", "Nonqualified deferred compensation"], a: 2, x: "The MEP structure pools pricing and administration and shifts substantial fiduciary workload — though adopting employers always retain some fiduciary duty, beginning with selecting the arrangement." },
      { q: "Which list correctly describes how a PEO actually makes money?", opts: ["Admin fees only", "Admin fees, workers' comp spread, SUTA spread where state rules permit, benefits load, and float/scale", "Reselling client data", "Government subsidies"], a: 1, x: "Fee plus spreads. Knowing all the margin pools — not just the disclosed fee — is what lets you decompose any competitor's quote and explain a 'cheap' admin fee subsidized by fat comp and benefits spreads." },
      { q: "A PEO advertises '$3 billion in revenue.' The operator's first question is:", opts: ["Which carrier they use", "Whether that's gross billings (including pass-through client payroll) or net service revenue (fees plus spreads)", "How many states they're licensed in", "Whether they're hiring"], a: 1, x: "Gross billings include client payroll passing through and overstate the underlying business by an order of magnitude. Net service revenue is the real P&L — the number to use when judging financial strength or reading a public PEO's earnings." },
    ],
  },
  {
    id: "operating",
    num: "02",
    title: "The PEO Operating Model",
    tagline: "Follow the money: funds flow, underwriting, unit economics, risk, and service delivery.",
    lessons: [
      {
        title: "Follow the money: the payroll funds flow",
        blocks: [
          { t: "p", x: "Strip away the brochure and a PEO is a high-velocity money machine. Every payroll cycle, the same sequence runs: the client submits hours and changes; the PEO calculates gross-to-net and produces an invoice for the full obligation — wages, employer taxes, workers' comp, benefits, and the admin fee; the PEO debits the client's account by ACH, typically one to two banking days before check date; then the PEO pays the employees, remits employment taxes on its federal and state deposit schedules, and pays carriers on their billing cycles." },
          { t: "p", x: "Notice what that sequence means: as long as the debit clears, the PEO never deploys its own cash for wages. But the moment a debit fails after payroll has been funded, the PEO has paid the client's employees with its own money. The PEO is functionally extending unsecured short-term credit equal to a full payroll, every cycle, to every client." },
          { t: "list", items: [
            "This is why PEOs underwrite client credit — financials, payment history, industry — alongside insurance risk.",
            "This is why higher-risk clients see deposits, prefunding requirements, or wire-only terms in the CSA.",
            "This is why nonpayment termination rights are fast and unsentimental. A PEO that floats a failing client is donating payroll.",
            "And it's why float exists as a revenue line: between collection and remittance, the PEO holds material balances across thousands of clients.",
          ]},
          { t: "callout", tag: "EXEC LENS", x: "When you evaluate a PEO's financial strength — or run one — the funds-flow discipline is the business. Collection timing, deposit policy, and remittance controls are what failed in every PEO collapse the industry's regulations were written in response to." },
        ],
      },
      {
        title: "How a PEO underwrites a client",
        blocks: [
          { t: "p", x: "Buyers think they're choosing a PEO. Simultaneously, the PEO's deal desk is deciding whether it wants them. Every serious PEO runs a prospect through four underwriting lanes before pricing is released:" },
          { t: "table", head: ["Lane", "What's reviewed", "What kills or reprices the deal"], rows: [
            ["Benefits", "Census (ages, zips, tiers), group size, participation; claims experience or medical questions for larger groups", "Older or high-risk demographics, low expected participation, known large claimants"],
            ["Workers' comp", "Class codes, payroll by code, e-mod history, loss runs, safety practices", "Tough class codes outside the PEO's appetite, deteriorating mod trend, frequency patterns"],
            ["Tax", "SUI rates and accounts by state, prior compliance issues", "High-rate states under PEO-level reporting, messy account history"],
            ["Credit", "Financials, payment history, funding method, industry stability", "Thin balance sheets, prior payment defaults — managed via deposits or declined outright"],
          ]},
          { t: "p", x: "Risk selection is the profit engine of a PEO. Two PEOs with identical fees and identical service can have wildly different economics purely on the books of business they chose to write. That's why a deal that one PEO prices aggressively gets declined by another — the appetite, not the prospect, changed." },
          { t: "callout", tag: "FIELD NOTE", x: "Package every deal like a loan file: clean census, current loss runs, SUI notices, financials if asked. Deals don't just win on persuasion — they win in underwriting, on the completeness and credibility of the submission. Sloppy files get conservative pricing." },
        ],
      },
      {
        title: "The PEO P&L: unit economics",
        blocks: [
          { t: "p", x: "Read a PEO like an operator. Start at the top: gross billings (including pass-through payroll) versus net service revenue (fees plus spreads) — covered in Module 1. From net revenue, the unit metric that matters is gross profit per WSE per month, which public PEOs disclose and which collapses the whole model into one number: what the PEO earns per covered employee after direct insurance and tax costs." },
          { t: "list", items: [
            "The revenue side per WSE: admin fee, comp spread, SUTA spread where reporting structure allows, benefits load, float.",
            "The direct-cost side: health plan cost trend, workers' comp claims development, and state unemployment experience. Because national PEOs typically share in insurance risk, gross profit per WSE moves with claims — a bad comp year or a hot medical-trend year compresses it directly.",
            "Below gross profit: service delivery (payroll ops, HR business partners), technology, and sales cost — commissions plus the customer-acquisition math.",
          ]},
          { t: "p", x: "That last line explains the industry's obsession with retention. Acquiring and implementing a client is expensive; the account often isn't truly profitable until well into the relationship. A client retained through several renewals is the entire business model; a client churned at month fourteen is a loss dressed as a logo. When a PEO fights hard at renewal, that's not pride — it's the P&L." },
          { t: "callout", tag: "EXEC LENS", x: "Three questions reveal any PEO's economic quality: What's your gross profit per WSE trend? What share of it comes from insurance spreads versus fees? And what's your WSE retention rate? Fee-led, high-retention books are durable. Spread-led books are leveraged bets on claims." },
        ],
      },
      {
        title: "Risk management inside the machine",
        blocks: [
          { t: "p", x: "The PEO's insurance programs aren't simple pass-throughs to carriers — the PEO usually keeps meaningful skin in the game, and managing that retained risk is where operating skill shows." },
          { t: "list", items: [
            "Workers' comp. Large PEOs commonly buy large-deductible master policies — the PEO retains the first layer of every claim (often hundreds of thousands of dollars) with the carrier covering the excess; some use captives for the retained layer. The consequence: every dollar of claims avoided is the PEO's dollar. That's why serious PEOs invest in claims management, return-to-work programs, and worksite safety — it's underwriting profit, not customer service.",
            "Health. National PEOs frequently operate under experience-rated or risk-sharing arrangements with their carriers, so the book's actual claims drive the PEO's cost. Managing it means disciplined new-business underwriting, participation enforcement, and deliberate renewal allocation — deciding how much of the book's increase each client carries.",
            "Portfolio management. A PEO manages its client base like a loan book: rate actions and re-underwriting at renewal, and culling accounts whose claims, credit, or behavior no longer fit appetite. Clients experience this as 'my PEO got aggressive at renewal'; the PEO experiences it as survival.",
            "External discipline. CPEO bonding and audits, ESAC financial assurance, and state financial-capacity requirements function as the regulatory floor under all of it — the system the industry built after its undercapitalized era.",
          ]},
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"A PEO is partly an insurance operation wearing an HR suit. The good ones are excellent at risk — which is exactly what you want, because their incentive is fewer claims at your worksite, not more.\"" },
        ],
      },
      {
        title: "Service delivery & the client lifecycle",
        blocks: [
          { t: "p", x: "The last piece of the construct is how service is actually produced — because the service model is a P&L choice, not just a customer-experience choice." },
          { t: "list", items: [
            "Implementation. Data collection, benefits enrollment, comp binding, state account work, then the first payroll — the trust milestone. Implementation quality is the strongest early predictor of retention, which is why mature PEOs run it as a specialized function, not a sales afterthought.",
            "Service models span a cost spectrum. Dedicated HR business partners and named teams (the premium, service-heavy model) sit at one end; pooled service centers and software-first self-serve (the transparent-PEPM model) at the other. Neither is 'better' — they are different cost structures sold to different buyers at different price points. An exec evaluating PEOs should map the service model to what their managers will actually use.",
            "The renewal cycle. The benefits renewal is the annual moment of truth where underwriting reality, allocation philosophy, and relationship quality all surface at once. Most churn is conceived at a renewal and executed at the next one.",
            "Exit and churn drivers. Accounts leave over renewal shock, service failures, M&A, outgrowing the model (graduating to self-funded plans around a few hundred employees), or a sharper rep running an unbundling play. Each is predictable; the operating question is which ones your model prevents.",
          ]},
          { t: "callout", tag: "EXEC LENS", x: "Connect the three lessons: risk selection determines the book, the book's claims determine gross profit per WSE, and service model plus renewal philosophy determine whether the book stays. That loop — select, price, serve, retain — is the construct of a PEO." },
        ],
      },
    ],
    quiz: [
      { q: "In the standard payroll funds flow, when does the PEO collect from the client?", opts: ["30 days after payday, like a vendor invoice", "Via ACH debit typically one to two banking days before check date, covering wages, taxes, insurance, and fees", "Quarterly in advance", "Only after taxes are remitted"], a: 1, x: "The PEO invoices the full obligation and debits before paying anything out. As long as debits clear, the PEO deploys no cash for wages — which makes collection discipline the heart of the operating model." },
      { q: "A client's ACH debit fails after the PEO has already funded payroll. The structural problem this reveals:", opts: ["The carrier must reimburse the PEO", "The employees must return wages", "The PEO extends unsecured short-term credit equal to a full payroll every cycle — which is why credit underwriting, deposits, and fast nonpayment termination exist", "Nothing — taxes simply defer"], a: 2, x: "The PEO has paid someone else's employees with its own money. Every deposit requirement, wire-only term, and aggressive nonpayment clause in a CSA traces back to this exposure." },
      { q: "Why might one PEO decline a deal another prices aggressively?", opts: ["Licensing differences", "Risk appetite: deal desks underwrite benefits demographics, comp class codes and loss history, state tax posture, and client credit — and selection drives profitability", "PEOs randomly rotate which deals they accept", "Commission disputes"], a: 1, x: "Risk selection is the profit engine. Identical fee schedules produce wildly different economics depending on the book each PEO chose to write — so appetite, not the prospect, decides." },
      { q: "The unit-economics metric public PEOs disclose that best captures the model is:", opts: ["Gross billings per office", "Revenue per salesperson", "Gross profit per WSE per month", "Clients per state"], a: 2, x: "Gross profit per WSE per month nets the fee and spread revenue against direct insurance and tax costs — one number for what the machine earns per covered employee." },
      { q: "Under a large-deductible workers' comp structure, the PEO:", opts: ["Passes all claims to the carrier dollar-one", "Retains the first layer of each claim (often a six-figure deductible), making claims management and worksite safety direct profit levers", "Is uninsured", "Only covers clerical class codes"], a: 1, x: "The PEO keeps the working layer of every claim — sometimes through a captive — and the carrier covers the excess. Every claim dollar avoided is the PEO's dollar, which is why good PEOs are genuinely good at safety and return-to-work." },
      { q: "Why is client retention disproportionately important to PEO economics?", opts: ["Regulators penalize churn", "Acquisition and implementation costs mean accounts often reach true profitability only deep into the relationship — early churn is a loss dressed as a logo", "Retained clients pay higher statutory taxes", "It isn't — new logos matter more"], a: 1, x: "The payback math runs across multiple renewals. That's why PEOs fight at renewal, invest in implementation quality, and treat the first payroll as a trust milestone." },
      { q: "A premium dedicated-HRBP service model versus a software-first self-serve model is best understood as:", opts: ["A branding difference only", "Two different cost structures sold at different price points to different buyers — a P&L choice, not just a CX choice", "A regulatory requirement by state", "Old technology versus new"], a: 1, x: "Service intensity is an economic design decision. High-touch costs more to produce and prices accordingly; self-serve trades human depth for transparency and margin. Match the model to how the client actually operates." },
      { q: "The 'construct of a PEO' as an operating loop is best summarized as:", opts: ["Market, sell, invoice", "Select risk, price it, serve the book, and retain it — claims drive gross profit per WSE, and renewals decide whether the book stays", "Hire, train, promote", "Buy software, resell software"], a: 1, x: "Select, price, serve, retain. Underwriting builds the book, the book's claims set the margin, and service plus renewal philosophy determine duration. Every PEO you'll ever compare is a different answer to that loop." },
    ],
  },
  {
    id: "pricing",
    num: "03",
    title: "Pricing Mechanics",
    tagline: "PEPM vs % of payroll, where margin hides, SUTA, comp, and benefits underwriting.",
    lessons: [
      {
        title: "PEPM vs percent-of-payroll",
        blocks: [
          { t: "p", x: "PEO administrative fees are quoted two ways: a flat per-employee-per-month (PEPM) fee, or a percentage of gross payroll. The structure matters as much as the number." },
          { t: "list", items: [
            "PEPM is flat and predictable. Headcount goes up, fees go up linearly. Raises and bonuses don't change the fee.",
            "Percent-of-payroll escalates silently. Every raise, every bonus, every commission check increases the PEO's fee — with no additional service delivered. A 3% admin rate on a team averaging $80K is $200 PEPM; give everyone a 10% raise and the fee rises 10% too.",
          ]},
          { t: "callout", tag: "DO THE MATH", x: "Always convert percent-of-payroll quotes to effective PEPM: (annual payroll × rate) ÷ headcount ÷ 12. A '2.8%' quote sounds small; '$187 per employee per month' is a number a buyer can actually compare." },
          { t: "p", x: "Bundled quotes go a step further and blend the admin fee into a single rate that also includes taxes and comp. Bundling isn't automatically bad — but it makes the admin fee invisible, which makes comparison impossible without unbundling. That skill is next." },
        ],
      },
      {
        title: "Anatomy of a PEO invoice",
        blocks: [
          { t: "p", x: "Every PEO bill, however it's formatted, is built from the same five components. Your job in any deal is to be able to decompose both the incumbent's bill and your proposal into this stack:" },
          { t: "table", head: ["Component", "What it should be", "Where margin hides"], rows: [
            ["Gross wages", "Pure pass-through", "Nothing — if wages are marked up, run"],
            ["FICA / FUTA", "Statutory pass-through", "Rarely padded, but verify caps are applied"],
            ["SUTA", "Statutory rate pass-through", "Blended or 'company rate' above the client's actual statutory rate"],
            ["Workers' comp", "Manual rate × class code × e-mod, or net rate", "Net rates marked up over the PEO's true cost"],
            ["Benefits + admin fee", "Premiums + disclosed fee", "Benefit 'loads' on top of premium; fee buried in a bundled rate"],
          ]},
          { t: "p", x: "A transparent PEO will show each line. A bundled biller will show one blended rate per employee or per pay period. When you unbundle a blended rate — subtract true statutory taxes, true comp cost, and actual benefit premiums — whatever remains is the real administrative fee. That number is often two or three times what the buyer thinks they're paying." },
          { t: "p", x: "Know the industry's most effective camouflage tactic: line-item migration, also called premium shifting. A PEO quotes the same underlying health plan as everyone else, but moves a slice of the true premium out of the premium line and into its fee lines — a benefit administration fee here, a co-employment risk fee there, a technology service fee, a markup line. If the true premium is $500, shifting $70 into the benefits admin fee and $50 into a risk fee lets the proposal display a $380 premium next to competitors' $500 for the identical plan. Buyers anchor on the premium line, the 'cheaper' quote wins, and total cost was never different. The defense is mechanical: total every line, per employee per month, and compare totals only — never any single line." },
          { t: "callout", tag: "FIELD NOTE", x: "Ask the prospect for one full invoice and their SUI rate notice. If the SUTA rate on the invoice doesn't match the rate notice, you've found the conversation." },
        ],
      },
      {
        title: "SUTA, wage bases, and the mid-year trap",
        blocks: [
          { t: "p", x: "State unemployment (SUTA) is where PEO billing gets genuinely technical, and where you can be the only person in the deal who actually understands what's happening." },
          { t: "list", items: [
            "Reporting varies by state. Some states require PEOs to report under the client's own SUTA account and rate; others allow or require reporting under the PEO's account. Under PEO-rate reporting, a PEO with a strong rate can bill a 'blended' SUTA above its true cost — margin disguised as tax.",
            "Wage bases reset on transitions. SUTA and FICA taxes apply up to annual wage bases per employee. Move mid-year between EINs (into or out of a non-certified PEO) and those bases can restart — the employer pays tax again on wages already taxed.",
            "Timing is a closing tool. This is why January 1 starts are cleanest, and why a CPEO's no-restart protection is a genuine differentiator for mid-year deals.",
          ]},
          { t: "callout", tag: "DO THE MATH", x: "An employee who's earned past a $9,000 SUTA wage base by July, at a 3% rate, costs ~$270 in duplicated SUTA if the base restarts. Multiply by headcount and add restarted FICA above the Social Security wage base for high earners — quantify the trap before the competitor uses it against you." },
        ],
      },
      {
        title: "Workers' comp mechanics",
        blocks: [
          { t: "p", x: "Comp pricing starts with the manual rate for each class code (per $100 of payroll), multiplied by the experience modifier (e-mod). An e-mod of 1.00 is industry average; 1.25 means losses 25% worse than expected and a 25% surcharge; 0.85 means a 15% credit." },
          { t: "list", items: [
            "Master policy. Most PEOs cover WSEs under the PEO's master comp policy. For clients with high e-mods or tough class codes, riding the PEO's program can mean real savings — and a future exit consideration, since the client may leave without its own loss history.",
            "Net rate deals. PEOs often quote comp as a flat 'net rate' per class code. The question is the spread between that net rate and the PEO's actual cost. Competitive deals get priced near cost; lazy deals carry fat spreads.",
            "Pay-as-you-go. Comp billed on actual payroll each cycle, instead of a large up-front deposit and a year-end audit surprise. Real cash-flow value for seasonal or growing businesses — sell it that way.",
          ]},
        ],
      },
      {
        title: "Benefits underwriting & renewal leverage",
        blocks: [
          { t: "p", x: "Master plan pricing is underwriting, not magic. The PEO's carrier evaluates the group — census, ages, zip codes, sometimes medical questions or prior claims — and slots it into the master plan's rate structure." },
          { t: "list", items: [
            "Composite vs age-banded. Composite rates charge one blended rate per tier (EE, EE+spouse, family). Age-banded rates vary by each employee's age. A young group often does better age-banded; an older group benefits from composite blending. Know which structure each quote uses before comparing.",
            "Participation requirements. Plans typically require a minimum share of eligible employees to enroll. A group that can't hit participation can blow up after the sale — verify during discovery, not at implementation.",
            "Renewal behavior. Year one is the honeymoon; the renewal is the marriage. Ask any incumbent's client what their last two renewals were. Double-digit renewals on a 'great' master plan are the most common reason accounts go back to market — and your best prospecting trigger.",
          ]},
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"Anyone can buy your business with a year-one rate. I'll show you the renewal history and the rate structure, because that's what you'll actually live with.\"" },
        ],
      },
    ],
    quiz: [
      { q: "A client has $4.0M in annual payroll and 50 employees. A PEO quotes a 3% of payroll admin structure. What's the effective PEPM?", opts: ["$100", "$150", "$200", "$240"], a: 2, x: "$4,000,000 × 3% = $120,000 ÷ 50 employees ÷ 12 months = $200 PEPM. Always convert percentage quotes to PEPM so buyers can compare structures honestly." },
      { q: "The core problem with percent-of-payroll admin pricing for the client is:", opts: ["It's illegal in most states", "Fees escalate automatically with every raise and bonus, with no added service", "It can't include workers' comp", "It only works for hourly workforces"], a: 1, x: "Percent-of-payroll pricing ties the fee to compensation, not to service delivered. Payroll grows, the fee grows. It's the quiet escalator in bundled deals." },
      { q: "You unbundle a blended bill rate by:", opts: ["Dividing it by headcount", "Asking the PEO for its margin", "Subtracting true statutory taxes, actual comp cost, and actual benefit premiums — the remainder is the real admin fee", "Multiplying the e-mod by the SUTA rate"], a: 2, x: "Whatever survives after stripping out the real pass-throughs is administration and margin. That residual is frequently far larger than the buyer believes." },
      { q: "A company leaves a non-certified PEO in July. The main tax consequence to flag:", opts: ["FUTA is forgiven for the year", "FICA and SUTA wage bases can restart, duplicating taxes on wages already taxed", "The e-mod resets to 1.00", "Benefits premiums become taxable"], a: 1, x: "Mid-year EIN transitions with a non-CPEO can restart wage bases. Quantify it per employee — and note that CPEO arrangements eliminate the federal restart." },
      { q: "An e-mod of 1.25 means:", opts: ["The client gets a 25% comp discount", "Claims experience is 25% worse than industry expectation, surcharging premium 25%", "The class code is high hazard", "Payroll grew 25%"], a: 1, x: "The experience modifier scales premium to actual loss history versus expected losses. High e-mod clients are exactly the profile that benefits most from a PEO master policy." },
      { q: "The main client benefit of pay-as-you-go workers' comp is:", opts: ["Lower manual rates", "No class codes", "Premiums track actual payroll each cycle — no big deposit, far smaller audit surprises", "It removes the e-mod"], a: 2, x: "Pay-as-you-go is a cash-flow and predictability story. It doesn't change rates; it changes when and how accurately premium is paid." },
      { q: "Comparing two benefit quotes, one composite-rated and one age-banded, you should first:", opts: ["Pick the lower family tier rate", "Recognize the structures price differently by group demographics — model both against the actual census", "Assume composite is always cheaper", "Assume age-banded is always cheaper"], a: 1, x: "A young census often wins age-banded; an older census benefits from composite blending. Quote structures must be run against the real census before any rate comparison means anything." },
      { q: "A proposal shows a $380 premium for the same plan every competitor quotes at $500 — alongside a benefits admin fee, a co-employment risk fee, a technology fee, and other line items. The most likely explanation:", opts: ["They negotiated a better carrier rate", "Premium shifting: real premium dollars migrated into the fee lines so the displayed premium anchors cheaper, while total cost is unchanged", "The plan has a much higher deductible", "A state premium subsidy"], a: 1, x: "Line-item migration. Same plan, same carrier, same total — dollars moved out of the premium line because buyers anchor on premiums. The counter is mechanical: total every line per employee per month and compare totals only." },
    ],
  },
  {
    id: "landscape",
    num: "04",
    title: "Competitive Landscape",
    tagline: "Who the players are, how they position, and how to pick the right fit.",
    lessons: [
      {
        title: "The big nationals",
        blocks: [
          { t: "table", head: ["PEO", "Positioning", "What to know in a deal"], rows: [
            ["ADP TotalSource", "Largest PEO by WSE count; full ADP ecosystem", "Scale and brand comfort; pricing often bundled — unbundle it. Service model is structured, not boutique."],
            ["Insperity", "Premium, service-heavy; deep HR consulting model", "Sells on service intensity and is priced accordingly. Wins relationship buyers; vulnerable on price transparency and tech experience."],
            ["TriNet", "Vertical-specific practices (tech, life sciences, financial services, nonprofits)", "Industry-tailored benefits and expertise. Strong in venture-backed and professional verticals."],
            ["Paychex PEO", "PEO arm of the payroll giant (incl. legacy Oasis)", "Often enters through existing Paychex payroll relationships. Watch for payroll-bundle pricing framing."],
          ]},
          { t: "p", x: "The nationals win on scale, plan depth, and brand safety. They are most exposed on price opacity, service consistency at the account level, and — against tech-forward rivals — user experience." },
        ],
      },
      {
        title: "Tech-forward entrants",
        blocks: [
          { t: "table", head: ["PEO", "Positioning", "What to know in a deal"], rows: [
            ["Justworks", "Transparent flat PEPM pricing, self-serve, SMB-first", "Published pricing is its weapon. Strongest with small, simple, young groups; thinner on hands-on HR service and complex comp."],
            ["Rippling PEO", "Software-first; PEO as a toggle on its HR/IT platform", "Sells the platform; the PEO can be switched off while staying on the software. Compelling for tech buyers; service depth is the question to probe."],
            ["Gusto (entering PEO)", "Payroll-native SMB base moving upmarket into PEO", "Massive installed payroll base to upsell. Watch this space — distribution through an existing product is a structurally different motion."],
          ]},
          { t: "callout", tag: "FIELD NOTE", x: "Tech-forward PEOs reframe the category: the product is the software, and co-employment is a feature. Against them, sell underwriting depth, renewal history, comp expertise, and a named human who answers the phone. Selling for them, sell speed, transparency, and the demo." },
        ],
      },
      {
        title: "Mid-market, regional, and the aggregation trend",
        blocks: [
          { t: "p", x: "Below the nationals sits a deep bench: Vensure and its large family of acquired PEOs, Engage, Nextep, and dozens of strong regionals. Two things to understand about this tier:" },
          { t: "list", items: [
            "Flexibility is the pitch. Regionals often out-hustle nationals on underwriting creativity, comp programs for tough class codes, and willingness to customize. Their risk surface is service scalability and financial depth — this is where CPEO/ESAC credentials matter most.",
            "Aggregation is reshaping the tier. Roll-ups have been acquiring regional PEOs for years. A client signed with a friendly local PEO can wake up inside a platform with different service and pricing philosophy. Know the ownership story of any PEO you put on the table.",
          ]},
        ],
      },
      {
        title: "What's in the fee: the inclusions matrix",
        blocks: [
          { t: "p", x: "The most common comparison mistake in this industry is lining up admin fees that don't buy the same things. Before any rate goes in front of a client, build the inclusions picture: what each PEO's fee covers as standard, and what shows up later as an add-on. The matrix below reflects typical packaging as of mid-2026 — treat it as a starting map, and verify against the actual proposal every time, because packaging changes and most of these providers quote custom." },
          { t: "table", head: ["PEO", "Pricing structure", "Standard with the admin fee", "Typically extra"], rows: [
            ["ADP TotalSource", "Custom quote; PEPM or % of payroll, often bundled", "Payroll & tax admin, HR support, compliance, benefits administration, WC program access, learning/talent tools", "All insurance premiums; enhanced recruiting/HR services; unbundle the blended rate to find the real fee"],
            ["Insperity", "Custom quote; allocation often presented as comprehensive PEPM", "Dedicated HR service team, payroll, compliance, performance & training resources, EPLI", "Premiums; specialty consulting and retained recruiting; premium service intensity is priced into the fee itself"],
            ["TriNet", "Custom PEPM, often by industry vertical", "Payroll & tax admin, benefits administration, compliance, vertical-specific HR expertise, platform", "Premiums; enhanced HR service tiers; certain time/recruiting products as add-ons"],
            ["Paychex PEO", "Custom quote, frequently framed alongside payroll bundles", "Payroll, HR generalist support, compliance, benefits administration", "Premiums; time & attendance and recruiting modules; watch the payroll-bundle framing in comparisons"],
            ["CoAdvantage", "Custom quote; PEPM or % of payroll", "Payroll & tax admin, CoAdQuantum platform, benefits administration, WC claims & safety support, HR compliance guidance", "Premiums; recruiting, performance-management and other add-on programs; verify current CPEO/ESAC credential status"],
            ["Justworks", "Published flat PEPM — Basic and Plus tiers (volume discounts at headcount breaks); 3 WSE minimum; month-to-month, no setup fees", "Basic: payroll, compliance, WC administration, 401(k) access, HR tools, 24/7 support", "Master medical/dental/vision access requires the Plus tier — recently raised from $109 to ~$129 PEPM; premiums always extra; time tracking, international contractors, and marketplace perks billed per item"],
            ["Rippling", "Modular: base platform PEPM plus per-module fees; PEO service custom-quoted on top", "Software platform (HR records, workflows); PEO quote includes payroll, tax filing, WC and EPLI coverage, compliance support", "Nearly everything is a module — benefits admin, time, IT, spend each add PEPM; implementation fees can apply; premiums extra. Strength and risk in one design: pay for what you use, but the stack adds up"],
          ]},
          { t: "p", x: "Two disciplines turn this matrix into wins. First, normalize before comparing: convert every structure to effective PEPM on the same census, then list what that PEPM actually buys at each provider. A $59 fee without master-plan access, a $109 fee with it, a custom bundled rate hiding the fee entirely, and a modular stack that grows per feature are four different products wearing one label. Second, ask the inclusion question out loud in every deal — 'walk me through exactly what the administrative fee covers, and show me the add-on price list' — because the answer is the comparison." },
          { t: "callout", tag: "ALWAYS EXTRA — EVERYWHERE", x: "No admin fee at any PEO includes: gross wages, employer taxes (FICA, FUTA, SUTA), health/dental/vision premiums, workers' comp premium, state-mandated coverages, or 401(k) employer contributions. Any proposal implying otherwise is blending, not including — unbundle it." },
        ],
      },
      {
        title: "A positioning framework",
        blocks: [
          { t: "p", x: "Every PEO deal is won by matching the buyer's dominant need to the right archetype. Three axes cover most of it:" },
          { t: "list", items: [
            "Service vs software. Does this buyer want a named HR partner and white-glove handling, or a clean product they mostly self-serve? Founders who hate vendors lean software; owners who hate HR lean service.",
            "Benefits vs cost. Is the deal driven by richer plans for recruiting, or by total cost reduction? Lead the proposal with whichever the discovery surfaced — not with your favorite slide.",
            "Simplicity vs complexity. Multi-state, high e-mod, certified payroll, tough class codes → depth and underwriting muscle. Ten salaried employees in one state → speed and transparency.",
          ]},
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"There's no best PEO — there's a best PEO for your census, your states, your class codes, and your renewal. Let me show you how I'd match it.\"" },
        ],
      },
    ],
    quiz: [
      { q: "Which PEO is best known for a premium, service-intensive model and is priced accordingly?", opts: ["Justworks", "Insperity", "Rippling", "Paychex PEO"], a: 1, x: "Insperity leads with service depth and HR consulting intensity. It wins relationship buyers and is most exposed on price transparency and tech experience." },
      { q: "Justworks' core differentiator in the market is:", opts: ["Vertical industry practices", "The largest WSE count", "Published, transparent flat PEPM pricing with a self-serve experience", "Specialty workers' comp programs"], a: 2, x: "Transparent flat PEPM pricing is the Justworks weapon — it converts a traditionally opaque sale into a published-price one, which is devastating against bundled quotes." },
      { q: "Rippling's distinctive PEO claim is:", opts: ["You can turn the PEO off and stay on the same software platform", "It guarantees the lowest comp rates", "It only serves companies over 500 employees", "It includes a staffing agency"], a: 0, x: "The PEO-as-toggle pitch addresses the exit fear directly: leave co-employment without re-implementing systems. Probe service depth when competing against it." },
      { q: "A 9-person fully-remote software startup wants benefits live in three weeks and hates sales calls. The archetype most likely to fit:", opts: ["A premium service-heavy national", "A regional PEO with specialty comp programs", "A transparent-PEPM, self-serve, tech-forward PEO", "An ASO"], a: 2, x: "Small, simple, young, speed-sensitive, software-native — the tech-forward transparent-pricing profile. Match the archetype to the buyer, not the buyer to your archetype." },
      { q: "The main caution to understand about the regional PEO tier right now:", opts: ["Regionals can't offer health benefits", "Roll-up acquisitions can change a client's service and pricing reality after signing", "Regionals are not legal in most states", "They cannot hold CPEO status"], a: 1, x: "Aggregators have been consolidating regionals for years. Ownership trajectory is part of due diligence — a great local PEO today may be a platform brand tomorrow." },
      { q: "Why does a payroll-native player entering PEO (e.g., upselling an existing payroll base) represent a structurally different sales motion?", opts: ["It avoids state licensing", "Distribution: it sells co-employment into an installed base it already serves, rather than cold-acquiring clients", "Payroll companies are exempt from underwriting", "It eliminates the CSA"], a: 1, x: "Selling an upgrade into an existing, trusting customer base is cheaper and faster than net-new acquisition. It changes CAC, sales cycle, and who controls the relationship." },
      { q: "A client compares Justworks Basic at ~$59 PEPM against a competitor's fee and asks why it's so cheap. The key packaging fact:", opts: ["Justworks includes health premiums at that price", "Master medical/dental/vision access requires the Plus tier — Basic doesn't include the benefits engine most PEO buyers are actually shopping for", "Basic includes dedicated HR business partners", "There is no difference between tiers"], a: 1, x: "Basic covers payroll, compliance, WC admin, and HR tools; large-group health access is what the Plus tier buys — recently raised from $109 to ~$129 PEPM. Comparing Basic's fee to a benefits-inclusive structure is the classic inclusions mistake." },
      { q: "Which costs are NEVER inside any PEO's administrative fee, at any provider?", opts: ["Compliance support and tax filing", "Payroll processing", "Gross wages, employer taxes, insurance premiums, and 401(k) employer contributions", "HR technology platform access"], a: 2, x: "Wages, statutory taxes, and premiums are always pass-throughs (or spread-bearing pass-throughs). A proposal implying they're 'included' is blending them into a bundled rate — your cue to unbundle." },
    ],
  },
  {
    id: "sales",
    num: "05",
    title: "Sales Process & Objection Handling",
    tagline: "Discovery artifacts, the proposal moment, the five objections, and the close.",
    lessons: [
      {
        title: "Discovery that wins deals",
        blocks: [
          { t: "p", x: "PEO deals are won in discovery, because the proposal is only as honest as the data behind it. Collect the artifacts, not just the feelings:" },
          { t: "list", items: [
            "Census — every employee, age, zip, salary, state. This drives benefits underwriting and every cost model.",
            "Current benefits — plan summaries, current rates, renewal date, and the last two renewal increases. The renewal date sets your deal clock.",
            "SUI rate notices — the client's actual statutory unemployment rates by state. Your unbundling weapon.",
            "Workers' comp dec page and e-mod worksheet — class codes, payroll by code, current rates, mod history.",
            "A full current invoice — payroll provider or incumbent PEO. You can't beat a number you've never seen.",
          ]},
          { t: "p", x: "Then the qualitative layer: what triggered this conversation? A compliance scare, a brutal renewal, a key hire demanding better benefits, a new state? The trigger tells you what the proposal must lead with." },
          { t: "callout", tag: "FIELD NOTE", x: "The best timing trigger in this industry is the benefits renewal, 60–120 days out. Build your prospecting calendar around renewal dates the way realtors build theirs around lease expirations." },
        ],
      },
      {
        title: "The proposal moment",
        blocks: [
          { t: "p", x: "Most PEO proposals lose because they compare the PEO's bundle to the client's payroll invoice — apples to a fruit basket. The winning frame is total cost of employment: everything the client pays today to employ people (payroll fees, benefits premiums and broker costs, comp premium and audit true-ups, HR tools, plus the owner's own time) against everything in your proposal, line by line." },
          { t: "list", items: [
            "Unbundle the incumbent first. If they're with a bundled-billing PEO, decompose the blended rate before showing yours. The reveal of the real admin fee often does more work than your price does.",
            "Normalize the structures. Convert everything to effective PEPM, same census, same plan tiers. Never let two quotes with different rate structures sit side by side unconverted.",
            "Show the year-two story. Rate structure, renewal philosophy, and what happens to percent-of-payroll fees as compensation grows. Buyers remember the person who told them the truth about year two.",
          ]},
        ],
      },
      {
        title: "The five objections",
        blocks: [
          { t: "p", x: "Every PEO objection you'll ever hear is a variation of five. Master these as conversations, not scripts:" },
          { t: "list", items: [
            "\"I'll lose control of my employees.\" Direction and control stay with the owner — hiring, firing, pay, management. What transfers is administrative employer status. Make it concrete: nothing about Monday morning changes except who files the taxes.",
            "\"It's too expensive.\" Compared to what? Build the total-cost-of-employment table. Most buyers compare the PEO's all-in number to their payroll fee alone and forget benefits, comp, and the 10 hours a week the owner spends on HR.",
            "\"We already have a broker.\" Don't fight the broker — qualify the relationship. Many deals run through or alongside brokers; if the broker is entrenched, position the comparison through them. A broker who refuses to let the client see a PEO option is telling the client something.",
            "\"What if we want to leave?\" Answer honestly: there's an exit, it has timing (year-end is cleanest for wage bases), benefits transition needs planning, and certified PEOs remove the federal restart penalty. Honesty here closes more deals than evasion ever will.",
            "\"My employees won't like the change.\" For most groups, benefits get richer and the employee experience improves. Offer an employee-facing transition session as part of implementation — turning the objection into a deliverable.",
          ]},
          { t: "p", x: "A sixth objection arrives from the most sophisticated buyers and their advisors: \"the PEO will own my data.\" Payroll history and workers' comp loss runs often sit with the PEO, and a client who exits without its loss history can face worse standalone insurance pricing later. Take it seriously rather than waving it off: know your PEO's data-portability and loss-run release practices cold, get them in writing during the sale, and let the unflinching answer itself do the selling — the rep who handles the data question calmly is the rep who clearly understands exits." },
        ],
      },
      {
        title: "Closing & implementation",
        blocks: [
          { t: "p", x: "PEO sales cycles die in single-threaded deals. The owner cares about cost and risk, the office manager cares about workload, employees care about their doctors staying in-network. Multi-thread early: get the operational person into the demo and the owner into the cost review." },
          { t: "list", items: [
            "Anchor to a date. Benefits renewal or January 1. Open enrollment, comp binding, and payroll cutover all chain backwards from it — a deal without a start date is a pipeline fiction.",
            "Set implementation expectations honestly. Data collection, benefits enrollment, first payroll. The first payroll run is the trust milestone; over-communicate until it lands clean.",
            "Stay in the room after the close. The first renewal is where clients are won for a decade or lost to the next rep running your own unbundling play against you.",
          ]},
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"My job isn't to sell you a PEO. It's to make sure the version of this you're living with in year three is the one you thought you bought.\"" },
        ],
      },
    ],
    quiz: [
      { q: "Which set of discovery artifacts gives you what you need to build an honest cost comparison?", opts: ["Mission statement and org chart", "Census, current benefit rates and renewal date, SUI rate notices, comp dec page/e-mod, and a full current invoice", "Last year's tax return", "The employee handbook"], a: 1, x: "Those five artifacts drive underwriting and unbundling. Without them, your proposal is an estimate competing against another estimate." },
      { q: "A prospect says, \"I don't want some PEO controlling my people.\" The accurate response centers on:", opts: ["Offering a discount", "Explaining that direction and control of day-to-day work stays entirely with the owner; the PEO is the administrative employer", "Agreeing that control is shared 50/50", "Suggesting an EOR instead"], a: 1, x: "The control objection is answered by the structure itself. Hiring, firing, pay, and management never leave the client. Make Monday morning concrete." },
      { q: "The strongest frame for handling \"it's too expensive\" is:", opts: ["Matching the competitor's price", "Total cost of employment: everything they pay today across payroll, benefits, comp, and owner time vs. the proposal, line by line", "Extending the contract term", "Removing benefits from the quote"], a: 1, x: "Most buyers compare your all-in number to their payroll fee alone. Rebuild the full current-state cost stack first; the comparison usually flips." },
      { q: "The most honest and effective answer to \"what if we want to leave?\" includes:", opts: ["\"Nobody ever leaves\"", "Refusing to discuss exit before signing", "Explaining exit timing (year-end is cleanest), benefits transition planning, and CPEO protection against federal wage-base restart", "Pointing to the termination fee"], a: 2, x: "Exit honesty is a trust accelerant. Buyers who hear a straight answer about leaving become dramatically more comfortable arriving." },
      { q: "The best-timed prospecting trigger in PEO sales is:", opts: ["The client's fiscal year-end", "60–120 days before the benefits renewal", "Right after open enrollment closes", "The day SUI notices arrive"], a: 1, x: "Renewal shock is the moment pain, budget, and deadline align. Build the prospecting calendar around renewal dates." },
      { q: "Why multi-thread a PEO deal?", opts: ["To increase the contract value", "Owner, operator, and employees each hold different concerns (cost/risk, workload, benefits continuity) — any one of them can stall a single-threaded deal", "Because CSAs require multiple signatures", "To shorten implementation"], a: 1, x: "Deals die when the person you never met raises the concern you never addressed. Get the operational buyer into the demo early." },
      { q: "A prospect's CPA warns: 'Don't sign — the PEO will own your payroll data and comp loss runs.' The strongest response:", opts: ["Dismiss it — data ownership never matters in practice", "Acknowledge it's a real consideration, present the PEO's data-portability and loss-run release practices in writing during the sale, and let the prepared answer itself build trust", "Offer a discount to change the subject", "Promise the CPA the data always stays with the client, regardless of the CSA"], a: 1, x: "Data ownership is the sophisticated buyer's objection, and it's legitimate: exiting without loss history can mean worse standalone insurance pricing. The rep who answers it calmly, in writing, before being pressed is the rep who clearly understands exits — and wins the CPA as an ally." },
      { q: "The most defensible way to use industry benchmarks (27% ROI, 2x growth, 12% lower turnover) in a live deal:", opts: ["Present them as guaranteed outcomes for this prospect", "Quote them as NAPEO-commissioned industry research to frame the category, then close on the prospect's own census, invoices, and renewal history", "Avoid statistics entirely — they sound like marketing", "Save them for after the contract is signed"], a: 1, x: "Benchmarks frame the category; the prospect's own numbers close the deal. Promising benchmark results to a specific client is a credibility loan you'll repay at renewal — the unbeatable rep uses both layers in their proper roles." },
    ],
  },
];

/* ============================================================
   COMPONENTS
   ============================================================ */

function Block({ b }) {
  if (b.t === "p") return <p>{b.x}</p>;
  if (b.t === "list") return <ul>{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
  if (b.t === "callout") return (
    <div className="callout"><span className="tag">{b.tag}</span>{b.x}</div>
  );
  if (b.t === "table") return (
    <div style={{ overflowX: "auto" }}>
      <table className="ledger-table">
        <thead><tr>{b.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
  return null;
}

function Quiz({ mod, onPass, onExit }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const qs = mod.quiz;
  const q = qs[idx];
  const passMark = Math.ceil(qs.length * 0.8);

  const pick = (i) => { if (picked !== null) return; setPicked(i); if (i === q.a) setScore((s) => s + 1); };
  const next = () => {
    if (idx + 1 >= qs.length) { setDone(true); if (score >= passMark) onPass(score); }
    else { setIdx(idx + 1); setPicked(null); }
  };
  const retake = () => { setIdx(0); setPicked(null); setScore(0); setDone(false); };

  if (done) {
    const passed = score >= passMark;
    return (
      <div className="card">
        <div className="score-wrap">
          <div className="score-num" style={{ color: passed ? "var(--stamp-green)" : "var(--stamp-red)" }}>
            {score}/{qs.length}
          </div>
          <div className="score-label">{passed ? "Module certified" : `Need ${passMark}/${qs.length} to certify`}</div>
          {passed && (
            <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 20px" }}>
              <div className="seal big">CERTIFIED<br />{mod.num}</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {!passed && <button className="btn primary" onClick={retake}>Retake quiz</button>}
            <button className="btn ghost" onClick={onExit}>Back to course</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="q-count">QUESTION {idx + 1} / {qs.length} · PASS AT {passMark}/{qs.length}</div>
      <p className="q-text">{q.q}</p>
      {q.opts.map((o, i) => {
        let cls = "opt";
        if (picked !== null) {
          if (i === q.a) cls += " correct";
          else if (i === picked) cls += " wrong";
        }
        return (
          <button key={i} className={cls} disabled={picked !== null} onClick={() => pick(i)}>
            <span className="opt-key">{String.fromCharCode(65 + i)}</span>{o}
          </button>
        );
      })}
      {picked !== null && (
        <div className={picked === q.a ? "explain" : "explain miss"}>
          <span className="tag" style={{ color: picked === q.a ? "var(--stamp-green)" : "var(--stamp-red)" }}>
            {picked === q.a ? "CORRECT" : "NOT QUITE"}
          </span>
          {q.x}
        </div>
      )}
      <div className="btn-row">
        <button className="btn ghost" onClick={onExit}>Exit quiz</button>
        {picked !== null && (
          <button className="btn primary" onClick={next}>
            {idx + 1 >= qs.length ? "See result" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}

function ModuleView({ mod, progress, onLessonDone, onPass, onHome }) {
  const [pos, setPos] = useState(0); // lesson index, or lessons.length = quiz
  const atQuiz = pos === mod.lessons.length;
  const lesson = mod.lessons[pos];

  const goNext = () => { onLessonDone(mod.id, pos); setPos(pos + 1); };

  return (
    <div className="shell">
      <button className="crumb" onClick={onHome}>← COURSE INDEX</button>
      <div className="kicker">MODULE {mod.num}</div>
      <h1 className="serif" style={{ fontSize: 30, fontWeight: 600, margin: "0 0 16px" }}>{mod.title}</h1>
      <div className="lesson-nav">
        {mod.lessons.map((l, i) => (
          <button
            key={i}
            className={"lesson-pill" + (i === pos ? " active" : "") + (progress.lessons.has(i) ? " done" : "")}
            onClick={() => setPos(i)}
          >
            {i + 1}. {l.title}
          </button>
        ))}
        <button className={"lesson-pill quiz" + (atQuiz ? " active" : "") + (progress.passed ? " done" : "")} onClick={() => setPos(mod.lessons.length)}>
          ✓ Certification quiz
        </button>
      </div>

      {atQuiz ? (
        <Quiz mod={mod} onPass={(s) => onPass(mod.id, s)} onExit={onHome} />
      ) : (
        <div className="card">
          <div className="kicker">LESSON {pos + 1} OF {mod.lessons.length}</div>
          <h2>{lesson.title}</h2>
          <div style={{ marginTop: 14 }}>
            {lesson.blocks.map((b, i) => <Block key={i} b={b} />)}
          </div>
          <div className="btn-row">
            <button className="btn ghost" onClick={() => (pos === 0 ? onHome() : setPos(pos - 1))}>
              {pos === 0 ? "Back" : "Previous lesson"}
            </button>
            <button className="btn primary" onClick={goNext}>
              {pos + 1 === mod.lessons.length ? "Go to certification quiz" : "Next lesson"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ============================================================
   MICROSITE TABS
   ============================================================ */

const TABS = [
  { id: "about", label: "About Gabe" },
  { id: "agent", label: "PEO Targeting Agent" },
  { id: "course", label: "PEO Certification" },
  { id: "landscape", label: "Competitors" },
  { id: "swot", label: "Market SWOT" },
  { id: "construct", label: "Gusto PEO Construct" },
  { id: "gtm", label: "Go-To-Market" },
  { id: "keys", label: "What Makes a PEO Win" },
  { id: "plan", label: "90-Day Plan" },
];

function AboutTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">CANDIDATE · HEAD OF PEO SALES</div>
        <h1>Gabriel Revnew<span className="hl">.</span><br />PEO operator, builder, player-coach.</h1>
        <p className="lede">
          Eight years selling and leading PEO sales at TriNet — Sales Leader of the Year,
          top Sales Director in % to plan four years running — plus founder of an independent
          PEO brokerage and a forensic proposal-audit product. I've sold this category from
          inside a national PEO, brokered it independently, and built software to take it
          apart line by line.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat"><div className="v">Leader of the Year</div><div className="l">TriNet Sales Leader of the Year, 2022–23</div></div>
        <div className="stat"><div className="v">128%</div><div className="l">Of plan FY2025–26 · Top Sales Director % to plan, 2022–2025</div></div>
        <div className="stat"><div className="v">7×</div><div className="l">Summit Achiever at 150%+ of quota (2019–2025)</div></div>
        <div className="stat"><div className="v">9/9</div><div className="l">Consultants achieved President's Club, 2023–24</div></div>
        <div className="stat"><div className="v">35%+</div><div className="l">YoY growth, five consecutive years</div></div>
        <div className="stat"><div className="v">2 products</div><div className="l">PEOLens proposal audits · PEO Targeting Agent</div></div>
      </div>

      <div className="card">
        <div className="kicker">TRACK RECORD</div>
        <h2>Career</h2>
        <div className="timeline" style={{ marginTop: 18 }}>
          <div className="t-item">
            <div className="t-when">AUG 2018 — PRESENT · DENVER</div>
            <div className="t-role">TriNet — Regional Sales Consultant → Regional Director of Sales</div>
            <p className="t-desc">Nearly eight years selling and leading PEO sales. As Regional Director, ran a player-coach, metrics-driven, consultant-style motion: discovery artifacts before proposals, unbundled comparisons, honest year-two conversations.</p>
            <ul className="t-list">
              <li><b>TriNet Sales Leader of the Year (2022–23)</b> — the company's top sales leadership honor</li>
              <li><b>Top Sales Director in % to plan, 2022–2025</b> — including <b>128% of plan</b> in FY2025–26</li>
              <li><b>9/9 consultants</b> on the team achieved President's Club, 2023–24</li>
              <li><b>35%+ year-over-year growth</b>, five consecutive years</li>
              <li><b>7× Summit Achiever</b> at 150%+ of quota (2019–2025)</li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">SEP 2016 — AUG 2018 · BOULDER, CO</div>
            <div className="t-role">CollegiateParent — Director of Sales</div>
            <p className="t-desc">Brought in post-acquisition to build the sales department from zero — first experience building both a sales motion and a product line rather than inheriting them.</p>
            <ul className="t-list">
              <li>Recruited, hired, and coached <b>6 inside & outside reps</b>; instrumented performance metrics across the full funnel</li>
              <li>Grew company sales <b>50% in year one</b></li>
              <li>Built and launched <b>College Parent Magazine</b> — distributed across <b>35 collegiate campuses</b> nationwide at <b>500,000+ copies</b> — driving <b>$1MM+ in additional first-year revenue</b></li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">2013 — 2016 · CHAPEL HILL, NC</div>
            <div className="t-role">AroundCampus Group — Sales Team Leader → Senior Regional Manager</div>
            <p className="t-desc">Started as a sales intern ranked <b>#9 of 690 nationally</b> (#1 in region), then promoted four times in three years.</p>
            <ul className="t-list">
              <li>Ranked <b>#1 of 18 Regional Managers</b>; grew regional sales <b>26% ($300K+)</b></li>
              <li>Recruited and trained the <b>top 4 nationally ranked reps out of 760</b></li>
              <li>Built and delivered sales training to <b>650+ sales interns</b> through the Sales Foundation Academy</li>
              <li>As Regional Sales Manager: <b>103% of a $641K regional goal</b>, up <b>25% YoY</b>, while hiring and training <b>45 reps</b></li>
              <li>Inside sales season: <b>$185K in 6 weeks at 150% of goal</b> — #1 of 10 reps</li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">MAR 2026 — PRESENT · STEALTH MODE</div>
            <div className="t-role">PEO Consulting Partners & PEOLens — Founder</div>
            <p className="t-desc">Launched in stealth in March 2026 and deliberately non-active — currently building fundamentals, with one proof-of-concept client placed. The build is the point:</p>
            <ul className="t-list">
              <li>Independent brokerage platform covering <b>28 PEOs across 46 states</b> — comparison engine, savings calculator, PEO directory, referral portal, full SEO/content system</li>
              <li><b>PEOLens</b> — forensic proposal-audit tool that normalizes competing quotes to a canonical cost ontology and exposes the real admin fee inside bundled rates</li>
              <li>The unbundling discipline taught in this site's certification course, productized</li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">FOUNDATION</div>
            <div className="t-role">Pennsylvania Army National Guard — Combat Medic Team Leader</div>
            <p className="t-desc">Led a medic team while completing an A.A. at Valley Forge Military College and a degree in Economics at Penn State. Leadership under pressure, learned early.</p>
          </div>
        </div>

        <h3>Why this role, why me</h3>
        <p>
          Gusto's PEO is a distribution play: selling co-employment into an installed base that
          already trusts the platform, amplified through the accountant channel. That motion needs a
          leader who knows the PEO category cold — underwriting, pricing mechanics, competitive
          teardowns — and who builds systems, playbooks, and reps rather than just carrying a bag.
          That intersection is exactly where I've spent the last eight years.
        </p>
        <p>
          And there's a pattern underneath it: I've launched a revenue-generating product at
          every stop — College Parent Magazine ($1MM+ in year one), PEO Consulting Partners,
          PEOLens, and the PEO Targeting Agent built live during this process. Gusto is
          launching a product. I launch products.
        </p>
        <div className="callout"><span className="tag">SALES PHILOSOPHY</span>
          Player-coach. Metrics over vibes. Consultants, not pitchmen: reps who can read a census,
          unbundle an invoice, and tell a buyer the truth about year two — because that's what
          retains the book that makes PEO economics work.
        </div>
      </div>
    </div>
  );
}

function AgentTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">BUILT LIVE DURING THIS PROCESS</div>
        <h1>The PEO Targeting Agent<span className="hl">.</span></h1>
        <p className="lede">
          A working Next.js application built during this interview process: it scores SMB payroll
          accounts for PEO propensity and hands reps a ranked, reasoned target list — the
          in-base upsell motion, productized.
        </p>
      </div>

      <div className="card">
        <div className="kicker">WHAT IT DOES</div>
        <h2>From payroll base to PEO pipeline</h2>
        <ul style={{ marginTop: 14 }}>
          <li><b>ICP scoring.</b> Ranks accounts on PEO propensity signals: headcount band (the 5–100 sweet spot), multi-state footprint, industry and class-code profile, benefits-seeking behavior, and growth trajectory.</li>
          <li><b>Ranked target lists.</b> Reps start each day with the accounts most likely to convert, with the reasons attached — not a flat alphabetical book.</li>
          <li><b>Talk-track generation.</b> Each target gets a tailored opening built on its specific signals: the new state they just registered in, the headcount they just crossed, the renewal window they're entering.</li>
        </ul>
        <h3>Why it matters for this role</h3>
        <p>
          Gusto's structural advantage is distribution — co-employment sold into an existing,
          trusting base changes CAC, cycle length, and who controls the relationship. But an installed
          base is only an advantage if it's prioritized intelligently. This agent is the prioritization
          layer, and it's also the centerpiece of the 90-day plan's pilot motion: score the base,
          pull a pilot cohort, run the playbook, codify what closes.
        </p>
        <div className="callout"><span className="tag">THE POINT</span>
          I didn't make a slide about the in-base motion. I shipped it.
        </div>
      </div>
    </div>
  );
}

function LandscapeTab() {
  const comps = [
    { name: "ADP TotalSource", pos: "The biggest PEO, inside the biggest payroll company.",
      good: ["Scale: largest PEO by WSE count, with the brand safety that comes with it", "Deep benefits buying power and a full ecosystem (retirement, tax credits, international)", "Massive broker and referral reach"],
      bad: ["Outdated technology and limited self-serve — clients often can't even generate their own reports and must request them from their assigned service contact", "Percent-of-payroll bundled rates: every raise, bonus, or commission a client gives employees gives ADP the exact same raise, with no added service", "Bundled, opaque pricing — the blended rate hides the real admin fee", "Service is thin and varies widely by account team", "Heavy machinery for a 15-person company"],
      win: "Two demos win this deal. First, run a report live, self-serve, in seconds — then let the buyer remember emailing their ADP rep and waiting. Second, do the escalator math on their own comp plan: project next year's raises and bonuses and show ADP's fee rising with every one of them, versus a flat published PEPM. Then unbundle the blended rate so it confesses its admin fee. Don't out-enterprise ADP; out-simple them." },
    { name: "Insperity", pos: "The premium, service-heavy incumbent.",
      good: ["Genuinely deep high-touch service: dedicated HR specialists and real consulting", "Strong mid-market retention and brand among relationship buyers", "Rich training, development, and performance resources"],
      bad: ["By far the most expensive PEO in most head-to-head comparisons", "Fee stacking: Workers' Comp & EPLI fee, co-employment risk fee, benefit admin fee, technology service fee, the Insperity markup — and more, each its own line", "Premium shifting: real benefit premium dollars migrate into those fee lines, so the displayed premium looks dramatically cheaper than identical competitor plans", "Technology challenges on par with ADP — underwriting intake can be as low-tech as dropping documents into a Dropbox folder for a quote"],
      win: "Reassemble the quote in front of the buyer. If the true premium is $500, Insperity can shift $70 into the benefit admin fee and $50 into the co-employment risk fee — then show up at $380 against everyone else's $500 for the same plan. Buyers anchor on the premium line and Insperity wins on a number that was never real. Move the dollars back, total every line per employee per month, and compare totals only. Then put the platform side by side — a Dropbox-intake underwriting process is not a technology story that survives a Gusto demo." },
    { name: "TriNet", pos: "The all-inclusive platform with a vertical pitch.",
      good: ["Genuinely all-inclusive platform: payroll, job postings and hiring, performance management, file and certification management — one system covering the employee lifecycle", "Reporting is a true strength: deep custom reports that can be saved and auto-scheduled — power admins love it", "Benefit breadth: regional plan menus put 14–16 plans in front of each client per state where they have employees, with Healthee, an AI tool, guiding employees through enrollment", "Strong VC/startup brand and vertical positioning (tech, life sciences, financial services, nonprofits)"],
      bad: ["The vertical pitch is positioning, not product: reps receive no true industry training and every 'industry platform' is exactly the same underneath", "Service tiering: clients under 50 employees are routed to a pooled HR service center — only 50+ get designated assigned support, yet under-50 is most of the market", "EPLI is 'included' — with a $75,000 deductible. Most everyday SMB employment claims land below it, so clients effectively self-insure the claims they'll actually have", "Regional benefit rating: every region carries different rates, so multi-state clients live with rate variance and quoting complexity", "Renewal escalations and pricing opacity remain the most common client complaints"],
      win: "Gusto's payroll base IS TriNet's future pipeline — startups graduate from Gusto payroll into TriNet. Intercept the graduation with the in-base trigger motion, and attack on three specifics. One: the under-50 service gap — TriNet pools exactly the segment Gusto's base lives in; sell reachable humans plus self-serve to the under-50 buyer. Two: puncture the vertical pitch with a single question — 'what's actually different about the platform for my industry?' Three: ask what the EPLI deductible is, then do the math out loud — $75K means self-insuring the everyday claim. And respect what's real: TriNet's reporting bar (saved, auto-scheduled custom reports) is the product feature Gusto must match to win power admins — feed that to product early." },
    { name: "Paychex PEO", pos: "The closest strategic mirror: payroll base, cross-sell motion.",
      good: ["Installed payroll base with an upsell motion — structurally the same play Gusto is running", "Branch and broker distribution; ASO/PEO flexibility lets them match buyer readiness", "Established comp programs"],
      bad: ["PEO is a secondary motion inside a payroll company — focus and rep fluency vary", "Dated platform experience", "Pooled, transactional service model"],
      win: "This is the matchup that proves whose conversion motion is better. Win it on execution quality: sharper in-base targeting, PEO-fluent (certified) reps instead of payroll reps with a PEO SKU, cleaner packaging, and the accountant channel as a genuine partner lane rather than a referral afterthought." },
    { name: "Justworks", pos: "The 'affordable PEO' — whose price just went up.",
      good: ["Won the market by advertising as the affordable PEO with published, transparent PEPM — the category's most disruptive weapon", "3 WSE minimum opens the micro-SMB segment most PEOs won't touch", "Decent technology; fast, self-serve buying and implementation; SMB/startup brand affinity"],
      bad: ["Just raised Plus pricing from $109 to $129 PEPM — an ~18% increase that erodes the entire 'affordable' brand promise", "Thin hands-on HR service as groups grow complex", "Limited workers' comp appetite for tougher class codes", "Cold acquisition: every customer must be won from scratch"],
      win: "Their brand is affordability and they just raised prices 18% — that mantle is being vacated in real time, and Gusto should take it: publish aggressive launch pricing and own 'the transparent, affordable PEO' before anyone else claims it. Match or beat the 3 WSE minimum to own micro-SMB, where Gusto's payroll base is deepest. Then press the structural edge: upselling a trusting base beats cold acquisition on CAC and cycle length every single time, with payroll-to-PEO continuity no new vendor can offer." },
    { name: "Rippling", pos: "The best technology in the industry — with very limited service behind it.",
      good: ["Probably the best tech in the category: platform breadth across HR, IT, and finance with real automation — concede this honestly, because pretending otherwise costs credibility", "Competitive price point: the PEO typically lands around $99 PEPM", "The PEO toggle-off story directly answers exit fear", "Fast-shipping product org; strong with technical buyers"],
      bad: ["Very limited service — software-first means human support is thin exactly when a co-employment client needs a person", "Modular pricing stacks on top: per-module fees quietly outgrow all-in quotes", "Platform sprawl overwhelms the typical Main Street owner"],
      win: "Don't fight the tech claim — reframe what's being bought. A PEO isn't software; it's an employer relationship, and the moment a client has a comp claim, a termination, or a benefits crisis, 'very limited service' becomes the whole product. Sell reachable humans plus continuity, total their module stack next to the $99 headline, and let Rippling keep the IT-buyer who wants to administer everything themselves." },
    { name: "CoAdvantage", pos: "Mid-market hustle and underwriting flexibility.",
      good: ["Flexible underwriting and willingness to customize, including tougher comp risk", "Personalized mid-market service posture", "Structural flexibility: PEPM or percent-of-payroll"],
      bad: ["Smaller benefits scale and carrier leverage than the nationals", "Platform experience trails the tech-forward tier", "Limited brand awareness; custom-quote opacity"],
      win: "The platform and brand gaps are widest here — lead with product experience and national trust, and put published pricing against custom-quote opacity. Concede the tough-class-code deals their underwriting hustle wins; that's risk Gusto's early book shouldn't want anyway." },
  ];
  const matrixLesson = COURSE.find((m) => m.id === "landscape").lessons.find((l) => l.title.includes("inclusions matrix"));
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">KNOW THE ENEMY</div>
        <h1>Competitors<span className="hl">.</span></h1>
        <p className="lede">
          Each major PEO, what they're genuinely good at, where they're weak — and the specific
          play Gusto runs to beat them. Respect first, then the wedge.
        </p>
      </div>
      {comps.map((c) => (
        <div className="card" key={c.name} style={{ marginBottom: 14 }}>
          <div className="kicker">{c.pos}</div>
          <h2>{c.name}</h2>
          <div className="vs-grid">
            <div className="vs-col good">
              <h4>What they're good at</h4>
              <ul>{c.good.map((g, i) => <li key={i}>{g}</li>)}</ul>
            </div>
            <div className="vs-col bad">
              <h4>Where they're weak</h4>
              <ul>{c.bad.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          </div>
          <div className="win"><span className="tag">HOW GUSTO WINS</span>{c.win}</div>
        </div>
      ))}

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">ACROSS EVERY MATCHUP</div>
        <h2>Overcoming the challenges</h2>
        <ul style={{ marginTop: 14 }}>
          <li><b>New-entrant trust.</b> Race to CPEO certification and lead with it — sole federal tax liability converts "why trust the new guy with my payroll taxes?" into a statute. Publish the renewal philosophy in writing; no incumbent will match it.</li>
          <li><b>Benefits scale.</b> Carrier leverage grows with the book, so protect the book: disciplined new-business underwriting over heroic year-one rates. Sell what the plans are honestly great at today; never buy a deal with benefits pricing the renewal can't sustain.</li>
          <li><b>Adverse selection.</b> The deals competitors decline will find Gusto first. Align sales comp with underwriting quality from day one, and treat every declined deal as calibration, not friction.</li>
          <li><b>Broker conflict.</b> Don't pretend brokers don't exist; write clear rules of engagement — and build the accountant channel as Gusto's own lane, where no broker relationship is being threatened.</li>
          <li><b>Category education.</b> Most of the base doesn't know what a PEO is. The rep team that can teach co-employment simply and honestly (the certification course on this site) converts a market the incumbents have to buy.</li>
        </ul>
      </div>

      <div className="card">
        <div className="kicker">REFERENCE</div>
        <h2>{matrixLesson.title}</h2>
        <div style={{ marginTop: 12 }}>
          {matrixLesson.blocks.map((b, j) => <Block key={j} b={b} />)}
        </div>
      </div>
    </div>
  );
}

function SwotTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">MARKET ANALYSIS · GUSTO PEO</div>
        <h1>SWOT<span className="hl">.</span></h1>
        <p className="lede">
          An honest read of Gusto's PEO entry — written the way I'd present it internally,
          not the way a candidate flatters a room.
        </p>
      </div>
      <div className="swot-grid">
        <div className="swot-cell s">
          <h3>Strengths</h3>
          <ul>
            <li><b>Distribution.</b> A massive installed SMB payroll base means the cheapest customer acquisition in the category — upsell, not cold acquisition.</li>
            <li><b>The accountant channel.</b> Partner tiers and People Advisory give Gusto a structural referral engine incumbents rent through brokers.</li>
            <li><b>Brand trust + UX.</b> SMBs already run payroll here; the PEO is an upgrade inside a product they like, not a new vendor to vet.</li>
            <li><b>Transparent-pricing DNA.</b> Gusto can credibly publish PEO pricing — devastating against bundled, opaque incumbent quotes.</li>
          </ul>
        </div>
        <div className="swot-cell w">
          <h3>Weaknesses</h3>
          <ul>
            <li><b>No underwriting track record.</b> Risk selection, claims management, and funds-flow controls are new muscle — and they are the business.</li>
            <li><b>Master plan scale must be built.</b> Carrier leverage and renewal stability grow with the book; year-one books are price-takers.</li>
            <li><b>Service depth for complexity.</b> Multi-state, high e-mod, tough-class-code clients need expertise a payroll-native org is still hiring.</li>
            <li><b>PEO ops maturity.</b> State licensing, CPEO certification, and per-state SUI/comp mechanics take time to operationalize.</li>
          </ul>
        </div>
        <div className="swot-cell o">
          <h3>Opportunities</h3>
          <ul>
            <li><b>Stop the graduation churn.</b> Gusto payroll clients who outgrow software today leave for Justworks, Rippling, or TriNet. A native PEO retains them.</li>
            <li><b>A growing, underpenetrated category.</b> Industry revenue has more than quadrupled since 2012 to ~$414B, yet only ~17% of SMB employers use a PEO — secular growth plus conversion headroom.</li>
            <li><b>Displace opacity.</b> Published pricing plus an unbundling sales motion attacks the incumbents' bundled-rate model at its weakest point.</li>
            <li><b>CPEO as trust accelerant.</b> Certification converts "new entrant" into "federally certified" — a credential worth racing toward.</li>
          </ul>
        </div>
        <div className="swot-cell t">
          <h3>Threats</h3>
          <ul>
            <li><b>The tech-forward incumbents.</b> Justworks owns published-price simplicity; Rippling owns the platform narrative with a PEO toggle. Gusto enters their lane.</li>
            <li><b>Adverse selection.</b> If sales outruns underwriting discipline, the early book fills with risk others declined — and claims arrive before scale does.</li>
            <li><b>Incumbent benefits scale.</b> National master plans and broker relationships are real moats on the deals benefits decide.</li>
            <li><b>Insurance cycles.</b> Medical trend and comp market hardening compress PEO economics industry-wide, hitting young books hardest.</li>
          </ul>
        </div>
      </div>
      <div className="callout" style={{ marginTop: 18 }}><span className="tag">THE STRATEGIC READ</span>
        The strengths and opportunities are distribution-shaped; the weaknesses and threats are
        underwriting-shaped. The winning play is to sell with the distribution advantage while
        building the risk discipline faster than the book grows — which is why the 90-day plan
        pairs the pilot motion with underwriting feedback loops from day one.
      </div>
    </div>
  );
}

function ConstructTab() {
  const tiers = [
    { badge: "GUSTO PEO 1", name: "Full PEO with Benefits", theme: "The flagship: co-employment plus the benefits engine.",
      items: [
        "Complete co-employment: payroll and employment tax administration, workers' comp through the master program, compliance, and HR support",
        "Master health plans — medical, dental, vision — plus HSA/FSA, life, disability, and 401(k): the large-group benefits access that drives most PEO purchases",
        "Published, transparent PEPM — the pricing DNA the incumbents can't match without blowing up their own books",
      ],
      who: "The classic 5–100 employee benefits-driven buyer: multi-state, hiring, losing candidates over benefits, or staring down a brutal small-group renewal.",
      vs: "Head-to-head with Justworks Plus, TriNet, ADP TotalSource, and Insperity — won on distribution, continuity, and honest totals." },
    { badge: "GUSTO PEO 2", name: "Full PEO without Benefits", theme: "Co-employment for clients who keep their own coverage.",
      items: [
        "Everything in the co-employment core — payroll, taxes, workers' comp, compliance, HR — with the client's existing benefits left exactly where they are",
        "Built for groups with a strong broker relationship, coverage they like, participation challenges, or ICHRA arrangements",
        "Not a different pricing philosophy — the same product foundation, platform, and published-pricing approach as PEO 1. The only difference: PEO 1 carries benefit enrollment and the large-group offering, and PEO 2 doesn't",
      ],
      who: "Broker-attached clients, lean teams without group coverage yet, and price-first buyers who still want the compliance and comp burden gone.",
      vs: "This tier quietly solves the broker-conflict problem: the broker keeps the benefits relationship, Gusto takes the administrative employer role — the channel stays a friend. And every PEO 2 client is a natural PEO 1 upgrade at their next benefits renewal." },
    { badge: "GUSTO PEO 3", name: "The Certified PEO Exchange", theme: "Once IRS certification is intact: the trust ceiling.",
      items: [
        "Full CPEO treatment under IRC 3511: Gusto solely liable for federal employment taxes — the IRS cannot come back to the client",
        "Successor-employer status: no FICA/FUTA wage-base restart, making mid-year switches from any competitor mathematically painless",
        "Section 3511(d) credit preservation — R&D payroll offset, WOTC, tip credits stay with the client; Form 8973 reporting handled",
      ],
      who: "Clients who require certification: CFO- and CPA-driven buyers, R&D-credit startups, risk-averse boards, and mid-year movers who'd otherwise wait for January 1.",
      vs: "Only a small minority of PEOs hold IRS certification. PEO 3 turns 'why trust the new entrant?' into 'we're the federally certified option' — and it removes the timing objection from every competitive takeaway deal in the pipeline." },
  ];
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">PRODUCT ARCHITECTURE · PROPOSED</div>
        <h1>The Gusto PEO construct<span className="hl">.</span></h1>
        <p className="lede">
          Three tiers, one platform, one funds-flow and underwriting engine underneath.
          Each tier opens a market the others can't reach — and every client can move
          between payroll and any PEO tier without re-implementation.
        </p>
      </div>
      {tiers.map((t) => (
        <div className="phase" key={t.badge}>
          <div className="phase-head"><span className="phase-days">{t.badge}</span><h3>{t.name}</h3></div>
          <p className="theme">{t.theme}</p>
          <ul>{t.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
          <div className="vs-grid">
            <div className="vs-col good"><h4>Who it's for</h4><p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{t.who}</p></div>
            <div className="vs-col bad"><h4 style={{ color: "var(--guava-deep)" }}>Strategic role</h4><p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{t.vs}</p></div>
          </div>
        </div>
      ))}
      <div className="phase">
        <div className="phase-head"><span className="phase-days">CROSS-TIER PLAY</span><h3>Earned Wage Access</h3></div>
        <p className="theme">A product Gusto should do its best to offer across every tier — and a wedge into the segment the incumbents serve worst.</p>
        <ul>
          <li><b>Huge for blue-collar industries.</b> For hourly workforces — construction trades within appetite, field services, logistics, restaurants, healthcare staffing — access to earned wages before payday is a recruiting and retention weapon that matters more to the employee than a marginally richer health plan.</li>
          <li><b>It opens the market the benefits pitch can't.</b> The incumbents' PEO motion leads with white-collar master plans, yet NAPEO's own client research shows almost half of all PEO clients sit in professional services, manufacturing, or construction — blue-collar is core PEO territory, not adjacent. EWA gives Gusto a benefits-grade headline for the hourly employer, pairing naturally with PEO 2 for clients who keep their own coverage.</li>
          <li><b>Gusto is structurally positioned to do it right.</b> The PEO already runs the funds flow — calculating earned wages in real time and fronting them safely is far more natural for the payroll/PEO platform than for a third-party app bolted onto someone else's data.</li>
          <li><b>Client retention compounds.</b> Employees who rely on EWA push their employers to stay; employers whose workers love a benefit stay with the PEO that provides it. It's stickiness at both layers of the relationship.</li>
        </ul>
      </div>

      <div className="callout"><span className="tag">THE LADDER</span>
        The construct is a graduation machine: payroll clients step up to PEO 2 without touching
        their benefits, PEO 2 clients upgrade to PEO 1 at their renewal, and PEO 3 makes every
        rung available mid-year to anyone, from any competitor, the day certification lands.
        One platform, no re-implementation at any step — the continuity story Rippling markets,
        made native.
      </div>
    </div>
  );
}

function GTMTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">GO-TO-MARKET STRATEGY</div>
        <h1>How Gusto wins this market<span className="hl">.</span></h1>
        <p className="lede">
          Two horizons. Short term, Gusto earns the right to scale: pricing, distribution,
          underwriting, and a certified founding team. Long term, it builds the moats —
          certification, benefits scale, channel, and a retention engine. The sequencing is
          the strategy: every risk gets its control before the throttle opens.
        </p>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">SHORT TERM · MONTHS 0–12</span><h3>Earn the right to scale</h3></div>
        <p className="theme">Prove the motion with the in-base pilot while the operating controls come online.</p>
        <ul>
          <li><b>Publish pricing on day one.</b> PEO 1 and PEO 2 at flat, published PEPM — no bundled rates, ever, as brand law. Justworks just raised Plus ~18% to ~$129; the "transparent, affordable PEO" mantle is being vacated in real time, and Gusto should take it at launch.</li>
          <li><b>Distribution before advertising.</b> The in-base motion is the whole short-term GTM: ICP-score the payroll base (NAPEO: nearly two-thirds of all PEO clients are 10–49 employees — exactly where Gusto's base lives), and work lifecycle triggers — new state registrations, headcount crossings, benefits-seeking signals, renewal windows.</li>
          <li><b>Internal partnership before external motion.</b> Week one belongs to peer sales leaders: written rules of engagement for install-base conversion — who owns the account, how credit and comp are shared, when a payroll AE brings PEO in — so converting the base makes allies of the payroll org, never victims. Co-selling into a shared customer base only works when the peer team wins every time we win.</li>
          <li><b>Plan around the season.</b> PEO selling concentrates September through December ahead of January 1 starts — which means pipeline builds in summer, underwriting and proposal capacity surges in fall, and implementation peaks in December. Season planning with marketing, risk, and ops is a Q3 deliverable, not a December scramble.</li>
          <li><b>An AI operating standard from day one.</b> Every rep works with AI as a daily teammate — agent-driven account prep, the Targeting Agent for prioritization, AI-drafted follow-ups reviewed by a human. Set the expectation in onboarding the way it's been proven inside Gusto's own GTM: build a few high-impact workflows to show what's possible, then teach the team to build their own.</li>
          <li><b>Start the CPEO clock immediately.</b> Certification takes time and PEO 3 waits on it. File early, pursue ESAC in parallel, and market the pursuit itself — "certification in progress" beats silence.</li>
          <li><b>Underwriting before rep five.</b> Deal desk, credit screening, and funds-flow controls live before the sales team scales. The deals competitors decline will find the new entrant first; the controls have to be standing when they arrive.</li>
          <li><b>A small, certified founding team.</b> PEO-fluent consultants — every rep certifies through the Operator Course before touching a prospect — with compensation aligned to underwriting quality, so Gusto scales the book it wants.</li>
          <li><b>Implementation as a named function.</b> First-payroll SLA, over-communication until it lands clean, and a service model of self-serve plus genuinely reachable humans — the under-50 service gap TriNet leaves open.</li>
          <li><b>Accountant channel pilot.</b> A handful of top People Advisory partners, defined referral economics, real feedback — the seed of the long-term moat.</li>
          <li><b>Instrument everything from client one.</b> Funnel stages through underwriting, gross profit per WSE, win/loss, time-to-first-payroll. The day-90 readout becomes the month-12 scaling case.</li>
        </ul>
        <div className="callout"><span className="tag">MONTH-12 BAR</span>A repeatable in-base motion with evidence: pilot cohorts closed and retained, playbook v2 codified from win/loss data, certified rep class producing, channel pilot generating referrals, CPEO application progressing — and zero growth ahead of underwriting.</div>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">LONG TERM · YEARS 2–5</span><h3>Build the moats</h3></div>
        <p className="theme">Convert the early motion into structural advantages competitors can't copy quickly.</p>
        <ul>
          <li><b>Launch PEO 3 the day certification lands.</b> Sole federal tax liability, no wage-base restart, 3511(d) credit preservation — then market mid-year competitive takeaways hard, because the timing objection just died.</li>
          <li><b>Benefits scale with discipline.</b> Carrier leverage grows with the book — protect it by never buying growth with year-one benefits pricing the renewal can't sustain. Publish a renewal philosophy in writing and keep it; in a category famous for renewal shock, kept promises compound into a moat.</li>
          <li><b>Risk infrastructure as profit.</b> Claims management, safety, and return-to-work programs; large-deductible economics when the book justifies retaining the working layer; disciplined portfolio re-underwriting at renewal.</li>
          <li><b>The channel moat.</b> Scale the accountant channel — a PEO track inside People Advisory, channel-originated revenue as a tracked metric — plus written broker rules of engagement, with PEO 2 as the broker-friendly offer that turns a threat into a lane.</li>
          <li><b>Segment expansion on purpose.</b> Blue-collar through the EWA wedge — NAPEO shows almost half of PEO clients already sit in professional services, manufacturing, and construction — then multi-state mid-market as service depth matures. Expansion follows capability, never precedes it.</li>
          <li><b>Product roadmap fed by the field.</b> Reporting parity (the TriNet bar: saved, auto-scheduled custom reports), earned wage access, and a benefits enrollment experience that meets the Healthee bar — a head of sales who feeds product is a multiplier.</li>
          <li><b>Retention as the engine.</b> Implementation-to-first-renewal playbooks, graduation capture so clients scale to 100+ employees inside Gusto instead of out of it, and WSE retention treated as the company's north star — because in PEO economics, the renewal is the product.</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">THE SCOREBOARD</div>
        <h2>North-star metrics</h2>
        <div className="stat-grid" style={{ marginTop: 16 }}>
          <div className="stat"><div className="v">WSEs</div><div className="l">Worksite employees added and retained — the industry's unit of scale</div></div>
          <div className="stat"><div className="v">GP / WSE</div><div className="l">Gross profit per WSE per month — one number for whether the machine works</div></div>
          <div className="stat"><div className="v">Retention</div><div className="l">Logo and net revenue retention — in PEO economics, the renewal is the product</div></div>
          <div className="stat"><div className="v">% Channel</div><div className="l">Share of revenue originated by accountant partners — the moat, measured</div></div>
          <div className="stat"><div className="v">Underwriting yield</div><div className="l">Share of submitted deals passing the desk — sales quality, not just volume</div></div>
          <div className="stat"><div className="v">First-payroll SLA</div><div className="l">Time to a clean first payroll — the strongest early predictor of retention</div></div>
        </div>
      </div>

      <div className="callout"><span className="tag">WHAT KILLS PEOs — AND THE CONTROL FOR EACH</span>
        Growth outrunning underwriting (deal desk and comp alignment before scale). Year-one
        benefits pricing meeting year-two medical trend (renewal philosophy, disciplined
        quoting). Funds-flow and collection failures (credit screening, deposits, remittance
        controls). Service-model mismatch (self-serve plus reachable humans, matched to the
        base). Internal channel conflict (written co-sell rules and shared credit with payroll
        sales, agreed before the first conversion). This GTM is sequenced so every one of these has its control installed before
        it can become the story.
      </div>
    </div>
  );
}

function KeysTab() {
  const keys = [
    { n: "01", h: "Risk selection discipline", p: "The deal desk is the profit engine. Two PEOs with identical fees have wildly different economics based purely on the books they chose to write.", g: "Sales comp and culture must reward qualified deals, not raw logos — reps who package clean underwriting files win twice." },
    { n: "02", h: "Funds-flow & credit control", p: "A PEO extends unsecured credit equal to a full payroll, every cycle. Collection discipline, deposit policy, and remittance controls are the operating core.", g: "Build credit screening into the sales process itself so bad-fit deals die before implementation, not after." },
    { n: "03", h: "Benefits underwriting + renewal philosophy", p: "Year-one rates buy the deal; renewal allocation decides whether the book stays. Underpriced new business is a loan against year two.", g: "Sell the renewal story honestly from day one — it's the single biggest trust gap incumbents leave open." },
    { n: "04", h: "Claims management as profit", p: "Under large-deductible comp structures, every claim dollar avoided is the PEO's dollar. Safety and return-to-work are underwriting profit, not customer service.", g: "Bake safety value into the pitch for the right verticals; it differentiates against software-first rivals." },
    { n: "05", h: "Credentials: CPEO & ESAC", p: "Sole federal tax liability, no wage-base restart, bonded financial assurance — certification converts trust from a claim into a statute.", g: "For a new entrant, CPEO is the fastest answer to 'why trust the new guy with my payroll taxes?'" },
    { n: "06", h: "Service model matched to segment", p: "Dedicated HRBP vs self-serve isn't branding — it's a cost structure choice. Mismatched service models churn books.", g: "Gusto's base skews simple and software-native: lead self-serve with human escalation, and resist over-building white glove too early." },
    { n: "07", h: "The retention engine", p: "Accounts reach true profitability deep into the relationship. Implementation quality and the first payroll are the strongest retention predictors.", g: "Instrument GP/WSE and retention from client one — the metrics that tell you whether the machine works." },
    { n: "08", h: "Distribution advantage", p: "CAC and cycle length define PEO sales economics. Selling into an installed base structurally beats cold acquisition.", g: "This is Gusto's unfair advantage: the payroll base plus the accountant channel. The Targeting Agent exists to exploit it systematically." },
  ];
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">OPERATING PRINCIPLES</div>
        <h1>What makes a PEO win<span className="hl">.</span></h1>
        <p className="lede">
          Eight imperatives, each with the Gusto-specific implication. The pattern underneath:
          select risk, price it, serve the book, retain it.
        </p>
      </div>
      <div className="key-grid">
        {keys.map((k) => (
          <div className="key-card" key={k.n}>
            <span className="kn">{k.n}</span>
            <h3>{k.h}</h3>
            <p>{k.p}</p>
            <p className="gusto"><b>For Gusto:</b> {k.g}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">HEAD OF PEO SALES</div>
        <h1>The first 90 days<span className="hl">.</span></h1>
        <p className="lede">
          Three phases: learn the machine, build the motion, prove it with a pilot cohort.
          Every phase ends with something shipped, not something scheduled.
        </p>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">DAYS 1–30</span><h3>Learn & map</h3></div>
        <p className="theme">Understand Gusto's PEO product, underwriting appetite, and the base — then define the ICP from data, not instinct.</p>
        <ul>
          <li>Deep-dive the product, pricing structure, underwriting appetite, and state licensing footprint with product, risk, and ops leaders. Know exactly what we can write, where, and at what price.</li>
          <li>Mine the payroll base for PEO propensity: headcount band, multi-state, industry mix, benefits-seeking signals. Define the ICP and size the in-base opportunity.</li>
          <li>Stand up the PEO Targeting Agent against real base data — turn the ICP into a scored, ranked target list.</li>
          <li>Listen: ride along on sales calls, talk to early PEO customers and lost deals, interview top accountant partners about how PEO referrals would actually work in their practice.</li>
          <li>Sit down with peer sales leaders across payroll and benefits in the first two weeks: align on shared accounts, draft the co-sell rules of engagement together, and earn cross-functional credibility before asking anyone for anything.</li>
          <li>Draft the founding-rep hiring profile: PEO-fluent consultants who can read a census and unbundle an invoice — and open requisitions.</li>
        </ul>
        <div className="callout"><span className="tag">DAY-30 DELIVERABLES</span>ICP definition + sized in-base opportunity, scored target list v1, co-sell rules of engagement drafted with peer sales leaders, hiring profile and open reqs, written read-back of product/underwriting reality.</div>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">DAYS 31–60</span><h3>Build the motion</h3></div>
        <p className="theme">Turn knowledge into a playbook, and the playbook into a live pilot.</p>
        <ul>
          <li>Write Playbook v1: discovery artifact checklist (census, renewal dates, SUI notices, comp dec pages), the unbundling comparison toolkit, talk tracks for the five objections, and the honest year-two renewal story.</li>
          <li>Launch the pilot: a defined cohort of high-scoring in-base accounts (sized with sales leadership), worked by me and the first reps using the playbook — every call instrumented.</li>
          <li>Open the partner lane: pilot PEO referrals with a handful of top-tier accountant partners; define the referral motion, materials, and economics.</li>
          <li>Build the underwriting feedback loop: weekly sales-risk review of every declined and repriced deal, so the ICP and pitch sharpen with each cycle.</li>
          <li>Onboard the first rep class through the certification course on this site — every rep stamps all five modules before touching a prospect.</li>
        </ul>
        <div className="callout"><span className="tag">DAY-60 DELIVERABLES</span>Playbook v1 in use, pilot cohort live with full funnel instrumentation, accountant-channel pilot running, first reps certified and selling.</div>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">DAYS 61–90</span><h3>Prove & scale</h3></div>
        <p className="theme">Close the first cohort, codify what worked, and present the scaling case with evidence.</p>
        <ul>
          <li>Close first pilot wins and run structured win/loss reviews on everything — what the data says about ICP, pricing, objections, and cycle length goes into Playbook v2.</li>
          <li>Instrument the full funnel as the operating system: target → engaged → underwriting → proposal → closed, plus WSEs sold, effective PEPM, and early implementation quality.</li>
          <li>Define the quota and comp model from observed cycle data — including underwriting-quality incentives, so we scale the book we want.</li>
          <li>Hire wave two against the now-proven profile; promote pilot learnings into formal onboarding.</li>
          <li>Day-90 executive readout: pilot results, unit economics signals, channel learnings, and the resourced plan for the next two quarters.</li>
        </ul>
        <div className="callout"><span className="tag">DAY-90 SCORECARD</span>First in-base PEO revenue closed, repeatable playbook with evidence, instrumented funnel, certified and growing team, and a data-backed scaling plan on the table.</div>
      </div>
    </div>
  );
}

function Gate({ onUnlock }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const tryUnlock = () => {
    if (val.trim().toUpperCase() === "GUSTOWINS") onUnlock();
    else setErr(true);
  };
  return (
    <div className="gate">
      <div className="gate-card">
        <span className="wordmark">Gabriel Revnew <span className="x">×</span> Gusto</span>
        <div className="eyebrow" style={{ margin: "10px 0 20px" }}>PRIVATE · PREPARED FOR THE GUSTO TEAM</div>
        <p className="gate-copy">
          Inside: the candidate, the PEO certification course, the competitive teardowns,
          the product construct, and the go-to-market. One password between you and all of it.
        </p>
        <input
          className="gate-input"
          type="password"
          value={val}
          placeholder="Password"
          autoFocus
          onChange={(e) => { setVal(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
        />
        <button className="btn primary" style={{ width: "100%" }} onClick={tryUnlock}>Let's go →</button>
        {err && <p className="gate-err">Not it — ask Gabriel for the password.</p>}
      </div>
    </div>
  );
}

function WelcomeLetter({ onClose }) {
  return (
    <div className="letter-overlay" role="dialog" aria-modal="true" aria-label="Welcome letter from Gabriel Revnew">
      <div className="letter-card">
        <span className="eyebrow">YOU'RE IN · A NOTE BEFORE YOU EXPLORE</span>
        <div className="salutation">To the Gusto team —</div>
        <p className="body">
          Thank you for the time you've invested in this process. These conversations have felt
          less like interviews and more like working sessions — which is exactly the kind of
          team I want to build with.
        </p>
        <p className="body">
          So rather than send a document, I built you this — working side by side with AI, the
          way I work every day. Inside: the certification course I'd use to train our team, the
          market intelligence we'd carry into every conversation, a product construct, and the
          ideas I'd bring to a go-to-market our team shapes and executes together.
        </p>
        <p className="body">
          The biggest opportunity here isn't winning strangers — it's growing with the 500,000+
          businesses that already trust Gusto, and building tight feedback loops
          between the field, underwriting, and product so every win and every loss makes the
          next motion sharper. That's how I've led for eight years: player-coach, metrics over
          vibes, develop the people, and let the data coach all of us.
        </p>
        <p className="body">
          Gusto has one shot at entering PEO right — and I have one shot at showing you I'm the
          person to help build it. Eight years selling and leading PEO taught me the category.
          Building products with AI as a daily teammate taught me to ship. This site is both
          at once.
        </p>
        <p className="body">
          Explore in any order. Take the certification quizzes if you're feeling competitive.
          And the password you just typed? That's the thesis.
        </p>
        <div className="signoff">— <span className="sig">Gabriel Revnew</span></div>
        <div style={{ marginTop: 26 }}>
          <button className="btn primary" style={{ width: "100%" }} onClick={onClose}>Explore the site →</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [tab, setTab] = useState("about");
  const [courseView, setCourseView] = useState("home");
  const [progress, setProgress] = useState(() => {
    const p = {};
    COURSE.forEach((m) => { p[m.id] = { lessons: new Set(), passed: false, score: null }; });
    return p;
  });

  const markLesson = (id, i) =>
    setProgress((prev) => {
      const next = { ...prev };
      const s = new Set(next[id].lessons); s.add(i);
      next[id] = { ...next[id], lessons: s };
      return next;
    });
  const markPass = (id, score) =>
    setProgress((prev) => ({ ...prev, [id]: { ...prev[id], passed: true, score } }));

  const certified = COURSE.filter((m) => progress[m.id].passed).length;

  const renderCourse = () => {
    if (courseView === "home") {
      return (
        <div className="shell">
          <div className="hero">
            <div className="eyebrow">TRAINING SYSTEM · REPS & EXECS</div>
            <h1>The PEO Operator Course<span className="hl">.</span></h1>
            <p className="lede">
              Five modules: co-employment fundamentals, the PEO operating model, pricing forensics,
              the competitive map, and the sales process. Pass each certification quiz at 80% to
              stamp the module. This is the course our team would complete before touching
              a prospect.
            </p>
            <div className="progress-strip">
              {COURSE.map((m) => {
                const pr = progress[m.id];
                const cls = pr.passed ? "done" : pr.lessons.size > 0 ? "partial" : "";
                return <div key={m.id} className={"progress-cell " + cls} title={m.title} />;
              })}
            </div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              {certified} OF {COURSE.length} MODULES CERTIFIED
            </div>
          </div>
          {COURSE.map((m) => {
            const pr = progress[m.id];
            return (
              <button key={m.id} className="ledger-row" onClick={() => setCourseView(m.id)}>
                <span className="row-num">{m.num}</span>
                <span className="row-main">
                  <p className="row-title">{m.title}</p>
                  <p className="row-sub">{m.tagline}</p>
                </span>
                {pr.passed ? (
                  <span className="seal">CERT.<br />{pr.score}/{m.quiz.length}</span>
                ) : (
                  <span className="row-status" style={{ color: pr.lessons.size ? "var(--guava-deep)" : "var(--ink-soft)" }}>
                    {pr.lessons.size ? `${pr.lessons.size}/${m.lessons.length} LESSONS` : "NOT STARTED"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <ModuleView
        mod={COURSE.find((m) => m.id === courseView)}
        progress={progress[courseView]}
        onLessonDone={markLesson}
        onPass={markPass}
        onHome={() => setCourseView("home")}
      />
    );
  };

  if (!unlocked) {
    return (
      <div className="peo-app">
        <style>{css}</style>
        <Gate onUnlock={() => { setUnlocked(true); setShowLetter(true); }} />
      </div>
    );
  }

  return (
    <div className="peo-app">
      <style>{css}</style>
      {showLetter && <WelcomeLetter onClose={() => setShowLetter(false)} />}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brandline">
            <span className="wordmark">Gabriel Revnew <span className="x">×</span> Gusto</span>
            <span className="eyebrow">HEAD OF PEO SALES · PREPARED FOR THE GUSTO TEAM</span>
          </div>
          <nav className="tabbar">
            {TABS.map((t) => (
              <button key={t.id} className={"tab" + (tab === t.id ? " active" : "")} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {tab === "about" && <AboutTab />}
      {tab === "agent" && <AgentTab />}
      {tab === "course" && renderCourse()}
      {tab === "landscape" && <LandscapeTab />}
      {tab === "swot" && <SwotTab />}
      {tab === "construct" && <ConstructTab />}
      {tab === "gtm" && <GTMTab />}
      {tab === "keys" && <KeysTab />}
      {tab === "plan" && <PlanTab />}

      <div className="footer">
        <span className="eyebrow">BUILT BY GABRIEL REVNEW · NOT AN OFFICIAL GUSTO PROPERTY · v2.0</span>
      </div>
    </div>
  );
}
