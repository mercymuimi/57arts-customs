import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const subjects = [
  'Custom Art Commission',
  'Order Inquiry',
  'Shipping & Delivery',
  'Payment Issue',
  'Vendor Partnership',
  'Press & Media',
  'General Question',
];

const faqs = [
  {
    q: 'How long does a custom order take?',
    a: 'Custom orders typically take 2–6 weeks depending on complexity. Your artisan will give you a precise timeline after reviewing your brief.',
  },
  {
    q: 'Can I request changes after the order starts?',
    a: 'Minor changes can be made within 48 hours of order confirmation. Major changes may affect the timeline and price.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes! We ship to 50+ countries. International orders use our Expedited Global Art Handling service with full tracking.',
  },
  {
    q: 'How does M-Pesa payment work?',
    a: "After placing your order, you'll receive an STK push on your Safaricom number. Simply enter your M-Pesa PIN to complete payment.",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.subject) e.subject = 'Please select a subject';
    if (!form.message.trim()) e.message = 'Required';
    else if (form.message.trim().length < 20) e.message = 'Please give us more detail (min 20 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* HERO */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8 py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, #FFD700, transparent 60%)' }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <span>›</span>
            <span className="text-yellow-400">Contact</span>
          </div>
          <h1 className="text-6xl font-black uppercase leading-none mb-3">
            LEAVE YOUR <span className="text-yellow-400 italic">MARK.</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            Custom commissions, limited drops, and creative collaborations.
            Drop us a line and let's create something legendary.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-3 gap-8">

        {/* LEFT - FORM */}
        <div className="col-span-2">
          {submitted ? (
            <div
              className="rounded-3xl p-12 border border-gray-800 text-center"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                ✓
              </div>
              <h2 className="text-white font-black text-2xl uppercase mb-2">Message Sent!</h2>
              <p className="text-gray-400 text-sm mb-6">
                Thanks <span className="text-yellow-400 font-black">{form.name}</span>! We'll get back to you
                at <span className="text-yellow-400">{form.email}</span> within 24 hours.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="border border-gray-700 text-gray-300 px-6 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition"
                >
                  Send Another
                </button>
                <Link
                  to="/"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-gray-800 overflow-hidden"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-white font-black text-sm uppercase tracking-widest">Send a Message</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                        errors.name ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      style={{ backgroundColor: '#2a2000' }}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="hello@art.com"
                      className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                        errors.email ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      style={{ backgroundColor: '#2a2000' }}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition ${
                      errors.subject ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                    } ${form.subject ? 'text-white' : 'text-gray-700'}`}
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <option value="" disabled>Select a subject...</option>
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your vision..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition resize-none placeholder-gray-700 ${
                      errors.message ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                    }`}
                    style={{ backgroundColor: '#2a2000' }}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message
                      ? <p className="text-red-400 text-xs">{errors.message}</p>
                      : <span />
                    }
                    <p className="text-gray-700 text-xs">{form.message.length} chars</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="animate-spin">⟳</span> Sending...</>
                  ) : (
                    'SEND MESSAGE →'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* FAQ */}
          <div className="mt-8">
            <h2 className="text-white font-black text-sm uppercase tracking-widest mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-800 overflow-hidden"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white hover:bg-opacity-5 transition"
                  >
                    <span className="text-white font-black text-sm">{faq.q}</span>
                    <span className={`text-yellow-400 font-black text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                      +
                    </span>
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
        </div>

        {/* RIGHT - CONTACT INFO */}
        <div className="space-y-4">

          {/* Email */}
          <div className="rounded-2xl p-5 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-yellow-400 bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-black text-sm">Email Us</p>
            </div>
            <p className="text-yellow-400 text-sm font-semibold">studio@57arts.com</p>
            <p className="text-gray-500 text-xs mt-1">We reply within 24 hours</p>
          </div>

          {/* Studio */}
          <div className="rounded-2xl p-5 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-yellow-400 bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-white font-black text-sm">Studio</p>
            </div>
            <p className="text-white text-sm">742 Creative Ave</p>
            <p className="text-gray-400 text-xs mt-0.5">Nairobi, Kenya</p>
          </div>

          {/* Hours */}
          <div className="rounded-2xl p-5 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-yellow-400 bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white font-black text-sm">Studio Hours</p>
            </div>
            {[
              { day: 'Mon – Fri', time: '9:00 AM – 6:00 PM' },
              { day: 'Saturday', time: '10:00 AM – 4:00 PM' },
              { day: 'Sunday', time: 'Closed' },
            ].map(h => (
              <div key={h.day} className="flex justify-between py-1.5 border-b border-gray-800 last:border-0">
                <span className="text-gray-400 text-xs">{h.day}</span>
                <span className={`text-xs font-black ${h.time === 'Closed' ? 'text-red-400' : 'text-white'}`}>
                  {h.time}
                </span>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="rounded-2xl p-5 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
              Connect With The Culture
            </p>
            <div className="space-y-2">
              {[
                { name: 'Instagram', handle: '@57artscustoms', icon: '📸' },
                { name: 'TikTok', handle: '@57arts', icon: '🎬' },
                { name: 'Twitter/X', handle: '@57artscustoms', icon: '𝕏' },
              ].map(s => (
                <button
                  key={s.name}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition"
                  style={{ backgroundColor: '#2a2000' }}
                >
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-white text-xs font-black flex-1 text-left">{s.name}</span>
                  <span className="text-gray-500 text-xs">{s.handle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0d0d00' }} className="border-t border-yellow-900 px-8 py-8 mt-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/shop" className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/custom-order" className="hover:text-yellow-400 transition">Custom Orders</Link>
            <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;