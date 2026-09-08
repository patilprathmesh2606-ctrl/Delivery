import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    const { data } = await supabase
      .from('support_tickets')
      .select('id, subject, category, status, order_id, created_at')
      .order('created_at', { ascending: false });
    setTickets(data ?? []);
  }

  async function resolveTicket(id) {
    await supabase
      .from('support_tickets')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', id);
    loadTickets();
  }

  return (
    <div className="dashboard">
      <h1>Support dashboard</h1>
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <strong>{t.subject}</strong> ({t.category}) — {t.status}
            {t.status !== 'resolved' && (
              <button onClick={() => resolveTicket(t.id)}>Mark resolved</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
