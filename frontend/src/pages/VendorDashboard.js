import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vendorAPI, orderAPI, productAPI } from '../services/api';

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
  { key: 'overview',  label: 'Overview',      icon: '▦' },
  { key: 'products',  label: 'My Products',   icon: '◈' },
  { key: 'orders',    label: 'Orders',        icon: '◎' },
  { key: 'analytics', label: 'Analytics',     icon: '↗' },
  { key: 'settings',  label: 'Shop Settings', icon: '⚙' },
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
    <div style={{ ...s.card, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
    <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const toArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.orders))   return data.orders;
  if (Array.isArray(data.products)) return data.products;
  if (Array.isArray(data.data))     return data.data;
  return [];
};

const CATEGORIES = ['Fashion', 'Furniture', 'Beads', 'Antiques'];
const ORDER_FLOW = ['pending', 'processing', 'shipped', 'delivered'];

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState('overview');
  const [vendor,     setVendor]     = useState(null);
  const [stats,      setStats]      = useState(null);
  const [products,   setProducts]   = useState([]);
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [needsRegistration, setNeedsRegistration] = useState(false);

  const [showModal,      setShowModal]      = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm,    setProductForm]    = useState({ name: '', category: 'Fashion', price: '', stock: '', description: '', images: '', status: 'active' });
  const [saving,         setSaving]         = useState(false);
  const [deleteConfirm,  setDeleteConfirm]  = useState(null);
  const [formError,      setFormError]      = useState('');

  const [shopSettings,  setShopSettings]  = useState({ storeName: '', storeDescription: '', category: 'fashion' });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingSaving, setSettingSaving] = useState(false);

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    setNeedsRegistration(false);
    try {
      const profileRes = await vendorAPI.getProfile();
      const v = profileRes.data?.vendor || profileRes.data;
      setVendor(v);
      setShopSettings({
        storeName:        v?.storeName        || '',
        storeDescription: v?.storeDescription || '',
        category:         v?.category         || 'fashion',
      });

      // ✅ If pending approval, stop here — don't load stats/orders/products
      if (!v?.isApproved && v?.status === 'pending') {
        setLoading(false);
        return;
      }

      const [statsRes, ordersRes] = await Promise.all([
        vendorAPI.getStats(),
        orderAPI.getVendorOrders(),
      ]);

      setStats(statsRes.data?.stats || statsRes.data);
      setOrders(toArray(ordersRes.data));

      if (v?._id) {
        const prodRes = await productAPI.getAll({ vendor: v._id });
        setProducts(toArray(prodRes.data));
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsRegistration(true);
        setVendor(null);
        setStats(null);
        setProducts([]);
        setOrders([]);
        setError(err.response?.data?.message || 'Vendor profile not found');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Product CRUD ──────────────────────────────────────────────────────────
  const openNew = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Fashion', price: '', stock: '', description: '', images: '', status: 'active' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setProductForm({
      name:        p.name        || '',
      category:    p.category    || 'Fashion',
      price:       p.price?.toString() || '',
      stock:       p.stock?.toString() || '',
      description: p.description || '',
      images:      (p.images || []).join(', '),
      status:      p.status      || 'active',
    });
    setFormError('');
    setShowModal(true);
  };

  const saveProduct = async () => {
    if (!productForm.name.trim())        { setFormError('Product name is required'); return; }
    if (!productForm.price)              { setFormError('Price is required'); return; }
    if (!productForm.description.trim()) { setFormError('Description is required'); return; }
    setSaving(true); setFormError('');
    try {
      const imageArr = productForm.images
        ? productForm.images.split(',').map(u => u.trim()).filter(Boolean)
        : [];
      const payload = {
        name:        productForm.name.trim(),
        category:    productForm.category,
        price:       Number(productForm.price),
        stock:       Number(productForm.stock) || 0,
        description: productForm.description,
        images:      imageArr,
        inStock:     productForm.status !== 'out_of_stock' && Number(productForm.stock) > 0,
        status:      productForm.status,
      };
      if (editingProduct) {
        await productAPI.update(editingProduct._id, payload);
      } else {
        await productAPI.add(payload);
      }
      setShowModal(false);
      loadAll();
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productAPI.remove(id);
      setDeleteConfirm(null);
      loadAll();
    } catch { alert('Failed to delete product'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
    } catch { alert('Failed to update order status'); }
  };

  const saveSettings = async () => {
    setSettingSaving(true);
    try {
      await vendorAPI.updateProfile(shopSettings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
      loadAll();
    } catch { alert('Failed to save settings'); }
    finally { setSettingSaving(false); }
  };

  const chartData = (() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const map = {};
    orders.filter(o => o.paymentStatus === 'paid').forEach(o => {
      const m = new Date(o.createdAt).getMonth();
      map[m] = (map[m] || 0) + (o.totalPrice || 0);
    });
    return Object.entries(map).map(([m, total]) => ({ month: months[Number(m)], total }));
  })();
  const maxRev = Math.max(...chartData.map(d => d.total), 1);

  // ── Guards ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  // ✅ Pending approval screen — shown after registration, before admin approves
  if (vendor && !vendor.isApproved && vendor.status === 'pending') {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40, maxWidth: 480 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⏳</div>
          <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 22, marginBottom: 10 }}>
            Application Under Review
          </h2>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 6, lineHeight: 1.8 }}>
            Your vendor application for{' '}
            <span style={{ color: C.gold, fontWeight: 900 }}>{vendor.storeName}</span>{' '}
            has been submitted successfully.
          </p>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 28, lineHeight: 1.8 }}>
            An admin will review and approve your account shortly. You'll have full access to your vendor dashboard once approved.
          </p>
          <div style={{
            backgroundColor: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 12, padding: '16px 24px', marginBottom: 28,
          }}>
            <p style={{ color: C.gold, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
              Status
            </p>
            <p style={{ color: C.cream, fontSize: 13, fontWeight: 700 }}>Pending Admin Approval</p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/" style={{ ...s.btnGold, textDecoration: 'none', display: 'inline-block' }}>
              Back to Shop
            </Link>
            <button onClick={loadAll} style={s.btnGhost}>
              Check Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Not registered yet
  if (needsRegistration) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40, maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
          <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Vendor Profile Not Found</h2>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>{error}</p>
          <Link to="/vendor" style={{ ...s.btnGold, textDecoration: 'none', display: 'inline-block' }}>
            Register as Vendor →
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Generic error
  if (error) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40, maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Dashboard Unavailable</h2>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>{error}</p>
          <button onClick={loadAll} style={s.btnGold}>Try Again</button>
        </div>
      </div>
    );
  }

  // ── Main dashboard (approved vendors only) ────────────────────────────────
  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex' }}>

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside style={{ width: 224, backgroundColor: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>VENDOR HUB</span>
          </Link>
          <Link to="/" style={{ color: C.muted, fontSize: 11, textDecoration: 'none', display: 'block', marginBottom: 20 }}>← Back to Shop</Link>
        </div>

        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: `linear-gradient(135deg, ${C.gold}, #a07830)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor?.storeName || user?.name}</p>
              <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, textTransform: 'capitalize' }}>{vendor?.category || 'Vendor'}</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActivePage(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 9, marginBottom: 2, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', backgroundColor: activePage === item.key ? C.faint : 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (activePage !== item.key) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (activePage !== item.key) e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <span style={{ color: activePage === item.key ? C.gold : C.muted, fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ color: activePage === item.key ? C.cream : C.muted, fontWeight: 900, fontSize: 12 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '10px 14px', margin: '0 10px 10px', backgroundColor: 'rgba(201,168,76,0.06)', border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 9 }}>
          <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, marginBottom: 3 }}>✦ You can shop too!</p>
          <p style={{ color: C.muted, fontSize: 10, lineHeight: 1.5 }}>As a vendor you can still browse and buy from other artisans.</p>
          <Link to="/shop" style={{ color: C.gold, fontSize: 10, fontWeight: 900, textDecoration: 'none' }}>Browse Shop →</Link>
        </div>

        <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => logout(navigate)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 9, background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ color: C.red, fontSize: 12, fontWeight: 900 }}>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>

        {showModal && (
          <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setShowModal(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={s.label}>Product Name *</label>
                <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Handcrafted Teak Chair" style={s.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={s.label}>Category *</label>
                  <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  <label style={s.label}>Price (KES) *</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="5000" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Stock Qty</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="10" style={s.input} />
                </div>
              </div>
              <div>
                <label style={s.label}>Description *</label>
                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3} style={{ ...s.input, resize: 'none', lineHeight: 1.6 }} placeholder="Describe your product..." />
              </div>
              <div>
                <label style={s.label}>Image URLs (comma separated)</label>
                <textarea value={productForm.images} onChange={e => setProductForm({ ...productForm, images: e.target.value })} rows={2} style={{ ...s.input, resize: 'none', lineHeight: 1.6 }} placeholder="https://example.com/image1.jpg, https://..." />
                <p style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>Paste image URLs separated by commas</p>
              </div>
              {formError && (
                <div style={{ backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px' }}>
                  <p style={{ color: C.red, fontSize: 12 }}>{formError}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button onClick={() => setShowModal(false)} style={{ ...s.btnGhost, flex: 1, textAlign: 'center' }}>Cancel</button>
                <button onClick={saveProduct} disabled={saving} style={{ ...s.btnGold, flex: 1, textAlign: 'center', opacity: saving ? 0.7 : 1 }}>
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

        {/* ── OVERVIEW ─────────────────────────────────────────────── */}
        {activePage === 'overview' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <p style={s.eyebrow}>Vendor Hub</p>
                <h1 style={{ color: C.cream, fontSize: 26, fontWeight: 900, textTransform: 'uppercase' }}>
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{vendor?.storeName}</p>
              </div>
              <button onClick={openNew} style={s.btnGold}>+ Add Product</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
              {[
                ['Total Revenue',  `KES ${(stats?.totalRevenue || 0).toLocaleString()}`, C.gold],
                ['Total Orders',    stats?.totalOrders  || 0, C.cream],
                ['Total Products',  stats?.totalProducts || 0, C.cream],
                ['Pending Orders',  stats?.pendingOrders || 0, C.gold],
              ].map(([label, value, color]) => (
                <div key={label} style={{ ...s.card, padding: 20 }}>
                  <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
                  <p style={{ color, fontWeight: 900, fontSize: 22 }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ ...s.card, padding: 24, marginBottom: 20 }}>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>Revenue by Month</p>
              {chartData.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
                  {chartData.map(d => (
                    <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: C.gold, fontSize: 9, fontWeight: 900 }}>KES {(d.total/1000).toFixed(0)}k</span>
                      <div style={{ width: '100%', borderRadius: '4px 4px 0 0', backgroundColor: C.gold, opacity: 0.75, height: `${(d.total/maxRev)*100}%`, minHeight: 4 }} />
                      <span style={{ color: C.dim, fontSize: 10 }}>{d.month}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: C.muted, fontSize: 12 }}>No revenue yet — add products and start selling! 🚀</p>
                </div>
              )}
            </div>

            <div style={{ ...s.card, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>Recent Orders</p>
                <button onClick={() => setActivePage('orders')} style={{ ...s.btnGhost, padding: '6px 14px', fontSize: 10 }}>View All →</button>
              </div>
              {orders.length === 0 ? (
                <p style={{ color: C.muted, fontSize: 12, padding: 20 }}>No orders yet. Share your products to get started!</p>
              ) : orders.slice(0, 3).map((o, i) => (
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
              ))}
            </div>
          </>
        )}

        {/* ── PRODUCTS ─────────────────────────────────────────────── */}
        {activePage === 'products' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <p style={s.eyebrow}>Inventory</p>
                <h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>My Products</h1>
              </div>
              <button onClick={openNew} style={s.btnGold}>+ Add New Product</button>
            </div>
            {products.length === 0 ? (
              <div style={{ ...s.card, padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 16, marginBottom: 8 }}>No products yet</p>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Add your first product to start selling!</p>
                <button onClick={openNew} style={s.btnGold}>+ Add Your First Product</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {products.map(p => (
                  <div key={p._id} style={{ ...s.card, display: 'grid', gridTemplateColumns: '56px 1fr auto auto auto auto', gap: 16, alignItems: 'center', padding: '14px 20px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', backgroundColor: C.faint, flexShrink: 0 }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 20 }}>🖼️</div>
                      )}
                    </div>
                    <div>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 3 }}>{p.name}</p>
                      <p style={{ color: C.muted, fontSize: 11 }}>{p.category} · Stock: {p.stock ?? 0}</p>
                    </div>
                    <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>KES {p.price?.toLocaleString()}</p>
                    <Badge status={!p.inStock || p.stock === 0 ? 'out_of_stock' : p.status || 'active'} />
                    <button onClick={() => openEdit(p)} style={{ ...s.btnGhost, padding: '7px 14px', fontSize: 10 }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(p)} style={{ ...s.btnRed, padding: '7px 14px', fontSize: 10 }}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ORDERS ───────────────────────────────────────────────── */}
        {activePage === 'orders' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <p style={s.eyebrow}>Fulfillment</p>
              <h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Orders</h1>
            </div>
            {orders.length === 0 ? (
              <div style={{ ...s.card, padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 16, marginBottom: 8 }}>No orders yet</p>
                <p style={{ color: C.muted, fontSize: 13 }}>Orders will appear here when customers purchase your products.</p>
              </div>
            ) : (
              <div style={{ ...s.card, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
                  {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Action'].map(h => (
                    <p key={h} style={{ color: C.dim, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</p>
                  ))}
                </div>
                {orders.map((o, i) => (
                  <div key={o._id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center', padding: '14px 20px', borderBottom: i < orders.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{o.orderNumber}</p>
                      <p style={{ color: C.dim, fontSize: 10 }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p style={{ color: C.muted, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.user?.name || '—'}</p>
                    <p style={{ color: C.cream, fontSize: 12 }}>{o.items?.length || 0} item(s)</p>
                    <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>KES {o.totalPrice?.toLocaleString()}</p>
                    <Badge status={o.orderStatus} />
                    <select value={o.orderStatus} onChange={e => updateOrderStatus(o._id, e.target.value)}
                      style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.cream, fontSize: 11, padding: '6px 8px', borderRadius: 7, cursor: 'pointer', outline: 'none' }}>
                      {ORDER_FLOW.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ANALYTICS ────────────────────────────────────────────── */}
        {activePage === 'analytics' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <p style={s.eyebrow}>Performance</p>
              <h1 style={{ color: C.cream, fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Analytics</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
              {[
                ['Total Revenue',  `KES ${(stats?.totalRevenue || 0).toLocaleString()}`, C.gold],
                ['Total Orders',    stats?.totalOrders  || 0, C.cream],
                ['Products Listed', stats?.totalProducts || 0, C.cream],
                ['Pending Orders',  stats?.pendingOrders || 0, C.gold],
              ].map(([l, v, color]) => (
                <div key={l} style={{ ...s.card, padding: 20 }}>
                  <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{l}</p>
                  <p style={{ color, fontWeight: 900, fontSize: 24 }}>{v}</p>
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

        {/* ── SETTINGS ─────────────────────────────────────────────── */}
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
                  <label style={s.label}>Primary Category</label>
                  <select value={shopSettings.category} onChange={e => setShopSettings({ ...shopSettings, category: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                    <option value="fashion">Fashion</option>
                    <option value="furniture">Furniture</option>
                    <option value="antiques">Antiques</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Store Description</label>
                  <textarea value={shopSettings.storeDescription} onChange={e => setShopSettings({ ...shopSettings, storeDescription: e.target.value })} rows={4} style={{ ...s.input, resize: 'none', lineHeight: 1.6 }} placeholder="Tell buyers about your craft and what makes it special..." />
                </div>
                <button onClick={saveSettings} disabled={settingSaving} style={{ ...s.btnGold, padding: '13px', textAlign: 'center', opacity: settingSaving ? 0.7 : 1 }}>
                  {settingsSaved ? '✓ Settings Saved!' : settingSaving ? 'Saving…' : 'Save Settings'}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;