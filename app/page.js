'use client';

import { useState, useEffect, useCallback } from 'react';

const RESONATED_TAGS = ['Cost savings', 'Better benefits', 'Workers comp bundling', 'Compliance relief', 'Time/admin savings', 'Dedicated support', 'Scalability'];

const GUARDRAILS = [
  ['x', "Don't fabricate numbers — keep savings illustrative until formally quoted."],
  ['x', "Only cite approved customer stories below — never invent one."],
  ['check', 'Lead with fit and value, not price.'],
  ['check', "Know when to walk away — a bad-fit account hurts the comp book."],
];

const scoreColor = (s) => (s == null ? 'var(--muted)' : s >= 75 ? 'var(--good)' : s >= 60 ? 'var(--good2)' : s >= 40 ? 'var(--warn)' : 'var(--bad)');
const outcomeColor = (o) => (o === 'Won' ? 'var(--good)' : o === 'Lost' ? 'var(--bad)' : 'var(--muted)');
const motionColor = (m) => (m === 'Displacement' ? 'var(--warn)' : m === 'Greenfield' ? 'var(--muted)' : 'var(--kale)');

function normalizeDomain(input) {
  if (!input) return '';
  let d = String(input).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  return d.split('/')[0].split('?')[0].split('#')[0];
}

function parseList(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const first = lines[0].toLowerCase();
  const looksCsv = first.includes(',') && /(domain|website|url|company|name)/.test(first);
  if (looksCsv) {
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const di = headers.findIndex((h) => /(domain|website|url)/.test(h));
    const ni = headers.findIndex((h) => /(name|company)/.test(h));
    return lines.slice(1).map((row) => {
      const cells = row.split(',').map((c) => c.trim());
      return { name: ni >= 0 ? cells[ni] : undefined, domain: normalizeDomain(di >= 0 ? cells[di] : cells[0]) };
    }).filter((c) => c.domain);
  }
  return lines.map((line) => {
    if (line.includes(',')) {
      const parts = line.split(',').map((p) => p.trim());
      const domPart = parts.find((p) => /\.[a-z]{2,}/.test(p) && !p.includes(' ')) || parts[parts.length - 1];
      const namePart = parts.find((p) => p !== domPart);
      return { name: namePart, domain: normalizeDomain(domPart) };
    }
    return { domain: normalizeDomain(line) };
  }).filter((c) => c.domain);
}

