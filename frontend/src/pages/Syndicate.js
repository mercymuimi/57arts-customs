import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const perks = [
  {
    icon: '★',
    title: 'Early Access Protocols',
    desc: 'Secure allocation on limited "Archive" drops and one-off custom releases before public announcement.',
  },
  {
    icon: '✦',
    title: 'Bespoke Consults',
    desc: 'Direct line to our lead artisans for custom conceptualization — furniture, fashion, or beadwork.',
  },
  {
    icon: '🔑',
    title: 'Private Events',
    desc: 'Invitation-only gallery nights and artisan studio tours at undisclosed Nairobi locations.',
  },
  {
    icon: '🛡',
    title: 'The Registry',
    desc: 'Permanent archival documentation for every commissioned piece bearing your name.',
  },
  {
    icon: '💎',
    title: 'Priority Custom Slots',
    desc: 'Skip the queue. Syndicate members get first access to limited artisan commissions.',
  },
  {
    icon: '📦',
    title: 'White-Glove Delivery',
    desc: 'Every piece delivered in bespoke packaging with a hand-signed certificate of authenticity.',
  },
];

const interests = [
  'Custom Furniture',
  'Fashion Commissions',
  'Beads & Jewellery',
  'Archive Drops',
  'Bespoke Consults',
  'Private Events',
];

const stats = [
  { value: '57',    label: 'Members per year' },
  { value: '340+',  label: 'Active artisans'  },
  { value: '98%',   label: 'Satisfaction'     },
  { value: '24hr',  label: 'Response time'    },
];

