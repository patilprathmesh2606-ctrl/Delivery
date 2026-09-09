import { useAuth } from '../context/AuthContext';

export default function CustomerHome() {
  const { profile } = useAuth();
  return (
    <div className="dashboard">
      <h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}</h1>
      <p>Booking a delivery from here isn't built yet — this confirms your account and sign-in are working. Next up: an actual "send a parcel" form.</p>
    </div>
  );
}
