import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};

// ── Password strength checker ─────────────────────────────────────────────────
const getStrength = (pw) => {
  const checks = {
    length:    pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number:    /[0-9]/.test(pw),
    special:   /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
};

const strengthLabel = (score) => {
  if (score <= 1) return { label: 'Very Weak', color: '#e05c5c' };
  if (score === 2) return { label: 'Weak',      color: '#f97316' };
  if (score === 3) return { label: 'Fair',       color: '#eab308' };
  if (score === 4) return { label: 'Strong',     color: '#84cc16' };
  return              { label: 'Very Strong',    color: '#22c55e' };
};

// ── Strength bar + checklist ──────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const { checks, score } = getStrength(password);
  const { label, color }  = strengthLabel(score);

  return (
    <div style={{ marginTop: 10 }}>
      {/* Bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            backgroundColor: i <= score ? color : C.faint,
            transition: 'background-color 0.3s',
          }} />
        ))}
      </div>
      {/* Label */}
      <p style={{ color, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>{label}</p>
      {/* Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
        {[
          { key: 'length',    text: 'At least 8 characters' },
          { key: 'uppercase', text: 'Uppercase letter (A-Z)'  },
          { key: 'lowercase', text: 'Lowercase letter (a-z)'  },
          { key: 'number',    text: 'Number (0-9)'            },
          { key: 'special',   text: 'Special character (!@#…)'},
        ].map(({ key, text }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: checks[key] ? '#22c55e' : C.muted }}>
              {checks[key] ? '✓' : '○'}
            </span>
            <span style={{ fontSize: 11, color: checks[key] ? C.cream : C.muted }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const ForgotPassword = () => {
  const [step, setStep]           = useState('request');
  const [email, setEmail]         = useState('');
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPw]   = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [devOtp, setDevOtp]       = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate                  = useNavigate();

  // ── STEP 1: Request reset OTP ─────────────────────────────────────────────
  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true); setError('');
    try {
      const res = await authAPI.forgotPassword({ email });
      if (res.data.devOtp) setDevOtp(res.data.devOtp);
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  // ── OTP input helpers ─────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) document.getElementById(`rotp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`rotp-${index - 1}`)?.focus();
  };
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      document.getElementById('rotp-5')?.focus();
    }
  };

  // ── STEP 2: Verify OTP + set new password ────────────────────────────────
  const handleReset = async () => {
    const code = otp.join('');
    const { score } = getStrength(newPassword);

    if (code.length < 6)           { setError('Enter the full 6-digit code.'); return; }
    if (!newPassword)               { setError('Enter a new password.'); return; }
    if (score < 3)                  { setError('Password is too weak. Please meet at least 3 of the requirements.'); return; }
    if (newPassword !== confirmPw)  { setError('Passwords do not match.'); return; }

    setLoading(true); setError('');
    try {
      await authAPI.resetPassword({ email, otp: code, newPassword });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('rotp-0')?.focus();
    }
    setLoading(false);
  };

  // ── DONE ─────────────────────────────────────────────────────────────────
  if (step === 'done') return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, paddingTop: 80 }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
        <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 24, marginBottom: 12 }}>Password Reset!</h1>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>
          Your password has been updated. You can now sign in with your new password.
        </p>
        <button onClick={() => navigate('/login')}
          style={{ backgroundColor: C.gold, color: '#000', border: 'none', borderRadius: 10, padding: '14px 32px', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}>
          Go to Sign In →
        </button>
      </div>
    </div>
  );

  // ── VERIFY STEP ──────────────────────────────────────────────────────────
  if (step === 'verify') return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, paddingTop: 80 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <Link to="/login" style={{ color: C.muted, fontSize: 12, textDecoration: 'none', display: 'block', marginBottom: 32 }}>← Back to Sign In</Link>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 24, marginBottom: 8 }}>Check your email</h1>
          <p style={{ color: C.muted, fontSize: 13 }}>
            We sent a reset code to <span style={{ color: C.gold, fontWeight: 700 }}>{email}</span>
          </p>
        </div>

        {devOtp && (
          <div style={{ backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.4)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <p style={{ color: '#f97316', fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>⚡ Dev Mode — Reset OTP</p>
            <p style={{ color: '#f97316', fontSize: 32, fontWeight: 900, letterSpacing: '0.3em', textAlign: 'center' }}>{devOtp}</p>
          </div>
        )}

        {/* OTP boxes */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          {otp.map((digit, i) => (
            <input key={i} id={`rotp-${i}`} type="text" inputMode="numeric" maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              onPaste={handleOtpPaste}
              style={{ width: 52, height: 60, textAlign: 'center', fontSize: 24, fontWeight: 900, backgroundColor: C.surface, border: `1px solid ${digit ? C.gold : C.border}`, borderRadius: 10, color: C.cream, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.bHov}
              onBlur={e => e.target.style.borderColor = digit ? C.gold : C.border}
            />
          ))}
        </div>

        {/* New password fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>

          {/* New Password */}
          <div>
            <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPw(e.target.value)}
                placeholder="Create a strong password"
                style={{ width: '100%', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 52px 13px 16px', color: C.cream, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {/* ✅ Strength meter appears as you type */}
            <PasswordStrength password={newPassword} />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Repeat your password"
                style={{
                  width: '100%', backgroundColor: C.surface,
                  border: `1px solid ${confirmPw && confirmPw !== newPassword ? 'rgba(224,92,92,0.6)' : confirmPw && confirmPw === newPassword ? '#22c55e' : C.border}`,
                  borderRadius: 10, padding: '13px 52px 13px 16px', color: C.cream, fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => {
                  if (confirmPw && confirmPw !== newPassword) e.target.style.borderColor = 'rgba(224,92,92,0.6)';
                  else if (confirmPw && confirmPw === newPassword) e.target.style.borderColor = '#22c55e';
                  else e.target.style.borderColor = C.border;
                }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {/* Match indicator */}
            {confirmPw && (
              <p style={{ fontSize: 11, marginTop: 6, color: confirmPw === newPassword ? '#22c55e' : '#e05c5c', fontWeight: 700 }}>
                {confirmPw === newPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#e05c5c', fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={loading || getStrength(newPassword).score < 3 || newPassword !== confirmPw || otp.join('').length < 6}
          style={{
            width: '100%',
            backgroundColor: (loading || getStrength(newPassword).score < 3 || newPassword !== confirmPw || otp.join('').length < 6) ? C.faint : C.gold,
            color: (loading || getStrength(newPassword).score < 3 || newPassword !== confirmPw || otp.join('').length < 6) ? C.muted : '#000',
            border: 'none', borderRadius: 10, padding: '14px', fontWeight: 900, fontSize: 13,
            cursor: (loading || getStrength(newPassword).score < 3 || newPassword !== confirmPw || otp.join('').length < 6) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}>
          {loading ? 'Resetting...' : 'Reset Password →'}
        </button>

        <button onClick={() => { setStep('request'); setOtp(['','','','','','']); setError(''); setDevOtp(''); setNewPw(''); setConfirmPw(''); }}
          style={{ marginTop: 16, display: 'block', width: '100%', background: 'none', border: 'none', color: C.muted, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
          ← Use a different email
        </button>
      </div>
    </div>
  );

  // ── REQUEST STEP ─────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, paddingTop: 80 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <Link to="/login" style={{ color: C.muted, fontSize: 12, textDecoration: 'none', display: 'block', marginBottom: 32 }}>← Back to Sign In</Link>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 8 }}>Forgot Password?</h1>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8 }}>
            No worries. Enter your email and we'll send you a reset code.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#e05c5c', fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com"
              style={{ width: '100%', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 16px', color: C.cream, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.bHov}
              onBlur={e => e.target.style.borderColor = C.border} />
          </div>

          <button type="submit" disabled={loading}
            style={{ backgroundColor: loading ? C.faint : C.gold, color: '#000', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 900, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
            {loading ? 'Sending...' : 'Send Reset Code →'}
          </button>
        </form>

        <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 24 }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;