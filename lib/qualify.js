// Transparent qualify / disqualify rules. The AI only GATHERS facts; this layer
// makes the call, so the recommendation is explainable and consistent.
// These are probability signals, not absolute disqualifiers — verify before acting.

const yes = (v) => v === true;

export function qualify(s = {}) {
  const emp = typeof s.employees === 'number' ? s.employees : null;
  const dis = []; // disqualifiers: { signal, why, hard }
  const qual = []; // qualifiers: { signal, why }

  // ---------- Disqualifiers ----------
  if (emp != null && emp > 500) dis.push({ signal: 'Enterprise headcount (500+)', why: 'Far above the PEO sweet spot; likely already runs full internal HR and custom infrastructure.', hard: true });
  if (emp != null && emp < 5) dis.push({ signal: 'Very small workforce (<5)', why: 'Too small for a PEO to be cost-effective or necessary.', hard: true });
  if (typeof s.hrTeamSize === 'number' && s.hrTeamSize >= 5) dis.push({ signal: 'Mature internal HR (5+ HR staff)', why: 'Already handles HR, payroll, and benefits in-house — little for a PEO to absorb.', hard: true });
  if (yes(s.enterpriseHRIS)) dis.push({ signal: 'Enterprise HRIS in place', why: 'Workday/SAP-class systems signal sophisticated in-house HR a PEO would disrupt.', hard: true });
  if (yes(s.publiclyTraded) && yes(s.international)) dis.push({ signal: 'Public + international', why: 'Complex governance and cross-border compliance exceed standard PEO scope.', hard: true });
  if (yes(s.contractorHeavy)) dis.push({ signal: 'Mostly contractors / staffing', why: 'Workforce is largely 1099/EOR — incompatible with co-employment.', hard: true });
  if (s.excludedIndustry) dis.push({ signal: `Often-excluded industry${typeof s.excludedIndustry === 'string' ? ` (${s.excludedIndustry})` : ''}`, why: 'Many PEOs exclude this category for legal/insurance reasons (e.g., cannabis, federal contracting).', hard: true });
  if (yes(s.franchiseHeavy)) dis.push({ signal: 'Franchise / decentralized structure', why: 'Independently owned units complicate co-employment across entities.', hard: false });
  if (yes(s.prefersInHouse)) dis.push({ signal: 'Prefers in-house HR', why: 'Public messaging or internal-HR hiring signals they want to own HR directly.', hard: false });
  if (yes(s.financialRedFlags)) dis.push({ signal: 'Financial / operational red flags', why: 'Instability, layoffs, or compliance issues raise risk.', hard: false });

  // ---------- Qualifiers ----------
  if (emp != null && emp >= 10 && emp <= 250) qual.push({ signal: `${emp} employees`, why: 'Enough HR complexity to need support, not enough scale to justify a full internal HR team.' });
  if (yes(s.recentFunding) || s.fundingStage) qual.push({ signal: `Recent funding${s.fundingStage ? ` (${s.fundingStage})` : ''}`, why: 'Investors want leadership focused on growth, not HR admin — a PEO offloads it.' });
  if (s.hrTeamSize === 0 || yes(s.noHrTeam)) qual.push({ signal: 'No dedicated HR team', why: 'A PEO effectively becomes their HR department.' });
  if (yes(s.multiState)) qual.push({ signal: 'Multi-state workforce', why: 'Multi-state payroll, tax, and labor law is exactly what PEOs centralize.' });
  if (yes(s.remoteFirst)) qual.push({ signal: 'Remote-first / distributed', why: 'Distributed teams create state-registration and compliance complexity a PEO manages.' });
  if (s.hiring === 'heavy' || (typeof s.openRoles === 'number' && s.openRoles >= 4)) qual.push({ signal: 'Rapid hiring', why: 'Growth creates payroll, onboarding, and benefits load a PEO absorbs without internal HR expansion.' });
  if (yes(s.founderLed)) qual.push({ signal: 'Founder-led operations', why: 'Founders often over-spend time on HR admin that can be outsourced.' });
  if (yes(s.complianceHeavyIndustry)) qual.push({ signal: 'Compliance-heavy industry', why: 'Workers’ comp and risk-management support is high-value here.' });
  if (yes(s.professionalServices)) qual.push({ signal: 'Professional-services firm', why: 'Revenue comes from billable expertise; back-office HR is a prime outsource.' });

  const hardDis = dis.some((d) => d.hard);
  let recommendation;
  if (hardDis) recommendation = 'Disqualify';
  else if (qual.length >= 2 && !dis.length) recommendation = 'Qualify';
  else if (dis.length || qual.length < 2) recommendation = 'Review';
  else recommendation = 'Qualify';

  return { recommendation, disqualifiers: dis, qualifiers: qual };
}

// Lightweight signals derived from firmographic enrichment (no AI call) so a
// bulk list can flag hard disqualifiers inline. Funding / HR-team / multi-state
// aren't reliably in firmographics, so those stay null until full AI research.
export function signalsFromEnrichment(org) {
  if (!org) return {};
  const tech = (org.technologies || []).map((t) => t.toLowerCase());
  const ind = (org.industry || '').toLowerCase();
  const enterpriseHRIS = tech.some((t) => ['workday', 'sap', 'successfactors', 'oracle hcm', 'ukg', 'dayforce'].some((h) => t.includes(h)));
  const excludedIndustry = ind.includes('cannabis') || ind.includes('dispensary') ? 'cannabis' : (ind.includes('gambling') || ind.includes('casino') ? 'gaming' : false);
  const complianceHeavyIndustry = ['construction', 'manufacturing', 'logistics', 'transportation', 'trucking', 'roofing', 'oil', 'gas', 'mining'].some((k) => ind.includes(k));
  const professionalServices = ['professional', 'consulting', 'accounting', 'legal', 'law', 'marketing', 'advertising', 'agency', 'engineering', 'architecture'].some((k) => ind.includes(k));
  return {
    employees: typeof org.employees === 'number' ? org.employees : null,
    industry: org.industry || '',
    enterpriseHRIS,
    excludedIndustry,
    complianceHeavyIndustry,
    professionalServices,
  };
}

// Keep the fit score and the qualify recommendation consistent: a HARD
// disqualifier means low fit, regardless of firmographic sweet-spot.
export function reconcileScore(score, band, qualification) {
  if (qualification?.disqualifiers?.some((d) => d.hard)) {
    return { score: Math.min(typeof score === 'number' ? score : 100, 18), band: 'Weak' };
  }
  return { score, band };
}
