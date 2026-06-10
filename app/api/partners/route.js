import { PARTNERS } from '../../../lib/partners';
import { PARTNER_BOOKS } from '../../../lib/demodata';
import { computePartnerAnalytics } from '../../../lib/partneranalytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const partners = computePartnerAnalytics(PARTNER_BOOKS, PARTNERS);
    return Response.json({ demo: true, partners });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
