// Demo dataset so a shared hosted link is fully explorable with only the
// Anthropic key set (Apollo/Airtable optional). All clearly labeled in the UI.

export const DEMO_PROSPECTS = [
  { name: 'Lone Star Family Health', domain: 'lonestarfamilyhealth.com', employees: 45, industry: 'Healthcare / medical clinic', state: 'Texas', foundedYear: 2014, technologies: ['Gusto'], keywords: ['family medicine', 'primary care'], description: 'Multi-provider family health clinic.', _openings: 6, _partnerId: 'summit-benefits' },
  { name: 'Summit Dental Group', domain: 'summitdentalgroup.com', employees: 28, industry: 'Dental', state: 'Florida', foundedYear: 2011, technologies: ['Gusto'], keywords: ['dentistry', 'orthodontics'], description: 'Group dental practice with three locations.', _openings: 3, _partnerId: 'keystone-financial' },
  { name: 'Cohen & Park LLP', domain: 'cohenpark.com', employees: 34, industry: 'Legal services', state: 'New York', foundedYear: 2008, technologies: [], keywords: ['litigation', 'corporate law'], description: 'Boutique corporate law firm.', _openings: 1, _partnerId: 'anchor-advisory' },
  { name: 'Northstar Consulting', domain: 'northstarconsulting.com', employees: 60, industry: 'Management consulting', state: 'Colorado', foundedYear: 2013, technologies: ['TriNet'], keywords: ['strategy', 'operations'], description: 'Operations and strategy consultancy.', _openings: 2 },
  { name: 'Brightline Creative', domain: 'brightlinecreative.com', employees: 18, industry: 'Marketing & advertising', state: 'California', foundedYear: 2016, technologies: [], keywords: ['branding', 'creative agency'], description: 'Independent creative and brand agency.', _openings: 0 },
  { name: 'Gulf Coast Builders', domain: 'gulfcoastbuilders.com', employees: 22, industry: 'Construction', state: 'Texas', foundedYear: 2009, technologies: [], keywords: ['general contractor'], description: 'Commercial general contractor.', _openings: 1 },
  { name: 'Cedar & Sage Wellness', domain: 'cedarsagewellness.com', employees: 16, industry: 'Health, wellness & fitness', state: 'Massachusetts', foundedYear: 2018, technologies: ['Gusto'], keywords: ['wellness', 'studio'], description: 'Boutique wellness and fitness studios.', _openings: 0 },
  { name: 'Meridian Staffing', domain: 'meridianstaffing.com', employees: 130, industry: 'Staffing & recruiting', state: 'Georgia', foundedYear: 2006, technologies: ['Justworks'], keywords: ['staffing', 'recruiting'], description: 'Regional staffing agency.', _openings: 9 },
  { name: 'Apex Logistics', domain: 'apexlogistics.com', employees: 210, industry: 'Logistics & transportation', state: 'Illinois', foundedYear: 2004, technologies: ['ADP'], keywords: ['freight', 'warehousing'], description: 'Regional freight and warehousing operator.', _openings: 0 },
  { name: 'Titan Manufacturing', domain: 'titanmfg.com', employees: 520, industry: 'Manufacturing', state: 'Ohio', foundedYear: 1996, technologies: ['Workday'], keywords: ['industrial', 'fabrication'], description: 'Large industrial manufacturer.', _openings: 0 },
];

export const DEMO_STATS = {
  total: 42, won: 14, lost: 9, pending: 19, decided: 23, winRate: 61,
  byBand: [
    { band: 'Strong', won: 8, lost: 2, winRate: 80 },
    { band: 'Good', won: 4, lost: 3, winRate: 57 },
    { band: 'Moderate', won: 2, lost: 3, winRate: 40 },
    { band: 'Weak', won: 0, lost: 1, winRate: 0 },
  ],
};

