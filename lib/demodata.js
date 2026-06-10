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
