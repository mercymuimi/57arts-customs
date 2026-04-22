import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token, navigate);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex' }}>

      {/* LEFT — brand panel */}
      <div style={{ width: '45%', backgroundColor: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 14, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
          </Link>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Welcome Back</p>
          <h2 style={{ color: C.cream, fontSize: 40, fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 20 }}>
            The Bold<br />Generation<br />Awaits.
          </h2>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 280 }}>
            Sign in to access your commissions, track artisan progress, and discover new pieces curated by AI.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {[{ v: '2,400+', l: 'Products' }, { v: '340+', l: 'Artisans' }, { v: '98%', l: 'Satisfaction' }].map(({ v, l }) => (
              <div key={l}>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 18 }}>{v}</p>
                <p style={{ color: C.muted, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Sign In</h1>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 36 }}>
            New here?{' '}
            <Link to="/register" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
          </p>

          {error && (
            <div style={{ backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#e05c5c', fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                style={{ width: '100%', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 16px', color: C.cream, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = C.border} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
                {/* ✅ FIX: Now navigates to /forgot-password */}
                <Link to="/forgot-password"
                  style={{ color: C.gold, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
                  style={{ width: '100%', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 44px 13px 16px', color: C.cream, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = C.bHov}
                  onBlur={e => e.target.style.borderColor = C.border} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13 }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ backgroundColor: loading ? C.faint : C.cream, color: '#000', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 900, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            <span style={{ color: C.muted, fontSize: 11 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['Google', 'Facebook'].map(provider => (
              <button key={provider}
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px', color: C.cream, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                {provider}
              </button>
            ))}
          </div>

          <p style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 28, lineHeight: 1.7 }}>
            By signing in you agree to our{' '}
            <Link to="/contact" style={{ color: C.cream, textDecoration: 'none' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link to="/contact" style={{ color: C.cream, textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;