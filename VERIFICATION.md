# Verification & audit workflows

## Rider (delivery partner) onboarding

Based on how Zomato/Swiggy/Shadowfax-style platforms actually onboard riders
in India today:

1. **Sign up** — phone number + OTP (Supabase Auth phone provider or
   OTP-via-SMS webhook).
2. **Digital KYC (instant)**
   - Aadhaar number → OTP/DigiLocker verification (via a licensed eKYC API —
     UIDAI requires platforms to go through an authorised route, you cannot
     verify Aadhaar directly yourself).
   - PAN → validated against the Income Tax e-filing PAN API.
   - Driving licence → validated on the Sarathi/VAHAN portal (also via a
     verification API provider — several exist: IDfy, HyperVerge, Digitap).
   - Store only the **last 4 digits** of Aadhaar plus the eKYC provider's
     verification reference — never the full Aadhaar number (see schema:
     `riders.aadhaar_last4`).
3. **Document upload** — vehicle RC, vehicle insurance, a selfie for face
   match, bank account/cancelled cheque for payouts. Each lands in
   `rider_documents` with its own `status`.
4. **Police verification / background check** — mandatory in most metros
   before a rider can go live for high-value or COD orders. Either a formal
   Police Clearance Certificate or a third-party background-check API
   (IDfy, SpringVerify). Track `police_verification_status` and
   `police_verification_expiry` — PCCs are typically valid 6–12 months and
   need periodic renewal.
5. **Manual review** — an ops/manager reviews anything the automated checks
   flag (name mismatches, blurry uploads, expired documents) before setting
   `verification_status = approved`.
6. **Ongoing audit** — random re-verification, rating-based flags (rider
   rating drops below a threshold), and automatic suspension if a document
   expires (insurance, PCC) until renewed.

## Client (business) onboarding

For hotels, restaurants, and e-commerce sellers who want to plug into the
platform:

1. **Business KYC** — PAN, GSTIN (mandatory once turnover crosses the GST
   threshold or the business sells through this marketplace), certificate of
   incorporation for companies, FSSAI licence if the business handles food.
2. **Bank verification** — account number + IFSC, verified with a penny-drop
   API before enabling payouts/settlements.
3. **Address & ownership proof** — utility bill or rent agreement for the
   registered address; ID proof of the authorised signatory.
4. **Manual/automated review** — same pattern as riders: documents land in
   `client_documents`, staff approve or reject with a reason, and
   `verification_status` gates whether the client's `api_key` is issued.
5. **API key issuance** — only generated once `verification_status =
   approved`; this is what the client's own system uses to create orders and
   receive webhook callbacks (see `API_INTEGRATION.md`).
6. **Ongoing audit** — periodic KYC refresh (RBI-style guidance suggests every
   2 years for higher-risk accounts), dispute-rate monitoring, and the
   ability for admins to suspend a client without deleting their history.

## Roles summary

| Role      | Can do |
|-----------|--------|
| admin     | Everything: pricing, verification approvals, all dashboards, staff accounts |
| manager   | Day-to-day ops: verification review, order monitoring, rider assignment, reports |
| support   | Support tickets, order lookup, limited rider/client contact info |
| rider     | Own profile, go online/offline, accept/update assigned orders |
| client    | Own orders, own webhook/API key, own delivery-charge invoices |
| customer  | Place/track their own orders (only relevant if you allow direct retail bookings, not just B2B client orders) |
