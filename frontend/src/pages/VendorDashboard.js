import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vendorAPI, orderAPI, productAPI } from '../services/api';

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

const navItems = [
  { key: 'overview',  label: 'Overview',        icon: '▦' },
  { key: 'products',  label: 'My Products',     icon: '◈' },
  { key: 'orders',    label: 'Orders',          icon: '◎' },
  { key: 'analytics', label: 'Analytics',       icon: '↗' },
  { key: 'settings',  label: 'Shop Settings',   icon: '⚙' },
];

const statusStyle = {
  active:       { label: 'Active',       color: C.green,  bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)'  },
  out_of_stock: { label: 'Out of Stock', color: C.red,    bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
  draft:        { label: 'Draft',        color: C.muted,  bg: C.faint,                 border: C.border                },
  pending:      { label: 'Pending',      color: C.gold,   bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.3)'  },
  processing:   { label: 'Processing',   color: C.purple, bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
  shipped:      { label: 'Shipped',      color: C.blue,   bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)'  },
  delivered:    { label: 'Delivered',    color: C.green,  bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)'  },
  cancelled:    { label: 'Cancelled',    color: C.red,    bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
  paid:         { label: 'Paid',         color: C.green,  bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)'  },
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
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
    <div style={{ ...s.card, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
    <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activePage, setActivePage]   = useState('overview');
  const [vendor, setVendor]           = useState(null);
  const [stats, setStats]             = useState(null);
  const [products, setProducts]       = useState([]);
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct]     = useState(null);
  const [productForm, setProductForm]           = useState({ name: '', category: 'furniture', price: '', stock: '', description: '', status: 'active' });
  const [saving, setSaving]                     = useState(false);
  const [deleteConfirm, setDeleteConfirm]       = useState(null);

  // Settings
  const [shopSettings, setShopSettings]   = useState({ storeName: '', storeDescription: '', category: 'furniture' });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingSaving, setSettingSaving] = useState(false);

  // ── Load all data ─────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes, ordersRes] = await Promise.all([
        vendorAPI.getProfile(),
        vendorAPI.getStats(),
        orderAPI.getVendorOrders(),
      ]);
      const v = profileRes.data.vendor;
      setVendor(v);
      setStats(statsRes.data.stats);
      setOrders(ordersRes.data || []);
      setShopSettings({ storeName: v.storeName || '', storeDescription: v.storeDescription || '', category: v.category || 'furniture' });

      // load products by vendor
      const prodRes = await productAPI.getAll({ vendor: v._id });
      setProducts(prodRes.data?.products || prodRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Product CRUD ──────────────────────────────────────────────────────────
  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'furniture', price: '', stock: '', description: '', status: 'active' });
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, category: p.category, price: p.price?.toString(), stock: p.stock?.toString(), description: p.description || '', status: p.status || 'active' });
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    if (!productForm.name.trim() || !productForm.price) return;
    setSaving(true);
    try {
      const payload = { name: productForm.name, category: productForm.category, price: Number(productForm.price), stock: Number(productForm.stock), description: productForm.description, status: productForm.status };
      if (editingProduct) {
        await productAPI.update(editingProduct._id, payload);
      } else {
        await productAPI.add(payload);
      }
      setShowProductModal(false);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productAPI.remove(id);
      setDeleteConfirm(null);
      loadAll();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // ── Order status update ───────────────────────────────────────────────────
  const updateOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      loadAll();
    } catch (err) {
      alert('Failed to update order');
    }
  };

  // ── Save settings ─────────────────────────────────────────────────────────
  const saveSettings = async () => {
    setSettingSaving(true);
    try {
      await vendorAPI.updateProfile(shopSettings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
      loadAll();
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSettingSaving(false);
    }
  };

  // ── Revenue chart data from orders ────────────────────────────────────────
  const chartData = (() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const map = {};
    orders.filter(o => o.paymentStatus === 'paid').forEach(o => {
      const m = new Date(o.createdAt).getMonth();
      map[m] = (map[m] || 0) + (o.totalPrice || 0);
    });
    return Object.entries(map).map(([m, total]) => ({ month: months[m], total }));
  })();
  const maxRev = Math.max(...chartData.map(d => d.total), 1);

  // ── Guard: vendor not registered ─────────────────────────────────────────
  if (!loading && error) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: C.red, fontSize: 14, marginBottom: 16 }}>{error}</p>
          <Link to="/vendor" style={s.btnGold}>Register as Vendor →</Link>
        </div>
      </div>
    );
  }

  const ORDER_FLOW = ['pending', 'processing', 'shipped', 'delivered'];

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex' }}>

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside style={{ width: 220, backgroundColor: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>VENDOR HUB</span>
          </Link>
          <Link to="/" style={{ color: C.muted, fontSize: 11, textDecoration: 'none', display: 'block', marginBottom: 20 }}>← Back to Home</Link>
        </div>

        {/* Vendor info */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{user?.name}</p>
              <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, textTransform: 'capitalize' }}>{vendor?.category || 'Vendor'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActivePage(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 9, marginBottom: 2, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', backgroundColor: activePage === item.key ? C.faint : 'transparent' }}>
              <span style={{ color: activePage === item.key ? C.gold : C.muted, fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ color: activePage === item.key ? C.cream : C.muted, fontWeight: 900, fontSize: 12 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => logout(navigate)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 9, background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ color: C.red, fontSize: 12, fontWeight: 900 }}>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>

        {/* MODALS */}
        {showProductModal && (
          <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setShowProductModal(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={s.label}>Product Name</label>
                <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Handcrafted Teak Chair" style={s.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={s.label}>Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                    <option value="fashion">Fashion</option>
                    <option value="furniture">Furniture</option>
                    <option value="antiques">Antiques</option>
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
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="5000" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Stock Qty</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="10" style={s.input} />
                </div>
              </div>
              <div>
                <label style={s.label}>Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3} style={{ ...s.input, resize: 'none', lineHeight: 1.6 }} />
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <button onClick={() => setShowProductModal(false)} style={{ ...s.btnGhost, flex: 1, textAlign: 'center' }}>Cancel</button>
                <button onClick={saveProduct} disabled={saving} style={{ ...s.btnGold, flex: 1, textAlign: 'center' }}>
                  {saving ? 'Saving…' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {deleteConfirm && (
          <Modal title="Delete Product" onClose={() => setDeleteConfirm(null)}>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>
              Delete <span style={{ color: C.cream, fontWeight: 900 }}>{deleteConfirm.name}</span>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...s.btnGhost, flex: 1, textAlign: 'center' }}>Cancel</button>
              <button onClick={() => deleteProduct(deleteConfirm._id)} style={{ ...s.btnRed, flex: 1, textAlign: 'center' }}>Delete</button>
            </div>
          </Modal>
        )}

        {loading && <Spinner />}

        {!loading && (
          <>
            {/* ── OVERVIEW ───────────────────────────────────────────────── */}
            {activePage === 'overview' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                  <div>
                    <p style={s.eyebrow}>Vendor Hub</p>
                    <h1 style={{ color: C.cream, fontSize: 28, fontWeight: 900, textTransform: 'uppercase' }}>
                      Welcome back, {user?.name?.split(' ')[0]}
                    </h1>
                    <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{vendor?.storeName}</p>
                  </div>
                  <button onClick={openNewProduct} style={s.btnGold}>+ Add Product</button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                  {[
                    ['Total Revenue',  `KES ${(stats?.totalRevenue || 0).toLocaleString()}`, C.gold],
                    ['Total Orders',    stats?.totalOrders || 0,   C.cream],
                    ['Total Products',  stats?.totalProducts || 0, C.cream],
                    ['Pending Orders',  stats?.pendingOrders || 0, C.gold],
                  ].map(([label, value, color]) => (
                    <div key={label} style={{ ...s.card, padding: 20 }}>
                      <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
                      <p style={{ color, fontWeight: 900, fontSize: 22 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue chart */}
                <div style={{ ...s.card, padding: 24, marginBottom: 20 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>Revenue — by Month</p>
                  {chartData.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
                      {chartData.map(d => (
                        <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: C.gold, fontSize: 9, fontWeight: 900 }}>KES {(d.total / 1000).toFixed(0)}k</span>
                          <div style={{ width: '100%', borderRadius: '4px 4px 0 0', backgroundColor: C.gold, opacity: 0.75, height: `${(d.total / maxRev) * 100}%`, minHeight: 4 }} />
                          <span style={{ color: C.dim, fontSize: 10 }}>{d.month}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: C.muted, fontSize: 12 }}>No revenue data yet. Start selling to see your chart!</p>
                  )}
                </div>

                {/* Recent orders */}
                <div style={{ ...s.card, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>Recent Orders</p>
                    <button onClick={() => setActivePage('orders')} style={{ ...s.btnGhost, padding: '6px 14px', fontSize: 10 }}>View All →</button>
                  </div>
                  {orders.length === 0
                    ? <p style={{ color: C.muted, fontSize: 12, padding: 20 }}>No orders yet.</p>
                    : orders.slice(0, 3).map((o, i) => (
                      <div key={o._id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                        <div>
                          <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{o.orderNumber}</p>
                          <p style={{ color: C.muted, fontSize: 11 }}>{o.user?.name || 'Customer'}</p>
                        </div>
                        <p style={{ color: C.muted, fontSize: 12 }}>{o.items?.[0]?.name || '—'}</p>
                        <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>KES {o.totalPrice?.toLocaleString()}</p>
                        <Badge status={o.orderStatus} />
                        <button
                          onClick={() => { const idx = ORDER_FLOW.indexOf(o.orderStatus); if (idx < ORDER_FLOW.length - 1) updateOrderStatus(o._id, ORDER_FLOW[idx + 1]); }}
                          disabled={o.orderStatus === 'delivered'}
                          style={{ ...s.btnGhost, padding: '6px 12px', fontSize: 10, opacity: o.orderStatus === 'delivered' ? 0.4 : 1, cursor: o.orderStatus === 'delivered' ? 'not-allowed' : 'pointer' }}>
                          {o.orderStatus === 'delivered' ? '✓ Done' : 'Advance →'}
                        </button>
                      </div>
                    ))
                  }
                </div>
              </>
            )}

            {/* ── PRODUCTS ───────────────────────────────────────────────── */}
            {activePage === 'products' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div><p style={s.eyebrow}>Inventory</p><h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>My Products</h1></div>
                  <button onClick={openNewProduct} style={s.btnGold}>+ Add New Product</button>
                </div>
                {products.length === 0
                  ? <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
                      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>You haven't added any products yet.</p>
                      <button onClick={openNewProduct} style={s.btnGold}>+ Add Your First Product</button>
                    </div>
                  : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {products.map(p => (
                        <div key={p._id} style={{ ...s.card, display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 16, alignItems: 'center', padding: '16px 20px' }}>
                          <div>
                            <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 3 }}>{p.name}</p>
                            <p style={{ color: C.muted, fontSize: 11, textTransform: 'capitalize' }}>{p.category} · Stock: {p.stock ?? '—'}</p>
                          </div>
                          <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>KES {p.price?.toLocaleString()}</p>
                          <Badge status={p.stock === 0 ? 'out_of_stock' : p.status || 'active'} />
                          <button onClick={() => openEditProduct(p)} style={{ ...s.btnGhost, padding: '7px 14px', fontSize: 10 }}>Edit</button>
                          <button onClick={() => setDeleteConfirm(p)} style={{ ...s.btnRed, padding: '7px 14px', fontSize: 10 }}>Delete</button>
                        </div>
                      ))}
                    </div>
                  )
                }
              </>
            )}

            {/* ── ORDERS ─────────────────────────────────────────────────── */}
            {activePage === 'orders' && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <p style={s.eyebrow}>Fulfillment</p>
                  <h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Orders</h1>
                </div>
                {orders.length === 0
                  ? <p style={{ color: C.muted, fontSize: 13 }}>No orders yet.</p>
                  : (
                    <div style={{ ...s.card, overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
                        {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Action'].map(h => (
                          <p key={h} style={{ color: C.dim, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</p>
                        ))}
                      </div>
                      {orders.map((o, i) => (
                        <div key={o._id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center', padding: '16px 20px', borderBottom: i < orders.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                          <div>
                            <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{o.orderNumber}</p>
                            <p style={{ color: C.dim, fontSize: 10 }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                          </div>
                          <p style={{ color: C.muted, fontSize: 12 }}>{o.user?.name || '—'}</p>
                          <p style={{ color: C.cream, fontSize: 12 }}>{o.items?.length} item(s)</p>
                          <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>KES {o.totalPrice?.toLocaleString()}</p>
                          <Badge status={o.orderStatus} />
                          <select value={o.orderStatus} onChange={e => updateOrderStatus(o._id, e.target.value)}
                            style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.cream, fontSize: 11, padding: '6px 8px', borderRadius: 7, cursor: 'pointer', outline: 'none' }}>
                            {ORDER_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  )
                }
              </>
            )}

            {/* ── ANALYTICS ──────────────────────────────────────────────── */}
            {activePage === 'analytics' && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <p style={s.eyebrow}>Performance</p>
                  <h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Analytics</h1>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
                  {[
                    ['Total Revenue',   `KES ${(stats?.totalRevenue || 0).toLocaleString()}`, C.gold],
                    ['Total Orders',     stats?.totalOrders || 0,  C.cream],
                    ['Total Products',   stats?.totalProducts || 0, C.cream],
                  ].map(([l, v, color]) => (
                    <div key={l} style={{ ...s.card, padding: 20 }}>
                      <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{l}</p>
                      <p style={{ color, fontWeight: 900, fontSize: 26 }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ ...s.card, padding: 24 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', marginBottom: 20 }}>Revenue Trend</p>
                  {chartData.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
                      {chartData.map(d => (
                        <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: C.gold, fontSize: 9, fontWeight: 900 }}>KES {(d.total / 1000).toFixed(0)}k</span>
                          <div style={{ width: '100%', borderRadius: '4px 4px 0 0', backgroundColor: C.gold, opacity: 0.65, height: `${(d.total / maxRev) * 100}%`, minHeight: 4 }} />
                          <span style={{ color: C.dim, fontSize: 10 }}>{d.month}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: C.muted, fontSize: 12 }}>No paid orders yet to show revenue trend.</p>
                  )}
                </div>
              </>
            )}

            {/* ── SETTINGS ───────────────────────────────────────────────── */}
            {activePage === 'settings' && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <p style={s.eyebrow}>Configuration</p>
                  <h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Shop Settings</h1>
                </div>
                <div style={{ ...s.card, overflow: 'hidden', maxWidth: 600 }}>
                  <div style={{ height: 3, backgroundColor: C.gold }} />
                  <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={s.label}>Store Name</label>
                      <input value={shopSettings.storeName} onChange={e => setShopSettings({ ...shopSettings, storeName: e.target.value })} placeholder="Your store name" style={s.input} />
                    </div>
                    <div>
                      <label style={s.label}>Category</label>
                      <select value={shopSettings.category} onChange={e => setShopSettings({ ...shopSettings, category: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                        <option value="fashion">Fashion</option>
                        <option value="furniture">Furniture</option>
                        <option value="antiques">Antiques</option>
                      </select>
                    </div>
                    <div>
                      <label style={s.label}>Store Description</label>
                      <textarea value={shopSettings.storeDescription} onChange={e => setShopSettings({ ...shopSettings, storeDescription: e.target.value })} rows={4} style={{ ...s.input, resize: 'none', lineHeight: 1.6 }} placeholder="Tell buyers about your craft..." />
                    </div>
                    <button onClick={saveSettings} disabled={settingSaving} style={{ ...s.btnGold, padding: '13px', textAlign: 'center' }}>
                      {settingsSaved ? '✓ Settings Saved!' : settingSaving ? 'Saving…' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;