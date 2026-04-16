import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '', role: 'buyer' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [apiError, setApiError] = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.name, email: form.email, password: form.password, role: form.role,
      });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const inputStyle = (field) => ({
    width: '100%', backgroundColor: C.surface, border: `1px solid ${errors[field] ? 'rgba(224,92,92,0.5)' : C.border}`,
    borderRadius: 10, padding: '13px 16px', color: C.cream, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  });

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex' }}>

      {/* LEFT — brand */}
      <div style={{ width: '45%', backgroundColor: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 14, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
          </Link>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Join the Platform</p>
          <h2 style={{ color: C.cream, fontSize: 40, fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 20 }}>
            Craft Your<br />Story<br />Here.
          </h2>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 280 }}>
            Join 2,400+ buyers and 340+ artisans building Africa's boldest creative marketplace.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Access 2,400+ artisan products',
            'Commission fully custom pieces',
            'Track orders in real time',
            'AI-powered recommendations',
          ].map(perk => (
            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: C.gold, fontSize: 12, fontWeight: 900 }}>—</span>
              <span style={{ color: C.muted, fontSize: 12 }}>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>
            Already have one?{' '}
            <Link to="/login" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>

          {/* Role selector */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>I am joining as</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ key: 'buyer', label: 'Buyer', desc: 'Shop & commission pieces' }, { key: 'vendor', label: 'Artisan / Vendor', desc: 'Sell my craft' }].map(({ key, label, desc }) => (
                <button key={key} type="button" onClick={() => setForm({ ...form, role: key })}
                  style={{ padding: '12px', borderRadius: 10, border: `1px solid ${form.role === key ? C.gold : C.border}`, backgroundColor: form.role === key ? 'rgba(201,168,76,0.08)' : C.surface, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <p style={{ color: form.role === key ? C.gold : C.cream, fontWeight: 900, fontSize: 12, marginBottom: 2 }}>{label}</p>
                  <p style={{ color: C.muted, fontSize: 10 }}>{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {apiError && (
            <div style={{ backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#e05c5c', fontSize: 13 }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Name */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name"
                style={inputStyle('name')}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(224,92,92,0.5)' : C.border} />
              {errors.name && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                style={inputStyle('email')}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(224,92,92,0.5)' : C.border} />
              {errors.email && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="Min 8 characters"
                  style={{ ...inputStyle('password'), paddingRight: 52 }}
                  onFocus={e => e.target.style.borderColor = C.bHov}
                  onBlur={e => e.target.style.borderColor = errors.password ? 'rgba(224,92,92,0.5)' : C.border} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 11 }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required placeholder="Repeat password"
                style={inputStyle('confirm')}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = errors.confirm ? 'rgba(224,92,92,0.5)' : C.border} />
              {errors.confirm && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.confirm}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ backgroundColor: loading ? C.faint : C.gold, color: '#000', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 900, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', marginTop: 8, transition: 'all 0.2s' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 20, lineHeight: 1.7 }}>
            By registering you agree to our{' '}
            <Link to="/contact" style={{ color: C.cream, textDecoration: 'none' }}>Terms</Link>
            {' '}and{' '}
            <Link to="/contact" style={{ color: C.cream, textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;