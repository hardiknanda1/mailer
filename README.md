# Mailer – setup

1. **Resend** (resend.com): create an API key. Verify a sending domain (or use onboarding@resend.dev to test).
   Enable **Receiving/Inbound** and note your inbound domain (e.g. `abc123.resend.app`).
2. **Vercel**: push this folder to GitHub, import it in Vercel. In Storage, add **Upstash Redis** and connect it to the project.
3. Add env vars in Vercel:
   - RESEND_API_KEY
   - FROM_EMAIL        e.g. `You <hello@yourdomain.com>`
   - INBOUND_DOMAIN    e.g. `abc123.resend.app`
   - WEBHOOK_SECRET    any random string
   - BRAND_NAME        e.g. `Acme Inc`  (used as {{brand}})
   - SENDER_NAME       e.g. `Priya`      (used as {{sender}})
   - MY_INBOX          optional, your Gmail; replies are copied there too
4. Deploy, then in Resend add a webhook for **email.received** pointing to:
   `https://YOUR-APP.vercel.app/api/inbound?secret=YOUR_WEBHOOK_SECRET`

Edit subject/body in `api/_lib.js`.


Variables available in subject/body: {{name}} {{email}} {{address}} {{brand}} {{sender}}
