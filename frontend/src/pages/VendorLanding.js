import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
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

const stats = [
  { value: '2,400+', label: 'Active buyers'  },
  { value: '50+',    label: 'Countries reached' },
  { value: 'KES 0',  label: 'Setup fee'      },
  { value: '8%',     label: 'Commission only' },
];

const steps = [
  { num: '01', title: 'Apply',        desc: 'Fill in your artisan profile, upload portfolio photos, and tell us about your craft.' },
  { num: '02', title: 'Get verified', desc: 'Our team reviews your application within 48 hours. We verify quality and authenticity.' },
  { num: '03', title: 'List your work',desc: 'Upload products, set prices, and configure your custom order settings.' },
  { num: '04', title: 'Start selling', desc: 'Receive orders, chat with buyers, get paid via M-Pesa or bank transfer.' },
];

const benefits = [
  { icon: '💳', title: 'M-Pesa payouts',       desc: 'Get paid weekly directly to your Safaricom number. No bank account required.' },
  { icon: '🎨', title: 'Custom order studio',   desc: 'Buyers submit detailed briefs. You quote, produce, and track everything in one place.' },
  { icon: '🌍', title: 'Global buyers',         desc: 'Your products are discoverable by buyers in 50+ countries from day one.' },
  { icon: '🤖', title: 'AI recommendations',    desc: 'Our recommendation engine surfaces your products to the right buyers automatically.' },
  { icon: '💬', title: 'Direct messaging',      desc: 'Chat directly with buyers about specifications, progress, and delivery.' },
  { icon: '📊', title: 'Sales analytics',       desc: 'Track views, conversions, revenue, and top products from your dashboard.' },
];

const faqs = [
  { q: 'How much does it cost to join?',       a: 'Nothing upfront. We charge an 8% commission only on completed sales. No listing fees, no monthly subscriptions.' },
  { q: 'How do I get paid?',                   a: 'Payouts are processed weekly via M-Pesa or bank transfer. You can track all earnings in your vendor dashboard.' },
  { q: 'Can I accept custom orders?',          a: 'Yes — custom orders are a core feature. Buyers submit detailed briefs and you respond with a quote and timeline.' },
  { q: 'What products can I sell?',            a: 'Fashion, furniture, beadwork, jewellery, and decorative arts. Products must be handmade or handcrafted.' },
  { q: 'Do I need a business registration?',   a: 'Not to start. Individual artisans are welcome. Business registration helps with higher payout limits.' },
];

const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '52px 0 32px' }}>
    <div style={s.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
          <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57 ARTS & CUSTOMS</span>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Affiliate Programme', '/affiliate'], ['Shop', '/shop'], ['Contact', '/contact'], ['← Home', '/']].map(([l, p]) => (
            <Link key={l} to={p} style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{l}</Link>
          ))}
        </div>
        <p style={{ color: C.dim, fontSize: 11 }}>© 2024 57 Arts & Customs.</p>
      </div>
    </div>
  </footer>
);

