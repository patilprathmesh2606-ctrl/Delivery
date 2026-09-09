import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import RiderDashboard from './pages/RiderDashboard';
import ClientDashboard from './pages/ClientDashboard';
import SupportDashboard from './pages/SupportDashboard';

const ROLE_HOME = {
  admin: '/admin',
  manager: '/admin',
  support: '/support',
  rider: '/rider',
  client: '/client',
};

function RequireRole({ allowed, children }) {
  const { role, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to={ROLE_HOME[role] ?? '/login'} replace />;
  return children;
}

function Home() {
  const { session, role, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (session && !role) {
    return (
      <div className="dashboard">
        <h1>You're signed in — almost there</h1>
        <p>
          Your account doesn't have a role assigned yet, so there's no dashboard to show.
          Ask an admin to add a row for you in the <code>profiles</code> table with the
          right <code>role</code> (admin, manager, support, rider, or client).
        </p>
      </div>
    );
  }
  if (role) return <Navigate to={ROLE_HOME[role] ?? '/login'} replace />;
  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/Delivery">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={<RequireRole allowed={['admin', 'manager']}><AdminDashboard /></RequireRole>}
          />
          <Route
            path="/rider"
            element={<RequireRole allowed={['rider']}><RiderDashboard /></RequireRole>}
          />
          <Route
            path="/client"
            element={<RequireRole allowed={['client']}><ClientDashboard /></RequireRole>}
          />
          <Route
            path="/support"
            element={<RequireRole allowed={['support', 'admin', 'manager']}><SupportDashboard /></RequireRole>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
