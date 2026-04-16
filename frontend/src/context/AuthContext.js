import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// ✅ Single source of truth for storage keys
export const STORAGE_KEYS = {
  token: '57arts_token',
  user:  '57arts_user',
};

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // ── Rehydrate from localStorage on first load ─────────────────────────────
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
      setReady(true);
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEYS.token, authToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    window.location.href = '/login';
  };

  // ── Update user data (e.g. after profile edit) ────────────────────────────
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updated));
  };

  // ── Refresh user from server (call after role changes) ───────────────────
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

  const isLoggedIn   = !!user && !!token;
  const isVendor     = user?.role === 'vendor';
  const isAffiliate  = user?.role === 'affiliate';
  const isAdmin      = user?.role === 'admin';
  const isBuyer      = user?.role === 'buyer';

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