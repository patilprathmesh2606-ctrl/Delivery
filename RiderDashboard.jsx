import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const NEXT_STATUS = {
  rider_assigned: 'rider_arrived_pickup',
  rider_arrived_pickup: 'picked_up',
  picked_up: 'in_transit',
  in_transit: 'arrived_dropoff',
  arrived_dropoff: 'delivered',
};

export default function RiderDashboard() {
  const { profile } = useAuth();
  const [rider, setRider] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (profile) loadRider();
  }, [profile]);

  async function loadRider() {
    const { data } = await supabase
      .from('riders')
      .select('*')
      .eq('profile_id', profile.id)
      .single();
    setRider(data);
    if (data) loadOrders(data.id);
  }

  async function loadOrders(riderId) {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('rider_id', riderId)
      .not('status', 'in', '(delivered,cancelled,failed,returned)')
      .order('created_at');
    setOrders(data ?? []);
  }

  async function toggleOnline() {
    const { data } = await supabase
      .from('riders')
      .update({ is_online: !rider.is_online })
      .eq('id', rider.id)
      .select()
      .single();
    setRider(data);
  }

  async function advanceStatus(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await supabase.from('orders').update({ status: next }).eq('id', order.id);
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: next,
      changed_by: profile.id,
    });
    loadOrders(rider.id);
  }

  if (!rider) return <p>Your rider profile isn't set up yet — verification pending.</p>;
  if (rider.verification_status !== 'approved') {
    return <p>Your documents are under review ({rider.verification_status}). You'll be able to go online once approved.</p>;
  }

  return (
    <div className="dashboard">
      <h1>Rider dashboard</h1>
      <button onClick={toggleOnline}>{rider.is_online ? 'Go offline' : 'Go online'}</button>

      <h2>Assigned deliveries</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            <strong>{o.order_code}</strong> — {o.pickup_address} → {o.dropoff_address}
            <div>Status: {o.status}</div>
            {NEXT_STATUS[o.status] && (
              <button onClick={() => advanceStatus(o)}>Mark as {NEXT_STATUS[o.status]}</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
