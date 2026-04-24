import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const STORAGE_KEYS = {
  token: '57arts_token',
  user:  '57arts_user',
};

// ✅ FIXED — simple role-based redirect, no async API calls during login
// The old version called vendorAPI.getProfile() / affiliateAPI.getProfile()
// during login before the token was set in axios, causing "next is not a function"
const getRoleRedirect = (role) => {
  switch (role) {
    case 'admin':     return '/admin';
    case 'vendor':    return '/vendor/dashboard';
    case 'affiliate': return '/affiliate/dashboard';
    default:          return '/';
  }
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
      setReady(true);
    }
  }, []);

  // ✅ FIXED — login is now synchronous (no async API calls)
  // Token is saved to localStorage BEFORE any navigation happens,
  // so axios interceptor picks it up correctly on next request
  const login = (userData, authToken, navigate) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEYS.token, authToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));

    if (navigate) {
      const redirect = getRoleRedirect(userData.role);
      navigate(redirect);
    }
  };

  // Logout — clears everything
  const logout = (navigate) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    if (typeof navigate === 'function') {
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

  // ✅ FIXED — refreshUser now:
  // 1. Saves fresh token (with updated role e.g. buyer → vendor/affiliate)
  // 2. Only logs out on genuine 401, not network errors
  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      }
      if (data?.token) {
        setToken(data.token);
        localStorage.setItem(STORAGE_KEYS.token, data.token);
      }
    } catch (err) {
      // ✅ Only force logout on real auth failure, not network blips
      if (err?.response?.status === 401) {
        logout();
      } else {
        console.error('refreshUser failed:', err?.message);
      }
    }
  };

  const isLoggedIn  = !!user && !!token;
  const isVendor    = user?.role === 'vendor';
  const isAffiliate = user?.role === 'affiliate';
  const isAdmin     = user?.role === 'admin';
  const isBuyer     = user?.role === 'buyer';

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