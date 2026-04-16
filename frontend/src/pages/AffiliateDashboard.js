import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
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

const affiliateUser = { name: 'Amara Osei', avatar: 'AO', code: 'AMARA57', tier: 'Starter', tierCommission: 5, nextTier: 'Silver', nextTierThreshold: 50000, currentMonthSales: 22000, joinDate: 'September 2023' };
const earningsSummary = [
  { label: 'This Month',     value: 'KES 1,100', sub: '5% of KES 22,000',    gold: true  },
  { label: 'All Time',       value: 'KES 6,840', sub: '14 conversions total', gold: false },
  { label: 'Pending Payout', value: 'KES 1,100', sub: 'Pays out Nov 1',       green: true },
  { label: 'Total Clicks',   value: '342',        sub: 'This month',           gold: false },
];
const chartData = [
  { month: 'May', clicks: 28,  conv: 1 }, { month: 'Jun', clicks: 45,  conv: 2 },
  { month: 'Jul', clicks: 62,  conv: 1 }, { month: 'Aug', clicks: 80,  conv: 3 },
  { month: 'Sep', clicks: 95,  conv: 4 }, { month: 'Oct', clicks: 118, conv: 3 },
];
const linkTemplates = [
  { label: 'Full site',     url: 'https://57arts.com?ref=AMARA57',              desc: 'Link to the homepage'  },
  { label: 'Shop',          url: 'https://57arts.com/shop?ref=AMARA57',          desc: 'Link to all products'  },
  { label: 'Fashion',       url: 'https://57arts.com/fashion?ref=AMARA57',       desc: 'Fashion category'      },
  { label: 'Furniture',     url: 'https://57arts.com/furniture?ref=AMARA57',     desc: 'Furniture category'    },
  { label: 'Beads',         url: 'https://57arts.com/beads?ref=AMARA57',         desc: 'Beads & jewellery'     },
  { label: 'Custom Orders', url: 'https://57arts.com/custom-order?ref=AMARA57',  desc: 'Custom order studio'   },
];
const captions = [
  { platform: 'Instagram', icon: '📸', text: `Just discovered @57artscustoms and I am obsessed 😍 Handcrafted African luxury — furniture, fashion, beads, all made to order. Use my link in bio for free shipping on your first order. https://57arts.com?ref=AMARA57 #AfricanCraft #57Arts #Handmade #LuxuryAfrica` },
  { platform: 'TikTok',    icon: '🎬', text: `POV: you finally found a marketplace that actually sells real African handmade pieces 🙌 57 Arts & Customs has custom furniture, beads, fashion — all artisan made. Link in bio: https://57arts.com?ref=AMARA57 #AfricanArt #Handmade #CustomOrder #57Arts` },
  { platform: 'WhatsApp',  icon: '💬', text: `Hey! Have you seen this platform called 57 Arts & Customs? They do handmade African furniture, fashion and beads — you can even commission custom pieces. Check it out: https://57arts.com?ref=AMARA57` },
  { platform: 'Twitter/X', icon: '𝕏',  text: `If you're looking for authentic handcrafted African pieces — furniture, beadwork, bespoke fashion — 57 Arts & Customs is the one. Every piece is made by a real artisan 🧵 https://57arts.com?ref=AMARA57 #AfricanCraft` },
];
const hashtags = ['#AfricanCraft','#57Arts','#Handmade','#LuxuryAfrica','#AfricanFurniture','#AfricanFashion','#BeadWork','#CustomOrder','#ArtisanMade','#AfricanDesign','#MadeInAfrica','#CraftedInAfrica','#AfricanArtisan','#NairobiStyle','#AfricanLuxury','#BespokeAfrica'];
const tabs = [{ key: 'overview', label: 'Overview' }, { key: 'links', label: 'My Links' }, { key: 'referrals', label: 'Referrals' }, { key: 'payouts', label: 'Payouts' }, { key: 'materials', label: 'Marketing Kit' }];
const MAX_CLICKS = 130;

const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '40px 0 28px' }}>
    <div style={s.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
          <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57 ARTS & CUSTOMS</span>
        </Link>
        <div style={{ display: 'flex', gap: 22 }}>
          {[['Programme Info', '/affiliate'], ['Shop', '/shop'], ['Contact', '/contact'], ['← Home', '/']].map(([l, p]) => (
            <Link key={l} to={p} style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{l}</Link>
          ))}
        </div>
        <p style={{ color: C.dim, fontSize: 11 }}>© 2024 57 Arts & Customs.</p>
      </div>
    </div>
  </footer>
);

