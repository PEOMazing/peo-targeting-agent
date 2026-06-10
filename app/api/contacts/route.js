import { apolloEnabled } from '../../../lib/apollo';
import { demoContacts, apolloContacts } from '../../../lib/contacts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req) {
  try {
    const b = await req.json();
    let contacts = [];
    if (apolloEnabled() && b.domain) { try { contacts = await apolloContacts(b.domain); } catch {} }
    const demo = !contacts.length;
    if (demo) contacts = demoContacts(b);
    return Response.json({ demo, contacts });
  } catch (err) {
    return Response.json({ error: err?.message || 'Unexpected error.' }, { status: 500 });
  }
}
