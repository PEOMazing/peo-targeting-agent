// Rank channel partners by the PEO-fit quality of their client book.
// "Which advisors have the highest concentration of fit-the-mold clients?"
export function computePartnerAnalytics(books, registry) {
  return Object.values(registry)
    .map((p) => {
      const book = books[p.id] || [];
      const n = book.length;
      const high = book.filter((c) => c.fitScore >= 75).length;
      const highPct = n ? Math.round((high / n) * 100) : 0;
      const avg = n ? Math.round(book.reduce((s, c) => s + c.fitScore, 0) / n) : 0;
      const inds = {};
      book.forEach((c) => { const k = c.industry || '—'; inds[k] = (inds[k] || 0) + 1; });
      const topIndustry = Object.entries(inds).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
      const recommendation = highPct >= 70 ? 'Prioritize — co-sell' : highPct >= 45 ? 'Engage' : 'Low priority';
      return { ...p, clientCount: n, avgFit: avg, highFitCount: high, highFitPct: highPct, topIndustry, recommendation, book };
    })
    .sort((a, b) => b.highFitPct - a.highFitPct || b.avgFit - a.avgFit);
}
