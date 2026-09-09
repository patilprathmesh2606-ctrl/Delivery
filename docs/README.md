# WadaGo — Pickup & Delivery Platform (scaffold)

A starting point for a multi-role pickup-and-delivery platform for the Indian
market — React + Supabase, in the same spirit as Marath but for logistics
instead of restaurant ordering.

## What's here
- `supabase/schema.sql` — full data model: profiles/roles, riders + documents
  + verification, clients (businesses) + documents + verification, orders,
  pricing rules, a server-side `calculate_fare()` function, support tickets,
  rider payouts, client webhook delivery log, and starter RLS policies.
- `supabase/seed_pricing.sql` — starting fare slabs based on current Indian
  hyperlocal-delivery market rates.
- `docs/PRICING.md` — how and why the fares are structured this way.
- `docs/VERIFICATION.md` — rider and client KYC/audit workflow.
- `docs/API_INTEGRATION.md` — how an external client system (hotel booking
  engine, e-commerce backend) creates orders and receives status webhooks,
  the way it would with Amazon's delivery or a Shiprocket/Porter business API.
- `src/` — a React (Vite) app with role-based routing and one working
  dashboard shell per role (admin/manager, rider, client, support), each
  wired to real Supabase queries so they're a base to build on, not just UI.

## Setup
1. Create a Supabase project, then run `supabase/schema.sql` followed by
   `supabase/seed_pricing.sql` in the SQL editor.
2. Put your project URL and anon key into `src/lib/supabaseClient.js`.
3. `npm install && npm run dev`.
4. Create a user via Supabase Auth, then insert a matching row in `profiles`
   with the right `role` to see each dashboard (until you build a proper
   signup/role-assignment flow).

## What's intentionally not built yet
This is a foundation, not a finished product — a platform this size (4
dashboards + external API + payments + live rider tracking) is realistically
weeks of work, not one pass. Not yet built: the customer-facing order/track
page, live map view with rider location, the actual Edge Functions for
`create-order` / webhook dispatch (documented, not implemented), payment
collection/settlement, and push notifications. Tell me which piece to build
out next and I'll take it from a shell to something real.