export const DEMO_DEALS = [
  { id: 'd1', company: 'Lone Star Family Health', state: 'Texas', industry: 'Healthcare', employees: '45', fitScore: 88, outcome: 'Won' },
  { id: 'd2', company: 'Summit Dental Group', state: 'Florida', industry: 'Dental', employees: '28', fitScore: 81, outcome: 'Won' },
  { id: 'd3', company: 'Cohen & Park LLP', state: 'New York', industry: 'Legal', employees: '34', fitScore: 77, outcome: 'Pending' },
  { id: 'd4', company: 'Meridian Staffing', state: 'Georgia', industry: 'Staffing', employees: '130', fitScore: 72, outcome: 'Won' },
  { id: 'd5', company: 'Apex Logistics', state: 'Illinois', industry: 'Logistics', employees: '210', fitScore: 54, outcome: 'Lost' },
];

// Sample partner "books of business" — each advisor's clients with the fit score
// the engine assigned. In production this is your scored base joined to CRM
// partner associations. Used to rank which advisors have the highest-fit books.
export const PARTNER_BOOKS = {
  'anchor-advisory': [
    { name: 'Cohen & Park LLP', industry: 'Legal', fitScore: 91 },
    { name: 'Riverstone Clinic', industry: 'Healthcare', fitScore: 88 },
    { name: 'Brightpath Pediatrics', industry: 'Healthcare', fitScore: 85 },
    { name: 'Meridian Architects', industry: 'Architecture', fitScore: 82 },
    { name: 'Hale Consulting', industry: 'Consulting', fitScore: 79 },
    { name: 'Quill & Co Accounting', industry: 'Accounting', fitScore: 64 },
  ],
  'keystone-financial': [
    { name: 'Summit Dental Group', industry: 'Dental', fitScore: 94 },
    { name: 'Bright Smile Dental', industry: 'Dental', fitScore: 86 },
    { name: 'Cedar Veterinary', industry: 'Veterinary', fitScore: 80 },
    { name: 'Lakeside Medical', industry: 'Healthcare', fitScore: 78 },
    { name: 'Apex Wellness', industry: 'Fitness', fitScore: 72 },
  ],
  'summit-benefits': [
    { name: 'Lone Star Family Health', industry: 'Healthcare', fitScore: 88 },
    { name: 'Northstar Consulting', industry: 'Consulting', fitScore: 86 },
    { name: 'Gulf Coast Builders', industry: 'Construction', fitScore: 81 },
    { name: 'Bayou Logistics', industry: 'Logistics', fitScore: 58 },
    { name: 'Crescent Staffing', industry: 'Staffing', fitScore: 49 },
  ],
  'brightwater-cpa': [
    { name: 'Summit Wellness', industry: 'Fitness', fitScore: 76 },
    { name: 'Apex Logistics', industry: 'Logistics', fitScore: 54 },
    { name: 'Global Freight Co', industry: 'Transportation', fitScore: 44 },
    { name: 'Titan Manufacturing', industry: 'Manufacturing', fitScore: 38 },
  ],
};

