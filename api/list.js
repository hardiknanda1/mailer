import { redis } from './_lib.js';

export default async function handler(req, res) {
  const all = (await redis.hgetall('contacts')) || {};
  const list = Object.values(all).sort((a, b) => (b.lastSentAt || '').localeCompare(a.lastSentAt || ''));
  res.json(list);
}
