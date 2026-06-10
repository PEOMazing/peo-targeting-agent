// Apollo.io enrichment. Degrades gracefully if APOLLO_API_KEY is absent.
// Auth + endpoints confirmed against docs.apollo.io (X-Api-Key header;
// single: GET /organizations/enrich?domain=, bulk up to 10: POST /organizations/bulk_enrich).

const BASE = 'https://api.apollo.io/api/v1';

export function apolloEnabled() {
  return !!process.env.APOLLO_API_KEY;
}

export function normalizeDomain(input) {
  if (!input) return '';
  let d = String(input).trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/^www\./, '');
  d = d.split('/')[0].split('?')[0].split('#')[0];
  return d;
}

function normOrg(o) {
  if (!o) return null;
  const dom = o.primary_domain || o.website_url || '';
  return {
    name: o.name || o.organization_name || '',
    domain: normalizeDomain(dom),
    employees: typeof o.estimated_num_employees === 'number' ? o.estimated_num_employees : null,
    industry: o.industry || '',
    revenue: o.organization_revenue || o.annual_revenue_printed || o.annual_revenue || null,
    foundedYear: o.founded_year || null,
    city: o.city || '',
    state: o.state || '',
    country: o.country || '',
    keywords: Array.isArray(o.keywords) ? o.keywords.slice(0, 20) : [],
    technologies: Array.isArray(o.technology_names) ? o.technology_names.slice(0, 40) : [],
    description: o.short_description || o.seo_description || '',
    linkedin: o.linkedin_url || '',
    website: o.website_url || '',
  };
}

async function bulkEnrich(domains) {
  const params = new URLSearchParams();
  domains.forEach((d) => params.append('domains[]', d));
  const res = await fetch(`${BASE}/organizations/bulk_enrich?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': process.env.APOLLO_API_KEY,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Apollo ${res.status}: ${t.slice(0, 160)}`);
  }
  const data = await res.json();
  // Field name can vary across plans/versions; handle the common shapes.
  return data.organizations || data.results || data.data || [];
}

// companies: [{ name?, domain }]
export async function enrichCompanies(companies) {
  if (!apolloEnabled()) {
    return companies.map((c) => ({ input: c, org: null, error: 'Apollo not configured' }));
  }
  const withDomain = companies
    .map((c) => ({ ...c, domain: normalizeDomain(c.domain) }))
    .filter((c) => c.domain);

  const out = [];
  for (let i = 0; i < withDomain.length; i += 10) {
    const batch = withDomain.slice(i, i + 10);
    try {
      const orgs = await bulkEnrich(batch.map((b) => b.domain));
      batch.forEach((b, idx) => {
        const match =
          orgs.find((o) => normalizeDomain(o.primary_domain || o.website_url || '') === b.domain) ||
          orgs[idx] ||
          null;
        out.push({ input: b, org: match ? normOrg(match) : null, error: match ? null : 'No Apollo match' });
      });
    } catch (e) {
      batch.forEach((b) => out.push({ input: b, org: null, error: e.message }));
    }
  }
  return out;
}
