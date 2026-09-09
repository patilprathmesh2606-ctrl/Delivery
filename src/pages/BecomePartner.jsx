import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';

export default function BecomePartner() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_name: '',
    business_type: 'restaurant',
    gstin: '',
    pan: '',
    contact_phone: '',
    registered_address: '',
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

    const { error: clientError } = await supabase.from('clients').insert({
      owner_profile_id: session.user.id,
      contact_email: session.user.email,
      ...form,
    });

    if (clientError) {
      setError(clientError.message);
      setSubmitting(false);
      return;
    }

    await supabase.from('profiles').update({ role: 'client' }).eq('id', session.user.id);
    setSubmitting(false);
    setDone(true);
    setTimeout(() => navigate('/client'), 1500);
  }

  if (loading) return <p>Loading…</p>;

  if (!session) {
    return (
      <div className="login-page">
        <h1>Register your business</h1>
        <p>Hotels, restaurants, and online sellers can plug straight into our delivery network. Sign in to start your application.</p>
        <GoogleButton label="Continue with Google to apply" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="login-page">
        <h1>Application submitted</h1>
        <p>We'll review your business details shortly. Once approved, you'll get an API key to start sending us orders. Taking you to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Business application</h1>
      <p>Your GST certificate, PAN, and bank details will be uploaded separately once this application is reviewed.</p>
      <form onSubmit={submit} className="apply-form">
        <label>
          Business name
          <input required value={form.business_name} onChange={(e) => update('business_name', e.target.value)} />
        </label>
        <label>
          Business type
          <select value={form.business_type} onChange={(e) => update('business_type', e.target.value)}>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="ecommerce">Online store</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          GSTIN
          <input value={form.gstin} onChange={(e) => update('gstin', e.target.value)} />
        </label>
        <label>
          PAN
          <input required value={form.pan} onChange={(e) => update('pan', e.target.value)} />
        </label>
        <label>
          Contact phone
          <input required value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} />
        </label>
        <label>
          Registered address
          <input required value={form.registered_address} onChange={(e) => update('registered_address', e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit application'}</button>
      </form>
    </div>
  );
}
