import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};

const initialItems = [
  { id: 1, name: 'Distressed Artisanal Denim', desc: 'Hand-painted · Size: M', price: 58000, qty: 1, category: 'Fashion',   img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200', slug: 'distressed-artisanal-denim'  },
  { id: 2, name: 'Gold-Infused Obsidian Beads', desc: 'Hand-threaded · 18"',   price: 24000, qty: 1, category: 'Beads',     img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200', slug: 'gold-infused-obsidian-beads' },
  { id: 3, name: 'Vanguard Teak Chair',          desc: 'Bespoke · Standard',   price: 138000, qty: 1, category: 'Furniture', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200', slug: 'vanguard-teak-chair'         },
];

const recommended = [
  { name: 'Midnight Velvet Blazer', price: 'KSH 72,000',  img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300', slug: 'midnight-velvet-blazer'      },
  { name: 'Linen Riviera Set',      price: 'KSH 42,000',  img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300', slug: 'linen-riviera-set'            },
  { name: 'Kente Bead Stack',       price: 'KSH 18,000',  img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300', slug: 'kente-bead-stack'            },
];

const fmt = n => `KSH ${n.toLocaleString()}`;

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems]               = useState(initialItems);
  const [saved, setSaved]               = useState([]);
  const [coupon, setCoupon]             = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError]   = useState('');

  const updateQty    = (id, d)  => setItems(p => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const removeItem   = id       => setItems(p => p.filter(i => i.id !== id));
  const saveForLater = id       => { const item = items.find(i => i.id === id); setSaved(p => [...p, item]); removeItem(id); };
  const moveToCart   = item     => { setItems(p => [...p, { ...item, qty: 1 }]); setSaved(p => p.filter(i => i.id !== item.id)); };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SAVE10') { setCouponApplied(true); setCouponError(''); }
    else { setCouponError('Invalid code'); setCouponApplied(false); }
  };

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount  = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping  = subtotal > 50000 ? 0 : 500;
  const total     = subtotal - discount + shipping;

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '40px 48px 32px', backgroundColor: C.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 11, color: C.muted }}>
            <Link to="/" style={{ color: C.muted, textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <span style={{ color: C.cream }}>Cart</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Your Cart <span style={{ color: C.muted, fontSize: 22 }}>({items.length})</span>
            </h1>
            <Link to="/shop" style={{ color: C.muted, fontSize: 12, fontWeight: 700, textDecoration: 'none', borderBottom: `1px solid ${C.border}`, paddingBottom: 2 }}>
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>

        {/* LEFT — items */}
        <div>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width={24} height={24} fill="none" stroke={C.muted} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Your cart is empty</h3>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Browse our collections and find something you love.</p>
              <Link to="/shop" style={{ backgroundColor: C.gold, color: '#000', padding: '12px 28px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none' }}>
                Shop Now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {items.map(item => (
                <div key={item.id} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: 'flex', gap: 16, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={{ width: 88, height: 88, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: `1px solid ${C.border}`, cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${item.slug}`)}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div>
                        <p style={{ color: C.cream, fontWeight: 900, fontSize: 14, cursor: 'pointer', marginBottom: 2 }} onClick={() => navigate(`/product/${item.slug}`)}>{item.name}</p>
                        <p style={{ color: C.muted, fontSize: 11 }}>{item.desc}</p>
                        <span style={{ display: 'inline-block', marginTop: 6, color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1px solid ${C.border}`, padding: '2px 8px', borderRadius: 100 }}>{item.category}</span>
                      </div>
                      <p style={{ color: C.gold, fontWeight: 900, fontSize: 15, flexShrink: 0, marginLeft: 12 }}>{fmt(item.price * item.qty)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                      {/* Qty */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
                        <button onClick={() => updateQty(item.id, -1)}
                          style={{ width: 32, height: 32, backgroundColor: 'transparent', border: 'none', color: C.cream, cursor: 'pointer', fontSize: 16 }}>−</button>
                        <span style={{ width: 32, textAlign: 'center', color: C.cream, fontWeight: 900, fontSize: 13, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, lineHeight: '32px' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}
                          style={{ width: 32, height: 32, backgroundColor: 'transparent', border: 'none', color: C.cream, cursor: 'pointer', fontSize: 16 }}>+</button>
                      </div>
                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 14 }}>
                        <button onClick={() => saveForLater(item.id)}
                          style={{ background: 'none', border: 'none', color: C.muted, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Save for later</button>
                        <button onClick={() => removeItem(item.id)}
                          style={{ background: 'none', border: 'none', color: '#e05c5c', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved for later */}
          {saved.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Saved for Later ({saved.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {saved.map(item => (
                  <div key={item.id} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: C.cream, fontWeight: 800, fontSize: 13 }}>{item.name}</p>
                      <p style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{fmt(item.price)}</p>
                    </div>
                    <button onClick={() => moveToCart(item)}
                      style={{ border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.cream, padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended */}
          <div style={{ marginTop: 40 }}>
            <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>You Might Also Like</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {recommended.map(p => (
                <div key={p.name} onClick={() => navigate(`/product/${p.slug}`)}
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={{ height: 120, overflow: 'hidden' }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ color: C.cream, fontWeight: 800, fontSize: 12, marginBottom: 2 }}>{p.name}</p>
                    <p style={{ color: C.gold, fontWeight: 900, fontSize: 12 }}>{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — summary */}
        <div>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, position: 'sticky', top: 24 }}>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 24 }}>Order Summary</h2>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ color: C.muted, fontSize: 12, flex: 1, paddingRight: 12, lineHeight: 1.5 }}>{item.name} × {item.qty}</span>
                  <span style={{ color: C.cream, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: C.muted, fontSize: 13 }}>Subtotal</span>
                <span style={{ color: C.cream, fontWeight: 700, fontSize: 13 }}>{fmt(subtotal)}</span>
              </div>
              {couponApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#4caf50', fontSize: 13 }}>Coupon (SAVE10)</span>
                  <span style={{ color: '#4caf50', fontWeight: 700, fontSize: 13 }}>−{fmt(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: C.muted, fontSize: 13 }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#4caf50' : C.cream, fontWeight: 700, fontSize: 13 }}>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
              </div>
              {shipping > 0 && <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Free shipping over KSH 50,000</p>}
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: C.cream, fontWeight: 900, fontSize: 15 }}>Total</span>
                <span style={{ color: C.gold, fontWeight: 900, fontSize: 18 }}>{fmt(total)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code"
                  style={{ flex: 1, backgroundColor: C.bg, border: `1px solid ${couponError ? 'rgba(224,92,92,0.4)' : C.border}`, borderRadius: 8, padding: '10px 12px', color: C.cream, fontSize: 12, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = C.bHov}
                  onBlur={e => e.target.style.borderColor = couponError ? 'rgba(224,92,92,0.4)' : C.border} />
                <button onClick={applyCoupon} style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.cream, padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Apply</button>
              </div>
              {couponError && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{couponError}</p>}
              {couponApplied && <p style={{ color: '#4caf50', fontSize: 11, marginTop: 4 }}>10% discount applied!</p>}
            </div>

            <button onClick={() => navigate('/checkout')}
              style={{ width: '100%', backgroundColor: C.gold, color: '#000', border: 'none', borderRadius: 10, padding: '15px', fontWeight: 900, fontSize: 14, cursor: 'pointer', letterSpacing: '0.04em', marginBottom: 10 }}>
              Proceed to Checkout →
            </button>

            {/* Payment icons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14 }}>
              {['M-Pesa', 'Visa', 'Mastercard', 'PayPal'].map(p => (
                <span key={p} style={{ color: C.muted, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', border: `1px solid ${C.border}`, padding: '3px 7px', borderRadius: 4 }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;