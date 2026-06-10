// Transparent, explainable heuristic fit score (0-100).
// Cold-start scorer: weights are hand-set and fully visible. As outcomes
// accumulate, these features/weights become what a trained model learns.

export const WEIGHTS = { headcount: 32, industry: 18, incumbent: 22, hiring: 18, maturity: 10 };

const GOOD_IND = ['professional', 'service', 'agency', 'marketing', 'advertising', 'software', 'technology', 'information technology', 'consulting', 'accounting', 'legal', 'law', 'financial', 'insurance', 'real estate', 'health', 'medical', 'dental', 'clinic', 'veterinary', 'nonprofit', 'non-profit', 'education', 'architecture', 'engineering', 'design', 'hospitality', 'restaurant'];
const RISKY_IND = ['construction', 'manufacturing', 'staffing', 'logistics', 'transportation', 'mining', 'oil', 'gas', 'agriculture', 'trucking', 'roofing'];

function pick(tech, names) {
  const hit = names.find((n) => tech.some((t) => t.includes(n)));
  if (!hit) return null;
  return hit.charAt(0).toUpperCase() + hit.slice(1);
}

// Classify incumbent HR/payroll/PEO vendor from technographics -> drives the motion.
export function classifyIncumbent(org) {
  const tech = (org?.technologies || []).map((t) => t.toLowerCase());
  const has = (s) => tech.some((t) => t.includes(s));

  if (has('totalsource') || has('trinet') || has('insperity') || has('justworks')) {
    return { category: 'PEO competitor', vendor: pick(tech, ['trinet', 'insperity', 'justworks', 'totalsource']) || 'a PEO', motion: 'Displacement' };
  }
  if (has('gusto')) return { category: 'Payroll (Gusto)', vendor: 'Gusto', motion: 'Upsell to PEO' };
  if (has('rippling')) return { category: 'Modern HRIS', vendor: 'Rippling', motion: 'Competitive upsell' };
  if (has('bamboohr') || has('namely') || has('paylocity') || has('paycor') || has('workday')) {
    return { category: 'HRIS', vendor: pick(tech, ['bamboohr', 'namely', 'paylocity', 'paycor', 'workday']), motion: 'Upsell' };
  }
  if (has('paychex') || has('adp')) return { category: 'Payroll', vendor: pick(tech, ['paychex', 'adp']), motion: 'Upsell to PEO' };
  return { category: 'None detected', vendor: null, motion: 'Greenfield' };
}

export function scoreCompany(org, extra = {}) {
  if (!org) {
    return { score: null, band: 'Unknown', reasons: ['No enrichment data — cannot score automatically.'], incumbent: classifyIncumbent(null), openings: extra.openings ?? null };
  }
  const reasons = [];
  let s = 0;

  // 1) Headcount band (32)
  const e = typeof org.employees === 'number' ? org.employees : null;
  if (e == null) { s += 14; reasons.push('Headcount unknown — scored neutral.'); }
  else if (e >= 10 && e <= 75) { s += 32; reasons.push(`~${e} employees — squarely in the PEO sweet spot.`); }
  else if ((e >= 5 && e < 10) || (e > 75 && e <= 150)) { s += 22; reasons.push(`~${e} employees — solid PEO range.`); }
  else if (e > 150 && e <= 300) { s += 12; reasons.push(`~${e} employees — larger; may have in-house HR.`); }
  else { s += 5; reasons.push(`~${e} employees — outside the core PEO range.`); }

  // 2) Industry fit (18)
  const ind = (org.industry || '').toLowerCase();
  if (GOOD_IND.some((k) => ind.includes(k))) { s += 18; reasons.push(`${org.industry} — strong PEO fit.`); }
  else if (RISKY_IND.some((k) => ind.includes(k))) { s += 8; reasons.push(`${org.industry} — viable, but watch the workers'-comp risk class.`); }
  else if (ind) { s += 11; reasons.push(`${org.industry} — moderate fit.`); }
  else { s += 10; reasons.push('Industry unknown — scored neutral.'); }

  // 3) Incumbent vendor -> motion (22)
  const incumbent = classifyIncumbent(org);
  if (incumbent.category === 'Payroll (Gusto)') { s += 22; reasons.push('On Gusto payroll — prime payroll → PEO upsell.'); }
  else if (incumbent.category === 'Payroll') { s += 18; reasons.push(`On ${incumbent.vendor} payroll — natural upsell to PEO.`); }
  else if (incumbent.category === 'None detected') {
    if (e != null && e < 100) { s += 19; reasons.push('No HR/PEO vendor detected + sub-100 headcount — likely greenfield gap.'); }
    else { s += 12; reasons.push('No HR/PEO vendor detected.'); }
  }
  else if (incumbent.category === 'Modern HRIS' || incumbent.category === 'HRIS') { s += 12; reasons.push(`On ${incumbent.vendor || 'an HRIS'} — competitive upsell, not greenfield.`); }
  else if (incumbent.category === 'PEO competitor') { s += 14; reasons.push(`Already on ${incumbent.vendor} — displacement play, different motion.`); }
  else { s += 13; }

  // 4) Hiring velocity (18)
  const openings = typeof extra.openings === 'number' ? extra.openings : null;
  if (openings == null) { s += 9; reasons.push('Hiring activity unknown.'); }
  else if (openings >= 4) { s += 18; reasons.push(`~${openings} open roles — actively hiring, outgrowing self-serve benefits.`); }
  else if (openings >= 1) { s += 12; reasons.push(`~${openings} open role(s) — some hiring momentum.`); }
  else { s += 6; reasons.push('No open roles found — limited hiring momentum.'); }

  // 5) Maturity (10)
  const yr = org.foundedYear;
  if (yr) {
    const age = new Date().getFullYear() - yr;
    if (age >= 3 && age <= 25) { s += 10; reasons.push(`Founded ${yr} — established and likely growing.`); }
    else if (age < 3) { s += 6; reasons.push(`Founded ${yr} — early-stage, may be volatile.`); }
    else { s += 7; reasons.push(`Founded ${yr} — mature.`); }
  } else { s += 6; reasons.push('Founding year unknown.'); }

  const score = Math.round(s);
  const band = score >= 75 ? 'Strong' : score >= 60 ? 'Good' : score >= 40 ? 'Moderate' : 'Weak';
  return { score, band, reasons, incumbent, openings };
}
