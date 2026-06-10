// Channel-partner registry. In production this is fed by your partner/CRM data
// (who a prospect's broker or CPA is). Apollo does NOT reliably supply advisor
// relationships, so matching here is: (1) explicit demo association, then
// (2) opportunistic detection of a partner name in enrichment text.
//
// >>> SAMPLE FOR DEMONSTRATION PURPOSES <<<

export const PARTNERS = {
  'anchor-advisory': { id: 'anchor-advisory', name: 'Anchor Advisory', type: 'Broker', tier: 'Platinum', influencedDeals: 7 },
  'summit-benefits': { id: 'summit-benefits', name: 'Summit Benefits Group', type: 'Broker', tier: 'Gold', influencedDeals: 4 },
  'keystone-financial': { id: 'keystone-financial', name: 'Keystone Financial', type: 'CPA', tier: 'Gold', influencedDeals: 3 },
  'brightwater-cpa': { id: 'brightwater-cpa', name: 'Brightwater CPA', type: 'CPA', tier: 'Silver', influencedDeals: 2 },
};

export function matchPartner(org) {
  if (!org) return null;
  // 1) Explicit association (demo data carries _partnerId).
  if (org._partnerId && PARTNERS[org._partnerId]) return PARTNERS[org._partnerId];
  // 2) Opportunistic: a partner name appears in enrichment text (rare in real data).
  const hay = [
    ...(org.keywords || []),
    ...(org.technologies || []),
    org.description || '',
  ].join(' ').toLowerCase();
  for (const p of Object.values(PARTNERS)) {
    if (hay.includes(p.name.toLowerCase())) return p;
  }
  return null;
}
