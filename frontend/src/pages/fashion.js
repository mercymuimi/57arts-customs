import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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
  btnPrimary: { backgroundColor: C.cream, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost:   { backgroundColor: 'transparent', color: C.cream, padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  btnGold:    { backgroundColor: C.gold, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  card:       { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 },
  input:      { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const styleCategories = [
  { key: 'old-money',    label: 'Old Money',    icon: '🎩', desc: 'Understated luxury. Quiet wealth.',       img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700', count: 6 },
  { key: 'streetwear',  label: 'Streetwear',   icon: '🧢', desc: 'Bold. Raw. Culture-coded.',               img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700', count: 8 },
  { key: 'official-wear', label: 'Official Wear', icon: '💼', desc: 'Power dressing for the boardroom.',    img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=700', count: 5 },
  { key: 'denim-wear',  label: 'Denim Wear',   icon: '👖', desc: 'Artisan-distressed. Hand-finished.',      img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700', count: 6 },
  { key: 'afro-luxury', label: 'Afro Luxury',  icon: '🌍', desc: 'Heritage craft meets high fashion.',      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700', count: 7 },
  { key: 'resort-wear', label: 'Resort Wear',  icon: '🌊', desc: 'Sun-drenched and effortlessly elegant.',  img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700', count: 4 },
];

const allProducts = {
  'old-money': [
    { id: 'om1', name: 'Regency Silk Polo',   price: 'KES 18,500', desc: 'Premium knit cream silk with mother-of-pearl buttons.', tag: 'NEW', inStock: true, materials: ['100% Mulberry Silk', 'Mother-of-pearl buttons'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', vendor: 'Fatima Al-Hassan' },
    { id: 'om2', name: 'Cashmere Overcoat',   price: 'KES 64,000', desc: 'Double-faced Italian cashmere overcoat. Notched lapel.', tag: 'BESPOKE', inStock: true, materials: ['Italian Cashmere', 'Silk Satin Lining'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500', vendor: 'Master Julian' },
    { id: 'om3', name: 'Linen Riviera Set',   price: 'KES 24,000', desc: 'Hand-dyed Belgian linen shirt and trousers set.', tag: '', inStock: true, materials: ['Belgian Linen', 'Natural Dyes'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', vendor: 'Adaeze Obi' },
    { id: 'om4', name: 'Heritage Blazer',     price: 'KES 38,000', desc: 'Single-button wool blazer in stone grey. Hand-stitched lapels.', tag: '', inStock: false, materials: ['100% Merino Wool', 'Copper-tone buttons'], sizes: ['M','L','XL'], img: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', vendor: 'Fatima Al-Hassan' },
    { id: 'om5', name: 'Pearl Knit Vest',     price: 'KES 12,500', desc: 'Fine-gauge merino wool vest. Ribbed edges, pearl sheen.', tag: 'NEW', inStock: true, materials: ['Merino Wool', 'Pearl-thread yarn'], sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', vendor: 'Abena Asante' },
    { id: 'om6', name: 'Ivory Trench Coat',   price: 'KES 52,000', desc: 'Gabardine trench in off-white. Storm shield, double breast.', tag: 'LIMITED', inStock: true, materials: ['Cotton Gabardine', 'Tortoise-shell buttons'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500', vendor: 'Fatima Al-Hassan' },
  ],
  'streetwear': [
    { id: 'sw1', name: 'Midnight Denim',      price: 'KES 28,000', desc: 'Hand-distressed raw denim jacket with painted chest graphic.', tag: 'HOT', inStock: true, materials: ['Raw Japanese Denim', 'Hand-applied Graphic'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', vendor: 'Kofi Mensah' },
    { id: 'sw2', name: 'Aura Metallic Tee',   price: 'KES 8,500',  desc: '400GSM heavyweight cotton tee with foil-print tribal pattern.', tag: 'NEW', inStock: true, materials: ['400GSM Cotton', 'Metallic Foil Print'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', vendor: 'Kofi Mensah' },
    { id: 'sw3', name: 'Artifact Wide Leg',   price: 'KES 22,000', desc: 'Custom paint-finish cargo trousers. Side pockets, drawstring.', tag: '', inStock: true, materials: ['Cotton Twill', 'Hand-applied Paint'], sizes: ['28','30','32','34','36'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', vendor: 'Kofi Mensah' },
    { id: 'sw4', name: 'Shadow Rider Leather',price: 'KES 45,000', desc: 'Boxy moto jacket in matte black lambskin. Asymmetric zip.', tag: 'LIMITED', inStock: true, materials: ['Lambskin Leather', 'YKK Hardware'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500', vendor: 'Adaeze Obi' },
    { id: 'sw5', name: 'Cyber Hoodie v.2',    price: 'KES 16,000', desc: 'Tech fleece oversized hoodie with mesh panelling.', tag: 'NEW', inStock: true, materials: ['Tech Fleece', 'Reflective Thread'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', vendor: 'Kofi Mensah' },
    { id: 'sw6', name: 'Kente Cargo Set',     price: 'KES 32,000', desc: 'Two-piece cargo set with hand-woven Kente panels.', tag: '', inStock: true, materials: ['Cotton Ripstop', 'Hand-woven Kente'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=500', vendor: 'Abena Asante' },
  ],
  'official-wear': [
    { id: 'ow1', name: 'Midnight Velvet Blazer', price: 'KES 58,000', desc: 'Double-weave midnight velvet blazer with boned structure.', tag: 'SIGNATURE', inStock: true, materials: ['Double-weave Velvet', 'Boned Lining'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500', vendor: 'Fatima Al-Hassan' },
    { id: 'ow2', name: 'Power Suit — Slate',     price: 'KES 72,000', desc: 'Two-piece slim-fit suit in charcoal wool-blend.', tag: 'BESPOKE', inStock: true, materials: ['Wool-Polyester Blend', 'Viscose Lining'], sizes: ['36','38','40','42','44'], img: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', vendor: 'Fatima Al-Hassan' },
    { id: 'ow3', name: 'Ankara Boardroom Dress', price: 'KES 34,000', desc: 'Structured midi dress in premium Ankara. Padded shoulders.', tag: '', inStock: true, materials: ['Premium Ankara', 'Shoulder Padding'], sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', vendor: 'Adaeze Obi' },
    { id: 'ow4', name: 'Obsidian Agbada',        price: 'KES 85,000', desc: 'Three-piece agbada in ivory damask with gold thread embroidery.', tag: 'EXCLUSIVE', inStock: true, materials: ['Ivory Damask', 'Gold Thread Embroidery'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=500', vendor: 'Adaeze Obi' },
  ],
  'denim-wear': [
    { id: 'dw1', name: 'Golden Distressed Denim', price: 'KES 32,000', desc: 'Hand-distressed selvedge denim. Gold leaf on collar and cuffs.', tag: 'HOT', inStock: true, materials: ['Selvedge Denim', '24k Gold Leaf'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', vendor: 'Kofi Mensah' },
    { id: 'dw2', name: 'Indigo Wide-Leg Jeans',   price: 'KES 18,000', desc: 'Hand-dyed Japanese indigo wide-leg denim. High rise.', tag: 'NEW', inStock: true, materials: ['Japanese Denim', 'Natural Indigo Dye'], sizes: ['26','28','30','32','34'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', vendor: 'Kofi Mensah' },
    { id: 'dw3', name: 'Patchwork Denim Coat',    price: 'KES 48,000', desc: 'Floor-length coat assembled from 8 vintage denim fabrics.', tag: 'LIMITED', inStock: true, materials: ['8 Vintage Denims'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', vendor: 'Adaeze Obi' },
    { id: 'dw4', name: 'Raw Edge Trucker',         price: 'KES 22,000', desc: 'Classic trucker in raw unwashed denim. Exposed seams.', tag: '', inStock: true, materials: ['Raw Unwashed Denim', 'Exposed Seam Finish'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', vendor: 'Kofi Mensah' },
  ],
  'afro-luxury': [
    { id: 'al1', name: 'Aso-Oke Agbada',     price: 'KES 96,000', desc: 'Hand-woven Aso-Oke agbada in indigo and copper thread.', tag: 'CUSTOM', inStock: true, materials: ['Hand-woven Aso-Oke', 'Copper Thread'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', vendor: 'Adaeze Obi' },
    { id: 'al2', name: 'Kente Wrap Coat',    price: 'KES 48,000', desc: 'Hand-woven Kente wrap coat with structured shoulders.', tag: 'HOT', inStock: true, materials: ['Hand-woven Kente', 'Interfacing'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=500', vendor: 'Abena Asante' },
    { id: 'al3', name: 'Adire Silk Set',     price: 'KES 41,000', desc: 'Hand-dyed adire silk co-ord in indigo. Top and palazzo trousers.', tag: 'NEW', inStock: true, materials: ['Silk', 'Natural Indigo Dye'], sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', vendor: 'Adaeze Obi' },
    { id: 'al4', name: 'Dashiki Shirt',      price: 'KES 14,000', desc: 'Contemporary long dashiki in gold-embroidered cotton voile.', tag: '', inStock: true, materials: ['Cotton Voile', 'Gold Embroidery'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', vendor: 'Adaeze Obi' },
    { id: 'al5', name: 'Bogolanfini Bomber', price: 'KES 35,000', desc: 'Contemporary bomber in hand-made Malian mud cloth.', tag: '', inStock: true, materials: ['Mud Cloth', 'Satin Lining'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500', vendor: 'Adaeze Obi' },
  ],
  'resort-wear': [
    { id: 'rw1', name: 'Linen Riviera Set',  price: 'KES 24,000', desc: 'Hand-dyed Belgian linen shirt and trousers in sage.', tag: 'NEW', inStock: true, materials: ['Belgian Linen', 'Natural Dyes'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', vendor: 'Adaeze Obi' },
    { id: 'rw2', name: 'Silk Wrap Dress',    price: 'KES 31,000', desc: 'Hand-painted silk wrap dress with abstract coastal motif.', tag: '', inStock: true, materials: ['Silk Charmeuse', 'Hand-painted'], sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', vendor: 'Fatima Al-Hassan' },
    { id: 'rw3', name: 'Cotton Kaftan',      price: 'KES 19,500', desc: 'Block-printed cotton kaftan in terracotta and cream.', tag: '', inStock: true, materials: ['Cotton', 'Block Print'], sizes: ['One Size'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', vendor: 'Adaeze Obi' },
    { id: 'rw4', name: 'Linen Wide-Leg',     price: 'KES 14,000', desc: 'High-rise wide-leg linen in natural ecru. Elasticated waist.', tag: '', inStock: true, materials: ['Linen'], sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', vendor: 'Abena Asante' },
  ],
};

const allFlat = Object.entries(allProducts).flatMap(([catKey, prods]) =>
  prods.map(p => ({ ...p, catKey }))
);

// ── SHARED FOOTER ─────────────────────────────────────────────────────────────
const Footer = ({ onOpenCategory }) => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '64px 0 36px' }}>
    <div style={s.section}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 64, marginBottom: 52 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000' }}>57</div>
              <span style={{ color: C.cream, fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
            </Link>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 270, marginBottom: 18 }}>
            Redefining luxury through artisanal craftsmanship and AI-powered creativity. Built for the bold generation.
          </p>
          {/* Back to main site */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', textDecoration: 'none', border: `1px solid ${C.border}`, padding: '6px 14px', borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            ← Back to Home
          </Link>
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Collections</h4>
          {styleCategories.map(cat => (
            <button key={cat.key}
              onClick={() => onOpenCategory(cat)}
              style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'left', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.cream}
              onMouseLeave={e => e.currentTarget.style.color = C.muted}>
              {cat.label}
            </button>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Company</h4>
          {[['About Us', '/about'], ['Custom Orders', '/custom-order'], ['Affiliate', '/affiliate'], ['Contact', '/contact']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. All rights reserved. Nairobi, Kenya.</p>
        <div style={{ display: 'flex', gap: 22 }}>
          {[['Privacy Policy', '/contact'], ['Terms of Service', '/contact']].map(([label, path]) => (
            <Link key={label} to={path} style={{ color: C.muted, fontSize: 11, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, onOpen, wishlist, onToggleWishlist }) => {
  const [hov, setHov] = useState(false);
  const cat = styleCategories.find(c => c.key === product.catKey);
  const inWish = wishlist.includes(product.id);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(product, cat)}
      style={{ cursor: 'pointer', backgroundColor: C.surface, border: `1px solid ${hov ? C.bHov : C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <div style={{ position: 'relative', height: 260, overflow: 'hidden', backgroundColor: C.faint }}>
        <img src={product.img} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hov ? 'scale(1.06)' : 'scale(1)', filter: !product.inStock ? 'grayscale(0.4)' : 'none' }} />
        {!product.inStock && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ backgroundColor: C.surface, color: C.muted, border: `1px solid ${C.border}`, fontSize: 9, fontWeight: 900, padding: '5px 14px', borderRadius: 100, letterSpacing: '0.1em' }}>OUT OF STOCK</span>
          </div>
        )}
        {product.tag && (
          <span style={{ position: 'absolute', top: 10, left: 10, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.1em' }}>
            {product.tag}
          </span>
        )}
        <button onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
          style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: 7, border: `1px solid ${C.border}`, backgroundColor: 'rgba(10,10,10,0.85)', color: inWish ? '#e74c3c' : C.muted, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {inWish ? '♥' : '♡'}
        </button>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ color: C.dim, fontSize: 10, marginBottom: 3 }}>{product.vendor} · {cat?.label}</p>
        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 6 }}>{product.name}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{product.price}</p>
          <div style={{ display: 'flex', gap: 4 }}>
            {product.sizes.slice(0, 3).map(sz => (
              <span key={sz} style={{ color: C.muted, fontSize: 9, border: `1px solid ${C.border}`, padding: '2px 5px', borderRadius: 4, backgroundColor: C.faint }}>{sz}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const Fashion = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount } = useCart();
  const [view, setView]                       = useState('home');
  const [activeCategory, setActiveCategory]   = useState(null);
  const [activeProduct, setActiveProduct]     = useState(null);
  const [wishlist, setWishlist]               = useState([]);
  const [selectedSize, setSelectedSize]       = useState('');
  const [addedToCart, setAddedToCart]         = useState(false);
  const [activeCatFilter, setActiveCatFilter] = useState('all');
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchOpen, setSearchOpen]           = useState(false);
  const [activeTab, setActiveTab]             = useState('description');
  const [hovCat, setHovCat]                   = useState(null);
  const searchInputRef                        = useRef(null);

  const filteredAll = activeCatFilter === 'all'
    ? allFlat
    : allFlat.filter(p => p.catKey === activeCatFilter);

  const searchResults = searchQuery.trim().length > 1
    ? allFlat.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const toggleWishlist = (id) => setWishlist(p => p.includes(id) ? p.filter(w => w !== id) : [...p, id]);
  const openCategory   = (cat) => { setActiveCategory(cat); setView('category'); window.scrollTo(0, 0); };
  const openAllProducts = (catKey = 'all') => { setActiveCatFilter(catKey); setView('all'); window.scrollTo(0, 0); };
  const openProduct    = (product, cat) => {
    if (cat) setActiveCategory(cat);
    setActiveProduct(product); setSelectedSize(''); setAddedToCart(false);
    setActiveTab('description');
    setView('detail'); window.scrollTo(0, 0);
    setSearchOpen(false); setSearchQuery('');
  };
  const goHome     = () => { setView('home');     window.scrollTo(0, 0); };
  const goCategory = () => { setView('category'); window.scrollTo(0, 0); };

  const handleAddToCart = () => {
    if (!selectedSize && activeProduct.sizes.length > 1) return;
    addToCart(activeProduct, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // ── NAVBAR (shared across views) ──────────────────────────────────────────
  const Navbar = () => (
    <nav style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}`, height: 58, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ ...s.section, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Back to main site */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.cream}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            ← Home
          </Link>
          <span style={{ color: C.border, fontSize: 14 }}>|</span>
          {/* Fashion internal home */}
          <button onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 26, height: 26, borderRadius: 5, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 12, letterSpacing: '0.06em' }}>FASHION</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {styleCategories.map(cat => (
            <button key={cat.key} onClick={() => openCategory(cat)}
              style={{ color: activeCategory?.key === cat.key ? C.gold : C.muted, fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 6, transition: 'color 0.15s' }}
              onMouseEnter={e => { if (activeCategory?.key !== cat.key) e.currentTarget.style.color = C.cream; }}
              onMouseLeave={e => { if (activeCategory?.key !== cat.key) e.currentTarget.style.color = C.muted; }}>
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setSearchOpen(o => !o)}
              style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>◎</button>
            {searchOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', width: 320, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, zIndex: 60 }}>
                <input ref={searchInputRef} type="text" placeholder="Search pieces, vendors…" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ ...s.input, marginBottom: searchResults.length ? 10 : 0 }} />
                {searchResults.map(p => (
                  <div key={p.id} onClick={() => openProduct(p, styleCategories.find(c => c.key === p.catKey))}
                    style={{ display: 'flex', gap: 10, padding: '8px 4px', cursor: 'pointer', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.faint}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <img src={p.img} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                    <div>
                      <p style={{ color: C.cream, fontSize: 12, fontWeight: 900 }}>{p.name}</p>
                      <p style={{ color: C.gold, fontSize: 11 }}>{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <button onClick={() => navigate('/cart')} style={{ position: 'relative', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>
            ◻
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, backgroundColor: C.gold, color: '#000', fontSize: 8, fontWeight: 900, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{itemCount}</span>
            )}
          </button>

          <Link to="/shop" style={{ ...s.btnGold, padding: '8px 16px', fontSize: 10 }}>All Categories</Link>
        </div>
      </div>
    </nav>
  );

  // ── HOME VIEW ──────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
        {/* ANNOUNCEMENT */}
        <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          1,200+ fashion pieces · KES pricing · Free shipping over KSH 50,000
        </div>
        <Navbar />

        {/* HERO */}
        <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600" alt="Fashion Hero"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,10,0.97) 40%, rgba(10,10,10,0.4))' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: C.border }} />

          <div style={{ ...s.section, position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: 600 }}>
              <p style={s.eyebrow}>57 Arts & Customs — Fashion</p>
              <h1 style={{ color: C.cream, fontSize: 86, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.88, marginBottom: 24 }}>
                Dress the<br /><span style={{ color: C.gold }}>Culture</span>
              </h1>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, maxWidth: 440, marginBottom: 36 }}>
                Six distinct style universes. Handcrafted fashion from Africa's finest artisans.
                Old money luxury to Afro-heritage streetwear — all in one place.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={s.btnGold} onClick={() => openAllProducts('all')}>Shop All Pieces</button>
                <button style={s.btnGhost} onClick={() => openCategory(styleCategories[4])}>Explore Afro Luxury</button>
              </div>
              <div style={{ display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
                {[['1,200+', 'Fashion Pieces'], ['36', 'Artisan Vendors'], ['6', 'Style Universes']].map(([num, label]) => (
                  <div key={label}>
                    <p style={{ color: C.gold, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{num}</p>
                    <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STYLE CATEGORIES GRID */}
        <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
          <div style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
              <div>
                <p style={s.eyebrow}>Six Style Universes</p>
                <h2 style={s.h2}>Find Your Aesthetic</h2>
              </div>
              <button onClick={() => openAllProducts('all')} style={{ ...s.btnGhost, fontSize: 11, padding: '10px 20px' }}>View All Pieces →</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {styleCategories.map(cat => {
                const isHov = hovCat === cat.key;
                return (
                  <div key={cat.key} onMouseEnter={() => setHovCat(cat.key)} onMouseLeave={() => setHovCat(null)}
                    onClick={() => openCategory(cat)}
                    style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 260, cursor: 'pointer', border: `1px solid ${isHov ? C.bHov : C.border}`, transition: 'border-color 0.2s' }}>
                    <img src={cat.img} alt={cat.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.92) 35%, transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <p style={{ color: C.gold, fontSize: 9, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{cat.icon} {cat.count} pieces</p>
                          <p style={{ color: C.cream, fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>{cat.label}</p>
                          <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{cat.desc}</p>
                        </div>
                        <span style={{ color: C.gold, fontSize: 18, opacity: isHov ? 1 : 0, transition: 'opacity 0.2s' }}>→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS — first 6 from all */}
        <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
          <div style={s.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
              <div>
                <p style={s.eyebrow}>New Arrivals</p>
                <h2 style={s.h2}>Latest Drops</h2>
              </div>
              <button onClick={() => openAllProducts('all')} style={{ ...s.btnGhost, fontSize: 11, padding: '10px 20px' }}>View All →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {allFlat.filter(p => p.tag === 'NEW' || p.tag === 'HOT').slice(0, 6).map(p => (
                <ProductCard key={p.id} product={p} onOpen={openProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOM CTA */}
        <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
          <div style={s.section}>
            <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ height: 2, backgroundColor: C.gold }} />
              <div style={{ padding: '56px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
                <div>
                  <p style={s.eyebrow}>Bespoke Fashion</p>
                  <h2 style={{ ...s.h2, marginBottom: 12 }}>Commission Your<br />Perfect Piece</h2>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85 }}>
                    Can't find exactly what you want? Our artisans specialise in bespoke garments made to your exact vision —
                    from Ankara boardroom wear to hand-painted denim.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Link to="/custom-order" style={{ ...s.btnGold, textAlign: 'center', padding: '14px' }}>Start Custom Order →</Link>
                  <Link to="/artisan-chat" style={{ ...s.btnGhost, textAlign: 'center', padding: '14px' }}>Chat with an Artisan</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer onOpenCategory={openCategory} />
      </div>
    );
  }

  // ── CATEGORY VIEW ──────────────────────────────────────────────────────────
  if (view === 'category' && activeCategory) {
    const products = allProducts[activeCategory.key] || [];
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
        <Navbar />
        {/* Hero */}
        <section style={{ position: 'relative', height: 340, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <img src={activeCategory.img} alt={activeCategory.label}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,1) 30%, rgba(10,10,10,0.4))' }} />
          <div style={{ ...s.section, position: 'relative', zIndex: 2, paddingBottom: 48 }}>
            <button onClick={goHome} style={{ color: C.muted, fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, letterSpacing: '0.06em' }}>
              ← Fashion
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{activeCategory.icon}</div>
              <div>
                <p style={s.eyebrow}>{products.length} pieces</p>
                <h1 style={{ color: C.cream, fontSize: 48, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>{activeCategory.label}</h1>
              </div>
            </div>
            <p style={{ color: C.muted, fontSize: 14, marginTop: 10 }}>{activeCategory.desc}</p>
          </div>
        </section>

        {/* Products */}
        <div style={{ ...s.section, padding: '48px 48px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {products.map(p => (
              <ProductCard key={p.id} product={{ ...p, catKey: activeCategory.key }} onOpen={openProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
            ))}
          </div>
        </div>
        <Footer onOpenCategory={openCategory} />
      </div>
    );
  }

  // ── ALL PRODUCTS VIEW ──────────────────────────────────────────────────────
  if (view === 'all') {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ ...s.section, padding: '48px 48px 80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <p style={s.eyebrow}>All Fashion</p>
              <h2 style={s.h2}>{filteredAll.length} Pieces</h2>
            </div>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[['all', 'All'], ...styleCategories.map(c => [c.key, c.label])].map(([key, label]) => (
                <button key={key} onClick={() => setActiveCatFilter(key)}
                  style={{ padding: '7px 14px', borderRadius: 8, fontSize: 10, fontWeight: 900, cursor: 'pointer', border: `1px solid ${activeCatFilter === key ? C.gold : C.border}`, backgroundColor: activeCatFilter === key ? C.gold : 'transparent', color: activeCatFilter === key ? '#000' : C.muted, transition: 'all 0.15s' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filteredAll.map(p => (
              <ProductCard key={p.id} product={p} onOpen={openProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
            ))}
          </div>
        </div>
        <Footer onOpenCategory={openCategory} />
      </div>
    );
  }

  // ── PRODUCT DETAIL VIEW ────────────────────────────────────────────────────
  if (view === 'detail' && activeProduct) {
    const catProducts = allProducts[activeCategory?.key] || [];
    const related = catProducts.filter(p => p.id !== activeProduct.id).slice(0, 3);
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ ...s.section, padding: '48px 48px 80px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 36, color: C.muted, fontSize: 11 }}>
            <button onClick={goHome} style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11 }}>Fashion</button>
            <span>›</span>
            {activeCategory && <button onClick={goCategory} style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11 }}>{activeCategory.label}</button>}
            {activeCategory && <span>›</span>}
            <span style={{ color: C.cream }}>{activeProduct.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 64 }}>
            {/* Images */}
            <div>
              <div style={{ borderRadius: 16, overflow: 'hidden', height: 520, backgroundColor: C.surface, border: `1px solid ${C.border}`, marginBottom: 12 }}>
                <img src={activeProduct.img} alt={activeProduct.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {activeCategory && <span style={{ color: C.gold, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{activeCategory.label}</span>}
                {activeProduct.tag && <span style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.muted, fontSize: 9, fontWeight: 900, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.1em' }}>{activeProduct.tag}</span>}
                {!activeProduct.inStock && <span style={{ backgroundColor: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.4)', color: '#f87171', fontSize: 9, fontWeight: 900, padding: '3px 10px', borderRadius: 100 }}>OUT OF STOCK</span>}
              </div>

              <h1 style={{ color: C.cream, fontSize: 40, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>{activeProduct.name}</h1>
              <p style={{ color: C.gold, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>{activeProduct.price}</p>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.75, marginBottom: 24 }}>{activeProduct.desc}</p>

              {/* Vendor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontWeight: 900, fontSize: 12 }}>
                  {activeProduct.vendor?.charAt(0)}
                </div>
                <div>
                  <p style={{ color: C.muted, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Artisan Vendor</p>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{activeProduct.vendor}</p>
                </div>
              </div>

              {/* Size selector */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Select Size {selectedSize && <span style={{ color: C.gold }}>— {selectedSize}</span>}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {activeProduct.sizes.map(sz => (
                    <button key={sz} onClick={() => setSelectedSize(sz)}
                      style={{ padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', border: `1px solid ${selectedSize === sz ? C.gold : C.border}`, backgroundColor: selectedSize === sz ? C.gold : 'transparent', color: selectedSize === sz ? '#000' : C.muted, transition: 'all 0.15s' }}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Materials</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {activeProduct.materials.map(mat => (
                    <span key={mat} style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, padding: '5px 12px', borderRadius: 8 }}>{mat}</span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button onClick={handleAddToCart} disabled={!activeProduct.inStock}
                  style={{ flex: 1, padding: '14px', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: activeProduct.inStock ? 'pointer' : 'not-allowed', border: 'none', letterSpacing: '0.04em', transition: 'all 0.2s',
                    backgroundColor: addedToCart ? '#1a3a1a' : activeProduct.inStock ? C.gold : C.faint,
                    color: addedToCart ? '#4ade80' : activeProduct.inStock ? '#000' : C.dim }}>
                  {!activeProduct.inStock ? 'Out of Stock' : addedToCart ? '✓ Added to Cart!' : '+ Add to Cart'}
                </button>
                <button onClick={() => toggleWishlist(activeProduct.id)}
                  style={{ width: 48, height: 48, borderRadius: 10, border: `1px solid ${wishlist.includes(activeProduct.id) ? C.gold : C.border}`, backgroundColor: 'transparent', color: wishlist.includes(activeProduct.id) ? '#e74c3c' : C.muted, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {wishlist.includes(activeProduct.id) ? '♥' : '♡'}
                </button>
              </div>

              <Link to="/custom-order"
                style={{ ...s.btnGhost, display: 'block', textAlign: 'center', padding: '13px' }}>
                Commission a Custom Version →
              </Link>
            </div>
          </div>

          {/* TABS */}
          <div style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
              {[['description', 'Description'], ['materials', 'Materials & Care'], ['shipping', 'Shipping']].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  style={{ padding: '10px 20px', fontSize: 12, fontWeight: 900, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === key ? C.gold : 'transparent'}`, color: activeTab === key ? C.gold : C.muted, marginBottom: -1, transition: 'all 0.15s' }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
              {activeTab === 'description' && (
                <div>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, marginBottom: 20 }}>{activeProduct.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[['🎨', 'Hand-crafted', 'Made by master artisans'], ['🌿', 'Sustainable', 'Ethically sourced materials'], ['✦', 'Certified', 'Certificate of authenticity']].map(([icon, title, desc]) => (
                      <div key={title} style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, textAlign: 'center' }}>
                        <span style={{ fontSize: 22, display: 'block', marginBottom: 8 }}>{icon}</span>
                        <p style={{ color: C.cream, fontWeight: 900, fontSize: 11 }}>{title}</p>
                        <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'materials' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {activeProduct.materials.map((mat, i) => (
                    <div key={mat} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: C.faint }}>
                      <span style={{ color: C.gold, fontWeight: 900, fontSize: 12 }}>0{i + 1}</span>
                      <span style={{ color: C.cream, fontSize: 13 }}>{mat}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'shipping' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[['🚚', 'Free Delivery', '3–7 business days across Kenya'], ['📦', 'Secure Packaging', 'Archival materials for every piece'], ['↩', '14-Day Returns', 'Full refund within 14 days'], ['🌍', 'Worldwide Shipping', 'We ship to 50+ countries']].map(([icon, title, desc]) => (
                    <div key={title} style={{ display: 'flex', gap: 12, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: C.faint }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                      <div>
                        <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{title}</p>
                        <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RELATED */}
          {related.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
                <div>
                  <p style={s.eyebrow}>More Like This</p>
                  <h2 style={{ ...s.h2, fontSize: 28 }}>You May Also Like</h2>
                </div>
                <button onClick={() => openAllProducts(activeCategory?.key)} style={{ ...s.btnGhost, fontSize: 11, padding: '9px 18px' }}>View All →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${related.length}, 1fr)`, gap: 20 }}>
                {related.map(p => (
                  <ProductCard key={p.id} product={{ ...p, catKey: activeCategory?.key }} onOpen={openProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer onOpenCategory={openCategory} />
      </div>
    );
  }

  return null;
};

export default Fashion;