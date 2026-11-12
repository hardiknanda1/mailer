import { redis } from './_lib.js';

// Resend calls this webhook when an email arrives at your inbound address.
export default async function handler(req, res) {
  if (req.query.secret !== process.env.WEBHOOK_SECRET) return res.status(401).end();

  const data = req.body?.data || {};
  const to = [].concat(data.to || []).join(' ');
  const match = to.match(/reply\+([a-z0-9]+)@/i);
  if (!match) return res.json({ ignored: true });

  const contact = await redis.hget('contacts', match[1]);
  if (contact) {
    contact.status = 'replied';
    contact.repliedAt = new Date().toISOString();
    contact.replySubject = data.subject || '';
    await redis.hset('contacts', { [contact.id]: contact });
  }
  res.json({ ok: true });
}
