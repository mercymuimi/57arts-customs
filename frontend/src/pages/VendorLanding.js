import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '2,400+', label: 'Active buyers' },
  { value: '50+', label: 'Countries reached' },
  { value: 'KES 0', label: 'Setup fee' },
  { value: '8%', label: 'Commission only' },
];

const steps = [
  { num: '01', title: 'Apply', desc: 'Fill in your artisan profile, upload portfolio photos, and tell us about your craft.' },
  { num: '02', title: 'Get verified', desc: 'Our team reviews your application within 48 hours. We verify quality and authenticity.' },
  { num: '03', title: 'List your work', desc: 'Upload products, set prices, and configure your custom order settings.' },
  { num: '04', title: 'Start selling', desc: 'Receive orders, chat with buyers, get paid via M-Pesa or bank transfer.' },
];

const faqs = [
  { q: 'How much does it cost to join?', a: 'Nothing upfront. We charge an 8% commission only on completed sales. No listing fees, no monthly subscriptions.' },
  { q: 'How do I get paid?', a: 'Payouts are processed weekly via M-Pesa or bank transfer. You can track all earnings in your vendor dashboard.' },
  { q: 'Can I accept custom orders?', a: 'Yes — custom orders are a core feature. Buyers submit detailed briefs and you respond with a quote and timeline.' },
  { q: 'What products can I sell?', a: 'Fashion, furniture, beadwork, jewellery, and decorative arts. Products must be handmade or handcrafted.' },
  { q: 'Do I need a business registration?', a: 'Not to start. Individual artisans are welcome. Business registration helps with higher payout limits.' },
];

const VendorLanding = () => {
  const [form, setForm] = useState({ name: '', email: '', craft: '', phone: '', instagram: '', story: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.craft) e.craft = 'Required';
    if (!form.story.trim() || form.story.trim().length < 30) e.story = 'Tell us a bit more (min 30 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center px-8"
        style={{ backgroundColor: '#1a1500' }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✦
          </div>
          <h1 className="text-white font-black text-2xl uppercase mb-2">Application Received!</h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Thanks <span className="text-yellow-400 font-black">{form.name}</span>! We'll review your
            application and get back to you at <span className="text-yellow-400">{form.email}</span> within 48 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="border border-gray-700 text-gray-300 px-5 py-3 rounded-xl font-black text-sm hover:border-yellow-400 transition">
              Back to Home
            </Link>
            <Link to="/shop" className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
              Browse the Shop
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
          style={{ backgroundImage: 'radial-gradient(circle at 40% 50%, #FFD700, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-px bg-yellow-400" />
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Sell on 57 Arts</span>
            </div>
            <h1 className="text-5xl font-black uppercase leading-tight mb-4">
              Your craft.<br />
              <span className="text-yellow-400 italic">Global reach.</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              Join Africa's premier artisan marketplace. Reach buyers across 50+ countries,
              accept custom orders, and get paid directly to your M-Pesa.
            </p>
            <a href="#apply"
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
              Apply to Sell → Free
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="rounded-2xl border border-gray-800 p-5 text-center"
                style={{ backgroundColor: '#2a2000' }}>
                <p className="text-yellow-400 font-black text-2xl mb-1">{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* HOW IT WORKS */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-px bg-yellow-400" />
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">How it works</span>
          </div>
          <h2 className="text-white font-black text-2xl uppercase mb-8">
            From application to first sale in 4 steps
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute top-5 left-full w-full h-px bg-yellow-400 bg-opacity-30 z-0"
                    style={{ width: 'calc(100% - 20px)', left: '60%' }} />
                )}
                <div className="rounded-2xl border border-gray-800 p-5 relative z-10"
                  style={{ backgroundColor: '#1a1a00' }}>
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-black text-sm mb-3">
                    {s.num}
                  </div>
                  <p className="text-white font-black text-sm mb-2">{s.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BENEFITS */}
        <div className="rounded-2xl border border-yellow-900 p-8 mb-14"
          style={{ backgroundColor: '#2a2000' }}>
          <h2 className="text-white font-black text-xl uppercase mb-6">
            ✦ Why sell on 57 Arts & Customs
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '💳', title: 'M-Pesa payouts', desc: 'Get paid weekly directly to your Safaricom number. No bank account required.' },
              { icon: '🎨', title: 'Custom order studio', desc: 'Buyers submit detailed briefs. You quote, produce, and track everything in one place.' },
              { icon: '🌍', title: 'Global buyers', desc: 'Your products are discoverable by buyers in 50+ countries from day one.' },
              { icon: '🤖', title: 'AI recommendations', desc: 'Our recommendation engine surfaces your products to the right buyers automatically.' },
              { icon: '💬', title: 'Direct messaging', desc: 'Chat directly with buyers about specifications, progress, and delivery.' },
              { icon: '📊', title: 'Sales analytics', desc: 'Track views, conversions, revenue, and top products from your dashboard.' },
            ].map(b => (
              <div key={b.title} className="flex gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{b.icon}</span>
                <div>
                  <p className="text-white font-black text-sm mb-1">{b.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-14">
          <h2 className="text-white font-black text-xl uppercase mb-5">Frequently asked questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-800 overflow-hidden"
                style={{ backgroundColor: '#1a1a00' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white hover:bg-opacity-5 transition">
                  <span className="text-white font-black text-sm">{faq.q}</span>
                  <span className={`text-yellow-400 font-black text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply" className="rounded-3xl border border-gray-800 overflow-hidden"
          style={{ backgroundColor: '#1a1a00' }}>
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-white font-black text-sm uppercase tracking-widest">Apply to become a vendor</h2>
            <p className="text-gray-500 text-xs mt-1">Free to apply · 48hr review · No commitment</p>
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
                  placeholder="hello@yourstudio.com"
                  className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'}`}
                  style={{ backgroundColor: '#2a2000' }} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Craft Category</label>
                <select value={form.craft} onChange={e => setForm({ ...form, craft: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition ${errors.craft ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'} ${form.craft ? 'text-white' : 'text-gray-700'}`}
                  style={{ backgroundColor: '#2a2000' }}>
                  <option value="" disabled>Select your craft</option>
                  <option>Fashion & Apparel</option>
                  <option>Furniture & Woodwork</option>
                  <option>Beads & Jewellery</option>
                  <option>Paintings & Visual Art</option>
                  <option>Ceramics & Pottery</option>
                  <option>Metalwork & Sculpture</option>
                  <option>Textiles & Weaving</option>
                  <option>Other</option>
                </select>
                {errors.craft && <p className="text-red-400 text-xs mt-1">{errors.craft}</p>}
              </div>
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Phone (M-Pesa)</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                  style={{ backgroundColor: '#2a2000' }} />
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Instagram / Portfolio (optional)</label>
              <input type="text" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })}
                placeholder="@yourstudio or portfolio URL"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                style={{ backgroundColor: '#2a2000' }} />
            </div>

            <div>
              <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Tell us about your craft</label>
              <textarea value={form.story} onChange={e => setForm({ ...form, story: e.target.value })}
                placeholder="What do you make, how long have you been doing it, what makes your work distinctive..."
                rows={5}
                className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition resize-none placeholder-gray-700 ${errors.story ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'}`}
                style={{ backgroundColor: '#2a2000' }} />
              {errors.story && <p className="text-red-400 text-xs mt-1">{errors.story}</p>}
            </div>

            <button onClick={handleSubmit}
              className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition">
              Submit Application — Free →
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
            <Link to="/shop" className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/affiliate" className="hover:text-yellow-400 transition">Affiliate</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default VendorLanding;