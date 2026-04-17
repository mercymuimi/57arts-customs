import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const STORAGE_KEYS = {
  token: '57arts_token',
  user:  '57arts_user',
};

// ✅ Where each role lands after login
const ROLE_REDIRECTS = {
  admin:     '/admin',
  vendor:    '/vendor/dashboard',
  affiliate: '/affiliate/dashboard',
  buyer:     '/',
};

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.token);
      const storedUser  = localStorage.getItem(STORAGE_KEYS.user);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
    } finally {
      setReady(true); // ✅ always set ready so app doesn't hang
    }
  }, []);

  // Login — stores credentials and redirects by role
  const login = (userData, authToken, navigate) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEYS.token, authToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));

    // ✅ Role-based redirect if navigate function provided
    if (navigate) {
      const redirect = ROLE_REDIRECTS[userData.role] || '/';
      navigate(redirect);
    }
  };

  // Logout — clears everything
  const logout = (navigate) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    if (navigate) {
      navigate('/login');
    } else {
      window.location.href = '/login';
    }
  };

  // Update user locally (after profile edit)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updated));
  };

  // Refresh user from server (after role change e.g. buyer becomes vendor)
  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      }
    } catch {
      logout();
    }
  };

  const isLoggedIn  = !!user && !!token;
  const isVendor    = user?.role === 'vendor';
  const isAffiliate = user?.role === 'affiliate';
  const isAdmin     = user?.role === 'admin';
  const isBuyer     = user?.role === 'buyer';

  // ✅ Don't render children until localStorage is checked
  // This prevents flash of "logged out" state on page refresh
  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user, token, ready,
      isLoggedIn, isVendor, isAffiliate, isAdmin, isBuyer,
      login, logout, updateUser, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;