"use client";

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { Folder, Plus, Trash2, ChevronLeft, FileText, Search, Save, Check, Users, DollarSign, Clock, TrendingUp, Calendar, Phone, Mail, Building2, MessageSquare, Sparkles, X, Info } from "lucide-react";

/* ============================================================
   GABE × GUSTO, HEAD OF PEO SALES
   Interview microsite: background, PEO Prospecting Agent,
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
.topbar-inner { max-width: 1280px; margin: 0 auto; padding: 0 20px; }
.brandline { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.wordmark { font-weight: 800; font-size: 19px; letter-spacing: -0.01em; }
.wordmark .x { color: var(--guava); }
.eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); }

.tabbar { display: flex; flex-wrap: wrap; gap: 0 2px; justify-content: center; }
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

.term { background: none; border: none; padding: 0; margin: 0; font: inherit; color: inherit; border-bottom: 1.5px dotted var(--guava); cursor: pointer; }
.term:hover { color: var(--guava-deep); }
.term:focus-visible { outline: 2px solid var(--guava); outline-offset: 1px; }
.term-overlay { position: fixed; inset: 0; background: rgba(35, 42, 53, 0.45); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 60; }
.term-card { background: var(--surface); border: 1px solid var(--rule); border-radius: 16px; padding: 30px 30px 28px; max-width: 540px; width: 100%; max-height: 82vh; overflow-y: auto; box-shadow: 0 16px 60px rgba(35,42,53,0.22); }
.term-acro { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .14em; color: var(--guava-deep); }
.term-full { font-weight: 800; font-size: 21px; letter-spacing: -0.01em; margin: 6px 0 8px; }
.term-def { font-size: 14.5px; line-height: 1.65; margin: 0; }
.gloss-item { padding: 11px 0; border-bottom: 1px dashed var(--rule); font-size: 14px; }
.gloss-item b { font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
.gloss-item p { font-size: 13px; color: var(--ink-soft); line-height: 1.55; margin: 4px 0 0; }
.myday-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding-top: 12px; font-size: 13.5px; line-height: 1.5; }
@media (max-width: 560px) { .myday-meta { grid-template-columns: 1fr; } }
.agent-builder { border: 1px solid var(--rule); border-radius: 14px; padding: 20px; background: var(--bg); }
.sig-pick { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.sig-toggle { display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--rule); background: var(--surface); border-radius: 999px; padding: 7px 13px; font-size: 12.5px; color: var(--ink); cursor: pointer; transition: all .12s; font-family: inherit; }
.sig-toggle:hover { border-color: var(--guava); }
.sig-toggle b { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-soft); font-weight: 600; }
.sig-toggle.on { background: var(--guava-soft); border-color: var(--guava); color: var(--guava-deep); }
.sig-toggle.on b { color: var(--guava-deep); }
.roi-input { font-family: 'IBM Plex Mono', monospace; border: 1px solid var(--rule); border-radius: 10px; padding: 10px 12px; font-size: 15px; width: 100%; background: var(--surface); color: var(--ink); }
.roi-input:focus { outline: none; border-color: var(--guava); }
.roi-label { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .12em; color: var(--ink-soft); display: block; margin-bottom: 6px; }
.roi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
@media (max-width: 640px) { .roi-grid { grid-template-columns: 1fr; } }
.workstream { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .14em; color: var(--guava-deep); margin: 18px 0 2px; font-weight: 600; }
.cmp-table { border: 1px solid var(--rule); border-radius: 12px; overflow: hidden; }
.cmp-head, .cmp-row { display: grid; grid-template-columns: 2fr 1.1fr 1.1fr 1fr; align-items: center; gap: 8px; padding: 9px 12px; }
.cmp-head { background: var(--ink); color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .08em; }
.cmp-head span:not(:first-child), .cmp-row span:not(:first-child) { text-align: right; }
.cmp-row { border-top: 1px solid var(--rule); font-size: 13.5px; }
.cmp-row:nth-child(even) { background: var(--bg); }
.cmp-row b { display: block; }
.cmp-row i { font-style: normal; font-size: 11px; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace; }
.cmp-input { text-align: right; padding: 6px 8px !important; font-size: 13px !important; }
.cmp-delta { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600; }
.cmp-delta.pos { color: var(--green); }
.cmp-delta.neg { color: var(--guava-deep); }
.cmp-row.total { background: var(--guava-soft); font-weight: 700; border-top: 2px solid var(--guava); }
.cmp-row.total span { font-size: 14px; }
@media (max-width: 560px) { .cmp-head, .cmp-row { grid-template-columns: 1.5fr 1fr 1fr 0.9fr; gap: 5px; padding: 8px 8px; font-size: 12px; } .cmp-input { font-size: 12px !important; } }
.vantage-breakout { width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; }
.acro-row { display: flex; gap: 12px; align-items: baseline; width: 100%; text-align: left; background: none; border: none; border-bottom: 1px dashed var(--rule); padding: 9px 2px; cursor: pointer; font: inherit; color: var(--ink); }
.acro-row:hover { background: var(--bg); }
.acro-row b { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--guava-deep); min-width: 68px; flex-shrink: 0; }
.acro-row span { font-size: 14px; color: var(--ink-soft); }
.answer-key { margin: 12px 0 4px; padding-left: 20px; }
.answer-key li { font-size: 13.5px; line-height: 1.5; margin-bottom: 7px; color: var(--ink); }
.answer-key b { font-family: 'IBM Plex Mono', monospace; color: var(--green); margin-right: 4px; }
.path-wrap { max-width: 720px; margin: 0 auto 22px; }
.path-chip { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: .1em; color: var(--guava-deep); border: 1px solid var(--guava); background: var(--guava-soft); border-radius: 999px; padding: 2px 9px; margin-left: 9px; vertical-align: 2px; white-space: nowrap; }
.sources { border-top: 1px dashed var(--rule); margin-top: 22px; padding-top: 12px; }
.src-tag { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: .14em; color: var(--ink-soft); display: block; margin-bottom: 7px; }
.sources ul { margin: 0; padding-left: 16px; }
.sources li { font-size: 12.5px; margin-bottom: 4px; line-height: 1.5; }
.sources a { color: var(--guava-deep); text-decoration: none; }
.sources a:hover { text-decoration: underline; }
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
.agent-card { margin-bottom: 10px; }
.agent-head { display: flex; align-items: center; gap: 14px; background: var(--surface); border: 1px solid var(--rule); border-radius: 12px; padding: 14px 18px; cursor: pointer; transition: border-color .15s; }
.agent-head:hover { border-color: var(--guava); }
.agent-head:focus-visible { outline: 2px solid var(--guava); outline-offset: 2px; }
.agent-detail { border: 1px solid var(--rule); border-top: none; border-radius: 0 0 12px 12px; background: var(--surface); padding: 2px 18px 16px; }
.sig-wrap { display: flex; flex-wrap: wrap; gap: 7px; padding-top: 12px; }
.sig-chip { display: inline-flex; gap: 6px; align-items: center; border: 1px dashed var(--rule); border-radius: 999px; padding: 5px 11px; font-size: 12px; color: var(--ink-soft); background: var(--bg); }
.sig-chip b { font-family: 'IBM Plex Mono', monospace; color: var(--green); font-weight: 600; }
.score-pill { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: .04em; padding: 6px 12px; border-radius: 999px; flex-shrink: 0; white-space: nowrap; }
.score-pill.hot { background: var(--guava-soft); color: var(--guava-deep); border: 1px solid var(--guava); }
.score-pill.warm { background: #F6EDDC; color: var(--gold); border: 1px solid var(--gold); }
.score-pill.watch { background: var(--bg); color: var(--ink-soft); border: 1px solid var(--rule); }
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
        title: "What a PEO is, and where the industry came from",
        blocks: [
          { t: "p", x: "A Professional Employer Organization enters a co-employment relationship with its clients. The PEO becomes the administrative employer of the client's workers, worksite employees (WSEs), for payroll, employment tax filing, benefits sponsorship, and workers' compensation. The client remains the worksite employer with full direction and control of the work itself: hiring, firing, pay decisions, scheduling, supervision, and running the business. The relationship is contractual, defined in a Client Service Agreement, not a status imposed by statute." },
          { t: "p", x: "The industry's origin story matters because buyers' lawyers remember it. The model grew out of 1970s–80s 'employee leasing,' which exploded after a 1982 tax law (TEFRA) created a pension safe harbor that let owners exclude leased workers from retirement plans, a loophole closed in 1986. The 1990s and early 2000s brought real abuses: undercapitalized operators, unfunded health plans, and 'SUTA dumping', shuffling payroll between entities to shed bad unemployment ratings, which Congress outlawed in the SUTA Dumping Prevention Act of 2004." },
          { t: "p", x: "The modern industry is the regulated descendant of that era: state registration and licensing regimes in the large majority of states, the ESAC accreditation program with bonded financial assurance, IRS certification (CPEO) since 2017, and a rebrand from 'staff leasing' to 'professional employer organization.' Today 500+ PEOs serve more than 230,000 client businesses and four-million-plus WSEs, with industry revenue of roughly $414 billion, more than quadruple its 2012 size. (Note for lesson seven: that headline figure is gross billings, including pass-through payroll, the distinction that separates operators from press-release readers.)" },
          { t: "callout", tag: "WHY THE HISTORY MATTERS", x: "When a prospect's attorney or CPA bristles at 'leasing my employees,' they're reacting to the 1990s version of this industry. Naming the history, and the licensing, bonding, ESAC, and CPEO regimes built in response, is how you show you know more about their objection than they do." },
          { t: "sources", items: [
            { l: "NAPEO, Industry Research & Data (500+ PEOs, 230K+ clients, $414B revenue, 4x since 2012)", u: "https://napeo.org/intro-to-peos/industry-research-data/" },
            { l: "IRS, Certified Professional Employer Organization program", u: "https://www.irs.gov/tax-professionals/certified-professional-employer-organization" },
            { l: "SUTA Dumping Prevention Act of 2004 (P.L. 108-295)", u: "https://www.congress.gov/bill/108th-congress/house-bill/3463" },
          ]},
        ],
      },
      {
        title: "The legal architecture of co-employment",
        blocks: [
          { t: "p", x: "Precision here separates operators from brochure-readers. Three terms get conflated constantly and must never be conflated by you:" },
          { t: "list", items: [
            "Co-employment is a contractual allocation. The CSA divides employer responsibilities between PEO and client by agreement. It is voluntary, defined, and priced.",
            "Joint employment is a liability doctrine. Courts and agencies (FLSA wage-hour cases, NLRB) impose joint-employer status on companies based on actual control over workers, regardless of what any contract says. A client can't contract its way out of liability for hours it controls.",
            "Employee leasing / EOR is full employer substitution. The provider is the sole legal employer. A PEO is not this, the client is always a common-law employer of its own people.",
          ]},
          { t: "p", x: "State law frames the whole arrangement. Most states have PEO-specific statutes covering registration or licensing, financial capacity requirements (audited financials, bonding, or working capital minimums), how unemployment insurance is reported (client-level vs PEO-level accounts), and how workers' compensation may be written (master policy vs multiple-coordinated-policy states). A PEO's ability to even operate a given billing structure differs by state, which is why multi-state deals require more than a rate card." },
          { t: "p", x: "On the federal tax side, wages are reported under the PEO's EIN (with special rules for certified PEOs under IRC Section 3511, covered in lesson five). For everything else, discrimination law, wage and hour, leave statutes, OSHA, the analysis runs on common-law employment and actual control, which is why the client never stops being an employer in the eyes of the EEOC or the Department of Labor." },
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
          { t: "p", x: "Two CSA mechanisms govern the edges: indemnification provisions (each party indemnifies the other for failures in its allocated lane) and insurance requirements, including Employment Practices Liability Insurance. EPLI offered through a PEO often comes with meaningful deductibles and conduct conditions, clients should know that an EPLI policy is not a license to skip documented terminations." },
          { t: "callout", tag: "FIELD NOTE", x: "Selling honestly on liability is a competitive weapon. The rep who says 'we take all the employment risk off your plate' loses the deal the moment the buyer's attorney reads the CSA. Walk the allocation table instead, it builds the kind of trust that survives legal review." },
        ],
      },
      {
        title: "Inside the Client Service Agreement",
        blocks: [
          { t: "p", x: "The CSA is the product. Everything else is implementation. A consultant should be able to walk a client through our CSA with total confidence, six provisions matter most:" },
          { t: "list", items: [
            "Allocation of responsibilities. The schedule defining which employer obligations the PEO assumes, which the client retains, and which are shared. This is the legal heart of co-employment.",
            "Pricing exhibits. Where the billing structure actually lives, admin fee or rate, what's bundled, pass-through definitions, and the PEO's rights to adjust rates (especially SUTA and comp 'true-ups' and benefits renewals).",
            "Termination and notice. Typical notice runs 30 days; some agreements require longer or impose timing constraints. Map the notice period against the benefits renewal date and January 1 before a client signs anything.",
            "Benefits exit terms. What happens to coverage on termination, end-of-month cutoffs, COBRA administration responsibility, and whether the PEO offers any transition assistance. This is where unprepared exits get ugly.",
            "Indemnification and insurance. The two-way obligations described in the liability lesson, plus required coverages and limits.",
            "Employment screening and credit conditions. PEOs underwrite clients too, payment terms, deposit or prefunding requirements, and the PEO's right to terminate for credit deterioration.",
          ]},
          { t: "p", x: "Notice the asymmetry of attention: buyers obsess over year-one price and skim everything above. The consultant who walks a buyer through termination, benefits exit, and rate-adjustment rights before signing is doing the job the industry's reputation was built without." },
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"I'm going to show you the three paragraphs of this agreement you'll care about in year two: how rates can move, how you leave, and what happens to your people's coverage if you do.\"" },
        ],
      },
      {
        title: "CPEO: Section 3511, Form 8973, and why certification matters",
        blocks: [
          { t: "p", x: "The Certified PEO program was created by the Small Business Efficiency Act (enacted in late 2014), with the IRS issuing the first certifications in 2017. It added two sections to the tax code, 7705 (certification requirements) and 3511 (tax treatment), and turned a marketing claim ('we're financially solid') into a federal status with teeth." },
          { t: "list", items: [
            "Sole federal tax liability. Under Section 3511, a CPEO is solely liable for federal employment taxes on wages it pays to WSEs under a CPEO contract. With a non-certified PEO, the IRS can pursue the client if the PEO collects and fails to remit, the client can pay its payroll taxes twice.",
            "Successor-employer treatment. A CPEO is treated as a successor employer, so FICA and FUTA wage bases don't restart when a client joins or leaves mid-year. With non-certified arrangements, mid-year EIN transitions can restart wage bases, a quantifiable duplicated-tax cost.",
            "Tax credits stay with the client. Section 3511(d) keeps specified credits computed at the customer level, WOTC, the R&D payroll tax offset, FICA tip credit, and others. Without that protection, moving wages to another EIN could strand credits. For a startup claiming the R&D payroll offset, this is a deal-level issue, not a footnote.",
            "Form 8973. Each CPEO–customer relationship is reported to the IRS on Form 8973, filed at the start and end of every service contract. It's the paper trail that makes the sole-liability and successor rules operate.",
          ]},
          { t: "p", x: "Certification itself requires annual audited financials, quarterly assertions verified by a CPA, background and experience standards for responsible individuals, and a bond, generally the greater of $50,000 or 10% of the prior year's federal employment tax liability, capped at $1 million. Maintaining certification is an ongoing compliance burden, which is exactly why it signals financial discipline." },
          { t: "p", x: "Keep CPEO distinct from ESAC accreditation. ESAC is the industry's independent accreditation program, backed by surety bonding that protects clients if an accredited PEO fails to remit payroll, taxes, or contributions. CPEO is federal tax status; ESAC is financial assurance. The strongest operators hold both, and the Gusto PEO's path to certification is part of our story, so know exactly what each credential means when a client asks." },
          { t: "sources", items: [
            { l: "IRS, CPEO program (certification, bond, requirements)", u: "https://www.irs.gov/tax-professionals/certified-professional-employer-organization" },
            { l: "IRS, About Form 8973 (CPEO/Customer Reporting Agreement)", u: "https://www.irs.gov/forms-pubs/about-form-8973" },
            { l: "26 U.S.C. § 3511, sole liability, successor treatment, customer-level credits", u: "https://www.law.cornell.edu/uscode/text/26/3511" },
            { l: "26 U.S.C. § 7705, certification requirements", u: "https://www.law.cornell.edu/uscode/text/26/7705" },
            { l: "ESAC, accreditation & financial assurance", u: "https://www.esac.org/" },
          ]},
        ],
      },
      {
        title: "Benefits architecture: master plans, ERISA, ACA, and the 401(k) MEP",
        blocks: [
          { t: "p", x: "Benefits are the engine of most PEO deals, so a consultant needs to understand how the plans are actually structured, not just quote the rates." },
          { t: "list", items: [
            "Health plans. National PEOs sponsor fully insured group health plans with major carriers, covering WSEs across all client companies. Because the plan covers employees of many unrelated employers, its regulatory treatment (single-employer plan vs multiple employer welfare arrangement, or MEWA) has been a long-running question in ERISA law, and states layer their own insurance regulation on top. The practical takeaway: plan structure, carrier strength, and the PEO's underwriting discipline determine whether year-one rates survive to year three.",
            "Underwriting reality. The master plan doesn't suspend underwriting, it pools it. The carrier prices the PEO's whole book, and the PEO decides how to allocate renewal increases across clients. A PEO that underprices to win deals pays for it at book renewal, and so do its clients. Always ask how a PEO allocates renewals: book-wide, by client experience, or a blend.",
            "ACA mechanics. Applicable Large Employer status is determined by the client's own full-time employee count, joining a PEO does not change whether the employer mandate applies. Coverage offered through the PEO's plan on the client's behalf can satisfy the client's offer obligation (the regulations bless this where the client pays more for employees who enroll), and the PEO typically handles the 1094/1095 reporting machinery.",
            "Retirement. PEO 401(k) programs are typically structured as Multiple Employer Plans (MEPs), with each client adopting into the PEO-sponsored plan. Clients get pooled pricing, delegated administration, and meaningful relief from day-to-day fiduciary tasks, though adopting employers always retain some fiduciary responsibility, starting with the decision to use the arrangement at all.",
          ]},
          { t: "callout", tag: "FIELD NOTE", x: "The most expert question in a benefits-driven deal isn't 'what are the rates?', it's 'show me this book's renewal history and tell me how increases get allocated.' Rates buy the first year. Renewal philosophy is the product." },
        ],
      },
      {
        title: "Why SMBs buy, and how PEOs make money",
        blocks: [
          { t: "p", x: "The sweet spot is roughly 5 to 100 employees, big enough to feel HR pain, too small to buy enterprise infrastructure on their own paper. The value stack, in the order buyers usually feel it: benefits access through master plans, compliance offload across states and statutes, workers' comp through the master program (often pay-as-you-go), and an HR function the founder no longer has to improvise. The industry's benchmark research backs the stack with numbers worth memorizing:" },
          { t: "table", head: ["Benchmark", "The number", "Why it sells"], rows: [
            ["ROI", "~27% average annual ROI, roughly $1,273 back per $1,000 spent", "The fee pays for itself; the headline economics of the category"],
            ["Cost vs savings", "~$1,395 spent per employee vs ~$1,775 saved per employee annually", "Net-positive per head before counting the owner's time"],
            ["Growth", "4.3% annual growth vs 1.6% for comparable businesses", "PEO clients grow more than twice as fast"],
            ["Survival", "50% less likely to go out of business", "The risk story, for the founder who's lived close calls"],
            ["Turnover", "12% lower employee turnover", "Benefits and HR quality showing up where it costs the most"],
            ["Profitability", "16% higher than non-PEO peers", "The bottom-line close"],
            ["Scale", "500+ PEOs, 230,000+ clients, ~$414B in industry revenue, quadrupled since 2012", "A category in structural growth, not a niche"],
            ["Penetration", "~15% of employers with 10–499 employees use a PEO (~14% in the 20–499 band), and only ~4% of all US businesses", "Headroom on every axis: the core segment is six-in-seven unconverted, and the total market is barely touched"],
            ["Client profile", "Nearly two-thirds of PEO clients have 10–49 employees; almost half are in professional services, manufacturing, or construction", "Defines the ICP, and proves blue-collar is core PEO territory, not adjacent"],
          ]},
          { t: "callout", tag: "SOURCE DISCIPLINE", x: "These are NAPEO-commissioned benchmarks. Quote them as industry research, keep them current, and close on the prospect's own census and invoices, their numbers beat any benchmark, and the rep who uses both is unbeatable." },
          { t: "p", x: "Now the other side of the ledger. A PEO's revenue comes from a handful of places, and knowing them makes you dangerous in any pricing conversation:" },
          { t: "list", items: [
            "Administrative fees. The disclosed PEPM or percent-of-payroll fee, the only component most buyers ever see.",
            "Workers' comp spread. The difference between what the PEO charges (net rates by class code) and its actual program cost, net of claims. Strong risk selection makes this a profit center.",
            "SUTA spread. In states permitting PEO-level reporting, the gap between a billed 'company rate' and the PEO's actual experience rate.",
            "Benefits load. Margin layered into health and ancillary rates above true premium cost.",
            "Float and scale. Interest on funds held between collection and remittance, plus the operating leverage of running one platform across thousands of clients.",
          ]},
          { t: "p", x: "One more concept that marks an operator: gross billings versus net revenue. PEO 'revenue' headlines usually quote gross billings, which include client payroll passing through. The real business is net service revenue: fees plus spreads. When you evaluate a PEO's financial strength, or read a public PEO's earnings, that's the number that matters." },
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"Every PEO makes money on your account in four places: the admin fee you can see, plus what they make on workers' comp pricing, on unemployment taxes, and inside the benefits rates. Most quotes only show you the first one. I'll show you exactly how the Gusto PEO works in all four, published, line by line, next to what you're paying to employ people today.\"" },
          { t: "sources", items: [
            { l: "ROI (27%, $1,273 per $1,000) and per-employee cost vs savings, NAPEO: The ROI of Using a PEO", u: "https://napeo.org/wp-content/uploads/2025/03/white-paper-7-the-roi-of-using-a-peo.pdf" },
            { l: "Growth (4.3% vs 1.6%), 12% lower turnover, 50% less likely to fail, NAPEO: PEO Clients, Faster Growing, More Resilient Businesses (2024)", u: "https://napeo.org/wp-content/uploads/2025/03/2024-white-paper-final.pdf" },
            { l: "16% higher profitability, retirement-plan access, industry scale ($414B, 4x since 2012), NAPEO Industry Research & Data", u: "https://napeo.org/intro-to-peos/industry-research-data/" },
            { l: "Penetration (~15% of 10–499 EE employers; ~14% of 20–499; ~4% of all US businesses), NAPEO: PEO Clients white paper (Oct 2025)", u: "https://napeo.org/wp-content/uploads/2025/10/PEOClients2025_WhitePaper_Web.pdf" },
            { l: "Penetration headline (230K+ clients = ~15% of 10–499), NAPEO press release, Oct 2025", u: "https://www.prnewswire.com/news-releases/new-napeo-research-highlights-growth-and-diversity-of-peo-clients-302586964.html" },
            { l: "Client profile (two-thirds at 10–49 EEs; ~half in professional services, manufacturing, construction), NAPEO: PEO Clients, An Analysis (2022)", u: "https://napeo.org/wp-content/uploads/2025/03/analysisofpeo_whitepaper-fin.pdf" },
          ]},
        ],
      },
    ],
    quiz: [
      { q: "In plain terms, what is a PEO?", opts: ["A staffing agency that supplies temporary workers", "A company that co-employs a client's workforce to handle payroll, benefits, taxes, and HR compliance", "A health insurance broker", "A payroll software product"], a: 1, x: "A PEO becomes the administrative employer alongside its client. The client still runs the business and directs the work; the PEO handles payroll, benefits, employment taxes, and HR compliance behind the scenes." },
      { q: "In a co-employment relationship, who decides who gets hired, what they are paid, and what work they do day to day?", opts: ["The PEO", "The client, the PEO handles the administration, not the management", "They split every decision 50/50", "The workers' comp carrier"], a: 1, x: "The client always keeps control of the actual business and people. The PEO administers payroll and benefits and advises on compliance, but it never tells the client who to hire or how to run the work." },
      { q: "What does co-employment mean?", opts: ["Two companies merge into one", "The PEO and the client share employer responsibilities, each handling different parts", "The employee works two jobs", "The client gives up ownership of the business"], a: 1, x: "Co-employment is a shared, contractual split of employer duties: the PEO takes payroll, benefits, and tax administration; the client keeps direction of the work. Nobody gives up ownership." },
      { q: "Why do small businesses get better benefits through a PEO?", opts: ["The government subsidizes PEO clients", "The PEO pools many small companies together, so they buy insurance at large-group rates", "PEOs are non-profit", "Small companies legally must use a PEO"], a: 1, x: "By combining hundreds or thousands of small employers into one large pool, a PEO can offer the kind of medical, dental, and retirement plans that normally only big companies can access." },
      { q: "What does CPEO stand for, and what is it?", opts: ["Corporate PEO, a PEO with over 1,000 clients", "Certified Professional Employer Organization, a PEO certified by the IRS to higher financial and reporting standards", "Combined PEO, two PEOs that merged", "Commercial PEO, a PEO that only serves retail"], a: 1, x: "A CPEO has passed IRS certification, which requires audited financials and a bond. The practical payoff for clients: the certified PEO is solely responsible for federal payroll taxes, so the client is not on the hook if something goes wrong." },
      { q: "Roughly how many businesses use a PEO today, and what does that say about the market?", opts: ["Almost all small businesses, the market is saturated", "About 230,000 businesses, only around 15% of employers in the core size range, so there is huge room to grow", "Fewer than 1,000, it is a tiny niche", "Exactly half of all US companies"], a: 1, x: "NAPEO puts it around 230,000 client businesses, roughly 15% of employers with 10 to 499 employees and only about 4% of all US businesses. The category is large and still mostly unconverted, which is the growth story." },
      { q: "A PEO runs a client's payroll. Who is still ultimately responsible for deciding an employee's job duties and schedule?", opts: ["The PEO, since it issues the paychecks", "The client, because it directs the actual work", "The IRS", "Whichever party signed the contract last"], a: 1, x: "Issuing a paycheck is not the same as managing a person. The client controls hours, duties, and roles; the PEO pays what the client tells it to pay. This is the core of how responsibility is split." },
      { q: "What is the main difference between a PEO and an ASO (Administrative Services Organization)?", opts: ["An ASO is cheaper because it offers more", "A PEO co-employs and files taxes under its own ID with master benefit plans; an ASO just administers HR under the client's own ID and plans", "They are the same thing", "An ASO only works for companies over 500 employees"], a: 1, x: "The dividing line is co-employment. A PEO becomes the administrative employer with pooled benefits; an ASO simply helps with HR paperwork while the client keeps its own tax ID and its own benefit plans." },
      { q: "Which of these does a PEO typically handle for a client?", opts: ["Only payroll", "Only health insurance", "Payroll, benefits administration, employment taxes, workers' comp, and HR compliance", "Only hiring and firing decisions"], a: 2, x: "A PEO bundles the whole back office of employment: paying people, running benefits, filing employment taxes, managing workers' comp, and keeping the client compliant. Hiring and firing stay with the client." },
      { q: "Why might a growing small business consider a PEO?", opts: ["To hand off running the company entirely", "To get big-company benefits, offload payroll and compliance work, and reduce HR risk as they grow", "Because it is legally required over 25 employees", "To avoid paying employment taxes"], a: 1, x: "The pitch is simple: better benefits, less administrative burden, and lower compliance risk, so the owner can spend time on the business instead of HR paperwork. Taxes still get paid; the PEO just handles them." },
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
          { t: "p", x: "Strip away the brochure and a PEO is a high-velocity money machine. Every payroll cycle, the same sequence runs: the client submits hours and changes; the PEO calculates gross-to-net and produces an invoice for the full obligation, wages, employer taxes, workers' comp, benefits, and the admin fee; the PEO debits the client's account by ACH, typically one to two banking days before check date; then the PEO pays the employees, remits employment taxes on its federal and state deposit schedules, and pays carriers on their billing cycles." },
          { t: "p", x: "Notice what that sequence means: as long as the debit clears, the PEO never deploys its own cash for wages. But the moment a debit fails after payroll has been funded, the PEO has paid the client's employees with its own money. The PEO is functionally extending unsecured short-term credit equal to a full payroll, every cycle, to every client." },
          { t: "list", items: [
            "This is why PEOs underwrite client credit, financials, payment history, industry, alongside insurance risk.",
            "This is why higher-risk clients see deposits, prefunding requirements, or wire-only terms in the CSA.",
            "This is why nonpayment termination rights are fast and unsentimental. A PEO that floats a failing client is donating payroll.",
            "And it's why float exists as a revenue line: between collection and remittance, the PEO holds material balances across thousands of clients.",
          ]},
          { t: "callout", tag: "EXEC LENS", x: "When you evaluate a PEO's financial strength, or run one, the funds-flow discipline is the business. Collection timing, deposit policy, and remittance controls are what failed in every PEO collapse the industry's regulations were written in response to." },
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
            ["Credit", "Financials, payment history, funding method, industry stability", "Thin balance sheets, prior payment defaults, managed via deposits or declined outright"],
          ]},
          { t: "p", x: "Risk selection is the profit engine of a PEO. Two PEOs with identical fees and identical service can have wildly different economics purely on the books of business they chose to write. That's why a deal that one PEO prices aggressively gets declined by another, the appetite, not the prospect, changed." },
          { t: "callout", tag: "FIELD NOTE", x: "Package every deal like a loan file: clean census, current loss runs, SUI notices, financials if asked. Deals don't just win on persuasion, they win in underwriting, on the completeness and credibility of the submission. Sloppy files get conservative pricing." },
        ],
      },
      {
        title: "The PEO P&L: unit economics",
        blocks: [
          { t: "p", x: "Read a PEO like an operator. Start at the top: gross billings (including pass-through payroll) versus net service revenue (fees plus spreads), covered in Module 1. From net revenue, the unit metric that matters is gross profit per WSE per month, which public PEOs disclose and which collapses the whole model into one number: what the PEO earns per covered employee after direct insurance and tax costs." },
          { t: "list", items: [
            "The revenue side per WSE: admin fee, comp spread, SUTA spread where reporting structure allows, benefits load, float.",
            "The direct-cost side: health plan cost trend, workers' comp claims development, and state unemployment experience. Because national PEOs typically share in insurance risk, gross profit per WSE moves with claims, a bad comp year or a hot medical-trend year compresses it directly.",
            "Below gross profit: service delivery (payroll ops, HR business partners), technology, and sales cost, commissions plus the customer-acquisition math.",
          ]},
          { t: "p", x: "That last line explains the industry's obsession with retention. Acquiring and implementing a client is expensive; the account often isn't truly profitable until well into the relationship. A client retained through several renewals is the entire business model; a client churned at month fourteen is a loss dressed as a logo. When a PEO fights hard at renewal, that's not pride, it's the P&L." },
          { t: "callout", tag: "EXEC LENS", x: "The three numbers that will define the Gusto PEO's economic quality: the gross-profit-per-WSE trend, the share of it coming from fees versus insurance spreads, and WSE retention. Fee-led, high-retention books are durable, that's the book we're building." },
        ],
      },
      {
        title: "Risk management inside the machine",
        blocks: [
          { t: "p", x: "The PEO's insurance programs aren't simple pass-throughs to carriers, the PEO usually keeps meaningful skin in the game, and managing that retained risk is where operating skill shows." },
          { t: "list", items: [
            "Workers' comp. Large PEOs commonly buy large-deductible master policies, the PEO retains the first layer of every claim (often hundreds of thousands of dollars) with the carrier covering the excess; some use captives for the retained layer. The consequence: every dollar of claims avoided is the PEO's dollar. That's why serious PEOs invest in claims management, return-to-work programs, and worksite safety, it's underwriting profit, not customer service.",
            "Health. National PEOs frequently operate under experience-rated or risk-sharing arrangements with their carriers, so the book's actual claims drive the PEO's cost. Managing it means disciplined new-business underwriting, participation enforcement, and deliberate renewal allocation, deciding how much of the book's increase each client carries.",
            "Portfolio management. A PEO manages its client base like a loan book: rate actions and re-underwriting at renewal, and culling accounts whose claims, credit, or behavior no longer fit appetite. Clients experience this as 'my PEO got aggressive at renewal'; the PEO experiences it as survival.",
            "External discipline. CPEO bonding and audits, ESAC financial assurance, and state financial-capacity requirements function as the regulatory floor under all of it, the system the industry built after its undercapitalized era.",
          ]},
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"A PEO is partly an insurance operation wearing an HR suit. The good ones are excellent at risk, which is exactly what you want, because their incentive is fewer claims at your worksite, not more.\"" },
        ],
      },
      {
        title: "Service delivery & the client lifecycle",
        blocks: [
          { t: "p", x: "The last piece of the construct is how service is actually produced, because the service model is a P&L choice, not just a customer-experience choice." },
          { t: "list", items: [
            "Implementation. Data collection, benefits enrollment, comp binding, state account work, then the first payroll, the trust milestone. Implementation quality is the strongest early predictor of retention, which is why mature PEOs run it as a specialized function, not a sales afterthought.",
            "Service models span a cost spectrum. Dedicated HR business partners and named teams (the premium, service-heavy model) sit at one end; pooled service centers and software-first self-serve (the transparent-PEPM model) at the other. Neither is 'better', they are different cost structures sold to different buyers at different price points. Ours must map to how our clients actually operate: self-serve with genuinely reachable humans, matched to the base.",
            "The renewal cycle. The benefits renewal is the annual moment of truth where underwriting reality, allocation philosophy, and relationship quality all surface at once. Most churn is conceived at a renewal and executed at the next one.",
            "Exit and churn drivers. Accounts leave over renewal shock, service failures, M&A, outgrowing the model (graduating to self-funded plans around a few hundred employees), or a sharper competitor re-selling the account. Each is predictable; the operating question is which ones your model prevents.",
          ]},
          { t: "callout", tag: "EXEC LENS", x: "Connect the three lessons: risk selection determines the book, the book's claims determine gross profit per WSE, and service model plus renewal philosophy determine whether the book stays. That loop, select, price, serve, retain, is the construct of a PEO." },
        ],
      },
    ],
    quiz: [
      { q: "In the standard payroll funds flow, when does the PEO collect from the client?", opts: ["30 days after payday, like a vendor invoice", "Via ACH debit typically one to two banking days before check date, covering wages, taxes, insurance, and fees", "Quarterly in advance", "Only after taxes are remitted"], a: 1, x: "The PEO invoices the full obligation and debits before paying anything out. As long as debits clear, the PEO deploys no cash for wages, which makes collection discipline the heart of the operating model." },
      { q: "A client's ACH debit fails after the PEO has already funded payroll. The structural problem this reveals:", opts: ["The carrier must reimburse the PEO", "The employees must return wages", "The PEO extends unsecured short-term credit equal to a full payroll every cycle, which is why credit underwriting, deposits, and fast nonpayment termination exist", "Nothing, taxes simply defer"], a: 2, x: "The PEO has paid someone else's employees with its own money. Every deposit requirement, wire-only term, and aggressive nonpayment clause in a CSA traces back to this exposure." },
      { q: "Why might one PEO decline a deal another prices aggressively?", opts: ["Licensing differences", "Risk appetite: deal desks underwrite benefits demographics, comp class codes and loss history, state tax posture, and client credit, and selection drives profitability", "PEOs randomly rotate which deals they accept", "Commission disputes"], a: 1, x: "Risk selection is the profit engine. Identical fee schedules produce wildly different economics depending on the book each PEO chose to write, so appetite, not the prospect, decides." },
      { q: "Most of a PEO bill is pass-through money like wages, taxes, and premiums. So which number best shows how the business itself is doing?", opts: ["Total billings per office", "Revenue per salesperson", "Gross profit per worksite employee per month, what the PEO keeps per person after pass-through", "Clients per state"], a: 2, x: "Because wages and premiums flow straight through, total revenue is misleading. Gross profit per worksite employee shows what the PEO actually earns for each person it serves." },
      { q: "Under a large-deductible workers' comp structure, the PEO:", opts: ["Passes all claims to the carrier dollar-one", "Retains the first layer of each claim (often a six-figure deductible), making claims management and worksite safety direct profit levers", "Is uninsured", "Only covers clerical class codes"], a: 1, x: "The PEO keeps the working layer of every claim, sometimes through a captive, and the carrier covers the excess. Every claim dollar avoided is the PEO's dollar, which is why good PEOs are genuinely good at safety and return-to-work." },
      { q: "Why is client retention disproportionately important to PEO economics?", opts: ["Regulators penalize churn", "Acquisition and implementation costs mean accounts often reach true profitability only deep into the relationship, early churn is a loss dressed as a logo", "Retained clients pay higher statutory taxes", "It isn't, new logos matter more"], a: 1, x: "The payback math runs across multiple renewals. That's why PEOs fight at renewal, invest in implementation quality, and treat the first payroll as a trust milestone." },
      { q: "A premium dedicated-HRBP service model versus a software-first self-serve model is best understood as:", opts: ["A branding difference only", "Two different cost structures sold at different price points to different buyers, a P&L choice, not just a CX choice", "A regulatory requirement by state", "Old technology versus new"], a: 1, x: "Service intensity is an economic design decision. High-touch costs more to produce and prices accordingly; self-serve trades human depth for transparency and margin. Match the model to how the client actually operates." },
      { q: "The 'construct of a PEO' as an operating loop is best summarized as:", opts: ["Market, sell, invoice", "Select risk, price it, serve the book, and retain it, claims drive gross profit per WSE, and renewals decide whether the book stays", "Hire, train, promote", "Buy software, resell software"], a: 1, x: "Select, price, serve, retain. Underwriting builds the book, the book's claims set the margin, and service plus renewal philosophy determine duration. Every PEO you'll ever compare is a different answer to that loop." },
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
            "Percent-of-payroll escalates silently. Every raise, every bonus, every commission check increases the PEO's fee, with no additional service delivered. A 3% admin rate on a team averaging $80K is $200 PEPM; give everyone a 10% raise and the fee rises 10% too.",
          ]},
          { t: "callout", tag: "DO THE MATH", x: "Always convert percent-of-payroll quotes to effective PEPM: (annual payroll × rate) ÷ headcount ÷ 12. A '2.8%' quote sounds small; '$187 per employee per month' is a number a buyer can actually compare." },
          { t: "p", x: "Bundled quotes go a step further and blend the admin fee into a single rate that also includes taxes and comp. Bundling makes the admin fee invisible. The Gusto PEO takes the opposite road, published and itemized, and the next lesson shows what's actually inside any PEO bill, ours included." },
        ],
      },
      {
        title: "Anatomy of a PEO invoice",
        blocks: [
          { t: "p", x: "Every PEO bill, however it's formatted, is built from the same five components. A consultant should be able to explain every line of a Gusto PEO bill, and understand the bills clients bring from whatever world they're coming from:" },
          { t: "table", head: ["Component", "What it should be", "Where margin hides"], rows: [
            ["Gross wages", "Pure pass-through", "Nothing, if wages are marked up, run"],
            ["FICA / FUTA", "Statutory pass-through", "Rarely padded, but verify caps are applied"],
            ["SUTA", "Statutory rate pass-through", "Blended or 'company rate' above the client's actual statutory rate"],
            ["Workers' comp", "Manual rate × class code × e-mod, or net rate", "Net rates marked up over the PEO's true cost"],
            ["Benefits + admin fee", "Premiums + disclosed fee", "Benefit 'loads' on top of premium; fee buried in a bundled rate"],
          ]},
          { t: "p", x: "A transparent PEO shows each line, that is the Gusto PEO standard. In the market you'll also meet blended billing: one rate per employee that combines taxes, comp, benefits, and fee into a single number, making the fee itself invisible. Know how blended rates are built (the components above) so you can answer a client's questions about where they're coming from, and explain, concretely, why an itemized bill protects them." },
          { t: "p", x: "Know the industry's most effective camouflage tactic: line-item migration, also called premium shifting. A PEO quotes the same underlying health plan as everyone else, but moves a slice of the true premium out of the premium line and into its fee lines, a benefit administration fee here, a co-employment risk fee there, a technology service fee, a markup line. If the true premium is $500, shifting $70 into the benefits admin fee and $50 into a risk fee lets the proposal display a $380 premium next to competitors' $500 for the identical plan. Buyers anchor on the premium line, the 'cheaper' quote wins, and total cost was never different. Know the tactic exists so nothing in the market confuses you, and so you can explain why the Gusto PEO's structure makes it impossible: published pricing, itemized bills, nothing blended, nothing to migrate." },
          { t: "callout", tag: "FIELD NOTE", x: "SUI rate notices, comp dec pages, and a current invoice aren't ammunition, they're the underwriting and baseline artifacts that let us quote accurately and build the client's honest current-state picture." },
        ],
      },
      {
        title: "SUTA, wage bases, and the mid-year trap",
        blocks: [
          { t: "p", x: "State unemployment (SUTA) is where PEO billing gets genuinely technical, and where you can be the only person in the deal who actually understands what's happening." },
          { t: "list", items: [
            "Reporting varies by state. Some states require PEOs to report under the client's own SUTA account and rate; others allow or require reporting under the PEO's account. Under PEO-rate reporting, a PEO with a strong rate can bill a 'blended' SUTA above its true cost, margin disguised as tax.",
            "Wage bases reset on transitions. SUTA and FICA taxes apply up to annual wage bases per employee. Move mid-year between EINs (into or out of a non-certified PEO) and those bases can restart, the employer pays tax again on wages already taxed.",
            "Timing is a closing tool. This is why January 1 starts are cleanest, and why a CPEO's no-restart protection is a genuine differentiator for mid-year deals.",
          ]},
          { t: "callout", tag: "DO THE MATH", x: "An employee who's earned past a $9,000 SUTA wage base by July, at a 3% rate, costs ~$270 in duplicated SUTA if the base restarts. Multiply by headcount and add restarted FICA above the Social Security wage base for high earners, quantify the trap before the competitor uses it against you." },
        ],
      },
      {
        title: "Workers' comp mechanics",
        blocks: [
          { t: "p", x: "Comp pricing starts with the manual rate for each class code (per $100 of payroll), multiplied by the experience modifier (e-mod). An e-mod of 1.00 is industry average; 1.25 means losses 25% worse than expected and a 25% surcharge; 0.85 means a 15% credit." },
          { t: "list", items: [
            "Master policy. Most PEOs cover WSEs under the PEO's master comp policy. For clients with high e-mods or tough class codes, riding the PEO's program can mean real savings, and a future exit consideration, since the client may leave without its own loss history.",
            "Net rate deals. PEOs often quote comp as a flat 'net rate' per class code. The question is the spread between that net rate and the PEO's actual cost. Competitive deals get priced near cost; lazy deals carry fat spreads.",
            "Pay-as-you-go. Comp billed on actual payroll each cycle, instead of a large up-front deposit and a year-end audit surprise. Real cash-flow value for seasonal or growing businesses, sell it that way.",
          ]},
        ],
      },
      {
        title: "Benefits underwriting & renewal leverage",
        blocks: [
          { t: "p", x: "Master plan pricing is underwriting, not magic. The PEO's carrier evaluates the group, census, ages, zip codes, sometimes medical questions or prior claims, and slots it into the master plan's rate structure." },
          { t: "list", items: [
            "Composite vs age-banded. Composite rates charge one blended rate per tier (EE, EE+spouse, family). Age-banded rates vary by each employee's age. A young group often does better age-banded; an older group benefits from composite blending. Know which structure each quote uses before comparing.",
            "Participation requirements. Plans typically require a minimum share of eligible employees to enroll. A group that can't hit participation can blow up after the sale, verify during discovery, not at implementation.",
            "Renewal behavior. Year one is the honeymoon; the renewal is the marriage. Clients arriving from other PEOs usually arrive because of renewal shock, double-digit increases on a 'great' master plan are the most common reason accounts go back to market. Our renewal philosophy, in writing, is the answer to the fear every one of them brings.",
          ]},
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"Anyone can buy your business with a year-one rate. I'll show you our rate structure and put our renewal philosophy in writing, because year two is what you actually live with.\"" },
        ],
      },
    ],
    quiz: [
      { q: "A client has $4.0M in annual payroll and 50 employees. A PEO quotes a 3% of payroll admin structure. What's the effective PEPM?", opts: ["$100", "$150", "$200", "$240"], a: 2, x: "$4,000,000 × 3% = $120,000 ÷ 50 employees ÷ 12 months = $200 PEPM. Always convert percentage quotes to PEPM so buyers can compare structures honestly." },
      { q: "The core problem with percent-of-payroll admin pricing for the client is:", opts: ["It's illegal in most states", "Fees escalate automatically with every raise and bonus, with no added service", "It can't include workers' comp", "It only works for hourly workforces"], a: 1, x: "Percent-of-payroll pricing ties the fee to compensation, not to service delivered. Payroll grows, the fee grows. It's the quiet escalator in bundled deals." },
      { q: "A client arrives from a PEO that billed one blended rate per employee. What was inside that single number?", opts: ["Only the administrative fee", "Wages only", "Statutory taxes, workers' comp, benefits, and the admin fee, combined so the fee itself is invisible", "A format required by state law"], a: 2, x: "Blended billing folds the pass-throughs and the fee into one rate. Understand it so you can answer questions about where a client is coming from, and explain why the Gusto PEO bills the opposite way: published, itemized, line by line." },
      { q: "A company leaves a non-certified PEO in the middle of the year. Why can that create a tax problem?", opts: ["It cannot, mid-year moves are always free", "Annual tax wage caps can restart under the new employer ID, so some taxes get paid twice that year", "The workers comp rating resets to average", "Benefits premiums suddenly become taxable"], a: 1, x: "Some payroll taxes only apply up to an annual cap per employee. With a non-certified PEO, switching mid-year can restart that cap, so those taxes get paid twice. A certified PEO (CPEO) avoids this, which is a real selling point." },
      { q: "An e-mod of 1.25 means:", opts: ["The client gets a 25% comp discount", "Claims experience is 25% worse than industry expectation, surcharging premium 25%", "The class code is high hazard", "Payroll grew 25%"], a: 1, x: "The experience modifier scales premium to actual loss history versus expected losses. High e-mod clients are exactly the profile that benefits most from a PEO master policy." },
      { q: "The main client benefit of pay-as-you-go workers' comp is:", opts: ["Lower manual rates", "No class codes", "Premiums track actual payroll each cycle, no big deposit, far smaller audit surprises", "It removes the e-mod"], a: 2, x: "Pay-as-you-go is a cash-flow and predictability story. It doesn't change rates; it changes when and how accurately premium is paid." },
      { q: "Comparing two benefit quotes, one composite-rated and one age-banded, you should first:", opts: ["Pick the lower family tier rate", "Recognize the structures price differently by group demographics, model both against the actual census", "Assume composite is always cheaper", "Assume age-banded is always cheaper"], a: 1, x: "A young census often wins age-banded; an older census benefits from composite blending. Quote structures must be run against the real census before any rate comparison means anything." },
      { q: "A proposal shows a $380 premium for the same plan every competitor quotes at $500, alongside a benefits admin fee, a co-employment risk fee, a technology fee, and other line items. The most likely explanation:", opts: ["They negotiated a better carrier rate", "Premium shifting: real premium dollars migrated into the fee lines so the displayed premium anchors cheaper, while total cost is unchanged", "The plan has a much higher deductible", "A state premium subsidy"], a: 1, x: "Line-item migration. Same plan, same carrier, same total, dollars moved out of the premium line because buyers anchor on premiums. Totals, not single lines, are how honest comparisons work, and published, itemized pricing is why the tactic can't hide in a Gusto PEO quote." },
    ],
  },
  {
    id: "gustopeo",
    num: "04",
    title: "Selling the Gusto PEO",
    tagline: "Our product, our market, our motion, what we're building and who it's for.",
    lessons: [
      {
        title: "The market we're entering",
        blocks: [
          { t: "p", x: "Everything in Modules 1–3 is category knowledge, what a PEO is, how one runs, and what builds a bill. This module is about ours. Start with the market: a ~$414B industry that has more than quadrupled since 2012, serving 230,000+ businesses, yet only ~15% of employers with 10–499 employees, and roughly 4% of all US businesses, use a PEO. We are entering a large, growing, and mostly unconverted category." },
          { t: "p", x: "Three broad archetypes operate in it today. Service-heavy nationals sell depth: named HR teams, consulting intensity, premium pricing. Tech-forward platforms sell product: software experience, speed, and in some cases published pricing. Regional specialists sell flexibility: underwriting creativity and local relationships. Know these shapes the way you'd know the geography of any market you sell in, because clients will ask what else is out there, and a confident, fair answer builds more trust than a rehearsed attack." },
          { t: "callout", tag: "HOW WE TALK ABOUT THE MARKET", x: "We don't run teardowns and we don't sell against anyone's invoice. We sell the Gusto PEO: what it is, what it costs, and what it does for the client, next to what they're paying to employ people today. If a client brings another quote, we answer questions honestly and normalize structures so they can see clearly. That's the whole policy." },
          { t: "sources", items: [
            { l: "Market size, growth, client counts, NAPEO Industry Research & Data", u: "https://napeo.org/intro-to-peos/industry-research-data/" },
            { l: "Penetration (~15% of 10–499 EE employers; ~4% of all US businesses), NAPEO: PEO Clients white paper (Oct 2025)", u: "https://napeo.org/wp-content/uploads/2025/10/PEOClients2025_WhitePaper_Web.pdf" },
          ]},
        ],
      },
      {
        title: "The Gusto PEO: one platform, three tiers",
        blocks: [
          { t: "p", x: "The Gusto PEO is built as a ladder, not a single product. Same platform, same payroll engine clients already trust, three ways to buy co-employment:" },
          { t: "list", items: [
            "PEO 1, the flagship. Full co-employment with the master benefits program: large-group medical, dental, vision, ancillary lines, workers' comp, EPLI, and the complete HR and compliance stack. This is the product for the benefits-driven buyer, the majority of the market.",
            "PEO 2, full co-employment without benefits enrollment. Identical foundation, platform, and pricing logic; the only difference is the client keeps its own benefits and broker. This is how we serve clients with broker relationships they value, and how brokers stay allies instead of obstacles.",
            "PEO 3, the certified exchange, once CPEO certification lands. IRS certification under IRC \u00A77705 brings sole federal employment-tax liability and successor-employer treatment under \u00A73511, no wage-base restart, which makes mid-year starts clean and removes the January-only constraint most of the industry lives with.",
          ]},
          { t: "callout", tag: "THE LADDER", x: "Payroll \u2192 PEO 2 \u2192 PEO 1, and someday back down, without ever leaving Gusto. A client can graduate up as they grow and step down if their needs simplify, on one platform, with their data intact. Most of the industry treats leaving a PEO as a breakup; we treat it as a floor change in the same building." },
        ],
      },
      {
        title: "Who we serve and how we reach them",
        blocks: [
          { t: "p", x: "Our ICP comes straight from the industry's own demographics: nearly two-thirds of all PEO clients have 10–49 employees, and roughly half are in professional services, manufacturing, or construction. Layer on the strongest propensity signals, multi-state footprint, benefits-seeking behavior, growth, comp complexity, and that's the target." },
          { t: "p", x: "What makes our motion different is where those targets already live: inside Gusto's payroll base of 500,000+ businesses. The in-base motion runs on lifecycle triggers, a new state registration, a headcount crossing, a benefits question asked in-app, a renewal window opening, surfaced and prioritized so the team starts each day with the accounts most likely to need us now." },
          { t: "list", items: [
            "Internal partnership is a rule, not a vibe. Payroll account owners are partners in every conversion: written rules of engagement, shared credit, and a warm handoff. The payroll team wins every time we win, or the motion dies.",
            "The accountant channel multiplies us. Thousands of accountants already recommend Gusto; equipping them to spot PEO fit in their own client books is distribution no competitor can copy quickly.",
            "The season is real. PEO selling concentrates September through December ahead of January 1 benefits starts, pipeline builds in summer, proposals surge in fall, implementation peaks in December. Plan the year around it.",
          ]},
          { t: "callout", tag: "FIELD NOTE", x: "The trigger beats the list. An account that just registered in a second state or just lost a candidate over benefits is worth ten cold names, the event creates the conversation, and we can see the event." },
          { t: "sources", items: [
            { l: "Client profile (two-thirds at 10–49 EEs; ~half in professional services, manufacturing, construction), NAPEO: PEO Clients, An Analysis (2022)", u: "https://napeo.org/wp-content/uploads/2025/03/analysisofpeo_whitepaper-fin.pdf" },
          ]},
        ],
      },
      {
        title: "Our pricing promise",
        blocks: [
          { t: "p", x: "Module 3 taught the four places any PEO makes money: the admin fee, workers' comp pricing, unemployment taxes, and benefits rates. The Gusto PEO pricing model is built to be the opposite of the industry on all four. Five rules define it." },
          { t: "list", items: ["One flat PEPM admin fee. A single per-employee-per-month number, published and lookup-able, never a percent of payroll. Raises, bonuses, and commissions never increase what the client pays us, because our fee has nothing to do with their wage bill.","Tier-priced, not deal-priced. The admin fee is set by tier (PEO 1, PEO 2, PEO 3) and headcount band, not negotiated case by case. Two similar companies get the same number. No sales-skill tax, no quote roulette.","Pass-throughs always itemized, never marked up. Wages, employer taxes, workers' comp premium, and benefit premiums each appear as their own line at cost. The admin fee is the only thing we earn, and it is the only thing that looks like a fee.","Comp and tax at true rate, spread disclosed. Where we administer workers' comp or unemployment, the client sees the real rate. We do not bury margin in a blended comp or SUTA number.","Renewal philosophy in writing before signing. The client sees how renewals work, what drives them (medical trend and the group's own claims, not a sales lever), and how increases get allocated, before the first invoice. We can't cap what medical trend does, but we can promise no surprises and no games. The renewal is where PEOs are won or lost, and we win it on honesty up front." ] },{ t: "p", x: "Published pricing does in this category what it did for Gusto in payroll: it converts a traditionally opaque, quote-gated sale into one a buyer can start by themselves. In a market where most providers custom-quote everything, the published number is a trust signal before a rep ever speaks." },
          { t: "callout", tag: "ALWAYS EXTRA: EVERYWHERE, INCLUDING HERE", x: "No PEO's admin fee, ours included, covers gross wages, employer taxes (FICA, FUTA, SUTA), health/dental/vision premiums, workers' comp premium, state-mandated coverages, or 401(k) employer contributions. Those are pass-throughs, billed at cost on their own lines, never marked up. Saying this out loud, unprompted, is part of how we sell." },
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"Our admin fee is published, you can see it without talking to me. Your bill will show every component on its own line: wages, taxes, comp, premiums, our fee. And before you sign, I'll put our renewal philosophy in writing, because year two matters more than year one.\"" },
        ],
      },
    ],
    quiz: [
      { q: "The only difference between PEO 1 and PEO 2 is:", opts: ["PEO 2 runs on a different platform", "PEO 2 is full co-employment without benefits enrollment, the client keeps its own benefits and broker", "PEO 2 has no compliance support", "PEO 2 is only for companies over 100 employees"], a: 1, x: "Same foundation, same platform, same co-employment, PEO 2 simply leaves benefits with the client's existing broker. It's how broker relationships become bridges instead of blockers." },
      { q: "What does CPEO certification make possible for the future PEO 3 tier?", opts: ["Exemption from state licensing", "Permission to blend rates", "Sole federal employment-tax liability and successor-employer treatment, no wage-base restart, so mid-year starts are clean", "Lower health premiums by law"], a: 2, x: "IRC \u00A73511 makes a certified PEO solely liable for federal employment taxes and grants successor treatment, eliminating the wage-base restart that makes mid-year moves expensive across most of the industry." },
      { q: "Per NAPEO's client research, the heart of the PEO market, and our ICP, is:", opts: ["Businesses with 500+ employees", "Businesses with 10–49 employees", "Solo founders", "Only tech companies"], a: 1, x: "Nearly two-thirds of all PEO clients have 10–49 employees, with professional services, manufacturing, and construction making up about half the client base." },
      { q: "Why is selling the Gusto PEO into the existing payroll base structurally different from how most PEOs sell?", opts: ["It skips underwriting", "Trust, CAC, and cycle length: we offer an upgrade to customers who already know us, instead of cold-acquiring strangers", "It avoids the CSA", "Payroll clients are legally required to convert"], a: 1, x: "An installed, trusting base changes the economics of every deal, cheaper acquisition, shorter cycles, and a relationship that starts warm. The discipline is prioritizing it intelligently." },
      { q: "The non-negotiable rule of the internal co-sell motion:", opts: ["PEO reps work accounts secretly to move fast", "The payroll account owner wins, in credit and comp, every time we convert their account", "Payroll AEs must not be told about PEO", "Conversions only happen in January"], a: 1, x: "Written rules of engagement and shared credit make the payroll org our distribution engine. Without them, the motion creates enemies inside our own building, the one channel conflict that can kill this product." },
      { q: "PEO selling concentrates September through December because:", opts: ["State law requires fall enrollment", "Most benefits programs start January 1, so decisions cluster in the months before, pipeline builds in summer, implementation peaks in December", "PEOs close their books in August", "Buyers prefer holiday shopping"], a: 1, x: "The January 1 benefits start drives the calendar: summer pipeline, fall proposals and underwriting, December implementation. Plan capacity, marketing, risk, ops, around the season, not after it arrives." },
      { q: "Which costs are NEVER inside any PEO's administrative fee, including ours?", opts: ["Compliance support and tax filing", "Payroll processing", "Gross wages, employer taxes, insurance premiums, and 401(k) employer contributions", "HR technology platform access"], a: 2, x: "Wages, statutory taxes, and premiums are always pass-throughs. We say it out loud, unprompted, transparency about what the fee isn't is part of selling what it is." },
      { q: "Published PEPM pricing matters strategically because:", opts: ["It is required by NAPEO", "It guarantees we're cheapest", "It converts an opaque, quote-gated category into one a buyer can start by themselves, a trust signal before any rep speaks", "It eliminates underwriting"], a: 2, x: "Most of the category custom-quotes everything. A published number changes the buyer's first experience from 'talk to sales to learn anything' to 'I already know where this starts', the same move Gusto made in payroll." },
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
            "Census, every employee, age, zip, salary, state. This drives benefits underwriting and every cost model.",
            "Current benefits, plan summaries, current rates, renewal date, and the last two renewal increases. The renewal date sets your deal clock.",
            "SUI rate notices, the client's actual statutory unemployment rates by state. How we verify rates and quote accurately.",
            "Workers' comp dec page and e-mod worksheet, class codes, payroll by code, current rates, mod history.",
            "A full current invoice, payroll or otherwise. You can't build an honest baseline from a number you've never seen.",
          ]},
          { t: "p", x: "Then the qualitative layer: what triggered this conversation? A compliance scare, a brutal renewal, a key hire demanding better benefits, a new state? The trigger tells you what the proposal must lead with." },
          { t: "callout", tag: "FIELD NOTE", x: "The best timing trigger in this industry is the benefits renewal, 60–120 days out. Build your prospecting calendar around renewal dates the way realtors build theirs around lease expirations." },
        ],
      },
      {
        title: "The proposal moment",
        blocks: [
          { t: "p", x: "Most PEO proposals lose because they compare the PEO's bundle to the client's payroll invoice, apples to a fruit basket. The winning frame is total cost of employment: everything the client pays today to employ people (payroll fees, benefits premiums and broker costs, comp premium and audit true-ups, HR tools, plus the owner's own time) against everything in your proposal, line by line." },
          { t: "list", items: [
            "Anchor on their real current state. Most of our buyers aren't in a PEO today, build their true total cost of employment (payroll fees, benefits premiums and broker costs, comp premium and audit true-ups, the owner's time) and put the Gusto PEO next to it, line by line.",
            "Normalize structures when a client is comparing. If they've gathered other quotes, convert everything to effective PEPM on the same census, clarity serves the client, and transparency is our home field.",
            "Show the year-two story. Our rate structure and our renewal philosophy, in writing. Buyers remember the person who told them the truth about year two.",
          ]},
        ],
      },
      {
        title: "The five objections",
        blocks: [
          { t: "p", x: "Every PEO objection you'll ever hear is a variation of five. Master these as conversations, not scripts:" },
          { t: "list", items: [
            "\"I'll lose control of my employees.\" Direction and control stay with the owner, hiring, firing, pay, management. What transfers is administrative employer status. Make it concrete: nothing about Monday morning changes except who files the taxes.",
            "\"It's too expensive.\" Compared to what? Build the total-cost-of-employment table. Most buyers compare the PEO's all-in number to their payroll fee alone and forget benefits, comp, and the 10 hours a week the owner spends on HR.",
            "\"We already have a broker.\" Don't fight the broker, qualify the relationship. Many deals run through or alongside brokers; if the broker is entrenched, position the comparison through them. A broker who refuses to let the client see a PEO option is telling the client something.",
            "\"What if we want to leave?\" Answer honestly: there's an exit, it has timing (year-end is cleanest for wage bases), benefits transition needs planning, and certified PEOs remove the federal restart penalty. Honesty here closes more deals than evasion ever will.",
            "\"My employees won't like the change.\" For most groups, benefits get richer and the employee experience improves. Offer an employee-facing transition session as part of implementation, turning the objection into a deliverable.",
          ]},
          { t: "p", x: "A sixth objection arrives from the most sophisticated buyers and their advisors: \"the PEO will own my data.\" Payroll history and workers' comp loss runs often sit with the PEO, and a client who exits without its loss history can face worse standalone insurance pricing later. Take it seriously rather than waving it off: know your PEO's data-portability and loss-run release practices cold, get them in writing during the sale, and let the unflinching answer itself do the selling, the rep who handles the data question calmly is the rep who clearly understands exits." },
        ],
      },
      {
        title: "Closing & implementation",
        blocks: [
          { t: "p", x: "PEO sales cycles die in single-threaded deals. The owner cares about cost and risk, the office manager cares about workload, employees care about their doctors staying in-network. Multi-thread early: get the operational person into the demo and the owner into the cost review." },
          { t: "list", items: [
            "Anchor to a date. Benefits renewal or January 1. Open enrollment, comp binding, and payroll cutover all chain backwards from it, a deal without a start date is a pipeline fiction.",
            "Set implementation expectations honestly. Data collection, benefits enrollment, first payroll. The first payroll run is the trust milestone; over-communicate until it lands clean.",
            "Stay in the room after the close. The first renewal is where clients are won for a decade, or lost at a renewal someone else made painful.",
          ]},
          { t: "callout", tag: "SAY IT THIS WAY", x: "\"My job isn't to sell you a PEO. It's to make sure the version of this you're living with in year three is the one you thought you bought.\"" },
        ],
      },
    ],
    quiz: [
      { q: "Which set of discovery artifacts gives you what you need to build an honest cost comparison?", opts: ["Mission statement and org chart", "Census, current benefit rates and renewal date, SUI rate notices, comp dec page/e-mod, and a full current invoice", "Last year's tax return", "The employee handbook"], a: 1, x: "Those five artifacts drive underwriting and the honest current-state baseline. Without them, your proposal is an estimate competing against another estimate." },
      { q: "A prospect says, \"I don't want some PEO controlling my people.\" The accurate response centers on:", opts: ["Offering a discount", "Explaining that direction and control of day-to-day work stays entirely with the owner; the PEO is the administrative employer", "Agreeing that control is shared 50/50", "Suggesting an EOR instead"], a: 1, x: "The control objection is answered by the structure itself. Hiring, firing, pay, and management never leave the client. Make Monday morning concrete." },
      { q: "The strongest frame for handling \"it's too expensive\" is:", opts: ["Matching the competitor's price", "Total cost of employment: everything they pay today across payroll, benefits, comp, and owner time vs. the proposal, line by line", "Extending the contract term", "Removing benefits from the quote"], a: 1, x: "Most buyers compare your all-in number to their payroll fee alone. Rebuild the full current-state cost stack first; the comparison usually flips." },
      { q: "The most honest and effective answer to \"what if we want to leave?\" includes:", opts: ["\"Nobody ever leaves\"", "Refusing to discuss exit before signing", "Explaining exit timing (year-end is cleanest), benefits transition planning, and CPEO protection against federal wage-base restart", "Pointing to the termination fee"], a: 2, x: "Exit honesty is a trust accelerant. Buyers who hear a straight answer about leaving become dramatically more comfortable arriving." },
      { q: "The best-timed prospecting trigger in PEO sales is:", opts: ["The client's fiscal year-end", "60–120 days before the benefits renewal", "Right after open enrollment closes", "The day SUI notices arrive"], a: 1, x: "Renewal shock is the moment pain, budget, and deadline align. Build the prospecting calendar around renewal dates." },
      { q: "Why multi-thread a PEO deal?", opts: ["To increase the contract value", "Owner, operator, and employees each hold different concerns (cost/risk, workload, benefits continuity), any one of them can stall a single-threaded deal", "Because CSAs require multiple signatures", "To shorten implementation"], a: 1, x: "Deals die when the person you never met raises the concern you never addressed. Get the operational buyer into the demo early." },
      { q: "A prospect's CPA warns: 'Don't sign, the PEO will own your payroll data and comp loss runs.' The strongest response:", opts: ["Dismiss it, data ownership never matters in practice", "Acknowledge it's a real consideration, present the PEO's data-portability and loss-run release practices in writing during the sale, and let the prepared answer itself build trust", "Offer a discount to change the subject", "Promise the CPA the data always stays with the client, regardless of the CSA"], a: 1, x: "Data ownership is the sophisticated buyer's objection, and it's legitimate: exiting without loss history can mean worse standalone insurance pricing. The rep who answers it calmly, in writing, before being pressed is the rep who clearly understands exits, and wins the CPA as an ally." },
      { q: "What is the best way to use industry stats like 27% ROI or 12% lower turnover in a sales conversation?", opts: ["Promise the client they will get exactly those results", "Open every meeting by reciting them", "Use them as credible third-party context, then build the case on the client own real numbers", "Never mention them"], a: 2, x: "Averages get attention but do not close deals. Cite the NAPEO benchmarks for credibility, then run the client actual costs and turnover so the decision rests on their data." },
    ],
  },
];

/* ============================================================
   COMPONENTS
   ============================================================ */

