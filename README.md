# South Canara Real Estate — Website & Admin Platform

A production-quality real estate website: public marketing site + property
catalog + enquiry system, and a protected admin dashboard for managing
listings and leads.

**Stack:** Next.js 14 (App Router, TypeScript) · Tailwind CSS · Supabase
(Postgres, Auth, Storage) · Vercel

---

## 1. What's included

```
app/                   Pages (App Router) — public site + /admin
  actions/             Server Actions (enquiries, auth, properties, leads)
  properties/          /properties and /properties/[slug]
  about/, contact/      Static-ish marketing pages
  admin/
    login/             Public login page (not behind the admin layout)
    (dashboard)/        Everything else under /admin — protected + sidebar
      properties/       List, /new, /[id] (edit + media)
      leads/            Lead inbox with status updates
components/            Reusable UI, grouped by feature (see folder names)
lib/
  supabase/            Browser / server / service-role Supabase clients
  data/                Read-only data access functions (properties, leads)
  config.ts            ALL company info (phone, email, WhatsApp, address...)
  validations.ts       Zod schemas shared by client + server
  utils.ts             formatPriceINR, formatArea, slugify, cn
supabase/
  schema.sql           Full schema + RLS policies + storage buckets — run this once
types/index.ts         Shared TypeScript types
middleware.ts          Protects /admin/*, refreshes the auth session
```

**Nothing is hardcoded.** Properties, images, amenities, and leads all come
from Supabase. Company contact details live in one file: `lib/config.ts`.

---
   
## 2. Local setup (for the developer)

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values — see Section 3
npm run dev
```

## 3. Set up Supabase (one-time)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql`
   → **Run**. This creates every table, RLS policy, trigger, seed amenity,
   and the two storage buckets (`property-images`, `brochures`).
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**keep this secret**)
4. Create the first admin login: **Authentication → Users → Add User**.
   Set an email + password directly (no public sign-up exists in this app
   by design — admin accounts are provisioned manually). Use this to sign
   in at `/admin/login`.

That's the entire backend. There is no separate server to deploy.

## 4. Environment variables

See `.env.example`. Four variables total, three required:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase API settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public — safe in the browser, RLS protects data |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Secret** — server-only, never prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` | No | Without it, map sections show an "Open in Google Maps" link instead of an embed |

---

## 5. Before you go live — replace every placeholder

Search the codebase for these markers and replace them with real content:

- **`lib/config.ts`** — phone, WhatsApp number, email, office address,
  social links, `url` (production domain), and the three location blurbs.
- **`[PLACEHOLDER]` / `[COMPANY ...]` text** in `app/about/page.tsx`,
  `app/privacy-policy/page.tsx`, `app/terms/page.tsx` — real company
  description, mission, team bios, and actual legal policy text (have
  privacy policy and terms reviewed by a professional — the site collects
  personal data via the enquiry form, which is regulated under India's
  Digital Personal Data Protection Act, 2023).
- **Testimonials** in `components/testimonials/testimonials.tsx` — replace
  the three placeholder quotes with real, permissioned customer quotes, or
  wire this to a database table if you want it admin-editable later.
- **Placeholder photography** — every property/hero/about image currently
  falls back to `picsum.photos` (a stock placeholder service) via
  `lib/placeholder.ts`, used *only* when no real image has been uploaded.
  Uploading real photos through the admin dashboard for each property
  automatically replaces these — no code change needed.
- **Logo** — `public/images/logo.jpg` is the file you uploaded. Swap it
  for a higher-resolution export if you have one.

---

## 6. Deploying — step by step

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — South Canara Real Estate"
git branch -M main
git remote add origin https://github.com/<your-org>/south-canara.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Under **Environment Variables**, add the three required Supabase
   variables from Section 4 (and the Maps key if you have one).
4. Click **Deploy**. Vercel builds and gives you a `*.vercel.app` URL.

### Step 3: Connect the client's domain
1. In the Vercel project → **Settings → Domains**, add the company's
   domain (e.g. `southcanararealestate.com`).
2. Vercel shows the DNS records to add. Add them at the domain registrar
   (an `A`/`ALIAS` record for the root domain, a `CNAME` for `www`).
3. Update `lib/config.ts` → `url` to the final domain, and redeploy
   (Vercel auto-redeploys on every push to `main`).

### Step 4: Verify production
- [ ] Homepage, `/properties`, and a property detail page load correctly
- [ ] Submit a test enquiry — confirm it appears under **Admin → Leads**
- [ ] Sign in at `/admin/login`, publish a test property, confirm it
      appears on `/properties`, then unpublish/delete it
- [ ] Upload a real photo, floor plan, and brochure to one property
- [ ] Check the site on an actual phone — nav menu, sticky CTA bar, and
      property gallery
- [ ] Visit `/sitemap.xml` and `/robots.txt` to confirm they resolve
- [ ] Submit [Google Search Console](https://search.google.com/search-console)
      with the sitemap URL for SEO indexing

---

## 7. Handing this over to the real-estate company

Give the client:
1. **The live URL** and **an admin login** (create a fresh one for them
   under Supabase → Authentication rather than sharing your own).
2. A two-line explanation: *"To add a new property, go to
   yoursite.com/admin, log in, click Add Property, fill in the details,
   upload photos, then check Published. It appears on the site
   immediately — no developer needed."*
3. Access to the Supabase and Vercel projects if they want ownership
   (both support transferring project/organization ownership from
   their respective dashboards).

## 8. Extending later (Phase 2 / 3 — not built yet, by design)

The schema and architecture were kept flexible on purpose. Natural next
additions, roughly in order of value:
- Email or WhatsApp notification to staff when a new lead comes in
  (Supabase has a `pg_net`/webhook option, or a scheduled Edge Function)
- A `testimonials` table so testimonials become admin-editable
- A `locations` table (currently a static array in `lib/config.ts`)
- Blog / SEO content section
- Saved properties, property comparison, EMI calculator (all called out
  explicitly in the original spec as *not* V1 — build only if requested)

## 9. A note on the Next.js version

This project pins **Next.js 14.2.35** (the latest patched release on the
14.x line) rather than the newest major version, to keep the App Router
API surface stable for this build. `npm audit` may still flag advisories
whose fixes require the newest major version — that's expected and safe
to leave as-is for now, but worth revisiting a Next.js major-version
upgrade during a future maintenance pass.
