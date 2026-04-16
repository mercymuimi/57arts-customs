import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const C = { bg: '#0a0a0a', gold: '#c9a84c', cream: '#f0ece4', muted: '#606060' };

// ── Generic protected route ────────────────────────────────────────────────────
// Usage: <ProtectedRoute><MyPage /></ProtectedRoute>
// Usage (role): <ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, isVendor, isAdmin, ready } = useAuth();
  const location = useLocation();

  // Wait until AuthContext has checked localStorage
  if (!ready) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000', margin: '0 auto 16px' }}>57</div>
          <p style={{ color: C.muted, fontSize: 13 }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login, preserve intended destination
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check — vendor only
  if (role === 'vendor' && !isVendor && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Role check — admin only
  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;