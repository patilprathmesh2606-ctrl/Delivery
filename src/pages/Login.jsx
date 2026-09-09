import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import GoogleButton from '../components/GoogleButton';

export default function Login() {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="login-page">
      <h1>WadaGo</h1>
      <p>Sign in to book a delivery or check your account.</p>

      <GoogleButton />

      {!showEmail && (
        <button type="button" className="link-btn" onClick={() => setShowEmail(true)}>
          Use email instead
        </button>
      )}

      {showEmail && (
        sent ? (
          <p>Check your email for a login link.</p>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send login link</button>
            {error && <p className="error">{error}</p>}
          </form>
        )
      )}
    </div>
  );
}
