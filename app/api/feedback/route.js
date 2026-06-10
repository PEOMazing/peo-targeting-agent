import { updateOutcome, storeEnabled } from '../../../lib/store';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    if (!storeEnabled()) {
      return Response.json({ error: 'Store not configured. Add Airtable env vars to capture outcomes.' }, { status: 400 });
    }
    const { id, outcome, whatWorked, notes } = await req.json();
    if (!id) return Response.json({ error: 'Missing record id.' }, { status: 400 });
    await updateOutcome(id, { outcome, whatWorked, notes });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
