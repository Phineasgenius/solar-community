# SunShare — Community Solar & Virtual Net Metering

A hackathon-ready Next.js 14 app for discovering community solar plants, subscribing via
Virtual Net Metering (VNM), and simulating DISCOM bill settlements.

## Feature additions (v3)

- **Hero overlay lightened further** and the "How VNM Works" section stays untouched — this pass
  focused on functionality and theme.
- **Real location search, not hardcoded cities.** The Marketplace search box now geocodes
  whatever you type (via OpenStreetMap's free Nominatim API — no key needed) — search "Belgaum"
  and it resolves real coordinates, computes real distances to every plant, and sorts by nearest.
  This is separate from the old "click a city chip" filter, which still exists alongside it.
- **More geographic spread in the mock data.** Added plants near Belagavi (Belgaum), Hubballi,
  Mumbai, Hyderabad, and Kolkata, plus matching illustrative DISCOM tariffs (TSSPDCL, CESC) —
  so distance-based search actually has something nearby to find in more places, not just the
  original 4 cities.
- **Symmetric role switching.** Previously, switching Resident → RWA correctly prompted you
  toward the Host dashboard, but RWA → Resident didn't. Both directions now show a matching
  redirect card, and the navbar's "Dashboard" link always points at whichever dashboard matches
  your current role.
- **New color palette** — swapped the navy/off-white light theme for a dark eco-green theme
  (see table below). This touched nearly every component's text/background classes; I ran a
  clean `npm run build` afterward to confirm nothing broke.

| Token | Used for | Hex |
|---|---|---|
| `surface` | Page background | `#0A2118` |
| `surface-card` | Card backgrounds | `#0F2A20` |
| `surface-muted` | Borders / dividers | `#1F4A38` |
| `navy` | Nav/footer/hero backgrounds | `#0D2B21` |
| `navy-light` | Lighter panel backgrounds | `#163A2D` |
| `navy-dark` | Deepest background | `#071A14` |
| `ink` | Primary text | `#E8F5E9` |
| `ink-muted` | Secondary text | `#A7B8AE` |
| `emerald` | Primary green accent | `#22C55E` |
| `emerald-light` | Bright green (text-on-dark) | `#4ADE80` |
| `gold` | Primary CTA / solar yellow | `#FACC15` |
| `gold-dark` | Warm accent / hover | `#F59E0B` |

## Feature additions (v2)

- **Hero background fixed.** The dark overlay was too strong; it's now much lighter so your
  photo actually shows through, with a subtle text-shadow on the headline so copy stays legible
  regardless of the photo.
- **Geolocation-aware map (Marketplace).** Click "Use my location" to center the map on you (via
  the browser's Geolocation API), see live distance to every plant, sort by nearest, and filter
  by a radius slider. Falls back gracefully (a toast, not a crash) if location is denied/unsupported.
- **Search, type filter, and sort on the Marketplace list**, in addition to the existing city
  filter.
- **Multiple subscriptions per resident.** You can now subscribe to more than one plant; the
  dashboard aggregates savings/generation across all of them, and each shows as a removable chip.
- **Waitlist flow** for plants at ≤5% capacity — "Subscribe" becomes "Join Waitlist" automatically.
- **Toast notifications** (via `sonner`) confirm subscribe/unsubscribe/waitlist/location actions
  instead of failing silently.
- **Notifications bell** in the navbar with a mock activity feed (credits applied, capacity
  alerts, billing cycle closed, new nearby plants).
- **Downloadable settlement statement** — a real `.txt` file generated client-side from the
  dashboard, no backend needed.
- **Search + status filter** on the Host/RWA subscriber ledger table.
- **"How Virtual Net Metering Works"** 4-step explainer section on the landing page.

## What changed from the original brief

- **Maps: React-Leaflet + OpenStreetMap instead of Mapbox GL JS.** No API key, no billing
  account, no signup required — it just works the moment you `npm install`. If you'd rather use
  Mapbox for nicer styling, see "Switching to Mapbox" below.
- **No Supabase required.** State (role, subscriptions, calculator inputs) is handled by Zustand
  with its `persist` middleware, which quietly uses `localStorage` under the hood — this is
  exactly what the brief asked for ("State Management & Mock Data: Zustand + LocalStorage") and
  is enough for a hackathon demo. Nothing to configure.
- **DISCOM tariff numbers are illustrative**, not the real, current published tariff orders.
  They follow the real slab *structure* (fixed charge + rising ₹/unit slabs) for BSES Rajdhani,
  BESCOM, MSEDCL and TANGEDCO, but the actual per-unit rates are approximations for demo
  purposes. Swap in the real tariff-order figures before using this beyond a prototype — this is
  called out again in `src/lib/discomRates.ts`.
- **Next.js pinned to 14.2.35**, not 14.2.5 as loosely implied by "Next.js 14" — 14.2.5 has a
  known security advisory; 14.2.35 is the latest patched release on the 14.x line.
- Shadcn UI components (`Button`, `Card`, `Badge`, `Slider`, `Dialog`, `Tabs`, `Table`) are
  hand-built in `src/components/ui/` in the shadcn style (same API/patterns) rather than pulled
  in via the `shadcn` CLI, so the project has zero interactive setup steps — just `npm install`.

## Do you need Supabase or any API keys?

**No.** As shipped, everything runs on mock data + localStorage. You can `npm install` and
deploy to Vercel with zero environment variables.

You'd only need to add something if you go further than the hackathon scope:
- **Supabase** — only if you want real persistence across devices/users instead of per-browser
  localStorage (e.g. a real subscriber database for the Host dashboard).
- **Mapbox token** — only if you swap React-Leaflet for Mapbox GL JS for nicer map styling.

## 1. Get the files onto your machine

Recreate this exact structure (or unzip the archive you were given):

```
solar-community/
├── public/
│   └── assets/
│       └── hero-bg.jpg        # ← replace this with your own hero photo (same filename)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing page + VNM Calculator
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Resident dashboard
│   │   │   └── host/
│   │   │       └── page.tsx    # RWA / Host dashboard
│   │   └── marketplace/
│   │       └── page.tsx        # Map + plant discovery
│   ├── components/
│   │   ├── ui/                 # button, card, badge, slider, dialog, tabs, table
│   │   ├── Navbar.tsx
│   │   ├── LiveTicker.tsx
│   │   ├── VnmCalculator.tsx
│   │   ├── SolarMap.tsx
│   │   └── AnalyticsChart.tsx
│   ├── lib/
│   │   ├── discomRates.ts      # Slab tariff math
│   │   ├── mockData.ts         # Plants, subscribers, generation history
│   │   └── utils.ts
│   └── store/
│       └── useUserStore.ts     # Zustand store (role, subscription, calculator inputs)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
└── next-env.d.ts
```

## 2. Install & run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Add your hero background image

Drop your own photo at:

```
public/assets/hero-bg.jpg
```

(same filename — it's already wired up in `src/app/page.tsx` via `<Image src="/assets/hero-bg.jpg" ... />`).
A placeholder image ships in that folder so the build doesn't break before you swap it — replace it
with something like a wide (1920×1080+) rooftop/solar-farm photo. It renders behind the hero text at
30% opacity with a navy gradient overlay, so slightly bright/high-contrast photos work best.

## 4. Deploy to Vercel

```bash
npx vercel
```

or connect the GitHub repo in the Vercel dashboard and click Deploy. No environment variables are
required for the app as shipped.

## 5. (Optional) Switching to Mapbox instead of Leaflet

If you'd prefer Mapbox's styling:

1. Get a free token at https://account.mapbox.com/ → add it to Vercel and a local `.env.local` as
   `NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here`.
2. `npm install mapbox-gl react-map-gl`
3. Replace the contents of `src/components/SolarMap.tsx` with a `react-map-gl` `<Map>` + `<Marker>`
   implementation, reading `process.env.NEXT_PUBLIC_MAPBOX_TOKEN`.

## 6. (Optional) Real persistence with Supabase

If you want subscriptions/subscriber data to survive across devices instead of living in the
browser's localStorage:

1. Create a free project at https://supabase.com.
2. `npm install @supabase/supabase-js`
3. Add to `.env.local` / Vercel env vars:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Replace the Zustand `subscribe`/`unsubscribe` actions in `src/store/useUserStore.ts` with calls
   to a Supabase table (e.g. `subscriptions`).

## Notes on the data

- DISCOM slab tariffs (`src/lib/discomRates.ts`) are illustrative, modeled on real tariff
  *structure*, not live published rates.
- Solar yield assumption: 1 kW ≈ 4 units/day (a common rough India-wide estimate).
- Grid emission factor for carbon savings: 0.82 kg CO2/kWh (illustrative India grid average).
- All plant, subscriber, and generation-history data in `src/lib/mockData.ts` is fabricated for
  the demo.
