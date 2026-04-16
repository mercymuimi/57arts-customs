import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { productAPI, aiAPI } from '../services/api';
import { useCart } from '../context/CartContext';

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
};

const s = {
  section:  { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow:  { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
};

// ── SKELETON ──────────────────────────────────────────────────────────────────
const Skeleton = ({ h = 20, w = '100%', mb = 0 }) => (
  <div style={{ height: h, width: w, backgroundColor: C.faint, borderRadius: 6, marginBottom: mb, background: `linear-gradient(90deg, ${C.faint} 25%, ${C.border} 50%, ${C.faint} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
);

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
            Redefining luxury through artisanal craftsmanship and AI-powered creativity. Built for the bold generation.
          </p>
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Shop</h4>
          {[['Shop All', '/shop'], ['Fashion', '/fashion'], ['Furniture', '/furniture'], ['Beads & Jewelry', '/beads']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream}
              onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Company</h4>
          {[['About Us', '/about'], ['Custom Orders', '/custom-order'], ['Contact', '/contact']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream}
              onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. All rights reserved. Nairobi, Kenya.</p>
      </div>
    </div>
  </footer>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { addToCart } = useCart();

  // ── State ──
  const [product,      setProduct]      = useState(null);
  const [similar,      setSimilar]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize,  setSelectedSize]  = useState('');
  const [quantity,      setQuantity]      = useState(1);
  const [addedToCart,   setAddedToCart]   = useState(false);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [activeTab,     setActiveTab]     = useState('description');
  const [hovRel,        setHovRel]        = useState(null);

  // ── Fetch product from MongoDB ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      setSelectedImage(0);
      setSelectedSize('');
      setQuantity(1);
      window.scrollTo(0, 0);

      try {
        const res = await productAPI.getBySlug(slug);
        const p   = res.data.product;
        setProduct(p);

        // Record view interaction with AI
        aiAPI.recordInteraction({ user_id: 'guest', product_id: p._id, action: 'view' }).catch(() => {});

        // Fetch AI similar products based on category
        try {
          const simRes = await aiAPI.getRecommendations({ category: p.category, n: 3 });
          const filtered = (simRes.data.recommendations || []).filter(r => r.slug !== slug);
          setSimilar(filtered.slice(0, 3));
        } catch {
          setSimilar([]);
        }
      } catch (err) {
        console.error('ProductDetail fetch error:', err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      // Add to cart state
      addToCart(product, quantity);
      // Record interaction with AI
      aiAPI.recordInteraction({ user_id: 'guest', product_id: product._id, action: 'cart' }).catch(() => {});
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  // ── LOADING STATE ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Free shipping on orders over KSH 50,000 · M-Pesa accepted · Certificate of authenticity included
        </div>
        <div style={{ ...s.section, padding: '52px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <Skeleton h={520} mb={12} />
              <div style={{ display: 'flex', gap: 10 }}>
                <Skeleton h={90} /><Skeleton h={90} /><Skeleton h={90} />
              </div>
            </div>
            <div style={{ paddingTop: 8 }}>
              <Skeleton h={12} w="30%" mb={16} />
              <Skeleton h={48} w="80%" mb={12} />
              <Skeleton h={16} w="50%" mb={24} />
              <Skeleton h={36} w="40%" mb={32} />
              <Skeleton h={1} mb={32} />
              <Skeleton h={14} w="60%" mb={12} />
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {[1,2,3,4].map(i => <Skeleton key={i} h={38} w={60} />)}
              </div>
              <Skeleton h={48} mb={10} />
              <Skeleton h={48} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR / NOT FOUND STATE ───────────────────────────────────────────────
  if (error || !product) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontSize: 56 }}>◻</p>
        <h2 style={{ color: C.cream, fontSize: 28, fontWeight: 900, textTransform: 'uppercase' }}>Product Not Found</h2>
        <p style={{ color: C.muted, fontSize: 14 }}>This product may have been removed or the link is incorrect.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <Link to="/shop" style={s.btnGold}>Browse Shop</Link>
          <Link to="/" style={s.btnGhost}>Go Home</Link>
        </div>
      </div>
    );
  }

  // ── PRODUCT DATA helpers ──────────────────────────────────────────────────
  const images      = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'];
  const sizes       = product.sizes || [];
  const materials   = product.materials || [];
  const discount    = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Free shipping on orders over KSH 50,000 · M-Pesa accepted · Certificate of authenticity included
      </div>

      {/* BREADCRUMB */}
      <div style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface }}>
        <div style={{ ...s.section, padding: '14px 48px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted }}>
          <Link to="/" style={{ color: C.muted, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = C.cream}
            onMouseLeave={e => e.target.style.color = C.muted}>Home</Link>
          <span>›</span>
          <Link to="/shop" style={{ color: C.muted, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = C.cream}
            onMouseLeave={e => e.target.style.color = C.muted}>Shop</Link>
          <span>›</span>
          <Link to={`/${product.category.toLowerCase()}`} style={{ color: C.muted, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = C.cream}
            onMouseLeave={e => e.target.style.color = C.muted}>{product.category}</Link>
          <span>›</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ ...s.section, padding: '52px 48px 80px' }}>

        {/* ── MAIN PRODUCT SECTION ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 72 }}>

          {/* LEFT — IMAGE GALLERY */}
          <div>
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 520, backgroundColor: C.surface, border: `1px solid ${C.border}`, marginBottom: 12 }}>
              <img
                src={images[selectedImage]} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
              />
              {product.tag && (
                <div style={{ position: 'absolute', top: 18, left: 18, backgroundColor: C.gold, color: '#000', fontSize: 10, fontWeight: 900, padding: '5px 12px', borderRadius: 100, letterSpacing: '0.1em' }}>
                  {product.tag}
                </div>
              )}
              {discount && (
                <div style={{ position: 'absolute', top: 18, right: 18, backgroundColor: '#1a3a1a', color: '#4ade80', fontSize: 10, fontWeight: 900, padding: '5px 12px', borderRadius: 100, letterSpacing: '0.1em' }}>
                  -{discount}% OFF
                </div>
              )}
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(10,10,10,0.8)', color: C.muted, fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 100, border: `1px solid ${C.border}` }}>
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    style={{ flex: 1, height: 90, borderRadius: 10, overflow: 'hidden', border: `2px solid ${selectedImage === i ? C.gold : C.border}`, cursor: 'pointer', padding: 0, transition: 'border-color 0.15s', backgroundColor: C.surface }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — PRODUCT INFO */}
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              <Link to={`/${product.category.toLowerCase()}`}
                style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                {product.category}
              </Link>
              {product.tag && (
                <span style={{ backgroundColor: C.faint, color: C.cream, fontSize: 9, fontWeight: 900, padding: '3px 9px', borderRadius: 100, letterSpacing: '0.12em', textTransform: 'uppercase', border: `1px solid ${C.border}` }}>
                  {product.tag}
                </span>
              )}
            </div>

            <h1 style={{ color: C.cream, fontSize: 38, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 10 }}>
              {product.name}
            </h1>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>{product.description?.split('.')[0]}.</p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(star => (
                  <span key={star} style={{ color: star <= Math.floor(product.rating || 0) ? C.gold : C.dim, fontSize: 14 }}>★</span>
                ))}
              </div>
              <span style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{product.rating || '—'}</span>
              <span style={{ color: C.dim, fontSize: 12 }}>({product.numReviews || product.reviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28, paddingBottom: 28, borderBottom: `1px solid ${C.border}` }}>
              <p style={{ color: C.gold, fontWeight: 900, fontSize: 32 }}>
                KSH {product.price?.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p style={{ color: C.dim, fontSize: 16, textDecoration: 'line-through' }}>
                  KSH {product.originalPrice?.toLocaleString()}
                </p>
              )}
            </div>

            {/* Size selector */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Select {product.category === 'Beads' ? 'Length' : 'Size'}
                  {selectedSize && <span style={{ color: C.gold, marginLeft: 6 }}>— {selectedSize}</span>}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {sizes.map(sz => (
                    <button key={sz} onClick={() => setSelectedSize(sz)}
                      style={{ padding: '9px 18px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', border: `1px solid ${selectedSize === sz ? C.gold : C.border}`, backgroundColor: selectedSize === sz ? C.gold : 'transparent', color: selectedSize === sz ? '#000' : C.muted, transition: 'all 0.15s' }}
                      onMouseEnter={e => { if (selectedSize !== sz) { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; } }}
                      onMouseLeave={e => { if (selectedSize !== sz) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; } }}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: 36, height: 36, borderRadius: '8px 0 0 8px', border: `1px solid ${C.border}`, backgroundColor: C.faint, color: C.cream, fontSize: 16, cursor: 'pointer' }}>−</button>
                <div style={{ width: 52, height: 36, border: `1px solid ${C.border}`, borderLeft: 'none', borderRight: 'none', backgroundColor: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.cream, fontWeight: 900, fontSize: 14 }}>{quantity}</div>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ width: 36, height: 36, borderRadius: '0 8px 8px 0', border: `1px solid ${C.border}`, backgroundColor: C.faint, color: C.cream, fontSize: 16, cursor: 'pointer' }}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <button onClick={handleAddToCart}
                style={{ flex: 1, padding: '14px', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: 'pointer', border: 'none', letterSpacing: '0.04em', transition: 'all 0.2s', backgroundColor: addedToCart ? '#1a3a1a' : C.gold, color: addedToCart ? '#4ade80' : '#000' }}>
                {addedToCart ? '✓ Added to Cart!' : '+ Add to Cart'}
              </button>
              <button onClick={() => setWishlisted(w => !w)}
                style={{ width: 48, height: 48, borderRadius: 10, border: `1px solid ${wishlisted ? C.gold : C.border}`, backgroundColor: 'transparent', color: wishlisted ? '#e74c3c' : C.muted, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {wishlisted ? '♥' : '♡'}
              </button>
            </div>
            <Link to="/custom-order" style={{ ...s.btnGhost, display: 'block', textAlign: 'center', padding: '13px', boxSizing: 'border-box', width: '100%' }}>
              Customize This Piece →
            </Link>

            {/* Delivery badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, marginTop: 20 }}>
              <span style={{ fontSize: 18 }}>🚚</span>
              <div>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>Estimated Delivery: {product.deliveryTime}</p>
                <p style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Free shipping on orders over KSH 50,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
            {[['description', 'Description'], ['materials', 'Materials & Care'], ['shipping', 'Shipping & Returns']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ padding: '12px 24px', fontSize: 12, fontWeight: 900, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === key ? C.gold : 'transparent'}`, color: activeTab === key ? C.gold : C.muted, marginBottom: -1, transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
            {activeTab === 'description' && (
              <div>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.85, marginBottom: 24 }}>{product.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {[['🎨', 'Hand-crafted', 'Made by master artisans'], ['🌿', 'Sustainable', 'Ethically sourced materials'], ['✦', 'Certified', 'Certificate of authenticity']].map(([icon, title, desc]) => (
                    <div key={title} style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, textAlign: 'center' }}>
                      <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>{icon}</span>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{title}</p>
                      <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'materials' && (
              <div>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>Premium materials sourced from ethical suppliers worldwide.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {materials.length > 0 ? materials.map((mat, i) => (
                    <div key={mat} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: C.faint }}>
                      <span style={{ color: C.gold, fontWeight: 900, fontSize: 12, minWidth: 24 }}>0{i + 1}</span>
                      <span style={{ color: C.cream, fontSize: 13 }}>{mat}</span>
                    </div>
                  )) : <p style={{ color: C.muted, fontSize: 13 }}>Material details coming soon.</p>}
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['🚚', 'Free Delivery',      `Estimated: ${product.deliveryTime || '3-5 Business Days'}`],
                  ['📦', 'Secure Packaging',   'Archival materials ensure safe arrival'],
                  ['↩', '14-Day Returns',      'Full refund within 14 days of receipt'],
                  ['🌍', 'Worldwide Shipping', 'We ship to 50+ countries with tracking'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, backgroundColor: C.faint }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{title}</p>
                      <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── AI SIMILAR PRODUCTS ── */}
        {similar.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
              <div>
                <p style={s.eyebrow}>✦ AI Powered</p>
                <h2 style={{ color: C.cream, fontSize: 32, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>You May Also Like</h2>
              </div>
              <Link to="/shop" style={{ ...s.btnGhost, padding: '10px 20px', fontSize: 11 }}>View All →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${similar.length}, 1fr)`, gap: 20 }}>
              {similar.map(rel => {
                const isHov = hovRel === rel.slug;
                return (
                  <div key={rel.slug}
                    onMouseEnter={() => setHovRel(rel.slug)}
                    onMouseLeave={() => setHovRel(null)}
                    onClick={() => navigate(`/product/${rel.slug}`)}
                    style={{ cursor: 'pointer' }}>
                    <div style={{ borderRadius: 14, overflow: 'hidden', height: 220, backgroundColor: C.surface, border: `1px solid ${isHov ? C.bHov : C.border}`, transition: 'border-color 0.2s', marginBottom: 14 }}>
                      <img src={rel.img} alt={rel.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />
                    </div>
                    <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{rel.category}</p>
                    <p style={{ color: isHov ? C.gold : C.cream, fontWeight: 900, fontSize: 14, marginBottom: 4, transition: 'color 0.2s' }}>{rel.name}</p>
                    <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>KSH {rel.price?.toLocaleString()}</p>
                    {rel.reason && <p style={{ color: C.muted, fontSize: 11, fontStyle: 'italic', marginTop: 3 }}>{rel.reason}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;