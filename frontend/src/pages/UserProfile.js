import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, orderAPI } from '../services/api';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', dim: '#333333',
  gold: '#c9a84c', green: '#4ade80', blue: '#60a5fa', red: '#f87171',
};
const s = {
  eyebrow:  { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '12px 22px', borderRadius: 10, fontWeight: 900, fontSize: 12, border: 'none', cursor: 'pointer', letterSpacing: '0.04em', width: '100%', textAlign: 'center', boxSizing: 'border-box' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '12px 22px', borderRadius: 10, fontWeight: 900, fontSize: 12, border: `1px solid ${C.border}`, cursor: 'pointer', letterSpacing: '0.04em', width: '100%', textAlign: 'center', boxSizing: 'border-box' },
  input:    { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
  label:    { color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 7 },
  card:     { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 },
};

const fmt = (n) => `KSH ${Number(n).toLocaleString()}`;

const STATUS_COLOR = {
  pending:    C.gold,
  confirmed:  C.blue,
  processing: C.gold,
  shipped:    C.blue,
  delivered:  C.green,
  cancelled:  C.red,
};

const getInitials = (name = '') =>
  name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

const checkStrength = (pw) => {
  const rules = [
    { pass: pw.length >= 8 },
    { pass: /[A-Z]/.test(pw) },
    { pass: /[a-z]/.test(pw) },
    { pass: /[0-9]/.test(pw) },
    { pass: /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];
  return { score: rules.filter(r => r.pass).length };
};
const strengthMeta = (score) => {
  if (score <= 1) return { bar: C.red };
  if (score === 2) return { bar: '#f97316' };
  if (score === 3) return { bar: C.gold };
  if (score === 4) return { bar: C.blue };
  return { bar: C.green };
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
    <div style={{ ...s.card, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, updateUser } = useAuth();

  const [editOpen, setEditOpen]       = useState(false);
  const [editSection, setEditSection] = useState('contact');
  const [editForm, setEditForm]       = useState({});
  const [editSaved, setEditSaved]     = useState(false);
  const [editError, setEditError]     = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [pwForm, setPwForm]     = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw]     = useState({ current: false, new: false, confirm: false });
  const [pwError, setPwError]   = useState('');
  const [pwSaved, setPwSaved]   = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('personal');

  // ✅ Real orders from API
  const [orders, setOrders]         = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const newPwStr  = checkStrength(pwForm.newPw);
  const newPwMeta = strengthMeta(newPwStr.score);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && isLoggedIn) {
      setOrdersLoading(true);
      orderAPI.getMyOrders()
        .then(({ data }) => setOrders(data.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, isLoggedIn]);

  if (!isLoggedIn || !user) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>You need to be logged in to view your profile.</p>
          <Link to="/login" style={{ ...s.btnGold, display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '12px 28px' }}>Sign In →</Link>
        </div>
      </div>
    );
  }

  const initials  = getInitials(user.name);
  const userBadge = user.role === 'vendor' ? 'Vendor' : user.role === 'admin' ? 'Admin' : 'Buyer';
  const since     = user.createdAt
    ? `Since ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Member';

  const savedDesigns = user.savedDesigns || [];
  const wishlist     = user.wishlist     || [];

  const openEdit = () => {
    setEditForm({
      name:    user.name             || '',
      email:   user.email            || '',
      phone:   user.phone            || '',
      street:  user.address?.street  || '',
      city:    user.address?.city    || '',
      country: user.address?.country || '',
    });
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwError(''); setPwSaved(false); setEditSaved(false); setEditError('');
    setEditSection('contact'); setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editForm.name.trim()) { setEditError('Name is required.'); return; }
    setEditError('');
    setEditLoading(true);
    try {
      const payload = {
        name:    editForm.name.trim(),
        phone:   editForm.phone.trim(),
        address: { street: editForm.street.trim(), city: editForm.city.trim(), country: editForm.country },
      };
      await authAPI.updateProfile(payload);
      updateUser(payload);
      setEditSaved(true);
      setTimeout(() => { setEditSaved(false); setEditOpen(false); }, 1500);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const savePassword = async () => {
    setPwError('');
    if (!pwForm.current)                 { setPwError('Enter your current password.'); return; }
    if (newPwStr.score < 3)              { setPwError('New password is too weak.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    setPwLoading(true);
    try {
      await authAPI.updateProfile({ currentPassword: pwForm.current, newPassword: pwForm.newPw });
      setPwSaved(true);
      setTimeout(() => { setPwSaved(false); setPwForm({ current: '', newPw: '', confirm: '' }); }, 2000);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const profileTabs = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'orders',   label: `Orders${orders.length > 0 ? ` (${orders.length})` : ''}` },
    { key: 'designs',  label: 'Saved Designs' },
    { key: 'wishlist', label: 'Wishlist' },
  ];

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        57 Arts & Customs · Your Profile · Nairobi, Kenya
      </div>

      {editOpen && (
        <Modal title="Edit Profile" onClose={() => setEditOpen(false)}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 22 }}>
            {[['contact','Contact'], ['address','Address'], ['password','Password']].map(([key, label]) => (
              <button key={key} onClick={() => setEditSection(key)}
                style={{ flex: 1, padding: '10px', fontWeight: 900, fontSize: 11, textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: `2px solid ${editSection === key ? C.gold : 'transparent'}`, color: editSection === key ? C.gold : C.muted, cursor: 'pointer', marginBottom: -1 }}>
                {label}
              </button>
            ))}
          </div>

          {editSection === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {editError && <div style={{ backgroundColor: 'rgba(248,113,113,0.1)', border: `1px solid rgba(248,113,113,0.4)`, color: C.red, fontSize: 12, padding: '10px 14px', borderRadius: 9 }}>{editError}</div>}
              {[['Full Name', 'name', 'text', ''], ['Phone Number', 'phone', 'text', '+254 7XX XXX XXX']].map(([label, field, type, ph]) => (
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <input type={type} value={editForm[field] || ''} onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} placeholder={ph} style={s.input}
                    onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              ))}
              <div>
                <label style={s.label}>Email Address</label>
                <input type="email" value={editForm.email || ''} readOnly style={{ ...s.input, opacity: 0.5, cursor: 'not-allowed' }} />
                <p style={{ color: C.muted, fontSize: 10, marginTop: 5 }}>Email cannot be changed here.</p>
              </div>
              <button onClick={saveEdit} disabled={editLoading} style={{ ...s.btnGold, marginTop: 4, opacity: editLoading ? 0.6 : 1 }}>
                {editLoading ? 'Saving…' : editSaved ? '✓ Saved!' : 'Save Contact Details'}
              </button>
            </div>
          )}

          {editSection === 'address' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {editError && <div style={{ backgroundColor: 'rgba(248,113,113,0.1)', border: `1px solid rgba(248,113,113,0.4)`, color: C.red, fontSize: 12, padding: '10px 14px', borderRadius: 9 }}>{editError}</div>}
              {[['Street Address', 'street', '123 Artisan Way'], ['City & Postcode', 'city', 'Nairobi, 00100']].map(([label, field, ph]) => (
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <input type="text" value={editForm[field] || ''} onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} placeholder={ph} style={s.input}
                    onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              ))}
              <div>
                <label style={s.label}>Country</label>
                <select value={editForm.country || ''} onChange={e => setEditForm({ ...editForm, country: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select country...</option>
                  {['Kenya','Nigeria','Ghana','South Africa','Uganda','Tanzania','United Kingdom','United States','Canada'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={saveEdit} disabled={editLoading} style={{ ...s.btnGold, marginTop: 4, opacity: editLoading ? 0.6 : 1 }}>
                {editLoading ? 'Saving…' : editSaved ? '✓ Saved!' : 'Save Address'}
              </button>
            </div>
          )}

          {editSection === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {pwError && <div style={{ backgroundColor: 'rgba(248,113,113,0.1)', border: `1px solid rgba(248,113,113,0.4)`, color: C.red, fontSize: 12, padding: '10px 14px', borderRadius: 9 }}>{pwError}</div>}
              {[['Current Password', 'current'], ['New Password', 'newPw'], ['Confirm New Password', 'confirm']].map(([label, field]) => (
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw[field === 'newPw' ? 'new' : field] ? 'text' : 'password'} value={pwForm[field]}
                      onChange={e => { setPwForm({ ...pwForm, [field]: e.target.value }); setPwError(''); }}
                      placeholder="••••••••••" style={{ ...s.input, paddingRight: 60 }}
                      onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, [field === 'newPw' ? 'new' : field]: !p[field === 'newPw' ? 'new' : field] }))}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, fontSize: 10, fontWeight: 900, cursor: 'pointer' }}>
                      {showPw[field === 'newPw' ? 'new' : field] ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  {field === 'newPw' && pwForm.newPw && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 3 }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, backgroundColor: i <= newPwStr.score ? newPwMeta.bar : C.border }} />)}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={savePassword} disabled={pwLoading} style={{ ...s.btnGold, marginTop: 4, opacity: pwLoading ? 0.6 : 1 }}>
                {pwLoading ? 'Updating…' : pwSaved ? '✓ Updated!' : 'Update Password'}
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* HEADER */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/" style={{ color: C.muted, fontSize: 11, fontWeight: 900, textDecoration: 'none' }}>← Home</Link>
            <span style={{ color: C.border }}>|</span>
            <span style={{ color: C.gold, fontSize: 11 }}>My Profile</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/shop" style={{ color: C.muted, fontSize: 11, fontWeight: 900, textDecoration: 'none' }}>Browse Shop</Link>
            <button onClick={handleLogout} style={{ ...s.btnGhost, width: 'auto', padding: '7px 16px', fontSize: 11 }}>Sign Out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px 80px' }}>

        {/* Profile card */}
        <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ height: 3, backgroundColor: C.gold }} />
          <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 14, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#000', flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 22 }}>{user.name}</h1>
                  <span style={{ backgroundColor: C.gold, color: '#000', fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.08em' }}>{userBadge}</span>
                </div>
                <p style={{ color: C.muted, fontSize: 12 }}>{user.email} · {since}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {[['Orders', orders.length], ['Designs', 0], ['Wishlist', 0], ['Drafts', 0]].map(([label, val]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{val}</p>
                  <p style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{label}</p>
                </div>
              ))}
            </div>
            <button onClick={openEdit} style={{ ...s.btnGhost, width: 'auto', padding: '10px 20px', fontSize: 11 }}>Edit Profile</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 28 }}>
          {profileTabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: '12px 20px', fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.key ? C.gold : 'transparent'}`, color: activeTab === tab.key ? C.gold : C.muted, cursor: 'pointer', marginBottom: -1 }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { title: 'Contact Details', items: [['Full Name', user.name], ['Email Address', user.email], ['Phone', user.phone || '—']] },
              { title: 'Shipping Address', items: [['Street', user.address?.street || '—'], ['City', user.address?.city || '—'], ['Country', user.address?.country || '—']] },
            ].map(section => (
              <div key={section.title} style={{ ...s.card, padding: 24 }}>
                <p style={s.eyebrow}>{section.title}</p>
                {section.items.map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                    <span style={{ color: C.cream, fontWeight: 900, fontSize: 12, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                  </div>
                ))}
                <button onClick={openEdit} style={{ ...s.btnGhost, marginTop: 16, fontSize: 11, padding: '9px' }}>Edit →</button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ REAL Orders Tab */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ordersLoading ? (
              <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
                <p style={{ color: C.muted, fontSize: 13 }}>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ ...s.card, padding: 48, textAlign: 'center', border: `2px dashed ${C.border}` }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>◻</p>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 8 }}>No orders yet</p>
                <p style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>Start shopping to see your orders here.</p>
                <Link to="/shop" style={{ ...s.btnGold, display: 'inline-block', width: 'auto', padding: '11px 22px', textDecoration: 'none' }}>Browse Shop →</Link>
              </div>
            ) : orders.map(order => (
              <div key={order._id} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
                {order.items?.[0]?.image && (
                  <img src={order.items[0].image} alt={order.items[0].name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 14, marginBottom: 3 }}>
                    {order.items?.[0]?.name}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}
                  </p>
                  <p style={{ color: C.muted, fontSize: 12 }}>#{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{fmt(order.totalPrice)}</p>
                <span style={{ color: STATUS_COLOR[order.orderStatus] || C.muted, fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 100, border: `1px solid ${STATUS_COLOR[order.orderStatus] || C.border}`, textTransform: 'uppercase' }}>
                  {order.orderStatus}
                </span>
                <Link to={`/order-tracking/${order._id}`} style={{ ...s.btnGhost, width: 'auto', padding: '7px 14px', fontSize: 10, textDecoration: 'none' }}>
                  Track →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Saved Designs */}
        {activeTab === 'designs' && (
          <div style={{ ...s.card, padding: 40, textAlign: 'center', border: `2px dashed ${C.border}` }}>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>No saved designs yet.</p>
            <Link to="/custom-order" style={{ ...s.btnGold, display: 'inline-block', width: 'auto', padding: '10px 20px', textDecoration: 'none' }}>Start a Design →</Link>
          </div>
        )}

        {/* Wishlist */}
        {activeTab === 'wishlist' && (
          <div style={{ ...s.card, padding: 40, textAlign: 'center', border: `2px dashed ${C.border}` }}>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>Your wishlist is empty.</p>
            <Link to="/shop" style={{ ...s.btnGold, display: 'inline-block', width: 'auto', padding: '10px 20px', textDecoration: 'none' }}>Browse Shop →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;