export default function Page() {
  const [tab, setTab] = useState('playbook');
  const [listText, setListText] = useState('');
  const [scoring, setScoring] = useState(false);
  const [results, setResults] = useState(null);
  const [apolloOn, setApolloOn] = useState(true);
  const [jobsOn, setJobsOn] = useState(true);
  const [demo, setDemo] = useState(false);
  const [searchCo, setSearchCo] = useState('');
  const [researching, setResearching] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [briefCache, setBriefCache] = useState({});
  const [contactsCache, setContactsCache] = useState({});
  const [touches, setTouches] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState('');

  const [brief, setBrief] = useState(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefTab, setBriefTab] = useState('value');

  const [emailData, setEmailData] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const [outcome, setOutcome] = useState('');
  const [resonated, setResonated] = useState([]);
  const [notes, setNotes] = useState('');
  const [savingFb, setSavingFb] = useState(false);
  const [fbSaved, setFbSaved] = useState(false);

  const [dealsData, setDealsData] = useState(null);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [partnerLoading, setPartnerLoading] = useState(false);

  const [coachOpen, setCoachOpen] = useState(false);
  const [coachMsgs, setCoachMsgs] = useState([]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  const resetFeedback = () => { setOutcome(''); setResonated([]); setNotes(''); setFbSaved(false); };
  const toggleTag = (t) => { setResonated((r) => (r.includes(t) ? r.filter((x) => x !== t) : [...r, t])); setFbSaved(false); };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setListText(String(reader.result || ''));
    reader.readAsText(f);
  };

  const keyOf = (r) => (r?.domain || r?.name || '').toString().toLowerCase().trim();

  // Persistence: load once on mount, save on change (this is the deployed app, not a sandbox).
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pdp_state');
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.results)) setResults(s.results);
        if (s.briefCache) setBriefCache(s.briefCache);
        if (s.contactsCache) setContactsCache(s.contactsCache);
        if (s.touches) setTouches(s.touches);
        if (s.selectedKey) setSelectedKey(s.selectedKey);
        if (typeof s.demo === 'boolean') setDemo(s.demo);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('pdp_state', JSON.stringify({ results, briefCache, contactsCache, touches, selectedKey, demo })); } catch {}
  }, [hydrated, results, briefCache, contactsCache, touches, selectedKey, demo]);

  const clearAll = () => {
    setResults(null); setBriefCache({}); setContactsCache({}); setTouches({});
    setSelectedKey(null); setBrief(null); setEmailData(null); setDemo(false);
    try { localStorage.removeItem('pdp_state'); } catch {}
  };

  const score = async () => {
    const companies = parseList(listText);
    setScoring(true); setError('');
    try {
      const res = await fetch('/api/score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companies }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scoring failed');
      const batch = data.results || [];
      const keys = new Set(batch.map(keyOf));
      setResults((prev) => [...batch, ...((prev || []).filter((x) => !keys.has(keyOf(x))))]);
      setApolloOn(data.apolloEnabled);
      setJobsOn(data.jobsEnabled);
      setDemo(!!data.demo);
    } catch (e) { setError(e.message); } finally { setScoring(false); }
  };

  const researchCompany = async () => {
    const q = searchCo.trim();
    if (!q || researching) return;
    setResearching(true); setError('');
    try {
      const isDomain = /\.[a-z]{2,}/i.test(q) && !q.includes(' ');
      const res = await fetch('/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(isDomain ? { domain: q } : { company: q }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Research failed');
      const item = data.result;
      const k = keyOf(item);
      setResults((prev) => [item, ...((prev || []).filter((x) => keyOf(x) !== k))]);
      setSearchCo('');
      openRow(item);
    } catch (e) { setError(e.message); } finally { setResearching(false); }
  };

  const loadContacts = async (r) => {
    const k = keyOf(r);
    if (contactsCache[k]) return;
    try {
      const res = await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: r.name, domain: r.domain, industry: r.industry, employees: r.employees }) });
      const data = await res.json();
      if (res.ok) setContactsCache((prev) => ({ ...prev, [k]: data.contacts || [] }));
    } catch {}
  };

  const openRow = async (r) => {
    const k = keyOf(r);
    setSelectedKey(k); resetFeedback(); setError(''); setBriefTab('value');
    loadContacts(r);
    const cached = briefCache[k];
    if (cached?.brief) { setBrief(cached.brief); setEmailData(cached.emailData || null); setBriefLoading(false); return; }
    setBrief(null); setEmailData(null); setBriefLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: r.name, employees: r.employees, state: r.state, industry: r.industry, current: 'Payroll-only / unknown', enrichment: r.org, heuristicScore: r.score, incumbent: r.incumbent, openings: r.openings, partner: r.partner }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Brief failed');
      setBrief(data);
      setBriefCache((prev) => ({ ...prev, [k]: { ...(prev[k] || {}), brief: data } }));
    } catch (e) { setError(e.message); } finally { setBriefLoading(false); }
  };

  const logTouch = (compKey, contact, type) => {
    const entry = { id: Date.now(), type, contact: contact?.name || '', title: contact?.title || '', at: new Date().toISOString() };
    setTouches((prev) => ({ ...prev, [compKey]: [entry, ...(prev[compKey] || [])] }));
  };

  const saveFeedback = async () => {
    if (!brief?._recordId) return;
    setSavingFb(true);
    try {
      const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: brief._recordId, outcome, whatWorked: resonated, notes }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setFbSaved(true);
    } catch (e) { setError(e.message); } finally { setSavingFb(false); }
  };

  const loadDeals = useCallback(async () => {
    setDealsLoading(true);
    try { const res = await fetch('/api/deals'); setDealsData(await res.json()); }
    catch { setDealsData({ enabled: false, deals: [], stats: null }); }
    finally { setDealsLoading(false); }
  }, []);
  useEffect(() => { if (tab === 'deals') loadDeals(); }, [tab, loadDeals]);

  const loadPartners = useCallback(async () => {
    setPartnerLoading(true);
    try { const res = await fetch('/api/partners'); setPartnerData(await res.json()); }
    catch { setPartnerData({ partners: [] }); }
    finally { setPartnerLoading(false); }
  }, []);
  useEffect(() => { if (tab === 'partners') loadPartners(); }, [tab, loadPartners]);

  const sel = selectedKey != null && results ? results.find((r) => keyOf(r) === selectedKey) || null : null;

  const draftEmail = async () => {
    if (!sel || !brief) return;
    setEmailLoading(true); setEmailData(null); setError('');
    try {
      const res = await fetch('/api/email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sel.name, industry: sel.industry, employees: sel.employees, state: sel.state, motion: sel.incumbent?.motion, incumbent: sel.incumbent, openings: sel.openings, upsellAngle: brief.upsellAngle, talkingPoints: brief.talkingPoints, caseStudies: brief.caseStudies }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Email draft failed');
      setEmailData(data);
      const k = keyOf(sel);
      setBriefCache((prev) => ({ ...prev, [k]: { ...(prev[k] || {}), emailData: data } }));
    } catch (e) { setError(e.message); } finally { setEmailLoading(false); }
  };

  const copyText = (key, subject, body) => {
    try { navigator.clipboard?.writeText(`Subject: ${subject}\n\n${body}`); } catch {}
    setCopied(key); setTimeout(() => setCopied(''), 1500);
  };
  const mailto = (subject, body) => `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const sendCoach = async (text) => {
    const t = (text || '').trim();
    if (!t || coachLoading) return;
    const next = [...coachMsgs, { role: 'user', content: t }];
    setCoachMsgs(next); setCoachInput(''); setCoachLoading(true);
    try {
      const context = sel ? { name: sel.name, industry: sel.industry, state: sel.state, employees: sel.employees, motion: sel.incumbent?.motion, incumbent: sel.incumbent, upsellAngle: brief?.upsellAngle, caseStudies: brief?.caseStudies } : null;
      const res = await fetch('/api/coach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })), context }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Coach failed');
      setCoachMsgs([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setCoachMsgs([...next, { role: 'assistant', content: '⚠ ' + e.message }]);
    } finally { setCoachLoading(false); }
  };

  return (
    <div className="wrap">
      <div className="header"><div className="logo">P</div><h1>PEO Targeting Agent</h1></div>
      <p className="sub">Feed it payroll-only clients (or one domain). It enriches each via Apollo, checks the incumbent vendor and hiring velocity, ranks them by PEO-fit likelihood, and writes the upsell brief on demand — learning from every outcome.</p>

      <div className="tabs">
        <button className={tab === 'playbook' ? 'tab on' : 'tab'} onClick={() => setTab('playbook')}>Playbook</button>
        <button className={tab === 'target' ? 'tab on' : 'tab'} onClick={() => setTab('target')}>Target &amp; Rank</button>
        <button className={tab === 'partners' ? 'tab on' : 'tab'} onClick={() => setTab('partners')}>Partner Intel</button>
        <button className={tab === 'deals' ? 'tab on' : 'tab'} onClick={() => setTab('deals')}>Deals &amp; Learning</button>
      </div>

      {tab === 'playbook' && (
        <div className="card">
          <h2>GTM Playbook — PEO off the payroll base</h2>
          <p className="pblead">Gusto has 500k+ SMB payroll customers — a meaningful share already sit in the PEO sweet spot. This is a <b>monetization layer on the installed base</b>, not new-logo selling: a warm base means far lower CAC and faster payback. The prize = fit-eligible accounts × worksite employees × gross profit per WSE.</p>

          <div className="pbsec">The motion — three pillars</div>
          <div className="pbpillars">
            <div className="pbpill lead"><span className="pbnum">1</span><span className="pbtag">Lead</span><h4>Accountant &amp; advisor channel</h4><p>Gusto already owns the trusted-advisor relationship through its tiered partner program + People Advisory. Activate the highest-fit partner books first (see Partner Intel), and certify and incentivize advisors to co-sell PEO.</p></div>
            <div className="pbpill"><span className="pbnum">2</span><h4>Specialist overlay + routing</h4><p>PEO is a consultative co-employment sale, not a payroll add-on. A PEO specialist team fed by PEO-Qualified Leads from the propensity score, AM/CSM signals, and accountant referrals.</p></div>
            <div className="pbpill"><span className="pbnum">3</span><h4>AI targeting &amp; enablement</h4><p>This app: scores and ranks the base, qualifies/disqualifies with reasons, briefs and coaches reps, drafts outreach, ranks advisor books, and learns from every outcome.</p></div>
          </div>

          <div className="pbsec">Lead flow</div>
          <div className="pbflow"><span className="pbnode">Base propensity</span><span className="pbarr">+</span><span className="pbnode">Accountant referral</span><span className="pbarr">+</span><span className="pbnode">AM/CSM signal</span><span className="pbarr">→</span><span className="pbnode">PEO-Qualified Lead</span><span className="pbarr">→</span><span className="pbnode">PEO specialist</span><span className="pbarr">→</span><span className="pbnode">Co-sell w/ advisor</span></div>

          <div className="pbsec">Phased rollout</div>
          <div className="pbphase">
            <div className="pbph"><div className="k">Crawl — pilot</div><p>One high-fit cohort (comp-heavy + multi-state + on Gusto + hiring) and a few Prioritize-tier accountants. Prove win rate, CAC payback, time-to-value.</p></div>
            <div className="pbph"><div className="k">Walk — expand</div><p>More cohorts and states; scale People Advisory PEO certification; tune the score on real won/lost outcomes.</p></div>
            <div className="pbph"><div className="k">Run — scale</div><p>Full base and channel; automate targeting (nightly scan surfaces top accounts to reps and partners).</p></div>
          </div>

          <div className="pbsec">Metrics scorecard</div>
          <div className="pbmetrics"><span className="pbm">Attach rate on base</span><span className="pbm">PEO NRR</span><span className="pbm">CAC payback (upsell)</span><span className="pbm">Win rate by fit band</span><span className="pbm">Time-to-value</span><span className="pbm">Partner-sourced %</span></div>

          <div className="pbguard"><div className="k">Guardrail — protect the core</div><ul style={{ margin: 0, paddingLeft: 18 }}><li>Do no harm to the payroll relationship — a botched co-employment transition can churn the base.</li><li>Disqualify bad-fit / bad-risk accounts to protect the master workers' comp policy.</li><li>Obsess over implementation and time-to-value.</li><li>Responsible AI: it gathers facts, transparent rules decide, humans verify.</li></ul></div>

          <div className="pbcta"><button className="btn" style={{ width: 'auto', marginTop: 0 }} onClick={() => setTab('target')}>See the engine →</button></div>
        </div>
      )}

      {tab === 'target' && (
        <>
        <div className="impact">
          <div className="ip"><b>~40 min → under 1</b><span>Prep per account</span></div>
          <div className="ip"><b>Whole base, ranked</b><span>By PEO-fit likelihood</span></div>
          <div className="ip"><b>Coached &amp; drafted</b><span>Brief · email · objections</span></div>
        </div>
        <div className="grid">
          <div className="card">
            <h2>Search a company</h2>
            <div className="searchrow">
              <input value={searchCo} onChange={(e) => setSearchCo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') researchCompany(); }} placeholder="Company name or domain…" />
              <button onClick={researchCompany} disabled={researching}>{researching ? <span className="dots">Researching</span> : 'Research'}</button>
            </div>
            <p className="disclaimer" style={{ marginTop: 8 }}>AI researches the company live, then qualifies or disqualifies it with reasons. Verify before acting.</p>
            <div className="orsplit"><span>or score a list</span></div>
            <h2>Client list</h2>
            <label>Paste domains (one per line) — or "Name, domain"</label>
            <textarea value={listText} onChange={(e) => setListText(e.target.value)} style={{ minHeight: 150 }}
              placeholder={'brightlinecreative.com\nlonestarfamilyhealth.com, Lone Star Family Health\ngulfcoastbuilders.com'} />
            <label>…or upload a CSV (looks for a domain/website column)</label>
            <input type="file" accept=".csv,text/csv,text/plain" onChange={onFile} />
            <button className="btn" onClick={score} disabled={scoring}>
              {scoring ? <span className="dots">Enriching &amp; scoring</span> : 'Score & rank'}
            </button>
            <p className="disclaimer" style={{ marginTop: 12 }}>No Apollo key? Just click — sample prospects load in demo mode. Up to 50 per run; Apollo + Adzuna consume credits.</p>
            {results && demo && <p className="demobanner"><i className="ti ti-flask" aria-hidden="true"></i> Demo data — sample prospects for demonstration purposes. Connect Apollo to score your real list.</p>}
            {results && !demo && apolloOn && !jobsOn && <p className="disclaimer" style={{ marginTop: 6 }}>Hiring velocity off — add ADZUNA keys to enable it.</p>}
            {error && <p className="err" style={{ marginTop: 8 }}>⚠ {error}</p>}

            {results && (
              <div className="ranklist">
                <div className="rankhead">{results.length} ranked by PEO fit<span className="clearbtn" onClick={clearAll}>Clear all</span></div>
                {results.map((r, i) => {
                  const k = keyOf(r); const tc = (touches[k] || []).length;
                  return (
                  <div key={k || i} className={selectedKey === k ? 'rankrow on' : 'rankrow'} onClick={() => openRow(r)}>
                    <span className="rankscore" style={{ color: scoreColor(r.score) }}>{r.score ?? '—'}</span>
                    <span className="rankmain">
                      <span className="rankco">{r.name}{briefCache[k]?.brief && <i className="ti ti-circle-check briefdot" title="Brief ready" aria-hidden="true"></i>}</span>
                      <span className="rankmeta">{[r.industry, r.employees && r.employees + ' emp', r.openings != null && r.openings + ' open roles'].filter(Boolean).join(' · ') || r.domain}</span>
                      {r.partner && <span className="rankpartner"><i className="ti ti-plug-connected" aria-hidden="true"></i> {r.partner.name} · {r.partner.influencedDeals} deals</span>}
                    </span>
                    <span className="rankright">
                      {tc > 0 && <span className="touchpill"><i className="ti ti-checkbox" aria-hidden="true"></i> {tc} {tc === 1 ? 'touch' : 'touches'}</span>}
                      {r.qualification?.recommendation === 'Disqualify' && <span className="rankdq">Disqualify</span>}
                      <span className="rankmotion" style={{ color: motionColor(r.incumbent?.motion), borderColor: motionColor(r.incumbent?.motion) }}>{r.incumbent?.motion || '—'}</span>
                      <span className="rankband" style={{ color: scoreColor(r.score) }}>{r.band}</span>
                    </span>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card">
            <h2>Upsell brief</h2>
            {!sel && !briefLoading && <p className="empty">Score a list or search a company, then tap any row to enrich it into a full payroll → PEO upsell brief — the motion, fit rationale, the angle, talking points, objections, recommended contacts, and the comp/benefits hook. Companies and briefs are saved in your browser, so you can come back to them.</p>}
            {briefLoading && <p className="empty"><span className="dots">Writing the brief</span></p>}

            {brief && sel && (
              <div className="brief">
                {sel.qualification && (sel.researched || sel.qualification.recommendation === 'Disqualify') && (
                  <div className={'qbanner ' + (sel.qualification.recommendation === 'Disqualify' ? 'q-dis' : sel.qualification.recommendation === 'Qualify' ? 'q-qual' : 'q-rev')}>
                    <div className="qhead">
                      {sel.qualification.recommendation === 'Disqualify' ? 'Recommend to disqualify' : sel.qualification.recommendation === 'Qualify' ? 'Recommend to pursue' : 'Worth a closer look'}
                      {sel.confidence ? ` · ${sel.confidence} confidence` : ''}
                    </div>
                    {(sel.qualification.recommendation === 'Disqualify' ? sel.qualification.disqualifiers : sel.qualification.qualifiers).map((d, i) => (
                      <div className="qrow" key={i}><b>{d.signal}</b> — {d.why}</div>
                    ))}
                    {sel.qualification.recommendation === 'Review' && sel.qualification.disqualifiers.length > 0 && (
                      <div className="qcautions"><div className="qcap">Cautions</div>{sel.qualification.disqualifiers.map((d, i) => <div className="qrow" key={i}><b>{d.signal}</b> — {d.why}</div>)}</div>
                    )}
                    {sel.researched && <div className="qnote">AI-researched from public sources — verify before acting. Probability signals, not definitive.</div>}
                  </div>
                )}
                <div className="ctxrow">
                  <span className="ctx" style={{ color: motionColor(sel.incumbent?.motion), borderColor: motionColor(sel.incumbent?.motion) }}>{sel.incumbent?.motion}</span>
                  <span className="ctx">{sel.incumbent?.vendor ? 'On ' + sel.incumbent.vendor : sel.incumbent?.category}</span>
                  {sel.openings != null && <span className="ctx">{sel.openings} open roles</span>}
                </div>

                {sel.partner && (
                  <div className="partnerflag">
                    <div className="pfhead"><i className="ti ti-plug-connected" aria-hidden="true"></i> Channel partner detected</div>
                    <div className="pfbody">Their {sel.partner.type.toLowerCase()} <b>{sel.partner.name}</b> is a {sel.partner.tier} channel partner — has influenced <b>{sel.partner.influencedDeals} deals</b>. Loop them in for a warm intro.</div>
                  </div>
                )}

                <div className="blk fitblk">
                  <div className="score">
                    <div className="scoreNum" style={{ color: scoreColor(brief.fitScore) }}>{brief.fitScore}</div>
                    <div className="bar"><i style={{ width: `${Math.max(0, Math.min(100, brief.fitScore))}%` }} /></div>
                    <div className="scoreLabel" style={{ background: 'var(--panel-2)', color: scoreColor(brief.fitScore) }}>{brief.fitLabel}</div>
                  </div>
                </div>

                <div className="subtabs">
                  {[['value', 'Value Prop'], ['objections', 'Objection Handling'], ['benefits', 'Benefits Play'], ['contacts', 'Contacts'], ['outreach', 'Outreach']].map(([id, label]) => {
                    const tc = (touches[keyOf(sel)] || []).length;
                    return <button key={id} className={briefTab === id ? 'subtab on' : 'subtab'} onClick={() => setBriefTab(id)}>{label}{id === 'contacts' && tc > 0 ? ` Â· ${tc}` : ''}</button>;
                  })}
                </div>

                {briefTab === 'value' && (
                  <div className="section">
                    {brief.upsellAngle && <div className="blk"><h3>Upsell angle (payroll → PEO)</h3><p>{brief.upsellAngle}</p></div>}
                    <div className="blk"><h3>Why this fit</h3><p>{brief.fitRationale}</p><ul className="points">{(sel.reasons || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                    <div className="blk"><h3>Talking points</h3><ul className="points">{(brief.talkingPoints || []).map((p, i) => <li key={i}>{p}</li>)}</ul></div>
                    <div className="coach">
                      <div className="coachhead">Coaching</div>
                      {(brief.coaching || []).map((t, i) => <div className="coachtip" key={i}>{t}</div>)}
                      <div className="coachrules">
                        {GUARDRAILS.map(([k, txt], i) => (
                          <div className={k === 'x' ? 'crule no' : 'crule yes'} key={i}><span className="cmark">{k === 'x' ? '✕' : '✓'}</span>{txt}</div>
                        ))}
                      </div>
                    </div>
                    <div className="blk"><h3>Recommended next step</h3><p>{brief.recommendedNextStep}</p></div>
                  </div>
                )}

                {briefTab === 'objections' && (
                  <div className="section">
                    <div className="blk"><h3>Objection handling</h3>{(brief.objections || []).map((o, i) => <div className="obj" key={i}><div className="q">“{o.objection}”</div><div className="a">{o.response}</div></div>)}</div>
                    <button className="btn ghost" onClick={() => setCoachOpen(true)}><i className="ti ti-message-chatbot" aria-hidden="true"></i>  Ask the coach a live objection</button>
                  </div>
                )}

                {briefTab === 'benefits' && (
                  <div className="section">
                    <div className="blk"><h3>Workers' comp &amp; benefits angle</h3><p>{brief.compBenefitsAngle}</p></div>
                    <div className="blk"><h3>Projected savings (illustrative)</h3><p>{brief.projectedSavings}</p></div>
                    {brief.caseStudies && brief.caseStudies.length > 0 && (
                      <div className="blk"><h3>Proof point <span className="sampletag">Sample for demonstration purposes</span></h3>
                        {brief.caseStudies.map((c, i) => (
                          <div className="proof" key={i}>
                            <p className="proofsum">{c.summary}</p>
                            <div className="proofbars">
                              <div className="pb"><span>Medical</span><b>${Math.round(c.medical / 1000)}k</b></div>
                              <div className="pb"><span>Workers' comp</span><b>${Math.round(c.workersComp / 1000)}k</b></div>
                              <div className="pb"><span>Soft HR costs</span><b>${Math.round(c.softCosts / 1000)}k</b></div>
                              <div className="pb total"><span>Total / yr</span><b>${Math.round(c.total / 1000)}k</b></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="disclaimer">{brief.disclaimer || 'Estimates are illustrative and not a binding quote.'}</p>
                  </div>
                )}

                {briefTab === 'contacts' && (
                  <div className="section">
                    {(() => { const k = keyOf(sel); const cs = contactsCache[k] || []; const ts = touches[k] || []; return (
                      <div className="crmbox">
                        <div className="crmhead"><span><i className="ti ti-users" aria-hidden="true"></i> Recommended contacts</span>{cs.some((c) => c.sample) && <span className="sampletag">Sample for demonstration purposes</span>}</div>
                        {!cs.length && <div className="crmempty">Loading contacts…</div>}
                        {cs.map((c, i) => (
                          <div className="contact" key={i}>
                            <div className="cmain">
                              <span className="cname">{c.name} {c.priority === 'Primary' && <span className="cprio">Primary</span>}</span>
                              <span className="ctitle">{c.title}</span>
                              {c.email && <button className="cemail" onClick={() => { try { navigator.clipboard?.writeText(c.email); } catch {} setCopied('email-' + i); setTimeout(() => setCopied(''), 1500); }}>{copied === 'email-' + i ? 'Copied ✓' : c.email}</button>}
                              {c.why && <span className="cwhy">{c.why}</span>}
                            </div>
                            <div className="ctouchbtns">
                              <button onClick={() => logTouch(k, c, 'Call')} title="Log a call"><i className="ti ti-phone" aria-hidden="true"></i></button>
                              <button onClick={() => logTouch(k, c, 'Email')} title="Log an email"><i className="ti ti-mail" aria-hidden="true"></i></button>
                              <button onClick={() => logTouch(k, c, 'LinkedIn')} title="Log a LinkedIn touch"><i className="ti ti-brand-linkedin" aria-hidden="true"></i></button>
                              <button onClick={() => logTouch(k, c, 'Note')} title="Log a note"><i className="ti ti-note" aria-hidden="true"></i></button>
                            </div>
                          </div>
                        ))}
                        {ts.length > 0 && (
                          <div className="touchlog">
                            <div className="tlhead">{ts.length} {ts.length === 1 ? 'touch' : 'touches'} logged</div>
                            {ts.slice(0, 8).map((t) => (
                              <div className="tlrow" key={t.id}><span className="tltype">{t.type}</span> {t.contact && <span className="tlc">{t.contact}</span>} <span className="tldate">{new Date(t.at).toLocaleDateString()} {new Date(t.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                            ))}
                          </div>
                        )}
                      </div>
                    ); })()}
                  </div>
                )}

                {briefTab === 'outreach' && (
                  <div className="section">
                    <div className="blk outreach">
                      <h3>Outreach</h3>
                      {!emailData && (
                        <button className="btn ghost" onClick={draftEmail} disabled={emailLoading}>
                          {emailLoading ? <span className="dots">Drafting email &amp; sequence</span> : '✉  Draft email & follow-up'}
                        </button>
                      )}
                      {emailData && (
                        <>
                          <div className="emailcard">
                            <div className="emhead">First touch</div>
                            <div className="emsub">{emailData.initial?.subject}</div>
                            <p className="embody">{emailData.initial?.body}</p>
                            <div className="emactions">
                              <span className="copybtn" onClick={() => copyText('init', emailData.initial.subject, emailData.initial.body)}>{copied === 'init' ? '✓ Copied' : 'Copy'}</span>
                              <a className="copybtn" href={mailto(emailData.initial.subject, emailData.initial.body)}>Open in email</a>
                            </div>
                          </div>
                          <div className="seqhead">Follow-up sequence</div>
                          <div className="timeline">
                            {(emailData.sequence || []).map((sq, i) => (
                              <div className="tstep" key={i}>
                                <div className="tday">Day {sq.day}</div>
                                <div className="tcard">
                                  <div className="tpurpose">{sq.purpose}</div>
                                  <div className="emsub">{sq.subject}</div>
                                  <p className="embody">{sq.body}</p>
                                  <div className="emactions">
                                    <span className="copybtn" onClick={() => copyText('s' + i, sq.subject, sq.body)}>{copied === 's' + i ? '✓ Copied' : 'Copy'}</span>
                                    <a className="copybtn" href={mailto(sq.subject, sq.body)}>Open</a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="disclaimer">Drafts to review before sending. Automated drip-send needs an email platform + CAN-SPAM compliance (unsubscribe, etc.) — a later integration.</p>
                        </>
                      )}
                    </div>

                    <div className="blk feedback">
                      <h3>Log the outcome</h3>
                      {!brief._stored && <p className="empty" style={{ marginBottom: 0 }}>Connect Airtable (README) to capture outcomes and train the fit model over time.</p>}
                      {brief._stored && (
                        <>
                          <div className="outcomes">{['Won', 'Lost', 'No decision'].map((o) => (
                            <button key={o} className={outcome === o ? 'oc on' : 'oc'} onClick={() => { setOutcome(o); setFbSaved(false); }} style={outcome === o ? { borderColor: outcomeColor(o), color: outcomeColor(o) } : {}}>{o}</button>
                          ))}</div>
                          <label>What resonated?</label>
                          <div className="tagrow">{RESONATED_TAGS.map((t) => <span key={t} className={resonated.includes(t) ? 'tag on' : 'tag'} onClick={() => toggleTag(t)}>{t}</span>)}</div>
                          <label>Notes (optional)</label>
                          <textarea value={notes} onChange={(e) => { setNotes(e.target.value); setFbSaved(false); }} placeholder="What actually moved the deal…" style={{ minHeight: 60 }} />
                          <button className="btn" style={{ marginTop: 14 }} onClick={saveFeedback} disabled={savingFb || !outcome}>
                            {savingFb ? 'Saving…' : fbSaved ? '✓ Saved — trains the fit model' : 'Save outcome'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        </>
      )}

      {tab === 'partners' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Partner Intel — advisors by book fit</h2>
            <span className="chip" onClick={loadPartners}>↻ Refresh</span>
          </div>
          <p className="empty" style={{ marginTop: 10 }}>Which accountants &amp; brokers have client books that fit the PEO mold best — so you activate and co-sell with the right partners first.</p>
          {partnerData?.demo && <p className="demobanner"><i className="ti ti-flask" aria-hidden="true"></i> Demo data — sample partner books. In production this computes from your scored base joined to CRM partner links.</p>}
          {partnerLoading && <p className="empty"><span className="dots">Loading</span></p>}
          {partnerData?.partners?.map((p, i) => (
            <div className="pcard" key={i}>
              <div className="pctop">
                <div><span className="pcname">{p.name}</span><span className="pctier">{p.type} · {p.tier}</span></div>
                <span className={'pcrec ' + (p.recommendation.startsWith('Prioritize') ? 'pc-go' : p.recommendation === 'Engage' ? 'pc-mid' : 'pc-low')}>{p.recommendation}</span>
              </div>
              <div className="pcstats">
                <div className="pcstat"><b style={{ color: scoreColor(p.highFitPct >= 70 ? 80 : p.highFitPct >= 45 ? 60 : 30) }}>{p.highFitPct}%</b><span>High-fit book</span></div>
                <div className="pcstat"><b>{p.avgFit}</b><span>Avg fit</span></div>
                <div className="pcstat"><b>{p.highFitCount}/{p.clientCount}</b><span>Strong/Good</span></div>
                <div className="pcstat"><b>{p.influencedDeals}</b><span>Deals influenced</span></div>
              </div>
              <div className="pctrend">Book skews <b>{p.topIndustry}</b> — {p.highFitCount} of {p.clientCount} clients fit the PEO mold.</div>
              <div className="pcbook">
                {p.book.map((c, j) => <span key={j} className="pcclient" style={{ borderColor: scoreColor(c.fitScore), color: scoreColor(c.fitScore) }}>{c.name} · {c.fitScore}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'deals' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Deals &amp; Learning</h2>
            <span className="chip" onClick={loadDeals}>↻ Refresh</span>
          </div>
          {dealsLoading && <p className="empty" style={{ marginTop: 18 }}><span className="dots">Loading</span></p>}
          {!dealsLoading && dealsData && !dealsData.enabled && <p className="empty" style={{ marginTop: 18 }}>Store not connected. Add Airtable env vars (README) to accumulate deals and win-rate insight.</p>}
          {!dealsLoading && dealsData && dealsData.enabled && dealsData.stats && (
            <>
              {dealsData.demo && <p className="demobanner" style={{ marginTop: 16 }}><i className="ti ti-flask" aria-hidden="true"></i> Demo data — sample outcomes for demonstration purposes. Connect Airtable to track your real deals.</p>}
              <div className="stats">
                <div className="stat"><div className="statNum" style={{ color: 'var(--accent)' }}>{dealsData.stats.winRate == null ? '—' : dealsData.stats.winRate + '%'}</div><div className="statLbl">Win rate</div></div>
                <div className="stat"><div className="statNum">{dealsData.stats.total}</div><div className="statLbl">Briefs</div></div>
                <div className="stat"><div className="statNum" style={{ color: 'var(--good)' }}>{dealsData.stats.won}</div><div className="statLbl">Won</div></div>
                <div className="stat"><div className="statNum" style={{ color: 'var(--bad)' }}>{dealsData.stats.lost}</div><div className="statLbl">Lost</div></div>
                <div className="stat"><div className="statNum" style={{ color: 'var(--muted)' }}>{dealsData.stats.pending}</div><div className="statLbl">Pending</div></div>
              </div>
              {dealsData.stats.byBand.length > 0 && (
                <div className="bandbox">
                  <div className="bandhead">Win rate by fit band — does the score predict wins?</div>
                  {dealsData.stats.byBand.map((b) => (
                    <div className="bandrow" key={b.band}>
                      <span className="bandname">{b.band}</span>
                      <span className="bandbar"><i style={{ width: `${b.winRate ?? 0}%` }} /></span>
                      <span className="bandval">{b.winRate == null ? '—' : b.winRate + '%'} <span className="bandmut">({b.won}W/{b.lost}L)</span></span>
                    </div>
                  ))}
                </div>
              )}
              <div className="dealhead">Recent deals</div>
              {dealsData.deals.length === 0 && <p className="empty">No deals yet.</p>}
              {dealsData.deals.map((d) => (
                <div className="dealrow" key={d.id}>
                  <div className="dealmain"><span className="dealco">{d.company || 'Unnamed'}</span><span className="dealmeta">{[d.state, d.industry, d.employees && d.employees + ' WSE'].filter(Boolean).join(' · ')}</span></div>
                  <span className="dealscore" style={{ color: scoreColor(d.fitScore) }}>{d.fitScore ?? '—'}</span>
                  <span className="badge" style={{ color: outcomeColor(d.outcome), borderColor: outcomeColor(d.outcome) }}>{d.outcome}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {!coachOpen && (
        <button className="coachfab" onClick={() => setCoachOpen(true)} aria-label="Open sales coach">
          <i className="ti ti-message-chatbot" aria-hidden="true"></i> Ask the coach
        </button>
      )}
      {coachOpen && (
        <div className="coachpanel">
          <div className="cpbar">
            <span>Sales coach{sel ? ` · ${sel.name}` : ''}</span>
            <span className="cpx" onClick={() => setCoachOpen(false)} aria-label="Close">✕</span>
          </div>
          <div className="cmsgs">
            {coachMsgs.length === 0 && (
              <div className="cwelcome">
                Ask me an objection or a quick question mid-call. I'll tailor it to the prospect you have open.
                <div className="csuggest">
                  {["They said it's too expensive", "They don't think co-employment fits them", 'Top hospitals/providers in this market to reference?'].map((q, i) => (
                    <span key={i} className="csg" onClick={() => sendCoach(q)}>{q}</span>
                  ))}
                </div>
              </div>
            )}
            {coachMsgs.map((m, i) => <div key={i} className={m.role === 'user' ? 'cmsg user' : 'cmsg bot'}>{m.content}</div>)}
            {coachLoading && <div className="cmsg bot"><span className="dots">Thinking</span></div>}
          </div>
          <div className="cinrow">
            <input value={coachInput} onChange={(e) => setCoachInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendCoach(coachInput); }} placeholder="Type an objection or question…" />
            <button onClick={() => sendCoach(coachInput)} disabled={coachLoading}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
