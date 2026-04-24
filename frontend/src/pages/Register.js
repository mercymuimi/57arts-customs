import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};

const inputStyle = (borderColor) => ({
  width: '100%', backgroundColor: C.surface,
  border: `1px solid ${borderColor}`, borderRadius: 10,
  padding: '13px 16px', color: C.cream, fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
});

/* ─── Password strength logic ────────────────────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: 'transparent', checks: [] };

  const checks = [
    { label: 'At least 8 characters',         pass: pw.length >= 8         },
    { label: 'Uppercase letter (A–Z)',         pass: /[A-Z]/.test(pw)       },
    { label: 'Lowercase letter (a–z)',         pass: /[a-z]/.test(pw)       },
    { label: 'Number (0–9)',                   pass: /\d/.test(pw)           },
    { label: 'Special character (!@#$…)',      pass: /[^A-Za-z0-9]/.test(pw) },
  ];

  const score = checks.filter(c => c.pass).length;

  const meta = [
    { label: '',          color: 'transparent'    },
    { label: 'Very weak', color: '#e05c5c'        },
    { label: 'Weak',      color: '#f97316'        },
    { label: 'Fair',      color: '#facc15'        },
    { label: 'Strong',    color: '#4caf50'        },
    { label: 'Very strong', color: '#22c55e'      },
  ];

  return { score, ...meta[score], checks };
};

/* ─── Strength bar ───────────────────────────────────────────────────────────── */
const StrengthBar = ({ password }) => {
  const { score, label, color, checks } = useMemo(() => getStrength(password), [password]);
  if (!password) return null;

  return (
    <div style={{ marginTop: 10 }}>
      {/* 5-segment bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            backgroundColor: i <= score ? color : C.faint,
            transition: 'background-color 0.25s',
          }} />
        ))}
      </div>

      {/* Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: C.muted }}>Password strength</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {checks.map(({ label: clabel, pass }) => (
          <div key={clabel} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              fontSize: 10, fontWeight: 900,
              color: pass ? '#4caf50' : C.muted,
              transition: 'color 0.2s',
            }}>
              {pass ? '✓' : '○'}
            </span>
            <span style={{
              fontSize: 11,
              color: pass ? C.cream : C.muted,
              transition: 'color 0.2s',
            }}>
              {clabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────────────────── */
const Register = () => {
  const location                            = useLocation();
  const preselectedRole                     = useMemo(() => {
    const role = new URLSearchParams(location.search).get('role');
    return ['buyer', 'vendor', 'affiliate'].includes(role) ? role : 'buyer';
  }, [location.search]);
  const [step, setStep]                     = useState('register'); // 'register' | 'verify'
  const [form, setForm]                     = useState({ name: '', email: '', password: '', confirm: '', role: preselectedRole });
  const [otp, setOtp]                       = useState(['', '', '', '', '', '']);
  const [pendingEmail, setPendingEmail]     = useState('');
  const [devOtp, setDevOtp]                 = useState('');
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(false);
  const [resending, setResending]           = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPw, setShowPw]                 = useState(false);
  const [apiError, setApiError]             = useState('');
  const [focused, setFocused]               = useState('');
  const { login }                           = useAuth();
  const navigate                            = useNavigate();

  const { score: pwScore } = useMemo(() => getStrength(form.password), [form.password]);

  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password)     e.password = 'Required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    else if (pwScore < 3)   e.password = 'Password is too weak. Please make it stronger.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiError('');
    try {
      const res = await authAPI.register({
        name: form.name, email: form.email,
        password: form.password, role: form.role,
      });
      setPendingEmail(form.email);
      if (res.data.devOtp) setDevOtp(res.data.devOtp);
      setStep('verify');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  /* ── OTP helpers ──────────────────────────────────────────────────────────── */
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { setApiError('Please enter the full 6-digit code.'); return; }
    setLoading(true); setApiError('');
    try {
      const res = await authAPI.verifyEmail({ email: pendingEmail, otp: code });
      login(res.data.user, res.data.token, navigate);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true); setApiError(''); setDevOtp('');
    try {
      const res = await authAPI.resendOTP({ email: pendingEmail });
      setOtp(['', '', '', '', '', '']);
      if (res.data.devOtp) setDevOtp(res.data.devOtp);
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(c => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; });
      }, 1000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to resend. Please try again.');
    }
    setResending(false);
  };

  const getBorderColor = (field) => {
    if (focused === field) return C.bHov;
    if (errors[field])     return 'rgba(224,92,92,0.5)';
    return C.border;
  };

  /* ── Verify step ──────────────────────────────────────────────────────────── */
  if (step === 'verify') return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>

        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: 'rgba(201,168,76,0.1)', border: `2px solid ${C.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 28,
        }}>✉️</div>

        <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 26, marginBottom: 8 }}>Check your email</h1>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          We sent a 6-digit verification code to
        </p>
        <p style={{ color: C.gold, fontWeight: 900, fontSize: 14, marginBottom: 24 }}>{pendingEmail}</p>

        {devOtp && (
          <div style={{
            backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.4)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 20, textAlign: 'left',
          }}>
            <p style={{ color: '#f97316', fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              ⚡ Dev Mode — Email not delivered
            </p>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>
              Resend can only send to your verified account email.<br />
              Your OTP is shown here for testing:
            </p>
            <p style={{ color: '#f97316', fontSize: 32, fontWeight: 900, letterSpacing: '0.3em', textAlign: 'center' }}>
              {devOtp}
            </p>
            <p style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 6 }}>
              Add <code style={{ color: C.cream }}>RESEND_TEST_EMAIL=your@email.com</code> to your <code style={{ color: C.cream }}>.env</code> to receive real emails.
            </p>
          </div>
        )}

        {/* OTP boxes */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(index, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(index, e)}
              onPaste={handleOtpPaste}
              style={{
                width: 52, height: 60, textAlign: 'center', fontSize: 24, fontWeight: 900,
                backgroundColor: C.surface, border: `1px solid ${digit ? C.gold : C.border}`,
                borderRadius: 10, color: C.cream, outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = C.bHov}
              onBlur={e => e.target.style.borderColor = digit ? C.gold : C.border}
            />
          ))}
        </div>

        {apiError && (
          <div style={{ backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#e05c5c', fontSize: 13 }}>
            {apiError}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length < 6}
          style={{
            width: '100%',
            backgroundColor: otp.join('').length === 6 ? C.gold : C.faint,
            color: otp.join('').length === 6 ? '#000' : C.muted,
            border: 'none', borderRadius: 10, padding: '14px',
            fontWeight: 900, fontSize: 13,
            cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
            marginBottom: 16,
          }}
        >
          {loading ? 'Verifying...' : 'Verify Email →'}
        </button>

        <p style={{ color: C.muted, fontSize: 13 }}>
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            style={{
              background: 'none', border: 'none',
              color: resendCooldown > 0 ? C.muted : C.gold,
              fontWeight: 700, fontSize: 13,
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', padding: 0,
            }}
          >
            {resending ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
          </button>
        </p>

        <button
          onClick={() => { setStep('register'); setOtp(['','','','','','']); setApiError(''); setDevOtp(''); }}
          style={{ marginTop: 16, background: 'none', border: 'none', color: C.muted, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
        >
          ← Use a different email
        </button>
      </div>
    </div>
  );

  /* ── Register step ────────────────────────────────────────────────────────── */
  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex' }}>

      {/* LEFT — brand panel */}
      <div style={{
        width: '45%', backgroundColor: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07 }}
        />
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              {[
                { key: 'buyer',  label: 'Buyer',           desc: 'Shop & commission pieces' },
                { key: 'vendor', label: 'Artisan / Vendor', desc: 'Sell my craft'            },
                { key: 'affiliate', label: 'Affiliate', desc: 'Share links and earn commission' },
              ].map(({ key, label, desc }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: key }))}
                  style={{
                    padding: '12px', borderRadius: 10,
                    border: `1px solid ${form.role === key ? C.gold : C.border}`,
                    backgroundColor: form.role === key ? 'rgba(201,168,76,0.08)' : C.surface,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <p style={{ color: form.role === key ? C.gold : C.cream, fontWeight: 900, fontSize: 12, marginBottom: 2 }}>{label}</p>
                  <p style={{ color: C.muted, fontSize: 10 }}>{desc}</p>
                </button>
              ))}
            </div>
            {form.role === 'vendor' && (
              <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginTop: 10 }}>
                Vendor accounts finish storefront setup after email verification.
              </p>
            )}
            {form.role === 'affiliate' && (
              <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginTop: 10 }}>
                Affiliate accounts finish activation after email verification and a quick profile setup.
              </p>
            )}
          </div>

          {apiError && (
            <div style={{ backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#e05c5c', fontSize: 13 }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Full Name */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your full name" autoComplete="name"
                style={inputStyle(getBorderColor('name'))}
                onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
              />
              {errors.name && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" autoComplete="email"
                style={inputStyle(getBorderColor('email'))}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
              />
              {errors.email && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
            </div>

            {/* Password + strength meter */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password" value={form.password} onChange={handleChange}
                  placeholder="Min 8 characters" autoComplete="new-password"
                  style={{ ...inputStyle(getBorderColor('password')), paddingRight: 52 }}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 11 }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Strength indicator — renders as user types */}
              <StrengthBar password={form.password} />

              {errors.password && (
                <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 6 }}>{errors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <input
                type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Repeat password" autoComplete="new-password"
                style={inputStyle(getBorderColor('confirm'))}
                onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
              />
              {/* Live match indicator */}
              {form.confirm && (
                <p style={{ fontSize: 11, marginTop: 4, color: form.password === form.confirm ? '#4caf50' : '#e05c5c' }}>
                  {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
              {errors.confirm && !form.confirm && (
                <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.confirm}</p>
              )}
            </div>

            {/* Submit — disabled until password is at least "Fair" (score ≥ 3) */}
            <button
              type="submit"
              disabled={loading || pwScore < 3}
              style={{
                backgroundColor: loading || pwScore < 3 ? C.faint : C.gold,
                color: loading || pwScore < 3 ? C.muted : '#000',
                border: 'none', borderRadius: 10, padding: '14px',
                fontWeight: 900, fontSize: 13,
                cursor: loading || pwScore < 3 ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em', marginTop: 8,
                transition: 'background-color 0.2s',
              }}
            >
              {loading
                ? 'Sending verification code...'
                : pwScore < 3
                ? 'Strengthen your password to continue'
                : 'Continue →'}
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
