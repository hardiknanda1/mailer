import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ---- Edit your preset emails here ----
export const TEMPLATES = {
  first: {
    subject: 'Hello from {{brand}}, {{name}}',
    body: 'Hi {{name}},\n\nThanks for your time. Just reaching out to say hello. Reply to this email and we will get back to you.\n\nBest,\n{{sender}}\n{{brand}}',
  },
  followup: {
    subject: 'Following up',
    body: 'Hi {{name}},\n\nJust following up on my last email. Let me know if you have any questions.\n\nBest,\n{{sender}}\n{{brand}}',
  },
};

// Replaces {{name}}, {{email}}, {{address}}, {{brand}}, {{sender}} in subject/body.
// brand and sender come from env vars so you never edit code to change them.
export const fill = (text, contact) => {
  const vars = {
    ...contact,
    brand: process.env.BRAND_NAME || '',
    sender: process.env.SENDER_NAME || '',
  };
  return text.replace(/{{(\w+)}}/g, (_, k) => vars[k] ?? '');
};
