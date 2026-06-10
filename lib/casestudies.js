// Curated proof-point library. The AI NEVER invents customer stories — it only
// surfaces the most relevant one from this list, matched by industry/state/size.
//
// >>> SAMPLE FOR DEMONSTRATION PURPOSES <<<
// These entries are illustrative samples, not real customers. Replace with your
// company's real, approved case studies before any production use.

export const SAMPLE_NOTICE = 'SAMPLE FOR DEMONSTRATION PURPOSES';

export const CASE_STUDIES = [
  { id: 'cs-health-tx', industryKeywords: ['health', 'medical', 'clinic'], state: 'Texas', size: [20, 70], total: 30000, medical: 16000, workersComp: 8000, softCosts: 6000,
    summary: 'A comparable Texas healthcare practice on our payroll platform saw roughly $30k in annual savings — about $16k from lower medical premiums, $8k on workers’ comp, and $6k in reduced HR admin.', sample: true },
  { id: 'cs-dental-fl', industryKeywords: ['dental', 'dentist', 'orthodont'], state: 'Florida', size: [12, 45], total: 27000, medical: 14000, workersComp: 7000, softCosts: 6000,
    summary: 'A similar-size Florida dental group trimmed about $27k a year — ~$14k in medical premiums, ~$7k on workers’ comp, and ~$6k in HR soft costs.', sample: true },
  { id: 'cs-agency-ca', industryKeywords: ['marketing', 'advertising', 'agency', 'design', 'creative'], state: 'California', size: [10, 45], total: 22000, medical: 12000, workersComp: 3000, softCosts: 7000,
    summary: 'A California marketing agency of comparable size cut about $22k a year — ~$12k in medical premiums, ~$3k on workers’ comp, and ~$7k in soft HR/admin costs.', sample: true },
  { id: 'cs-tech-wa', industryKeywords: ['software', 'technology', 'information technology', 'saas', 'tech'], state: 'Washington', size: [15, 60], total: 34000, medical: 19000, workersComp: 4000, softCosts: 11000,
    summary: 'A Washington software company of similar headcount saved around $34k annually — ~$19k from medical premiums, ~$4k on workers’ comp, and ~$11k in HR soft costs.', sample: true },
  { id: 'cs-prof-co', industryKeywords: ['professional', 'consulting', 'service'], state: 'Colorado', size: [30, 90], total: 41000, medical: 22000, workersComp: 9000, softCosts: 10000,
    summary: 'A Colorado professional-services firm of similar headcount realized around $41k in annual savings — ~$22k from medical premiums, ~$9k on workers’ comp, and ~$10k in HR soft costs.', sample: true },
  { id: 'cs-legal-ny', industryKeywords: ['legal', 'law', 'attorney', 'litigation'], state: 'New York', size: [10, 50], total: 33000, medical: 18000, workersComp: 4000, softCosts: 11000,
    summary: 'A New York law firm of comparable size saved roughly $33k a year — ~$18k in medical premiums, ~$4k on workers’ comp, and ~$11k in HR soft costs.', sample: true },
  { id: 'cs-acct-il', industryKeywords: ['accounting', 'bookkeeping', 'cpa', 'financial'], state: 'Illinois', size: [12, 55], total: 29000, medical: 15000, workersComp: 5000, softCosts: 9000,
    summary: 'An Illinois accounting firm of similar size cut about $29k annually — ~$15k from medical premiums, ~$5k on workers’ comp, and ~$9k in HR soft costs.', sample: true },
  { id: 'cs-trades-tx', industryKeywords: ['construction', 'trades', 'roofing', 'contractor', 'hvac', 'electrical', 'plumbing'], state: 'Texas', size: [10, 70], total: 35000, medical: 12000, workersComp: 17000, softCosts: 6000,
    summary: 'A Texas contractor of comparable size saved roughly $35k a year — the bulk, ~$17k, on workers’ comp, plus ~$12k in medical premiums and ~$6k in HR admin.', sample: true },
  { id: 'cs-mfg-oh', industryKeywords: ['manufacturing', 'industrial', 'fabrication', 'machining'], state: 'Ohio', size: [25, 120], total: 48000, medical: 20000, workersComp: 21000, softCosts: 7000,
    summary: 'An Ohio manufacturer of similar size realized about $48k in annual savings — ~$21k on workers’ comp, ~$20k from medical premiums, and ~$7k in HR soft costs.', sample: true },
  { id: 'cs-nonprofit-ny', industryKeywords: ['nonprofit', 'non-profit', 'foundation', 'charity'], state: 'New York', size: [10, 60], total: 19000, medical: 11000, workersComp: 2000, softCosts: 6000,
    summary: 'A New York nonprofit of similar size trimmed about $19k annually — ~$11k in medical premiums, ~$2k on workers’ comp, and ~$6k in HR soft costs.', sample: true },
  { id: 'cs-hosp-ga', industryKeywords: ['restaurant', 'hospitality', 'food', 'catering', 'cafe'], state: 'Georgia', size: [15, 80], total: 24000, medical: 12000, workersComp: 7000, softCosts: 5000,
    summary: 'A Georgia hospitality group of comparable size saved about $24k a year — ~$12k in medical premiums, ~$7k on workers’ comp, and ~$5k in HR soft costs.', sample: true },
  { id: 'cs-re-az', industryKeywords: ['real estate', 'realty', 'property', 'brokerage'], state: 'Arizona', size: [10, 40], total: 21000, medical: 12000, workersComp: 3000, softCosts: 6000,
    summary: 'An Arizona real-estate brokerage of similar size cut about $21k annually — ~$12k in medical premiums, ~$3k on workers’ comp, and ~$6k in HR soft costs.', sample: true },
  { id: 'cs-vet-nc', industryKeywords: ['veterinary', 'animal', 'pet'], state: 'North Carolina', size: [8, 35], total: 23000, medical: 12000, workersComp: 6000, softCosts: 5000,
    summary: 'A North Carolina veterinary practice of comparable size saved roughly $23k a year — ~$12k in medical premiums, ~$6k on workers’ comp, and ~$5k in HR soft costs.', sample: true },
  { id: 'cs-fit-ma', industryKeywords: ['fitness', 'wellness', 'gym', 'studio', 'health club'], state: 'Massachusetts', size: [10, 40], total: 20000, medical: 11000, workersComp: 4000, softCosts: 5000,
    summary: 'A Massachusetts fitness/wellness business of similar size trimmed about $20k annually — ~$11k in medical premiums, ~$4k on workers’ comp, and ~$5k in HR soft costs.', sample: true },
];

export function matchCaseStudies({ industry, state, employees } = {}) {
  const ind = (industry || '').toLowerCase();
  const emp = typeof employees === 'number' && employees > 0 ? employees : null;

  const scored = CASE_STUDIES.map((cs) => {
    let score = 0;
    if (ind && cs.industryKeywords.some((k) => ind.includes(k))) score += 2;
    if (state && cs.state.toLowerCase() === String(state).toLowerCase()) score += 1.5;
    if (emp && emp >= cs.size[0] && emp <= cs.size[1]) score += 1;
    return { cs, score };
  }).sort((a, b) => b.score - a.score);

  if (!scored.length || scored[0].score < 1) return [CASE_STUDIES[0]]; // fall back to one labeled sample
  return scored.filter((x) => x.score >= 1).slice(0, 1).map((x) => x.cs);
}