const GLOSSARY = {
  "PEO": ["Professional Employer Organization", "A firm that enters a co-employment relationship with client businesses, becoming the administrative employer for payroll, employment taxes, benefits sponsorship, and workers' compensation while the client retains full direction and control of the work."],
  "CPEO": ["Certified Professional Employer Organization", "A PEO certified by the IRS under IRC §7705: annual audited financials, CPA-verified quarterly assertions, a bond, and background standards. Under IRC §3511 a CPEO is solely liable for federal employment taxes on WSE wages, gets successor-employer treatment (no mid-year wage-base restart), and preserves specified tax credits at the customer level."],
  "ESAC": ["Employer Services Assurance Corporation", "The PEO industry's independent accreditation program, backed by surety bonding that protects clients if an accredited PEO fails to remit payroll, taxes, or contributions. Separate from IRS certification, the strongest PEOs hold both."],
  "NAPEO": ["National Association of Professional Employer Organizations", "The PEO industry's trade association and the primary source of industry research, benchmarks, and client data."],
  "WSE": ["Worksite Employee", "A client company's employee covered under the co-employment arrangement. Industry scale is measured in WSEs."],
  "CSA": ["Client Service Agreement", "The governing contract between PEO and client. It allocates employer responsibilities, sets pricing structure and rate-adjustment rights, and defines termination notice, benefits exit terms, and indemnification."],
  "ASO": ["Administrative Services Organization", "HR and payroll administration without co-employment: taxes file under the client's own EIN and the client keeps its own benefit plans and rates. No master plan access."],
  "EOR": ["Employer of Record", "A provider that becomes the sole legal employer, beyond co-employment, typically used to hire in states or countries where the client has no legal entity."],
  "EIN": ["Employer Identification Number", "The federal tax ID a business files employment taxes under. Whose EIN the wages run under is the cleanest dividing line between PEO and ASO arrangements."],
  "PEPM": ["Per Employee Per Month", "A flat administrative fee charged per employee each month, and the unit every quote should be normalized to before comparing structures."],
  "FICA": ["Federal Insurance Contributions Act", "Social Security and Medicare payroll taxes, shared by employer and employee. Social Security applies up to an annual wage base, which is why mid-year EIN changes can duplicate tax."],
  "FUTA": ["Federal Unemployment Tax Act", "The federal unemployment tax, applied to a small annual wage base per employee."],
  "SUTA": ["State Unemployment Tax Act", "State unemployment tax, experience-rated per employer with state-specific rates and wage bases. How PEOs report SUTA (client-level vs PEO-level account) varies by state, and is where blended-rate margin can hide."],
  "SUI": ["State Unemployment Insurance", "The state unemployment system funded by SUTA. The client's SUI rate notice is a core discovery artifact, it's how you verify the rate on any invoice."],
  "e-mod": ["Experience Modifier", "The multiplier that scales workers' comp premium to an employer's actual loss history versus industry expectation. 1.00 is average; 1.25 means a 25% surcharge; 0.85 means a 15% credit."],
  "WC": ["Workers' Compensation", "Insurance covering workplace injuries. In a PEO, coverage typically runs through the PEO's master policy, often pay-as-you-go, priced by class code and e-mod."],
  "EPLI": ["Employment Practices Liability Insurance", "Coverage for discrimination, harassment, and wrongful-termination claims. 'Included' EPLI deserves one question: what's the deductible?"],
  "MEP": ["Multiple Employer Plan", "A single retirement plan (typically 401(k)) that many employers adopt into, the standard PEO structure, pooling pricing and administration while adopting employers retain some fiduciary duty."],
  "MEWA": ["Multiple Employer Welfare Arrangement", "The ERISA classification for a health plan covering employees of multiple unrelated employers, the long-running regulatory question around PEO-sponsored plans."],
  "ERISA": ["Employee Retirement Income Security Act", "The federal law governing employer-sponsored benefit plans, including fiduciary duties and plan classification."],
  "ACA": ["Affordable Care Act", "The federal health law that created the employer mandate and 1094/1095 reporting."],
  "ALE": ["Applicable Large Employer", "An employer with 50+ full-time (or equivalent) employees under the ACA, subject to the employer mandate. Determined by the client's own headcount, joining a PEO doesn't change it."],
  "COBRA": ["Consolidated Omnibus Budget Reconciliation Act", "Federal continuation coverage allowing employees to keep group health insurance after employment ends, administration usually handled by the PEO."],
  "HSA": ["Health Savings Account", "A tax-advantaged medical savings account paired with a high-deductible health plan."],
  "FSA": ["Flexible Spending Account", "A tax-advantaged account for medical or dependent-care expenses, generally use-it-or-lose-it."],
  "WOTC": ["Work Opportunity Tax Credit", "A federal hiring credit for employing individuals from targeted groups, one of the specified credits preserved at the customer level under IRC §3511(d)."],
  "IRC": ["Internal Revenue Code", "The federal tax statute. The PEO-relevant sections: §7705 (CPEO certification) and §3511 (CPEO tax treatment)."],
  "TEFRA": ["Tax Equity and Fiscal Responsibility Act of 1982", "The 1982 tax law whose pension safe harbor fueled the original staff-leasing boom, closed in 1986, but the industry it sparked became the modern PEO."],
  "OSHA": ["Occupational Safety and Health Administration", "The federal workplace-safety regulator. Worksite safety obligations stay with the client, since the worksite and its hazards belong to them."],
  "EEOC": ["Equal Employment Opportunity Commission", "The federal agency enforcing workplace discrimination law, which analyzes actual control, so the client never stops being an employer in its eyes."],
  "ACH": ["Automated Clearing House", "The electronic bank-transfer network the PEO funds flow runs on, the debit that lands one to two banking days before check date."],
  "EWA": ["Earned Wage Access", "Letting employees access wages they've already earned before payday, a recruiting and retention lever, especially for hourly and blue-collar workforces."],
  "ICP": ["Ideal Customer Profile", "The definition of the accounts most likely to convert and retain, in PEO, typically 10–49 employees, multi-state, benefits-seeking."],
  "CAC": ["Customer Acquisition Cost", "The fully loaded cost to win a customer. Selling into an installed base structurally beats cold acquisition on CAC."],
  "GTM": ["Go-To-Market", "The strategy and motion for bringing a product to customers: targeting, channels, pricing, and sales process."],
  "SLA": ["Service Level Agreement", "A committed performance standard, like time to a clean first payroll."],
  "HRBP": ["HR Business Partner", "A dedicated HR professional assigned to support a client, the premium end of the PEO service-model spectrum."],
  "ADP": ["Automatic Data Processing", "The largest payroll company and, through ADP TotalSource, the largest PEO."],
  "BLS": ["Bureau of Labor Statistics", "Federal source for employment, wage, and turnover data often cited in PEO ROI cases."],
  "EPL": ["Employment Practices Liability", "The category of risk (discrimination, harassment, wrongful termination) that EPLI insures."],
  "FLSA": ["Fair Labor Standards Act", "The federal law governing minimum wage, overtime, and exempt vs non-exempt classification, core PEO compliance territory."],
  "FMLA": ["Family and Medical Leave Act", "Federal job-protected leave law; PEOs help clients administer eligibility and tracking."],
  "FTE": ["Full-Time Equivalent", "A headcount measure combining part-timers into full-time units; used for ALE determination under the ACA."],
  "HCM": ["Human Capital Management", "The broad software category (payroll, HR, benefits, talent) that PEOs and platforms compete in."],
  "HDHP": ["High-Deductible Health Plan", "A lower-premium plan paired with an HSA, central to the gap-coverage plan-design play."],
  "HRIS": ["Human Resource Information System", "The system of record for employee data; a PEO provides one as part of the platform."],
  "KPI": ["Key Performance Indicator", "A headline metric used to run the sales motion (WSEs sold, gross profit per WSE, retention)."],
  "POP": ["Premium Only Plan", "A Section 125 plan letting employees pay their insurance share pre-tax; a small but real savings PEOs administer."],
  "ROI": ["Return on Investment", "The core PEO value claim; NAPEO research puts it around 27%, or about $1,273 returned per $1,000 spent."],
  "SMB": ["Small and Medium-sized Business", "The core PEO market, especially employers with 10 to 99 employees."],
  "SOC": ["System and Organization Controls", "Audit reports (SOC 1/SOC 2) on a provider's financial and security controls; trust signals in vendor diligence."],
  "SUTADumping": ["SUTA Dumping", "The illegal practice of manipulating state unemployment accounts to lower tax rates, addressed by the 2004 federal SUTA Dumping Prevention Act."],
  "TPA": ["Third-Party Administrator", "An outside firm that administers benefits or claims; a PEO brings much of this in-house."],
  "TCOE": ["Total Cost of Employment", "The full per-employee cost (wages, taxes, benefits, comp, admin time) that the PEO value case is built against."],
  "VEBA": ["Voluntary Employees' Beneficiary Association", "A tax-exempt trust some larger employers use to fund benefits; occasionally relevant in benefits structuring."],
};

