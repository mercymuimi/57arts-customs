import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', dim: '#333333',
  gold: '#c9a84c', green: '#4ade80', blue: '#60a5fa', red: '#f87171', purple: '#c084fc',
};
const s = {
  eyebrow:  { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '9px 18px', borderRadius: 9, fontWeight: 900, fontSize: 11, border: 'none', cursor: 'pointer', letterSpacing: '0.04em' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '9px 18px', borderRadius: 9, fontWeight: 900, fontSize: 11, border: `1px solid ${C.border}`, cursor: 'pointer', letterSpacing: '0.04em' },
  btnRed:   { backgroundColor: 'transparent', color: C.red, padding: '9px 18px', borderRadius: 9, fontWeight: 900, fontSize: 11, border: `1px solid rgba(248,113,113,0.4)`, cursor: 'pointer' },
  input:    { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
  label:    { color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 },
  card:     { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 },
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const VENDOR = { name: 'Master Julian', avatar: 'MJ', shop: "Julian's Atelier", craft: 'Furniture & Woodwork', rating: 4.9, reviews: 84, since: 'Oct 2023', verified: true, tier: 'Gold Artisan', commission: 8, mpesa: '+254 712 345 678', totalSales: 'KES 284,500', totalOrders: 34, pendingPayout: 'KES 18,200', nextPayout: 'Apr 1, 2026' };
const INIT_PRODUCTS = [
  { id: 'p1', name: 'Obsidian Throne v.2',  category: 'Furniture', price: 'KES 125,000', priceNum: 125000, stock: 2, status: 'active',       views: 342, orders: 8,  img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300', description: 'Hand-carved teak throne with obsidian inlay and 24k gold leaf.', materials: ['Teak Wood', '24k Gold Leaf', 'Obsidian'] },
  { id: 'p2', name: 'Vanguard Teak Chair',  category: 'Furniture', price: 'KES 78,000',  priceNum: 78000,  stock: 5, status: 'active',       views: 218, orders: 12, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', description: 'Minimalist teak chair with ergonomic design and brass accents.', materials: ['Teak Wood', 'Recycled Brass'] },
  { id: 'p3', name: 'Magma Coffee Table',   category: 'Furniture', price: 'KES 54,000',  priceNum: 54000,  stock: 0, status: 'out_of_stock', views: 156, orders: 6,  img: 'https://images.unsplash.com/photo-1493106819501-8f9e5ce02e5d?w=300', description: 'Sculpted walnut coffee table with lava-inspired resin fill.', materials: ['Black Walnut', 'Resin'] },
  { id: 'p4', name: 'Heritage Bookshelf',   category: 'Furniture', price: 'KES 92,000',  priceNum: 92000,  stock: 1, status: 'draft',        views: 0,   orders: 0,  img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300', description: 'Floor-to-ceiling bookshelf in reclaimed oak with cast iron brackets.', materials: ['Reclaimed Oak', 'Cast Iron'] },
];
const INIT_ORDERS = [
  { id: '#ORD-9921', buyer: 'Alex Julian',  product: 'Obsidian Throne v.2',    date: 'Oct 22, 2023', amount: 'KES 125,000', status: 'delivered', type: 'standard' },
  { id: '#ORD-9856', buyer: 'Sarah K.',      product: 'Vanguard Teak Chair',    date: 'Oct 18, 2023', amount: 'KES 78,000',  status: 'shipped',   type: 'standard' },
  { id: '#ORD-9790', buyer: 'David M.',      product: 'Custom Walnut Desk',     date: 'Oct 14, 2023', amount: 'KES 210,000', status: 'crafting',  type: 'custom'   },
  { id: '#ORD-9744', buyer: 'Amara O.',      product: 'Magma Coffee Table',     date: 'Oct 10, 2023', amount: 'KES 54,000',  status: 'confirmed', type: 'standard' },
];
const INIT_CUSTOM = [
  { id: '#CR-1021', buyer: 'Fatima Al-Hassan', title: 'Custom Akan Throne Chair',      vision: 'A sculpted throne chair inspired by Akan royal seats, with hand-carved kente patterns on the backrest and solid mahogany frame. Gold leaf on the armrests.', materials: ['Solid Mahogany', '24k Gold Leaf'],    budget: 'KES 180,000', timeline: '6–8 weeks', status: 'pending', date: 'Oct 24, 2023', renderImg: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300' },
  { id: '#CR-1019', buyer: 'Kofi Mensah',       title: 'Reclaimed Wood Dining Table',  vision: 'Large 8-seater dining table in reclaimed oak with live edge design. Natural finish, no stain. Steel hairpin legs.', materials: ['Reclaimed Oak', 'Steel'], budget: 'KES 95,000', timeline: '4–6 weeks', status: 'quoted', quotedAmount: 'KES 112,000', date: 'Oct 20, 2023', renderImg: null },
];
const PAYOUTS = [
  { month: 'March 2026',    amount: 'KES 18,200', status: 'pending', method: 'M-Pesa' },
  { month: 'February 2026', amount: 'KES 24,500', status: 'paid',    method: 'M-Pesa' },
  { month: 'January 2026',  amount: 'KES 19,800', status: 'paid',    method: 'M-Pesa' },
  { month: 'December 2025', amount: 'KES 31,000', status: 'paid',    method: 'M-Pesa' },
];
const chartData = [
  { month: 'Oct', sales: 54000 }, { month: 'Nov', sales: 78000 }, { month: 'Dec', sales: 125000 },
  { month: 'Jan', sales: 92000 }, { month: 'Feb', sales: 110000 }, { month: 'Mar', sales: 125000 },
];
const maxSales = Math.max(...chartData.map(d => d.sales));

const navItems = [
  { key: 'overview',  label: 'Overview',       icon: '▦' },
  { key: 'products',  label: 'My Products',    icon: '◈' },
  { key: 'orders',    label: 'Orders',         icon: '◎' },
  { key: 'custom',    label: 'Custom Requests',icon: '✦' },
  { key: 'analytics', label: 'Analytics',      icon: '↗' },
  { key: 'payouts',   label: 'Payouts',        icon: '◈' },
  { key: 'settings',  label: 'Shop Settings',  icon: '⚙' },
];

const statusStyle = {
  active:       { label: 'Active',        color: C.green,  bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)'  },
  out_of_stock: { label: 'Out of Stock',  color: C.red,    bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
  draft:        { label: 'Draft',         color: C.muted,  bg: C.faint,                 border: C.border                },
  delivered:    { label: 'Delivered',     color: C.green,  bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)'  },
  shipped:      { label: 'Shipped',       color: C.blue,   bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)'  },
  crafting:     { label: 'Crafting',      color: C.gold,   bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.3)'  },
  confirmed:    { label: 'Confirmed',     color: C.purple, bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
  pending:      { label: 'Pending Quote', color: C.gold,   bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.3)'  },
  quoted:       { label: 'Quote Sent',    color: C.blue,   bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)'  },
  paid:         { label: 'Paid',          color: C.green,  bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)'  },
};

const Badge = ({ status }) => {
  const sc = statusStyle[status] || statusStyle.draft;
  return (
    <span style={{ color: sc.color, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.08em' }}>
      {sc.label}
    </span>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24, overflowY: 'auto' }}>
    <div style={{ ...s.card, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const VendorDashboard = () => {
  const [activePage, setActivePage]         = useState('overview');
  const [products, setProducts]             = useState(INIT_PRODUCTS);
  const [orders, setOrders]                 = useState(INIT_ORDERS);
  const [customRequests, setCustomRequests] = useState(INIT_CUSTOM);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct]     = useState(null);
  const [productForm, setProductForm]           = useState({ name: '', category: 'Furniture', price: '', stock: '', description: '', materials: '', status: 'active' });
  const [showQuoteModal, setShowQuoteModal]     = useState(false);
  const [quotingRequest, setQuotingRequest]     = useState(null);
  const [quoteForm, setQuoteForm]               = useState({ amount: '', timeline: '', notes: '' });
  const [deleteConfirm, setDeleteConfirm]       = useState(null);
  const [showPayoutModal, setShowPayoutModal]   = useState(false);
  const [payoutForm, setPayoutForm]             = useState({ method: 'M-Pesa', number: VENDOR.mpesa });
  const [payoutSaved, setPayoutSaved]           = useState(false);
  const [shopSettings, setShopSettings]         = useState({ name: VENDOR.shop, bio: 'Master craftsman with 20+ years of experience in bespoke African furniture.', phone: VENDOR.mpesa, instagram: '@juliansatelier' });
  const [settingsSaved, setSettingsSaved]       = useState(false);

  const openNewProduct = () => { setEditingProduct(null); setProductForm({ name: '', category: 'Furniture', price: '', stock: '', description: '', materials: '', status: 'active' }); setShowProductModal(true); };
  const openEditProduct = (p) => { setEditingProduct(p); setProductForm({ name: p.name, category: p.category, price: p.priceNum.toString(), stock: p.stock.toString(), description: p.description, materials: p.materials.join(', '), status: p.status }); setShowProductModal(true); };
  const saveProduct = () => {
    if (!productForm.name.trim() || !productForm.price) return;
    const updated = { name: productForm.name, category: productForm.category, price: `KES ${Number(productForm.price).toLocaleString()}`, priceNum: Number(productForm.price), stock: Number(productForm.stock), description: productForm.description, materials: productForm.materials.split(',').map(m => m.trim()), status: productForm.status };
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updated } : p));
    } else {
      setProducts(prev => [{ id: `p${Date.now()}`, views: 0, orders: 0, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', ...updated }, ...prev]);
    }
    setShowProductModal(false);
  };
  const ORDER_STATUSES = ['confirmed', 'crafting', 'shipped', 'delivered'];
  const advanceOrder = (id) => { setOrders(prev => prev.map(o => { if (o.id !== id) return o; const idx = ORDER_STATUSES.indexOf(o.status); return { ...o, status: ORDER_STATUSES[Math.min(idx + 1, ORDER_STATUSES.length - 1)] }; })); };
  const sendQuote = () => { if (!quoteForm.amount.trim()) return; setCustomRequests(prev => prev.map(r => r.id === quotingRequest.id ? { ...r, status: 'quoted', quotedAmount: `KES ${quoteForm.amount}` } : r)); setShowQuoteModal(false); };
  const saveSettings = () => { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2000); };

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, backgroundColor: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        {/* Logo + back */}
        <div style={{ padding: '20px 20px 0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>VENDOR HUB</span>
          </Link>
          <Link to="/" style={{ color: C.muted, fontSize: 11, textDecoration: 'none', display: 'block', marginBottom: 20 }}
            onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>← Back to Home</Link>
        </div>
        {/* Vendor info */}
        <div style={{ padding: '14px 20px 14px', borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000', flexShrink: 0 }}>{VENDOR.avatar}</div>
            <div>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{VENDOR.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <p style={{ color: C.gold, fontSize: 10, fontWeight: 900 }}>{VENDOR.tier}</p>
                {VENDOR.verified && <span style={{ color: C.blue, fontSize: 10 }}>✓</span>}
              </div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActivePage(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 9, marginBottom: 2, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', backgroundColor: activePage === item.key ? C.faint : 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (activePage !== item.key) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (activePage !== item.key) e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <span style={{ color: activePage === item.key ? C.gold : C.muted, fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ color: activePage === item.key ? C.cream : C.muted, fontWeight: 900, fontSize: 12 }}>{item.label}</span>
              {item.key === 'custom' && customRequests.filter(r => r.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 'auto', backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {customRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>

        {/* MODALS */}
        {showProductModal && (
          <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setShowProductModal(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={s.label}>Product Name</label>
                <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Obsidian Throne v.3" style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={s.label}>Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                    {['Furniture', 'Fashion', 'Beads & Jewelry'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Status</label>
                  <select value={productForm.status} onChange={e => setProductForm({ ...productForm, status: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Price (KES)</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="125000" style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div>
                  <label style={s.label}>Stock Qty</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="3" style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              </div>
              <div>
                <label style={s.label}>Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3} style={{ ...s.input, resize: 'none', lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div>
                <label style={s.label}>Materials (comma separated)</label>
                <input value={productForm.materials} onChange={e => setProductForm({ ...productForm, materials: e.target.value })} placeholder="Teak Wood, 24k Gold Leaf" style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <button onClick={() => setShowProductModal(false)} style={{ ...s.btnGhost, flex: 1, textAlign: 'center' }}>Cancel</button>
                <button onClick={saveProduct} style={{ ...s.btnGold, flex: 1, textAlign: 'center' }}>{editingProduct ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </div>
          </Modal>
        )}

        {showQuoteModal && quotingRequest && (
          <Modal title="Send Quote" onClose={() => setShowQuoteModal(false)}>
            <div style={{ marginBottom: 16, padding: 14, backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 4 }}>{quotingRequest.title}</p>
              <p style={{ color: C.muted, fontSize: 12 }}>by {quotingRequest.buyer} · Budget: <span style={{ color: C.gold }}>{quotingRequest.budget}</span></p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Your Quote Amount (KES)', 'amount', 'number', '112000'], ['Timeline', 'timeline', 'text', 'e.g. 6–8 weeks']].map(([label, field, type, ph]) => (
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <input type={type} value={quoteForm[field]} onChange={e => setQuoteForm({ ...quoteForm, [field]: e.target.value })} placeholder={ph} style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              ))}
              <div>
                <label style={s.label}>Notes for buyer (optional)</label>
                <textarea value={quoteForm.notes} onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })} rows={3} style={{ ...s.input, resize: 'none' }} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowQuoteModal(false)} style={{ ...s.btnGhost, flex: 1, textAlign: 'center' }}>Cancel</button>
                <button onClick={sendQuote} style={{ ...s.btnGold, flex: 1, textAlign: 'center' }}>Send Quote →</button>
              </div>
            </div>
          </Modal>
        )}

        {deleteConfirm && (
          <Modal title="Delete Product" onClose={() => setDeleteConfirm(null)}>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Are you sure you want to delete <span style={{ color: C.cream, fontWeight: 900 }}>{deleteConfirm.name}</span>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...s.btnGhost, flex: 1, textAlign: 'center' }}>Cancel</button>
              <button onClick={() => { setProducts(p => p.filter(x => x.id !== deleteConfirm.id)); setDeleteConfirm(null); }} style={{ ...s.btnRed, flex: 1, textAlign: 'center' }}>Delete Product</button>
            </div>
          </Modal>
        )}

        {showPayoutModal && (
          <Modal title="Update Payout Details" onClose={() => setShowPayoutModal(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={s.label}>Payout Method</label>
                <select value={payoutForm.method} onChange={e => setPayoutForm({ ...payoutForm, method: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  {['M-Pesa', 'Bank Transfer'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>{payoutForm.method === 'M-Pesa' ? 'Safaricom Number' : 'Bank Account'}</label>
                <input type="text" value={payoutForm.number} onChange={e => setPayoutForm({ ...payoutForm, number: e.target.value })} style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <button onClick={() => { setPayoutSaved(true); setTimeout(() => { setPayoutSaved(false); setShowPayoutModal(false); }, 1500); }}
                style={{ ...s.btnGold, padding: '13px', textAlign: 'center' }}>
                {payoutSaved ? '✓ Saved!' : 'Save Payout Details'}
              </button>
            </div>
          </Modal>
        )}

        {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
        {activePage === 'overview' && (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <p style={s.eyebrow}>Vendor Hub</p>
              <h1 style={{ color: C.cream, fontSize: 28, fontWeight: 900, textTransform: 'uppercase' }}>Welcome back, {VENDOR.name.split(' ')[0]}</h1>
            </div>
            <button onClick={openNewProduct} style={s.btnGold}>+ Add Product</button>
          </div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[['Total Sales', VENDOR.totalSales, C.gold], ['Total Orders', VENDOR.totalOrders, C.cream], ['Pending Payout', VENDOR.pendingPayout, C.green], ['Shop Rating', `${VENDOR.rating} ★`, C.gold]].map(([label, value, color]) => (
              <div key={label} style={{ ...s.card, padding: 20 }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
                <p style={{ color, fontWeight: 900, fontSize: 22 }}>{value}</p>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div style={{ ...s.card, padding: 24, marginBottom: 20 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>Revenue — Last 6 Months</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
              {chartData.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: C.gold, fontSize: 9, fontWeight: 900 }}>KES {(d.sales / 1000).toFixed(0)}k</span>
                  <div style={{ width: '100%', borderRadius: '4px 4px 0 0', backgroundColor: C.gold, opacity: 0.7, height: `${(d.sales / maxSales) * 100}%`, minHeight: 4, transition: 'height 0.5s' }} />
                  <span style={{ color: C.dim, fontSize: 10 }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Recent orders */}
          <div style={{ ...s.card, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Orders</p>
              <button onClick={() => setActivePage('orders')} style={{ ...s.btnGhost, padding: '6px 14px', fontSize: 10 }}>View All →</button>
            </div>
            {orders.slice(0, 3).map((o, i) => (
              <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <div><p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{o.id}</p><p style={{ color: C.muted, fontSize: 11 }}>{o.buyer}</p></div>
                <p style={{ color: C.muted, fontSize: 12 }}>{o.product}</p>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{o.amount}</p>
                <Badge status={o.status} />
                <button onClick={() => advanceOrder(o.id)} disabled={o.status === 'delivered'} style={{ ...s.btnGhost, padding: '6px 12px', fontSize: 10, opacity: o.status === 'delivered' ? 0.4 : 1, cursor: o.status === 'delivered' ? 'not-allowed' : 'pointer' }}>
                  {o.status === 'delivered' ? 'Done' : 'Advance →'}
                </button>
              </div>
            ))}
          </div>
        </>)}

        {/* ── PRODUCTS ──────────────────────────────────────────────────────── */}
        {activePage === 'products' && (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div><p style={s.eyebrow}>Inventory</p><h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>My Products</h1></div>
            <button onClick={openNewProduct} style={s.btnGold}>+ Add New Product</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {products.map(p => (
              <div key={p.id} style={{ ...s.card, display: 'grid', gridTemplateColumns: '64px 1fr auto auto auto auto', gap: 16, alignItems: 'center', padding: '16px 20px' }}>
                <img src={p.img} alt={p.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                <div>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 3 }}>{p.name}</p>
                  <p style={{ color: C.muted, fontSize: 11 }}>{p.category} · Stock: {p.stock} · {p.views} views · {p.orders} orders</p>
                </div>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{p.price}</p>
                <Badge status={p.status} />
                <button onClick={() => openEditProduct(p)} style={{ ...s.btnGhost, padding: '7px 14px', fontSize: 10 }}>Edit</button>
                <button onClick={() => setDeleteConfirm(p)} style={{ ...s.btnRed, padding: '7px 14px', fontSize: 10 }}>Delete</button>
              </div>
            ))}
          </div>
        </>)}

        {/* ── ORDERS ────────────────────────────────────────────────────────── */}
        {activePage === 'orders' && (<>
          <div style={{ marginBottom: 24 }}><p style={s.eyebrow}>Fulfillment</p><h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Orders</h1></div>
          <div style={{ ...s.card, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
              {['Order', 'Buyer', 'Product', 'Amount', 'Status', ''].map(h => (
                <p key={h} style={{ color: C.dim, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</p>
              ))}
            </div>
            {orders.map((o, i) => (
              <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center', padding: '16px 20px', borderBottom: i < orders.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div><p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{o.id}</p><p style={{ color: C.dim, fontSize: 10 }}>{o.date}</p></div>
                <p style={{ color: C.muted, fontSize: 12 }}>{o.buyer}</p>
                <p style={{ color: C.cream, fontSize: 12 }}>{o.product}</p>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{o.amount}</p>
                <Badge status={o.status} />
                <button onClick={() => advanceOrder(o.id)} disabled={o.status === 'delivered'} style={{ ...s.btnGhost, padding: '6px 12px', fontSize: 10, opacity: o.status === 'delivered' ? 0.4 : 1, cursor: o.status === 'delivered' ? 'not-allowed' : 'pointer' }}>
                  {o.status === 'delivered' ? '✓ Done' : 'Advance →'}
                </button>
              </div>
            ))}
          </div>
        </>)}

        {/* ── CUSTOM REQUESTS ───────────────────────────────────────────────── */}
        {activePage === 'custom' && (<>
          <div style={{ marginBottom: 24 }}><p style={s.eyebrow}>Bespoke Commissions</p><h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Custom Requests</h1></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {customRequests.map(req => (
              <div key={req.id} style={{ ...s.card, padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 15 }}>{req.title}</p>
                      <Badge status={req.status} />
                    </div>
                    <p style={{ color: C.muted, fontSize: 12 }}>by {req.buyer} · {req.date} · Budget: <span style={{ color: C.gold, fontWeight: 900 }}>{req.budget}</span> · Timeline: {req.timeline}</p>
                  </div>
                  {req.renderImg && <img src={req.renderImg} alt="AI Render" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: `1px solid ${C.border}` }} />}
                </div>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>{req.vision}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {req.materials.map(mat => <span key={mat} style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, padding: '4px 10px', borderRadius: 8 }}>{mat}</span>)}
                </div>
                {req.status === 'quoted' && <p style={{ color: C.blue, fontWeight: 900, fontSize: 13, marginBottom: 12 }}>Quote sent: {req.quotedAmount}</p>}
                {req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => { setQuotingRequest(req); setQuoteForm({ amount: '', timeline: req.timeline, notes: '' }); setShowQuoteModal(true); }} style={s.btnGold}>Send Quote →</button>
                    <button onClick={() => setCustomRequests(p => p.filter(r => r.id !== req.id))} style={s.btnRed}>Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {/* ── ANALYTICS ─────────────────────────────────────────────────────── */}
        {activePage === 'analytics' && (<>
          <div style={{ marginBottom: 24 }}><p style={s.eyebrow}>Performance</p><h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Analytics</h1></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            {[['Total Views', '716', C.cream], ['Conversion Rate', '3.2%', C.gold], ['Avg. Order Value', 'KES 83,750', C.gold]].map(([l, v, color]) => (
              <div key={l} style={{ ...s.card, padding: 20 }}><p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{l}</p><p style={{ color, fontWeight: 900, fontSize: 26 }}>{v}</p></div>
            ))}
          </div>
          <div style={{ ...s.card, padding: 24 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', marginBottom: 20 }}>Revenue Trend</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
              {chartData.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: C.gold, fontSize: 9, fontWeight: 900 }}>KES {(d.sales / 1000).toFixed(0)}k</span>
                  <div style={{ width: '100%', borderRadius: '4px 4px 0 0', backgroundColor: C.gold, opacity: 0.65, height: `${(d.sales / maxSales) * 100}%` }} />
                  <span style={{ color: C.dim, fontSize: 10 }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ── PAYOUTS ───────────────────────────────────────────────────────── */}
        {activePage === 'payouts' && (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div><p style={s.eyebrow}>Earnings</p><h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Payouts</h1></div>
            <button onClick={() => setShowPayoutModal(true)} style={s.btnGhost}>Update Payout Details</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ height: 2, backgroundColor: C.gold, borderRadius: 2, marginBottom: 18 }} />
              <p style={s.eyebrow}>Pending Payout</p>
              <p style={{ color: C.gold, fontWeight: 900, fontSize: 36, marginBottom: 6 }}>{VENDOR.pendingPayout}</p>
              <p style={{ color: C.muted, fontSize: 12 }}>Pays out {VENDOR.nextPayout} · Commission: {VENDOR.commission}%</p>
            </div>
            <div style={{ ...s.card, padding: 22 }}>
              <p style={s.eyebrow}>Payout Settings</p>
              {[['Method', 'M-Pesa'], ['Number', VENDOR.mpesa], ['Schedule', 'Weekly'], ['Commission', `${VENDOR.commission}%`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{l}</span>
                  <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...s.card, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>Payout History</p>
            </div>
            {PAYOUTS.map((p, i) => (
              <div key={p.month} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: i < PAYOUTS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{p.month}</p>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{p.amount}</p>
                <p style={{ color: C.muted, fontSize: 12 }}>{p.method}</p>
                <Badge status={p.status} />
              </div>
            ))}
          </div>
        </>)}

        {/* ── SETTINGS ──────────────────────────────────────────────────────── */}
        {activePage === 'settings' && (<>
          <div style={{ marginBottom: 24 }}><p style={s.eyebrow}>Configuration</p><h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Shop Settings</h1></div>
          <div style={{ ...s.card, overflow: 'hidden', maxWidth: 600 }}>
            <div style={{ height: 3, backgroundColor: C.gold }} />
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['Shop Name', 'name', 'text', 'Your shop name'], ['M-Pesa Number', 'phone', 'text', '+254 7XX XXX XXX'], ['Instagram / Portfolio', 'instagram', 'text', '@yourstudio']].map(([label, field, type, ph]) => (
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <input type={type} value={shopSettings[field]} onChange={e => setShopSettings({ ...shopSettings, [field]: e.target.value })} placeholder={ph} style={s.input} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              ))}
              <div>
                <label style={s.label}>Shop Bio</label>
                <textarea value={shopSettings.bio} onChange={e => setShopSettings({ ...shopSettings, bio: e.target.value })} rows={4} style={{ ...s.input, resize: 'none', lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <button onClick={saveSettings} style={{ ...s.btnGold, padding: '13px', textAlign: 'center' }}>
                {settingsSaved ? '✓ Settings Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>
        </>)}

      </main>
    </div>
  );
};

export default VendorDashboard;