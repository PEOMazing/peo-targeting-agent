// Recommended contacts for a company. Uses Apollo people search when a key is
// present; otherwise returns clearly-labeled sample contacts so the demo works.

const FIRST = ['Sarah', 'Michael', 'Jessica', 'David', 'Emily', 'James', 'Ashley', 'Robert', 'Jennifer', 'Daniel', 'Laura', 'Brian', 'Megan', 'Kevin', 'Rachel', 'Eric'];
const LAST = ['Reynolds', 'Carter', 'Nguyen', 'Patel', 'Morales', 'Bennett', 'Foster', 'Hayes', 'Brooks', 'Coleman', 'Sullivan', 'Reed', 'Barnes', 'Russell', 'Hughes', 'Price'];

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return h; }
function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }
function cleanDomain(domain) { return (domain || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, ''); }
function emailFor(first, last, domain) { const d = cleanDomain(domain); return d ? `${first.toLowerCase()}.${last.toLowerCase()}@${d}` : null; }

export function demoContacts({ name, domain, industry, employees } = {}) {
  const seed = hash((name || '') + (domain || ''));
  const small = employees && Number(employees) < 30;
  const roles = [
    { title: 'Founder / CEO', priority: 'Primary', why: 'Economic buyer — owns the cost and the people decision.' },
    { title: 'Head of People / HR', priority: 'Primary', why: 'Feels the HR and compliance pain a PEO removes.' },
    { title: small ? 'Office Manager' : 'Controller / Finance', priority: 'Secondary', why: 'Owns the benefits cost and the payroll relationship.' },
  ];
  return roles.map((role, i) => {
    const f = pick(FIRST, seed + i * 7); const l = pick(LAST, seed + i * 13);
    return { name: `${f} ${l}`, title: role.title, email: emailFor(f, l, domain), priority: role.priority, why: role.why, sample: true };
  });
}

export async function apolloContacts(domain) {
  const key = process.env.APOLLO_API_KEY;
  const d = cleanDomain(domain);
  if (!key || !d) return [];
  const res = await fetch('https://api.apollo.io/v1/mixed_people/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Api-Key': key },
    body: JSON.stringify({ q_organization_domains: d, person_titles: ['owner', 'founder', 'ceo', 'president', 'head of people', 'hr director', 'human resources', 'cfo', 'controller', 'office manager'], page: 1, per_page: 5 }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  const people = data.people || data.contacts || [];
  return people.slice(0, 4).map((p) => ({
    name: [p.first_name, p.last_name].filter(Boolean).join(' ') || p.name || '—',
    title: p.title || '',
    email: p.email || null,
    priority: /owner|founder|ceo|president/i.test(p.title || '') ? 'Primary' : 'Secondary',
    why: '',
    sample: false,
  }));
}
