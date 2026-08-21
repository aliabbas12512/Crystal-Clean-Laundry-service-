# Crystal Clean Laundry Service

Account-free laundry pickup/delivery booking + live order tracking, with a
secure admin portal to manage orders and business content. Next.js (App
Router) + TypeScript + Tailwind CSS, Supabase (Postgres) for data.

## Run locally

```
npm install
cp .env.example .env.local   # fill in the values, see table below
npm run dev
```

## How it works

- **Public site** (`/`): hero, how it works, packages, why choose us,
  reviews, FAQ, contact — all bilingual (Arabic default + English), RTL-aware.
- **Booking**: "Book a Pickup" opens a 4-step wizard (package → details →
  review → confirm). No account required — completing it creates an order
  in Supabase and returns a unique Order ID (`CCL-YYYY-NNNN`, generated
  atomically by a Postgres function so IDs never collide).
- **Order tracking** (`/track`): enter an Order ID to see a live status
  progress tracker. Looked up via a `SECURITY DEFINER` Postgres function
  scoped to one exact order — the public key can never list/browse orders.
- **Admin portal** (`/admin`): login, dashboard (order counts + revenue),
  orders (search/filter/status update/edit pickup time & price/delete),
  and settings (business name, WhatsApp/call numbers, address, hours, and
  full package editing — name/description/price/features per language).
- **Snapchat tracking** (`src/lib/tracking.ts`): Snap Pixel fires `PAGE_VIEW`
  on load, `VIEW_CONTENT` when a package is selected, and `SIGN_UP` when a
  booking is confirmed (the real conversion event here). UTM params and
  Snapchat's `?ScCid=` click id are captured on landing and stored on the
  order, so the admin Orders table shows a "Snapchat" source badge per
  order and the order drawer shows full UTM attribution.

## Environment variables

| Variable | Where to get it | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SNAP_PIXEL_ID` | Already defaults to the Crystal Clean pixel — only set to switch pixels | No |
| `SUPABASE_URL` | Supabase dashboard → Project Settings → API | No |
| `SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API (anon/publishable key) | No (RLS-restricted) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API (service_role / "Secret key") | **Yes — server only** |
| `ADMIN_USERNAME` | Choose your own | Yes |
| `ADMIN_PASSWORD` | Choose your own (strong, unique) | Yes |
| `ADMIN_JWT_SECRET` | Generate with `openssl rand -hex 32` | Yes |

## Database

Tables live in Supabase, prefixed `ccl_` (`ccl_orders`, `ccl_settings`,
`ccl_order_counters`). Row Level Security is enabled with no client-facing
policies except: public read on `ccl_settings`, and the `ccl_track_order`
function for order lookups. All writes (order creation, admin actions) go
through server-side API routes using the service role key.

## Deployment

Deploy this repo on Vercel as its own project — do not point it at any
other Vercel project or domain used by a previous site. Framework preset
"Next.js" is auto-detected.
