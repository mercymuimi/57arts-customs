import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ── MOCK DATA ─────────────────────────────────────────────
const affiliateUser = {
  name: 'Amara Osei',
  avatar: 'AO',
  code: 'AMARA57',
  tier: 'Starter',
  tierCommission: 5,
  nextTier: 'Silver',
  nextTierThreshold: 50000,
  currentMonthSales: 22000,
  joinDate: 'September 2023',
};

const earningsSummary = [
  { label: 'This Month',     value: 'KES 1,100', sub: '5% of KES 22,000',   color: 'text-yellow-400' },
  { label: 'All Time',       value: 'KES 6,840', sub: '14 conversions total', color: 'text-white'      },
  { label: 'Pending Payout', value: 'KES 1,100', sub: 'Pays out Nov 1',       color: 'text-green-400'  },
  { label: 'Total Clicks',   value: '342',        sub: 'This month',           color: 'text-white'      },
];

const chartData = [
  { month: 'May', clicks: 28,  conversions: 1 },
  { month: 'Jun', clicks: 45,  conversions: 2 },
  { month: 'Jul', clicks: 62,  conversions: 1 },
  { month: 'Aug', clicks: 80,  conversions: 3 },
  { month: 'Sep', clicks: 95,  conversions: 4 },
  { month: 'Oct', clicks: 118, conversions: 3 },
];

const linkTemplates = [
  { label: 'Full site',     url: 'https://57arts.com?ref=AMARA57',                  desc: 'Link to the homepage'       },
  { label: 'Shop',          url: 'https://57arts.com/shop?ref=AMARA57',             desc: 'Link to all products'       },
  { label: 'Fashion',       url: 'https://57arts.com/fashion?ref=AMARA57',          desc: 'Fashion category'           },
  { label: 'Furniture',     url: 'https://57arts.com/furniture?ref=AMARA57',        desc: 'Furniture category'         },
  { label: 'Beads',         url: 'https://57arts.com/beads?ref=AMARA57',            desc: 'Beads & jewellery'          },
  { label: 'Custom Orders', url: 'https://57arts.com/custom-order?ref=AMARA57',     desc: 'Custom order studio'        },
];

const captions = [
  {
    platform: 'Instagram',
    icon: '📸',
    text: `Just discovered @57artscustoms and I am obsessed 😍 Handcrafted African luxury — furniture, fashion, beads, all made to order. Use my link in bio for free shipping on your first order. https://57arts.com?ref=AMARA57 #AfricanCraft #57Arts #Handmade #LuxuryAfrica`,
  },
  {
    platform: 'TikTok',
    icon: '🎬',
    text: `POV: you finally found a marketplace that actually sells real African handmade pieces 🙌 57 Arts & Customs has custom furniture, beads, fashion — all artisan made. Link in bio: https://57arts.com?ref=AMARA57 #AfricanArt #Handmade #CustomOrder #57Arts`,
  },
  {
    platform: 'WhatsApp',
    icon: '💬',
    text: `Hey! Have you seen this platform called 57 Arts & Customs? They do handmade African furniture, fashion and beads — you can even commission custom pieces. Check it out: https://57arts.com?ref=AMARA57`,
  },
  {
    platform: 'Twitter/X',
    icon: '𝕏',
    text: `If you're looking for authentic handcrafted African pieces — furniture, beadwork, bespoke fashion — 57 Arts & Customs is the one. Every piece is made by a real artisan 🧵 https://57arts.com?ref=AMARA57 #AfricanCraft`,
  },
];

const MAX_CHART_CLICKS = 130;