const INLINE_EXCLUDE = new Set(["PEO"]);
const TERM_KEYS = Object.keys(GLOSSARY).filter((k) => !INLINE_EXCLUDE.has(k)).sort((a, b) => b.length - a.length);
const TERM_RE = new RegExp("\\b(?:" + TERM_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|") + ")s?\\b", "g");

const TermContext = createContext(null);

function Term({ k, text }) {
  const open = useContext(TermContext);
  if (!open) return text;
  return (
    <button className="term" onClick={(e) => { e.stopPropagation(); open(k); }} title={GLOSSARY[k][0]}>
      {text}
    </button>
  );
}

function glossarize(text) {
  if (typeof text !== "string") return text;
  const out = [];
  let last = 0, m;
  TERM_RE.lastIndex = 0;
  while ((m = TERM_RE.exec(text)) !== null) {
    const raw = m[0];
    const key = GLOSSARY[raw] ? raw : raw.replace(/s$/, "");
    if (!GLOSSARY[key]) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<Term key={m.index} k={key} text={raw} />);
    last = m.index + raw.length;
  }
  if (out.length === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function TermPopup({ termKey, onClose }) {
  const [browseAll, setBrowseAll] = useState(termKey === "__LEGEND__");
  const entry = !browseAll && GLOSSARY[termKey];
  return (
    <div className="term-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Glossary">
      <div className="term-card" onClick={(e) => e.stopPropagation()}>
        {entry ? (
          <div>
            <span className="term-acro">{termKey}</span>
            <div className="term-full">{entry[0]}</div>
            <p className="term-def">{entry[1]}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <button className="btn primary" onClick={onClose}>Got it</button>
              <button className="btn ghost" onClick={() => setBrowseAll(true)}>Browse all terms</button>
            </div>
          </div>
        ) : (
          <div>
            <span className="term-acro">THE OPERATOR'S GLOSSARY</span>
            <div className="term-full">Key terms & acronyms</div>
            <div style={{ marginTop: 10 }}>
              {Object.keys(GLOSSARY).sort().map((k) => (
                <div className="gloss-item" key={k}>
                  <b>{k}</b>, {GLOSSARY[k][0]}
                  <p>{GLOSSARY[k][1]}</p>
                </div>
              ))}
            </div>
            <button className="btn primary" style={{ marginTop: 18 }} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Block({ b }) {
  if (b.t === "p") return <p>{glossarize(b.x)}</p>;
  if (b.t === "list") return <ul>{b.items.map((it, i) => <li key={i}>{glossarize(it)}</li>)}</ul>;
  if (b.t === "callout") return (
    <div className="callout"><span className="tag">{b.tag}</span>{glossarize(b.x)}</div>
  );
  if (b.t === "table") return (
    <div style={{ overflowX: "auto" }}>
      <table className="ledger-table">
        <thead><tr>{b.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{glossarize(c)}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
  if (b.t === "sources") return (
    <div className="sources">
      <span className="src-tag">SOURCES</span>
      <ul>{b.items.map((s, i) => (
        <li key={i}><a href={s.u} target="_blank" rel="noopener noreferrer">{s.l}</a></li>
      ))}</ul>
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
      <p className="q-text">{glossarize(q.q)}</p>
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
          {glossarize(q.x)}
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
  { id: "crm", label: "CRM & Tools" },
  { id: "course", label: "PEO Training" },
  { id: "landscape", label: "Competitors" },
  { id: "swot", label: "Market SWOT" },
  { id: "construct", label: "Gusto PEO Construct" },
  { id: "gtm", label: "Go-To-Market" },
  { id: "keys", label: "What Makes a PEO Win" },
  { id: "plan", label: "90-Day Plan" },
  { id: "resources", label: "Resources" },
];

function AboutTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">CANDIDATE · HEAD OF PEO SALES</div>
        <h1>Gabriel Revnew<span className="hl">.</span><br />PEO operator, builder, player-coach.</h1>
        <p className="lede">
          Eight years selling and leading PEO sales at TriNet, Sales Leader of the Year,
          top Sales Director in % to plan four years running, plus founder of an independent
          PEO brokerage and a forensic proposal-audit product. I've sold this category from
          inside a national PEO, brokered it independently, and built software to take it
          apart line by line.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat"><div className="v">Leader of the Year</div><div className="l">C-suite-selected top leader across all of TriNet, 2022–23</div></div>
        <div className="stat"><div className="v">5 years</div><div className="l">Running the #1-ranked team in the country · 128% of plan FY2025–26</div></div>
        <div className="stat"><div className="v">7×</div><div className="l">Summit Achiever at 150%+ of quota (2019–2025)</div></div>
        <div className="stat"><div className="v">100%</div><div className="l">Of consultants to President's Club · the only team at TriNet to do it</div></div>
        <div className="stat"><div className="v">35%+</div><div className="l">YoY growth, five consecutive years</div></div>
        <div className="stat"><div className="v">2 products</div><div className="l">PEOLens proposal audits · PEO Prospecting Agent</div></div>
      </div>

      <div className="card">
        <div className="kicker">TRACK RECORD</div>
        <h2>Career</h2>
        <div className="timeline" style={{ marginTop: 18 }}>
          <div className="t-item">
            <div className="t-when">AUG 2018, PRESENT · DENVER</div>
            <div className="t-role">TriNet, Regional Sales Consultant → Regional Director of Sales</div>
            <p className="t-desc">Nearly eight years selling and leading PEO sales. As Regional Director, ran a player-coach, metrics-driven, consultant-style motion: discovery artifacts before proposals, unbundled comparisons, honest year-two conversations.</p>
            <ul className="t-list">
              <li><b>TriNet Sales Leader of the Year (2022–23)</b>, the company's top sales leadership honor</li>
              <li><b>Top Sales Director in % to plan, 2022–2025</b>, including <b>128% of plan</b> in FY2025–26</li>
              <li><b>100% of the team</b> to President's Club, 2023–24. The only team at TriNet to do it</li>
              <li><b>35%+ year-over-year growth</b>, five consecutive years</li>
              <li><b>7× Summit Achiever</b> at 150%+ of quota (2019–2025)</li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">SEP 2016, AUG 2018 · BOULDER, CO</div>
            <div className="t-role">CollegiateParent, Director of Sales</div>
            <p className="t-desc">Brought in post-acquisition to build the sales department from zero, first experience building both a sales motion and a product line rather than inheriting them.</p>
            <ul className="t-list">
              <li>Recruited, hired, and coached <b>6 inside & outside reps</b>; instrumented performance metrics across the full funnel</li>
              <li>Grew company sales <b>50% in year one</b></li>
              <li>Built and launched <b>College Parent Magazine</b>, distributed across <b>35 collegiate campuses</b> nationwide at <b>500,000+ copies</b>, driving <b>$1MM+ in additional first-year revenue</b></li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">2013, 2016 · CHAPEL HILL, NC</div>
            <div className="t-role">AroundCampus Group, Sales Team Leader → Senior Regional Manager</div>
            <p className="t-desc">Started as a sales intern ranked <b>#9 of 690 nationally</b> (#1 in region), then promoted four times in three years.</p>
            <ul className="t-list">
              <li>Ranked <b>#1 of 18 Regional Managers</b>; grew regional sales <b>26% ($300K+)</b></li>
              <li>Recruited and trained the <b>top 4 nationally ranked reps out of 760</b></li>
              <li>Built and delivered sales training to <b>650+ sales interns</b> through the Sales Foundation Academy</li>
              <li>As Regional Sales Manager: <b>103% of a $641K regional goal</b>, up <b>25% YoY</b>, while hiring and training <b>45 reps</b></li>
              <li>Inside sales season: <b>$185K in 6 weeks at 150% of goal</b>, #1 of 10 reps</li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">MAR 2026, PRESENT · STEALTH MODE</div>
            <div className="t-role">PEO Consulting Partners & PEOLens, Founder</div>
            <p className="t-desc">Launched in stealth in March 2026 and deliberately non-active, currently building fundamentals, with one proof-of-concept client placed. The build is the point:</p>
            <ul className="t-list">
              <li>Independent brokerage platform covering <b>28 PEOs across 46 states</b>, comparison engine, savings calculator, PEO directory, referral portal, full SEO/content system</li>
              <li><b>PEOLens</b>, forensic proposal-audit tool that normalizes competing quotes to a canonical cost ontology and exposes the real admin fee inside bundled rates</li>
              <li>Total-cost transparency, exposing what bundled structures hide, productized</li>
            </ul>
          </div>
          <div className="t-item">
            <div className="t-when">FOUNDATION</div>
            <div className="t-role">Pennsylvania Army National Guard, Combat Medic Team Leader</div>
            <p className="t-desc">Led a medic team while completing an A.A. at Valley Forge Military College and a degree in Economics at Penn State. Leadership under pressure, learned early.</p>
          </div>
        </div>

        <h3>Why this role, why me</h3>
        <p>
          Gusto's PEO is a distribution play: selling co-employment into an installed base that
          already trusts the platform, amplified through the accountant channel. That motion needs a
          leader who knows the PEO category cold, underwriting, pricing mechanics, the competitive
          landscape, and who builds systems, playbooks, and reps rather than just carrying a bag.
          That intersection is exactly where I've spent the last eight years.
        </p>
        <p>
          And there's a pattern underneath it: I've launched a revenue-generating product at
          every stop, College Parent Magazine ($1MM+ in year one), PEO Consulting Partners,
          PEOLens, and the PEO Prospecting Agent built live during this process. Gusto is
          launching a product. I launch products.
        </p>
        <div className="callout"><span className="tag">SALES PHILOSOPHY</span>
          Player-coach. Metrics over vibes. Consultants, not pitchmen: reps who can read a census,
          build an honest total-cost baseline, and tell a buyer the truth about year two, because that's what
          retains the book that makes PEO economics work.
        </div>
      </div>
    </div>
  );
}

const AGENT_ACCOUNTS = [
  { name: "Bluebird Dental Group", industry: "Professional services", ees: 18, states: ["CO"],
    signals: [["Benefits quote requested in-app", 25], ["Medical renewal in ~90 days", 20], ["Headcount in 10–49 sweet spot", 15], ["Two open roles posted", 10]],
    talk: "You asked about group health options last month, and your renewal lands in about 90 days, exactly the window where a comparison is worth running. Want me to model your census on a large-group master plan next to your current quote, line by line?" },
  { name: "Cedar Creek Veterinary", industry: "Healthcare services", ees: 14, states: ["CO", "NM"],
    signals: [["New NM clinic opening", 20], ["Benefits renewal in ~60 days", 20], ["Headcount in 10–49 sweet spot", 15], ["Multi-state payroll begins", 13]],
    talk: "Congrats on the Las Cruces clinic. The week you run payroll in a second state, your compliance surface doubles, and with your benefits renewal about 60 days out, this is the natural moment to look at handling both in one move." },
  { name: "Summit Peak Builders", industry: "Construction", ees: 34, states: ["CO", "WY"],
    signals: [["Workers' comp renewal in ~75 days", 20], ["Crossed 25 employees", 15], ["Hourly workforce, EWA fit", 15], ["Multi-state footprint", 10]],
    talk: "With comp renewal coming and the crew past 25, two numbers decide everything: your class-code rates and your mod. Bring the dec page and loss runs, if a master program prices your codes better, you'll see it in black and white." },
  { name: "Pixel & Pine Studio", industry: "Software & design", ees: 12, states: ["CO", "NY", "TX"],
    signals: [["Lost a candidate over benefits", 20], ["Three-state remote team", 15], ["Hiring four roles", 12], ["Headcount in sweet spot", 10]],
    talk: "Losing a candidate over benefits at 12 people usually means the small-group quote can't compete. A master plan changes the math, same census, large-group rates, and with employees in three states, the compliance lift comes with it." },
  { name: "Harvest Lane Logistics", industry: "Logistics", ees: 47, states: ["CO", "UT", "AZ"],
    signals: [["Registered in AZ three weeks ago", 15], ["Hourly workforce, EWA fit", 15], ["Approaching 50-employee threshold", 10], ["Multi-state footprint", 10]],
    talk: "Saw the new Arizona registration, that's three states of wage-and-hour rules now. Worth a 20-minute look at what consolidating compliance, comp, and earned wage access for an hourly team would do for both retention and the back office." },
  { name: "Iron Horse Fabrication", industry: "Manufacturing", ees: 28, states: ["CO"],
    signals: [["Comp claims frequency rising", 15], ["Renewal in ~140 days", 10], ["Headcount in sweet spot", 15]],
    talk: "Your mod is moving the wrong direction, and that compounds at every renewal. The fix is claims management and safety programs, exactly what a master program is incentivized to provide. We have 140 days, which is enough time to do it right." },
  { name: "Front Range Accounting", industry: "Professional services", ees: 9, states: ["CO"],
    signals: [["Firm is a Gusto accountant partner", 18], ["Asked about 401(k) options", 12], ["Under 10 employees", 5]],
    talk: "As a partner firm you already know the platform, the question is whether a PEO tier fits your own practice, and whether your clients should hear about it from you first. Happy to walk through both." },
  { name: "Aspen Trail Hospitality", industry: "Restaurants", ees: 52, states: ["CO"],
    signals: [["High turnover flag", 12], ["Hourly workforce, EWA fit", 15], ["No group health offered", 6]],
    talk: "Turnover is the quiet tax in hospitality. Earned wage access plus even a basic benefits package measurably moves retention, and participation requirements are the first thing to verify before anyone quotes you, so let's check that before pricing anything." },
];

const SIGNAL_LIBRARY = [
  { id: "benefits_q", label: "Asked about benefits / health coverage", pts: 25, why: "active benefits intent" },
  { id: "renewal", label: "Benefits or comp renewal in ~90 days", pts: 20, why: "a renewal window is open" },
  { id: "new_state", label: "Just registered in a new state", pts: 18, why: "multi-state compliance just got harder" },
  { id: "sweet_spot", label: "Headcount in the 10–49 sweet spot", pts: 15, why: "the core of the PEO market" },
  { id: "hourly", label: "Hourly / blue-collar workforce (EWA + comp fit)", pts: 15, why: "earned wage access and comp savings land hard here" },
  { id: "crossed_25", label: "Recently crossed 25 employees", pts: 12, why: "HR complexity outgrew the back office" },
  { id: "lost_candidate", label: "Lost a hire over benefits", pts: 20, why: "small-group coverage just cost them talent" },
  { id: "comp_claims", label: "Workers' comp mod climbing / claims rising", pts: 15, why: "a master program is the fix they need" },
  { id: "multistate", label: "Already multi-state", pts: 10, why: "compliance surface is already wide" },
  { id: "growth", label: "Hiring / growing fast", pts: 10, why: "growth multiplies HR load" },
  { id: "partner", label: "Accountant-partner referral", pts: 18, why: "a trusted advisor is already in the room" },
  { id: "no_health", label: "Offers no group health today", pts: 8, why: "greenfield for the benefits story" },
];

function buildTalkTrack(acct, chosen) {
  const has = (id) => chosen.includes(id);
  const name = acct.name || "this account";
  if (has("lost_candidate"))
    return "Losing a candidate over benefits usually means a small-group quote that can't compete. A master plan changes the math, same census, large-group rates. Worth twenty minutes to model it?";
  if (has("benefits_q") && has("renewal"))
    return "You were already asking about coverage, and your renewal is inside ninety days. That's the exact window to put your current quote next to a master-plan option, line by line. Want me to run it?";
  if (has("new_state") || has("multistate"))
    return "The week you run payroll in another state, your compliance surface doubles. That's the natural moment to look at consolidating payroll, benefits, and compliance into one relationship, before the next registration.";
  if (has("comp_claims"))
    return "When the mod moves the wrong way it compounds at every renewal. The fix is claims management and safety programs inside a master comp program. Bring the dec page and loss runs and we'll see what your codes really price at.";
  if (has("hourly"))
    return "For an hourly team, earned wage access plus a real benefits floor moves retention more than almost anything else, and a master comp program usually prices your class codes better. Both ride on the same platform you already run payroll on.";
  if (has("renewal"))
    return "Your renewal window is open, which is the one time a year a comparison actually costs you nothing. Let's put your current state next to a Gusto PEO quote and see if it's worth a move.";
  return "Based on what we're seeing, you look like a strong fit for the Gusto PEO. It usually takes about fifteen minutes to gather the few documents I need to build a full quote, and more often than not we can show a net-positive ROI for you and your team. Want to grab those together?";
}

function scoreAccount(acct) {
  const pts = acct.signals.reduce((s, id) => {
    const sig = SIGNAL_LIBRARY.find((x) => x.id === id);
    return s + (sig ? sig.pts : 0);
  }, 0);
  return Math.min(99, 25 + pts);
}

const SAMPLE_INPUT = [
  { name: "Bluebird Dental Group", industry: "Professional services", ees: 18, states: "CO", signals: ["benefits_q", "renewal", "sweet_spot", "growth"] },
  { name: "Summit Peak Builders", industry: "Construction", ees: 34, states: "CO, WY", signals: ["comp_claims", "crossed_25", "hourly", "multistate"] },
  { name: "Pixel & Pine Studio", industry: "Software & design", ees: 12, states: "CO, NY, TX", signals: ["lost_candidate", "multistate", "growth", "sweet_spot"] },
  { name: "Front Range Accounting", industry: "Professional services", ees: 9, states: "CO", signals: ["partner", "benefits_q"] },
];

function AgentEngine() {
  const [accounts, setAccounts] = useState([]);
  const [draft, setDraft] = useState({ name: "", industry: "", ees: "", states: "", signals: [] });
  const [open, setOpen] = useState(-1);

  const addAccount = () => {
    if (!draft.name.trim()) return;
    setAccounts([...accounts, { ...draft, ees: Number(draft.ees) || 0 }]);
    setDraft({ name: "", industry: "", ees: "", states: "", signals: [] });
  };
  const loadSamples = () => { setAccounts(SAMPLE_INPUT.slice()); setOpen(-1); };
  const clearAll = () => { setAccounts([]); setOpen(-1); };
  const toggleSig = (id) =>
    setDraft((d) => ({ ...d, signals: d.signals.includes(id) ? d.signals.filter((x) => x !== id) : [...d.signals, id] }));

  const ranked = accounts
    .map((a, idx) => ({ ...a, _idx: idx, score: scoreAccount(a) }))
    .sort((x, y) => y.score - x.score);
  const tier = (s) => (s >= 80 ? ["HOT", "hot"] : s >= 65 ? ["WARM", "warm"] : ["WATCH", "watch"]);

  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [researching, setResearching] = useState(false);
  const [researchNote, setResearchNote] = useState(null);

  const runResearch = async () => {
    if (!query.trim() && !domain.trim()) return;
    setResearching(true); setResearchNote(null);
    try {
      const r = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: query.trim(), domain: domain.trim() }),
      });
      const data = await r.json();
      if (!data.ok) {
        setResearchNote(data.message || "Live research is unavailable. Enter details manually below.");
      } else {
        const acct = {
          name: data.company,
          industry: data.industry || "",
          ees: data.employees || 0,
          states: data.states || "",
          signals: data.signals || [],
          _summary: data.summary || "",
          _source: data.employeesSource,
          _alt: data.employeesAlt,
          _confidence: data.employeesConfidence,
          _apollo: data.apolloUsed,
        };
        setAccounts((a) => [...a, acct]);
        setOpen(0);
        setQuery(""); setDomain("");
      }
    } catch {
      setResearchNote("Live research is unavailable right now. Enter details manually below.");
    } finally {
      setResearching(false);
    }
  };

  return (
    <div>
      <div className="agent-builder" style={{ marginBottom: 14 }}>
        <span className="roi-label">LIVE RESEARCH, LET THE AGENT DO THE WORK</span>
        <div className="roi-grid" style={{ gridTemplateColumns: "2fr 1.4fr auto" }}>
          <div><input className="roi-input" value={query} placeholder="Company name, e.g. Landlocked Cards" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runResearch()} /></div>
          <div><input className="roi-input" value={domain} placeholder="domain (optional)" onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runResearch()} /></div>
          <div><button className="btn primary" style={{ width: "100%" }} disabled={researching} onClick={runResearch}>{researching ? "Researching..." : "Research & score"}</button></div>
        </div>
        {researching && <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "10px 2px 0" }}>Searching the web, verifying headcount, detecting signals. This takes a few seconds.</p>}
        {researchNote && <div className="callout" style={{ marginTop: 12 }}><span className="tag">MANUAL MODE</span>{researchNote}</div>}
      </div>

      <div className="agent-builder">
        <span className="roi-label" style={{ marginBottom: 8, display: "block" }}>OR BUILD AN ACCOUNT BY HAND</span>
        <div className="roi-grid">
          <div><span className="roi-label">ACCOUNT NAME</span>
            <input className="roi-input" value={draft.name} placeholder="Acme Co." onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><span className="roi-label">INDUSTRY</span>
            <input className="roi-input" value={draft.industry} placeholder="Construction" onChange={(e) => setDraft({ ...draft, industry: e.target.value })} /></div>
          <div><span className="roi-label">EMPLOYEES</span>
            <input className="roi-input" type="number" value={draft.ees} placeholder="25" onChange={(e) => setDraft({ ...draft, ees: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <span className="roi-label">STATE(S)</span>
          <input className="roi-input" value={draft.states} placeholder="CO, WY" onChange={(e) => setDraft({ ...draft, states: e.target.value })} />
        </div>
        <div style={{ marginTop: 14 }}>
          <span className="roi-label">SIGNALS, TAP ALL THAT APPLY</span>
          <div className="sig-pick">
            {SIGNAL_LIBRARY.map((s) => (
              <button key={s.id} type="button"
                className={"sig-toggle" + (draft.signals.includes(s.id) ? " on" : "")}
                onClick={() => toggleSig(s.id)}>
                {s.label}<b>+{s.pts}</b>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn primary" onClick={addAccount}>Score this account</button>
          <button className="btn ghost" onClick={loadSamples}>Load sample accounts</button>
          {accounts.length > 0 && <button className="btn ghost" onClick={clearAll}>Clear</button>}
        </div>
      </div>

      {ranked.length === 0 ? (
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", textAlign: "center", margin: "22px 4px 4px", lineHeight: 1.6 }}>
          Enter an account above, or tap <b>Load sample accounts</b> to watch the engine rank a book instantly.
        </p>
      ) : (
        <div style={{ marginTop: 22 }}>
          <div className="src-tag" style={{ marginBottom: 10 }}>RANKED, {ranked.length} ACCOUNT{ranked.length > 1 ? "S" : ""}</div>
          {ranked.map((a, i) => {
            const [label, cls] = tier(a.score);
            const isOpen = open === i;
            const chosen = a.signals;
            return (
              <div className="agent-card" key={a._idx}>
                <div className="agent-head" role="button" tabIndex={0}
                  style={isOpen ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : undefined}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  onKeyDown={(e) => e.key === "Enter" && setOpen(isOpen ? -1 : i)}>
                  <span className="row-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="row-main">
                    <p className="row-title">{a.name}</p>
                    <p className="row-sub">{[a.industry, a.ees ? a.ees + " EEs" : "", a.states].filter(Boolean).join(" · ")}</p>
                  </span>
                  <span className={"score-pill " + cls}>{a.score} · {label}</span>
                </div>
                {isOpen && (
                  <div className="agent-detail">
                    <div className="sig-wrap">
                      {chosen.length === 0 ? <span className="sig-chip">No signals selected, base score only</span> :
                        chosen.map((id) => {
                          const sig = SIGNAL_LIBRARY.find((x) => x.id === id);
                          return sig ? <span className="sig-chip" key={id}>{sig.label}<b>+{sig.pts}</b></span> : null;
                        })}
                    </div>
                    {a._summary && (
                      <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, margin: "12px 0 0" }}>
                        <b style={{ color: "var(--ink)" }}>What we found: </b>{a._summary}
                        {a.ees ? <span> Headcount {a.ees} (source: {a._source}{a._confidence ? `, ${a._confidence} confidence` : ""}{a._alt ? `; firmographic estimate ${a._alt}` : ""}).</span> : null}
                      </p>
                    )}
                    <div className="callout" style={{ marginTop: 12, marginBottom: 4 }}>
                      <span className="tag">OPENING TALK TRACK</span>{buildTalkTrack(a, chosen)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "14px 4px 0", lineHeight: 1.6 }}>
        Real scoring logic, live. Base 25, plus weighted signal points, capped at 99; 80+ is HOT, 65+ WARM.
        In production these signals arrive automatically from the payroll base instead of being typed, and
        the weights and talk tracks get tuned every week in the win/loss loop with the team.
      </p>
    </div>
  );
}

const MY_DAY_POOL = [
  { name: "Bluebird Dental Group", industry: "Professional services", ees: 18, states: "CO", contact: "Dr. Mara Quinn, Owner", phone: "(303) 555‑0142", trigger: "Asked about group health in-app 3 days ago; renewal in 71 days", signals: ["benefits_q", "renewal", "sweet_spot"] },
  { name: "Summit Peak Builders", industry: "Construction", ees: 34, states: "CO, WY", contact: "Dave Okafor, CFO", phone: "(307) 555‑0188", trigger: "Comp mod climbing; crossed 25 EEs last quarter", signals: ["comp_claims", "crossed_25", "hourly", "multistate"] },
  { name: "Cedar Creek Veterinary", industry: "Healthcare services", ees: 14, states: "CO, NM", contact: "Dr. Lena Hart", phone: "(505) 555‑0164", trigger: "Opened a second clinic in NM; benefits renewal ~60 days", signals: ["new_state", "renewal", "sweet_spot", "multistate"] },
  { name: "Pixel & Pine Studio", industry: "Software & design", ees: 12, states: "CO, NY, TX", contact: "Sam Reyes, Founder", phone: "(512) 555‑0109", trigger: "Lost a senior hire over benefits; hiring 4 roles", signals: ["lost_candidate", "multistate", "growth", "sweet_spot"] },
  { name: "Harvest Lane Logistics", industry: "Logistics", ees: 47, states: "CO, UT, AZ", contact: "Priya Nathan, Ops Dir.", phone: "(602) 555‑0173", trigger: "Registered in AZ 3 weeks ago; hourly fleet workforce", signals: ["new_state", "hourly", "multistate", "growth"] },
  { name: "Iron Horse Fabrication", industry: "Manufacturing", ees: 28, states: "CO", contact: "Russ Beale, Owner", phone: "(303) 555‑0196", trigger: "Comp claims frequency rising; mod renewal this fall", signals: ["comp_claims", "sweet_spot", "hourly"] },
  { name: "Aspen Trail Hospitality", industry: "Restaurants", ees: 52, states: "CO", contact: "Nina Two Bears, GM", phone: "(970) 555‑0127", trigger: "High turnover; no group health offered today", signals: ["hourly", "no_health", "growth"] },
  { name: "Front Range Accounting", industry: "Professional services", ees: 9, states: "CO", contact: "Tom Alvarez, Partner", phone: "(719) 555‑0151", trigger: "Gusto accountant-partner; asked about 401(k)", signals: ["partner", "benefits_q"] },
  { name: "Granite Peak Electric", industry: "Electrical contracting", ees: 22, states: "CO, NE", contact: "Will Carver, Owner", phone: "(308) 555‑0134", trigger: "Multi-state field crews; comp renewal in 88 days", signals: ["renewal", "hourly", "multistate", "crossed_25"] },
  { name: "Lark & Co. Marketing", industry: "Professional services", ees: 16, states: "CO", contact: "Bea Lindqvist, CEO", phone: "(303) 555‑0118", trigger: "Asked about benefits; grew from 11 to 16 this year", signals: ["benefits_q", "sweet_spot", "growth"] },
  { name: "Trailhead Brewing", industry: "Food & beverage", ees: 38, states: "CO, WY", contact: "Marco Reyes, Founder", phone: "(307) 555‑0177", trigger: "Hourly staff; opening 2nd taproom across state line", signals: ["new_state", "hourly", "growth", "multistate"] },
  { name: "Vista Ridge Home Health", industry: "Healthcare services", ees: 41, states: "CO", contact: "Dana Whitfield, Dir.", phone: "(303) 555‑0185", trigger: "Benefits renewal ~80 days; recruiting caregivers hard", signals: ["renewal", "hourly", "lost_candidate"] },
];

function MyDay({ onAdd, existing }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  // deterministic daily rotation so the list feels fresh but is stable within a day
  const dayNum = Math.floor(Date.now() / 86400000);
  const rotated = MY_DAY_POOL.map((a, i) => ({ ...a, score: scoreAccount(a), _r: (i + dayNum) % MY_DAY_POOL.length }));
  const list = rotated.sort((x, y) => y.score - x.score).slice(0, 10);
  const [open, setOpen] = useState(-1);
  const [done, setDone] = useState([]);
  const [added, setAdded] = useState([]);
  const tier = (s) => (s >= 80 ? ["HOT", "hot"] : s >= 65 ? ["WARM", "warm"] : ["WATCH", "watch"]);
  const toggleDone = (name) => setDone((d) => d.includes(name) ? d.filter((x) => x !== name) : [...d, name]);
  const inPipeline = (name) => added.includes(name) || (existing || []).some((e) => (e.clientName || "").toLowerCase() === (name || "").toLowerCase());
  const addToList = async (a) => {
    if (!onAdd || inPipeline(a.name)) return;
    setAdded((x) => [...x, a.name]);
    try { await onAdd(a); } catch { setAdded((x) => x.filter((n) => n !== a.name)); }
  };
  const hotToAdd = list.filter((a) => a.score >= 80 && !inPipeline(a.name));
  const addAllHot = async () => {
    if (!onAdd || !hotToAdd.length) return;
    setAdded((x) => [...x, ...hotToAdd.map((a) => a.name)]);
    for (const a of hotToAdd) { try { await onAdd(a); } catch {} }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <div className="src-tag">{today.toUpperCase()}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onAdd && hotToAdd.length > 0 && <button className="btn primary" style={{ padding: "6px 12px", fontSize: 13 }} onClick={addAllHot}>+ Add all {hotToAdd.length} HOT to list</button>}
          <div className="src-tag">{done.length} / {list.length} WORKED</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        {list.map((a, i) => {
          const [label, cls] = tier(a.score);
          const isOpen = open === i;
          const isDone = done.includes(a.name);
          return (
            <div className="agent-card" key={a.name}>
              <div className="agent-head" role="button" tabIndex={0}
                style={{ ...(isOpen ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}), opacity: isDone ? 0.55 : 1 }}
                onClick={() => setOpen(isOpen ? -1 : i)}
                onKeyDown={(e) => e.key === "Enter" && setOpen(isOpen ? -1 : i)}>
                <span className="row-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="row-main">
                  <p className="row-title" style={isDone ? { textDecoration: "line-through" } : undefined}>{a.name}</p>
                  <p className="row-sub">{a.industry} · {a.ees} EEs · {a.states}</p>
                </span>
                <span className={"score-pill " + cls}>{a.score} · {label}</span>
              </div>
              {isOpen && (
                <div className="agent-detail">
                  <div className="myday-meta">
                    <div><span className="roi-label">WHO TO CALL</span>{a.contact}<br /><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>{a.phone}</span></div>
                    <div><span className="roi-label">WHY TODAY</span>{a.trigger}</div>
                  </div>
                  <div className="sig-wrap">
                    {a.signals.map((id) => {
                      const sig = SIGNAL_LIBRARY.find((x) => x.id === id);
                      return sig ? <span className="sig-chip" key={id}>{sig.label}<b>+{sig.pts}</b></span> : null;
                    })}
                  </div>
                  <div className="callout" style={{ marginTop: 12, marginBottom: 10 }}>
                    <span className="tag">OPENING TALK TRACK</span>{buildTalkTrack(a, a.signals)}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <button className={"btn " + (isDone ? "ghost" : "primary")} onClick={() => toggleDone(a.name)}>
                      {isDone ? "Mark as not worked" : "Mark as worked"}
                    </button>
                    {onAdd && (inPipeline(a.name)
                      ? <span className="src-tag" style={{ color: "var(--green)", display: "inline-flex", alignItems: "center", gap: 6 }}>ADDED TO ACCOUNT LIST</span>
                      : <button className="btn ghost" onClick={() => addToList(a)}>+ Add to Account List</button>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "14px 4px 0", lineHeight: 1.6 }}>
        In production this list builds itself overnight: the agent scans the payroll base for fresh
        signals, ranks them, and hands each rep ten worked-up accounts with the contact and the reason
        already attached. Sample data shown here; the list rotates daily so the dashboard is never stale.
      </p>
    </div>
  );
}

function AgentTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">BUILT DURING THIS PROCESS · WORKING TOOL BELOW</div>
        <h1>The PEO Prospecting Agent<span className="hl">.</span></h1>
        <p className="lede">
          My initial thinking on letting data lead our path to market: score the payroll base for
          PEO propensity, and hand the team a ranked, reasoned list instead of an alphabetical one.
          The working tool is below. It opens to My Day, ten accounts the agent scored and worked up overnight, and you can also score your own accounts by hand to see the logic run.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">MY DAY · TODAY'S TOP 10</div>
        <h2>The list the rep opens to</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>Ten accounts, already scored and worked up. Who to call, why today, and the opening line. Tap any to expand.</p>
        <div style={{ marginTop: 16 }}>
          <MyDay />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">WHAT IT DOES</div>
        <h2>From payroll base to PEO pipeline</h2>
        <ul style={{ marginTop: 14 }}>
          <li><b>ICP scoring.</b> Ranks accounts on PEO propensity signals: headcount band (the 5–100 sweet spot), multi-state footprint, industry and class-code profile, benefits-seeking behavior, and growth trajectory.</li>
          <li><b>Ranked target lists.</b> The team starts each day with the accounts most likely to convert, with the reasons attached, not a flat alphabetical book.</li>
          <li><b>Talk-track generation.</b> Each target gets a tailored opening built on its specific signals: the new state they just registered in, the headcount they just crossed, the renewal window they're entering.</li>
        </ul>
        <h3>Why it matters for this role</h3>
        <p>
          Gusto's structural advantage is distribution, co-employment offered to a base that
          already trusts the platform changes CAC, cycle length, and who controls the relationship.
          But an installed base is only an advantage if it's prioritized intelligently, and that's
          what this is: a prioritization layer, and the engine behind the pilot motion in the
          90-day plan, score the base, pull a cohort, run the playbook, learn from what closes.
        </p>
        <div className="callout"><span className="tag">A STARTING POINT, NOT A FINISHED ANSWER</span>
          The signals, weights, and talk tracks here are a first draft. They're built to be
          pressure-tested and rebuilt with the team, with product, and with the people who know
          this base far better than any model does, that's the feedback loop working as intended.
        </div>
      </div>

      <div className="card">
        <div className="kicker">THE LIVE TOOL · RESEARCH ANY COMPANY</div>
        <h2>Run the engine</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>Type a company name and the agent researches it live, verifies headcount, detects signals, scores, and writes the opening. Or build an account by hand.</p>
        <div style={{ marginTop: 16 }}>
          <AgentEngine />
        </div>
      </div>
    </div>
  );
}

const MATRIX_REFERENCE = {
        title: "What's in the fee: the inclusions matrix",
        blocks: [
          { t: "p", x: "The most common comparison mistake in this industry is lining up admin fees that don't buy the same things. Before any rate goes in front of a client, build the inclusions picture: what each PEO's fee covers as standard, and what shows up later as an add-on. The matrix below reflects typical packaging as of mid-2026, treat it as a starting map, and verify against the actual proposal every time, because packaging changes and most of these providers quote custom." },
          { t: "table", head: ["PEO", "Pricing structure", "Standard with the admin fee", "Typically extra"], rows: [
            ["ADP TotalSource", "Custom quote; PEPM or % of payroll, often bundled", "Payroll & tax admin, HR support, compliance, benefits administration, WC program access, learning/talent tools", "All insurance premiums; enhanced recruiting/HR services; unbundle the blended rate to find the real fee"],
            ["Insperity", "Custom quote; allocation often presented as comprehensive PEPM", "Dedicated HR service team, payroll, compliance, performance & training resources, EPLI", "Premiums; specialty consulting and retained recruiting; premium service intensity is priced into the fee itself"],
            ["TriNet", "Custom PEPM, often by industry vertical", "Payroll & tax admin, benefits administration, compliance, vertical-specific HR expertise, platform", "Premiums; enhanced HR service tiers; certain time/recruiting products as add-ons"],
            ["Paychex PEO", "Custom quote, frequently framed alongside payroll bundles", "Payroll, HR generalist support, compliance, benefits administration", "Premiums; time & attendance and recruiting modules; watch the payroll-bundle framing in comparisons"],
            ["CoAdvantage", "Custom quote; PEPM or % of payroll", "Payroll & tax admin, CoAdQuantum platform, benefits administration, WC claims & safety support, HR compliance guidance", "Premiums; recruiting, performance-management and other add-on programs; verify current CPEO/ESAC credential status"],
            ["Justworks", "Published flat PEPM, Basic and Plus tiers (volume discounts at headcount breaks); 3 WSE minimum; month-to-month, no setup fees", "Basic: payroll, compliance, WC administration, 401(k) access, HR tools, 24/7 support", "Master medical/dental/vision access requires the Plus tier, recently raised from $109 to ~$129 PEPM; premiums always extra; time tracking, international contractors, and marketplace perks billed per item"],
            ["Rippling", "Modular: base platform PEPM plus per-module fees; PEO service custom-quoted on top", "Software platform (HR records, workflows); PEO quote includes payroll, tax filing, WC and EPLI coverage, compliance support", "Nearly everything is a module, benefits admin, time, IT, spend each add PEPM; implementation fees can apply; premiums extra. Strength and risk in one design: pay for what you use, but the stack adds up"],
          ]},
          { t: "p", x: "Two disciplines turn this matrix into wins. First, normalize before comparing: convert every structure to effective PEPM on the same census, then list what that PEPM actually buys at each provider. A $59 fee without master-plan access, a $109 fee with it, a custom bundled rate hiding the fee entirely, and a modular stack that grows per feature are four different products wearing one label. Second, ask the inclusion question out loud in every deal, 'walk me through exactly what the administrative fee covers, and show me the add-on price list', because the answer is the comparison." },
          { t: "callout", tag: "ALWAYS EXTRA: EVERYWHERE", x: "No admin fee at any PEO includes: gross wages, employer taxes (FICA, FUTA, SUTA), health/dental/vision premiums, workers' comp premium, state-mandated coverages, or 401(k) employer contributions. Any proposal implying otherwise is blending, not including, unbundle it." },
          { t: "p", x: "Sourcing note: published pricing links below. Competitor service-model and fee-structure details (service tiering, EPLI deductibles, individual fee line items) are field-verified as of mid-2026 from live deals and proposals, packaging changes, so confirm every figure against the actual proposal in front of you." },
          { t: "sources", items: [
            { l: "Justworks, published PEO pricing (Basic / Plus tiers)", u: "https://www.justworks.com/pricing" },
            { l: "Rippling, modular pricing structure analysis (Vendr)", u: "https://www.vendr.com/marketplace/rippling" },
            { l: "CoAdvantage, services overview", u: "https://coadvantage.com/" },
          ]},
        ],
      };

function LandscapeTab() {
  const comps = [
    { name: "ADP TotalSource", pos: "The biggest PEO, inside the biggest payroll company.",
      good: ["Scale: largest PEO by WSE count, with the brand safety that comes with it", "Deep benefits buying power and a full ecosystem (retirement, tax credits, international)", "Massive broker and referral reach"],
      bad: ["Outdated technology and limited self-serve, clients often can't even generate their own reports and must request them from their assigned service contact", "Percent-of-payroll bundled rates: every raise, bonus, or commission a client gives employees gives ADP the exact same raise, with no added service", "Bundled, opaque pricing, the blended rate hides the real admin fee", "Service is thin and varies widely by account team", "Heavy machinery for a 15-person company"],
      win: "Two demos win this deal. First, run a report live, self-serve, in seconds, then let the buyer remember emailing their ADP rep and waiting. Second, do the escalator math on their own comp plan: project next year's raises and bonuses and show ADP's fee rising with every one of them, versus a flat published PEPM. Then unbundle the blended rate so it confesses its admin fee. Don't out-enterprise ADP; out-simple them." },
    { name: "Insperity", pos: "The premium, service-heavy incumbent.",
      good: ["Genuinely deep high-touch service: dedicated HR specialists and real consulting", "Strong mid-market retention and brand among relationship buyers", "Rich training, development, and performance resources"],
      bad: ["By far the most expensive PEO in most head-to-head comparisons", "Fee stacking: Workers' Comp & EPLI fee, co-employment risk fee, benefit admin fee, technology service fee, the Insperity markup, and more, each its own line", "Premium shifting: real benefit premium dollars migrate into those fee lines, so the displayed premium looks dramatically cheaper than identical competitor plans", "Technology challenges on par with ADP, underwriting intake can be as low-tech as dropping documents into a Dropbox folder for a quote"],
      win: "Reassemble the quote in front of the buyer. If the true premium is $500, Insperity can shift $70 into the benefit admin fee and $50 into the co-employment risk fee, then show up at $380 against everyone else's $500 for the same plan. Buyers anchor on the premium line and Insperity wins on a number that was never real. Move the dollars back, total every line per employee per month, and compare totals only. Then put the platform side by side, a Dropbox-intake underwriting process is not a technology story that survives a Gusto demo." },
    { name: "TriNet", pos: "The all-inclusive platform with a vertical pitch.",
      good: ["Genuinely all-inclusive platform: payroll, job postings and hiring, performance management, file and certification management, one system covering the employee lifecycle", "Reporting is a true strength: deep custom reports that can be saved and auto-scheduled, power admins love it", "Benefit breadth: regional plan menus put 14–16 plans in front of each client per state where they have employees, with Healthee, an AI tool, guiding employees through enrollment", "Strong VC/startup brand and vertical positioning (tech, life sciences, financial services, nonprofits)"],
      bad: ["The vertical pitch is positioning, not product: reps receive no true industry training and every 'industry platform' is exactly the same underneath", "Service tiering: clients under 50 employees are routed to a pooled HR service center, only 50+ get designated assigned support, yet under-50 is most of the market", "EPLI is 'included', with a $75,000 deductible. Most everyday SMB employment claims land below it, so clients effectively self-insure the claims they'll actually have", "Regional benefit rating: every region carries different rates, so multi-state clients live with rate variance and quoting complexity", "Renewal escalations and pricing opacity remain the most common client complaints"],
      win: "Gusto's payroll base IS TriNet's future pipeline, startups graduate from Gusto payroll into TriNet. Intercept the graduation with the in-base trigger motion, and attack on three specifics. One: the under-50 service gap, TriNet pools exactly the segment Gusto's base lives in; sell reachable humans plus self-serve to the under-50 buyer. Two: puncture the vertical pitch with a single question, 'what's actually different about the platform for my industry?' Three: ask what the EPLI deductible is, then do the math out loud, $75K means self-insuring the everyday claim. And respect what's real: TriNet's reporting bar (saved, auto-scheduled custom reports) is the product feature Gusto must match to win power admins, feed that to product early." },
    { name: "Paychex PEO", pos: "The closest strategic mirror: payroll base, cross-sell motion.",
      good: ["Installed payroll base with an upsell motion, structurally the same play Gusto is running", "Branch and broker distribution; ASO/PEO flexibility lets them match buyer readiness", "Established comp programs"],
      bad: ["PEO is a secondary motion inside a payroll company, focus and rep fluency vary", "Dated platform experience", "Pooled, transactional service model"],
      win: "This is the matchup that proves whose conversion motion is better. Win it on execution quality: sharper in-base targeting, PEO-fluent (certified) reps instead of payroll reps with a PEO SKU, cleaner packaging, and the accountant channel as a genuine partner lane rather than a referral afterthought." },
    { name: "Justworks", pos: "The 'affordable PEO', whose price just went up.",
      good: ["Won the market by advertising as the affordable PEO with published, transparent PEPM, the category's most disruptive weapon", "3 WSE minimum opens the micro-SMB segment most PEOs won't touch", "Decent technology; fast, self-serve buying and implementation; SMB/startup brand affinity"],
      bad: ["Just raised Plus pricing from $109 to $129 PEPM, an ~18% increase that erodes the entire 'affordable' brand promise", "Thin hands-on HR service as groups grow complex", "Limited workers' comp appetite for tougher class codes", "Cold acquisition: every customer must be won from scratch"],
      win: "Their brand is affordability and they just raised prices 18%, that mantle is being vacated in real time, and Gusto should take it: publish aggressive launch pricing and own 'the transparent, affordable PEO' before anyone else claims it. Match or beat the 3 WSE minimum to own micro-SMB, where Gusto's payroll base is deepest. Then press the structural edge: upselling a trusting base beats cold acquisition on CAC and cycle length every single time, with payroll-to-PEO continuity no new vendor can offer." },
    { name: "Rippling", pos: "The best technology in the industry, with very limited service behind it.",
      good: ["Probably the best tech in the category: platform breadth across HR, IT, and finance with real automation, concede this honestly, because pretending otherwise costs credibility", "Competitive price point: the PEO typically lands around $99 PEPM", "The PEO toggle-off story directly answers exit fear", "Fast-shipping product org; strong with technical buyers"],
      bad: ["Very limited service, software-first means human support is thin exactly when a co-employment client needs a person", "Modular pricing stacks on top: per-module fees quietly outgrow all-in quotes", "Platform sprawl overwhelms the typical Main Street owner"],
      win: "Don't fight the tech claim, reframe what's being bought. A PEO isn't software; it's an employer relationship, and the moment a client has a comp claim, a termination, or a benefits crisis, 'very limited service' becomes the whole product. Sell reachable humans plus continuity, total their module stack next to the $99 headline, and let Rippling keep the IT-buyer who wants to administer everything themselves." },
    { name: "CoAdvantage", pos: "Mid-market hustle and underwriting flexibility.",
      good: ["Flexible underwriting and willingness to customize, including tougher comp risk", "Personalized mid-market service posture", "Structural flexibility: PEPM or percent-of-payroll"],
      bad: ["Smaller benefits scale and carrier leverage than the nationals", "Platform experience trails the tech-forward tier", "Limited brand awareness; custom-quote opacity"],
      win: "The platform and brand gaps are widest here, lead with product experience and national trust, and put published pricing against custom-quote opacity. Concede the tough-class-code deals their underwriting hustle wins; that's risk Gusto's early book shouldn't want anyway." },
    { name: "Vensure", pos: "The acquisition machine: the country's fastest-growing PEO, built by buying others.",
      good: ["Enormous scale and reach, roughly 4 million worksite employees across the platform, assembled through well over 100 acquisitions", "Broad geographic and class-code appetite, including staffing and tougher risk most nationals decline", "Deep, well-capitalized parent with continued M&A firepower"],
      bad: ["Technology is inconsistent by design: some clients land on PrismHR, others sit on legacy systems from acquired companies that were never migrated, so the experience depends on which brand you joined through", "Pricing and service quality vary meaningfully region to region for the same reason, two similar companies can get very different deals", "Quote-driven, no published pricing; the integration seams show in reporting and self-service", "A roll-up's service model is only as good as the last shop it bought"],
      win: "Consistency is the whole pitch. Gusto is one platform, one experience, one published price, everywhere, versus a patchwork where the product depends on which acquisition absorbed you. Ask the buyer which system they'd be on and what happens when they call support, then show the same Gusto experience a company in any state would get. Concede the tough-risk and staffing deals their appetite wins; that isn't the early Gusto book." },
    { name: "Obsidian HR", pos: "The Denver-local PEO: regional service, Colorado focus.",
      good: ["Genuinely local Colorado presence and service reputation, fast response and a personal touch national PEOs struggle to match", "Backed by ProService Hawaii, so real PEO infrastructure sits behind a boutique front", "Strong local relationships, references, and brand in the exact backyard Gusto's early motion will touch"],
      bad: ["Small benefits and workers' comp scale next to the nationals, the buying-power story is limited", "Single-region footprint: a Colorado-centered PEO is a hard fit for a client growing into multiple states", "Limited technology depth and self-serve compared to a platform-first competitor", "Capacity and product breadth are bounded by size"],
      win: "Respect the local relationship; don't attack it. Win on reach and platform: when the client adds employees in a second or third state, a Colorado-focused PEO is working at the edge of its footprint while Gusto runs the same play nationally on one system. Pair national scale and published pricing with the fact that Gusto already runs their payroll, the switching cost is lower than leaving a local incumbent they're loyal to." },
    { name: "DecisionHR", pos: "The mid-sized Florida-based national, underwriting-led.",
      good: ["Established full-service PEO, around 30,000 worksite employees across roughly 42 states with 25-plus years in market", "Backed by Bankers Financial Corporation, so there's insurance and underwriting muscle behind it", "Comfortable with workers' comp risk and underwriting-led deals, a real strength for comp-heavy accounts"],
      bad: ["Quote-driven and opaque, no published pricing, with a traditional broker-channel sales motion", "Technology and self-serve trail the platform-first tier", "Brand awareness is thin outside the Southeast and the broker network", "Built around the insurance relationship more than the software experience"],
      win: "Out-simple and out-platform them. DecisionHR's edge is comp underwriting, so concede the genuinely tough-comp accounts and compete where Gusto is stronger: a modern platform, published pricing, and an in-base motion that doesn't depend on a broker introduction. For a benefits-driven SMB that already trusts Gusto for payroll, the underwriting-led pitch matters less than the experience." },
  ];
  const matrixLesson = MATRIX_REFERENCE;
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">KNOW THE ENEMY</div>
        <h1>Competitors<span className="hl">.</span></h1>
        <p className="lede">
          Each major PEO, what they're genuinely good at, where they're weak, and the specific
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
          <li><b>New-entrant trust.</b> Race to CPEO certification and lead with it, sole federal tax liability converts "why trust the new guy with my payroll taxes?" into a statute. Publish the renewal philosophy in writing; no incumbent will match it.</li>
          <li><b>Benefits scale.</b> Carrier leverage grows with the book, so protect the book: disciplined new-business underwriting over heroic year-one rates. Sell what the plans are honestly great at today; never buy a deal with benefits pricing the renewal can't sustain.</li>
          <li><b>Adverse selection.</b> The deals competitors decline will find Gusto first. Align sales comp with underwriting quality from day one, and treat every declined deal as calibration, not friction.</li>
          <li><b>Broker conflict.</b> Don't pretend brokers don't exist; write clear rules of engagement, and build the accountant channel as Gusto's own lane, where no broker relationship is being threatened.</li>
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
          An honest read of Gusto's PEO entry, written the way I'd present it internally,
          not the way a candidate flatters a room.
        </p>
      </div>
      <div className="swot-grid">
        <div className="swot-cell s">
          <h3>Strengths</h3>
          <ul>
            <li><b>Distribution.</b> A massive installed SMB payroll base means the cheapest customer acquisition in the category, upsell, not cold acquisition.</li>
            <li><b>The accountant channel.</b> Partner tiers and People Advisory give Gusto a structural referral engine incumbents rent through brokers.</li>
            <li><b>Brand trust + UX.</b> SMBs already run payroll here; the PEO is an upgrade inside a product they like, not a new vendor to vet.</li>
            <li><b>Transparent-pricing DNA.</b> Gusto can credibly publish PEO pricing, devastating against bundled, opaque incumbent quotes.</li>
          </ul>
        </div>
        <div className="swot-cell w">
          <h3>Weaknesses</h3>
          <ul>
            <li><b>No underwriting track record.</b> Risk selection, claims management, and funds-flow controls are new muscle, and they are the business.</li>
            <li><b>Master plan scale must be built.</b> Carrier leverage and renewal stability grow with the book; year-one books are price-takers.</li>
            <li><b>Service depth for complexity.</b> Multi-state, high e-mod, tough-class-code clients need expertise a payroll-native org is still hiring.</li>
            <li><b>PEO ops maturity.</b> State licensing, CPEO certification, and per-state SUI/comp mechanics take time to operationalize.</li>
          </ul>
        </div>
        <div className="swot-cell o">
          <h3>Opportunities</h3>
          <ul>
            <li><b>Stop the graduation churn.</b> Gusto payroll clients who outgrow software today leave for Justworks, Rippling, or TriNet. A native PEO retains them.</li>
            <li><b>A growing, underpenetrated category.</b> Industry revenue has more than quadrupled since 2012 to ~$414B, yet only ~15% of employers with 10–499 employees, and roughly 4% of all US businesses, use a PEO. Secular growth plus enormous conversion headroom.</li>
            <li><b>Displace opacity.</b> Published pricing plus an unbundling sales motion attacks the incumbents' bundled-rate model at its weakest point.</li>
            <li><b>CPEO as trust accelerant.</b> Certification converts "new entrant" into "federally certified", a credential worth racing toward.</li>
          </ul>
        </div>
        <div className="swot-cell t">
          <h3>Threats</h3>
          <ul>
            <li><b>The tech-forward incumbents.</b> Justworks owns published-price simplicity; Rippling owns the platform narrative with a PEO toggle. Gusto enters their lane.</li>
            <li><b>Adverse selection.</b> If sales outruns underwriting discipline, the early book fills with risk others declined, and claims arrive before scale does.</li>
            <li><b>Incumbent benefits scale.</b> National master plans and broker relationships are real moats on the deals benefits decide.</li>
            <li><b>Insurance cycles.</b> Medical trend and comp market hardening compress PEO economics industry-wide, hitting young books hardest.</li>
          </ul>
        </div>
      </div>
      <div className="callout" style={{ marginTop: 18 }}><span className="tag">THE STRATEGIC READ</span>
        The strengths and opportunities are distribution-shaped; the weaknesses and threats are
        underwriting-shaped. The winning play is to sell with the distribution advantage while
        building the risk discipline faster than the book grows, which is why the 90-day plan
        pairs the pilot motion with underwriting feedback loops from day one.
      </div>
    </div>
  );
}

function RoiCalc() {
  const [ees, setEes] = useState(25);
  const [wage, setWage] = useState(65000);
  const [years, setYears] = useState(5);
  const e = Math.max(1, Number(ees) || 0);
  const w = Math.max(0, Number(wage) || 0);
  const adminNet = e * 380;
  const turnover = Math.round(e * 0.20 * 0.12 * (0.20 * w));
  const annual = adminNet + turnover;
  const fmt = (n) => "$" + Math.round(n).toLocaleString();
  return (
    <div>
      <div className="roi-grid">
        <div>
          <span className="roi-label">EMPLOYEES</span>
          <input className="roi-input" type="number" min="1" value={ees} onChange={(ev) => setEes(ev.target.value)} />
        </div>
        <div>
          <span className="roi-label">AVERAGE ANNUAL WAGE</span>
          <input className="roi-input" type="number" min="0" step="1000" value={wage} onChange={(ev) => setWage(ev.target.value)} />
        </div>
        <div>
          <span className="roi-label">HORIZON</span>
          <div className="lesson-nav" style={{ marginBottom: 0 }}>
            {[3, 4, 5].map((y) => (
              <button key={y} className={"lesson-pill" + (years === y ? " active" : "")} onClick={() => setYears(y)}>{y} yr</button>
            ))}
          </div>
        </div>
      </div>
      <div className="stat-grid" style={{ marginTop: 16 }}>
        <div className="stat"><div className="v">{fmt(annual)}</div><div className="l">Estimated annual benefit: HR cost savings ({fmt(adminNet)}) plus turnover avoidance ({fmt(turnover)})</div></div>
        <div className="stat"><div className="v">{fmt(annual * years)}</div><div className="l">Cumulative over {years} years, holding headcount flat</div></div>
        <div className="stat"><div className="v">$1.27</div><div className="l">Returned per $1 of PEO cost, per NAPEO's published ROI research</div></div>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 12 }}>
        Directional model built entirely on NAPEO-published benchmarks: net $380 per employee per year
        ($1,775 saved vs $1,395 cost), 12% lower turnover applied to a 20% baseline at a replacement
        cost of 20% of wage. Growth effects are deliberately excluded even though PEO clients grow
        4.3% vs 1.6%, so this is the conservative case. A live engagement runs on the client's own
        census and invoices. Sources:{" "}
        <a href="https://napeo.org/wp-content/uploads/2025/03/white-paper-7-the-roi-of-using-a-peo.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "var(--guava-deep)" }}>NAPEO ROI white paper</a>{" · "}
        <a href="https://napeo.org/wp-content/uploads/2025/03/2024-white-paper-final.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "var(--guava-deep)" }}>NAPEO 2024 client outcomes</a>
      </p>
    </div>
  );
}

function ConstructTab() {
  const tiers = [
    { badge: "GUSTO PEO 1", name: "Full PEO with Benefits", theme: "The flagship: co-employment plus the benefits engine.",
      items: [
        "Complete co-employment: payroll and employment tax administration, workers' comp through the master program, compliance, and HR support",
        "Master health plans, medical, dental, vision, plus HSA/FSA, life, disability, and 401(k): the large-group benefits access that drives most PEO purchases",
        "Published, transparent PEPM, the pricing DNA the incumbents can't match without blowing up their own books",
      ],
      who: "The classic 5–100 employee benefits-driven buyer: multi-state, hiring, losing candidates over benefits, or staring down a brutal small-group renewal.",
      vs: "Head-to-head with Justworks Plus, TriNet, ADP TotalSource, and Insperity, won on distribution, continuity, and honest totals." },
    { badge: "GUSTO PEO 2", name: "Full PEO without Benefits", theme: "Co-employment for clients who keep their own coverage.",
      items: [
        "Everything in the co-employment core, payroll, taxes, workers' comp, compliance, HR, with the client's existing benefits left exactly where they are",
        "Built for groups with a strong broker relationship, coverage they like, participation challenges, or ICHRA arrangements",
        "Not a different pricing philosophy, the same product foundation, platform, and published-pricing approach as PEO 1. The only difference: PEO 1 carries benefit enrollment and the large-group offering, and PEO 2 doesn't",
      ],
      who: "Broker-attached clients, lean teams without group coverage yet, and price-first buyers who still want the compliance and comp burden gone.",
      vs: "This tier quietly solves the broker-conflict problem: the broker keeps the benefits relationship, Gusto takes the administrative employer role, the channel stays a friend. And every PEO 2 client is a natural PEO 1 upgrade at their next benefits renewal." },
    { badge: "GUSTO PEO 3", name: "The Certified PEO Exchange", theme: "Once IRS certification is intact: the trust ceiling.",
      items: [
        "Full CPEO treatment under IRC 3511: Gusto solely liable for federal employment taxes, the IRS cannot come back to the client",
        "Successor-employer status: no FICA/FUTA wage-base restart, making mid-year switches from any competitor mathematically painless",
        "Section 3511(d) credit preservation, R&D payroll offset, WOTC, tip credits stay with the client; Form 8973 reporting handled",
      ],
      who: "Clients who require certification: CFO- and CPA-driven buyers, R&D-credit startups, risk-averse boards, and mid-year movers who'd otherwise wait for January 1.",
      vs: "Only a small minority of PEOs hold IRS certification. PEO 3 turns 'why trust the new entrant?' into 'we're the federally certified option', and it removes the timing objection from every competitive takeaway deal in the pipeline." },
  ];
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">PRODUCT ARCHITECTURE · PROPOSED</div>
        <h1>The Gusto PEO construct<span className="hl">.</span></h1>
        <p className="lede">
          Three tiers, one platform, one funds-flow and underwriting engine underneath.
          Each tier opens a market the others can't reach, and every client can move
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
        <div className="phase-head"><span className="phase-days">CROSS-TIER PLAY 01</span><h3>Earned Wage Access</h3></div>
        <p className="theme">A product to offer across every tier, and the wedge into the segment incumbents serve worst.</p>
        <ul>
          <li><b>Huge for blue-collar industries.</b> For hourly workforces, construction trades within appetite, field services, logistics, restaurants, healthcare staffing, access to earned wages before payday matters more to the employee than a marginally richer health plan.</li>
          <li><b>It's a hiring weapon for the client.</b> "Work today, get paid today" goes straight into the client's job postings. The PEO stops being a back-office vendor and becomes part of how the client recruits.</li>
          <li><b>It opens the market the benefits pitch can't.</b> Incumbents lead with white-collar master plans, yet NAPEO's client research shows almost half of all PEO clients sit in professional services, manufacturing, or construction. Blue-collar is core PEO territory, not adjacent. EWA pairs naturally with PEO 2 for clients who keep their own coverage.</li>
          <li><b>Gusto is structurally positioned to do it right.</b> The PEO already runs the funds flow. Calculating earned wages in real time and fronting them safely is native to the payroll platform, not an app bolted onto someone else's data.</li>
          <li><b>Retention compounds at both layers.</b> Employees who rely on EWA push their employers to stay; employers whose workers love a benefit stay with the PEO that provides it.</li>
        </ul>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">CROSS-TIER PLAY 02</span><h3>The benefits small business has never been offered</h3></div>
        <p className="theme">Fortune-500 benefits, delivered at 15-employee scale through aggregation.</p>
        <ul>
          <li><b>Fertility and family-building.</b> Nearly 40% of large employers now offer fertility benefits through platforms like Carrot, Progyny, and Kindbody. Small businesses are locked out: those platforms serve self-funded employers with hundreds of workers. A PEO aggregating hundreds of thousands of WSEs can negotiate one master partnership and hand a 15-person company IVF support, egg freezing, adoption and surrogacy assistance, and maternity return-to-work programs. Nobody in the SMB market offers this today. For talent-competing small companies, it is the single most differentiating benefit we could put in a quote.</li>
          <li><b>The gap-coverage stack, engineered on purpose.</b> Accident, critical illness, and hospital indemnity plans exist everywhere as voluntary add-ons. The play is using them deliberately: pair a lower-premium high-deductible medical plan with employer-funded gap coverage that absorbs the deductible. The employee experiences rich coverage; the employer pays less in total premium. That's plan design as a product, and almost nobody packages it for small groups.</li>
        </ul>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">CROSS-TIER PLAY 03</span><h3>Workers' comp as a weapon, in both directions</h3></div>
        <p className="theme">Reward the clean groups. Underwrite the tough ones nobody else will take.</p>
        <ul>
          <li><b>Performance credits for lean groups.</b> Clients with clean loss runs earn a renewal credit, real dollars back, structured as a retention credit. Yes, it trades comp spread for retention. That's the right trade: the renewal is where PEO clients are lost, a visible reward for safety changes client behavior in the direction underwriting wants, and sharing the spread we teach clients to look for is the most credible transparency move in the industry.</li>
          <li><b>A secondary high-risk comp program.</b> Mainstream and tech-forward PEOs decline high-mod groups and tough class codes outright. An entire specialty-broker industry exists just to place the construction, trucking, and staffing groups everyone else turns away, and those are precisely the businesses where PEO value is largest, because high class rates make the savings absolute dollars, not rounding. A second program with a specialty carrier, separate underwriting, and its own pricing expands our appetite into that whitespace while protecting the main master policy's loss experience. Scope expansion without contaminating the flagship book.</li>
        </ul>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">CROSS-TIER PLAY 04</span><h3>Money the client can see</h3></div>
        <p className="theme">Make the financial case visible, quantified, and standard in every quote.</p>
        <ul>
          <li><b>A credits analysis in every quote.</b> WOTC screening and the R&D payroll-tax credit (worth up to hundreds of thousands per year for qualifying startups) get evaluated up front and shipped as a page of the proposal, found money, quantified before the client signs. Gusto already runs R&D credit services inside payroll, so this is native plumbing, not a new build. And CPEO certification preserves these credits at the customer level, which makes the credits page a permanent feature, not a transition casualty.</li>
          <li><b>One pricing model wraps all of it.</b> One flat published PEPM admin fee, set by tier and headcount band rather than negotiated deal by deal. Every pass-through, wages, taxes, comp, premiums, itemized at cost on its own line. Our renewal philosophy, how increases are driven and allocated, in writing before signing. The admin fee is the only thing we earn, and it is the only thing on the bill that looks like a fee.</li>
          <li><b>The 3-to-5 year ROI model, in every consultant's hands.</b> NAPEO's research gives us defensible economics: 27% ROI, $1,775 saved vs $1,395 spent per employee, 12% lower turnover, double the growth rate. Put a calculator on it, train every consultant to run it live in discovery, and the long-term case stops being a claim and becomes arithmetic. Working demo below.</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">DEMO · THE CONSULTANT'S ROI MODEL</div>
        <h2>What does a PEO return over 3 to 5 years?</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>The tool every consultant runs live in discovery. Adjust the inputs.</p>
        <div style={{ marginTop: 16 }}>
          <RoiCalc />
        </div>
      </div>

      <div className="callout"><span className="tag">THE GAP THIS STACK EXPLOITS</span>
        Fertility platforms serve large self-funded employers; small business is locked out until
        someone aggregates. High-risk comp groups get declined by mainstream PEOs and absorbed by
        a specialty-broker cottage industry. Gap coverage exists as scattered voluntary add-ons,
        never engineered as deliberate plan design for small groups. Tax credits get mentioned in
        sales conversations and quantified after signing, if ever. Each play above takes something
        the market treats as an exception and makes it standard, on one platform, in one quote.
      </div>

      <div className="callout"><span className="tag">THE LADDER</span>
        The construct is a graduation machine: payroll clients step up to PEO 2 without touching
        their benefits, PEO 2 clients upgrade to PEO 1 at their renewal, and PEO 3 makes every
        rung available mid-year to anyone, from any competitor, the day certification lands.
        One platform, no re-implementation at any step, the continuity story Rippling markets,
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
          underwriting, and a certified founding team. Long term, it builds the moats,
          certification, benefits scale, channel, and a retention engine. The sequencing is
          the strategy: every risk gets its control before the throttle opens.
        </p>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">SHORT TERM · MONTHS 0–12</span><h3>Earn the right to scale</h3></div>
        <p className="theme">Prove the motion with the in-base pilot while the operating controls come online.</p>
        <ul>
          <li><b>Publish pricing on day one.</b> One flat PEPM admin fee per tier and headcount band, looked up rather than negotiated, with pass-throughs itemized at cost and the renewal philosophy in writing. No percent-of-payroll, no bundled rates, ever, as brand law. Justworks just raised Plus ~18% to ~$129; the "transparent, affordable PEO" mantle is being vacated in real time, and Gusto should take it at launch.</li>
          <li><b>Distribution before advertising.</b> The in-base motion is the whole short-term GTM: ICP-score the payroll base (NAPEO: nearly two-thirds of all PEO clients are 10–49 employees, exactly where Gusto's base lives), and work lifecycle triggers, new state registrations, headcount crossings, benefits-seeking signals, renewal windows.</li>
          <li><b>Internal partnership before external motion.</b> Week one belongs to peer sales leaders: written rules of engagement for install-base conversion, who owns the account, how credit and comp are shared, when a payroll AE brings PEO in, so converting the base makes allies of the payroll org, never victims. Co-selling into a shared customer base only works when the peer team wins every time we win.</li>
          <li><b>Plan around the season.</b> PEO selling concentrates September through December ahead of January 1 starts, which means pipeline builds in summer, underwriting and proposal capacity surges in fall, and implementation peaks in December. Season planning with marketing, risk, and ops is a Q3 deliverable, not a December scramble.</li>
          <li><b>An AI operating standard from day one.</b> Every rep works with AI as a daily teammate, agent-driven account prep, the Prospecting Agent for prioritization, AI-drafted follow-ups reviewed by a human. Set the expectation in onboarding the way it's been proven inside Gusto's own GTM: build a few high-impact workflows to show what's possible, then teach the team to build their own.</li>
          <li><b>Start the CPEO clock immediately.</b> Certification takes time and PEO 3 waits on it. File early, pursue ESAC in parallel, and market the pursuit itself, "certification in progress" beats silence.</li>
          <li><b>Underwriting before rep five.</b> Deal desk, credit screening, and funds-flow controls live before the sales team scales. The deals competitors decline will find the new entrant first; the controls have to be standing when they arrive.</li>
          <li><b>A small, certified founding team.</b> PEO-fluent consultants, every rep certifies through the Operator Course before touching a prospect, with compensation aligned to underwriting quality, so Gusto scales the book it wants.</li>
          <li><b>Implementation as a named function.</b> First-payroll SLA, over-communication until it lands clean, and a service model of self-serve plus genuinely reachable humans, the under-50 service gap TriNet leaves open.</li>
          <li><b>Accountant channel pilot.</b> A handful of top People Advisory partners, defined referral economics, real feedback, the seed of the long-term moat.</li>
          <li><b>Instrument everything from client one.</b> Funnel stages through underwriting, gross profit per WSE, win/loss, time-to-first-payroll. The day-90 readout becomes the month-12 scaling case.</li>
        </ul>
        <div className="callout"><span className="tag">MONTH-12 BAR</span>A repeatable in-base motion with evidence: pilot cohorts closed and retained, playbook v2 codified from win/loss data, certified rep class producing, channel pilot generating referrals, CPEO application progressing, and zero growth ahead of underwriting.</div>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">LONG TERM · YEARS 2–5</span><h3>Build the moats</h3></div>
        <p className="theme">Convert the early motion into structural advantages competitors can't copy quickly.</p>
        <ul>
          <li><b>Launch PEO 3 the day certification lands.</b> Sole federal tax liability, no wage-base restart, 3511(d) credit preservation, then market mid-year competitive takeaways hard, because the timing objection just died.</li>
          <li><b>Benefits scale with discipline.</b> Carrier leverage grows with the book, protect it by never buying growth with year-one benefits pricing the renewal can't sustain. Publish a renewal philosophy in writing and keep it; in a category famous for renewal shock, kept promises compound into a moat.</li>
          <li><b>Risk infrastructure as profit.</b> Claims management, safety, and return-to-work programs; large-deductible economics when the book justifies retaining the working layer; disciplined portfolio re-underwriting at renewal.</li>
          <li><b>The channel moat.</b> Scale the accountant channel, a PEO track inside People Advisory, channel-originated revenue as a tracked metric, plus written broker rules of engagement, with PEO 2 as the broker-friendly offer that turns a threat into a lane.</li>
          <li><b>Segment expansion on purpose.</b> Blue-collar through the EWA wedge, NAPEO shows almost half of PEO clients already sit in professional services, manufacturing, and construction, then multi-state mid-market as service depth matures. Expansion follows capability, never precedes it.</li>
          <li><b>Product roadmap fed by the field.</b> Reporting parity (the TriNet bar: saved, auto-scheduled custom reports), earned wage access, and a benefits enrollment experience that meets the Healthee bar, a head of sales who feeds product is a multiplier.</li>
          <li><b>Retention as the engine.</b> Implementation-to-first-renewal playbooks, graduation capture so clients scale to 100+ employees inside Gusto instead of out of it, and WSE retention treated as the company's north star, because in PEO economics, the renewal is the product.</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">THE SCOREBOARD</div>
        <h2>North-star metrics</h2>
        <div className="stat-grid" style={{ marginTop: 16 }}>
          <div className="stat"><div className="v">WSEs</div><div className="l">Worksite employees added and retained, the industry's unit of scale</div></div>
          <div className="stat"><div className="v">GP / WSE</div><div className="l">Gross profit per WSE per month, one number for whether the machine works</div></div>
          <div className="stat"><div className="v">Retention</div><div className="l">Logo and net revenue retention, in PEO economics, the renewal is the product</div></div>
          <div className="stat"><div className="v">% Channel</div><div className="l">Share of revenue originated by accountant partners, the moat, measured</div></div>
          <div className="stat"><div className="v">Underwriting yield</div><div className="l">Share of submitted deals passing the desk, sales quality, not just volume</div></div>
          <div className="stat"><div className="v">First-payroll SLA</div><div className="l">Time to a clean first payroll, the strongest early predictor of retention</div></div>
        </div>
      </div>

      <div className="callout"><span className="tag">WHAT KILLS PEOs, AND THE CONTROL FOR EACH</span>
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
    { n: "01", h: "Risk selection discipline", p: "The deal desk is the profit engine. Two PEOs with identical fees have wildly different economics based purely on the books they chose to write.", g: "Sales comp and culture must reward qualified deals, not raw logos, reps who package clean underwriting files win twice." },
    { n: "02", h: "Funds-flow & credit control", p: "A PEO extends unsecured credit equal to a full payroll, every cycle. Collection discipline, deposit policy, and remittance controls are the operating core.", g: "Build credit screening into the sales process itself so bad-fit deals die before implementation, not after." },
    { n: "03", h: "Benefits underwriting + renewal philosophy", p: "Year-one rates buy the deal; renewal allocation decides whether the book stays. Underpriced new business is a loan against year two.", g: "Sell the renewal story honestly from day one, it's the single biggest trust gap incumbents leave open." },
    { n: "04", h: "Claims management as profit", p: "Under large-deductible comp structures, every claim dollar avoided is the PEO's dollar. Safety and return-to-work are underwriting profit, not customer service.", g: "Bake safety value into the pitch for the right verticals; it differentiates against software-first rivals." },
    { n: "05", h: "Credentials: CPEO & ESAC", p: "Sole federal tax liability, no wage-base restart, bonded financial assurance, certification converts trust from a claim into a statute.", g: "For a new entrant, CPEO is the fastest answer to 'why trust the new guy with my payroll taxes?'" },
    { n: "06", h: "Service model matched to segment", p: "Dedicated HRBP vs self-serve isn't branding, it's a cost structure choice. Mismatched service models churn books.", g: "Gusto's base skews simple and software-native: lead self-serve with human escalation, and resist over-building white glove too early." },
    { n: "07", h: "The retention engine", p: "Accounts reach true profitability deep into the relationship. Implementation quality and the first payroll are the strongest retention predictors.", g: "Instrument GP/WSE and retention from client one, the metrics that tell you whether the machine works." },
    { n: "08", h: "Distribution advantage", p: "CAC and cycle length define PEO sales economics. Selling into an installed base structurally beats cold acquisition.", g: "This is Gusto's unfair advantage: the payroll base plus the accountant channel. The Prospecting Agent exists to exploit it systematically." },
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

function CrmTab() {
  return (
    <div className="vantage-breakout">
      <VantageApp />
    </div>
  );
}

function ResourcesTab({ onTerm }) {
  const [openKey, setOpenKey] = useState(-1);
  const letters = (n) => "ABCDEFGH"[n];
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">FOR THE TEAM · TAKE THESE WITH YOU</div>
        <h1>Resources<span className="hl">.</span></h1>
        <p className="lede">
          The leave-behinds: a downloadable competitive landscape, the full acronym reference, and
          the training answer key for whoever's running the certification.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">DOWNLOAD</div>
        <h2>The PEO Competitive Landscape</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>
          Every major competitor by name, ADP, Insperity, TriNet, Paychex, Justworks, Rippling,
          CoAdvantage, Vensure, Obsidian HR, and DecisionHR, with strengths to respect, weaknesses
          to exploit, and the specific wedge for each. A four-page PDF, formatted to share.
        </p>
        <a className="btn primary" href="/competitive-landscape.pdf" target="_blank" rel="noopener noreferrer" style={{ marginTop: 14, display: "inline-block" }}>
          Download the PDF
        </a>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">REFERENCE</div>
        <h2>The PEO acronym hub</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>
          Every acronym in the business, {Object.keys(GLOSSARY).length} and counting. Tap any term
          for the full definition. These are the same links that appear throughout the training.
        </p>
        <div style={{ marginTop: 16 }}>
          {Object.keys(GLOSSARY).sort().map((k) => (
            <button key={k} className="acro-row" onClick={() => onTerm(k)}>
              <b>{k}</b><span>{GLOSSARY[k][0]}</span>
            </button>
          ))}
        </div>
        <button className="btn ghost" style={{ marginTop: 14 }} onClick={() => onTerm("__LEGEND__")}>Open the full glossary</button>
      </div>

      <div className="card">
        <div className="kicker">FACILITATOR ONLY</div>
        <h2>Training answer key</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>
          For whoever administers the certification. Each module's correct answers and the one-line
          why. Tap a module to reveal it.
        </p>
        <div style={{ marginTop: 16 }}>
          {COURSE.map((m, mi) => (
            <div className="agent-card" key={m.id}>
              <div className="agent-head" role="button" tabIndex={0}
                style={openKey === mi ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : undefined}
                onClick={() => setOpenKey(openKey === mi ? -1 : mi)}
                onKeyDown={(e) => e.key === "Enter" && setOpenKey(openKey === mi ? -1 : mi)}>
                <span className="row-num">{m.num}</span>
                <span className="row-main">
                  <p className="row-title">{m.title}</p>
                  <p className="row-sub">{m.quiz.length} questions · pass at {m.pass}</p>
                </span>
                <span className="score-pill watch">KEY</span>
              </div>
              {openKey === mi && (
                <div className="agent-detail">
                  <ol className="answer-key">
                    {m.quiz.map((q, qi) => (
                      <li key={qi}>
                        <b>{letters(q.a)}.</b> {q.opts[q.a]}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanTab() {
  return (
    <div className="shell">
      <div className="hero">
        <div className="eyebrow">HEAD OF PEO SALES · FIRST 90 DAYS</div>
        <h1>The first 90 days<span className="hl">.</span></h1>
        <p className="lede">
          Three phases, each built on the same four workstreams: listen and learn the current
          state, partner with the people already here, build the product and the motion, and prove
          it with a real pilot. Every phase ends with something shipped, not something scheduled.
        </p>
      </div>

      <div className="callout" style={{ marginBottom: 18 }}><span className="tag">HOW THIS PLAN IS STRUCTURED</span>
        I don't walk in with the answers. I walk in with a method. The first month is mostly
        listening, because a brand-new PEO inside an established company succeeds or fails on how
        well it fits what's already working. Each phase below runs four parallel tracks: Listen &
        Understand, Partner Internally, Build the Platform & Playbook, and Prove It. The weight
        shifts from listening to building to proving as the quarter moves.
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">DAYS 1–30</span><h3>Listen & understand the current state</h3></div>
        <p className="theme">Earn the right to build by understanding the machine, the people, and the data before changing anything.</p>

        <p className="workstream">LISTEN & UNDERSTAND</p>
        <ul>
          <li><b>Map and meet every key stakeholder.</b> Product, underwriting and risk, finance and BizOps, benefits, implementation, marketing, partnerships, and the payroll and benefits sales leaders. One goal per conversation: understand their world, their constraints, and what a PEO does to their roadmap.</li>
          <li><b>Interview customers and lost deals.</b> Sit with early PEO-curious clients, recent wins, and the deals that walked. The losses teach more than the wins; both define the real ICP better than any model.</li>
          <li><b>Shadow the front line.</b> Ride along on payroll and benefits sales calls and listen to account managers handle renewals and escalations. The current motion is the foundation I have to build on, so I need to hear it live.</li>
          <li><b>Learn the Gusto way.</b> Study how Gusto already sells, onboards, and supports, the tone, the self-serve philosophy, the values in practice, so the PEO motion extends the brand instead of fighting it.</li>
        </ul>

        <p className="workstream">UNDERSTAND THE NUMBERS</p>
        <ul>
          <li><b>Review underwriting policy and appetite.</b> What can we write, in which states, for which class codes, at what size? Where are the declines? Know the box before selling to its edges.</li>
          <li><b>Establish the metrics and data picture.</b> What data exists on the base, what's the pricing structure, what are the key pricing levers (PEPM, comp, tax, benefits load), and what targets and goals already exist. Find the gaps in what we can measure.</li>
          <li><b>Size the in-base opportunity.</b> Mine the payroll base for PEO propensity, headcount band, multi-state, industry mix, benefits-seeking signals, and define the ICP from data, not instinct.</li>
        </ul>

        <div className="callout"><span className="tag">DAY-30 DELIVERABLES</span>Stakeholder map and listening-tour findings, written read-back of product and underwriting reality, data and metrics inventory with gaps named, ICP definition plus sized in-base opportunity, and a v1 scored target list from the Prospecting Agent.</div>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">DAYS 31–60</span><h3>Partner & build</h3></div>
        <p className="theme">Turn what I learned into alignment, a developing platform, and a playbook ready to test.</p>

        <p className="workstream">PARTNER INTERNALLY</p>
        <ul>
          <li><b>Align with the sales org.</b> Co-design the co-sell rules of engagement with the payroll and benefits sales leaders, account ownership, shared credit, comp, and the warm-handoff motion, so converting the base makes the peer team win every time we win.</li>
          <li><b>Build the account-manager feedback loop.</b> AMs see renewal pain, churn signals, and benefits frustration first. Stand up a standing channel so what they hear becomes pipeline and product input, not lost signal.</li>
          <li><b>Open the partner lane.</b> Pilot PEO referrals with a handful of top accountant partners; define the referral motion, materials, and economics with the partnerships team.</li>
        </ul>

        <p className="workstream">BUILD THE PLATFORM & PLAYBOOK</p>
        <ul>
          <li><b>Drive platform enhancement.</b> Feed the listening-tour and underwriting findings into a structured product and pricing roadmap with product and risk, a polished, prioritized plan for what the PEO needs to be competitive at launch and what comes next.</li>
          <li><b>Write Playbook v1.</b> Discovery checklist (census, renewal dates, SUI notices, comp dec pages), the total-cost-of-employment quoting toolkit, talk tracks for the top objections, and the honest year-two renewal story.</li>
          <li><b>Build the underwriting feedback loop.</b> A weekly sales-and-risk review of every declined and repriced deal, so the ICP, pricing, and pitch sharpen each cycle.</li>
          <li><b>Train the first team.</b> Onboard the founding reps through the training course on this site, every rep completes all five modules before touching a prospect.</li>
        </ul>

        <div className="callout"><span className="tag">DAY-60 DELIVERABLES</span>Co-sell rules of engagement live with peer leaders, AM feedback loop running, accountant-channel pilot defined, prioritized platform and pricing roadmap, Playbook v1 in hand, and the first rep class trained.</div>
      </div>

      <div className="phase">
        <div className="phase-head"><span className="phase-days">DAYS 61–90</span><h3>Prove it & plan the scale</h3></div>
        <p className="theme">Run a real pilot, instrument everything, and bring the scaling case back with evidence.</p>

        <p className="workstream">PROVE IT</p>
        <ul>
          <li><b>Launch the in-base pilot.</b> A defined cohort of high-scoring accounts, worked by me and the first reps using the playbook, every call instrumented from first touch to first payroll.</li>
          <li><b>Close first wins and run win/loss on everything.</b> What the data says about ICP, pricing, objections, and cycle length goes straight into Playbook v2.</li>
          <li><b>Stand up the funnel as the operating system.</b> Target to engaged to underwriting to proposal to closed, plus WSEs sold, effective PEPM, and early implementation quality, the metrics that run the business going forward.</li>
        </ul>

        <p className="workstream">PLAN THE SCALE</p>
        <ul>
          <li><b>Design quota and comp from real cycle data,</b> including underwriting-quality incentives, so we scale the book we actually want, not just the book that's easiest to write.</li>
          <li><b>Hire wave two against the now-proven profile,</b> and promote pilot learnings into formal onboarding.</li>
          <li><b>Deliver the Day-90 executive readout:</b> pilot results, unit-economics signals, channel learnings, the platform roadmap, and a resourced plan for the next two quarters.</li>
        </ul>

        <div className="callout"><span className="tag">DAY-90 SCORECARD</span>First in-base PEO revenue closed, a repeatable playbook backed by evidence, an instrumented funnel, a trained and growing team, internal partnerships operating, and a data-backed scaling plan on the table.</div>
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
        {err && <p className="gate-err">Not it, ask Gabriel for the password.</p>}
      </div>
    </div>
  );
}

function WelcomeLetter({ onClose }) {
  return (
    <div className="letter-overlay" role="dialog" aria-modal="true" aria-label="Welcome letter from Gabriel Revnew">
      <div className="letter-card">
        <span className="eyebrow">YOU'RE IN · A NOTE BEFORE YOU EXPLORE</span>
        <div className="salutation">To the Gusto team,</div>
        <p className="body">
          Thank you for the time you've put into this process. These conversations haven't felt
          like interviews. They've felt like working sessions, and that's the kind of team I
          want to be part of.
        </p>
        <p className="body">
          So instead of sending over a document, I built this. Inside you'll find the
          certification course I'd use to train our team, the market knowledge we'd carry into
          every conversation, a product construct, and my ideas for a go-to-market plan that
          we'd shape and execute together.
        </p>
        <p className="body">
          The biggest opportunity here isn't winning strangers. It's growing with the 500,000+
          businesses that already trust Gusto, and building real feedback loops between the
          field, underwriting, and product so every win and every loss makes us sharper. That's
          how I've led for the last eight years. Player-coach style, driven by the numbers,
          focused on developing people.
        </p>
        <p className="body">
          Gusto has one shot at entering PEO the right way, and my record is why I believe I
          can help build it. Five years running the number one team in the country at TriNet.
          The only team to put 100% of its consultants in President's Club. Leader of the Year
          chosen by the C-suite as the top leader across all of TriNet. Every page of this site comes from that experience.
          And I know none of it works alone, so treat everything here as a starting point for
          what we'd build together.
        </p>
        <p className="body">
          Explore in any order. Take the certification quizzes if you're feeling competitive.
          And the password you typed to get in here? I meant every word of it.
        </p>
        <div className="signoff"><span className="sig">Gabriel Revnew</span></div>
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

const PATHS = [
  { id: "ic", label: "Individual Contributor", route: ["fundamentals", "operating", "pricing", "gustopeo", "sales"],
    blurb: "Full certification, front to back. Every module, every quiz, nobody touches a prospect until all five stamps are on the board." },
  { id: "am", label: "Account Manager", route: ["fundamentals", "gustopeo", "sales", "pricing"],
    blurb: "Own the relationship after the sale: fundamentals, our product, the conversations clients actually have, then pricing mechanics, because renewal season is where account managers earn the decade." },
  { id: "mgmt", label: "Management", route: ["fundamentals", "operating", "pricing", "gustopeo", "sales"],
    blurb: "Coach the motion. You certify everything your team certifies, with extra weight on Module 02, your daily decisions about deals and discounting move the P&L." },
  { id: "senior", label: "Senior Manager", route: ["operating", "gustopeo", "sales", "fundamentals"],
    blurb: "The machine, the product, the motion. Operating model first, risk selection, retention economics, and capacity are the decisions made at your level." },
  { id: "csuite", label: "C-Suite", route: ["fundamentals", "operating", "gustopeo"],
    blurb: "The construct and the financial engine: what co-employment is, how a PEO makes money and where the risk lives, and what the Gusto PEO is building. Three modules, quizzes optional, though stamps look good on anyone." },
];



/* ===================== VANTAGE CRM (mounted in CRM & Tools tab) ===================== */

/* ============================ Gusto theme ============================ */
const GUAVA = "#F45D48", GUAVA20 = "#FDDFDA", KALE = "#0A8080", KALE20 = "#CEE6E6",
  CREAM = "#FFF2DF", PEACH = "#FEEFE8", OFF = "#F8F5F2", INK = "#222525", INK60 = "#7A7C7C", LINE = "#E4E0DB";

const money = (n) => (n < 0 ? "-$" : "$") + Math.round(Math.abs(n || 0)).toLocaleString();
const money2 = (n) => "$" + (n || 0).toFixed(2);
const pct = (n) => (n * 100).toFixed(1) + "%";
const APP_NAME = "Vantage";
const APP_TAGLINE = "your north star";

/* ---- company logo / avatar ---- */
const FREE_MAIL = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "live.com", "me.com", "proton.me", "protonmail.com"];
const emailDomain = (e) => { if (!e || !e.includes("@")) return ""; const d = e.split("@")[1].trim().toLowerCase().replace(/\/$/, ""); return FREE_MAIL.includes(d) ? "" : d; };
const cleanDomain = (s) => { if (!s) return ""; let h = String(s).trim(); if (!h) return ""; try { if (!/^https?:\/\//i.test(h)) h = "https://" + h; h = new URL(h).hostname; } catch { h = String(s).trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0]; } return h.toLowerCase().replace(/^www\./, ""); };
const domainFor = (rec) => cleanDomain(rec.domain) || emailDomain(rec.contacts && rec.contacts[0] && rec.contacts[0].email) || "";
const AV_COLORS = ["#0A8080", "#3B82B8", "#2E9E6B", "#C2544A", "#7A5AF8", "#D98B2B", "#178585", "#B4456E"];
const colorFor = (s) => AV_COLORS[Math.abs([...(s || "?")].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)) % AV_COLORS.length];
function LogoAvatar({ name, domain, size = 40, radius = 10 }) {
  const sources = useMemo(() => domain ? [
    "https://logo.clearbit.com/" + domain + "?size=128",
    "https://icons.duckduckgo.com/ip3/" + domain + ".ico",
    "https://www.google.com/s2/favicons?sz=128&domain=" + domain,
  ] : [], [domain]);
  const [okSrc, setOkSrc] = useState("");
  useEffect(() => {
    setOkSrc("");
    if (!sources.length) return;
    let cancelled = false, i = 0;
    const tryNext = () => {
      if (cancelled || i >= sources.length) return;
      const url = sources[i++];
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.onload = () => { if (!cancelled) { (img.naturalWidth > 1 ? setOkSrc(url) : tryNext()); } };
      img.onerror = () => { if (!cancelled) tryNext(); };
      img.src = url;
    };
    tryNext();
    return () => { cancelled = true; };
  }, [sources]);
  const initials = (((name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("")) || "?").toUpperCase();
  const box = { width: size, height: size, borderRadius: radius, flexShrink: 0 };
  if (okSrc) return <img src={okSrc} alt="" referrerPolicy="no-referrer" style={{ ...box, objectFit: "contain", background: "#fff", border: `1px solid ${LINE}` }} />;
  return <div style={{ ...box, background: colorFor(name), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: Math.round(size * 0.4) }}>{initials}</div>;
}

/* ============================ Plan libraries ============================ */
const MED_PLANS = [
  { name: "Anthem PPO 1500", carrier: "Anthem", type: "PPO", hsa: "No", r: { eeOnly: 650, eeSpouse: 1365, eeChild: 1170, family: 1950 },
    d: { dedII: "$1,500", dedFI: "$3,000", dedIO: "$3,000", dedFO: "$6,000", oopII: "$6,000", oopFI: "$12,000", coinsI: "20%", coinsO: "40%", pcp: "$30", spec: "$60", prev: "$0 (covered)", tele: "$10", urgent: "$75", er: "$350 copay", inpat: "20% after ded.", outpat: "20% after ded.", lab: "$40", img: "$150", rxDed: "$150", rxT1: "$15", rxT2: "$40", rxT3: "$70", rxT4: "25% to $250" } },
  { name: "Anthem HSA 3000", carrier: "Anthem", type: "HDHP", hsa: "Yes", r: { eeOnly: 520, eeSpouse: 1092, eeChild: 936, family: 1560 },
    d: { dedII: "$3,000", dedFI: "$6,000", dedIO: "$6,000", dedFO: "$12,000", oopII: "$5,000", oopFI: "$10,000", coinsI: "20%", coinsO: "40%", pcp: "Ded then 20%", spec: "Ded then 20%", prev: "$0 (covered)", tele: "Ded then 20%", urgent: "Ded then 20%", er: "Ded then 20%", inpat: "20% after ded.", outpat: "20% after ded.", lab: "Ded then 20%", img: "Ded then 20%", rxDed: "$0", rxT1: "Ded+$10", rxT2: "Ded+$40", rxT3: "Ded+$70", rxT4: "Ded then 25%" } },
  { name: "UHC Choice Plus", carrier: "UnitedHealthcare", type: "PPO", hsa: "No", r: { eeOnly: 610, eeSpouse: 1281, eeChild: 1098, family: 1830 },
    d: { dedII: "$1,000", dedFI: "$2,000", dedIO: "$2,500", dedFO: "$5,000", oopII: "$5,000", oopFI: "$10,000", coinsI: "20%", coinsO: "40%", pcp: "$25", spec: "$50", prev: "$0 (covered)", tele: "$0", urgent: "$60", er: "$300 copay", inpat: "20% after ded.", outpat: "20% after ded.", lab: "$30", img: "$100", rxDed: "$100", rxT1: "$10", rxT2: "$35", rxT3: "$60", rxT4: "20% to $200" } },
  { name: "Kaiser HMO 1500", carrier: "Kaiser Permanente", type: "HMO", hsa: "No", r: { eeOnly: 560, eeSpouse: 1176, eeChild: 1008, family: 1680 },
    d: { dedII: "$1,500", dedFI: "$3,000", dedIO: "Not covered", dedFO: "Not covered", oopII: "$6,500", oopFI: "$13,000", coinsI: "20%", coinsO: "N/A", pcp: "$20", spec: "$40", prev: "$0 (covered)", tele: "$0", urgent: "$50", er: "$250 copay", inpat: "20% after ded.", outpat: "20% after ded.", lab: "$25", img: "$100", rxDed: "$150", rxT1: "$15", rxT2: "$30", rxT3: "$50", rxT4: "20% to $250" } },
];
const MED_ROWS = [["Plan Overview"], ["Carrier", "carrier"], ["Plan Type", "type"], ["HSA-Eligible", "hsa"],
  ["Annual Deductible"], ["Individual — In-Net", "dedII"], ["Family — In-Net", "dedFI"], ["Individual — Out", "dedIO"], ["Family — Out", "dedFO"],
  ["Out-of-Pocket Max"], ["Individual — In-Net", "oopII"], ["Family — In-Net", "oopFI"],
  ["Coinsurance"], ["In-Network", "coinsI"], ["Out-of-Network", "coinsO"],
  ["Office & Urgent"], ["PCP Copay", "pcp"], ["Specialist Copay", "spec"], ["Preventive", "prev"], ["Telehealth", "tele"], ["Urgent Care", "urgent"], ["Emergency Room", "er"],
  ["Hospital & Outpatient"], ["Inpatient", "inpat"], ["Outpatient Surgery", "outpat"], ["Lab / X-ray", "lab"], ["Advanced Imaging", "img"],
  ["Prescription Drugs"], ["Rx Deductible", "rxDed"], ["Tier 1 Generic", "rxT1"], ["Tier 2 Preferred", "rxT2"], ["Tier 3 Non-Pref", "rxT3"], ["Tier 4 Specialty", "rxT4"]];

const DEN_PLANS = [
  { name: "MetLife Dental PPO", carrier: "MetLife", type: "PPO", r: { eeOnly: 35, eeSpouse: 70, eeChild: 75, family: 110 }, d: { dedI: "$50", dedF: "$150", max: "$1,500", prev: "100%", basic: "80%", major: "50%", ortho: "50% to $1,500", orthoMax: "$1,500", waitB: "None", waitM: "None", oon: "U&C 90th" } },
  { name: "Guardian DPPO", carrier: "Guardian", type: "PPO", r: { eeOnly: 28, eeSpouse: 56, eeChild: 60, family: 90 }, d: { dedI: "$50", dedF: "$150", max: "$1,500", prev: "100%", basic: "80%", major: "50%", ortho: "50% to $1,500", orthoMax: "$1,500", waitB: "None", waitM: "None", oon: "U&C 90th" } },
  { name: "Cigna Dental DHMO", carrier: "Cigna", type: "DHMO", r: { eeOnly: 22, eeSpouse: 44, eeChild: 48, family: 70 }, d: { dedI: "$0", dedF: "$0", max: "None", prev: "100%", basic: "Copay sched.", major: "Copay sched.", ortho: "Copay sched.", orthoMax: "N/A", waitB: "None", waitM: "None", oon: "In-network only" } },
];
const DEN_ROWS = [["Plan Overview"], ["Carrier", "carrier"], ["Plan Type", "type"],
  ["Deductible & Maximum"], ["Deductible — Ind", "dedI"], ["Deductible — Fam", "dedF"], ["Annual Maximum", "max"],
  ["Coverage (plan pays)"], ["Preventive", "prev"], ["Basic Services", "basic"], ["Major Services", "major"],
  ["Orthodontia"], ["Ortho Coverage", "ortho"], ["Ortho Lifetime Max", "orthoMax"],
  ["Waiting & Network"], ["Wait — Basic", "waitB"], ["Wait — Major", "waitM"], ["Out-of-Network", "oon"]];

const VIS_PLANS = [
  { name: "VSP Vision", carrier: "VSP", type: "PPO", r: { eeOnly: 8, eeSpouse: 14, eeChild: 15, family: 22 }, d: { exam: "$10", examFreq: "12 months", materials: "$25", lenses: "Covered in full", frame: "$150", frameFreq: "24 months", contacts: "$150 allowance", oon: "Schedule" } },
  { name: "VSP Choice", carrier: "VSP", type: "PPO", r: { eeOnly: 6.5, eeSpouse: 12, eeChild: 13, family: 18 }, d: { exam: "$10", examFreq: "12 months", materials: "$25", lenses: "Covered in full", frame: "$150", frameFreq: "12 months", contacts: "$150 allowance", oon: "Schedule" } },
  { name: "EyeMed", carrier: "EyeMed", type: "PPO", r: { eeOnly: 7, eeSpouse: 13, eeChild: 14, family: 20 }, d: { exam: "$10", examFreq: "12 months", materials: "$20", lenses: "Covered in full", frame: "$130", frameFreq: "24 months", contacts: "$130 allowance", oon: "Schedule" } },
];
const VIS_ROWS = [["Plan Overview"], ["Carrier", "carrier"], ["Plan Type", "type"],
  ["Frequency"], ["Exam Frequency", "examFreq"], ["Frame / Lens Freq", "frameFreq"],
  ["Copays"], ["Exam Copay", "exam"], ["Materials Copay", "materials"],
  ["Allowances"], ["Lenses", "lenses"], ["Frame Allowance", "frame"], ["Contact Allowance", "contacts"], ["Out-of-Network", "oon"]];

const TIERS = [["EE Only", "eeOnly"], ["EE + Spouse", "eeSpouse"], ["EE + Child(ren)", "eeChild"], ["Family", "family"]];

/* ============================ Gusto invoice template ============================ */
const GUSTO_TEMPLATE = [
  { g: "Subscription", n: "Plus Base Subscription", basis: "Base / mo", rate: 80, qty: 1 },
  { g: "Subscription", n: "Per-Employee Fee", basis: "Per EE / mo", rate: 12, perEE: true },
  { g: "Subscription", n: "Per-Contractor Fee", basis: "Per contractor / mo", rate: 6, qty: 0 },
  { g: "Payroll & Support", n: "Faster / Next-Day Direct Deposit", basis: "$15/mo + $3/EE", rate: 0, qty: 0 },
  { g: "Payroll & Support", n: "Time Tracking & Scheduling", basis: "Per EE / mo (Simple)", rate: 6, qty: 0 },
  { g: "Payroll & Support", n: "Performance Reviews", basis: "Per EE / mo", rate: 3, qty: 0 },
  { g: "Payroll & Support", n: "Priority Support & HR — Base", basis: "Flat / mo", rate: 30, qty: 0 },
  { g: "Payroll & Support", n: "Priority Support & HR — Per EE", basis: "Per EE / mo", rate: 3, qty: 0 },
  { g: "Benefits Admin", n: "Broker Integration (BYO broker)", basis: "Per elig. EE / mo", rate: 6, perEE: true },
  { g: "Benefits Admin", n: "Tax-Advantaged Accounts Fee", basis: "$200 / yr flat", rate: 16.67, qty: 1 },
  { g: "Benefits Admin", n: "HSA Administration", basis: "Per participant / mo", rate: 2.5, qty: 0 },
  { g: "Benefits Admin", n: "FSA / DCFSA Admin", basis: "Per participant / mo", rate: 4, qty: 0 },
  { g: "Benefits Admin", n: "Commuter Benefits Admin", basis: "Per participant / mo", rate: 4, qty: 0 },
  { g: "Benefits Admin", n: "ACA Compliance Filing", basis: "$1,250 / yr", rate: 104.17, qty: 0 },
  { g: "Benefits Admin", n: "COBRA Administration", basis: "Per company / mo", rate: 30, qty: 0 },
  { g: "Retirement & Insurance", n: "401(k) Admin (Guideline)", basis: "Base + per part. / mo", rate: 149, qty: 1 },
  { g: "Retirement & Insurance", n: "Workers' Comp Admin (pay-go)", basis: "Flat / mo", rate: 0, qty: 0 },
  { g: "Global & Other", n: "International EOR (Gusto Global)", basis: "Per EE / mo", rate: 699, qty: 0 },
  { g: "Global & Other", n: "R&D Tax Credit Service", basis: "% of credit", rate: 0, qty: 0 },
  { g: "One-Time / Setup", n: "New-State Registration", basis: "~$150 one-time / state", rate: 150, qty: 0, oneTime: true },
  { g: "One-Time / Setup", n: "Historical Payroll Migration", basis: "One-time", rate: 0, qty: 0, oneTime: true },
];

/* ============================ default client ============================ */
function newClient() {
  return {
    id: "c_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: Date.now(), updatedAt: Date.now(),
    clientName: "", preparedBy: "", proposalDate: new Date().toISOString().slice(0, 10), provider: "Gusto",
    stage: "Meeting Scheduled", forecast: "Pipeline", lostReason: "", expectedClose: new Date().toISOString().slice(0, 7), nextStep: "",
    industry: "", incumbent: "", leadSource: "", domain: "",
    contacts: [{ name: "", title: "", email: "", phone: "" }],
    activities: [],
    employees: 13, payroll: 1200000,
    medER: 0.7, denER: 0.5, visER: 0, curTrend: 0.1, propTrend: 0.05, proposedPEPM: 171, implFee: 0,
    lifeCur: 0, lifeProp: 144,
    med: { cur: "Anthem PPO 1500", prop: "UHC Choice Plus", census: { eeOnly: 8, eeSpouse: 2, eeChild: 1, family: 2 },
      rateType: "tier",
      members: [
        { name: "Employee 1", tier: "Employee Only", curRate: 540, propRate: 510 },
        { name: "Employee 2", tier: "EE + Spouse", curRate: 1130, propRate: 1065 },
        { name: "Employee 3", tier: "Family", curRate: 1820, propRate: 1720 },
      ],
      renewal: { enabled: false, renewalMonth: 1, effectiveMonth: 10, increase: 0.11 } },
    den: { cur: "MetLife Dental PPO", prop: "Guardian DPPO", census: { eeOnly: 8, eeSpouse: 2, eeChild: 1, family: 2 } },
    vis: { cur: "VSP Vision", prop: "VSP Choice", census: { eeOnly: 8, eeSpouse: 2, eeChild: 1, family: 2 } },
    wc: { payroll: 1200000, curRate: 0.45, curMod: 1, propRate: 0.38, propMod: 1 },
    invoice: GUSTO_TEMPLATE.map((l) => ({ ...l })),
    soft: { hours: 15, rate: 55, weeks: 52, reduction: 0.5 },
    winPlan: "", brief: null,
  };
}

/* ============================ sample deals (first-run seed) ============================ */
function dOffset(days) { const n = new Date(); n.setDate(n.getDate() + days); return new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
function mOffset(months) { const n = new Date(); n.setMonth(n.getMonth() + months); return n.toISOString().slice(0, 7); }
const STARTER_BOOK = [
  { clientName: "Merton Way B2B Marketing", domain: "mertonway.com", industry: "B2B Marketing agency", employees: 10, city: "Arvada, CO" },
  { clientName: "A-Train Marketing", domain: "atrainmarketing.com", industry: "Marketing agency", employees: 12, city: "Fort Collins, CO" },
  { clientName: "Webolutions", domain: "webolutions.com", industry: "Digital / web agency", employees: 14, city: "Centennial, CO", note: "Tech-adjacent, ~14 EEs." },
  { clientName: "Lanphier LLP", domain: "lanphiercpa.com", industry: "Accounting / CPA", employees: 12, city: "Denver, CO" },
  { clientName: "Fraser, Waldrop & Company CPAs", domain: "coprotax.com", industry: "Accounting / CPA", employees: 10, city: "Denver, CO" },
  { clientName: "SBA CPA", domain: "thesbacpa.com", industry: "Accounting / CPA", employees: 12, city: "Denver, CO", note: "Already runs payroll for clients — value prop lands fast." },
  { clientName: "O'Connor CPA Firm", domain: "oconnorcpafirm.com", industry: "Accounting / CPA", employees: 8, city: "Denver, CO" },
  { clientName: "John P. Morse, CPA", domain: "cpamorse.com", industry: "Accounting / CPA", employees: 6, city: "Denver, CO" },
  { clientName: "Aspen Dental – Private Practice of Cherry Creek", domain: "cherry-creekdentist.com", industry: "Dental practice", employees: 18, city: "Denver, CO", note: "3-dentist practice, solid 5–25 fit." },
  { clientName: "The Dental Team", domain: "thedentalteam.com", industry: "Dental, multi-location", employees: 30, city: "Denver metro, CO", note: "Female-owned, multi-location." },
];
function buildStarterBook() {
  return STARTER_BOOK.map((s) => { const c = newClient(); return { ...c, clientName: s.clientName, domain: s.domain, industry: s.industry, employees: s.employees, stage: "Assigned", forecast: "Pipeline", leadSource: "Assigned territory", preparedBy: "Gabe", winPlan: [s.city ? "Location: " + s.city : "", s.note || ""].filter(Boolean).join("\n"), contacts: [{ name: "", title: "", email: "", phone: "" }] }; });
}
function buildSamples() {
  const base = (o) => { const c = newClient(); return { ...c, ...o, employees: o.employees, payroll: o.payroll, med: { ...c.med, census: o.census || c.med.census }, den: { ...c.den, census: o.census || c.den.census }, vis: { ...c.vis, census: o.census || c.vis.census } }; };
  return [
    base({
      clientName: "Summit Robotics", domain: "summitrobotics.com", industry: "Advanced Manufacturing", incumbent: "Insperity", leadSource: "Accountant referral",
      employees: 45, payroll: 4600000, proposedPEPM: 165, stage: "Deep Dive Discovery Meeting", forecast: "Commit",
      expectedClose: mOffset(1), nextStep: dOffset(4), preparedBy: "Gabe",
      contacts: [{ name: "Dana Whitfield", title: "VP Operations", email: "dana@summitrobotics.com", phone: "303-555-0142" }, { name: "Mark Reyes", title: "CFO", email: "mreyes@summitrobotics.com", phone: "303-555-0177" }],
      winPlan: "Champion: Dana (VP Ops). Economic buyer: Mark (CFO) — get him into the deep-dive.\nPain: Anthem renewal projected +11% on 1/1; they transition 10/1, so pitch the skipped-renewal savings hard.\nLevers: R&D tax credit service + WC pay-go. Competing vs Insperity — differentiate on dedicated HR + master medical.\nNext: send age-banded census template, confirm renewal date, schedule CFO deep-dive.",
      activities: [
        { id: 1, type: "Meeting", date: dOffset(-6), text: "Intro call with Dana. Strong fit — frustrated with Insperity service levels." },
        { id: 2, type: "Email", date: dOffset(-2), text: "Sent follow-up + requested current Anthem renewal and census." },
      ],
    }),
    base({
      clientName: "Harbor Pediatrics", domain: "harborpeds.com", industry: "Healthcare", incumbent: "BambooHR + broker", leadSource: "Inbound web",
      employees: 18, payroll: 1500000, proposedPEPM: 175, stage: "Proposal", forecast: "Best Case",
      expectedClose: mOffset(0), nextStep: dOffset(0), preparedBy: "Gabe",
      contacts: [{ name: "Dr. Priya Nair", title: "Owner / Managing Partner", email: "priya@harborpeds.com", phone: "206-555-0190" }],
      winPlan: "Owner-led decision. Pain: broker is unresponsive at renewal, wants better medical + real HR support.\nLevers: master medical plan, dedicated benefits admin, COBRA/ACA off their plate.\nNext: walk through the proposal live; send dental side-by-side; lock age-banded rates from invoice.",
      activities: [
        { id: 1, type: "Call", date: dOffset(-9), text: "Discovery — 18 EEs, current medical with Regence, dental separate. Renewal in Q1." },
        { id: 2, type: "Note", date: dOffset(-3), text: "Built comparison; UHC proposed plan richer for less. Strong dental story." },
      ],
    }),
    base({
      clientName: "Crestline Logistics", domain: "crestlinelog.com", industry: "Transportation & Warehousing", incumbent: "ADP TotalSource", leadSource: "Outbound",
      employees: 62, payroll: 5200000, proposedPEPM: 155, stage: "Closed Won", forecast: "Commit",
      expectedClose: mOffset(-1), nextStep: "", preparedBy: "Gabe",
      contacts: [{ name: "Tom Alvarez", title: "Controller", email: "talvarez@crestlinelog.com", phone: "404-555-0123" }],
      winPlan: "WON. Decision driven by WC pay-go + payroll consolidation across 3 states. Implementation kickoff scheduled.",
      activities: [
        { id: 1, type: "Meeting", date: dOffset(-30), text: "Final proposal review with Tom + ownership." },
        { id: 2, type: "Note", date: dOffset(-12), text: "Verbal yes. Sent service agreement." },
        { id: 3, type: "Task", date: dOffset(-2), text: "Signed! Kick off implementation, collect prior-payroll + WC class codes." },
      ],
    }),
    base({
      clientName: "Maple & Vine Hospitality", domain: "mapleandvine.com", industry: "Restaurants & Hospitality", incumbent: "TriNet", leadSource: "Referral",
      employees: 26, payroll: 1300000, proposedPEPM: 170, stage: "Closed Lost", forecast: "Pipeline", lostReason: "Price / cost",
      expectedClose: mOffset(-1), nextStep: "", preparedBy: "Gabe",
      contacts: [{ name: "Rosa Belmonte", title: "Owner", email: "rosa@mapleandvine.com", phone: "512-555-0166" }],
      winPlan: "LOST on price — our PEPM came in above their incumbent TriNet renewal. Relationship intact.\nRe-engage 60 days before their next renewal (Q3) with a sharper number and the soft-cost story.",
      activities: [
        { id: 1, type: "Call", date: dOffset(-40), text: "Good discovery, high-turnover hourly workforce." },
        { id: 2, type: "Email", date: dOffset(-15), text: "Sent proposal." },
        { id: 3, type: "Note", date: dOffset(-8), text: "Lost — incumbent matched on price. Set reminder to revisit at renewal." },
      ],
    }),
    base({
      clientName: "Apex Dental Group", domain: "apexdental.com", industry: "Dental / Healthcare", incumbent: "Paychex", leadSource: "LinkedIn",
      employees: 12, payroll: 950000, proposedPEPM: 185, stage: "Meeting Scheduled", forecast: "Pipeline",
      expectedClose: mOffset(2), nextStep: dOffset(-5), preparedBy: "Gabe",
      contacts: [{ name: "Kevin Osei", title: "Practice Manager", email: "kevin@apexdental.com", phone: "480-555-0118" }],
      winPlan: "Early stage. Confirm eligible headcount and current carrier + renewal date.\nFollow-up is OVERDUE — re-book the discovery call. Likely pain: payroll tax across multi-location, benefits admin burden.",
      activities: [
        { id: 1, type: "Note", date: dOffset(-10), text: "Connected on LinkedIn; booked intro. 2 locations, ~12 EEs." },
      ],
    }),
  ];
}

/* ============================ computation ============================ */
function planBy(list, name) { return list.find((p) => p.name === name) || list[0]; }
function tierTotal(plan, census) { return TIERS.reduce((s, [, k]) => s + (census[k] || 0) * (plan.r[k] || 0) * 12, 0); }

function compute(d) {
  const medC = planBy(MED_PLANS, d.med.cur), medP = planBy(MED_PLANS, d.med.prop);
  const denC = planBy(DEN_PLANS, d.den.cur), denP = planBy(DEN_PLANS, d.den.prop);
  const visC = planBy(VIS_PLANS, d.vis.cur), visP = planBy(VIS_PLANS, d.vis.prop);
  const medBanded = d.med.rateType === "banded";
  const memCur = (d.med.members || []).reduce((s, m) => s + (+m.curRate || 0), 0);
  const memProp = (d.med.members || []).reduce((s, m) => s + (+m.propRate || 0), 0);
  const medTC = medBanded ? memCur * 12 : tierTotal(medC, d.med.census);
  const medTP = medBanded ? memProp * 12 : tierTotal(medP, d.med.census);
  const denTC = tierTotal(denC, d.den.census), denTP = tierTotal(denP, d.den.census);
  const visTC = tierTotal(visC, d.vis.census), visTP = tierTotal(visP, d.vis.census);
  const medEC = medTC * d.medER, medEP = medTP * d.medER;
  const denEC = denTC * d.denER, denEP = denTP * d.denER;
  const visEC = visTC * d.visER, visEP = visTP * d.visER;
  const wcC = (d.wc.payroll / 100) * d.wc.curRate * d.wc.curMod;
  const wcP = (d.wc.payroll / 100) * d.wc.propRate * d.wc.propMod;
  const adminC = d.invoice.reduce((s, l) => {
    const q = l.perEE ? d.employees : (l.qty || 0);
    return s + (l.oneTime ? q * l.rate : q * l.rate * 12);
  }, 0);
  const adminP = d.proposedPEPM * d.employees * 12;
  const curTotal = wcC + medEC + denEC + visEC + d.lifeCur + adminC;
  const propTotal = wcP + medEP + denEP + visEP + d.lifeProp + adminP;
  const hard = curTotal - propTotal;
  const soft = d.soft.hours * d.soft.rate * d.soft.weeks * d.soft.reduction;
  // skipped-renewal savings (Year 1, hard dollars)
  let avoidedRenewal = 0, renewalMonths = 0;
  const rn = d.med.renewal;
  if (rn && rn.enabled) {
    let m = (rn.renewalMonth || 1) - (rn.effectiveMonth || 1); if (m <= 0) m += 12;
    renewalMonths = m;
    avoidedRenewal = medEC * (rn.increase || 0) * ((12 - m) / 12);
  }
  const totalValue = hard + avoidedRenewal + soft;
  // 4-year (medical ER trended)
  let cum = 0; const years = [];
  for (let y = 0; y < 4; y++) {
    const mC = medEC * Math.pow(1 + d.curTrend, y), mP = medEP * Math.pow(1 + d.propTrend, y);
    const ct = wcC + adminC + mC + denEC + visEC + d.lifeCur;
    const pt = wcP + adminP + mP + denEP + visEP + d.lifeProp;
    const sv = ct - pt; cum += sv; years.push({ y: y + 1, ct, pt, sv });
  }
  const total4 = cum + avoidedRenewal + soft * 4;
  const acv = d.proposedPEPM * d.employees * 12;
  return { medC, medP, denC, denP, visC, visP, medTC, medTP, denTC, denTP, visTC, visTP, medEC, medEP, denEC, denEP, visEC, visEP, wcC, wcP, adminC, adminP, curTotal, propTotal, hard, soft, avoidedRenewal, renewalMonths, totalValue, acv, years, cum, total4 };
}

/* ============================ pipeline model ============================ */
const STAGES = [
  { name: "Assigned", p: 0, c: "#9AA0A0" },
  { name: "Meeting Scheduled", p: 0.10, c: "#8FB8B8" },
  { name: "First Meeting Completed", p: 0.20, c: "#5FA3A3" },
  { name: "Obtaining Quote Information", p: 0.30, c: "#3B9999" },
  { name: "Deep Dive Discovery Meeting", p: 0.45, c: "#178585" },
  { name: "Proposal", p: 0.60, c: "#0A8080" },
  { name: "Closed Won", p: 1.0, c: "#2E9E6B" },
  { name: "Implementation", p: 1.0, c: "#1F7E54" },
  { name: "Closed Lost", p: 0, c: "#C2544A" },
];
const FORECAST_CATS = ["Commit", "Best Case", "Pipeline", "Omit"];
const FORECAST_DEFS = { Commit: "Gave us a verbal", "Best Case": "Likely to move forward", Pipeline: "Unsure it'll move forward", Omit: "Zero chance — excluded from forecast" };
const LOSS_REASONS = ["Price / cost", "Stayed with current PEO", "Chose a competitor", "No decision / status quo", "Timing — not ready", "Lost to their broker", "Unresponsive / ghosted", "Other"];
const stageInfo = (n) => STAGES.find((s) => s.name === n) || STAGES[0];
const isWon = (n) => n === "Closed Won" || n === "Implementation";
const isLost = (n) => n === "Closed Lost";
const isNotStarted = (n) => n === "Assigned";
const isOpen = (n) => !isWon(n) && !isLost(n);
const isActive = (n) => isOpen(n) && !isNotStarted(n);
const localToday = () => { const n = new Date(); return new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const prettyDate = (s) => s ? new Date(s + "T00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";
function fuStatus(s) { if (!s) return null; const t = localToday(); if (s < t) return { label: "Overdue", color: "#C2544A" }; if (s === t) return { label: "Today", color: GUAVA }; return { label: "Follow-up", color: KALE }; }

/* ============================ storage (localStorage) ============================ */
const IDX = "peo:index";
const LS = {
  get: (k) => { try { const v = (typeof window !== "undefined") ? window.localStorage.getItem(k) : null; return v == null ? null : { value: v }; } catch { return null; } },
  set: (k, v) => { try { if (typeof window !== "undefined") window.localStorage.setItem(k, v); } catch {} },
  del: (k) => { try { if (typeof window !== "undefined") window.localStorage.removeItem(k); } catch {} },
};
async function readIndex() { try { const r = LS.get(IDX); return r && r.value ? JSON.parse(r.value) : []; } catch { return []; } }
async function writeIndex(idx) { try { LS.set(IDX, JSON.stringify(idx)); } catch {} }
async function readClient(id) { try { const r = LS.get("peo:client:" + id); return r && r.value ? JSON.parse(r.value) : null; } catch { return null; } }
async function writeClient(d) { try { LS.set("peo:client:" + d.id, JSON.stringify(d)); } catch {} }
async function deleteClientStore(id) { try { LS.del("peo:client:" + id); } catch {} }

/* ============================ UI atoms ============================ */
const card = { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14 };
function Btn({ children, onClick, kind = "primary", style, ...p }) {
  const base = { display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 600, fontSize: 14, borderRadius: 10, padding: "9px 15px", cursor: "pointer", border: "1px solid transparent", fontFamily: "inherit", transition: "filter .15s" };
  const kinds = {
    primary: { background: GUAVA, color: "#fff" },
    kale: { background: KALE, color: "#fff" },
    ghost: { background: "#fff", color: INK, border: `1px solid ${LINE}` },
    danger: { background: "#fff", color: "#b4392b", border: "1px solid #f0cfca" },
  };
  return <button onClick={onClick} onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(.95)")} onMouseLeave={(e) => (e.currentTarget.style.filter = "none")} style={{ ...base, ...kinds[kind], ...style }} {...p}>{children}</button>;
}
function Field({ label, children, hint }) {
  return <label style={{ display: "block", marginBottom: 12 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: INK60, marginBottom: 4 }}>{label}</div>
    {children}
    {hint && <div style={{ fontSize: 11, color: INK60, marginTop: 3 }}>{hint}</div>}
  </label>;
}
const inputStyle = { width: "100%", boxSizing: "border-box", padding: "9px 11px", borderRadius: 9, border: `1px solid ${LINE}`, background: CREAM, fontSize: 14, color: INK, fontFamily: "inherit", outline: "none" };
function Num({ v, on, step = 1, pct: isPct }) {
  return <input type="number" step={step} value={isPct ? Math.round(v * 1000) / 10 : v} onChange={(e) => { const x = parseFloat(e.target.value); on(isPct ? (isNaN(x) ? 0 : x / 100) : (isNaN(x) ? 0 : x)); }} style={inputStyle} />;
}
function Txt({ v, on }) { return <input value={v} onChange={(e) => on(e.target.value)} style={inputStyle} />; }
function Sel({ v, on, opts }) {
  return <select value={v} onChange={(e) => on(e.target.value)} style={{ ...inputStyle, appearance: "auto" }}>
    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>;
}
function SectionTitle({ children }) { return <div style={{ background: KALE, color: "#fff", fontWeight: 700, fontSize: 13, padding: "7px 12px", borderRadius: 8, margin: "18px 0 12px" }}>{children}</div>; }

/* ============================ design grid (current vs proposed) ============================ */
function DesignGrid({ rows, cur, prop }) {
  return <div style={{ ...card, overflow: "hidden", marginTop: 12 }}>
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr" }}>
      <div style={hdCell(INK)}>Benefit Element</div>
      <div style={hdCell(INK)}>{cur.name}</div>
      <div style={hdCell(GUAVA)}>{prop.name}</div>
      {rows.map((row, i) => row.length === 1
        ? <div key={i} style={{ gridColumn: "1 / -1", background: OFF, fontWeight: 700, fontSize: 12, padding: "6px 12px", color: INK }}>{row[0]}</div>
        : <React.Fragment key={i}>
          <div style={cellL}>{row[0]}</div>
          <div style={cellC}>{cur.d[row[1]]}</div>
          <div style={cellC}>{prop.d[row[1]]}</div>
        </React.Fragment>)}
    </div>
  </div>;
}
const hdCell = (bg) => ({ background: bg, color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 12px", textAlign: "center" });
const cellL = { padding: "7px 12px", fontSize: 13, borderTop: `1px solid ${LINE}` };
const cellC = { padding: "7px 12px", fontSize: 13, textAlign: "center", borderTop: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}` };

/* ============================ benefit editor ============================ */
const MEM_TIERS = ["Employee Only", "EE + Spouse", "EE + Child(ren)", "Family"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const cellHd = { padding: "8px 12px" };

function RenewalSection({ d, set, medEC }) {
  const r = d.med.renewal || {};
  const setR = (patch) => set({ ...d, med: { ...d.med, renewal: { ...r, ...patch } } });
  let m = (r.renewalMonth || 1) - (r.effectiveMonth || 1); if (m <= 0) m += 12;
  const avoided = r.enabled ? medEC * (r.increase || 0) * ((12 - m) / 12) : 0;
  return <div style={{ ...card, marginTop: 18, padding: 16, background: r.enabled ? PEACH : "#fff", borderColor: r.enabled ? GUAVA20 : LINE }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontWeight: 700, fontSize: 14 }}>Skipped-renewal savings (Year 1)</div>
      <button onClick={() => setR({ enabled: !r.enabled })} style={{ padding: "5px 14px", borderRadius: 16, border: "none", background: r.enabled ? KALE : INK60, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{r.enabled ? "On" : "Off"}</button>
    </div>
    <div style={{ fontSize: 12, color: INK60, margin: "4px 0 12px" }}>If they move to {d.provider} before their current plan's renewal, they skip that year's increase. The avoided increase on the employer's medical share is true Year-1 hard-dollar savings.</div>
    {r.enabled && <>
      <div style={grid3}>
        <Field label="Current plan renewal month"><select value={r.renewalMonth} onChange={(e) => setR({ renewalMonth: +e.target.value })} style={{ ...inputStyle, appearance: "auto" }}>{MONTHS.map((mo, i) => <option key={mo} value={i + 1}>{mo}</option>)}</select></Field>
        <Field label={"Transition to " + d.provider}><select value={r.effectiveMonth} onChange={(e) => setR({ effectiveMonth: +e.target.value })} style={{ ...inputStyle, appearance: "auto" }}>{MONTHS.map((mo, i) => <option key={mo} value={i + 1}>{mo}</option>)}</select></Field>
        <Field label="Projected annual increase %"><Num v={r.increase} on={(v) => setR({ increase: v })} pct step={0.5} /></Field>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", background: "#fff", border: `1px solid ${GUAVA20}`, borderRadius: 8, padding: "10px 14px" }}>
        <span style={{ fontSize: 12, color: INK60 }}>{m} months to renewal at transition → {12 - m} months of the increase avoided in Year 1</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: GUAVA }}>{money(avoided)}</span>
      </div>
    </>}
  </div>;
}

function BenefitEditor({ d, set, kind, plans, rows, erKey, totals, advanced }) {
  const b = d[kind];
  const opts = plans.map((p) => p.name);
  const cur = planBy(plans, b.cur), prop = planBy(plans, b.prop);
  const setB = (patch) => set({ ...d, [kind]: { ...b, ...patch } });
  const setCensus = (k, v) => setB({ census: { ...b.census, [k]: v } });
  const banded = advanced && b.rateType === "banded";
  const members = b.members || [];
  const setMembers = (mm) => setB({ members: mm });
  const updMem = (i, patch) => setMembers(members.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const memCur = members.reduce((s, m) => s + (+m.curRate || 0), 0);
  const memProp = members.reduce((s, m) => s + (+m.propRate || 0), 0);
  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Field label={advanced ? "Current plan (for design)" : "Current plan"}><Sel v={b.cur} on={(x) => setB({ cur: x })} opts={opts} /></Field>
      <Field label={advanced ? "Proposed plan (for design)" : "Proposed plan"}><Sel v={b.prop} on={(x) => setB({ prop: x })} opts={opts} /></Field>
    </div>

    {advanced && <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: INK60 }}>Rate basis:</span>
      {[["tier", "Tier (composite)"], ["banded", "Age-banded"]].map(([val, lbl]) =>
        <button key={val} onClick={() => setB({ rateType: val })} style={{ padding: "6px 13px", borderRadius: 18, border: `1px solid ${b.rateType === val ? KALE : LINE}`, background: b.rateType === val ? KALE : "#fff", color: b.rateType === val ? "#fff" : INK, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{lbl}</button>)}
    </div>}

    {!banded && <>
      <SectionTitle>Enrollment by tier (census)</SectionTitle>
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr", background: OFF, fontWeight: 700, fontSize: 12 }}>
          <div style={cellHd}>Tier</div><div style={{ ...cellHd, textAlign: "center" }}>Enrolled</div>
          <div style={{ ...cellHd, textAlign: "center" }}>Current /yr</div><div style={{ ...cellHd, textAlign: "center" }}>Proposed /yr</div>
        </div>
        {TIERS.map(([lbl, k]) => <div key={k} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr", borderTop: `1px solid ${LINE}`, alignItems: "center" }}>
          <div style={{ padding: "6px 12px", fontSize: 13 }}>{lbl}</div>
          <div style={{ padding: "5px 8px" }}><Num v={b.census[k]} on={(v) => setCensus(k, v)} /></div>
          <div style={{ padding: "6px 12px", textAlign: "center", fontSize: 13 }}>{money(b.census[k] * cur.r[k] * 12)}</div>
          <div style={{ padding: "6px 12px", textAlign: "center", fontSize: 13 }}>{money(b.census[k] * prop.r[k] * 12)}</div>
        </div>)}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr", background: KALE, color: "#fff", fontWeight: 700 }}>
          <div style={cellHd}>Employer share ({pct(d[erKey])})</div><div></div>
          <div style={{ ...cellHd, textAlign: "center" }}>{money(totals.tc * d[erKey])}</div>
          <div style={{ ...cellHd, textAlign: "center" }}>{money(totals.tp * d[erKey])}</div>
        </div>
      </div>
    </>}

    {banded && <>
      <SectionTitle>Age-banded rates — one row per enrolled employee (from current invoice)</SectionTitle>
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1fr 1fr 30px", background: OFF, fontWeight: 700, fontSize: 12 }}>
          <div style={cellHd}>Employee</div><div style={cellHd}>Enrollment tier</div><div style={{ ...cellHd, textAlign: "center" }}>Current $/mo</div><div style={{ ...cellHd, textAlign: "center" }}>Proposed $/mo</div><div></div>
        </div>
        {members.map((m, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1fr 1fr 30px", borderTop: `1px solid ${LINE}`, alignItems: "center" }}>
          <div style={{ padding: "4px 6px" }}><input value={m.name} placeholder="Name" onChange={(e) => updMem(i, { name: e.target.value })} style={inputStyle} /></div>
          <div style={{ padding: "4px 6px" }}><select value={m.tier} onChange={(e) => updMem(i, { tier: e.target.value })} style={{ ...inputStyle, appearance: "auto" }}>{MEM_TIERS.map((o) => <option key={o}>{o}</option>)}</select></div>
          <div style={{ padding: "4px 6px" }}><Num v={m.curRate} on={(v) => updMem(i, { curRate: v })} step={0.01} /></div>
          <div style={{ padding: "4px 6px" }}><Num v={m.propRate} on={(v) => updMem(i, { propRate: v })} step={0.01} /></div>
          <div style={{ padding: "4px", textAlign: "center", cursor: "pointer" }} onClick={() => setMembers(members.filter((_, j) => j !== i))}><Trash2 size={15} style={{ color: INK60 }} /></div>
        </div>)}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1fr 1fr 30px", background: KALE, color: "#fff", fontWeight: 700 }}>
          <div style={cellHd}>Total premium ({members.length} EEs)</div><div></div>
          <div style={{ ...cellHd, textAlign: "center" }}>{money(memCur * 12)}/yr</div>
          <div style={{ ...cellHd, textAlign: "center" }}>{money(memProp * 12)}/yr</div><div></div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <Btn kind="ghost" onClick={() => setMembers([...members, { name: "Employee " + (members.length + 1), tier: "Employee Only", curRate: 0, propRate: 0 }])}><Plus size={15} /> Add employee</Btn>
        <span style={{ fontSize: 11, color: INK60 }}>Employer share ({pct(d[erKey])}): {money(memCur * 12 * d[erKey])} current / {money(memProp * 12 * d[erKey])} proposed</span>
      </div>
    </>}

    {advanced && <RenewalSection d={d} set={set} medEC={totals.tc * d[erKey]} />}

    <SectionTitle>Plan design — side by side</SectionTitle>
    <DesignGrid rows={rows} cur={cur} prop={prop} />
  </div>;
}

/* ============================ results panel ============================ */
function Stat({ label, value, accent, icon }) {
  return <div style={{ ...card, padding: "14px 16px", background: accent ? PEACH : "#fff", borderColor: accent ? GUAVA20 : LINE }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: INK60, fontWeight: 600 }}>{icon}{label}</div>
    <div style={{ fontSize: 24, fontWeight: 800, color: accent ? GUAVA : INK, marginTop: 4 }}>{value}</div>
  </div>;
}
function Results({ c, d }) {
  const Line = ({ l, cur, prop, bold }) => <tr style={{ fontWeight: bold ? 700 : 400 }}>
    <td style={tdL}>{l}</td><td style={tdR}>{money(cur)}</td><td style={tdR}>{money(prop)}</td><td style={{ ...tdR, color: cur - prop >= 0 ? KALE : GUAVA }}>{money(cur - prop)}</td>
  </tr>;
  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      <Stat label="Current annual" value={money(c.curTotal)} icon={<DollarSign size={14} />} />
      <Stat label="Proposed annual" value={money(c.propTotal)} icon={<DollarSign size={14} />} />
      <Stat label="Hard-dollar savings" value={money(c.hard)} icon={<TrendingUp size={14} />} />
      <Stat label="Soft-cost (NAPEO)" value={money(c.soft)} icon={<Clock size={14} />} />
      {c.avoidedRenewal > 0 && <Stat label="Avoided renewal (Yr 1)" value={money(c.avoidedRenewal)} icon={<TrendingUp size={14} />} />}
      <div style={{ gridColumn: "1 / -1" }}><Stat label="Total annual economic value" value={money(c.totalValue)} accent icon={<TrendingUp size={16} />} /></div>
    </div>
    <table style={{ width: "100%", borderCollapse: "collapse", ...card, overflow: "hidden" }}>
      <thead><tr style={{ background: INK, color: "#fff" }}><th style={th}>Cost component</th><th style={thR}>Current</th><th style={thR}>{d.provider}</th><th style={thR}>Savings</th></tr></thead>
      <tbody>
        <Line l="Workers' Comp" cur={c.wcC} prop={c.wcP} />
        <Line l="Medical (ER share)" cur={c.medEC} prop={c.medEP} />
        <Line l="Dental (ER share)" cur={c.denEC} prop={c.denEP} />
        <Line l="Vision (ER share)" cur={c.visEC} prop={c.visEP} />
        <Line l="Life / STD / LTD" cur={d.lifeCur} prop={d.lifeProp} />
        <Line l="Payroll/HR Admin (Gusto → PEO)" cur={c.adminC} prop={c.adminP} />
        <Line l="Total annualized cost" cur={c.curTotal} prop={c.propTotal} bold />
      </tbody>
    </table>
    <div style={{ ...card, marginTop: 14, padding: 14, background: OFF }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>4-Year projection (medical trended {pct(d.curTrend)} vs {pct(d.propTrend)})</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {c.years.map((y) => <div key={y.y} style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 11, color: INK60 }}>Year {y.y} savings</div><div style={{ fontWeight: 700, color: y.sv >= 0 ? KALE : GUAVA }}>{money(y.sv)}</div>
        </div>)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13 }}>
        <span>4-yr cumulative hard-dollar: <b>{money(c.cum)}</b></span>
        <span style={{ color: GUAVA }}>4-yr total economic value: <b>{money(c.total4)}</b></span>
      </div>
      {c.avoidedRenewal > 0 && <div style={{ marginTop: 8, fontSize: 12, color: INK60 }}>Includes a one-time avoided renewal increase of <b style={{ color: INK }}>{money(c.avoidedRenewal)}</b> ({c.renewalMonths} months to renewal at transition).</div>}
    </div>
  </div>;
}
const th = { padding: "9px 12px", textAlign: "left", fontSize: 12 }, thR = { ...th, textAlign: "right" };
const tdL = { padding: "7px 12px", fontSize: 13, borderTop: `1px solid ${LINE}` };
const tdR = { ...tdL, textAlign: "right" };

/* ============================ print packet ============================ */
function Packet({ d, c }) {
  const Row = ({ l, cur, prop, bold }) => <tr style={{ fontWeight: bold ? 700 : 400 }}><td style={ptdL}>{l}</td><td style={ptdR}>{money(cur)}</td><td style={ptdR}>{money(prop)}</td><td style={ptdR}>{money(cur - prop)}</td></tr>;
  const pGrid = (rows, cur, prop) => <table style={pTable}><thead><tr><th style={pthL}>Benefit</th><th style={pth}>{cur.name}</th><th style={{ ...pth, background: GUAVA }}>{prop.name}</th></tr></thead>
    <tbody>{rows.map((r, i) => r.length === 1 ? <tr key={i}><td colSpan={3} style={{ background: OFF, fontWeight: 700, padding: "3px 8px", fontSize: 10 }}>{r[0]}</td></tr>
      : <tr key={i}><td style={ptdL}>{r[0]}</td><td style={ptdC}>{cur.d[r[1]]}</td><td style={ptdC}>{prop.d[r[1]]}</td></tr>)}</tbody></table>;
  return <div className="packet">
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `3px solid ${KALE}`, paddingBottom: 8, marginBottom: 4 }}>
      <div style={{ fontFamily: "Arial", fontWeight: 800, fontSize: 30, color: GUAVA }}>gusto</div>
      <div style={{ textAlign: "right", fontSize: 9, fontStyle: "italic", color: GUAVA, fontWeight: 700 }}>FOR ILLUSTRATIVE PURPOSES ONLY — NOT AN OFFICIAL GUSTO PRODUCT OR TOOL</div>
    </header>
    <div style={{ background: KALE, color: "#fff", padding: "8px 12px", fontSize: 17, fontWeight: 700, borderRadius: 4 }}>PEO Cost Comparison & ROI Analysis</div>
    <div style={{ fontSize: 11, color: INK60, margin: "6px 2px 12px" }}>Prepared for {domainFor(d) ? <img src={"https://www.google.com/s2/favicons?sz=64&domain=" + domainFor(d)} alt="" style={{ width: 14, height: 14, verticalAlign: "middle", marginRight: 5, borderRadius: 3 }} /> : null}<b style={{ color: INK }}>{d.clientName || "—"}</b>{d.contacts && d.contacts[0] && d.contacts[0].name ? <> · Attn: {d.contacts[0].name}{d.contacts[0].title ? ", " + d.contacts[0].title : ""}</> : ""} · {d.employees} employees · by {d.preparedBy || "—"} · {d.proposalDate} · Provider: {d.provider}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
      {[["Current annual", money(c.curTotal), false], ["Proposed annual", money(c.propTotal), false], ["Total economic value", money(c.totalValue), true], ["4-yr total value", money(c.total4), true]].map(([l, v, a]) =>
        <div key={l} style={{ background: a ? PEACH : OFF, border: `1px solid ${a ? GUAVA20 : LINE}`, borderRadius: 6, padding: "8px 10px" }}>
          <div style={{ fontSize: 9, color: INK60, fontWeight: 700 }}>{l}</div><div style={{ fontSize: 18, fontWeight: 800, color: a ? GUAVA : INK }}>{v}</div></div>)}
    </div>
    <h3 style={ph}>Return on Investment Summary</h3>
    <table style={pTable}><thead><tr><th style={pthL}>Cost component</th><th style={pth}>Current</th><th style={{ ...pth, background: GUAVA }}>{d.provider}</th><th style={pth}>Savings</th></tr></thead>
      <tbody>
        <Row l="Workers' Compensation" cur={c.wcC} prop={c.wcP} />
        <Row l="Medical (employer share)" cur={c.medEC} prop={c.medEP} />
        <Row l="Dental (employer share)" cur={c.denEC} prop={c.denEP} />
        <Row l="Vision (employer share)" cur={c.visEC} prop={c.visEP} />
        <Row l="Life / STD / LTD" cur={d.lifeCur} prop={d.lifeProp} />
        <Row l="Payroll / HR Admin (Gusto → PEO)" cur={c.adminC} prop={c.adminP} />
        <Row l="Total annualized cost" cur={c.curTotal} prop={c.propTotal} bold />
      </tbody></table>
    <div style={{ display: "flex", gap: 10, margin: "8px 0 14px" }}>
      <div style={{ flex: 1, background: PEACH, border: `1px solid ${GUAVA20}`, borderRadius: 6, padding: 10 }}><div style={{ fontSize: 10, color: INK60 }}>Hard-dollar annual savings</div><div style={{ fontWeight: 800, color: c.hard >= 0 ? KALE : GUAVA, fontSize: 16 }}>{money(c.hard)}</div></div>
      <div style={{ flex: 1, background: PEACH, border: `1px solid ${GUAVA20}`, borderRadius: 6, padding: 10 }}><div style={{ fontSize: 10, color: INK60 }}>Soft-cost / productivity (NAPEO)</div><div style={{ fontWeight: 800, fontSize: 16 }}>{money(c.soft)}</div></div>
      {c.avoidedRenewal > 0 && <div style={{ flex: 1, background: PEACH, border: `1px solid ${GUAVA20}`, borderRadius: 6, padding: 10 }}><div style={{ fontSize: 10, color: INK60 }}>Avoided renewal (Year 1)</div><div style={{ fontWeight: 800, fontSize: 16, color: KALE }}>{money(c.avoidedRenewal)}</div></div>}
      <div style={{ flex: 1, background: GUAVA, color: "#fff", borderRadius: 6, padding: 10 }}><div style={{ fontSize: 10, opacity: .9 }}>Total annual economic value</div><div style={{ fontWeight: 800, fontSize: 16 }}>{money(c.totalValue)}</div></div>
    </div>
    <div className="pbreak" />
    <h3 style={ph}>Major Medical</h3>{pGrid(MED_ROWS, c.medC, c.medP)}
    <h3 style={ph}>Dental</h3>{pGrid(DEN_ROWS, c.denC, c.denP)}
    <div className="pbreak" />
    <h3 style={ph}>Vision</h3>{pGrid(VIS_ROWS, c.visC, c.visP)}
    <h3 style={ph}>Soft-Cost Savings (NAPEO / McBassi 2019)</h3>
    <table style={pTable}><tbody>
      <tr><td style={ptdL}>HR/payroll admin time</td><td style={ptdR}>{d.soft.hours} hrs/wk × {money2(d.soft.rate)} × {d.soft.weeks} wks</td></tr>
      <tr><td style={ptdL}>Estimated reduction with PEO</td><td style={ptdR}>{pct(d.soft.reduction)}</td></tr>
      <tr style={{ fontWeight: 700 }}><td style={ptdL}>Annual reclaimed-time value</td><td style={ptdR}>{money(c.soft)}</td></tr>
      <tr><td style={ptdL}>NAPEO benchmark ($1,775/EE/yr · 27.2% ROI)</td><td style={ptdR}>{money(1775 * d.employees)}</td></tr>
    </tbody></table>
    <p style={{ fontSize: 8, color: INK60, marginTop: 14, fontStyle: "italic" }}>Confidential. Estimates based on data and assumptions entered. Soft-cost figures reference NAPEO/McBassi (2019). Rates and plan benefits are illustrative — replace with the prospect's actual quotes and SBCs. A binding agreement exists only upon execution of the required service agreement.</p>
  </div>;
}
const ph = { fontSize: 13, color: KALE, margin: "12px 0 5px", borderBottom: `2px solid ${KALE20}`, paddingBottom: 2 };
const pTable = { width: "100%", borderCollapse: "collapse", marginBottom: 6, fontSize: 10 };
const pth = { background: INK, color: "#fff", padding: "4px 8px", fontSize: 10, textAlign: "right" };
const pthL = { ...pth, textAlign: "left" };
const ptdL = { padding: "3px 8px", borderTop: `1px solid ${LINE}`, textAlign: "left" };
const ptdR = { padding: "3px 8px", borderTop: `1px solid ${LINE}`, textAlign: "right" };
const ptdC = { padding: "3px 8px", borderTop: `1px solid ${LINE}`, textAlign: "center" };

/* ============================ pipeline dashboard ============================ */
function InfoTip({ text }) {
  const [open, setOpen] = useState(false);
  return <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
    <Info size={13} style={{ color: INK60, cursor: "help" }} />
    {open && <span style={{ position: "absolute", bottom: "calc(100% + 9px)", left: "50%", transform: "translateX(-50%)", width: 250, background: INK, color: "#fff", fontSize: 12, lineHeight: 1.55, fontWeight: 500, padding: "10px 12px", borderRadius: 10, zIndex: 40, boxShadow: "0 8px 24px rgba(0,0,0,.24)", textAlign: "left", pointerEvents: "none" }}>{text}<span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${INK}` }} /></span>}
  </span>;
}
function PipeStat({ label, value, sub, accent, info }) {
  return <div style={{ ...card, padding: "13px 15px", background: accent ? PEACH : "#fff", borderColor: accent ? GUAVA20 : LINE }}>
    <div style={{ fontSize: 11.5, color: INK60, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>{label}{info ? <InfoTip text={info} /> : null}</div>
    <div style={{ fontSize: 23, fontWeight: 800, color: accent ? GUAVA : INK, marginTop: 3 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: INK60, marginTop: 2 }}>{sub}</div>}
  </div>;
}
function Bar({ label, value, max, count, color }) {
  const w = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return <div style={{ marginBottom: 9 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
      <span style={{ fontWeight: 600 }}>{label} <span style={{ color: INK60, fontWeight: 400 }}>· {count}</span></span>
      <span style={{ fontWeight: 700 }}>{money(value)}</span>
    </div>
    <div style={{ height: 9, background: OFF, borderRadius: 5, overflow: "hidden" }}><div style={{ width: w + "%", height: "100%", background: color, borderRadius: 5 }} /></div>
  </div>;
}
function Dashboard({ index, onOpen, onNew, onDelete, onQuick, onAddProspect, onPrintDeal }) {
  const [q, setQ] = useState("");
  const [view, setView] = useState("myday"); // forecast | deals
  const list = index.filter((c) => (c.clientName || "Untitled").toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.updatedAt - a.updatedAt);

  const allOpen = index.filter((c) => isOpen(c.stage)), won = index.filter((c) => isWon(c.stage)), lost = index.filter((c) => isLost(c.stage));
  const omit = allOpen.filter((c) => c.forecast === "Omit");
  const notStarted = allOpen.filter((c) => isNotStarted(c.stage));
  const open = allOpen.filter((c) => c.forecast !== "Omit" && !isNotStarted(c.stage)); // active (forecasted, started) open deals
  const sum = (a) => a.reduce((s, c) => s + (c.acv || 0), 0);
  const openACV = sum(open), wonACV = sum(won), omitACV = sum(omit);
  const weighted = open.reduce((s, c) => s + (c.acv || 0) * stageInfo(c.stage).p, 0);
  const commitOpen = sum(open.filter((c) => c.forecast === "Commit"));
  const bestOpen = sum(open.filter((c) => c.forecast === "Best Case"));
  const pipeOpen = sum(open.filter((c) => c.forecast === "Pipeline"));
  const commit = wonACV + commitOpen, bestCase = wonACV + commitOpen + bestOpen;
  const decided = won.length + lost.length;
  const winRate = decided ? won.length / decided : 0;
  const today = localToday();
  const dueCount = open.filter((c) => c.nextStep && c.nextStep <= today).length;
  const noNext = open.filter((c) => !c.nextStep).length;
  const reasonCounts = LOSS_REASONS.map((r) => ({ r, n: lost.filter((c) => c.lostReason === r).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  const topReason = reasonCounts[0];
  const funnel = STAGES.filter((s) => s.name !== "Assigned").map((s) => ({ ...s, items: index.filter((c) => c.stage === s.name && c.forecast !== "Omit") }));
  const maxStageACV = Math.max(1, ...funnel.map((s) => sum(s.items)));
  const matchQ = (c) => (c.clientName || "Untitled").toLowerCase().includes(q.toLowerCase());
  const assignedList = index.filter(matchQ).sort((a, b) => (b.acv || 0) - (a.acv || 0));
  const activeList = open.filter(matchQ).sort((a, b) => (b.acv || 0) - (a.acv || 0));
  const tam = sum(index);
  const renderCard = (c) => { const si = stageInfo(c.stage); return <div key={c.id} style={{ ...card, padding: 16, position: "relative" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: si.c, borderRadius: 20, padding: "3px 10px" }}>{c.stage}</span>
      <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>{onPrintDeal && <FileText size={16} style={{ color: INK60, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onPrintDeal(c.id); }} />}<Trash2 size={16} style={{ color: INK60, cursor: "pointer" }} onClick={() => { if (confirm("Delete this deal? This can't be undone.")) onDelete(c.id); }} /></span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 12 }}>
      <LogoAvatar name={c.clientName} domain={c.domain} size={42} radius={11} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16, cursor: "pointer", lineHeight: 1.2 }} onClick={() => onOpen(c.id)}>{c.clientName || "Untitled deal"}</div>
        <div style={{ fontSize: 12, color: INK60, marginTop: 2 }}>{c.contact ? c.contact + " · " : ""}{isNotStarted(c.stage) ? "Assigned · not started" : isOpen(c.stage) ? c.forecast : isWon(c.stage) ? "Won" : (c.lostReason || "Lost")}</div>
      </div>
    </div>
    {c.nextStep && isOpen(c.stage) && (() => { const f = fuStatus(c.nextStep); return <div style={{ fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 5, fontWeight: 600, color: f.color }}><Calendar size={13} /> {f.label}: {prettyDate(c.nextStep)}</div>; })()}
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: 11, color: INK60 }}>Annual contract value</span>
      <span style={{ fontSize: 19, fontWeight: 800, color: GUAVA }}>{money(c.acv || 0)}</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
      <select value={c.stage} onChange={(e) => onQuick(c.id, { stage: e.target.value })} style={{ ...inputStyle, background: "#fff", fontSize: 12, padding: "6px 8px" }}>{STAGES.map((s) => <option key={s.name}>{s.name}</option>)}</select>
      {isLost(c.stage) ? <select value={c.lostReason || ""} onChange={(e) => onQuick(c.id, { lostReason: e.target.value })} style={{ ...inputStyle, background: "#fff", fontSize: 12, padding: "6px 8px" }}><option value="">Reason…</option>{LOSS_REASONS.map((r) => <option key={r}>{r}</option>)}</select>
        : <select value={c.forecast} disabled={!isActive(c.stage)} onChange={(e) => onQuick(c.id, { forecast: e.target.value })} style={{ ...inputStyle, background: isActive(c.stage) ? "#fff" : OFF, fontSize: 12, padding: "6px 8px" }}>{FORECAST_CATS.map((f) => <option key={f}>{f}</option>)}</select>}
    </div>
  </div>; };

  return <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px 60px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 20px", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: INK60, fontWeight: 600 }}><TrendingUp size={15} /> Pipeline &amp; forecast</div>
        <h1 style={{ fontSize: 27, fontWeight: 800, margin: "2px 0 0" }}>Sales forecast</h1>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ display: "flex", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 10, overflow: "hidden" }}>
          {[["myday", "My Day"], ["forecast", "Forecast"], ["assigned", "Assigned"], ["active", "Active"], ["today", "Today"]].map(([v, l]) => <button key={v} onClick={() => setView(v)} style={{ padding: "8px 14px", border: "none", background: view === v ? KALE : "#fff", color: view === v ? "#fff" : INK, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{l}{v === "active" ? " (" + open.length + ")" : ""}{v === "today" && dueCount > 0 ? " (" + dueCount + ")" : ""}</button>)}
        </div>
        <Btn onClick={onNew}><Plus size={16} /> New deal</Btn>
      </div>
    </div>

    {index.length === 0 && view !== "myday" ? <div style={{ ...card, padding: "48px 20px", textAlign: "center", color: INK60 }}>
      <Folder size={34} style={{ color: KALE, marginBottom: 8 }} /><div style={{ fontWeight: 700, color: INK, marginBottom: 4 }}>No deals yet</div>
      <div style={{ fontSize: 14, marginBottom: 16 }}>Create a deal to start building pipeline. Each one saves automatically and rolls into your forecast.</div>
      <Btn onClick={onNew}><Plus size={16} /> New deal</Btn>
    </div> : view === "myday" ? <div style={{ marginTop: 4 }}><MyDay onAdd={onAddProspect} existing={index} /></div> : view === "forecast" ? <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 12, marginBottom: 20 }}>
        <PipeStat label="Open pipeline" value={money(openACV)} sub={open.length + " active" + (omit.length ? " · " + omit.length + " omitted" : "")} info="Total ACV of your active open deals — started and not omitted. Your live opportunity volume before any probability is applied." />
        <PipeStat label="Weighted forecast" value={money(weighted)} sub="Σ ACV × stage probability" info="Each active deal's ACV multiplied by the win-probability of its stage, then summed. It's the conservative, expected-value view of your pipeline — what you'd realistically book if every deal converted at its stage's odds (Meeting 10% → First Meeting 20% → Quote Info 30% → Deep Dive 45% → Proposal 60%). Not-started and omitted deals are excluded. Stage drives this number, not your Commit/Best-Case tags." />
        <PipeStat label="Commit" value={money(commit)} sub="Won + committed" accent info="What you're confident you'll book: Closed-Won ACV plus open deals you've tagged Commit (the prospect gave a verbal). Your floor." />
        <PipeStat label="Best case" value={money(bestCase)} sub="Won + commit + best case" info="The upside scenario: Won + Commit + Best Case deals. What you book if the deals you think are likely actually land. Your ceiling for the period." />
        <PipeStat label="Closed Won (ACV)" value={money(wonACV)} sub={won.length + " won"} info="Annual contract value already won (Closed Won + Implementation) in this view." />
        <PipeStat label="Win rate" value={decided ? Math.round(winRate * 100) + "%" : "—"} sub={won.length + " won · " + lost.length + " lost"} info="Won ÷ (Won + Lost). Your close rate on decided deals only — open and not-started accounts don't count yet." />
        <PipeStat label="Follow-ups due" value={String(dueCount)} sub={noNext ? noNext + " open w/o a next step" : "overdue or today"} accent={dueCount > 0} info="Active deals whose follow-up date is today or overdue. Not-started and omitted accounts are excluded so this stays a real worklist." />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, alignItems: "start" }}>
        <div style={{ ...card, padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Pipeline by stage</div>
          {funnel.filter((s) => s.items.length).map((s) => <Bar key={s.name} label={s.name} value={sum(s.items)} count={s.items.length} max={maxStageACV} color={s.c} />)}
          {funnel.every((s) => !s.items.length) && <div style={{ color: INK60, fontSize: 13 }}>No deals to chart yet.</div>}
          <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 12, paddingTop: 12, display: "flex", gap: 16, fontSize: 12, flexWrap: "wrap" }}>
            <span>Commit <b>{money(commitOpen)}</b></span><span>Best case <b>{money(bestOpen)}</b></span><span>Pipeline <b>{money(pipeOpen)}</b></span><span style={{ color: INK60 }}>Omitted <b>{money(omitACV)}</b></span>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: INK60, lineHeight: 1.6 }}>
            <b style={{ color: INK }}>Commit</b> = gave a verbal · <b style={{ color: INK }}>Best Case</b> = likely to move · <b style={{ color: INK }}>Pipeline</b> = unsure · <b style={{ color: INK }}>Omit</b> = no chance (excluded)
          </div>
        </div>
        <div style={{ ...card, padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Win / loss</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, background: "#EAF6F0", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 11, color: INK60 }}>Won</div><div style={{ fontWeight: 800, fontSize: 18, color: "#1F7E54" }}>{won.length}</div></div>
            <div style={{ flex: 1, background: "#FBEEEC", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 11, color: INK60 }}>Lost</div><div style={{ fontWeight: 800, fontSize: 18, color: "#C2544A" }}>{lost.length}</div></div>
            <div style={{ flex: 1, background: OFF, borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 11, color: INK60 }}>Close %</div><div style={{ fontWeight: 800, fontSize: 18 }}>{decided ? Math.round(winRate * 100) + "%" : "—"}</div></div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Why we're losing</div>
          {reasonCounts.length ? <>
            {topReason && <div style={{ background: PEACH, border: `1px solid ${GUAVA20}`, borderRadius: 8, padding: "8px 11px", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: INK60 }}>#1 reason</div><div style={{ fontWeight: 700, color: GUAVA }}>{topReason.r} <span style={{ color: INK60, fontWeight: 400 }}>({topReason.n})</span></div></div>}
            {reasonCounts.map((x) => <div key={x.r} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3px 0" }}><span>{x.r}</span><b>{x.n}</b></div>)}
          </> : <div style={{ color: INK60, fontSize: 13 }}>No closed-lost deals yet.</div>}
        </div>
      </div>
    </> : view === "assigned" ? <>
      <div style={{ ...card, padding: "20px 22px", marginBottom: 18, background: `linear-gradient(135deg, ${KALE} 0%, #0c6f6f 100%)`, border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>Total account value · your TAM</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginTop: 2 }}>{money(tam)}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", marginTop: 2 }}>{index.length} account{index.length === 1 ? "" : "s"} assigned to you · est. annual contract value across the book</div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 11, color: "rgba(255,255,255,.75)" }}>Not started</div><div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{money(sum(notStarted))}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.75)" }}>{notStarted.length} assigned</div></div>
            <div><div style={{ fontSize: 11, color: "rgba(255,255,255,.75)" }}>Active eval</div><div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{money(openACV)}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.75)" }}>{open.length} deals</div></div>
            <div><div style={{ fontSize: 11, color: "rgba(255,255,255,.75)" }}>Won</div><div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{money(wonACV)}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.75)" }}>{won.length} deals</div></div>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: 16, maxWidth: 360 }}>
        <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: INK60 }} />
        <input placeholder="Search assigned accounts" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, background: "#fff", paddingLeft: 33 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 16 }}>{assignedList.map(renderCard)}</div>
    </> : view === "active" ? <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div><div style={{ fontWeight: 800, fontSize: 16 }}>Active evaluations</div><div style={{ fontSize: 13, color: INK60 }}>{open.length} live · {money(openACV)} open · {money(weighted)} weighted</div></div>
        <div style={{ position: "relative", maxWidth: 320, flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: INK60 }} />
          <input placeholder="Search active deals" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...inputStyle, background: "#fff", paddingLeft: 33 }} />
        </div>
      </div>
      {activeList.length === 0 ? <div style={{ ...card, padding: "40px 20px", textAlign: "center", color: INK60 }}><div style={{ fontWeight: 700, color: INK, marginBottom: 4 }}>No active evaluations</div><div style={{ fontSize: 14 }}>Move an assigned account into a stage to start working it.</div></div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 16 }}>{activeList.map(renderCard)}</div>}
    </> : <>
      {(() => {
        const t = localToday();
        const withDate = open.filter((c) => c.nextStep).sort((a, b) => (a.nextStep < b.nextStep ? -1 : 1));
        const overdue = withDate.filter((c) => c.nextStep < t);
        const todayD = withDate.filter((c) => c.nextStep === t);
        const upcoming = withDate.filter((c) => c.nextStep > t);
        const noStep = open.filter((c) => !c.nextStep);
        const Group = ({ title, items, color, empty }) => <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><span style={{ width: 9, height: 9, borderRadius: 9, background: color }} /><span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span><span style={{ fontSize: 12, color: INK60 }}>· {items.length}</span></div>
          {items.length === 0 ? <div style={{ fontSize: 13, color: INK60, paddingLeft: 17 }}>{empty}</div>
            : <div style={{ ...card, overflow: "hidden" }}>{items.map((c, i) => { const si = stageInfo(c.stage); return <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderTop: i ? `1px solid ${LINE}` : "none", cursor: "pointer" }} onClick={() => onOpen(c.id)}>
              <LogoAvatar name={c.clientName} domain={c.domain} size={30} radius={8} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{c.clientName || "Untitled deal"}</div><div style={{ fontSize: 12, color: INK60 }}>{c.contact ? c.contact + " · " : ""}{prettyDate(c.nextStep) || "no date"}</div></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: si.c, borderRadius: 20, padding: "3px 9px", flexShrink: 0 }}>{c.stage}</span>
              <span style={{ fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{money(c.acv || 0)}</span>
            </div>; })}</div>}
        </div>;
        return <>
          <Group title="Overdue" items={overdue} color="#C2544A" empty="Nothing overdue — nice." />
          <Group title="Today" items={todayD} color={GUAVA} empty="Nothing scheduled for today." />
          <Group title="Upcoming" items={upcoming} color={KALE} empty="No upcoming follow-ups scheduled." />
          <Group title="Needs a next step" items={noStep} color={INK60} empty="Every open deal has a next step. 👏" />
        </>;
      })()}
    </>}
  </div>;
}

/* ============================ editor ============================ */
const V_TABS = ["Setup", "Contact", "Activity", "Medical", "Dental", "Vision", "Workers' Comp", "Gusto Invoice", "Soft-Cost", "Summary"];

const ACT_TYPES = [
  { t: "Note", c: KALE, i: MessageSquare }, { t: "Call", c: "#2E9E6B", i: Phone },
  { t: "Email", c: "#3B82B8", i: Mail }, { t: "Meeting", c: GUAVA, i: Calendar }, { t: "Task", c: INK60, i: Check },
];
const actInfo = (t) => ACT_TYPES.find((x) => x.t === t) || ACT_TYPES[0];

function ContactTab({ d, set }) {
  const contacts = d.contacts && d.contacts.length ? d.contacts : [{ name: "", title: "", email: "", phone: "" }];
  const upd = (i, patch) => set({ ...d, contacts: contacts.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const fld = (k, label) => <Field label={label}><Txt v={d[k] || ""} on={(v) => set({ ...d, [k]: v })} /></Field>;
  const [pulling, setPulling] = useState(false);
  const [perr, setPerr] = useState("");
  const pullApollo = async () => {
    if (!d.clientName) { setPerr("Add a company name first."); return; }
    setPerr(""); setPulling(true);
    try {
      const r = await researchAccount(d.clientName, domainFor(d));
      if (Array.isArray(r.contacts) && r.contacts.length) {
        const have = new Set(contacts.filter((x) => x.name).map((x) => x.name.toLowerCase()));
        const add = r.contacts.filter((x) => x.name && !have.has(x.name.toLowerCase()));
        const existing = contacts.filter((x) => x.name);
        set({ ...d, contacts: [...existing, ...add].slice(0, 10) });
      } else setPerr("No contacts found in Apollo for this company.");
    } catch (e) { setPerr((e && e.message) || "Apollo pull failed"); }
    setPulling(false);
  };
  return <div>
    <SectionTitle>Account</SectionTitle>
    <div style={{ display: "flex", alignItems: "center", gap: 14, ...card, padding: 14, marginBottom: 12 }}>
      <LogoAvatar name={d.clientName} domain={domainFor(d)} size={52} radius={12} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>{d.clientName || "Company name"}</div>
        <div style={{ fontSize: 12, color: INK60 }}>{domainFor(d) ? domainFor(d) + " · logo auto-pulled from the company domain" : "Add a website or a work email to auto-pull the logo"}</div>
      </div>
    </div>
    <div style={grid2}>
      <Field label="Company name"><Txt v={d.clientName} on={(v) => set({ ...d, clientName: v })} /></Field>
      <Field label="Company website" hint="Powers the logo — e.g. acme.com"><Txt v={d.domain || ""} on={(v) => set({ ...d, domain: v })} /></Field>
      {fld("industry", "Industry")}
      {fld("incumbent", "Current PEO / payroll provider")}
      {fld("leadSource", "Lead source")}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, marginBottom: 4 }}>
      <SectionTitle>Contacts</SectionTitle>
      <Btn kind="ghost" onClick={pullApollo} disabled={pulling}><Sparkles size={14} /> {pulling ? "Pulling…" : "Pull contacts from Apollo"}</Btn>
    </div>
    {perr && <div style={{ ...card, padding: 10, borderColor: "#f0cfca", background: "#FBEEEC", color: "#b4392b", fontSize: 12.5, marginBottom: 10 }}>{perr}</div>}
    {contacts.map((p, i) => <div key={i} style={{ ...card, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? GUAVA : INK60 }}>{i === 0 ? "PRIMARY CONTACT" : "CONTACT " + (i + 1)}</span>
        {contacts.length > 1 && <Trash2 size={15} style={{ color: INK60, cursor: "pointer" }} onClick={() => set({ ...d, contacts: contacts.filter((_, j) => j !== i) })} />}
      </div>
      <div style={grid2}>
        <Field label="Name"><Txt v={p.name} on={(v) => upd(i, { name: v })} /></Field>
        <Field label="Title"><Txt v={p.title} on={(v) => upd(i, { title: v })} /></Field>
        <Field label="Email"><div style={{ display: "flex", gap: 6, alignItems: "center" }}><Txt v={p.email} on={(v) => upd(i, { email: v })} />{p.email && <a href={"mailto:" + p.email} style={{ color: KALE }}><Mail size={16} /></a>}</div></Field>
        <Field label="Phone"><div style={{ display: "flex", gap: 6, alignItems: "center" }}><Txt v={p.phone} on={(v) => upd(i, { phone: v })} />{p.phone && <a href={"tel:" + p.phone} style={{ color: KALE }}><Phone size={16} /></a>}</div></Field>
      </div>
    </div>)}
    <Btn kind="ghost" onClick={() => set({ ...d, contacts: [...contacts, { name: "", title: "", email: "", phone: "" }] })}><Plus size={15} /> Add contact</Btn>
  </div>;
}

function ActivityTab({ d, set }) {
  const [type, setType] = useState("Note");
  const [date, setDate] = useState(localToday());
  const [text, setText] = useState("");
  const acts = (d.activities || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
  const log = () => {
    if (!text.trim()) return;
    set({ ...d, activities: [...(d.activities || []), { id: Date.now(), type, date, text: text.trim() }] });
    setText("");
  };
  return <div>
    <SectionTitle>Log activity</SectionTitle>
    <div style={{ ...card, padding: 14 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {ACT_TYPES.map((a) => { const I = a.i; return <button key={a.t} onClick={() => setType(a.t)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 18, border: `1px solid ${type === a.t ? a.c : LINE}`, background: type === a.t ? a.c : "#fff", color: type === a.t ? "#fff" : INK, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}><I size={14} /> {a.t}</button>; })}
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ ...inputStyle, width: "auto", background: "#fff" }} />
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What happened? (e.g. Left voicemail, sent renewal request, demoed PEOLens…)" rows={3} style={{ ...inputStyle, background: "#fff", resize: "vertical" }} />
      <div style={{ marginTop: 8 }}><Btn kind="kale" onClick={log}><Plus size={15} /> Log {type.toLowerCase()}</Btn></div>
    </div>
    <SectionTitle>Timeline</SectionTitle>
    {acts.length === 0 ? <div style={{ ...card, padding: 24, textAlign: "center", color: INK60, fontSize: 14 }}>No activity logged yet. Every call, email, and meeting you log shows up here.</div>
      : <div style={{ ...card, overflow: "hidden" }}>
        {acts.map((a, i) => { const info = actInfo(a.type); const I = info.i; return <div key={a.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderTop: i ? `1px solid ${LINE}` : "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: info.c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I size={15} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{a.type}</span>
              <span style={{ fontSize: 11, color: INK60 }}>{new Date(a.date + "T00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
            </div>
            <div style={{ fontSize: 13, color: INK, marginTop: 2, whiteSpace: "pre-wrap" }}>{a.text}</div>
          </div>
          <Trash2 size={14} style={{ color: INK60, cursor: "pointer", flexShrink: 0 }} onClick={() => set({ ...d, activities: (d.activities || []).filter((x) => x.id !== a.id) })} />
        </div>; })}
      </div>}
  </div>;
}
async function researchAccount(company, domain) {
  const prompt = `You are a B2B sales research assistant for a PEO (Professional Employer Organization) sales rep at Gusto, selling into SMBs. Research the company "${company}"${domain ? " (" + domain + ")" : ""}. Use the Apollo connector for authoritative firmographics, technographics, and key decision-maker contacts; use web search for recent "why now" signals (hiring surges, funding, expansion, leadership changes, benefits/compliance pain, M&A). For field-staff-heavy industries (construction, restaurants, logistics, healthcare, hospitality), cross-check and do not undercount headcount. Classify the sales motion as one of: "Upsell" (already a Gusto payroll customer), "Displacement" (on a competing PEO like ADP TotalSource, Insperity, TriNet, Justworks, Paychex Oasis), or "Likely Multi-vendor" (payroll + separate benefits broker). Return ONLY minified JSON (no prose, no markdown) of this exact shape: {"employees":<number|null>,"industry":"","hq":"","revenue":"","incumbent":"<current payroll/PEO/HR provider or ''>","motion":"Upsell|Displacement|Likely Multi-vendor","signals":["short why-now signal ...up to 4"],"valueProp":["specific value-prop talking point for this account ...up to 4"],"objections":[{"o":"likely objection","a":"crisp response"} ...up to 3],"benefitsPlay":["benefits/medical angle tailored to them ...up to 4"],"techStack":["detected tool name" ...up to 12],"outreach":{"email":"2-3 sentence cold email, natural human voice, no em-dashes","linkedin":"1-2 sentence connection note","call":"one-line phone opener"},"contacts":[{"name":"","title":"","email":"","phone":""}]}`;
  const res = await fetch("/api/crm-research", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, domain, prompt }),
  });
  if (!res.ok) throw new Error("Research unavailable (" + res.status + "). Confirm ANTHROPIC_API_KEY is set in Vercel.");
  const data = await res.json();
  if (!data.ok) throw new Error(data.message || "Research failed");
  return data.result;
}
const MOTION_COLOR = { "Upsell": "#0A8080", "Displacement": "#F45D48", "Likely Multi-vendor": "#D98B2B" };
const HR_TECH = ["gusto", "adp", "paychex", "oasis", "trinet", "insperity", "justworks", "rippling", "bamboohr", "namely", "paylocity", "paycor", "workday", "successfactors", "ukg", "dayforce", "zenefits", "sequoia", "vensure", "deel", "remote", "sap", "quickbooks", "bambee", "trnet"];
const isHRTech = (t) => HR_TECH.some((h) => (t || "").toLowerCase().includes(h));
function InfoCard({ label, value }) {
  return <div style={{ ...card, padding: "11px 13px" }}><div style={{ fontSize: 11, color: INK60, fontWeight: 600 }}>{label}</div><div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{value || "\u2014"}</div></div>;
}
function ListBlock({ title, items, color }) {
  if (!items || !items.length) return null;
  return <div style={{ marginTop: 14 }}>
    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{title}</div>
    <div style={{ ...card, overflow: "hidden" }}>
      {items.map((t, i) => <div key={i} style={{ display: "flex", gap: 9, padding: "9px 13px", borderTop: i ? `1px solid ${LINE}` : "none", fontSize: 13 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: color, marginTop: 6, flexShrink: 0 }} /><span>{t}</span></div>)}
    </div>
  </div>;
}
function CopyBox({ label, text }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: INK60 }}>{label}</div>
      <button onClick={() => { try { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {} }} style={{ border: `1px solid ${LINE}`, background: "#fff", borderRadius: 7, padding: "3px 9px", fontSize: 11, fontWeight: 600, cursor: "pointer", color: copied ? KALE : INK, fontFamily: "inherit" }}>{copied ? "Copied" : "Copy"}</button>
    </div>
    <div style={{ ...card, padding: "10px 12px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{text}</div>
  </div>;
}
function BriefTab({ d, set }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [sub, setSub] = useState("value");
  const b = d.brief;
  const run = async () => {
    if (!d.clientName) { setErr("Add a company name first (Manage account)."); return; }
    setErr(""); setLoading(true);
    try {
      const r = await researchAccount(d.clientName, domainFor(d));
      const brief = { employees: r.employees, industry: r.industry, hq: r.hq, revenue: r.revenue, incumbent: r.incumbent, motion: r.motion, signals: r.signals || [], valueProp: r.valueProp || [], objections: r.objections || [], benefitsPlay: r.benefitsPlay || [], techStack: r.techStack || [], outreach: r.outreach || {}, updatedAt: Date.now() };
      const patch = { ...d, brief };
      if (r.employees) patch.employees = r.employees;
      if (r.industry && !d.industry) patch.industry = r.industry;
      if (r.incumbent && !d.incumbent) patch.incumbent = r.incumbent;
      if (Array.isArray(r.contacts) && r.contacts.length) {
        const have = new Set((d.contacts || []).filter((x) => x.name).map((x) => x.name.toLowerCase()));
        const add = r.contacts.filter((x) => x.name && !have.has(x.name.toLowerCase()));
        const existing = (d.contacts || []).filter((x) => x.name);
        const merged = [...existing, ...add].slice(0, 8);
        patch.contacts = merged.length ? merged : d.contacts;
      }
      set(patch);
    } catch (e) { setErr((e && e.message) || "Research failed"); }
    setLoading(false);
  };
  const SUBS = [["value", "Value Prop"], ["objections", "Objection Handling"], ["benefits", "Benefits Play"], ["tech", "Tech Stack"], ["outreach", "Outreach"]];
  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <LogoAvatar name={d.clientName} domain={domainFor(d)} size={46} radius={12} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 800, fontSize: 18 }}>{d.clientName || "Untitled account"}</span>{b && b.motion ? <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: MOTION_COLOR[b.motion] || INK60, borderRadius: 20, padding: "3px 10px" }}>{b.motion}</span> : null}</div>
          <div style={{ fontSize: 12, color: INK60 }}>{domainFor(d) || "no website yet"}{b && b.updatedAt ? " \u00b7 researched " + new Date(b.updatedAt).toLocaleDateString() : ""}</div>
        </div>
      </div>
      <Btn onClick={run} disabled={loading}><Sparkles size={15} /> {loading ? "Researching\u2026" : b ? "Refresh research" : "Run Apollo + AI research"}</Btn>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: INK60, marginBottom: 12, fontWeight: 600 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: KALE }} /> Firmographics &amp; contacts powered by Apollo \u00b7 signals via live web search</div>
    {err && <div style={{ ...card, padding: 12, borderColor: "#f0cfca", background: "#FBEEEC", color: "#b4392b", fontSize: 13, marginBottom: 12 }}>{err}</div>}
    {!b && !loading && <div style={{ ...card, padding: "40px 20px", textAlign: "center", color: INK60 }}>
      <Sparkles size={30} style={{ color: KALE, marginBottom: 8 }} />
      <div style={{ fontWeight: 700, color: INK, marginBottom: 4 }}>Build the account brief</div>
      <div style={{ fontSize: 14, maxWidth: 460, margin: "0 auto 14px" }}>Pull firmographics, the tech stack, and decision-maker contacts from Apollo, plus recent "why now" signals from the web. It classifies the motion (Upsell / Displacement / Likely Multi-vendor) and drafts your value prop, objection handling, benefits play, and outreach \u2014 then auto-fills the deal.</div>
      <Btn onClick={run}><Sparkles size={15} /> Run Apollo + AI research</Btn>
      <div style={{ fontSize: 11, color: INK60, marginTop: 10, fontWeight: 600 }}>Powered by Apollo</div>
    </div>}
    {loading && <div style={{ ...card, padding: "30px 20px", textAlign: "center", color: INK60, fontSize: 14 }}>Pulling Apollo firmographics, tech stack, contacts, and live signals\u2026</div>}
    {b && <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
        <InfoCard label="Employees" value={b.employees ? Number(b.employees).toLocaleString() : "\u2014"} />
        <InfoCard label="Industry" value={b.industry} />
        <InfoCard label="HQ" value={b.hq} />
        <InfoCard label="Revenue" value={b.revenue} />
        <InfoCard label="Incumbent" value={b.incumbent} />
      </div>
      <ListBlock title={"Why now \u2014 signals"} items={b.signals} color={GUAVA} />
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", margin: "18px 0 14px" }}>
        {SUBS.map(([id, label]) => <button key={id} onClick={() => setSub(id)} style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${sub === id ? KALE : LINE}`, background: sub === id ? KALE : "#fff", color: sub === id ? "#fff" : INK, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>)}
      </div>
      {sub === "value" && (b.valueProp && b.valueProp.length ? <ListBlock title="Value prop for this account" items={b.valueProp} color={KALE} /> : <div style={{ color: INK60, fontSize: 13 }}>No value-prop points yet.</div>)}
      {sub === "objections" && (b.objections && b.objections.length ? <div style={{ ...card, overflow: "hidden" }}>{b.objections.map((o, i) => <div key={i} style={{ padding: "11px 13px", borderTop: i ? `1px solid ${LINE}` : "none" }}><div style={{ fontWeight: 700, fontSize: 13 }}>{o.o || o.objection}</div><div style={{ fontSize: 13, color: INK60, marginTop: 3 }}>{o.a || o.response}</div></div>)}</div> : <div style={{ color: INK60, fontSize: 13 }}>No objections drafted yet.</div>)}
      {sub === "benefits" && (b.benefitsPlay && b.benefitsPlay.length ? <ListBlock title="Benefits play" items={b.benefitsPlay} color={GUAVA} /> : <div style={{ color: INK60, fontSize: 13 }}>No benefits play yet.</div>)}
      {sub === "tech" && (() => {
        const tech = b.techStack || [];
        const hr = tech.filter(isHRTech), rest = tech.filter((t) => !isHRTech(t));
        if (!tech.length) return <div style={{ color: INK60, fontSize: 13 }}>No technologies detected in Apollo for this company.</div>;
        const chip = (t, hot) => <span key={t} style={{ fontSize: 12.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: hot ? KALE20 : "#fff", color: hot ? KALE : INK, border: `1px solid ${hot ? KALE20 : LINE}` }}>{t}</span>;
        return <div>
          {hr.length ? <div style={{ marginBottom: 12 }}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 7 }}>HR / payroll / benefits stack</div><div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{hr.map((t) => chip(t, true))}</div></div> : null}
          {rest.length ? <div><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 7 }}>Rest of the stack</div><div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{rest.map((t) => chip(t, false))}</div></div> : null}
        </div>;
      })()}
      {sub === "outreach" && <div style={{ marginTop: 2 }}>
        <CopyBox label="Cold email" text={b.outreach && b.outreach.email} />
        <CopyBox label="LinkedIn connection note" text={b.outreach && b.outreach.linkedin} />
        <CopyBox label="Phone opener" text={b.outreach && b.outreach.call} />
        {(!b.outreach || (!b.outreach.email && !b.outreach.linkedin && !b.outreach.call)) && <div style={{ color: INK60, fontSize: 13 }}>No outreach drafted yet.</div>}
      </div>}
      <div style={{ fontSize: 11, color: INK60, marginTop: 14, fontStyle: "italic" }}>Apollo + AI research is a starting point \u2014 verify headcount and contacts before outreach.</div>
    </div>}
  </div>;
}
function ManagePanel({ d, set, c, onClose }) {
  const fld = (k, label, opts = {}) => <Field label={label} hint={opts.hint}>{opts.text ? <Txt v={d[k] || ""} on={(v) => set({ ...d, [k]: v })} /> : <Num v={d[k]} on={(v) => set({ ...d, [k]: v })} step={opts.step || 1} />}</Field>;
  return <div style={{ position: "fixed", inset: 0, background: "rgba(34,37,37,.35)", zIndex: 60, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
    <div onClick={(e) => e.stopPropagation()} style={{ width: "min(580px,96vw)", height: "100%", background: OFF, overflowY: "auto", padding: "16px 18px 70px", boxShadow: "-8px 0 30px rgba(0,0,0,.14)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: OFF, padding: "4px 0 12px", zIndex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Manage account</div>
        <Btn kind="ghost" onClick={onClose}><X size={16} /> Close</Btn>
      </div>
      <div style={{ ...card, padding: 14, background: PEACH, borderColor: GUAVA20, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: 12, color: INK60 }}>Annual Contract Value</div><div style={{ fontSize: 22, fontWeight: 800, color: GUAVA }}>{money(c.acv)}</div></div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: stageInfo(d.stage).c, borderRadius: 20, padding: "4px 12px" }}>{d.stage}</span>
      </div>
      <div style={grid2}>
        <Field label="Stage"><Sel v={d.stage} on={(x) => set({ ...d, stage: x })} opts={STAGES.map((s) => s.name)} /></Field>
        {isOpen(d.stage) ? <Field label="Forecast category" hint={FORECAST_DEFS[d.forecast]}><Sel v={d.forecast} on={(x) => set({ ...d, forecast: x })} opts={FORECAST_CATS} /></Field>
          : isLost(d.stage) ? <Field label="Closed-lost reason"><Sel v={d.lostReason || LOSS_REASONS[0]} on={(x) => set({ ...d, lostReason: x })} opts={LOSS_REASONS} /></Field>
            : <Field label="Status"><div style={{ ...inputStyle, background: OFF }}>Won</div></Field>}
        <Field label="Expected close (month)"><input type="month" value={d.expectedClose || ""} onChange={(e) => set({ ...d, expectedClose: e.target.value })} style={inputStyle} /></Field>
        <Field label="Follow-up / next meeting"><input type="date" value={d.nextStep || ""} onChange={(e) => set({ ...d, nextStep: e.target.value })} style={inputStyle} /></Field>
      </div>
      <SectionTitle>Next steps to win</SectionTitle>
      <Field label="Champions, pain, and what it'll take to close"><textarea value={d.winPlan || ""} onChange={(e) => set({ ...d, winPlan: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} /></Field>
      <SectionTitle>Account</SectionTitle>
      <div style={grid2}>{fld("clientName", "Company name", { text: true })}{fld("employees", "Employee count")}{fld("industry", "Industry", { text: true })}{fld("incumbent", "Current PEO / payroll", { text: true })}{fld("leadSource", "Lead source", { text: true })}{fld("preparedBy", "Owner / rep", { text: true })}</div>
      <SectionTitle>Activity</SectionTitle>
      <ActivityTab d={d} set={set} />
    </div>
  </div>;
}
function Editor({ data, setData, onBack, onSave, saved, onPrint }) {
  const [primary, setPrimary] = useState("Brief");
  const [qtab, setQtab] = useState("Assumptions");
  const [manage, setManage] = useState(false);
  const d = data, set = setData;
  const c = useMemo(() => compute(d), [d]);
  const field = (k, label, opts = {}) => <Field label={label} hint={opts.hint}>{opts.pct ? <Num v={d[k]} on={(v) => set({ ...d, [k]: v })} pct step={0.1} /> : opts.text ? <Txt v={d[k]} on={(v) => set({ ...d, [k]: v })} /> : <Num v={d[k]} on={(v) => set({ ...d, [k]: v })} step={opts.step || 1} />}</Field>;
  const PRIMARY = [["Brief", "Account Brief"], ["Contacts", "Contacts"], ["Analysis", "Return on Analysis"]];
  const QTABS = ["Assumptions", "Medical", "Dental", "Vision", "Workers' Comp", "Gusto Invoice", "Soft-Cost", "Summary"];
  return <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px 60px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 14px", flexWrap: "wrap", gap: 10 }}>
      <Btn kind="ghost" onClick={onBack}><ChevronLeft size={16} /> Pipeline</Btn>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flex: 1, minWidth: 160 }}><LogoAvatar name={d.clientName} domain={domainFor(d)} size={30} radius={8} /><span style={{ fontWeight: 800, fontSize: 18 }}>{d.clientName || "Untitled account"}</span><span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: stageInfo(d.stage).c, borderRadius: 20, padding: "3px 10px" }}>{d.stage}</span></div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn kind="kale" onClick={() => setManage(true)}><Users size={16} /> Manage account</Btn>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: saved ? INK60 : KALE, padding: "9px 4px", minWidth: 78, justifyContent: "center" }}>{saved ? <><Check size={15} /> Saved</> : <><Save size={15} /> Saving</>}</span>
        <Btn kind="ghost" onClick={onPrint}><FileText size={16} /> PDF</Btn>
      </div>
    </div>
    <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: `1px solid ${LINE}` }}>
      {PRIMARY.map(([v, l]) => <button key={v} onClick={() => setPrimary(v)} style={{ padding: "10px 16px", border: "none", borderBottom: `3px solid ${primary === v ? GUAVA : "transparent"}`, background: "transparent", color: primary === v ? INK : INK60, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginBottom: -1 }}>{l}</button>)}
    </div>
    {primary === "Brief" && <BriefTab d={d} set={set} />}
    {primary === "Contacts" && <ContactTab d={d} set={set} />}
    {primary === "Analysis" && <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {QTABS.map((t) => <button key={t} onClick={() => setQtab(t)} style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${qtab === t ? KALE : LINE}`, background: qtab === t ? KALE : "#fff", color: qtab === t ? "#fff" : INK, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: qtab === "Summary" ? "1fr" : "1.55fr 1fr", gap: 22, alignItems: "start" }}>
        <div>
          {qtab === "Assumptions" && <div>
            <SectionTitle>Engagement</SectionTitle>
            <div style={grid2}>{field("clientName", "Client / prospect name", { text: true })}{field("preparedBy", "Prepared by", { text: true })}{field("proposalDate", "Proposal date", { text: true })}{field("provider", "Proposed provider", { text: true })}</div>
            <SectionTitle>Census & payroll</SectionTitle>
            <div style={grid2}>{field("employees", "Eligible employees (WSEs)")}{field("payroll", "Annual gross payroll")}</div>
            <SectionTitle>Contribution & trend assumptions</SectionTitle>
            <div style={grid3}>{field("medER", "Medical ER %", { pct: true })}{field("denER", "Dental ER %", { pct: true })}{field("visER", "Vision ER %", { pct: true })}{field("curTrend", "Current med trend", { pct: true })}{field("propTrend", "Proposed med trend", { pct: true })}</div>
            <SectionTitle>Admin & other</SectionTitle>
            <div style={grid3}>{field("proposedPEPM", "Proposed PEO fee (PEPM)")}{field("implFee", "One-time implementation fee")}{field("lifeCur", "Life/STD/LTD \u2014 current")}{field("lifeProp", "Life/STD/LTD \u2014 proposed")}</div>
          </div>}
          {qtab === "Medical" && <BenefitEditor d={d} set={set} kind="med" plans={MED_PLANS} rows={MED_ROWS} erKey="medER" totals={{ tc: c.medTC, tp: c.medTP }} advanced />}
          {qtab === "Dental" && <BenefitEditor d={d} set={set} kind="den" plans={DEN_PLANS} rows={DEN_ROWS} erKey="denER" totals={{ tc: c.denTC, tp: c.denTP }} />}
          {qtab === "Vision" && <BenefitEditor d={d} set={set} kind="vis" plans={VIS_PLANS} rows={VIS_ROWS} erKey="visER" totals={{ tc: c.visTC, tp: c.visTP }} />}
          {qtab === "Workers' Comp" && <div>
            <SectionTitle>Workers' compensation (8810 Clerical class shown)</SectionTitle>
            <div style={grid2}>
              <Field label="Annual payroll"><Num v={d.wc.payroll} on={(v) => set({ ...d, wc: { ...d.wc, payroll: v } })} /></Field><div />
              <Field label="Current rate / $100"><Num v={d.wc.curRate} on={(v) => set({ ...d, wc: { ...d.wc, curRate: v } })} step={0.01} /></Field>
              <Field label="Current experience mod"><Num v={d.wc.curMod} on={(v) => set({ ...d, wc: { ...d.wc, curMod: v } })} step={0.01} /></Field>
              <Field label="Proposed rate / $100"><Num v={d.wc.propRate} on={(v) => set({ ...d, wc: { ...d.wc, propRate: v } })} step={0.01} /></Field>
              <Field label="Proposed experience mod"><Num v={d.wc.propMod} on={(v) => set({ ...d, wc: { ...d.wc, propMod: v } })} step={0.01} /></Field>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <div style={{ ...card, flex: 1, padding: 14 }}><div style={{ fontSize: 12, color: INK60 }}>Current premium</div><div style={{ fontWeight: 800, fontSize: 20 }}>{money(c.wcC)}</div></div>
              <div style={{ ...card, flex: 1, padding: 14 }}><div style={{ fontSize: 12, color: INK60 }}>Proposed premium</div><div style={{ fontWeight: 800, fontSize: 20, color: KALE }}>{money(c.wcP)}</div></div>
            </div>
          </div>}
          {qtab === "Gusto Invoice" && <InvoiceEditor d={d} set={set} adminC={c.adminC} />}
          {qtab === "Soft-Cost" && <div>
            <SectionTitle>Administrative time \u2014 current state</SectionTitle>
            <div style={grid3}>
              <Field label="Hours / week on HR & payroll" hint="Owner + admin staff"><Num v={d.soft.hours} on={(v) => set({ ...d, soft: { ...d.soft, hours: v } })} step={0.5} /></Field>
              <Field label="Blended loaded hourly cost"><Num v={d.soft.rate} on={(v) => set({ ...d, soft: { ...d.soft, rate: v } })} /></Field>
              <Field label="Weeks per year"><Num v={d.soft.weeks} on={(v) => set({ ...d, soft: { ...d.soft, weeks: v } })} /></Field>
            </div>
            <SectionTitle>Projected reduction with a PEO</SectionTitle>
            <Field label="Estimated admin-time reduction" hint="NAPEO/Paychex: PEOs cut payroll admin time up to ~50%"><Num v={d.soft.reduction} on={(v) => set({ ...d, soft: { ...d.soft, reduction: v } })} pct step={1} /></Field>
            <div style={{ ...card, padding: 16, background: PEACH, borderColor: GUAVA20, marginTop: 6 }}>
              <div style={{ fontSize: 12, color: INK60 }}>Annual reclaimed-time value (soft-cost savings)</div>
              <div style={{ fontWeight: 800, fontSize: 26, color: GUAVA }}>{money(c.soft)}</div>
              <div style={{ fontSize: 11, color: INK60, marginTop: 6 }}>NAPEO/McBassi 2019: avg $1,775/EE/yr = {money(1775 * d.employees)} \u00b7 27.2% ROI. Shown separately from hard-dollar savings.</div>
            </div>
          </div>}
          {qtab === "Summary" && <Results c={c} d={d} />}
        </div>
        {qtab !== "Summary" && <div style={{ position: "sticky", top: 16 }}><div style={{ fontSize: 12, fontWeight: 700, color: INK60, marginBottom: 8, textTransform: "uppercase", letterSpacing: .4 }}>Live results</div><Results c={c} d={d} /></div>}
      </div>
    </div>}
    {manage && <ManagePanel d={d} set={set} c={c} onClose={() => setManage(false)} />}
  </div>;
}
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };
const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 };

function InvoiceEditor({ d, set, adminC }) {
  const groups = [...new Set(d.invoice.map((l) => l.g))];
  const upd = (idx, field, v) => { const inv = d.invoice.map((l, i) => i === idx ? { ...l, [field]: v } : l); set({ ...d, invoice: inv }); };
  return <div>
    <SectionTitle>Current Gusto invoice — every billable line is absorbed by the PEO</SectionTitle>
    {groups.map((g) => <div key={g} style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: KALE, margin: "6px 0" }}>{g}</div>
      <div style={{ ...card, overflow: "hidden" }}>
        {d.invoice.map((l, i) => l.g === g && <div key={i} style={{ display: "grid", gridTemplateColumns: "2.2fr .8fr .9fr 1fr", alignItems: "center", borderTop: i && d.invoice[i - 1] && d.invoice[i - 1].g === g ? `1px solid ${LINE}` : "none" }}>
          <div style={{ padding: "6px 12px", fontSize: 13 }}>{l.n}<div style={{ fontSize: 10, color: INK60 }}>{l.basis}</div></div>
          <div style={{ padding: "4px 6px" }}>{l.perEE ? <div style={{ textAlign: "center", fontSize: 13, color: INK60 }}>{d.employees}</div> : <Num v={l.qty} on={(v) => upd(i, "qty", v)} />}</div>
          <div style={{ padding: "4px 6px" }}><Num v={l.rate} on={(v) => upd(i, "rate", v)} step={0.01} /></div>
          <div style={{ padding: "6px 12px", textAlign: "right", fontSize: 13 }}>{money((l.perEE ? d.employees : l.qty) * l.rate * (l.oneTime ? 1 : 12))}</div>
        </div>)}
      </div>
    </div>)}
    <div style={{ ...card, padding: 14, background: KALE, color: "#fff", display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontWeight: 700 }}>Total current Gusto spend (→ Included under PEO)</span><span style={{ fontWeight: 800 }}>{money(adminC)}</span>
    </div>
  </div>;
}

/* ============================ app ============================ */
function VantageApp() {
  const [view, setView] = useState("dashboard");
  const [index, setIndex] = useState([]);
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => { (async () => {
    let idx = await readIndex();
    let dirty = false;
    const mkEntry = (rec) => { const cc = compute(rec); return { id: rec.id, clientName: rec.clientName, provider: rec.provider, updatedAt: rec.updatedAt, acv: cc.acv, stage: rec.stage, forecast: rec.forecast, lostReason: rec.lostReason, expectedClose: rec.expectedClose, nextStep: rec.nextStep, contact: (rec.contacts && rec.contacts[0] && rec.contacts[0].name) || "", domain: domainFor(rec) }; };
    // first-run: seed sample deals (once; respects later deletes via the flag)
    let seeded = false;
    try { const f = LS.get("peo:seeded"); seeded = !!(f && f.value); } catch { seeded = false; }
    if (idx.length === 0 && !seeded) {
      const samples = buildSamples();
      idx = [];
      for (const s of samples) { await writeClient(s); idx.push(mkEntry(s)); }
      try { LS.set("peo:seeded", "1"); } catch {}
      dirty = true;
    } else {
      // migrate older entries to include deal + ACV fields
      let changed = false;
      idx = await Promise.all(idx.map(async (e) => {
        if (e.acv !== undefined && e.stage && e.contact !== undefined) return e;
        changed = true;
        const full = await readClient(e.id);
        if (!full) return { ...e, acv: 0, stage: "Meeting Scheduled", forecast: "Pipeline", lostReason: "" };
        const up = { ...full, stage: full.stage || "Meeting Scheduled", forecast: full.forecast || "Pipeline", lostReason: full.lostReason || "", expectedClose: full.expectedClose || new Date().toISOString().slice(0, 7), nextStep: full.nextStep || "", industry: full.industry || "", incumbent: full.incumbent || "", leadSource: full.leadSource || "", domain: full.domain || "", contacts: full.contacts || [{ name: "", title: "", email: "", phone: "" }], activities: full.activities || [], winPlan: full.winPlan || "", brief: full.brief || null };
        await writeClient(up);
        return mkEntry(up);
      }));
      if (changed) dirty = true;
    }
    // one-time: load the assigned starter book (additive, de-duped by domain)
    let starterDone = false;
    try { const f = LS.get("polaris:starter:v1"); starterDone = !!(f && f.value); } catch { starterDone = false; }
    if (!starterDone) {
      const have = new Set(idx.map((e) => (e.domain || "").toLowerCase()).filter(Boolean));
      const adds = buildStarterBook().filter((s) => !have.has((s.domain || "").toLowerCase()));
      for (const s of adds) { await writeClient(s); idx.push(mkEntry(s)); }
      try { LS.set("polaris:starter:v1", "1"); } catch {}
      if (adds.length) dirty = true;
    }
    if (dirty) await writeIndex(idx);
    setIndex(idx); setLoading(false);
  })(); }, []);
  useEffect(() => { if (data) setSaved(false); }, [data]);

  const indexEntry = (rec) => { const c = compute(rec); return { id: rec.id, clientName: rec.clientName, provider: rec.provider, updatedAt: rec.updatedAt, acv: c.acv, stage: rec.stage, forecast: rec.forecast, lostReason: rec.lostReason, expectedClose: rec.expectedClose, nextStep: rec.nextStep, contact: (rec.contacts && rec.contacts[0] && rec.contacts[0].name) || "", domain: domainFor(rec) }; };

  const save = useCallback(async () => {
    if (!data) return;
    const rec = { ...data, updatedAt: Date.now() };
    await writeClient(rec);
    const idx = [...index.filter((x) => x.id !== rec.id), indexEntry(rec)];
    setIndex(idx); await writeIndex(idx); setSaved(true);
  }, [data, index]);
  // autosave: debounce every change so the rep never clicks save (defined after `save` to avoid TDZ)
  useEffect(() => {
    if (!data || saved) return;
    const t = setTimeout(() => { save(); }, 700);
    return () => clearTimeout(t);
  }, [data, saved, save]);

  // quick stage/forecast change straight from the pipeline board (no full open)
  const quickUpdate = async (id, patch) => {
    const full = await readClient(id); if (!full) return;
    const up = { ...full, ...patch, updatedAt: Date.now() };
    await writeClient(up);
    const idx = [...index.filter((x) => x.id !== id), indexEntry(up)];
    setIndex(idx); await writeIndex(idx);
    if (data && data.id === id) setData(up);
  };

  const openClient = async (id) => { const c = await readClient(id); if (c) { setData(c); setSaved(true); setView("editor"); } };
  const [pendingPrint, setPendingPrint] = useState(false);
  const openAndPrint = async (id) => { const c = await readClient(id); if (c) { setData(c); setSaved(true); setView("editor"); setPendingPrint(true); } };
  useEffect(() => {
    if (pendingPrint && data) {
      const t = setTimeout(() => { doPrint(); setPendingPrint(false); }, 300);
      return () => clearTimeout(t);
    }
  }, [pendingPrint, data]);
  const newClientFile = () => { const c = newClient(); setData(c); setSaved(false); setView("editor"); };
  const addProspect = useCallback(async (p) => {
    const c = newClient();
    const rec = { ...c,
      clientName: p.name || "",
      industry: p.industry || "",
      employees: p.ees || c.employees,
      stage: "Assigned", forecast: "Pipeline", leadSource: "PEO Prospecting Agent",
      preparedBy: "Gabe",
      winPlan: [p.states ? "Location: " + p.states : "", p.trigger ? "Why now: " + p.trigger : ""].filter(Boolean).join("\n"),
      contacts: [{ name: p.contact || "", title: "", email: "", phone: p.phone || "" }],
      updatedAt: Date.now(),
    };
    await writeClient(rec);
    const idx = [...index.filter((x) => x.id !== rec.id), indexEntry(rec)];
    setIndex(idx); await writeIndex(idx);
    return true;
  }, [index]);
  const removeClient = async (id) => { await deleteClientStore(id); const idx = index.filter((x) => x.id !== id); setIndex(idx); await writeIndex(idx); };
  const doPrint = async () => {
    await save();
    const el = document.querySelector(".packet");
    if (!el) return;
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + ((data.clientName || "Client") + " — PEO Packet") +
      '</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:20px;color:' + INK + ';-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      'table{border-collapse:collapse}.pbreak{page-break-after:always}@page{size:letter;margin:13mm}</style></head><body>' +
      el.innerHTML + '<scr' + 'ipt>window.onload=function(){setTimeout(function(){window.print();},350);};</scr' + 'ipt></body></html>';
    const w = window.open("", "_blank");
    if (w && w.document) { w.document.open(); w.document.write(html); w.document.close(); }
    else {
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      const a = document.createElement("a"); a.href = url; a.download = (data.clientName || "client").replace(/[^\w-]+/g, "-") + "-PEO-packet.html"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  };

  const calc = data ? compute(data) : null;

  return <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: INK, background: OFF, minHeight: "100vh" }}>
    <style>{`
      * { box-sizing: border-box; }
      input:focus, select:focus { border-color: ${KALE} !important; }
      .packet { display: none; }
      @media print {
        @page { size: letter; margin: 14mm; }
        .app-chrome { display: none !important; }
        .packet { display: block !important; }
        .pbreak { page-break-after: always; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `}</style>

    <div className="app-chrome">
      <div style={{ borderBottom: `1px solid ${LINE}`, background: "#fff", marginBottom: 22 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 800, fontSize: 22, color: GUAVA }}>gusto</span>
            <span style={{ borderLeft: `1px solid ${LINE}`, paddingLeft: 10, display: "inline-flex", alignItems: "baseline", gap: 7 }}>
              <span style={{ fontWeight: 800, fontSize: 17, color: INK, letterSpacing: -0.2 }}>{APP_NAME}</span>
            </span>
          </div>
          <span style={{ fontSize: 9, fontStyle: "italic", color: GUAVA, fontWeight: 700, textAlign: "right" }}>FOR ILLUSTRATIVE PURPOSES ONLY —<br />NOT AN OFFICIAL GUSTO PRODUCT OR TOOL</span>
        </div>
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 60, color: INK60 }}>Loading your client files…</div>
        : view === "dashboard" ? <Dashboard index={index} onOpen={openClient} onNew={newClientFile} onDelete={removeClient} onQuick={quickUpdate} onAddProspect={addProspect} onPrintDeal={openAndPrint} />
          : <Editor data={data} setData={setData} onBack={() => setView("dashboard")} onSave={save} saved={saved} onPrint={doPrint} />}
    </div>

    {data && calc && <Packet d={data} c={calc} />}
  </div>;
}

