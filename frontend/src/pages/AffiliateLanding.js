import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const tiers = [
  { name: 'Starter', commission: '5%', threshold: 'KES 0', color: 'border-gray-700', text: 'text-gray-400' },
  { name: 'Silver', commission: '8%', threshold: 'KES 50,000 / mo', color: 'border-yellow-400', text: 'text-yellow-400', featured: true },
  { name: 'Gold', commission: '12%', threshold: 'KES 200,000 / mo', color: 'border-yellow-600', text: 'text-yellow-300' },
];

const AffiliateLanding = () => {
  const [form, setForm] = useState({ name: '', email: '', channel: '', audience: '', why: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.channel) e.channel = 'Required';
    if (!form.why.trim() || form.why.length < 20) e.why = 'Tell us a bit more';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  if (submitted) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center px-8"
        style={{ backgroundColor: '#1a1500' }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✦</div>
          <h1 className="text-white font-black text-2xl uppercase mb-2">Application Submitted!</h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Thanks <span className="text-yellow-400 font-black">{form.name}</span>! We'll send your
            affiliate link and dashboard access to <span className="text-yellow-400">{form.email}</span> within 24 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="border border-gray-700 text-gray-300 px-5 py-3 rounded-xl font-black text-sm hover:border-yellow-400 transition">
              Back to Home
            </Link>
            <Link to="/affiliate/dashboard" className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* HERO */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, #FFD700, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-px bg-yellow-400" />
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Affiliate Programme</span>
          </div>
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-black uppercase leading-tight mb-4">
                Earn by sharing<br />
                <span className="text-yellow-400 italic">African craft.</span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Join our affiliate programme and earn up to 12% commission on every sale
                you refer. Share your unique link, track your earnings in real time,
                and get paid monthly to your M-Pesa.
              </p>
              <a href="#apply"
                className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                Join the Programme → Free
              </a>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Average monthly payout', value: 'KES 18,400' },
                { label: 'Highest earning affiliate', value: 'KES 142,000 / mo' },
                { label: 'Active affiliates', value: '340+' },
                { label: 'Cookie duration', value: '30 days' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between px-5 py-3 rounded-xl border border-gray-800"
                  style={{ backgroundColor: '#2a2000' }}>
                  <span className="text-gray-400 text-sm">{s.label}</span>
                  <span className="text-yellow-400 font-black text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* COMMISSION TIERS */}
        <div className="mb-14">
          <h2 className="text-white font-black text-xl uppercase mb-2">Commission tiers</h2>
          <p className="text-gray-500 text-sm mb-6">Your tier updates automatically based on monthly referred sales.</p>
          <div className="grid grid-cols-3 gap-5">
            {tiers.map(tier => (
              <div key={tier.name}
                className={`rounded-2xl border-2 p-6 relative ${tier.color} ${tier.featured ? 'bg-yellow-400 bg-opacity-5' : ''}`}
                style={{ backgroundColor: tier.featured ? undefined : '#1a1a00' }}>
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                    Most common
                  </div>
                )}
                <p className={`font-black text-sm uppercase tracking-widest mb-1 ${tier.text}`}>{tier.name}</p>
                <p className="text-white font-black text-4xl mb-1">{tier.commission}</p>
                <p className="text-gray-500 text-xs mb-4">commission per sale</p>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-500 text-xs">Unlocked at</p>
                  <p className="text-white font-black text-sm">{tier.threshold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="rounded-2xl border border-gray-800 p-8 mb-14"
          style={{ backgroundColor: '#1a1a00' }}>
          <h2 className="text-white font-black text-xl uppercase mb-6">How it works</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { num: '01', icon: '🔗', title: 'Get your link', desc: 'Receive a unique referral link after approval.' },
              { num: '02', icon: '📣', title: 'Share it', desc: 'Post on social media, blogs, YouTube, newsletters.' },
              { num: '03', icon: '🛍', title: 'Buyer purchases', desc: '30-day cookie tracks all purchases from your referral.' },
              { num: '04', icon: '💰', title: 'Get paid', desc: 'Monthly payouts via M-Pesa or bank transfer.' },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 bg-yellow-400 bg-opacity-20 border border-yellow-900 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
                  {s.icon}
                </div>
                <p className="text-white font-black text-sm mb-1">{s.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WHO IT'S FOR */}
        <div className="mb-14">
          <h2 className="text-white font-black text-xl uppercase mb-6">Who joins our programme</h2>
          <div className="grid grid-cols-3 gap-5">
            {[
              { type: 'Content creators', desc: 'Fashion, lifestyle, and interior design creators who want to monetise their audience authentically.' },
              { type: 'Bloggers & writers', desc: 'Writers covering African culture, design, and craft who want to earn from their content.' },
              { type: 'Event planners', desc: 'Planners who regularly source handmade décor and gifts for clients.' },
              { type: 'Diaspora community leaders', desc: 'Community organisers who connect African diaspora members with authentic crafts from home.' },
              { type: 'Interior designers', desc: 'Designers who source unique artisan pieces for client projects.' },
              { type: 'Gift curators', desc: 'Anyone who regularly recommends gifts and lifestyle products to their network.' },
            ].map(w => (
              <div key={w.type} className="rounded-2xl border border-gray-800 p-5"
                style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-yellow-400 font-black text-sm mb-2">✦ {w.type}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply" className="rounded-3xl border border-gray-800 overflow-hidden"
          style={{ backgroundColor: '#1a1a00' }}>
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-white font-black text-sm uppercase tracking-widest">Apply to join</h2>
            <p className="text-gray-500 text-xs mt-1">Free to join · Instant link on approval · No minimum traffic required</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'}`}
                  style={{ backgroundColor: '#2a2000' }} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="hello@yourchannel.com"
                  className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'}`}
                  style={{ backgroundColor: '#2a2000' }} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Primary Channel</label>
                <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition ${errors.channel ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'} ${form.channel ? 'text-white' : 'text-gray-700'}`}
                  style={{ backgroundColor: '#2a2000' }}>
                  <option value="" disabled>Select your channel</option>
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>YouTube</option>
                  <option>Blog / Website</option>
                  <option>Newsletter</option>
                  <option>WhatsApp Community</option>
                  <option>Podcast</option>
                  <option>Other</option>
                </select>
                {errors.channel && <p className="text-red-400 text-xs mt-1">{errors.channel}</p>}
              </div>
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Audience Size (approx)</label>
                <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-yellow-400 transition text-white"
                  style={{ backgroundColor: '#2a2000' }}>
                  <option value="">Select range</option>
                  <option>Under 1,000</option>
                  <option>1,000 – 10,000</option>
                  <option>10,000 – 50,000</option>
                  <option>50,000 – 200,000</option>
                  <option>200,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Why do you want to join?</label>
              <textarea value={form.why} onChange={e => setForm({ ...form, why: e.target.value })}
                placeholder="Tell us about your audience, how you plan to promote 57 Arts & Customs, and why you're a good fit..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition resize-none placeholder-gray-700 ${errors.why ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'}`}
                style={{ backgroundColor: '#2a2000' }} />
              {errors.why && <p className="text-red-400 text-xs mt-1">{errors.why}</p>}
            </div>

            <button onClick={() => { if (validate()) setSubmitted(true); }}
              className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition">
              Join the Affiliate Programme — Free →
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0d0d00' }} className="border-t border-yellow-900 px-8 py-8 mt-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/vendor" className="hover:text-yellow-400 transition">Sell on 57 Arts</Link>
            <Link to="/shop" className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default AffiliateLanding;