const VendorLanding = () => {
  const [form, setForm]         = useState({ name: '', email: '', craft: '', phone: '', instagram: '', story: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq]   = useState(null);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.craft) e.craft = 'Required';
    if (!form.story.trim() || form.story.trim().length < 30) e.story = 'Tell us more (min 30 chars)';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const inputStyle = (field) => ({ ...s.input, borderColor: errors[field] ? C.err : C.border });

  if (submitted) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 26 }}>✦</div>
          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 12 }}>Application Received!</h1>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
            Thanks <span style={{ color: C.gold, fontWeight: 900 }}>{form.name}</span>! We'll review your application and get back to you at <span style={{ color: C.gold }}>{form.email}</span> within 48 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/" style={s.btnGhost}>Back to Home</Link>
            <Link to="/shop" style={s.btnGold}>Browse the Shop →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Free to join · 8% commission on sales only · Weekly M-Pesa payouts
      </div>

      {/* HERO */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '72px 0' }}>
        <div style={s.section}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 20, height: 1, backgroundColor: C.gold }} />
                <p style={{ ...s.eyebrow, marginBottom: 0 }}>Sell on 57 Arts</p>
              </div>
              <h1 style={{ color: C.cream, fontSize: 62, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: 20 }}>
                Your craft.<br /><span style={{ color: C.gold }}>Global reach.</span>
              </h1>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, maxWidth: 380, marginBottom: 28 }}>
                Join Africa's premier artisan marketplace. Reach buyers across 50+ countries, accept custom orders, and get paid directly to your M-Pesa.
              </p>
              <a href="#apply" style={s.btnGold}>Apply to Sell — Free →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {stats.map(stat => (
                <div key={stat.label} style={{ ...s.card, padding: 24, textAlign: 'center' }}>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 28, lineHeight: 1, marginBottom: 6 }}>{stat.value}</p>
                  <p style={{ color: C.muted, fontSize: 12 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...s.section, padding: '64px 48px' }}>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1, backgroundColor: C.gold }} />
            <p style={{ ...s.eyebrow, marginBottom: 0 }}>How it works</p>
          </div>
          <h2 style={{ color: C.cream, fontSize: 26, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 28 }}>From application to first sale in 4 steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: 20, left: '60%', width: '80%', height: 1, backgroundColor: C.border, zIndex: 0 }} />}
                <div style={{ ...s.card, padding: 22, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000', marginBottom: 14 }}>{step.num}</div>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 14, marginBottom: 8 }}>{step.title}</p>
                  <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BENEFITS */}
        <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', marginBottom: 56 }}>
          <div style={{ height: 3, backgroundColor: C.gold }} />
          <div style={{ padding: 36 }}>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 28 }}>✦ Why sell on 57 Arts & Customs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {benefits.map(b => (
                <div key={b.title} style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{b.icon}</span>
                  <div>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 6 }}>{b.title}</p>
                    <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 56 }}>
          <p style={s.eyebrow}>Common Questions</p>
          <h2 style={{ color: C.cream, fontSize: 22, fontWeight: 900, textTransform: 'uppercase', marginBottom: 20 }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ ...s.card, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = C.faint}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{faq.q}</span>
                  <span style={{ color: C.gold, fontWeight: 900, fontSize: 18, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 12 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', borderTop: `1px solid ${C.border}` }}>
                    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.75, paddingTop: 14 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply" style={{ ...s.card, overflow: 'hidden' }}>
          <div style={{ height: 3, backgroundColor: C.gold }} />
          <div style={{ padding: '22px 28px', borderBottom: `1px solid ${C.border}` }}>
            <p style={s.eyebrow}>Apply now</p>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20 }}>Apply to become a vendor</h2>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Free to apply · 48hr review · No commitment</p>
          </div>
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['Full Name', 'name', 'text', 'Your name'], ['Email', 'email', 'email', 'hello@yourstudio.com']].map(([label, field, type, ph]) => (
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <input type={type} value={form[field]} placeholder={ph} onChange={e => setForm({ ...form, [field]: e.target.value })}
                    style={inputStyle(field)} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors[field] ? C.err : C.border} />
                  {errors[field] && <p style={{ color: C.err, fontSize: 11, marginTop: 4 }}>{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={s.label}>Craft Category</label>
                <select value={form.craft} onChange={e => setForm({ ...form, craft: e.target.value })} style={inputStyle('craft')}>
                  <option value="" disabled>Select your craft</option>
                  {['Fashion & Apparel','Furniture & Woodwork','Beads & Jewellery','Paintings & Visual Art','Ceramics & Pottery','Metalwork & Sculpture','Textiles & Weaving','Other'].map(o => <option key={o}>{o}</option>)}
                </select>
                {errors.craft && <p style={{ color: C.err, fontSize: 11, marginTop: 4 }}>{errors.craft}</p>}
              </div>
              <div>
                <label style={s.label}>Phone (M-Pesa)</label>
                <input type="text" value={form.phone} placeholder="+254 7XX XXX XXX" onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
            </div>
            <div>
              <label style={s.label}>Instagram / Portfolio (optional)</label>
              <input type="text" value={form.instagram} placeholder="@yourstudio or portfolio URL" onChange={e => setForm({ ...form, instagram: e.target.value })}
                style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <div>
              <label style={s.label}>Tell us about your craft</label>
              <textarea value={form.story} onChange={e => setForm({ ...form, story: e.target.value })} rows={5}
                placeholder="What do you make, how long have you been doing it, what makes your work distinctive..."
                style={{ ...inputStyle('story'), resize: 'none', lineHeight: 1.7 }}
                onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors.story ? C.err : C.border} />
              {errors.story && <p style={{ color: C.err, fontSize: 11, marginTop: 4 }}>{errors.story}</p>}
            </div>
            <button onClick={() => { if (validate()) setSubmitted(true); }}
              style={{ ...s.btnGold, width: '100%', padding: '14px', borderRadius: 10, textAlign: 'center', boxSizing: 'border-box', letterSpacing: '0.08em' }}>
              Submit Application — Free →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VendorLanding;