/* ===================== END VANTAGE ===================== */

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [termKey, setTermKey] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [tab, setTab] = useState("about");
  // ---- per-person view tracking (reads ?v=name, times each tab, emails a summary) ----
  const trackRef = React.useRef({ visitor: "", current: "about", since: 0, totals: {}, opened: false, sent: false });
  useEffect(() => {
    if (!unlocked) return;
    let v = "";
    try { v = new URLSearchParams(window.location.search).get("v") || ""; } catch {}
    const tr = trackRef.current;
    tr.visitor = (v || "anonymous").slice(0, 60);
    tr.current = tab; tr.since = Date.now();
    const post = (event) => {
      try {
        const tabsArr = Object.keys(tr.totals).map((id) => {
          const meta = TABS.find((t) => t.id === id);
          return { label: meta ? meta.label : id, sec: Math.round(tr.totals[id] / 1000) };
        }).filter((x) => x.sec > 0).sort((a, b) => b.sec - a.sec);
        const totalSec = tabsArr.reduce((s, x) => s + x.sec, 0);
        const payload = JSON.stringify({ visitor: tr.visitor, event, tabs: tabsArr, totalSec, ua: navigator.userAgent, ref: document.referrer });
        if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
        else fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
      } catch {}
    };
    if (!tr.opened) { tr.opened = true; post("open"); }
    const flush = () => { const now = Date.now(); tr.totals[tr.current] = (tr.totals[tr.current] || 0) + (now - tr.since); tr.since = now; };
    const onHide = () => { if (document.visibilityState === "hidden") { flush(); if (!tr.sent) { tr.sent = true; post("session"); setTimeout(() => { tr.sent = false; }, 30000); } } };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", () => { flush(); post("session"); });
    return () => { document.removeEventListener("visibilitychange", onHide); };
  }, [unlocked]);
  // accumulate time when switching tabs
  useEffect(() => {
    const tr = trackRef.current;
    if (!tr.visitor) return;
    const now = Date.now();
    tr.totals[tr.current] = (tr.totals[tr.current] || 0) + (now - tr.since);
    tr.current = tab; tr.since = now;
  }, [tab]);
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
              Five modules: co-employment fundamentals, the PEO operating model, pricing mechanics,
              the Gusto PEO and our market, and the sales process. Pass each certification quiz at 80% to
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
          <div className="path-wrap">
            <span className="src-tag" style={{ textAlign: "center" }}>START TRAINING AS</span>
            <div className="lesson-nav" style={{ justifyContent: "center", marginBottom: 0 }}>
              {PATHS.map((p) => (
                <button
                  key={p.id}
                  className={"lesson-pill" + (selectedPath === p.id ? " active" : "")}
                  onClick={() => setSelectedPath(selectedPath === p.id ? null : p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {selectedPath && (() => {
              const p = PATHS.find((x) => x.id === selectedPath);
              return (
                <div className="callout" style={{ marginTop: 14 }}>
                  <span className="tag">YOUR ROUTE: {p.label.toUpperCase()}</span>
                  {p.blurb}{" "}
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, display: "block", marginTop: 8 }}>
                    {p.route.map((id) => COURSE.find((m) => m.id === id).num).join(" → ")}
                  </span>
                </div>
              );
            })()}
          </div>
          {COURSE.map((m) => {
            const pr = progress[m.id];
            return (
              <button key={m.id} className="ledger-row" onClick={() => setCourseView(m.id)}>
                <span className="row-num">{m.num}</span>
                <span className="row-main">
                  <p className="row-title">
                    {m.title}
                    {selectedPath && PATHS.find((x) => x.id === selectedPath).route.includes(m.id) && (
                      <span className="path-chip">STEP {PATHS.find((x) => x.id === selectedPath).route.indexOf(m.id) + 1}</span>
                    )}
                  </p>
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
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button className="btn ghost" onClick={() => setTermKey("__LEGEND__")}>Key terms & acronyms →</button>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 8 }}>Every dotted-underline term in the lessons is tappable, or browse the full glossary here.</p>
          </div>
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
      <TermContext.Provider value={(k) => setTermKey(k)}>
      {termKey && <TermPopup key={termKey} termKey={termKey} onClose={() => setTermKey(null)} />}
      {showLetter && <WelcomeLetter onClose={() => setShowLetter(false)} />}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brandline">
            <span className="wordmark">Gabriel Revnew <span className="x">×</span> Gusto</span>
            <span className="eyebrow">HEAD OF PEO SALES · PREPARED FOR THE GUSTO TEAM</span>
          </div>
          <nav className="tabbar">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={"tab" + (tab === t.id ? " active" : "")}
                onClick={(e) => { setTab(t.id); e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {tab === "about" && <AboutTab />}
      {tab === "course" && renderCourse()}
      {tab === "landscape" && <LandscapeTab />}
      {tab === "swot" && <SwotTab />}
      {tab === "construct" && <ConstructTab />}
      {tab === "gtm" && <GTMTab />}
      {tab === "keys" && <KeysTab />}
      {tab === "plan" && <PlanTab />}
      {tab === "resources" && <ResourcesTab onTerm={(k) => setTermKey(k)} />}
      {tab === "crm" && <CrmTab />}

      <div className="footer">
        <span className="eyebrow">BUILT BY GABRIEL REVNEW · NOT AN OFFICIAL GUSTO PROPERTY · v2.0</span>
      </div>
      </TermContext.Provider>
    </div>
  );
}
