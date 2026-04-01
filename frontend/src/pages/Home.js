import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── DATA ──────────────────────────────────────────────────────────────────────

const featuredProducts = [
  { name: 'Obsidian Throne v.2',  label: 'Featured Custom', price: 'KSH 142,000', category: 'Furniture', slug: 'vanguard-teak-chair',         img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800' },
  { name: 'Midnight Denim Jacket',label: 'Limited Drop',    price: 'KSH 58,000',  category: 'Fashion',   slug: 'distressed-artisanal-denim',  img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800' },
  { name: 'Gold Pulse Beads',     label: 'Heritage Craft',  price: 'KSH 24,000',  category: 'Beads',     slug: 'gold-infused-obsidian-beads', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800' },
  { name: 'Monarch Carry-all',    label: 'Bespoke Only',    price: 'KSH 98,000',  category: 'Fashion',   slug: 'monarch-carry-all',           img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800' },
];

const trending = [
  { name: 'Distressed Artisanal Denim', price: 'KSH 58,000',  category: 'Fashion',   tag: 'Hot',     slug: 'distressed-artisanal-denim',  img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' },
  { name: 'Vanguard Teak Chair',        price: 'KSH 138,000', category: 'Furniture', tag: 'Custom',  slug: 'vanguard-teak-chair',          img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500' },
  { name: 'Gold-Infused Obsidian Beads',price: 'KSH 24,000',  category: 'Beads',     tag: 'New',     slug: 'gold-infused-obsidian-beads',  img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500' },
  { name: 'Midnight Velvet Blazer',     price: 'KSH 72,000',  category: 'Fashion',   tag: 'Limited', slug: 'midnight-velvet-blazer',       img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500' },
];

const categories = [
  { name: 'Fashion',        desc: 'Street luxury & bespoke apparel', path: '/fashion',   count: '1,200+ pieces', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700' },
  { name: 'Furniture',      desc: 'Artisanal handcrafted pieces',    path: '/furniture', count: '480+ pieces',   img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700' },
  { name: 'Beads & Jewelry',desc: 'Heritage tribal collections',     path: '/beads',     count: '720+ pieces',   img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=700' },
];

const testimonials = [
  { name: 'Njambi K.',   location: 'Nairobi, Kenya', initials: 'NK', rating: 5, product: 'Custom Kente Blazer',      text: 'I commissioned a custom Kente blazer through 57 Arts. The artisan sent progress photos at every stage. It arrived in 3 weeks and is the most talked-about piece I own.' },
  { name: 'Kofi Mensah', location: 'Accra, Ghana',   initials: 'KM', rating: 5, product: 'Vanguard Teak Chair',      text: 'The visual search actually works. I uploaded a photo from Pinterest and found three similar teak chairs from local artisans at a fraction of the international price.' },
  { name: 'Adaeze O.',   location: 'Lagos, Nigeria', initials: 'AO', rating: 5, product: 'Vendor — Aso-Oke Designs', text: 'As a vendor, the AI analytics dashboard changed how I price my pieces. My revenue went up 34% in the first two months after joining.' },
];

const howItWorks = [
  { step: '01', title: 'Browse or Upload',      desc: 'Explore artisan pieces or upload an image to find something similar using AI visual search.' },
  { step: '02', title: 'Customise Your Order',  desc: 'Choose materials, sizes, and colours. Our AI suggests combinations based on your preferences.' },
  { step: '03', title: 'Connect with Artisans', desc: 'Chat directly with the maker. Get progress updates and track your commission in real time.' },
  { step: '04', title: 'Receive & Review',      desc: 'Your piece arrives with a certificate of authenticity. Review to help the artisan grow.' },
];

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
// Deep black base · cream typography · gold used ONLY as a precise accent
const C = {
  bg:      '#0a0a0a',   // near-black base
  surface: '#111111',   // card / section surface
  border:  '#1c1c1c',   // default border
  bHov:    '#2e2e2e',   // hover border
  faint:   '#242424',   // subtle fill
  cream:   '#f0ece4',   // primary text
  muted:   '#606060',   // secondary text
  dim:     '#333333',   // very subtle text / large step numbers
  gold:    '#c9a84c',   // accent — CTAs, prices, active dots ONLY
  goldHov: '#deba60',   // gold hover
};

const s = {
  // reusable inline styles
  section:   { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow:   { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 },
  h2:        { color: C.cream, fontSize: 36, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 },
  tag:       { backgroundColor: C.faint, color: C.cream, fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.12em', textTransform: 'uppercase', border: `1px solid ${C.border}` },
  btnPrimary:{ backgroundColor: C.cream, color: '#000', padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost:  { backgroundColor: 'transparent', color: C.cream, padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  btnGold:   { backgroundColor: C.gold, color: '#000', padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  card:      { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 },
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

const Home = () => {
  const navigate = useNavigate();
  const [current, setCurrent]       = useState(0);
  const [fading, setFading]         = useState(false);
  const [wishlist, setWishlist]     = useState([]);
  const [cartAdded, setCartAdded]   = useState(false);
  const [activeTesti, setActiveTesti] = useState(0);
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCurrent(p => (p + 1) % featuredProducts.length); setFading(false); }, 350);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p + 1) % testimonials.length), 5500);
    return () => clearInterval(t);
  }, []);

  const goTo   = (i) => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 350); };
  const toggle = (slug) => setWishlist(p => p.includes(slug) ? p.filter(s => s !== slug) : [...p, slug]);
  const addCart = () => { setCartAdded(true); setTimeout(() => setCartAdded(false), 2000); };
  const doSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`); };
  const doSubscribe = (e) => { e.preventDefault(); if (email) setSubscribed(true); };

  const fp = featuredProducts[current];

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ── ANNOUNCEMENT BAR ──────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Free shipping on custom orders over KSH 50,000 · M-Pesa accepted · New drop every Friday
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.bg, minHeight: 'calc(100vh - 32px - 65px)', display: 'flex', alignItems: 'center', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Centre vertical rule — structural, not decorative */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: C.border, pointerEvents: 'none' }} />

        <div style={{ ...s.section, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* LEFT */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1, backgroundColor: C.gold }} />
              <span style={s.eyebrow}>AI-Powered Multi-Vendor Marketplace</span>
            </div>

            <h1 style={{ fontSize: 'clamp(3rem, 5.5vw, 4.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 24 }}>
              Design<br />Your<br />
              <em style={{ color: C.gold, fontStyle: 'italic' }}>Identity.</em>
            </h1>

            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.85, maxWidth: 350, marginBottom: 36 }}>
              The multi-vendor hub for the bold generation. Bespoke streetwear,
              artisanal furniture, heritage jewellery — commissioned from African
              makers, powered by AI.
            </p>

            {/* Search */}
            <form onSubmit={doSearch} style={{ display: 'flex', gap: 8, maxWidth: 420, marginBottom: 32 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px', backgroundColor: C.surface }}>
                <svg width={13} height={13} fill="none" stroke={C.muted} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search artisan products..." style={{ background: 'none', border: 'none', outline: 'none', color: C.cream, fontSize: 13, width: '100%' }} />
              </div>
              <button type="submit" style={{ ...s.btnGold, padding: '11px 18px', borderRadius: 10, fontSize: 12 }}>Search</button>
            </form>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 48 }}>
              <Link to="/custom-order" style={s.btnPrimary}>Custom Made</Link>
              <Link to="/shop" style={s.btnGhost}>Shop Collection</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 28, paddingTop: 28, borderTop: `1px solid ${C.border}`, width: 'fit-content' }}>
              {[{ v: '2,400+', l: 'Products' }, { v: '340+', l: 'Vendors' }, { v: '98%', l: 'Satisfaction' }, { v: 'KSH', l: 'M-Pesa Ready' }].map(({ v, l }) => (
                <div key={l}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em' }}>{v}</p>
                  <p style={{ color: C.muted, fontSize: 10, marginTop: 3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — rotating product card */}
          <div style={{ position: 'relative' }}>
            <div style={{ ...s.card, opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }}>
              {/* Image */}
              <div style={{ height: 310, position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '16px 16px 0 0' }}
                onClick={() => navigate(`/product/${fp.slug}`)}>
                <img src={fp.img} alt={fp.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                <span style={{ position: 'absolute', top: 14, left: 14, ...s.tag }}>{fp.label}</span>
                <button onClick={e => { e.stopPropagation(); toggle(fp.slug); }}
                  style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.45)', border: `1px solid ${C.border}`, cursor: 'pointer', color: wishlist.includes(fp.slug) ? '#e05c5c' : C.cream, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {wishlist.includes(fp.slug) ? '♥' : '♡'}
                </button>
                {/* Dots */}
                <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
                  {featuredProducts.map((_, i) => (
                    <button key={i} onClick={e => { e.stopPropagation(); goTo(i); }}
                      style={{ height: 3, width: i === current ? 18 : 5, borderRadius: 2, backgroundColor: i === current ? C.gold : 'rgba(255,255,255,0.25)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
                  ))}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>{fp.category}</p>
                    <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 17, letterSpacing: '-0.01em', cursor: 'pointer' }} onClick={() => navigate(`/product/${fp.slug}`)}>{fp.name}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: C.muted, fontSize: 10, marginBottom: 2 }}>Starting at</p>
                    <p style={{ color: C.gold, fontWeight: 900, fontSize: 18 }}>{fp.price}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate(`/product/${fp.slug}`)} style={{ flex: 1, padding: 11, borderRadius: 9, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.cream, fontWeight: 900, fontSize: 12, cursor: 'pointer', letterSpacing: '0.03em' }}>
                    View Details
                  </button>
                  <button onClick={addCart} style={{ flex: 1, padding: 11, borderRadius: 9, border: 'none', backgroundColor: cartAdded ? '#1a3d28' : C.cream, color: cartAdded ? '#5cc98a' : '#000', fontWeight: 900, fontSize: 12, cursor: 'pointer', letterSpacing: '0.03em', transition: 'all 0.25s' }}>
                    {cartAdded ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>

            {/* Next thumbnail */}
            <div onClick={() => goTo((current + 1) % featuredProducts.length)}
              style={{ position: 'absolute', bottom: -10, right: -10, width: 68, height: 68, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.bHov}`, cursor: 'pointer', zIndex: 2 }}>
              <img src={featuredProducts[(current + 1) % featuredProducts.length].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 900 }}>›</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface }}>
        <div style={{ ...s.section, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 48px' }}>
          {['Verified Artisans Only', 'M-Pesa & Card Payments', 'AI Chatbot Support 24/7', '14-Day Returns Policy', 'AI-Powered Recommendations'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: i === 0 ? C.gold : C.faint, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── TRENDING NOW ──────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 0' }}>
        <div style={s.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <p style={s.eyebrow}>What's Hot</p>
              <h2 style={s.h2}>Trending Now</h2>
            </div>
            <Link to="/gallery" style={{ color: C.muted, fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.06em', paddingBottom: 2, borderBottom: `1px solid ${C.border}` }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {trending.map(p => (
              <div key={p.slug} onClick={() => navigate(`/product/${p.slug}`)} style={{ cursor: 'pointer' }}>
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 260, backgroundColor: C.surface, border: `1px solid ${C.border}`, marginBottom: 14, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)' }} />
                  <span style={{ position: 'absolute', top: 11, left: 11, ...s.tag }}>{p.tag}</span>
                  <button onClick={e => { e.stopPropagation(); toggle(p.slug); }}
                    style={{ position: 'absolute', top: 11, right: 11, width: 30, height: 30, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.45)', border: `1px solid ${C.border}`, cursor: 'pointer', color: wishlist.includes(p.slug) ? '#e05c5c' : C.cream, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlist.includes(p.slug) ? '♥' : '♡'}
                  </button>
                </div>
                <p style={{ color: C.cream, fontWeight: 800, fontSize: 13, marginBottom: 5, letterSpacing: '-0.01em' }}>{p.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.category}</p>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '96px 0' }}>
        <div style={s.section}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={s.eyebrow}>Browse By Category</p>
            <h2 style={s.h2}>Shop The Collections</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {categories.map(cat => (
              <Link key={cat.name} to={cat.path} style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 250, border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 5 }}>{cat.name}</h3>
                    <p style={{ color: 'rgba(240,236,228,0.5)', fontSize: 12, marginBottom: 3 }}>{cat.desc}</p>
                    <p style={{ color: C.muted, fontSize: 11, letterSpacing: '0.06em', marginBottom: 18 }}>{cat.count}</p>
                    <span style={{ border: `1px solid rgba(240,236,228,0.35)`, color: C.cream, fontSize: 11, fontWeight: 900, padding: '7px 18px', borderRadius: 100, letterSpacing: '0.06em' }}>
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 0' }}>
        <div style={s.section}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={s.eyebrow}>Simple Process</p>
            <h2 style={{ ...s.h2, marginBottom: 12 }}>How It Works</h2>
            <p style={{ color: C.muted, fontSize: 13, maxWidth: 380, margin: '0 auto', lineHeight: 1.8 }}>
              From discovery to doorstep — commissioning a custom piece has never been this smooth.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            {howItWorks.map((step, i) => (
              <div key={step.step} style={{ position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: 27, left: '75%', width: '52%', height: 1, borderTop: `1px dashed ${C.faint}`, zIndex: 0 }} />}
                <div style={{ position: 'relative', zIndex: 1, ...s.card, padding: 22, margin: '0 2px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 9, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: C.gold, fontSize: 12, fontWeight: 900 }}>{step.step}</span>
                    </div>
                    <span style={{ color: C.faint, fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em' }}>{step.step}</span>
                  </div>
                  <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/custom-order" style={s.btnGold}>Start Your Custom Order →</Link>
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '96px 0' }}>
        <div style={{ ...s.section, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', backgroundColor: C.faint, color: C.cream, fontSize: 10, fontWeight: 900, padding: '5px 13px', borderRadius: 100, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20, border: `1px solid ${C.border}` }}>
              AI-Powered
            </span>
            <h2 style={{ ...s.h2, marginBottom: 14 }}>
              Design With<br />
              <span style={{ color: C.gold }}>Artificial Intelligence</span>
            </h2>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, marginBottom: 32, maxWidth: 370 }}>
              Visualize custom pieces before they're made. Get smart recommendations,
              search by image, and chat with our AI concierge — built for African artisanal commerce.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/custom-order" style={s.btnPrimary}>Try AI Design Studio</Link>
              <Link to="/about" style={s.btnGhost}>Learn More</Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { n: '01', title: 'Smart Recommendations', desc: 'AI suggests products tailored to your taste',          path: '/shop'          },
              { n: '02', title: 'Visual Search',          desc: 'Upload any image to find similar artisan pieces',      path: '/search'        },
              { n: '03', title: 'AI Chatbot',             desc: 'Instant styling advice and product help, 24/7',        path: '/artisan-chat'  },
              { n: '04', title: 'Dynamic Pricing',        desc: 'Fair, market-driven prices updated in real time',      path: '/shop'          },
            ].map(f => (
              <Link key={f.title} to={f.path} style={{ textDecoration: 'none', display: 'block', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 13, padding: 20, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <span style={{ color: C.gold, fontSize: 10, fontWeight: 900 }}>{f.n}</span>
                </div>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 5, letterSpacing: '0.02em' }}>{f.title}</p>
                <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.65 }}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 0' }}>
        <div style={s.section}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={s.eyebrow}>Real Buyers. Real Pieces.</p>
            <h2 style={s.h2}>What They're Saying</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {testimonials.map((t, i) => (
              <div key={t.name} onClick={() => setActiveTesti(i)}
                style={{ backgroundColor: activeTesti === i ? C.surface : C.bg, border: `1px solid ${activeTesti === i ? C.bHov : C.border}`, borderRadius: 14, padding: 24, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: t.rating }).map((_, si) => <span key={si} style={{ color: C.gold, fontSize: 11 }}>★</span>)}
                </div>
                <p style={{ color: 'rgba(240,236,228,0.65)', fontSize: 13, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: C.cream, flexShrink: 0 }}>{t.initials}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{t.name}</p>
                    <p style={{ color: C.muted, fontSize: 10, letterSpacing: '0.04em' }}>{t.location}</p>
                  </div>
                  <span style={{ color: C.muted, fontSize: 10, fontWeight: 700, borderLeft: `1px solid ${C.border}`, paddingLeft: 12, letterSpacing: '0.02em' }}>{t.product}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 22 }}>
            {testimonials.map((_, i) => <button key={i} onClick={() => setActiveTesti(i)} style={{ height: 3, width: activeTesti === i ? 18 : 5, borderRadius: 2, backgroundColor: activeTesti === i ? C.gold : C.faint, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />)}
          </div>
        </div>
      </section>

      {/* ── VENDOR + AFFILIATE ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '96px 0' }}>
        <div style={{ ...s.section, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            {
              icon: <svg width={17} height={17} fill="none" stroke={C.cream} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
              title: 'Become a Vendor',
              desc: 'Join 340+ artisans selling on 57 Arts & Customs. Get your own storefront, AI-powered analytics, and access to thousands of customers across Africa.',
              perks: ['Free storefront setup', 'AI pricing recommendations', 'M-Pesa monthly payouts', 'Real-time sales analytics'],
              cta: 'Start Selling →', path: '/vendor', btnStyle: s.btnPrimary,
            },
            {
              icon: <svg width={17} height={17} fill="none" stroke={C.cream} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              title: 'Affiliate Program',
              desc: 'Earn up to 12% commission referring customers. Real-time tracking, monthly M-Pesa payouts, and a full marketing kit included.',
              perks: ['Up to 12% per sale', 'Real-time commission tracking', 'Monthly M-Pesa payouts', 'Marketing kit & referral links'],
              cta: 'Join Affiliate Program →', path: '/affiliate', btnStyle: s.btnGhost,
            },
          ].map(card => (
            <div key={card.title} style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 18, padding: 38, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ width: 42, height: 42, borderRadius: 9, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>{card.icon}</div>
              <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 22, marginBottom: 10, letterSpacing: '-0.01em' }}>{card.title}</h3>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 22 }}>{card.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {card.perks.map(p => (
                  <li key={p} style={{ color: C.muted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ color: C.gold, fontSize: 10, fontWeight: 900 }}>—</span>{p}
                  </li>
                ))}
              </ul>
              <Link to={card.path} style={card.btnStyle}>{card.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER / SYNDICATE ────────────────────────────────────────── */}
      <section style={{ padding: '96px 0' }}>
        <div style={s.section}>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            {/* Single gold rule at top — the only gold on this block */}
            <div style={{ height: 2, backgroundColor: C.gold }} />
            <div style={{ padding: '56px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
              <div>
                <p style={s.eyebrow}>Join The Syndicate</p>
                <h2 style={{ ...s.h2, marginBottom: 12 }}>Get Early Access<br />to Every Release.</h2>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, maxWidth: 340 }}>
                  First access to new artisan drops, exclusive discounts,
                  and Nairobi studio event invitations. No spam — just craft.
                </p>
              </div>
              <div>
                {!subscribed ? (
                  <form onSubmit={doSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                      style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '12px 15px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = C.bHov}
                      onBlur={e => e.target.style.borderColor = C.border} />
                    <button type="submit" style={{ ...s.btnGold, padding: '13px', borderRadius: 9, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                      Subscribe & Join the Syndicate →
                    </button>
                    <p style={{ color: C.muted, fontSize: 11, textAlign: 'center' }}>No spam. Unsubscribe anytime.</p>
                  </form>
                ) : (
                  <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: C.gold, fontSize: 14 }}>✓</span>
                    </div>
                    <div>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>You're in the Syndicate.</p>
                      <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>First drops land this Friday. Watch your inbox.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '64px 0 36px' }}>
        <div style={s.section}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 64, marginBottom: 52 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000' }}>57</div>
                <span style={{ color: C.cream, fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
              </div>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 270, marginBottom: 22 }}>
                Redefining luxury through artisanal craftsmanship and AI-powered creativity. Built for the bold generation.
              </p>
              <div style={{ display: 'flex', gap: 7 }}>
                {['◎', '@', '✉'].map(icon => (
                  <button key={icon} style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.muted, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Shop</h4>
              {[['Fashion', '/fashion'], ['Furniture', '/furniture'], ['Beads & Jewelry', '/beads'], ['Custom Orders', '/custom-order'], ['Gallery', '/gallery'], ['New Arrivals', '/shop']].map(([label, path]) => (
                <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = C.cream}
                  onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
              ))}
            </div>

            <div>
              <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Company</h4>
              {[['About Us', '/about'], ['Vendor Program', '/vendor'], ['Affiliate', '/affiliate'], ['Artisan Chat', '/artisan-chat'], ['Contact', '/contact'], ['Order Tracking', '/order-tracking']].map(([label, path]) => (
                <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = C.cream}
                  onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. All rights reserved. Nairobi, Kenya.</p>
            <div style={{ display: 'flex', gap: 22 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
                <Link key={label} to="/contact" style={{ color: C.muted, fontSize: 11, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = C.cream}
                  onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;