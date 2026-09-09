import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import BecomeRider from './pages/BecomeRider';
import BecomePartner from './pages/BecomePartner';
import CustomerHome from './pages/CustomerHome';
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
  customer: '/book',
};

function RequireRole({ allowed, children }) {
  const { role, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to={ROLE_HOME[role] ?? '/login'} replace />;
  return children;
}

function Home() {
  const { role, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (role) return <Navigate to={ROLE_HOME[role] ?? '/login'} replace />;
  return <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/Delivery">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/become-rider" element={<BecomeRider />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/book"
            element={<RequireRole allowed={['customer']}><CustomerHome /></RequireRole>}
          />
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
