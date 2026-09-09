import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';

export default function BecomeRider() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vehicle_type: 'bike_2w',
    vehicle_number: '',
    license_number: '',
    emergency_contact: '',
    bank_account_number: '',
    bank_ifsc: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: riderError } = await supabase.from('riders').insert({
      profile_id: session.user.id,
      ...form,
    });

    if (riderError) {
      setError(riderError.message);
      setSubmitting(false);
      return;
    }

    await supabase.from('profiles').update({ role: 'rider' }).eq('id', session.user.id);
    setSubmitting(false);
    setDone(true);
    setTimeout(() => navigate('/rider'), 1500);
  }

  if (loading) return <p>Loading…</p>;

  if (!session) {
    return (
      <div className="login-page">
        <h1>Earn as a rider</h1>
        <p>Bring a bike, scooter, or auto. Sign in to start your application — it takes about two minutes.</p>
        <GoogleButton label="Continue with Google to apply" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="login-page">
        <h1>Application submitted</h1>
        <p>We'll review your details and documents shortly. Taking you to your rider dashboard…</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Rider application</h1>
      <p>Your documents (Aadhaar, PAN, driving licence, vehicle papers) will be uploaded separately once your application is reviewed. For now, tell us the basics.</p>
      <form onSubmit={submit} className="apply-form">
        <label>
          Vehicle type
          <select value={form.vehicle_type} onChange={(e) => update('vehicle_type', e.target.value)}>
            <option value="bicycle">Bicycle</option>
            <option value="bike_2w">Bike / scooter</option>
            <option value="scooter_ev">Electric scooter</option>
            <option value="auto">Auto</option>
            <option value="mini_truck">Mini truck</option>
          </select>
        </label>
        <label>
          Vehicle number
          <input required value={form.vehicle_number} onChange={(e) => update('vehicle_number', e.target.value)} placeholder="MH12AB1234" />
        </label>
        <label>
          Driving licence number
          <input required value={form.license_number} onChange={(e) => update('license_number', e.target.value)} />
        </label>
        <label>
          Emergency contact number
          <input required value={form.emergency_contact} onChange={(e) => update('emergency_contact', e.target.value)} />
        </label>
        <label>
          Bank account number
          <input required value={form.bank_account_number} onChange={(e) => update('bank_account_number', e.target.value)} />
        </label>
        <label>
          IFSC code
          <input required value={form.bank_ifsc} onChange={(e) => update('bank_ifsc', e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit application'}</button>
      </form>
    </div>
  );
}
