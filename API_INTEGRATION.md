# Client integration API

Goal: a hotel's booking system, or an e-commerce seller's order system, can
create a delivery order on WadaGo and get pushed live status updates —
the same shape as integrating with Amazon's delivery API or a Shiprocket/
Porter business API.

## Auth
Every approved client gets an `api_key` (see `clients.api_key`, issued only
after verification). Sent as a header on every request:

```
Authorization: Bearer <api_key>
```

## 1. Create an order
`POST /functions/v1/create-order` (Supabase Edge Function)

```json
{
  "customer_name": "Aditi Sharma",
  "customer_phone": "+919876543210",
  "pickup_address": "Hotel Meridian, MG Road, Pune",
  "pickup_lat": 18.5204, "pickup_lng": 73.8567,
  "dropoff_address": "Flat 302, Aundh, Pune",
  "dropoff_lat": 18.5636, "dropoff_lng": 73.8077,
  "package_description": "Room-service order, 2 boxes",
  "package_weight_kg": 2.5,
  "vehicle_type": "bike_2w",
  "is_cod": false,
  "order_value": 850
}
```

The function looks up the client from the API key, calls `calculate_fare()`
server-side (never trust a client-supplied price), inserts the row, and
returns the created order with its `order_code` and `total_fare`.

## 2. Status push (webhook to the client)
Whenever `orders.status` changes, a trigger (or a small worker polling
`client_webhook_deliveries`) POSTs to the client's own `webhook_url`:

```json
{
  "event": "order.status_changed",
  "order_code": "WG-2026-000123",
  "status": "picked_up",
  "rider": { "name": "Ravi K.", "phone": "+9198xxxxxxx", "vehicle_number": "MH12AB1234" },
  "timestamp": "2026-09-09T10:32:00Z"
}
```

Retries with backoff are tracked in `client_webhook_deliveries`
(`attempt_count`, `delivered`) — same idea as Amazon SNS/webhook retry
semantics, so a client's flaky endpoint doesn't silently drop updates.

## 3. Live polling (fallback)
`GET /functions/v1/order-status?order_code=WG-2026-000123` for clients who'd
rather poll than run a webhook receiver.

## 4. Realtime for in-house dashboards
Internal dashboards (admin/manager/support/rider) don't need the REST layer —
they subscribe directly to Supabase Realtime on `orders` and
`order_status_history`, same pattern as Marath's order tracking.

## Rate limits & security
- Rate-limit by `api_key` at the edge-function layer.
- Log every inbound request for audit (who created what, when).
- Rotate `api_key` on demand from the client dashboard; old key invalidated
  immediately.
