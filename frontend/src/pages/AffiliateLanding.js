import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { affiliateAPI } from '../services/api';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', dim: '#333333',
  gold: '#c9a84c', err: '#f87171',
};
const s = {
  section:  { maxWidth: 1100, margin: '0 auto', padding: '0 48px' },
  eyebrow:  { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  input:    { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
  label:    { color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 7 },
  card:     { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 },
};

const tiers = [
  { name: 'Starter', commission: '5%',  threshold: 'KES 0 — open to all',      featured: false },
  { name: 'Silver',  commission: '8%',  threshold: 'KES 50,000 / mo referred',  featured: true  },
  { name: 'Gold',    commission: '12%', threshold: 'KES 200,000 / mo referred', featured: false },
];

const howItWorks = [
  { num: '01', icon: '🔗', title: 'Get your link',   desc: 'Receive a unique referral link instantly on approval.' },
  { num: '02', icon: '📣', title: 'Share it',        desc: 'Post on social media, blogs, YouTube, newsletters.' },
  { num: '03', icon: '🛍', title: 'Buyer purchases', desc: '30-day cookie tracks all purchases from your referral.' },
  { num: '04', icon: '💰', title: 'Get paid',        desc: 'Monthly payouts via M-Pesa or bank transfer.' },
];

const whoJoins = [
  { type: 'Content Creators',           desc: 'Fashion, lifestyle, and interior design creators who want to monetise their audience authentically.' },
  { type: 'Bloggers & Writers',         desc: 'Writers covering African culture, design, and craft who want to earn from their content.' },
  { type: 'Event Planners',             desc: 'Planners who regularly source handmade décor and gifts for clients.' },
  { type: 'Diaspora Community Leaders', desc: 'Community organisers connecting African diaspora members with authentic crafts from home.' },
  { type: 'Interior Designers',         desc: 'Designers who source unique artisan pieces for client projects.' },
  { type: 'Gift Curators',              desc: 'Anyone who regularly recommends gifts and lifestyle products to their network.' },
];

const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '52px 0 32px' }}>
    <div style={s.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
          <span style={{ color: C.cream, fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Vendor Programme', '/vendor'], ['Shop', '/shop'], ['Contact', '/contact'], ['Home', '/']].map(([label, path]) => (
            <Link key={label} to={path} style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
        <p style={{ color: C.dim, fontSize: 11 }}>© 2024 57 Arts & Customs.</p>
      </div>
    </div>
  </footer>
);

const AffiliateLanding = () => {
  const { user, refreshUser } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '', channel: '', audience: '', why: '' });
  const [submitted, setSubmitted] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError]   = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name    = 'Required';
    if (!form.email.trim()) e.email   = 'Required';
    if (!form.channel)      e.channel = 'Required';
    if (!form.why.trim() || form.why.length < 20) e.why = 'Tell us a bit more (min 20 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!user) {
      // Not logged in — redirect to register page
      navigate('/register?role=affiliate');
      return;
    }

    setSubmitting(true);
    setApiError('');
    try {
      const { data } = await affiliateAPI.register({
        channel: form.channel,
        audience: form.audience,
        why: form.why,
      });
      await refreshUser();
      setAffiliateCode(data.affiliate.affiliateCode);
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to register. Please try again.';
      // If already registered, just redirect to dashboard
      if (err.response?.status === 400 && msg.includes('already')) {
        await refreshUser();
        navigate('/affiliate/dashboard');
        return;
      }
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field) => ({ ...s.input, borderColor: errors[field] ? C.err : C.border });

  if (submitted) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 26 }}>✦</div>
          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 12 }}>You're In!</h1>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
            Welcome, <span style={{ color: C.gold, fontWeight: 900 }}>{form.name}</span>! Your affiliate account is active.
          </p>
          {affiliateCode && (
            <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 24px', marginBottom: 20 }}>
              <p style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>YOUR AFFILIATE CODE</p>
              <p style={{ color: C.gold, fontWeight: 900, fontSize: 22, letterSpacing: '0.1em' }}>{affiliateCode}</p>
            </div>
          )}
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
            Your dashboard and referral links are ready. Start sharing and earning today!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/" style={s.btnGhost}>Back to Home</Link>
            <Link to="/affiliate/dashboard" style={s.btnGold}>Go to Dashboard →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Earn up to 12% commission · 30-day cookie · Monthly M-Pesa payouts
      </div>

      {/* HERO */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '72px 0' }}>
        <div style={s.section}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 20, height: 1, backgroundColor: C.gold }} />
                <p style={{ ...s.eyebrow, marginBottom: 0 }}>Affiliate Programme</p>
              </div>
              <h1 style={{ color: C.cream, fontSize: 62, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: 20 }}>
                Earn by<br />sharing<br /><span style={{ color: C.gold }}>African craft.</span>
              </h1>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, maxWidth: 380, marginBottom: 28 }}>
                Join our affiliate programme and earn up to 12% commission on every sale you refer. Share your unique link, track your earnings in real time, and get paid monthly to your M-Pesa.
              </p>
              <a href="#apply" style={s.btnGold}>Join the Programme — Free →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Average monthly payout',   value: 'KES 18,400' },
                { label: 'Highest earning affiliate', value: 'KES 142,000 / mo' },
                { label: 'Active affiliates',         value: '340+' },
                { label: 'Cookie duration',           value: '30 days' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                  <span style={{ color: C.muted, fontSize: 13 }}>{stat.label}</span>
                  <span style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...s.section, padding: '64px 48px' }}>

        {/* COMMISSION TIERS */}
        <div style={{ marginBottom: 56 }}>
          <p style={s.eyebrow}>Commission Structure</p>
          <h2 style={{ color: C.cream, fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 8 }}>Tier Levels</h2>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>Your tier updates automatically based on monthly referred sales.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {tiers.map(tier => (
              <div key={tier.name} style={{ ...s.card, padding: 28, position: 'relative', border: `2px solid ${tier.featured ? C.gold : C.border}`, backgroundColor: tier.featured ? 'rgba(201,168,76,0.05)' : C.surface }}>
                {tier.featured && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', backgroundColor: C.gold, color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>Most common</div>
                )}
                <p style={{ color: tier.featured ? C.gold : C.muted, fontWeight: 900, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>{tier.name}</p>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 44, lineHeight: 1, marginBottom: 4 }}>{tier.commission}</p>
                <p style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>commission per sale</p>
                <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <p style={{ color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Unlocked at</p>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{tier.threshold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ ...s.card, padding: 36, marginBottom: 56 }}>
          <p style={s.eyebrow}>Process</p>
          <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 900, textTransform: 'uppercase', marginBottom: 28 }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {howItWorks.map((step, i) => (
              <div key={step.num} style={{ textAlign: 'center', position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: 24, left: '60%', width: '80%', height: 1, backgroundColor: C.border }} />}
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 20 }}>{step.icon}</div>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 6 }}>{step.title}</p>
                <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WHO IT'S FOR */}
        <div style={{ marginBottom: 56 }}>
          <p style={s.eyebrow}>Who joins</p>
          <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 900, textTransform: 'uppercase', marginBottom: 24 }}>Our Programme Members</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {whoJoins.map(w => (
              <div key={w.type} style={{ ...s.card, padding: 22 }}>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 13, marginBottom: 8 }}>✦ {w.type}</p>
                <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply" style={{ ...s.card, overflow: 'hidden' }}>
          <div style={{ height: 3, backgroundColor: C.gold }} />
          <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.border}` }}>
            <p style={s.eyebrow}>Apply to join</p>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20 }}>Join the Affiliate Programme</h2>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
              {user ? 'You\'re logged in — your account will be activated instantly.' : 'Free to join · Instant link on approval · No minimum traffic required'}
            </p>
          </div>
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['Full Name', 'name', 'text', 'Your name'], ['Email', 'email', 'email', 'hello@yourchannel.com']].map(([label, field, type, ph]) => (
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <input type={type} value={form[field]} placeholder={ph}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    disabled={!!user && (field === 'name' || field === 'email')}
                    style={{ ...inputStyle(field), opacity: user && (field === 'name' || field === 'email') ? 0.6 : 1 }}
                    onFocus={e => e.target.style.borderColor = C.bHov}
                    onBlur={e => e.target.style.borderColor = errors[field] ? C.err : C.border} />
                  {errors[field] && <p style={{ color: C.err, fontSize: 11, marginTop: 4 }}>{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={s.label}>Primary Channel</label>
                <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}
                  style={{ ...inputStyle('channel'), cursor: 'pointer' }}>
                  <option value="" disabled>Select your channel</option>
                  {['Instagram', 'TikTok', 'YouTube', 'Blog / Website', 'Newsletter', 'WhatsApp Community', 'Podcast', 'Other'].map(o => <option key={o}>{o}</option>)}
                </select>
                {errors.channel && <p style={{ color: C.err, fontSize: 11, marginTop: 4 }}>{errors.channel}</p>}
              </div>
              <div>
                <label style={s.label}>Audience Size</label>
                <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
                  style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select range</option>
                  {['Under 1,000', '1,000 – 10,000', '10,000 – 50,000', '50,000 – 200,000', '200,000+'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={s.label}>Why do you want to join?</label>
              <textarea value={form.why} onChange={e => setForm({ ...form, why: e.target.value })} rows={4}
                placeholder="Tell us about your audience, how you plan to promote 57 Arts & Customs, and why you're a good fit..."
                style={{ ...inputStyle('why'), resize: 'none', lineHeight: 1.7 }}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = errors.why ? C.err : C.border} />
              {errors.why && <p style={{ color: C.err, fontSize: 11, marginTop: 4 }}>{errors.why}</p>}
            </div>

            {apiError && (
              <div style={{ backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px' }}>
                <p style={{ color: C.err, fontSize: 12 }}>{apiError}</p>
              </div>
            )}

            {!user && (
              <div style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 8, padding: '12px 16px' }}>
                <p style={{ color: C.gold, fontSize: 12 }}>
                  ✦ You need to be logged in to join. <Link to="/register?role=affiliate" style={{ color: C.gold, fontWeight: 900 }}>Create an affiliate account</Link> or <Link to="/login" style={{ color: C.gold, fontWeight: 900 }}>log in</Link> first.
                </p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitting}
              style={{ ...s.btnGold, width: '100%', padding: '14px', borderRadius: 10, textAlign: 'center', boxSizing: 'border-box', fontSize: 12, letterSpacing: '0.08em', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Joining…' : 'Join the Affiliate Programme — Free →'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AffiliateLanding;
