import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { affiliateAPI } from '../services/api';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', dim: '#333333',
  gold: '#c9a84c', green: '#4ade80',
};
const s = {
  section:  { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow:  { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '10px 20px', borderRadius: 9, fontWeight: 900, fontSize: 11, border: 'none', cursor: 'pointer', letterSpacing: '0.04em' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '10px 20px', borderRadius: 9, fontWeight: 900, fontSize: 11, border: `1px solid ${C.border}`, cursor: 'pointer', letterSpacing: '0.04em' },
  input:    { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
  card:     { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 },
  label:    { color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 7 },
};

const tabs = [
  { key: 'overview',  label: 'Overview'      },
  { key: 'links',     label: 'My Links'      },
  { key: 'referrals', label: 'Referrals'     },
  { key: 'payouts',   label: 'Payouts'       },
  { key: 'materials', label: 'Marketing Kit' },
];

const captions = (code) => [
  { platform: 'Instagram', icon: '📸', text: `Just discovered @57artscustoms and I am obsessed 😍 Handcrafted African luxury — furniture, fashion, beads, all made to order. Use my link in bio for free shipping on your first order. https://57arts.com?ref=${code} #AfricanCraft #57Arts #Handmade #LuxuryAfrica` },
  { platform: 'TikTok',    icon: '🎬', text: `POV: you finally found a marketplace that actually sells real African handmade pieces 🙌 57 Arts & Customs has custom furniture, beads, fashion — all artisan made. Link in bio: https://57arts.com?ref=${code} #AfricanArt #Handmade #CustomOrder #57Arts` },
  { platform: 'WhatsApp',  icon: '💬', text: `Hey! Have you seen this platform called 57 Arts & Customs? They do handmade African furniture, fashion and beads — you can even commission custom pieces. Check it out: https://57arts.com?ref=${code}` },
  { platform: 'Twitter/X', icon: '𝕏',  text: `If you're looking for authentic handcrafted African pieces — furniture, beadwork, bespoke fashion — 57 Arts & Customs is the one. Every piece is made by a real artisan 🧵 https://57arts.com?ref=${code} #AfricanCraft` },
];

const hashtags = ['#AfricanCraft','#57Arts','#Handmade','#LuxuryAfrica','#AfricanFurniture','#AfricanFashion','#BeadWork','#CustomOrder','#ArtisanMade','#AfricanDesign','#MadeInAfrica','#CraftedInAfrica','#AfricanArtisan','#NairobiStyle','#AfricanLuxury','#BespokeAfrica'];

const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
    <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [activeTab, setActiveTab]         = useState('overview');
  const [stats, setStats]                 = useState(null);
  const [profile, setProfile]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  const [copiedLink, setCopiedLink]       = useState(null);
  const [copiedCaption, setCopiedCaption] = useState(null);
  const [customProduct, setCustomProduct] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm]           = useState({ method: 'M-Pesa', number: '' });
  const [payoutSaving, setPayoutSaving]       = useState(false);
  const [payoutSaved, setPayoutSaved]         = useState(false);

  // ── Track click if ?ref= is in URL (when affiliate visits their own link) ──
  // ── Fetch dashboard data ──────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, profileRes] = await Promise.all([
        affiliateAPI.getStats(),
        affiliateAPI.getProfile(),
      ]);
      setStats(statsRes.data.stats);
      setProfile(profileRes.data.affiliate);
      setPayoutForm({
        method: profileRes.data.affiliate?.payoutMethod === 'bank' ? 'Bank Transfer' :
                profileRes.data.affiliate?.payoutMethod === 'paypal' ? 'PayPal' : 'M-Pesa',
        number: profileRes.data.affiliate?.mpesaNumber || '',
      });
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 403) {
        // Not an affiliate yet
        navigate('/affiliate');
      } else {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const code     = stats?.affiliateCode || '';
  const origin   = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const baseLink = `${origin}/?ref=${code}`;

  const linkTemplates = [
    { label: 'Full site',     url: `${origin}/?ref=${code}`,             desc: 'Link to the homepage'  },
    { label: 'Shop',          url: `${origin}/shop?ref=${code}`,         desc: 'Link to all products'  },
    { label: 'Fashion',       url: `${origin}/fashion?ref=${code}`,      desc: 'Fashion category'      },
    { label: 'Furniture',     url: `${origin}/furniture?ref=${code}`,    desc: 'Furniture category'    },
    { label: 'Beads',         url: `${origin}/beads?ref=${code}`,        desc: 'Beads & jewellery'     },
    { label: 'Custom Orders', url: `${origin}/custom-order?ref=${code}`, desc: 'Custom order studio'   },
  ];

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };
  const copyCaption = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(key);
    setTimeout(() => setCopiedCaption(null), 2000);
  };
  const generateProductLink = () => {
    if (!customProduct.trim()) return;
    setGeneratedLink(`${origin}/product/${customProduct.toLowerCase().replace(/\s+/g, '-')}?ref=${code}`);
  };

  const savePayoutDetails = async () => {
    setPayoutSaving(true);
    try {
      await affiliateAPI.updatePayoutDetails({
        payoutMethod: payoutForm.method === 'M-Pesa' ? 'mpesa' : payoutForm.method === 'PayPal' ? 'paypal' : 'bank',
        mpesaNumber:  payoutForm.method === 'M-Pesa' ? payoutForm.number : '',
      });
      setPayoutSaved(true);
      setTimeout(() => { setPayoutSaved(false); setShowPayoutModal(false); }, 1500);
    } catch { alert('Failed to save payout details'); }
    finally { setPayoutSaving(false); }
  };

  // ── Tier info ─────────────────────────────────────────────────────────────
  const tier             = stats?.currentTier        || 'Starter';
  const commissionRate   = stats?.commissionRate      || 5;
  const nextTier         = stats?.nextTier            || 'Silver';
  const nextThreshold    = stats?.nextTierThreshold   || 50000;
  const currentSales     = stats?.totalSales          || 0;
  const tierProgress     = nextThreshold ? Math.min((currentSales / nextThreshold) * 100, 100) : 100;

  // ── Chart data from real orders ───────────────────────────────────────────
  const months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now       = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const mIdx = (now.getMonth() - 5 + i + 12) % 12;
    const key  = mIdx.toString();
    const d    = stats?.monthlyData?.[key] || {};
    return { month: months[mIdx], clicks: d.clicks || 0, conv: d.conversions || 0 };
  });
  const maxClicks = Math.max(...chartData.map(d => d.clicks), 10);

  if (loading) return <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}><Spinner /></div>;

  if (error) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>{error}</p>
        <button onClick={loadData} style={s.btnGold}>Retry</button>
      </div>
    </div>
  );

  // ── Pending approval screen ───────────────────────────────────────────────
  if (stats?.status === 'pending') return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: 'rgba(245,158,11,0.12)',
          border: '2px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 24px',
        }}>⏳</div>
        <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 24, marginBottom: 12 }}>Application Under Review</h2>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
          Your affiliate application has been received and is being reviewed by our team.
          You'll be able to access your dashboard and start earning once approved.
        </p>
        <div style={{
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: '16px 24px', marginBottom: 28,
        }}>
          <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            Application submitted as
          </p>
          <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{profile?.user?.email || user?.email}</p>
        </div>
        <p style={{ color: C.muted, fontSize: 11, marginBottom: 28 }}>
          We typically review applications within 1–2 business days.
        </p>
        <Link to="/" style={{ ...s.btnGhost, textDecoration: 'none', display: 'inline-block' }}>← Back to Home</Link>
      </div>
    </div>
  );

  // ── Suspended screen ──────────────────────────────────────────────────────
  if (stats?.status === 'suspended') return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: 'rgba(224,92,92,0.1)',
          border: '2px solid rgba(224,92,92,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 24px',
        }}>🚫</div>
        <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 24, marginBottom: 12 }}>Account Suspended</h2>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
          Your affiliate account has been suspended. Please contact support if you believe this is a mistake.
        </p>
        <Link to="/" style={{ ...s.btnGhost, textDecoration: 'none', display: 'inline-block' }}>← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* PAYOUT MODAL */}
      {showPayoutModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <div style={{ ...s.card, padding: 32, maxWidth: 440, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>Update Payout Details</h3>
              <button onClick={() => setShowPayoutModal(false)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={s.label}>Payout Method</label>
                <select value={payoutForm.method} onChange={e => setPayoutForm({ ...payoutForm, method: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  {['M-Pesa', 'Bank Transfer', 'PayPal'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              {payoutForm.method === 'M-Pesa' && (
                <div>
                  <label style={s.label}>Safaricom Number</label>
                  <input type="text" value={payoutForm.number} onChange={e => setPayoutForm({ ...payoutForm, number: e.target.value })} placeholder="+254 7XX XXX XXX" style={s.input} />
                </div>
              )}
              <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <p style={{ color: C.dim, fontSize: 11, marginBottom: 14, lineHeight: 1.6 }}>⚠ Minimum payout is KES 500. Processed on the 1st of every month.</p>
                <button onClick={savePayoutDetails} disabled={payoutSaving} style={{ ...s.btnGold, width: '100%', padding: '13px', textAlign: 'center', borderRadius: 10, opacity: payoutSaving ? 0.7 : 1 }}>
                  {payoutSaved ? '✓ Saved!' : payoutSaving ? 'Saving…' : 'Save Payout Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 48px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ color: C.muted, fontSize: 11, fontWeight: 900, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>← Home</Link>
          <span style={{ color: C.border }}>|</span>
          <span style={{ color: C.gold, fontSize: 11 }}>Affiliate Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 9 }}>
            <span style={{ color: C.gold, fontSize: 11 }}>✦</span>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 11 }}>{tier} Tier</span>
            <span style={{ color: C.muted, fontSize: 11 }}>· {commissionRate}% commission</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 48px', display: 'flex' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ padding: '14px 18px', fontWeight: 900, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.key ? C.gold : 'transparent'}`, color: activeTab === tab.key ? C.gold : C.muted, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = C.cream; }}
            onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = C.muted; }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ ...s.section, padding: '36px 48px 64px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            {/* Welcome + tier progress */}
            <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ height: 2, backgroundColor: C.gold, borderRadius: 2, marginBottom: 20 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <p style={s.eyebrow}>Welcome back</p>
                  <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 24, marginBottom: 4 }}>{profile?.user?.name || user?.name}</h2>
                  <p style={{ color: C.muted, fontSize: 12 }}>
                    Code: <span style={{ color: C.gold, fontWeight: 900 }}>{code}</span>
                    {' · '}Status: <span style={{ color: stats?.status === 'active' ? C.green : C.muted, fontWeight: 900 }}>{stats?.status}</span>
                  </p>
                </div>
                <button onClick={() => copy(baseLink, 'main')} style={{ ...s.btnGold, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {copiedLink === 'main' ? '✓ Copied!' : '🔗 Copy My Link'}
                </button>
              </div>
              {nextTier && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <p style={{ color: C.muted, fontSize: 12 }}>Progress to <span style={{ color: C.gold, fontWeight: 900 }}>{nextTier}</span> tier</p>
                    <p style={{ color: C.muted, fontSize: 12 }}>KES {(nextThreshold - currentSales).toLocaleString()} to go</p>
                  </div>
                  <div style={{ height: 8, backgroundColor: C.border, borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: C.gold, borderRadius: 100, width: `${tierProgress}%`, transition: 'width 0.7s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ color: C.gold, fontSize: 11, fontWeight: 900 }}>KES {currentSales.toLocaleString()} referred</span>
                    <span style={{ color: C.dim, fontSize: 11 }}>Target: KES {nextThreshold.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            {/* Quick stats */}
            <div style={{ ...s.card, padding: 22 }}>
              <p style={s.eyebrow}>Quick Stats</p>
              {[
                ['Conversion rate',  `${stats?.conversionRate || 0}%`],
                ['Total clicks',     (stats?.totalClicks || 0).toLocaleString()],
                ['Cookie window',    '30 days'],
                ['Next payout',      'Checks 1st monthly'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                  <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Total Earned',     value: `KES ${(stats?.totalEarned || 0).toLocaleString()}`,     gold: true  },
              { label: 'Total Orders',     value: stats?.totalOrders || 0,                                 gold: false },
              { label: 'Pending Payout',   value: `KES ${(stats?.pendingBalance || 0).toLocaleString()}`,  green: true },
              { label: 'Total Clicks',     value: (stats?.totalClicks || 0).toLocaleString(),              gold: false },
            ].map(e => (
              <div key={e.label} style={{ ...s.card, padding: 20 }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{e.label}</p>
                <p style={{ fontWeight: 900, fontSize: 24, marginBottom: 4, color: e.gold ? C.gold : e.green ? C.green : C.cream }}>{e.value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ ...s.card, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Performance — Last 6 Months</p>
              <div style={{ display: 'flex', gap: 16 }}>
                {[['#c9a84c','Clicks'],['#4ade80','Conversions']].map(([color, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
                    <span style={{ color: C.muted, fontSize: 11 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
              {chartData.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 3, height: 130 }}>
                    <div style={{ flex: 1, borderRadius: '4px 4px 0 0', backgroundColor: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.4)', height: `${Math.max((d.clicks / maxClicks) * 100, 2)}%` }} />
                    <div style={{ flex: 1, borderRadius: '4px 4px 0 0', backgroundColor: 'rgba(74,222,128,0.45)', border: '1px solid rgba(74,222,128,0.3)', height: `${Math.max((d.conv / 5) * 100, d.conv > 0 ? 4 : 0)}%` }} />
                  </div>
                  <span style={{ color: C.dim, fontSize: 10 }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ══ LINKS ══════════════════════════════════════════════════════════ */}
        {activeTab === 'links' && <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
            <div style={{ height: 2, backgroundColor: C.gold, borderRadius: 2, marginBottom: 18 }} />
            <p style={s.eyebrow}>Your Main Referral Link</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: '12px 16px', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.gold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{baseLink}</div>
              <button onClick={() => copy(baseLink, 'main')} style={{ ...s.btnGold, flexShrink: 0 }}>{copiedLink === 'main' ? '✓ Copied!' : 'Copy'}</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={`https://wa.me/?text=Check%20out%2057%20Arts%20%26%20Customs!%20${encodeURIComponent(baseLink)}`} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 9, fontWeight: 900, fontSize: 11, color: '#fff', textDecoration: 'none', backgroundColor: '#25D366' }}>💬 WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=Check%20out%2057%20Arts%20%26%20Customs!&url=${encodeURIComponent(baseLink)}`} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 9, fontWeight: 900, fontSize: 11, color: '#fff', textDecoration: 'none', backgroundColor: '#111', border: `1px solid ${C.border}` }}>𝕏 Twitter</a>
              <button onClick={() => copy(`Check out 57 Arts & Customs! ${baseLink}`, 'ig')} style={{ padding: '9px 16px', borderRadius: 9, fontWeight: 900, fontSize: 11, color: '#fff', backgroundColor: '#C13584', border: 'none', cursor: 'pointer' }}>{copiedLink === 'ig' ? '✓ Copied!' : '📸 Copy for Instagram'}</button>
            </div>
          </div>

          {/* Category links */}
          <div style={{ ...s.card, overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>Category Links</p>
            </div>
            {linkTemplates.map((lt, i) => (
              <div key={lt.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: i < linkTemplates.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{lt.label}</p>
                  <p style={{ color: C.dim, fontSize: 11 }}>{lt.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: C.dim, fontSize: 11, fontFamily: 'monospace' }}>?ref={code}</span>
                  <button onClick={() => copy(lt.url, `cat-${i}`)} style={{ ...(copiedLink === `cat-${i}` ? { ...s.btnGold, backgroundColor: '#1a3a1a', color: C.green } : s.btnGhost), padding: '7px 16px', fontSize: 10 }}>
                    {copiedLink === `cat-${i}` ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Product link generator */}
          <div style={{ ...s.card, padding: 22 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', marginBottom: 4 }}>Product Link Generator</p>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Generate a referral link for any specific product</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="text" value={customProduct} onChange={e => setCustomProduct(e.target.value)} placeholder="e.g. Obsidian Throne" style={{ ...s.input, flex: 1 }} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              <button onClick={generateProductLink} disabled={!customProduct.trim()} style={{ ...s.btnGold, opacity: customProduct.trim() ? 1 : 0.4, cursor: customProduct.trim() ? 'pointer' : 'not-allowed' }}>Generate</button>
            </div>
            {generatedLink && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1, padding: '11px 14px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: 'monospace', fontSize: 12, color: C.gold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{generatedLink}</div>
                <button onClick={() => copy(generatedLink, 'generated')} style={{ ...s.btnGold, flexShrink: 0 }}>{copiedLink === 'generated' ? '✓ Copied!' : 'Copy'}</button>
              </div>
            )}
          </div>
        </div>}

        {/* ══ REFERRALS ══════════════════════════════════════════════════════ */}
        {activeTab === 'referrals' && (
          stats?.recentOrders?.length > 0 ? (
            <div style={{ ...s.card, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
                {['Order', 'Date', 'Amount', 'Commission'].map(h => (
                  <p key={h} style={{ color: C.dim, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</p>
                ))}
              </div>
              {stats.recentOrders.map((o, i) => (
                <div key={o._id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: i < stats.recentOrders.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{o.orderNumber}</p>
                  <p style={{ color: C.muted, fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>KES {o.totalPrice?.toLocaleString()}</p>
                  <p style={{ color: C.green, fontWeight: 900, fontSize: 13 }}>KES {o.affiliateCommission?.toLocaleString() || Math.round((o.totalPrice || 0) * commissionRate / 100).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...s.card, padding: 48, textAlign: 'center', border: `2px dashed ${C.border}` }}>
              <p style={{ fontSize: 40, marginBottom: 14 }}>🔗</p>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 18, marginBottom: 8 }}>No referrals yet</p>
              <p style={{ color: C.muted, fontSize: 13, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.75 }}>Once someone clicks your referral link and makes a purchase, their order will appear here with your commission amount.</p>
              <button onClick={() => setActiveTab('links')} style={s.btnGold}>Get My Link →</button>
            </div>
          )
        )}

        {/* ══ PAYOUTS ════════════════════════════════════════════════════════ */}
        {activeTab === 'payouts' && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ height: 2, backgroundColor: C.gold, borderRadius: 2, marginBottom: 18 }} />
              <p style={s.eyebrow}>Pending Payout</p>
              <p style={{ color: stats?.pendingBalance > 0 ? C.gold : C.cream, fontWeight: 900, fontSize: 36, marginBottom: 6 }}>
                KES {(stats?.pendingBalance || 0).toLocaleString()}
              </p>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
                {stats?.pendingBalance >= 500 ? '✅ Above minimum — will be paid on the 1st.' : `KES ${(500 - (stats?.pendingBalance || 0)).toLocaleString()} more needed to reach minimum payout.`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.muted, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <span>📱</span><span>Will be sent to {payoutForm.method} · {payoutForm.number || 'not set'}</span>
              </div>
            </div>
            <div style={{ ...s.card, padding: 22 }}>
              <p style={s.eyebrow}>Payout Settings</p>
              {[
                ['Method',          payoutForm.method],
                ['Number / Account',payoutForm.number || 'Not set'],
                ['Schedule',        'Monthly (1st)'],
                ['Minimum payout',  'KES 500'],
                ['Commission rate', `${commissionRate}%`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                  <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{value}</span>
                </div>
              ))}
              <button onClick={() => setShowPayoutModal(true)} style={{ ...s.btnGhost, width: '100%', marginTop: 14, padding: '10px', textAlign: 'center', boxSizing: 'border-box' }}>Update Payout Details</button>
            </div>
          </div>
          <div style={{ ...s.card, padding: 48, textAlign: 'center', border: `2px dashed ${C.border}` }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>💰</p>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 6 }}>No payouts yet</p>
            <p style={{ color: C.muted, fontSize: 13 }}>Your payout history will appear here once you receive your first commission payment.</p>
          </div>
        </div>}

        {/* ══ MARKETING KIT ══════════════════════════════════════════════════ */}
        {activeTab === 'materials' && <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14 }}>
            <span style={{ color: C.gold, fontSize: 16, marginTop: 2 }}>✦</span>
            <div>
              <p style={{ color: C.gold, fontWeight: 900, fontSize: 13, marginBottom: 5 }}>How to use this kit</p>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>Your referral code <strong style={{ color: C.gold }}>{code}</strong> is already embedded in every caption below. Copy and paste directly.</p>
            </div>
          </div>

          <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Caption Templates</p>
          {captions(code).map((c, i) => (
            <div key={c.platform} style={{ ...s.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{c.platform}</p>
                </div>
                <button onClick={() => copyCaption(c.text, i)} style={{ ...(copiedCaption === i ? { ...s.btnGold, backgroundColor: '#1a3a1a', color: C.green } : s.btnGhost), padding: '7px 14px', fontSize: 10 }}>
                  {copiedCaption === i ? '✓ Copied!' : 'Copy Caption'}
                </button>
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{c.text}</p>
              </div>
            </div>
          ))}

          <div style={{ ...s.card, padding: 22 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Hashtag Bank</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {hashtags.map(tag => (
                <button key={tag} onClick={() => copy(tag, tag)} style={{ padding: '6px 12px', borderRadius: 100, fontWeight: 900, fontSize: 11, cursor: 'pointer', border: `1px solid ${copiedLink === tag ? '#2a5a2a' : C.border}`, backgroundColor: copiedLink === tag ? '#1a3a1a' : C.faint, color: copiedLink === tag ? C.green : C.muted }}>
                  {copiedLink === tag ? '✓' : tag}
                </button>
              ))}
            </div>
            <p style={{ color: C.dim, fontSize: 11, marginTop: 12 }}>Click any hashtag to copy it</p>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default AffiliateDashboard;