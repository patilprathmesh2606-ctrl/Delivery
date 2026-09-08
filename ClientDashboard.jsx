import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (profile) loadClient();
  }, [profile]);

  async function loadClient() {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('owner_profile_id', profile.id)
      .single();
    setClient(data);
    if (data) loadOrders(data.id);
  }

  async function loadOrders(clientId) {
    const { data } = await supabase
      .from('orders')
      .select('id, order_code, status, total_fare, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
  }

  if (!client) return <p>No business profile found for this account yet.</p>;
  if (client.verification_status !== 'approved') {
    return <p>Your business verification is {client.verification_status}. Order creation and the API key unlock after approval.</p>;
  }

  return (
    <div className="dashboard">
      <h1>{client.business_name} — Client dashboard</h1>
      <p>API key: <code>{client.api_key}</code></p>
      <p>Webhook URL: {client.webhook_url || 'not set'}</p>

      <h2>Orders</h2>
      <table>
        <thead><tr><th>Code</th><th>Status</th><th>Fare</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.order_code}</td>
              <td>{o.status}</td>
              <td>₹{o.total_fare}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
