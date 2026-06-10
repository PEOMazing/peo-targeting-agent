import { listDeals, computeStats, storeEnabled } from '../../../lib/store';
import { DEMO_STATS, DEMO_DEALS } from '../../../lib/demodata';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEMO = process.env.DEMO_MODE === '1';

export async function GET() {
  try {
    // Demo (forced, or when Airtable isn't configured): show sample stats so the
    // "it learns" dashboard is populated on a shared link. Flagged to the client.
    if (DEMO || !storeEnabled()) {
      return Response.json({ enabled: true, demo: true, stats: DEMO_STATS, deals: DEMO_DEALS });
    }
    const deals = await listDeals(100);
    const stats = computeStats(deals);
    return Response.json({ enabled: true, demo: false, deals, stats });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
