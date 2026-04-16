import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:      '#0a0a0a',
  surface: '#111111',
  border:  '#1c1c1c',
  bHov:    '#2e2e2e',
  faint:   '#242424',
  cream:   '#f0ece4',
  muted:   '#606060',
  dim:     '#333333',
  gold:    '#c9a84c',
  goldHov: '#deba60',
};

const s = {
  section:    { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow:    { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 },
  h2:         { color: C.cream, fontSize: 36, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 },
  btnGold:    { backgroundColor: C.gold, color: '#000', padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost:   { backgroundColor: 'transparent', color: C.cream, padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  input:      { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
};

const furnitureProducts = [
  { name: 'Obsidian Throne v.2',  price: 'KSH 142,000', desc: 'Matte Carbon / Brass',         tag: 'Ready to Ship', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600', slug: 'vanguard-teak-chair' },
  { name: 'Gilded Lounge Chair',  price: 'KSH 187,500', desc: 'Gold Velvet / Solid Oak',       tag: 'Limited Edition', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', slug: 'the-sculptor-chair' },
  { name: 'Midnight Stool',       price: 'KSH 46,500',  desc: 'Powder Coated Steel',           tag: '',              img: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600', slug: 'handcrafted-stool' },
  { name: 'Solar Flare Chair',    price: 'KSH 98,175',  desc: 'Sculpted Resin / Satin Finish', tag: 'Custom',        img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600', slug: 'the-sculptor-chair' },
];

const filters = ['Chairs', 'Tables', 'Lighting', 'Storage'];

const processSteps = [
  { icon: '◎', title: 'Consultation',     sub: '1-on-1 design meeting with our senior artisan team' },
  { icon: '▣', title: '3D Modelling',     sub: 'See your piece rendered before we break ground' },
  { icon: '⚒', title: 'Handcrafted',      sub: 'Master-crafted in our Nairobi studio' },
  { icon: '✦', title: 'Lifetime Warranty', sub: 'Quality that endures through generations' },
];

const galleryImgs = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700',
];

// ── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '64px 0 36px' }}>
    <div style={s.section}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 64, marginBottom: 52 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 270 }}>
            Defined by the edge. Crafted by the hands. Built for the future of living.
          </p>
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Shop</h4>
          {['All Furniture', 'Lighting', 'Home Decor', 'Limited Series'].map(item => (
            <p key={item} style={{ color: C.muted, fontSize: 13, marginBottom: 9, cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{item}</p>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Service</h4>
          {[['Custom Build', '/custom-order'], ['Gallery', '/gallery'], ['Contact', '/contact']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. All rights reserved. Nairobi, Kenya.</p>
      </div>
    </div>
  </footer>
);

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const Furniture = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Chairs');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', category: 'Dining Table', vision: '' });
  const [submitted, setSubmitted] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (e, slug) => {
    e.stopPropagation();
    setWishlist(p => p.includes(slug) ? p.filter(s => s !== slug) : [...p, slug]);
  };

  const handleSubmit = () => {
    if (form.name && form.email && form.vision) setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Bespoke furniture crafted in Nairobi · 3–4 week lead time · Custom commissions open
      </div>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600" alt="Furniture Hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.95) 45%, rgba(10,10,10,0.2))' }} />
        {/* Vertical rule */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: C.border }} />

        <div style={{ ...s.section, position: 'relative', zIndex: 2, paddingBottom: 96, paddingTop: 96 }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: C.gold, color: '#000', fontSize: 10, fontWeight: 900, padding: '6px 14px', borderRadius: 100, marginBottom: 24, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ● Next-Gen Interiors
            </div>
            <h1 style={{ color: C.cream, fontSize: 88, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.88, marginBottom: 24 }}>
              Bespoke<br /><span style={{ color: C.gold }}>Craft</span>
            </h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, maxWidth: 420, marginBottom: 36 }}>
              Elevate your space with one-of-a-kind custom furniture designed for the
              digital generation. Merging brutalist aesthetics with premium artisanal soul.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/custom-order" style={s.btnGold}>Start Custom Order →</Link>
              <Link to="/gallery" style={s.btnGhost}>View Gallery</Link>
            </div>

            <div style={{ display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
              {[['480+', 'Pieces Created'], ['18', 'Master Artisans'], ['100%', 'Sustainably Sourced']].map(([num, label]) => (
                <div key={label}>
                  <p style={{ color: C.gold, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{num}</p>
                  <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
        <div style={s.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <p style={s.eyebrow}>Ready to Ship</p>
              <h2 style={s.h2}>Artisanal Living</h2>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  style={{ padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', border: `1px solid ${activeFilter === f ? C.gold : C.border}`, backgroundColor: activeFilter === f ? C.gold : 'transparent', color: activeFilter === f ? '#000' : C.muted, transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (activeFilter !== f) e.currentTarget.style.borderColor = C.bHov; }}
                  onMouseLeave={e => { if (activeFilter !== f) e.currentTarget.style.borderColor = C.border; }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
            {furnitureProducts.map(product => {
              const isHov = hoveredCard === product.slug + product.name;
              const inWish = wishlist.includes(product.slug + product.name);
              return (
                <div key={product.name}
                  onMouseEnter={() => setHoveredCard(product.slug + product.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  style={{ cursor: 'pointer' }}>
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 280, backgroundColor: C.surface, border: `1px solid ${isHov ? C.bHov : C.border}`, transition: 'border-color 0.2s', marginBottom: 14 }}>
                    <img src={product.img} alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />
                    {product.tag && (
                      <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.1em' }}>
                        {product.tag}
                      </span>
                    )}
                    <button onClick={e => toggleWishlist(e, product.slug + product.name)}
                      style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: 'rgba(10,10,10,0.8)', color: inWish ? '#e74c3c' : C.muted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {inWish ? '♥' : '♡'}
                    </button>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', opacity: isHov ? 1 : 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: C.cream, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${C.gold}`, paddingBottom: 2 }}>View Piece →</span>
                    </div>
                  </div>
                  <p style={{ color: isHov ? C.gold : C.cream, fontSize: 13, fontWeight: 900, marginBottom: 4, transition: 'color 0.2s' }}>{product.name}</p>
                  <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{product.desc}</p>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{product.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* YOUR VISION / CUSTOM BUILD */}
      <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
        <div style={s.section}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <p style={s.eyebrow}>Custom Commissions Open</p>
              <h2 style={{ ...s.h2, fontSize: 44, marginBottom: 16 }}>Your Vision,<br />Our <span style={{ color: C.gold }}>Custom Build</span></h2>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, marginBottom: 36, maxWidth: 400 }}>
                Can't find exactly what you're looking for? Our artisans specialise in
                bringing unique concepts to life — from custom wood grain selections to
                bespoke metal finishes. Your space deserves a masterpiece.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 36 }}>
                {processSteps.map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontSize: 14, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{item.title}</p>
                      <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginTop: 2 }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Form */}
            <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ height: 3, backgroundColor: C.gold }} />
              <div style={{ padding: '32px' }}>
                <p style={s.eyebrow}>Get Started</p>
                <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 20, marginBottom: 24 }}>Request a Custom Build</h3>

                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: C.gold, fontSize: 20 }}>✓</div>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 6 }}>Request Submitted!</p>
                    <p style={{ color: C.muted, fontSize: 12 }}>Our team will be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[['Name', 'name', 'text', 'Your name'], ['Email', 'email', 'email', 'your@email.com']].map(([label, field, type, placeholder]) => (
                        <div key={field}>
                          <label style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
                          <input type={type} placeholder={placeholder} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                            style={s.input}
                            onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Category</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        style={{ ...s.input, cursor: 'pointer' }}>
                        {['Dining Table', 'Chair', 'Sofa', 'Bed Frame', 'Storage', 'Lighting'].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Project Vision</label>
                      <textarea placeholder="Describe the vibe, dimensions, and materials you're dreaming of..." value={form.vision} onChange={e => setForm({ ...form, vision: e.target.value })} rows={4}
                        style={{ ...s.input, resize: 'none' }}
                        onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                    </div>
                    <button onClick={handleSubmit}
                      style={{ ...s.btnGold, textAlign: 'center', padding: '14px', borderRadius: 10, width: '100%', boxSizing: 'border-box' }}>
                      Send Request →
                    </button>
                    <p style={{ color: C.dim, fontSize: 11, textAlign: 'center' }}>We respond within 24 hours. No spam.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
        <div style={s.section}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={s.eyebrow}>Designed for the Aesthetic Soul</p>
            <h2 style={s.h2}>From the Studio</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 12 }}>
            <div style={{ gridRow: 'span 2', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, height: 480 }}>
              <img src={galleryImgs[0]} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {galleryImgs.slice(1).map((img, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, height: 234 }}>
                <img src={img} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/gallery" style={{ ...s.btnGhost, fontSize: 11 }}>View Full Gallery →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Furniture;