const Syndicate = () => {
  const [form, setForm]               = useState({ name: '', email: '', code: '', interest: 'Custom Furniture' });
  const [submitted, setSubmitted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [synCode, setSynCode]         = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied]           = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    setTimeout(() => {
      const code = 'SYND-' +
        Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
        Math.random().toString(36).substring(2, 6).toUpperCase();
      setSynCode(code);
      setSubmitted(true);
      setLoading(false);
    }, 1800);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(synCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* ── NAVBAR ───────────────────────────────────── */}
      <nav
        style={{ backgroundColor: 'rgba(26,21,0,0.97)' }}
        className="px-8 py-4 flex justify-between items-center border-b border-yellow-900 sticky top-0 z-30 backdrop-blur-md"
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-yellow-400 text-black w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm">
            57
          </span>
          <span className="text-white font-black text-sm tracking-wide">
            57 ARTS <span className="text-yellow-400">&</span> CUSTOMS
          </span>
        </Link>

        <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest font-black">
          <Link to="/gallery"   className="hover:text-yellow-400 transition">Gallery</Link>
          <Link to="/fashion"   className="hover:text-yellow-400 transition">Collections</Link>
          <Link to="/syndicate" className="text-yellow-400 border-b border-yellow-400 pb-0.5">The Syndicate</Link>
          <Link to="/shop"      className="hover:text-yellow-400 transition">Archive</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-gray-500 hover:text-yellow-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
          <Link to="/profile" className="text-gray-500 hover:text-yellow-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, #FFD700, transparent 60%)' }}
        />

        <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-yellow-400" />
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                Membership Identity
              </span>
            </div>
            <h1 className="text-7xl font-black uppercase leading-none mb-6">
              <span className="text-white block">THE</span>
              <span className="text-yellow-400 italic block">SYNDICATE</span>
              <span className="text-white block">EXPERIENCE</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Welcome to the inner circle of bespoke artisanal craftsmanship. We don't just build
              pieces — we curate a legacy. The Syndicate is an exclusive community for those who
              demand the pinnacle of African craftsmanship.
            </p>
            <div className="flex gap-3">
              <a href="#gateway"
                className="inline-flex items-center gap-2 bg-yellow-400 text-black px-7 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition">
                Apply for Access →
              </a>
              <a href="#perks"
                className="inline-flex items-center gap-2 border border-gray-700 text-gray-400 px-7 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition"
                style={{ backgroundColor: '#2a2000' }}>
                View Perks
              </a>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative rounded-2xl overflow-hidden border border-yellow-900" style={{ height: '420px' }}>
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
              alt="57 Arts Syndicate"
              className="w-full h-full object-cover opacity-70"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(26,21,0,0.85) 0%, transparent 60%)' }}
            />
            {/* Member count badge */}
            <div
              className="absolute bottom-5 left-5 right-5 rounded-xl border border-yellow-900 p-4"
              style={{ backgroundColor: 'rgba(26,21,0,0.9)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-0.5">
                    Syndicate Status
                  </p>
                  <p className="text-white font-black text-sm">Accepting 57 members this year</p>
                </div>
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-black text-sm">
                  ✦
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-yellow-900 px-8 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-4 gap-0 divide-x divide-yellow-900">
            {stats.map(s => (
              <div key={s.label} className="text-center px-8">
                <p className="text-yellow-400 font-black text-3xl mb-1">{s.value}</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERKS ────────────────────────────────────── */}
      <div id="perks" className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-px bg-yellow-400" />
          <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
            Syndicate Perks
          </span>
        </div>
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-white font-black text-4xl uppercase">
            Curated for the <span className="text-yellow-400 italic">Elite</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-xs text-right">
            Everything a serious collector and patron of African craft deserves.
          </p>
        </div>

        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          {perks.slice(0, 3).map((perk, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-800 p-6 hover:border-yellow-900 transition"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <div className="w-10 h-10 bg-yellow-400 bg-opacity-20 border border-yellow-900 rounded-xl flex items-center justify-center mb-4 text-lg">
                {perk.icon}
              </div>
              <h3 className="text-white font-black text-sm uppercase tracking-wide mb-3">
                {perk.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom 3 */}
        <div className="grid grid-cols-3 gap-5">
          {perks.slice(3).map((perk, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-800 p-6 hover:border-yellow-900 transition"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <div className="w-10 h-10 bg-yellow-400 bg-opacity-20 border border-yellow-900 rounded-xl flex items-center justify-center mb-4 text-lg">
                {perk.icon}
              </div>
              <h3 className="text-white font-black text-sm uppercase tracking-wide mb-3">
                {perk.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* Craftsmanship feature banner */}
        <div
          className="mt-5 rounded-2xl border border-yellow-900 overflow-hidden relative"
          style={{ height: '200px' }}>
          <img
            src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200"
            alt="Craftsmanship"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(42,32,0,0.97) 50%, transparent 100%)' }}
          />
          <div className="absolute inset-0 flex items-center px-10">
            <div>
              <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
                ✦ The 57 Arts Standard
              </p>
              <h3 className="text-white font-black text-3xl uppercase leading-tight">
                Craftsmanship<br />
                <span className="text-yellow-400 italic">Without Compromise</span>
              </h3>
            </div>
            <div className="ml-auto">
              <a href="#gateway"
                className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                Join Now →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── GATEWAY — Application Form ───────────────── */}
      <div
        id="gateway"
        className="py-16 px-8"
        style={{ backgroundColor: '#1a1a00', borderTop: '1px solid', borderColor: '#2a2000' }}
      >
        <div className="max-w-xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-px bg-yellow-400" />
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                The Gateway
              </span>
              <div className="w-8 h-px bg-yellow-400" />
            </div>
            <h2 className="text-white font-black text-4xl uppercase leading-tight mb-4">
              Request Your<br />
              <span className="text-yellow-400 italic">Credentials</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
              Membership is limited to 57 active patrons annually. Submit your dossier
              for review and we'll be in touch within 24 hours.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate>
              <div
                className="rounded-2xl border border-gray-800 p-8"
                style={{ backgroundColor: '#1a1500' }}
              >

                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-yellow-400 text-xs font-black uppercase tracking-widest block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }}
                    />
                  </div>
                  <div>
                    <label className="text-yellow-400 text-xs font-black uppercase tracking-widest block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }}
                    />
                  </div>
                </div>

                {/* Invitation code */}
                <div className="mb-4">
                  <label className="text-yellow-400 text-xs font-black uppercase tracking-widest block mb-2">
                    Invitation Code{' '}
                    <span className="text-gray-700 normal-case font-normal tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <div
                    className="flex items-center rounded-xl border border-gray-700 focus-within:border-yellow-400 transition overflow-hidden"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <span className="text-yellow-400 px-4 text-sm flex-shrink-0">🔒</span>
                    <input
                      type="text"
                      value={form.code}
                      onChange={e => handleChange('code', e.target.value)}
                      placeholder="SYND-XXXX-XXXX"
                      className="flex-1 bg-transparent text-white text-sm py-3 pr-4 outline-none placeholder-gray-700 font-mono tracking-widest"
                    />
                  </div>
                </div>

                {/* Primary Interest */}
                <div className="mb-6">
                  <label className="text-yellow-400 text-xs font-black uppercase tracking-widest block mb-2">
                    Primary Interest
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-700 text-white text-sm font-black uppercase tracking-wide hover:border-yellow-400 transition"
                      style={{ backgroundColor: '#2a2000' }}
                    >
                      <span>{form.interest}</span>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div
                        className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-700 overflow-hidden z-20"
                        style={{ backgroundColor: '#1a1a00' }}
                      >
                        {interests.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { handleChange('interest', opt); setDropdownOpen(false); }}
                            className={`w-full px-4 py-3 text-left text-sm font-black uppercase tracking-wide transition border-b border-gray-800 last:border-0 ${
                              form.interest === opt
                                ? 'text-yellow-400 bg-yellow-400 bg-opacity-10'
                                : 'text-gray-500 hover:text-white hover:bg-white hover:bg-opacity-5'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email}
                  className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: loading ? '#8a7020' : '#FFD700', color: '#0a0a00' }}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting Dossier...
                    </>
                  ) : 'Submit Dossier →'}
                </button>
              </div>

              <p className="text-center text-gray-700 text-xs uppercase tracking-widest mt-4">
                ✦ Confidentiality is our primary protocol. All data is encrypted.
              </p>
            </form>

          ) : (
            /* ── SUCCESS STATE ── */
            <div
              className="rounded-2xl border border-yellow-900 p-10 text-center"
              style={{ backgroundColor: '#2a2000' }}
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl font-black text-black">
                ✦
              </div>
              <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
                Dossier Received
              </p>
              <h3 className="text-white font-black text-2xl uppercase mb-3">
                Welcome to the Vanguard,<br />
                <span className="text-yellow-400">{form.name.split(' ')[0]}.</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your application has been logged. Syndicate credentials and access details will
                be dispatched to{' '}
                <span className="text-yellow-400 font-black">{form.email}</span> within 24 hours.
              </p>

              {/* Generated code */}
              <div
                className="rounded-xl border border-yellow-900 p-4 mb-3"
                style={{ backgroundColor: '#1a1500' }}
              >
                <p className="text-gray-600 text-xs uppercase tracking-widest mb-2">
                  Your Provisional Access Code
                </p>
                <p className="text-yellow-400 font-black text-2xl tracking-widest font-mono mb-3">
                  {synCode}
                </p>
                <button
                  onClick={copyCode}
                  className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                  }`}
                  style={!copied ? { backgroundColor: '#2a2000' } : {}}>
                  {copied ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>

              <p className="text-gray-600 text-xs mb-6 leading-relaxed">
                Save this code. You will be asked to confirm it when your invitation email arrives.
                Do not share it.
              </p>

              <div className="flex gap-3 justify-center">
                <Link to="/fashion"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-yellow-500 transition">
                  Browse Collections →
                </Link>
                <Link to="/"
                  className="border border-gray-700 text-gray-400 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide hover:border-yellow-400 hover:text-yellow-400 transition"
                  style={{ backgroundColor: '#1a1500' }}>
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer
        style={{ backgroundColor: '#0d0d00' }}
        className="border-t border-yellow-900 px-8 py-8"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs">
              57
            </span>
            <div>
              <p className="text-white font-black text-sm">57 ARTS & CUSTOMS</p>
              <p className="text-gray-700 text-xs">The Syndicate · Est. 1957</p>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-gray-600 uppercase tracking-widest">
            {['Join the Syndicate', 'Member Access', 'Privacy', 'Contact'].map(l => (
              <span key={l} className="hover:text-yellow-400 cursor-pointer transition">{l}</span>
            ))}
          </div>
          <p className="text-gray-700 text-xs text-right">
            © 2024 57 Arts & Customs.<br />All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Syndicate;