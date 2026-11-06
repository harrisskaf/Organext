# ORGANEXT

Marketing site for ORGANEXT. Greek, white, one page plus privacy and terms.

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

The dev server defaults to [http://localhost:3000](http://localhost:3000).

## Logo

The mark is `public/brand/organext-logo.png`, the supplied monogram with the black background removed. It is used from `components/logo.tsx` and as `app/icon.png`. Do not redraw it.

## Placeholders

- No phone, address, or social accounts are shown, because none were provided.
- The site does not list projects, clients, or results.

## Contact delivery

The form validates in the browser and again in `app/api/contact/route.ts`. It does not show a success message unless an email was actually accepted.

Delivery stays off until all three variables are set (see `.env.example`):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Do not invent values. With any of them missing, a valid submission returns HTTP 503 and the message that the note was checked, not sent, and not stored.

`NEXT_PUBLIC_SITE_URL` sets the canonical URL, sitemap, and Open Graph base. No trailing slash.
