import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';

// ── DESIGN TOKENS (matches Home.js exactly) ───────────────────────────────────
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
  tag:        { backgroundColor: C.faint, color: C.cream, fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.12em', textTransform: 'uppercase', border: `1px solid ${C.border}` },
  btnPrimary: { backgroundColor: C.cream, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost:   { backgroundColor: 'transparent', color: C.cream, padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  btnGold:    { backgroundColor: C.gold, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  card:       { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 },
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const categories = ['ALL', 'FASHION', 'FURNITURE', 'BEADS'];
const fallbackImage = 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600';

const normalizeProduct = (product) => ({
  name: product.name,
  price: `KSH ${Number(product.price || 0).toLocaleString()}`,
  priceNum: Number(product.price || 0),
  desc: product.description || 'Artisanal piece',
  category: product.category,
  tag: product.tag || (product.status === 'out_of_stock' ? 'OUT OF STOCK' : ''),
  img: product.images?.[0] || fallbackImage,
  slug: product.slug,
  inStock: product.inStock !== false,
});

// ── SHARED FOOTER ─────────────────────────────────────────────────────────────
const Footer = () => (
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
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Shop</h4>
          {[['Fashion', '/fashion'], ['Furniture', '/furniture'], ['Beads & Jewelry', '/beads'], ['Custom Orders', '/custom-order']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Company</h4>
          {[['About Us', '/about'], ['Vendor Program', '/vendor'], ['Affiliate', '/affiliate'], ['Contact', '/contact']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. All rights reserved. Nairobi, Kenya.</p>
        <div style={{ display: 'flex', gap: 22 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
            <Link key={label} to="/contact" style={{ color: C.muted, fontSize: 11, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const Shop = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('Latest');
  const [wishlist, setWishlist] = useState([]);
  const [cartAdded, setCartAdded] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [vsImage, setVsImage] = useState(null);
  const [vsSearching, setVsSearching] = useState(false);
  const [vsResults, setVsResults] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productAPI.getAll();
        setProducts((res.data?.products || []).map(normalizeProduct));
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const toggleWishlist = (e, slug) => {
    e.stopPropagation();
    setWishlist(p => p.includes(slug) ? p.filter(s => s !== slug) : [...p, slug]);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    setCartAdded(p => [...p, product.slug]);
    setTimeout(() => setCartAdded(p => p.filter(s => s !== product.slug)), 2200);
  };

  const handleVisualSearch = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVsImage(url);
    setVsSearching(true);
    setVsResults([]);
    // Simulate AI matching — returns random products as "visually similar"
    setTimeout(() => {
      const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 4);
      setVsResults(shuffled);
      setVsSearching(false);
    }, 2000);
  };

  const filtered = products
    .filter(p => activeCategory === 'ALL' || p.category.toUpperCase() === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'Price: Low') return a.priceNum - b.priceNum;
      if (sortBy === 'Price: High') return b.priceNum - a.priceNum;
      return 0;
    });

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Free shipping on custom orders over KSH 50,000 · M-Pesa accepted · New drop every Friday
      </div>

      {/* HERO BANNER */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '72px 0 64px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative vertical rule */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: C.border, transform: 'translateX(-50%)' }} />
        <div style={s.section}>
          <div style={{ maxWidth: 640 }}>
            <p style={s.eyebrow}>Curated Artisanal Marketplace</p>
            <h1 style={{ color: C.cream, fontSize: 72, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: 20 }}>
              Shop the<br /><span style={{ color: C.gold }}>Collection</span>
            </h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, maxWidth: 440, marginBottom: 32 }}>
              Curated artisanal pieces across fashion, furniture, and heritage beadwork.
              Each piece is one-of-a-kind — made for the bold generation.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/custom-order" style={s.btnGold}>Commission a Piece →</Link>
              <button onClick={() => { setVisualSearchOpen(true); setVsImage(null); setVsResults([]); }} style={s.btnGhost}>◎ Try Visual Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 40, backgroundColor: C.bg, backdropFilter: 'blur(12px)' }}>
        <div style={{ ...s.section, padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 16px', borderRadius: 8, fontSize: 11, fontWeight: 900, letterSpacing: '0.08em',
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  backgroundColor: activeCategory === cat ? C.gold : 'transparent',
                  color: activeCategory === cat ? '#000' : C.muted,
                }}
                onMouseEnter={e => { if (activeCategory !== cat) { e.currentTarget.style.color = C.cream; } }}
                onMouseLeave={e => { if (activeCategory !== cat) { e.currentTarget.style.color = C.muted; } }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: C.dim, fontSize: 11 }}>{filtered.length} pieces</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.cream, fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', outline: 'none' }}>
              <option>Latest</option>
              <option>Price: Low</option>
              <option>Price: High</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={{ ...s.section, padding: '48px 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {filtered.map(product => {
            const isHov = hoveredCard === product.slug;
            const inCart = cartAdded.includes(product.slug);
            const inWish = wishlist.includes(product.slug);
            return (
              <div key={product.slug}
                onMouseEnter={() => setHoveredCard(product.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ cursor: 'pointer' }}>

                {/* Image container */}
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 290, backgroundColor: C.surface, border: `1px solid ${isHov ? C.bHov : C.border}`, transition: 'border-color 0.2s', marginBottom: 14 }}
                  onClick={() => navigate(`/product/${product.slug}`)}>
                  <img src={product.img} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />

                  {/* Tag */}
                  {product.tag && (
                    <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.1em' }}>
                      {product.tag}
                    </span>
                  )}

                  {/* Wishlist */}
                  <button onClick={e => toggleWishlist(e, product.slug)}
                    style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: 'rgba(10,10,10,0.8)', color: inWish ? '#e74c3c' : C.muted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    {inWish ? '♥' : '♡'}
                  </button>

                  {/* Hover overlay */}
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', opacity: isHov ? 1 : 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <button onClick={e => { e.stopPropagation(); setQuickView(product); }}
                      style={{ ...s.btnPrimary, padding: '10px 24px', fontSize: 11 }}>
                      ◎ Quick View
                    </button>
                    <button onClick={e => { e.stopPropagation(); navigate(`/product/${product.slug}`); }}
                      style={{ ...s.btnGhost, padding: '10px 24px', fontSize: 11 }}>
                      Full Details
                    </button>
                  </div>
                </div>

                {/* Product info */}
                <div onClick={() => navigate(`/product/${product.slug}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1, marginRight: 8 }}>
                      <p style={{ color: isHov ? C.gold : C.cream, fontSize: 13, fontWeight: 900, marginBottom: 3, transition: 'color 0.2s' }}>{product.name}</p>
                      <p style={{ color: C.muted, fontSize: 11 }}>{product.desc}</p>
                      <p style={{ color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>{product.category}</p>
                    </div>
                    <p style={{ color: C.gold, fontWeight: 900, fontSize: 13, flexShrink: 0 }}>{product.price}</p>
                  </div>
                </div>

                {/* Add to Cart */}
                <button onClick={e => handleAddToCart(e, product)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 10, fontWeight: 900, fontSize: 11, letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: inCart ? '#1a3a1a' : 'transparent',
                    color: inCart ? '#4ade80' : C.muted,
                    border: `1px solid ${inCart ? '#2a5a2a' : C.border}`,
                  }}
                  onMouseEnter={e => { if (!inCart) { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = C.gold; } }}
                  onMouseLeave={e => { if (!inCart) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; } }}>
                  {inCart ? '✓ Added to Cart' : '+ Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Order CTA */}
        <div style={{ marginTop: 64, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ height: 2, backgroundColor: C.gold }} />
          <div style={{ padding: '52px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <p style={s.eyebrow}>Can't find what you're looking for?</p>
              <h2 style={{ ...s.h2, marginBottom: 12 }}>Want Something<br />Truly Unique?</h2>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85 }}>
                Commission a bespoke piece crafted to your exact specifications by our master artisans. Every material, every dimension — your vision.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/custom-order" style={{ ...s.btnGold, textAlign: 'center', padding: '14px' }}>
                Start Custom Order →
              </Link>
              <Link to="/artisan-chat" style={{ ...s.btnGhost, textAlign: 'center', padding: '14px' }}>
                Chat with an Artisan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickView && (
        <div onClick={() => setQuickView(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, maxWidth: 520, width: '100%', position: 'relative' }}>
            <button onClick={() => setQuickView(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: C.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
            <div style={{ display: 'flex', gap: 20 }}>
              <img src={quickView.img} alt={quickView.name}
                style={{ width: 180, height: 180, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                {quickView.tag && (
                  <span style={{ display: 'inline-block', backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 10px', borderRadius: 100, marginBottom: 10, letterSpacing: '0.1em' }}>
                    {quickView.tag}
                  </span>
                )}
                <p style={{ color: C.dim, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{quickView.category}</p>
                <h3 style={{ color: C.cream, fontSize: 20, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>{quickView.name}</h3>
                <p style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>{quickView.desc}</p>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 28, marginBottom: 20 }}>{quickView.price}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { navigate(`/product/${quickView.slug}`); setQuickView(null); }}
                    style={{ ...s.btnGhost, flex: 1, textAlign: 'center', padding: '10px' }}>Full Details</button>
                  <button onClick={e => { handleAddToCart(e, quickView); setQuickView(null); }}
                    style={{ ...s.btnGold, flex: 1, textAlign: 'center', padding: '10px' }}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISUAL SEARCH MODAL */}
      {visualSearchOpen && (
        <div onClick={() => setVisualSearchOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '88vh', overflowY: 'auto' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>AI-Powered</p>
                <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Visual Search</h2>
              </div>
              <button onClick={() => setVisualSearchOpen(false)}
                style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ padding: 28 }}>
              {/* Upload zone */}
              {!vsImage ? (
                <div
                  onClick={() => document.getElementById('vs-file-input').click()}
                  style={{ border: `2px dashed ${C.border}`, borderRadius: 16, padding: '56px 24px', textAlign: 'center', cursor: 'pointer', backgroundColor: C.faint, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.backgroundColor = C.faint; }}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = C.gold; }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = C.border; }}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) handleVisualSearch(f); }}>
                  <input id="vs-file-input" type="file" accept="image/*" hidden
                    onChange={e => { const f = e.target.files[0]; if (f) handleVisualSearch(f); }} />
                  <p style={{ fontSize: 40, marginBottom: 16 }}>◎</p>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 8 }}>Upload an image to find similar pieces</p>
                  <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Drag & drop or click to browse · JPG, PNG, WEBP</p>
                  <span style={{ backgroundColor: C.gold, color: '#000', padding: '10px 22px', borderRadius: 9, fontWeight: 900, fontSize: 12, letterSpacing: '0.04em' }}>
                    Choose Image
                  </span>
                </div>
              ) : (
                <div>
                  {/* Uploaded image preview + change */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24, padding: 16, backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                    <img src={vsImage} alt="Search" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 4 }}>
                        {vsSearching ? '⟳ AI is scanning for similar pieces...' : `Found ${vsResults.length} visually similar items`}
                      </p>
                      <p style={{ color: C.muted, fontSize: 12 }}>
                        {vsSearching ? 'Analysing colours, shapes, and style...' : 'Results ranked by visual similarity'}
                      </p>
                    </div>
                    <button onClick={() => { setVsImage(null); setVsResults([]); document.getElementById('vs-file-input').click(); }}
                      style={{ color: C.gold, fontWeight: 900, fontSize: 11, background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', flexShrink: 0 }}>
                      Change Image
                    </button>
                  </div>

                  {/* Searching animation */}
                  {vsSearching && (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.gold, opacity: 0.4, animation: `pulse ${0.8 + i * 0.15}s infinite alternate` }} />
                        ))}
                      </div>
                      <div style={{ height: 4, backgroundColor: C.border, borderRadius: 100, overflow: 'hidden', maxWidth: 280, margin: '0 auto' }}>
                        <div style={{ height: '100%', backgroundColor: C.gold, borderRadius: 100, width: '65%' }} />
                      </div>
                    </div>
                  )}

                  {/* Results grid */}
                  {!vsSearching && vsResults.length > 0 && (
                    <div>
                      <p style={{ color: C.muted, fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Visually Similar Pieces</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                        {vsResults.map(product => (
                          <div key={product.slug}
                            onClick={() => { setVisualSearchOpen(false); navigate(`/product/${product.slug}`); }}
                            style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
                            <div style={{ height: 140, overflow: 'hidden' }}>
                              <img src={product.img} alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                            </div>
                            <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 2 }}>{product.name}</p>
                                <p style={{ color: C.muted, fontSize: 11 }}>{product.desc}</p>
                              </div>
                              <p style={{ color: C.gold, fontWeight: 900, fontSize: 13, flexShrink: 0, marginLeft: 8 }}>{product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <button onClick={() => setVisualSearchOpen(false)}
                          style={{ color: C.muted, fontWeight: 900, fontSize: 11, background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 18px', cursor: 'pointer', letterSpacing: '0.06em' }}>
                          Browse full shop instead →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