// Daily agent feed — the pool the "nightly scan" surfaces as today's top targets.
// In production this is the scored base filtered by fresh signals; here it's sample.
export const DAILY_POOL = [
  { name: 'Riverbend Pediatrics', domain: 'riverbendpeds.com', employees: 38, industry: 'Healthcare / medical clinic', state: 'Texas', foundedYear: 2013, technologies: ['Gusto'], _openings: 5, whyNow: 'Posted 5 new roles this week', _partnerId: 'summit-benefits' },
  { name: 'Cobalt Design Studio', domain: 'cobaltdesign.co', employees: 24, industry: 'Marketing & advertising', state: 'California', foundedYear: 2017, technologies: [], _openings: 3, whyNow: 'Opened a second office' },
  { name: 'Granite Peak Dental', domain: 'granitepeakdental.com', employees: 31, industry: 'Dental', state: 'Colorado', foundedYear: 2010, technologies: ['Justworks'], _openings: 2, whyNow: 'On a competitor PEO — renewal window in 60 days', _partnerId: 'keystone-financial' },
  { name: 'Harbor Light Counseling', domain: 'harborlightcounseling.com', employees: 19, industry: 'Mental health care', state: 'Washington', foundedYear: 2016, technologies: ['Gusto'], _openings: 4, whyNow: 'Headcount up 30% this quarter' },
  { name: 'Sterling Property Group', domain: 'sterlingpg.com', employees: 64, industry: 'Real Estate / Property Management', state: 'Arizona', foundedYear: 2009, technologies: [], _openings: 6, whyNow: 'Expanded to 2 new states' },
  { name: 'Ironclad Mechanical', domain: 'ironcladmech.com', employees: 47, industry: 'Construction', state: 'Texas', foundedYear: 2008, technologies: [], _openings: 7, whyNow: 'Hiring spike — 7 field roles open' },
  { name: 'Northwind Logistics', domain: 'northwindlogistics.com', employees: 88, industry: 'Logistics & transportation', state: 'Illinois', foundedYear: 2011, technologies: ['ADP'], _openings: 3, whyNow: 'Benefits renewal in 45 days' },
  { name: 'Lumen Software', domain: 'lumensoftware.io', employees: 42, industry: 'Software / technology', state: 'Massachusetts', foundedYear: 2018, technologies: [], _openings: 5, whyNow: 'Series A closed last month' },
  { name: 'Maple & Main Hospitality', domain: 'mapleandmain.com', employees: 55, industry: 'Restaurant / hospitality', state: 'Georgia', foundedYear: 2014, technologies: ['Gusto'], _openings: 4, whyNow: 'Opened a third location' },
  { name: 'Verde Wellness Collective', domain: 'verdewellness.com', employees: 22, industry: 'Health, wellness & fitness', state: 'Colorado', foundedYear: 2019, technologies: ['Gusto'], _openings: 2, whyNow: 'New HR leader started — fresh evaluation' },
  { name: 'Hatch & Co Accounting', domain: 'hatchaccounting.com', employees: 29, industry: 'Accounting', state: 'New York', foundedYear: 2012, technologies: [], _openings: 1, whyNow: 'Multi-state hiring picking up', _partnerId: 'anchor-advisory' },
  { name: 'Beacon Veterinary', domain: 'beaconvet.com', employees: 26, industry: 'Veterinary', state: 'North Carolina', foundedYear: 2015, technologies: ['Gusto'], _openings: 3, whyNow: 'Acquired a second clinic' },
  { name: 'Atlas Fabrication', domain: 'atlasfab.com', employees: 73, industry: 'Manufacturing', state: 'Ohio', foundedYear: 2007, technologies: ['Paychex'], _openings: 4, whyNow: 'Workers’ comp renewal coming up' },
  { name: 'Brightway Pediatric Dental', domain: 'brightwaydental.com', employees: 18, industry: 'Dental', state: 'Florida', foundedYear: 2018, technologies: ['Gusto'], _openings: 2, whyNow: 'Rapid growth — outgrowing self-serve benefits' },
];

// Sample follow-ups (used when the rep has no real logged touches yet).
export const FOLLOWUP_POOL = [
  { name: 'Cohen & Park LLP', domain: 'cohenpark.com', employees: 34, industry: 'Legal services', state: 'New York', foundedYear: 2008, technologies: [], _openings: 1, _partnerId: 'anchor-advisory', lastTouchType: 'Call', lastTouchDaysAgo: 4, nextAction: 'Send the benefits comparison you promised on the call.' },
  { name: 'Summit Dental Group', domain: 'summitdentalgroup.com', employees: 28, industry: 'Dental', state: 'Florida', foundedYear: 2011, technologies: ['Gusto'], _openings: 3, _partnerId: 'keystone-financial', lastTouchType: 'Email', lastTouchDaysAgo: 6, nextAction: 'No reply — follow up with the savings one-pager.' },
  { name: 'Northstar Consulting', domain: 'northstarconsulting.com', employees: 60, industry: 'Management consulting', state: 'Colorado', foundedYear: 2013, technologies: ['TriNet'], _openings: 2, lastTouchType: 'LinkedIn', lastTouchDaysAgo: 9, nextAction: 'Re-engage — their competitor PEO renewal window is opening.' },
];
