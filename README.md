# Jewellery Palace BJS

Storefront and super admin portal for Jewellery Palace BJS, built by NuForge Labs.

Next.js 15 (App Router) · TypeScript · React 19 · Drizzle ORM · PostgreSQL · deploys to Vercel.

---

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The admin portal is at `/admin` — sign in with the
credentials in `.env.local` (`owner@jewellerypalacebjs.com` / `demo1234` out of the box).

There is no database to set up first. With `DATABASE_URL` unset the app runs on a
built-in store seeded with the full BJS catalogue, mirrored to `data/store.json` so
your changes survive a restart. Everything works: browsing, cart, checkout, orders,
and full CRUD in the portal.

## Switch to Supabase (or any Postgres)

Nothing in the application code changes. Add the connection string and push the schema:

```bash
# .env.local
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"
```

```bash
npm run db:push   # creates the tables from src/lib/db/schema.ts
npm run db:seed   # loads the catalogue and four sample orders
```

The repository layer in `src/lib/repo.ts` detects `DATABASE_URL` and routes every read
and write to Postgres instead of the local store. The admin portal shows a banner
whenever it is still running on the built-in store, so you always know which one is live.

## Deploy to Vercel

1. Push this folder to a Git repository.
2. Import it in Vercel. No build settings to change.
3. Add the environment variables from `.env.example` in **Project Settings → Environment Variables**.
   Set a real `ADMIN_SESSION_SECRET` (any long random string) and a real `ADMIN_PASSWORD`.
4. Deploy.

Set `DATABASE_URL` before the first production deploy. Serverless filesystems are
read-only and reset between invocations, so the built-in store is for local development
and demos only — in production it would forget every order.

## What is built

**Storefront**

| Route | What it does |
| --- | --- |
| `/` | Home: hero, categories, featured pieces, bridal band |
| `/collection` | Full catalogue with category, metal, purity, budget and search filters, plus sorting. All filter state lives in the URL, so results are shareable and server-rendered. |
| `/product/[slug]` | Product detail: specs, three generated views, policies, add to cart |
| `/bridal`, `/story`, `/policies` | Supporting pages |
| `/cart` | Cart with quantity controls, backed by an httpOnly cookie |
| `/checkout` | Address, UPI QR and bank details, receipt upload, server-side validation |
| `/order/[reference]` | Confirmation with the order reference and what was bought |

**Admin portal** (`/admin`, session-gated by middleware)

- Dashboard: order count, receipts awaiting verification, pieces live, stock value, recent orders, low stock
- Orders: every order with its receipt and payment reference, and a status control
  (payment under review → confirmed → packed → out for delivery → delivered)
- Products: full CRUD. Adding or editing a piece updates the storefront immediately
- Categories: full CRUD, inline rename, reflected in the storefront filters and footer

Placing an order decrements stock. Deleting a product removes it from the storefront
but leaves past orders intact, since each order stores its own line-item snapshot.

## Project structure

```
src/
  app/                 routes (App Router, server components by default)
    admin/             portal, its own layout, middleware-gated
  actions/             server actions: cart, checkout, admin mutations
  components/          shared UI, including the generated jewellery artwork
  lib/
    db/
      schema.ts        Drizzle Postgres schema, single source of truth
      seed-data.ts     the BJS catalogue
      local-store.ts   zero-config store used when DATABASE_URL is unset
      seed.ts          seeds a real Postgres database
    repo.ts            every read and write in the app goes through here
    cart.ts            cookie-backed cart
    auth.ts            signed-cookie admin session
    format.ts          INR formatting (money is stored in paise, never floats)
```

## Notes for the BJS handover

- **Photography.** Products carry an optional `imageUrl`. Until the shop supplies
  photographs, `JewelArt` draws a metallic study of the right kind of piece, so the
  catalogue is never empty. Paste a URL into the product form and it takes over.
- **Payment QR.** `src/app/checkout/checkout-form.tsx` renders a placeholder code.
  Replace it with the shop's real UPI QR image before launch. Bank details already
  come from environment variables.
- **Receipts.** Uploads are written to `public/uploads`, which works locally and on a
  Node host but not on serverless. Move this to Supabase Storage before going live;
  it is one function, `storeReceipt` in `src/actions/checkout.ts`.
- **Prices** are stored in paise as integers. Use `formatInr` to display and
  `rupeesToMinor` to parse. No floats anywhere near money.
- **Admin credentials** come from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. For more than one
  staff account, move to a `users` table with hashed passwords — the session layer in
  `src/lib/auth.ts` already carries an email and will not need changing.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Push the Drizzle schema to `DATABASE_URL` |
| `npm run db:seed` | Seed that database with the BJS catalogue |
