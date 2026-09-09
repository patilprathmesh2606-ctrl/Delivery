import { supabase } from '../lib/supabaseClient';

export default function GoogleButton({ label = 'Continue with Google' }) {
  async function handleClick() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
    });
  }

  return (
    <button type="button" className="google-btn" onClick={handleClick}>
      {label}
    </button>
  );
}
