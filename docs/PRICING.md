# Pricing model

Modeled on how Indian hyperlocal players (Porter, Dunzo, Shadowfax, Swiggy
Genie-style services) actually price, per current market research:

- **Base fare** covers a starting distance (~2 km) and vehicle readiness.
- **Per-km rate** kicks in beyond the base distance.
- **Weight/size surcharge** for anything beyond a small parcel.
- **Wait-time charge** if the rider waits at pickup/drop beyond a grace period.
- **COD fee** — flat fee or a % of order value, whichever is higher (this is
  exactly how Delhivery/Ekart/Shadowfax structure it).
- **Surge multiplier** for peak hours, bad weather, or low rider supply —
  applied as a multiplier on the pre-surge subtotal, not stacked additively.
- **Platform commission** deducted from the total fare; the remainder is the
  rider payout.

## Suggested starting slabs (₹, editable in `pricing_rules` table)

| Vehicle      | Base fare (covers 2 km) | Per extra km | Min fare | Typical use |
|--------------|--------------------------|--------------|----------|-------------|
| Bicycle      | ₹20                      | ₹8           | ₹25      | <3 km, light parcels |
| Bike (2W)    | ₹30                      | ₹9           | ₹40      | Standard city delivery |
| Scooter (EV) | ₹28                      | ₹8           | ₹38      | Standard, lower fuel cost |
| Auto         | ₹45                      | ₹13          | ₹60      | Bulkier items, multi-stop |
| Mini truck   | ₹150                     | ₹25          | ₹200     | Furniture, bulk B2B |

Metro cities (Mumbai, Bengaluru) typically run 10–15% above these defaults —
see the city-override rows in `seed_pricing.sql`.

COD fee: ₹8 flat or 2% of order value, whichever is higher. Platform
commission: 18–20% of the total fare is the market norm for last-mile
aggregators; mini-truck/B2B commissions tend to run lower (~15%) since ticket
sizes are bigger.

All of this lives in the `pricing_rules` table and the `calculate_fare()`
Postgres function in `schema.sql` — nothing is hardcoded in the frontend, so
a manager can retune rates from the admin dashboard without a deploy, and
fares can't be tampered with client-side (the RPC recomputes server-side at
order creation, same pattern used in Marath's `place_order`).

**Not legal/financial advice** — GST (18% on the delivery-service component),
TDS on rider/client payouts, and surge-pricing disclosure rules vary and are
worth confirming with a CA before going live.
