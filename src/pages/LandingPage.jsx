import { Link } from 'react-router-dom';
import '../landing.css';

const FARES = [
  { vehicle: 'Bicycle', use: 'Small parcels, under 3 km', base: 20, perKm: 8 },
  { vehicle: 'Bike', use: 'Standard city delivery', base: 30, perKm: 9 },
  { vehicle: 'Auto', use: 'Bulkier items, multi-stop', base: 45, perKm: 13 },
  { vehicle: 'Mini truck', use: 'Furniture, bulk orders', base: 150, perKm: 25 },
];

export default function LandingPage() {
  return (
    <div className="land">
      <header className="land-header">
        <span className="land-word">WadaGo</span>
        <nav className="land-nav">
          <a href="#fares">Fares</a>
          <a href="#paths">Get started</a>
          <a href="#verify">Verification</a>
          <Link to="/login" className="land-nav-signin">Sign in</Link>
        </nav>
      </header>

      <section className="land-hero">
        <div className="land-hero-copy">
          <h1>Get it picked up. Get it delivered.<br />Same city, same day.</h1>
          <p>
            WadaGo moves parcels, food, and shop orders across the city on
            bikes, autos, and mini trucks — riders you can track, fares fixed
            before pickup, and a direct line into your own booking system if
            you run a hotel, restaurant, or online store.
          </p>
          <div className="land-cta-row">
            <Link to="/become-rider" className="land-btn land-btn-primary">Ride with us</Link>
            <Link to="/become-partner" className="land-btn land-btn-ghost">Partner with us</Link>
          </div>
          <p className="land-note">Currently onboarding riders and partners in Pune, Mumbai, and Bengaluru.</p>
        </div>

        <div className="land-hero-art" role="img" aria-label="A delivery route from pickup to drop-off, showing distance, time, and fare">
          <svg viewBox="0 0 420 340">
            <line x1="70" y1="260" x2="330" y2="80" stroke="#C9CFC7" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
            <circle cx="70" cy="260" r="9" fill="#16213A" />
            <circle cx="330" cy="80" r="9" fill="#FF7A1A" />
            <g transform="translate(190,178)">
              <circle r="22" fill="#FFFFFF" stroke="#16213A" strokeWidth="2" />
              <path d="M-9,4 L-3,-6 L5,-6 L9,4 M-9,4 L9,4 M-4,4 L-4,-1 L2,-1 L2,4" stroke="#16213A" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
            </g>
            <g transform="translate(105,235)">
              <rect x="-38" y="-15" width="76" height="26" rx="4" fill="#FFFFFF" stroke="#C9CFC7" />
              <text x="0" y="3" textAnchor="middle" fontSize="12" fontFamily="'IBM Plex Sans', sans-serif" fill="#16213A">2.4 km</text>
            </g>
            <g transform="translate(255,150)">
              <rect x="-34" y="-15" width="68" height="26" rx="4" fill="#FFFFFF" stroke="#C9CFC7" />
              <text x="0" y="3" textAnchor="middle" fontSize="12" fontFamily="'IBM Plex Sans', sans-serif" fill="#16213A">18 min</text>
            </g>
            <g transform="translate(330,120)">
              <rect x="-28" y="-15" width="56" height="26" rx="4" fill="#FF7A1A" />
              <text x="0" y="3" textAnchor="middle" fontSize="12" fontFamily="'Space Grotesk', sans-serif" fontWeight="600" fill="#3A1600">₹52</text>
            </g>
            <text x="70" y="290" textAnchor="middle" fontSize="12" fontFamily="'IBM Plex Sans', sans-serif" fill="#5B6B7C">Pickup</text>
            <text x="330" y="58" textAnchor="middle" fontSize="12" fontFamily="'IBM Plex Sans', sans-serif" fill="#5B6B7C">Drop-off</text>
          </svg>
        </div>
      </section>

      <section id="fares" className="land-fares">
        <h2>What it costs</h2>
        <p className="land-section-sub">Every fare is fixed before the rider is assigned, calculated the same way every time — no bargaining, no surprise add-ons.</p>
        <div className="land-fare-row">
          {FARES.map((f) => (
            <div className="land-fare-card" key={f.vehicle}>
              <p className="land-fare-vehicle">{f.vehicle}</p>
              <p className="land-fare-use">{f.use}</p>
              <p className="land-fare-price">from ₹{f.base}</p>
              <p className="land-fare-detail">+ ₹{f.perKm} per km after the first 2 km</p>
            </div>
          ))}
        </div>
        <p className="land-fare-footnote">Cash-on-delivery orders carry a small handling fee. Metro cities run slightly higher due to fuel and traffic.</p>
      </section>

      <section id="paths" className="land-paths">
        <h2>Three ways in</h2>
        <div className="land-pass-row">
          <div className="land-pass">
            <p className="land-pass-kind">Book a delivery</p>
            <h3>Customers and shops</h3>
            <p>Send a parcel, order pickup from a local shop, or track a delivery already on its way.</p>
            <Link to="/login" className="land-pass-link">Sign in to book</Link>
          </div>
          <div className="land-pass">
            <p className="land-pass-kind">Earn as a rider</p>
            <h3>Delivery partners</h3>
            <p>Bring a bike, scooter, or auto. Go online when you want, get assigned nearby orders, get paid weekly.</p>
            <Link to="/become-rider" className="land-pass-link">Apply to ride</Link>
          </div>
          <div className="land-pass">
            <p className="land-pass-kind">Plug in your business</p>
            <h3>Hotels, restaurants, sellers</h3>
            <p>Send us orders from your own system and get live status pushed straight back to it, the way you'd integrate any courier partner.</p>
            <Link to="/become-partner" className="land-pass-link">Register your business</Link>
          </div>
        </div>
      </section>

      <section id="verify" className="land-verify">
        <h2>How we verify riders and partners</h2>
        <p className="land-section-sub">Nobody goes live until this is done — it protects the people ordering as much as the people delivering.</p>
        <ol className="land-steps">
          <li><span className="land-step-num">1</span><div><p className="land-step-title">Sign up</p><p>Phone number, basic details, and the vehicle or business you're bringing.</p></div></li>
          <li><span className="land-step-num">2</span><div><p className="land-step-title">Upload documents</p><p>Riders: Aadhaar, PAN, driving licence, vehicle papers. Businesses: PAN, GSTIN, bank details.</p></div></li>
          <li><span className="land-step-num">3</span><div><p className="land-step-title">We verify</p><p>Identity and licence checks, plus a police clearance for riders handling cash-on-delivery orders.</p></div></li>
          <li><span className="land-step-num">4</span><div><p className="land-step-title">You're live</p><p>Riders can go online for orders; businesses get an API key to start sending them.</p></div></li>
        </ol>
      </section>

      <footer className="land-footer">
        <span className="land-word land-word-light">WadaGo</span>
        <p>Pickup and delivery for Indian cities.</p>
        <Link to="/login" className="land-footer-link">Sign in</Link>
      </footer>
    </div>
  );
}