// ── COMPONENT ─────────────────────────────────────────────
const AffiliateDashboard = () => {
  const [activeTab, setActiveTab]           = useState('overview');
  const [copiedLink, setCopiedLink]         = useState(null);
  const [copiedCaption, setCopiedCaption]   = useState(null);
  const [customProduct, setCustomProduct]   = useState('');
  const [generatedLink, setGeneratedLink]   = useState('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm]         = useState({ method: 'M-Pesa', number: '+254 7** *** 421' });
  const [payoutSaved, setPayoutSaved]       = useState(false);

  const tierProgress = (affiliateUser.currentMonthSales / affiliateUser.nextTierThreshold) * 100;
  const baseLink = `https://57arts.com?ref=${affiliateUser.code}`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const copyCaptionToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(key);
    setTimeout(() => setCopiedCaption(null), 2000);
  };

  const generateProductLink = () => {
    if (!customProduct.trim()) return;
    const slug = customProduct.toLowerCase().replace(/\s+/g, '-');
    setGeneratedLink(`https://57arts.com/product/${slug}?ref=${affiliateUser.code}`);
  };

  const handleSavePayoutDetails = () => {
    setPayoutSaved(true);
    setTimeout(() => {
      setPayoutSaved(false);
      setShowPayoutModal(false);
    }, 1500);
  };

  const tabs = [
    { key: 'overview',   label: 'Overview'       },
    { key: 'links',      label: 'My Links'        },
    { key: 'referrals',  label: 'Referrals'       },
    { key: 'payouts',    label: 'Payouts'         },
    { key: 'materials',  label: 'Marketing Kit'   },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* ── PAYOUT DETAILS MODAL ─────────────────────── */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl border border-gray-800 p-8 w-full max-w-md"
            style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-lg uppercase">Update Payout Details</h3>
              <button onClick={() => setShowPayoutModal(false)}
                className="text-gray-500 hover:text-white transition text-xl">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                  Payout Method
                </label>
                <select
                  value={payoutForm.method}
                  onChange={e => setPayoutForm({ ...payoutForm, method: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                  style={{ backgroundColor: '#2a2000' }}>
                  <option>M-Pesa</option>
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                </select>
              </div>

              {payoutForm.method === 'M-Pesa' && (
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                    Safaricom Number
                  </label>
                  <div className="flex items-center border border-gray-700 focus-within:border-yellow-400 rounded-xl overflow-hidden transition"
                    style={{ backgroundColor: '#2a2000' }}>
                    <span className="text-gray-500 text-sm px-4 border-r border-gray-700 py-3">+254</span>
                    <input
                      type="text"
                      value={payoutForm.number.replace('+254', '').trim()}
                      onChange={e => setPayoutForm({ ...payoutForm, number: `+254 ${e.target.value}` })}
                      placeholder="7XX XXX XXX"
                      className="flex-1 bg-transparent text-white text-sm px-4 py-3 outline-none placeholder-gray-700"
                    />
                  </div>
                  <p className="text-gray-600 text-xs mt-1">
                    Must be a registered Safaricom M-Pesa number
                  </p>
                </div>
              )}

              {payoutForm.method === 'Bank Transfer' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                      Bank Name
                    </label>
                    <input type="text" placeholder="e.g. Equity Bank Kenya"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                      Account Number
                    </label>
                    <input type="text" placeholder="Your account number"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                </div>
              )}

              {payoutForm.method === 'PayPal' && (
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                    PayPal Email
                  </label>
                  <input type="email" placeholder="your@paypal.com"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
              )}

              <div className="pt-2 border-t border-gray-800">
                <p className="text-gray-600 text-xs mb-4">
                  ⚠️ Minimum payout is KES 500. Payouts are processed on the 1st of every month.
                  Changes take effect from the next payout cycle.
                </p>
                <button
                  onClick={handleSavePayoutDetails}
                  className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                  {payoutSaved ? '✓ Details Saved!' : 'Save Payout Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ───────────────────────────────────── */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
              <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
              <span>›</span>
              <span className="text-yellow-400">Affiliate Dashboard</span>
            </div>
            <h1 className="text-white font-black text-lg uppercase tracking-wide">
              Affiliate Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700"
              style={{ backgroundColor: '#2a2000' }}>
              <span className="text-yellow-400 text-xs">✦</span>
              <span className="text-white font-black text-xs">{affiliateUser.tier} Tier</span>
              <span className="text-gray-500 text-xs">· {affiliateUser.tierCommission}% commission</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-xs">
              {affiliateUser.avatar}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────── */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8">
        <div className="max-w-6xl mx-auto flex">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-4 font-black text-xs uppercase tracking-widest border-b-2 transition ${
                activeTab === tab.key
                  ? 'text-yellow-400 border-yellow-400'
                  : 'text-gray-600 border-transparent hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* ══ OVERVIEW ══════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Welcome + tier progress */}
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2 rounded-2xl border border-yellow-900 p-6"
                style={{ backgroundColor: '#2a2000' }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-1">
                      Welcome back
                    </p>
                    <h2 className="text-white font-black text-2xl">{affiliateUser.name}</h2>
                    <p className="text-gray-500 text-xs mt-1">
                      Affiliate since {affiliateUser.joinDate} · Code:{' '}
                      <span className="text-yellow-400 font-black">{affiliateUser.code}</span>
                    </p>
                  </div>
                  <button onClick={() => copyToClipboard(baseLink, 'main')}
                    className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2.5 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                    {copiedLink === 'main' ? '✓ Copied!' : '🔗 Copy My Link'}
                  </button>
                </div>

                {/* Tier progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-400 text-xs">
                      Progress to{' '}
                      <span className="text-yellow-400 font-black">{affiliateUser.nextTier}</span> tier
                      (8% commission)
                    </p>
                    <p className="text-gray-400 text-xs">
                      KES {(affiliateUser.nextTierThreshold - affiliateUser.currentMonthSales).toLocaleString()} to go
                    </p>
                  </div>
                  <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(tierProgress, 100)}%` }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-yellow-400 text-xs font-black">
                      KES {affiliateUser.currentMonthSales.toLocaleString()} referred this month
                    </span>
                    <span className="text-gray-600 text-xs">
                      Target: KES {affiliateUser.nextTierThreshold.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="rounded-2xl border border-gray-800 p-5"
                style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
                  Quick Stats
                </p>
                {[
                  { label: 'Conversion rate', value: '4.1%'      },
                  { label: 'Avg order value',  value: 'KES 6,500' },
                  { label: 'Cookie window',    value: '30 days'   },
                  { label: 'Next payout',      value: 'Nov 1'     },
                ].map(s => (
                  <div key={s.label}
                    className="flex justify-between py-2.5 border-b border-gray-800 last:border-0">
                    <span className="text-gray-500 text-xs">{s.label}</span>
                    <span className="text-white font-black text-xs">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings cards */}
            <div className="grid grid-cols-4 gap-4">
              {earningsSummary.map(e => (
                <div key={e.label} className="rounded-2xl border border-gray-800 p-5"
                  style={{ backgroundColor: '#1a1a00' }}>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{e.label}</p>
                  <p className={`font-black text-2xl mb-1 ${e.color}`}>{e.value}</p>
                  <p className="text-gray-600 text-xs">{e.sub}</p>
                </div>
              ))}
            </div>

            {/* Performance chart */}
            <div className="rounded-2xl border border-gray-800 p-6"
              style={{ backgroundColor: '#1a1a00' }}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white font-black text-sm uppercase tracking-widest">
                  Performance — Last 6 Months
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-yellow-400" />
                    <span className="text-gray-400">Clicks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <span className="text-gray-400">Conversions</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-4" style={{ height: '160px' }}>
                {chartData.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-1" style={{ height: '130px' }}>
                      <div className="flex-1 rounded-t-md bg-yellow-400 bg-opacity-30 border border-yellow-900"
                        style={{ height: `${(d.clicks / MAX_CHART_CLICKS) * 100}%` }} />
                      <div className="flex-1 rounded-t-md bg-green-500 bg-opacity-50 border border-green-800"
                        style={{ height: `${(d.conversions / 5) * 100}%` }} />
                    </div>
                    <span className="text-gray-600 text-xs">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty referrals notice */}
            <div className="rounded-2xl border border-dashed border-gray-700 p-10 text-center"
              style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-3xl mb-3">🔗</p>
              <p className="text-white font-black text-sm mb-1">No referrals yet</p>
              <p className="text-gray-500 text-sm mb-4">
                Share your link to start earning. Once someone clicks your link
                and makes a purchase, it will appear here.
              </p>
              <button onClick={() => setActiveTab('links')}
                className="bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                Get My Link →
              </button>
            </div>
          </div>
        )}

        {/* ══ LINKS ══════════════════════════════════════ */}
        {activeTab === 'links' && (
          <div className="space-y-6">

            {/* Main link */}
            <div className="rounded-2xl border border-yellow-900 p-6"
              style={{ backgroundColor: '#2a2000' }}>
              <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
                Your Main Referral Link
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 px-4 py-3 rounded-xl border border-gray-700 font-mono text-sm text-yellow-400"
                  style={{ backgroundColor: '#1a1500' }}>
                  {baseLink}
                </div>
                <button onClick={() => copyToClipboard(baseLink, 'main')}
                  className="flex-shrink-0 bg-yellow-400 text-black px-5 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                  {copiedLink === 'main' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              {/* Share buttons */}
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
                Share your link
              </p>
              <div className="flex gap-3 flex-wrap">
                {/* WhatsApp — opens directly */}
                <a href={`https://wa.me/?text=Check%20out%2057%20Arts%20%26%20Customs%20-%20handcrafted%20African%20luxury!%20${encodeURIComponent(baseLink)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs text-white transition hover:opacity-80"
                  style={{ backgroundColor: '#25D366' }}>
                  💬 Share on WhatsApp
                </a>

                {/* Twitter — opens directly */}
                <a href={`https://twitter.com/intent/tweet?text=Check%20out%2057%20Arts%20%26%20Customs%20-%20handcrafted%20African%20luxury!&url=${encodeURIComponent(baseLink)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs text-white transition hover:opacity-80"
                  style={{ backgroundColor: '#1a1a1a' }}>
                  𝕏 Share on Twitter
                </a>

                {/* Instagram — copy only (no share API) */}
                <button onClick={() => copyToClipboard(`Check out 57 Arts & Customs - handcrafted African luxury! ${baseLink}`, 'ig')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs text-white transition hover:opacity-80"
                  style={{ backgroundColor: '#C13584' }}>
                  {copiedLink === 'ig' ? '✓ Copied for Instagram!' : '📸 Copy for Instagram'}
                </button>

                {/* TikTok — copy only (no share API) */}
                <button onClick={() => copyToClipboard(`Check out 57 Arts & Customs - handcrafted African luxury! ${baseLink}`, 'tt')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs text-white transition hover:opacity-80"
                  style={{ backgroundColor: '#010101', border: '1px solid #333' }}>
                  {copiedLink === 'tt' ? '✓ Copied for TikTok!' : '🎬 Copy for TikTok'}
                </button>
              </div>

              {/* Instagram & TikTok note */}
              <p className="text-gray-600 text-xs mt-3">
                ℹ️ Instagram and TikTok don't support direct share links — copy the link and paste it into your bio or caption manually.
              </p>
            </div>

            {/* Category links */}
            <div className="rounded-2xl border border-gray-800 overflow-hidden"
              style={{ backgroundColor: '#1a1a00' }}>
              <div className="p-5 border-b border-gray-800">
                <p className="text-white font-black text-sm uppercase tracking-widest">
                  Category Links
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Use these to promote specific sections
                </p>
              </div>
              <div className="divide-y divide-gray-800">
                {linkTemplates.map((lt, i) => (
                  <div key={lt.label}
                    className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-black text-sm">{lt.label}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{lt.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 text-xs font-mono hidden lg:block">
                        {lt.url.replace('https://57arts.com', '')}
                      </span>
                      <button onClick={() => copyToClipboard(lt.url, `cat-${i}`)}
                        className={`px-4 py-2 rounded-xl font-black text-xs transition ${
                          copiedLink === `cat-${i}`
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                        }`}
                        style={copiedLink !== `cat-${i}` ? { backgroundColor: '#2a2000' } : {}}>
                        {copiedLink === `cat-${i}` ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product link generator */}
            <div className="rounded-2xl border border-gray-800 p-6"
              style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-white font-black text-sm uppercase tracking-widest mb-1">
                Product Link Generator
              </p>
              <p className="text-gray-500 text-xs mb-4">
                Generate a referral link for any specific product
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customProduct}
                  onChange={e => setCustomProduct(e.target.value)}
                  placeholder="e.g. Obsidian Throne"
                  className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                  style={{ backgroundColor: '#2a2000' }}
                />
                <button onClick={generateProductLink}
                  disabled={!customProduct.trim()}
                  className="flex-shrink-0 bg-yellow-400 text-black px-5 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Generate
                </button>
              </div>
              {generatedLink && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 rounded-xl border border-yellow-900 font-mono text-xs text-yellow-400"
                    style={{ backgroundColor: '#2a2000' }}>
                    {generatedLink}
                  </div>
                  <button onClick={() => copyToClipboard(generatedLink, 'generated')}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl font-black text-xs transition ${
                      copiedLink === 'generated'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                    }`}>
                    {copiedLink === 'generated' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ REFERRALS ══════════════════════════════════ */}
        {activeTab === 'referrals' && (
          <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
            style={{ backgroundColor: '#1a1a00' }}>
            <p className="text-4xl mb-4">🔗</p>
            <p className="text-white font-black text-lg mb-2">No referrals yet</p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Once someone clicks your referral link and makes a purchase within
              30 days, their order will appear here with your commission amount.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setActiveTab('links')}
                className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                Get My Link →
              </button>
              <button onClick={() => setActiveTab('materials')}
                className="border border-gray-700 text-gray-300 px-5 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition">
                View Marketing Kit
              </button>
            </div>

            {/* What referrals will look like */}
            <div className="mt-10 rounded-2xl border border-gray-800 overflow-hidden text-left"
              style={{ backgroundColor: '#0d0d00' }}>
              <div className="px-5 py-3 border-b border-gray-800">
                <p className="text-gray-600 text-xs font-black uppercase tracking-widest">
                  Preview — what your referrals table will look like
                </p>
              </div>
              <div className="grid grid-cols-5 px-5 py-3 border-b border-gray-800">
                {['Date', 'Product', 'Category', 'Sale Value', 'Commission'].map(h => (
                  <p key={h} className="text-gray-700 text-xs font-black uppercase tracking-widest">{h}</p>
                ))}
              </div>
              {[
                { date: 'Oct 22', product: 'Obsidian Throne', cat: 'Furniture', sale: 'KES 8,500', com: 'KES 425' },
                { date: 'Oct 18', product: 'Gold Pulse Beads', cat: 'Beads',    sale: 'KES 4,200', com: 'KES 210' },
              ].map((r, i) => (
                <div key={i} className="grid grid-cols-5 px-5 py-3.5 opacity-30">
                  <p className="text-gray-500 text-xs">{r.date}</p>
                  <p className="text-gray-500 text-xs">{r.product}</p>
                  <p className="text-gray-500 text-xs">{r.cat}</p>
                  <p className="text-gray-500 text-xs">{r.sale}</p>
                  <p className="text-gray-500 text-xs">{r.com}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PAYOUTS ════════════════════════════════════ */}
        {activeTab === 'payouts' && (
          <div className="space-y-5">

            <div className="grid grid-cols-2 gap-5">

              {/* Next payout */}
              <div className="rounded-2xl border border-yellow-900 p-6"
                style={{ backgroundColor: '#2a2000' }}>
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-3">
                  Next Payout
                </p>
                <p className="text-white font-black text-3xl mb-1">KES 0</p>
                <p className="text-gray-500 text-sm mb-1">
                  You have no pending commissions yet.
                </p>
                <p className="text-gray-600 text-xs mb-4">
                  Payouts are processed on the 1st of every month once your
                  balance reaches KES 500.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-yellow-900">
                  <span>📱</span>
                  <span>Will be sent to M-Pesa · {payoutForm.number}</span>
                </div>
              </div>

              {/* Payout settings */}
              <div className="rounded-2xl border border-gray-800 p-6"
                style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-gray-500 font-black text-xs uppercase tracking-widest mb-4">
                  Payout Settings
                </p>
                <div className="space-y-3 mb-5">
                  {[
                    { label: 'Method',          value: payoutForm.method   },
                    { label: 'Number',           value: payoutForm.number   },
                    { label: 'Schedule',         value: 'Monthly (1st)'     },
                    { label: 'Minimum payout',   value: 'KES 500'           },
                    { label: 'Commission rate',  value: `${affiliateUser.tierCommission}%` },
                  ].map(s => (
                    <div key={s.label}
                      className="flex justify-between border-b border-gray-800 pb-2.5 last:border-0">
                      <span className="text-gray-500 text-xs">{s.label}</span>
                      <span className="text-white font-black text-xs">{s.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowPayoutModal(true)}
                  className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
                  Update Payout Details
                </button>
              </div>
            </div>

            {/* Payout history — empty */}
            <div className="rounded-2xl border border-dashed border-gray-700 p-10 text-center"
              style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-3xl mb-3">💰</p>
              <p className="text-white font-black text-sm mb-1">No payouts yet</p>
              <p className="text-gray-500 text-sm">
                Your payout history will appear here once you receive your first commission payment.
              </p>
            </div>
          </div>
        )}

        {/* ══ MARKETING KIT ══════════════════════════════ */}
        {activeTab === 'materials' && (
          <div className="space-y-6">

            <div className="rounded-2xl border border-yellow-900 p-5 flex items-start gap-3"
              style={{ backgroundColor: '#2a2000' }}>
              <span className="text-yellow-400 text-lg mt-0.5">✦</span>
              <div>
                <p className="text-yellow-400 font-black text-sm mb-1">How to use this kit</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Copy any caption and paste it directly into your post. Your
                  referral link is already embedded. Each caption is written for
                  the specific platform — tone, length, and hashtags included.
                  For Instagram and TikTok, paste the link manually into your bio.
                </p>
              </div>
            </div>

            {/* Caption templates */}
            <div className="space-y-4">
              <p className="text-white font-black text-sm uppercase tracking-widest">
                Caption Templates
              </p>
              {captions.map((c, i) => (
                <div key={c.platform}
                  className="rounded-2xl border border-gray-800 overflow-hidden"
                  style={{ backgroundColor: '#1a1a00' }}>
                  <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.icon}</span>
                      <p className="text-white font-black text-sm">{c.platform}</p>
                      {(c.platform === 'Instagram' || c.platform === 'TikTok') && (
                        <span className="text-gray-600 text-xs border border-gray-700 px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#2a2000' }}>
                          paste link in bio
                        </span>
                      )}
                    </div>
                    <button onClick={() => copyCaptionToClipboard(c.text, i)}
                      className={`px-4 py-2 rounded-xl font-black text-xs transition ${
                        copiedCaption === i
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                      }`}
                      style={copiedCaption !== i ? { backgroundColor: '#2a2000' } : {}}>
                      {copiedCaption === i ? '✓ Copied!' : 'Copy Caption'}
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hashtag bank */}
            <div className="rounded-2xl border border-gray-800 p-5"
              style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-white font-black text-sm uppercase tracking-widest mb-4">
                Hashtag Bank
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '#AfricanCraft', '#57Arts', '#Handmade', '#LuxuryAfrica',
                  '#AfricanFurniture', '#AfricanFashion', '#BeadWork',
                  '#CustomOrder', '#ArtisanMade', '#AfricanDesign',
                  '#MadeInAfrica', '#CraftedInAfrica', '#AfricanArtisan',
                  '#NairobiStyle', '#AfricanLuxury', '#BespokeAfrica',
                ].map(tag => (
                  <button key={tag}
                    onClick={() => copyToClipboard(tag, tag)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-black transition ${
                      copiedLink === tag
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                    }`}
                    style={copiedLink !== tag ? { backgroundColor: '#2a2000' } : {}}>
                    {copiedLink === tag ? '✓' : tag}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-3">Click any hashtag to copy it</p>
            </div>

            {/* Conversion tips */}
            <div className="rounded-2xl border border-gray-800 p-6"
              style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-white font-black text-sm uppercase tracking-widest mb-4">
                Tips for Higher Conversions
              </p>
              <div className="space-y-3">
                {[
                  { tip: 'Post during peak hours',    detail: 'Tue–Thu 7–9pm EAT gets the highest engagement from African and diaspora audiences.'     },
                  { tip: 'Show the product in use',   detail: 'Furniture in a real room or jewellery being worn converts 3× better than product shots.' },
                  { tip: 'Use your own story',        detail: 'Tell your audience why YOU love 57 Arts. Authentic recommendations outperform generic ones.'  },
                  { tip: 'Pin your link in bio',      detail: 'Add your referral link to your Instagram bio and mention it in every relevant post.'       },
                  { tip: 'Target the diaspora',       detail: 'African diaspora in the UK, USA, and Canada have high buying power and love authentic craft.' },
                ].map(t => (
                  <div key={t.tip}
                    className="flex gap-3 pb-3 border-b border-gray-800 last:border-0">
                    <span className="text-yellow-400 font-black text-sm flex-shrink-0">✦</span>
                    <div>
                      <p className="text-white font-black text-sm mb-0.5">{t.tip}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0d0d00' }}
        className="border-t border-yellow-900 px-8 py-8 mt-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/affiliate" className="hover:text-yellow-400 transition">Programme Info</Link>
            <Link to="/shop"      className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/contact"   className="hover:text-yellow-400 transition">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default AffiliateDashboard;