const AffiliateDashboard = () => {
  const [activeTab, setActiveTab]             = useState('overview');
  const [copiedLink, setCopiedLink]           = useState(null);
  const [copiedCaption, setCopiedCaption]     = useState(null);
  const [customProduct, setCustomProduct]     = useState('');
  const [generatedLink, setGeneratedLink]     = useState('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm]           = useState({ method: 'M-Pesa', number: '+254 7** *** 421' });
  const [payoutSaved, setPayoutSaved]         = useState(false);

  const tierProgress = (affiliateUser.currentMonthSales / affiliateUser.nextTierThreshold) * 100;
  const baseLink     = `https://57arts.com?ref=${affiliateUser.code}`;

  const copy = (text, key) => { navigator.clipboard.writeText(text); setCopiedLink(key); setTimeout(() => setCopiedLink(null), 2000); };
  const copyCaption = (text, key) => { navigator.clipboard.writeText(text); setCopiedCaption(key); setTimeout(() => setCopiedCaption(null), 2000); };
  const generateProductLink = () => {
    if (!customProduct.trim()) return;
    setGeneratedLink(`https://57arts.com/product/${customProduct.toLowerCase().replace(/\s+/g, '-')}?ref=${affiliateUser.code}`);
  };
  const savePayoutDetails = () => { setPayoutSaved(true); setTimeout(() => { setPayoutSaved(false); setShowPayoutModal(false); }, 1500); };

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
                  <div style={{ display: 'flex', border: `1px solid ${C.border}`, borderRadius: 9, overflow: 'hidden', backgroundColor: C.faint }}>
                    <span style={{ color: C.muted, fontSize: 13, padding: '11px 14px', borderRight: `1px solid ${C.border}` }}>+254</span>
                    <input type="text" value={payoutForm.number.replace('+254', '').trim()} onChange={e => setPayoutForm({ ...payoutForm, number: `+254 ${e.target.value}` })} placeholder="7XX XXX XXX" style={{ flex: 1, background: 'transparent', border: 'none', color: C.cream, fontSize: 13, padding: '11px 14px', outline: 'none' }} />
                  </div>
                  <p style={{ color: C.dim, fontSize: 11, marginTop: 5 }}>Must be a registered Safaricom M-Pesa number</p>
                </div>
              )}
              {payoutForm.method === 'Bank Transfer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['Bank Name', 'e.g. Equity Bank Kenya'], ['Account Number', 'Your account number']].map(([label, ph]) => (
                    <div key={label}>
                      <label style={s.label}>{label}</label>
                      <input type="text" placeholder={ph} style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                    </div>
                  ))}
                </div>
              )}
              {payoutForm.method === 'PayPal' && (
                <div>
                  <label style={s.label}>PayPal Email</label>
                  <input type="email" placeholder="your@paypal.com" style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              )}
              <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <p style={{ color: C.dim, fontSize: 11, marginBottom: 14, lineHeight: 1.6 }}>⚠ Minimum payout is KES 500. Payouts are processed on the 1st of every month.</p>
                <button onClick={savePayoutDetails} style={{ ...s.btnGold, width: '100%', padding: '13px', textAlign: 'center', borderRadius: 10 }}>
                  {payoutSaved ? '✓ Details Saved!' : 'Save Payout Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 48px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ color: C.muted, fontSize: 11, fontWeight: 900, textDecoration: 'none', letterSpacing: '0.06em' }} onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>← Home</Link>
          <span style={{ color: C.border }}>|</span>
          <div style={{ display: 'flex', gap: 6, fontSize: 11, color: C.muted }}>
            <Link to="/" style={{ color: C.muted, textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>Home</Link>
            <span>›</span>
            <span style={{ color: C.gold }}>Affiliate Dashboard</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 9 }}>
            <span style={{ color: C.gold, fontSize: 11 }}>✦</span>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 11 }}>{affiliateUser.tier} Tier</span>
            <span style={{ color: C.muted, fontSize: 11 }}>· {affiliateUser.tierCommission}% commission</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>{affiliateUser.avatar}</div>
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
                  <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 24, marginBottom: 4 }}>{affiliateUser.name}</h2>
                  <p style={{ color: C.muted, fontSize: 12 }}>Affiliate since {affiliateUser.joinDate} · Code: <span style={{ color: C.gold, fontWeight: 900 }}>{affiliateUser.code}</span></p>
                </div>
                <button onClick={() => copy(baseLink, 'main')} style={{ ...s.btnGold, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {copiedLink === 'main' ? '✓ Copied!' : '🔗 Copy My Link'}
                </button>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ color: C.muted, fontSize: 12 }}>Progress to <span style={{ color: C.gold, fontWeight: 900 }}>{affiliateUser.nextTier}</span> tier (8% commission)</p>
                  <p style={{ color: C.muted, fontSize: 12 }}>KES {(affiliateUser.nextTierThreshold - affiliateUser.currentMonthSales).toLocaleString()} to go</p>
                </div>
                <div style={{ height: 8, backgroundColor: C.border, borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: C.gold, borderRadius: 100, width: `${Math.min(tierProgress, 100)}%`, transition: 'width 0.7s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ color: C.gold, fontSize: 11, fontWeight: 900 }}>KES {affiliateUser.currentMonthSales.toLocaleString()} referred this month</span>
                  <span style={{ color: C.dim, fontSize: 11 }}>Target: KES {affiliateUser.nextTierThreshold.toLocaleString()}</span>
                </div>
              </div>
            </div>
            {/* Quick stats */}
            <div style={{ ...s.card, padding: 22 }}>
              <p style={s.eyebrow}>Quick Stats</p>
              {[['Conversion rate','4.1%'],['Avg order value','KES 6,500'],['Cookie window','30 days'],['Next payout','Nov 1']].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                  <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {earningsSummary.map(e => (
              <div key={e.label} style={{ ...s.card, padding: 20 }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{e.label}</p>
                <p style={{ fontWeight: 900, fontSize: 24, marginBottom: 4, color: e.gold ? C.gold : e.green ? C.green : C.cream }}>{e.value}</p>
                <p style={{ color: C.dim, fontSize: 11 }}>{e.sub}</p>
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
                    <div style={{ flex: 1, borderRadius: '4px 4px 0 0', backgroundColor: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.4)', height: `${(d.clicks / MAX_CLICKS) * 100}%` }} />
                    <div style={{ flex: 1, borderRadius: '4px 4px 0 0', backgroundColor: 'rgba(74,222,128,0.45)', border: '1px solid rgba(74,222,128,0.3)', height: `${(d.conv / 5) * 100}%` }} />
                  </div>
                  <span style={{ color: C.dim, fontSize: 10 }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* No referrals yet */}
          <div style={{ ...s.card, padding: 48, textAlign: 'center', border: `2px dashed ${C.border}` }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>🔗</p>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 6 }}>No referrals yet</p>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Share your link to start earning. Once someone clicks and purchases, it appears here.</p>
            <button onClick={() => setActiveTab('links')} style={s.btnGold}>Get My Link →</button>
          </div>
        </>}

        {/* ══ LINKS ══════════════════════════════════════════════════════════ */}
        {activeTab === 'links' && <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Main link */}
          <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
            <div style={{ height: 2, backgroundColor: C.gold, borderRadius: 2, marginBottom: 18 }} />
            <p style={s.eyebrow}>Your Main Referral Link</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: '12px 16px', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: 'monospace', fontSize: 13, color: C.gold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{baseLink}</div>
              <button onClick={() => copy(baseLink, 'main')} style={{ ...s.btnGold, flexShrink: 0 }}>{copiedLink === 'main' ? '✓ Copied!' : 'Copy'}</button>
            </div>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Share your link</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={`https://wa.me/?text=Check%20out%2057%20Arts%20%26%20Customs!%20${encodeURIComponent(baseLink)}`} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 9, fontWeight: 900, fontSize: 11, color: '#fff', textDecoration: 'none', backgroundColor: '#25D366', display: 'inline-flex', alignItems: 'center', gap: 6 }}>💬 WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=Check%20out%2057%20Arts%20%26%20Customs!&url=${encodeURIComponent(baseLink)}`} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 9, fontWeight: 900, fontSize: 11, color: '#fff', textDecoration: 'none', backgroundColor: '#111', border: `1px solid ${C.border}`, display: 'inline-flex', alignItems: 'center', gap: 6 }}>𝕏 Twitter</a>
              <button onClick={() => copy(`Check out 57 Arts & Customs! ${baseLink}`, 'ig')} style={{ padding: '9px 16px', borderRadius: 9, fontWeight: 900, fontSize: 11, color: '#fff', backgroundColor: '#C13584', border: 'none', cursor: 'pointer' }}>{copiedLink === 'ig' ? '✓ Copied!' : '📸 Copy for Instagram'}</button>
              <button onClick={() => copy(`Check out 57 Arts & Customs! ${baseLink}`, 'tt')} style={{ padding: '9px 16px', borderRadius: 9, fontWeight: 900, fontSize: 11, color: '#fff', backgroundColor: '#010101', border: `1px solid ${C.border}`, cursor: 'pointer' }}>{copiedLink === 'tt' ? '✓ Copied!' : '🎬 Copy for TikTok'}</button>
            </div>
            <p style={{ color: C.dim, fontSize: 11, marginTop: 10 }}>ℹ Instagram and TikTok don't support direct share — copy the link and paste it manually.</p>
          </div>

          {/* Category links */}
          <div style={{ ...s.card, overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category Links</p>
              <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>Use these to promote specific sections</p>
            </div>
            {linkTemplates.map((lt, i) => (
              <div key={lt.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: i < linkTemplates.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{lt.label}</p>
                  <p style={{ color: C.dim, fontSize: 11, marginTop: 2 }}>{lt.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: C.dim, fontSize: 11, fontFamily: 'monospace' }}>{lt.url.replace('https://57arts.com', '')}</span>
                  <button onClick={() => copy(lt.url, `cat-${i}`)} style={{ ...(copiedLink === `cat-${i}` ? { ...s.btnGold, backgroundColor: '#1a3a1a', color: C.green } : s.btnGhost), padding: '7px 16px', fontSize: 10 }}>
                    {copiedLink === `cat-${i}` ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Product link generator */}
          <div style={{ ...s.card, padding: 22 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Product Link Generator</p>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Generate a referral link for any specific product</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="text" value={customProduct} onChange={e => setCustomProduct(e.target.value)} placeholder="e.g. Obsidian Throne" style={{ ...s.input, flex: 1, borderRadius: 9 }} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              <button onClick={generateProductLink} disabled={!customProduct.trim()} style={{ ...s.btnGold, flexShrink: 0, opacity: customProduct.trim() ? 1 : 0.4, cursor: customProduct.trim() ? 'pointer' : 'not-allowed' }}>Generate</button>
            </div>
            {generatedLink && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1, padding: '11px 14px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: 'monospace', fontSize: 12, color: C.gold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{generatedLink}</div>
                <button onClick={() => copy(generatedLink, 'generated')} style={{ ...s.btnGold, flexShrink: 0, backgroundColor: copiedLink === 'generated' ? '#1a3a1a' : C.gold, color: copiedLink === 'generated' ? C.green : '#000' }}>{copiedLink === 'generated' ? '✓ Copied!' : 'Copy'}</button>
              </div>
            )}
          </div>
        </div>}

        {/* ══ REFERRALS ══════════════════════════════════════════════════════ */}
        {activeTab === 'referrals' && (
          <div style={{ ...s.card, padding: 48, textAlign: 'center', border: `2px dashed ${C.border}` }}>
            <p style={{ fontSize: 40, marginBottom: 14 }}>🔗</p>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 18, marginBottom: 8 }}>No referrals yet</p>
            <p style={{ color: C.muted, fontSize: 13, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.75 }}>Once someone clicks your referral link and makes a purchase within 30 days, their order will appear here with your commission amount.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setActiveTab('links')} style={s.btnGold}>Get My Link →</button>
              <button onClick={() => setActiveTab('materials')} style={s.btnGhost}>View Marketing Kit</button>
            </div>
          </div>
        )}

        {/* ══ PAYOUTS ════════════════════════════════════════════════════════ */}
        {activeTab === 'payouts' && <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ height: 2, backgroundColor: C.gold, borderRadius: 2, marginBottom: 18 }} />
              <p style={s.eyebrow}>Next Payout</p>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 36, marginBottom: 6 }}>KES 0</p>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>You have no pending commissions yet.</p>
              <p style={{ color: C.dim, fontSize: 11, marginBottom: 16, lineHeight: 1.6 }}>Payouts are processed on the 1st of every month once your balance reaches KES 500.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.muted, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <span>📱</span><span>Will be sent to M-Pesa · {payoutForm.number}</span>
              </div>
            </div>
            <div style={{ ...s.card, padding: 22 }}>
              <p style={s.eyebrow}>Payout Settings</p>
              {[['Method', payoutForm.method], ['Number', payoutForm.number], ['Schedule', 'Monthly (1st)'], ['Minimum payout', 'KES 500'], ['Commission rate', `${affiliateUser.tierCommission}%`]].map(([label, value]) => (
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
            <span style={{ color: C.gold, fontSize: 16, marginTop: 2, flexShrink: 0 }}>✦</span>
            <div>
              <p style={{ color: C.gold, fontWeight: 900, fontSize: 13, marginBottom: 5 }}>How to use this kit</p>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>Copy any caption and paste it directly into your post. Your referral link is already embedded. Each caption is written for the specific platform — tone, length, and hashtags included.</p>
            </div>
          </div>

          {/* Caption templates */}
          <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Caption Templates</p>
          {captions.map((c, i) => (
            <div key={c.platform} style={{ ...s.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{c.platform}</p>
                  {(c.platform === 'Instagram' || c.platform === 'TikTok') && (
                    <span style={{ color: C.dim, fontSize: 10, fontWeight: 700, border: `1px solid ${C.border}`, padding: '2px 8px', borderRadius: 100 }}>paste link in bio</span>
                  )}
                </div>
                <button onClick={() => copyCaption(c.text, i)} style={{ ...copiedCaption === i ? { ...s.btnGold, backgroundColor: '#1a3a1a', color: C.green } : s.btnGhost, padding: '7px 14px', fontSize: 10 }}>
                  {copiedCaption === i ? '✓ Copied!' : 'Copy Caption'}
                </button>
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{c.text}</p>
              </div>
            </div>
          ))}

          {/* Hashtag bank */}
          <div style={{ ...s.card, padding: 22 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Hashtag Bank</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {hashtags.map(tag => (
                <button key={tag} onClick={() => copy(tag, tag)} style={{ padding: '6px 12px', borderRadius: 100, fontWeight: 900, fontSize: 11, cursor: 'pointer', border: `1px solid ${copiedLink === tag ? '#2a5a2a' : C.border}`, backgroundColor: copiedLink === tag ? '#1a3a1a' : C.faint, color: copiedLink === tag ? C.green : C.muted, transition: 'all 0.15s' }}>
                  {copiedLink === tag ? '✓' : tag}
                </button>
              ))}
            </div>
            <p style={{ color: C.dim, fontSize: 11, marginTop: 12 }}>Click any hashtag to copy it</p>
          </div>

          {/* Conversion tips */}
          <div style={{ ...s.card, padding: 24 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Tips for Higher Conversions</p>
            {[
              { tip: 'Post during peak hours',  detail: 'Tue–Thu 7–9pm EAT gets the highest engagement from African and diaspora audiences.' },
              { tip: 'Show the product in use', detail: 'Furniture in a real room or jewellery being worn converts 3× better than product shots.' },
              { tip: 'Use your own story',       detail: 'Tell your audience why YOU love 57 Arts. Authentic recommendations outperform generic ones.' },
              { tip: 'Pin your link in bio',     detail: 'Add your referral link to your Instagram bio and mention it in every relevant post.' },
              { tip: 'Target the diaspora',      detail: 'African diaspora in the UK, USA, and Canada have high buying power and love authentic craft.' },
            ].map((t, i, arr) => (
              <div key={t.tip} style={{ display: 'flex', gap: 14, paddingBottom: 16, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', marginBottom: i < arr.length - 1 ? 16 : 0 }}>
                <span style={{ color: C.gold, fontWeight: 900, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✦</span>
                <div>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 4 }}>{t.tip}</p>
                  <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>
      <Footer />
    </div>
  );
};

export default AffiliateDashboard;