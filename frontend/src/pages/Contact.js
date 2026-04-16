import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};

const subjects = ['Custom Art Commission','Order Inquiry','Shipping & Delivery','Payment Issue','Vendor Partnership','Press & Media','General Question'];
const faqs = [
  { q: 'How long does a custom order take?',       a: 'Custom orders typically take 2–6 weeks depending on complexity. Your artisan will give a precise timeline after reviewing your brief.' },
  { q: 'Can I request changes after order starts?', a: 'Minor changes within 48 hours of confirmation. Major changes may affect the timeline and price. Speak to your artisan via the chat.' },
  { q: 'Do you ship internationally?',              a: 'Yes — 50+ countries. International orders use our Expedited Global Art Handling service with full end-to-end tracking.' },
  { q: 'How does M-Pesa payment work?',             a: "After placing your order you'll receive an STK push on your Safaricom number. Enter your M-Pesa PIN to complete payment instantly." },
  { q: 'What is your return policy?',               a: 'Ready-made items can be returned within 14 days. Custom-commissioned pieces are non-refundable once production begins, but we guarantee satisfaction.' },
];

const Contact = () => {
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [openFaq, setOpenFaq]     = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.subject) e.subject = 'Please select a subject';
    if (!form.message.trim()) e.message = 'Required';
    else if (form.message.length < 20) e.message = 'Please give more detail (min 20 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  const inp = field => ({
    width: '100%', backgroundColor: C.bg, border: `1px solid ${errors[field] ? 'rgba(224,92,92,0.4)' : C.border}`,
    borderRadius: 10, padding: '12px 15px', color: C.cream, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  });

  if (submitted) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <span style={{ color: C.gold, fontSize: 22 }}>✓</span>
        </div>
        <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 24, textTransform: 'uppercase', marginBottom: 10 }}>Message Sent</h2>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
          Thanks <strong style={{ color: C.cream }}>{form.name}</strong>! We'll get back to you at <strong style={{ color: C.cream }}>{form.email}</strong> within 24 hours.
        </p>
        <Link to="/" style={{ backgroundColor: C.cream, color: '#000', padding: '12px 28px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '56px 48px 48px', backgroundColor: C.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>Get in Touch</p>
          <h1 style={{ fontSize: 48, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 14 }}>Contact Us</h1>
          <p style={{ color: C.muted, fontSize: 14, maxWidth: 440, lineHeight: 1.8 }}>
            Questions about a custom order, a shipping issue, or a vendor partnership? We typically respond within a few hours.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60 }}>

        {/* LEFT — form */}
        <div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={inp('name')}
                  onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(224,92,92,0.4)' : C.border} />
                {errors.name && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
              </div>
              <div>
                <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inp('email')}
                  onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(224,92,92,0.4)' : C.border} />
                {errors.email && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
              </div>
            </div>

            <div>
              <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Subject</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ ...inp('subject'), cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors.subject ? 'rgba(224,92,92,0.4)' : C.border}>
                <option value="" style={{ backgroundColor: C.surface }}>Select a subject</option>
                {subjects.map(s => <option key={s} value={s} style={{ backgroundColor: C.surface }}>{s}</option>)}
              </select>
              {errors.subject && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.subject}</p>}
            </div>

            <div>
              <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need..." rows={6}
                style={{ ...inp('message'), resize: 'vertical', lineHeight: 1.7 }}
                onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors.message ? 'rgba(224,92,92,0.4)' : C.border} />
              {errors.message && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              style={{ backgroundColor: loading ? C.faint : C.gold, color: '#000', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 900, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s' }}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
          </form>

          {/* FAQ */}
          <div style={{ marginTop: 56 }}>
            <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>Quick Answers</p>
            <h2 style={{ color: C.cream, fontSize: 28, fontWeight: 900, textTransform: 'uppercase', marginBottom: 28 }}>FAQ</h2>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '16px 0', background: 'none', border: 'none', color: C.cream, fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <span style={{ color: C.muted, fontSize: 18, flexShrink: 0, marginLeft: 12 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, paddingBottom: 16 }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: '◈', title: 'Email Us', detail: 'hello@57arts.com', sub: 'We reply within a few hours' },
            { icon: '◇', title: 'WhatsApp', detail: '+254 700 000 000', sub: 'Mon–Fri, 9am–6pm EAT' },
            { icon: '◉', title: 'Location', detail: 'Nairobi, Kenya', sub: 'Westlands, Nairobi CBD' },
          ].map(item => (
            <div key={item.title} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
              <span style={{ color: C.gold, fontSize: 16, display: 'block', marginBottom: 12 }}>{item.icon}</span>
              <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{item.title}</p>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 3 }}>{item.detail}</p>
              <p style={{ color: C.muted, fontSize: 12 }}>{item.sub}</p>
            </div>
          ))}

          {/* AI Chat shortcut */}
          <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: C.gold, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 100, border: `1px solid rgba(201,168,76,0.3)`, letterSpacing: '0.1em' }}>AI</span>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>Need a faster answer?</p>
            </div>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
              Our AI concierge can answer product, shipping, and custom order questions instantly.
            </p>
            <Link to="/artisan-chat" style={{ display: 'block', backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.cream, padding: '11px', borderRadius: 9, fontWeight: 900, fontSize: 12, textDecoration: 'none', textAlign: 'center', letterSpacing: '0.04em' }}>
              Chat with AI Concierge →
            </Link>
          </div>

          {/* Social */}
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Find Us Online</p>
            {[['Instagram', '@57artscustoms'], ['Twitter / X', '@57arts'], ['TikTok', '@57artscustoms']].map(([platform, handle]) => (
              <div key={platform} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.muted, fontSize: 13 }}>{platform}</span>
                <span style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{handle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;