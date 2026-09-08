import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [pendingRiders, setPendingRiders] = useState([]);
  const [pendingClients, setPendingClients] = useState([]);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('orders-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function loadData() {
    await Promise.all([loadOrders(), loadPendingRiders(), loadPendingClients()]);
  }

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('id, order_code, status, total_fare, customer_name, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    setOrders(data ?? []);
  }

  async function loadPendingRiders() {
    const { data } = await supabase
      .from('riders')
      .select('id, profile_id, vehicle_type, verification_status, profiles(full_name, phone)')
      .eq('verification_status', 'pending');
    setPendingRiders(data ?? []);
  }

  async function loadPendingClients() {
    const { data } = await supabase
      .from('clients')
      .select('id, business_name, contact_phone, verification_status')
      .eq('verification_status', 'pending');
    setPendingClients(data ?? []);
  }

  async function approveRider(id) {
    await supabase.from('riders').update({ verification_status: 'approved', is_active: true }).eq('id', id);
    loadPendingRiders();
  }

  async function approveClient(id) {
    const apiKey = crypto.randomUUID();
    await supabase
      .from('clients')
      .update({ verification_status: 'approved', is_active: true, api_key: apiKey })
      .eq('id', id);
    loadPendingClients();
  }

  return (
    <div className="dashboard">
      <h1>Admin / Manager dashboard</h1>

      <section>
        <h2>Pending rider verifications ({pendingRiders.length})</h2>
        <ul>
          {pendingRiders.map((r) => (
            <li key={r.id}>
              {r.profiles?.full_name} — {r.vehicle_type}
              <button onClick={() => approveRider(r.id)}>Approve</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Pending client verifications ({pendingClients.length})</h2>
        <ul>
          {pendingClients.map((c) => (
            <li key={c.id}>
              {c.business_name} — {c.contact_phone}
              <button onClick={() => approveClient(c.id)}>Approve</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Live orders</h2>
        <table>
          <thead>
            <tr><th>Code</th><th>Customer</th><th>Status</th><th>Fare</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.order_code}</td>
                <td>{o.customer_name}</td>
                <td>{o.status}</td>
                <td>₹{o.total_fare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
