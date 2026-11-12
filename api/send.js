import { Resend } from 'resend';
import { redis, TEMPLATES, fill } from './_lib.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id: existingId, name, email, address } = req.body || {};

  let contact;
  let template = TEMPLATES.first;
  if (existingId) {
    contact = await redis.hget('contacts', existingId);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    template = TEMPLATES.followup;
  } else {
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    contact = {
      id: Math.random().toString(36).slice(2, 10),
      name, email, address: address || '',
      status: 'sent', sentCount: 0,
    };
  }

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: contact.email,
    // Replies go to a unique inbound address so we know who replied
    replyTo: [
      `reply+${contact.id}@${process.env.INBOUND_DOMAIN}`,
      ...(process.env.MY_INBOX ? [process.env.MY_INBOX] : []), // also lands in your Gmail
    ],
    subject: fill(template.subject, contact),
    text: fill(template.body, contact),
  });
  if (error) return res.status(500).json({ error: error.message });

  contact.sentCount += 1;
  contact.lastSentAt = new Date().toISOString();
  if (contact.status !== 'replied') contact.status = 'sent';
  await redis.hset('contacts', { [contact.id]: contact });
  res.json(contact);
}
