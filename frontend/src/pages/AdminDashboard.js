import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminAPI } from '../services/api';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:      '#0d0d00',
  surface: '#1a1a00',
  border:  '#2a2a00',
  hover:   '#222200',
  gold:    '#c9a84c',
  goldDim: 'rgba(201,168,76,0.15)',
  cream:   '#f0ece4',
  muted:   '#606060',
  green:   '#4caf50',
  red:     '#e05c5c',
  blue:    '#4a9eff',
  yellow:  '#f59e0b',
};

const sideLinks = [
  { id: 'Dashboard',         icon: '▦',  group: 'main' },
  { id: 'Vendors',           icon: '🏪', group: 'main' },
  { id: 'Orders',            icon: '📦', group: 'main' },
  { id: 'Products',          icon: '🛍️', group: 'manage' },
  { id: 'Affiliates',        icon: '🔗', group: 'manage' },
  { id: 'User Management',   icon: '👥', group: 'manage' },
  { id: 'Platform Settings', icon: '⚙️', group: 'manage' },
];

const orderStatusColor = s => ({ pending: 'yellow', processing: 'blue', shipped: 'blue', delivered: 'green', cancelled: 'red' }[s] || 'gray');

const Badge = ({ text, color }) => {
  const map = {
    green:  { bg: 'rgba(76,175,80,0.15)',   text: '#4caf50',  border: 'rgba(76,175,80,0.3)'   },
    red:    { bg: 'rgba(224,92,92,0.15)',   text: '#e05c5c',  border: 'rgba(224,92,92,0.3)'   },
    yellow: { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b',  border: 'rgba(245,158,11,0.3)'  },
    blue:   { bg: 'rgba(74,158,255,0.15)',  text: '#4a9eff',  border: 'rgba(74,158,255,0.3)'  },
    gray:   { bg: 'rgba(96,96,96,0.15)',    text: '#606060',  border: 'rgba(96,96,96,0.3)'    },
  };
  const s = map[color] || map.gray;
  return (
    <span style={{
      backgroundColor: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
      fontSize: 10, fontWeight: 800,
      padding: '2px 8px', borderRadius: 100,
      letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>
      {text}
    </span>
  );
};

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: 13 }}>🔍</span>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        backgroundColor: C.bg, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: '9px 14px 9px 36px',
        color: C.cream, fontSize: 13, outline: 'none', width: 260,
      }}
    />
  </div>
);

const FilterSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      backgroundColor: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: '9px 14px',
      color: C.cream, fontSize: 13, outline: 'none', cursor: 'pointer',
    }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Table = ({ cols, children, empty }) => (
  <div style={{ borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', backgroundColor: C.surface }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
          {cols.map(c => (
            <th key={c} style={{ textAlign: 'left', padding: '12px 16px', color: C.muted, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children || <tr><td colSpan={cols.length} style={{ padding: 24, color: C.muted, fontSize: 13, textAlign: 'center' }}>{empty}</td></tr>}</tbody>
    </table>
  </div>
);

const Tr = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.15s', cursor: onClick ? 'pointer' : 'default' }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.hover}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {children}
  </tr>
);

const Td = ({ children, style = {} }) => (
  <td style={{ padding: '12px 16px', color: C.cream, ...style }}>{children}</td>
);

const Btn = ({ onClick, variant = 'default', children, disabled }) => {
  const variants = {
    default: { bg: C.goldDim,               color: C.gold,  border: `1px solid rgba(201,168,76,0.3)` },
    danger:  { bg: 'rgba(224,92,92,0.1)',   color: C.red,   border: `1px solid rgba(224,92,92,0.3)`  },
    success: { bg: 'rgba(76,175,80,0.1)',   color: C.green, border: `1px solid rgba(76,175,80,0.3)`  },
    ghost:   { bg: 'transparent',           color: C.muted, border: `1px solid ${C.border}`          },
  };
  const v = variants[variant];
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick && onClick(); }}
      disabled={disabled}
      style={{
        backgroundColor: v.bg, color: v.color, border: v.border,
        borderRadius: 8, padding: '5px 12px',
        fontSize: 11, fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  );
};

const PageHeader = ({ title, subtitle, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
    <div>
      <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 22, marginBottom: 4 }}>{title}</h1>
      {subtitle && <p style={{ color: C.muted, fontSize: 13 }}>{subtitle}</p>}
    </div>
    {right && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{right}</div>}
  </div>
);

const StatCard = ({ label, value, icon, sub }) => (
  <div style={{
    backgroundColor: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 14, padding: 20,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</p>
        <p style={{ color: C.cream, fontWeight: 900, fontSize: 24 }}>{value}</p>
        {sub && <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{sub}</p>}
      </div>
      <span style={{ fontSize: 22 }}>{icon}</span>
    </div>
  </div>
);

const Loading = ({ text = 'Loading…' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.muted, fontSize: 13, padding: 32 }}>
    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
    {text}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const DashboardPage = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading platform stats…" />;
  if (!stats)  return <p style={{ color: C.red, fontSize: 13 }}>Failed to load stats.</p>;

  const months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const revData = stats.revenueData || [];
  const maxRev  = Math.max(...revData.map(d => d.total), 1);

  return (
    <>
      <PageHeader
        title="Platform Overview"
        subtitle="Real-time tracking of 57 Arts & Customs business health."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Revenue"    value={`KES ${(stats.totalRevenue || 0).toLocaleString()}`} icon="💰" sub="All time" />
        <StatCard label="Active Vendors"   value={stats.totalVendors   || 0} icon="🏪" />
        <StatCard label="Total Orders"     value={stats.totalOrders    || 0} icon="📦" />
        <StatCard label="Total Users"      value={stats.totalUsers     || 0} icon="👥" />
        <StatCard label="Total Products"   value={stats.totalProducts  || 0} icon="🛍️" />
        <StatCard label="Total Affiliates" value={stats.totalAffiliates|| 0} icon="🔗" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
          <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
            Revenue by Month
          </p>
          {revData.length === 0 ? (
            <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', padding: '32px 0' }}>No revenue data yet</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
              {revData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ color: C.muted, fontSize: 9 }}>
                    {d.total >= 1000 ? `${(d.total/1000).toFixed(0)}k` : d.total}
                  </span>
                  <div
                    title={`KES ${d.total.toLocaleString()}`}
                    style={{
                      width: '100%', borderRadius: '4px 4px 0 0',
                      background: `linear-gradient(to top, ${C.gold}, rgba(201,168,76,0.4))`,
                      height: `${Math.max((d.total / maxRev) * 100, 4)}%`,
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ color: C.muted, fontSize: 9 }}>{months[(d._id || 1) - 1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
          <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Recent Orders
          </p>
          {(stats.recentOrders || []).length === 0 ? (
            <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', padding: '32px 0' }}>No orders yet</p>
          ) : (
            (stats.recentOrders || []).map(o => (
              <div key={o._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: `1px solid ${C.border}`,
              }}>
                <div>
                  <p style={{ color: C.cream, fontSize: 12, fontWeight: 800 }}>{o.orderNumber}</p>
                  <p style={{ color: C.muted, fontSize: 11 }}>{o.user?.name || 'Unknown'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ color: C.gold, fontSize: 12, fontWeight: 800 }}>KES {o.totalPrice}</p>
                  <Badge text={o.orderStatus} color={orderStatusColor(o.orderStatus)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VENDORS PAGE
// ✅ FIX: Added e.stopPropagation() to Btn (above) so clicks don't get swallowed.
//         Status logic now correctly reads v.isApproved and v.status from the
//         schema fields we added to Vendor.js.
// ═══════════════════════════════════════════════════════════════════════════════
const VendorsPage = () => {
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search,  setSearch]    = useState('');
  const [filter,  setFilter]    = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getVendors()
      .then(r => setVendors(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async id => {
    try { await adminAPI.approveVendor(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to approve vendor'); }
  };

  const reject = async id => {
    try { await adminAPI.rejectVendor(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to suspend vendor'); }
  };

  const filtered = useMemo(() => vendors.filter(v => {
    const name  = (v.storeName || v.user?.name || '').toLowerCase();
    const email = (v.user?.email || '').toLowerCase();
    const q     = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || email.includes(q);
    const status = v.isApproved ? 'approved' : v.status === 'suspended' ? 'suspended' : 'pending';
    const matchFilter = filter === 'all' || filter === status;
    return matchSearch && matchFilter;
  }), [vendors, search, filter]);

  if (loading) return <Loading text="Loading vendors…" />;

  const counts = {
    all:       vendors.length,
    pending:   vendors.filter(v => !v.isApproved && v.status !== 'suspended').length,
    approved:  vendors.filter(v => v.isApproved).length,
    suspended: vendors.filter(v => v.status === 'suspended').length,
  };

  return (
    <>
      <PageHeader
        title="Vendor Management"
        subtitle={`${counts.pending} pending approval`}
        right={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search vendors…" />
            <FilterSelect
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all',       label: `All (${counts.all})`            },
                { value: 'pending',   label: `Pending (${counts.pending})`    },
                { value: 'approved',  label: `Approved (${counts.approved})`  },
                { value: 'suspended', label: `Suspended (${counts.suspended})` },
              ]}
            />
          </>
        }
      />

      <Table cols={['Vendor', 'Email', 'Category', 'Status', 'Actions']} empty="No vendors found">
        {filtered.map(v => {
          const status = v.isApproved ? 'approved' : v.status === 'suspended' ? 'suspended' : 'pending';
          const color  = { approved: 'green', suspended: 'red', pending: 'yellow' }[status];
          return (
            <Tr key={v._id}>
              <Td><span style={{ fontWeight: 700 }}>{v.storeName || v.user?.name || '—'}</span></Td>
              <Td style={{ color: C.muted }}>{v.user?.email || '—'}</Td>
              <Td style={{ color: C.muted, textTransform: 'capitalize' }}>{v.category || '—'}</Td>
              <Td><Badge text={status} color={color} /></Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  {status === 'pending' && (
                    <Btn onClick={() => approve(v._id)} variant="success">Approve</Btn>
                  )}
                  {status === 'approved' && (
                    <Btn onClick={() => reject(v._id)} variant="danger">Suspend</Btn>
                  )}
                  {status === 'suspended' && (
                    <Btn onClick={() => approve(v._id)} variant="default">Reinstate</Btn>
                  )}
                </div>
              </Td>
            </Tr>
          );
        })}
      </Table>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const OrdersPage = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [payment, setPayment] = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getOrders()
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    await adminAPI.updateOrderStatus(id, status);
    load();
  };

  const filtered = useMemo(() => orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch  = !q || (o.orderNumber || '').toLowerCase().includes(q) || (o.user?.name || '').toLowerCase().includes(q);
    const matchStatus  = filter  === 'all' || o.orderStatus  === filter;
    const matchPayment = payment === 'all' || o.paymentStatus === payment;
    return matchSearch && matchStatus && matchPayment;
  }), [orders, search, filter, payment]);

  if (loading) return <Loading text="Loading orders…" />;

  const total = filtered.reduce((s, o) => s + (o.totalPrice || 0), 0);

  return (
    <>
      <PageHeader
        title="Order Management"
        subtitle={`${filtered.length} orders · KES ${total.toLocaleString()} total`}
        right={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search order / customer…" />
            <FilterSelect
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all',        label: 'All Statuses' },
                { value: 'pending',    label: 'Pending'      },
                { value: 'processing', label: 'Processing'   },
                { value: 'shipped',    label: 'Shipped'      },
                { value: 'delivered',  label: 'Delivered'    },
                { value: 'cancelled',  label: 'Cancelled'    },
              ]}
            />
            <FilterSelect
              value={payment}
              onChange={setPayment}
              options={[
                { value: 'all',     label: 'All Payments' },
                { value: 'paid',    label: 'Paid'         },
                { value: 'pending', label: 'Unpaid'       },
                { value: 'failed',  label: 'Failed'       },
              ]}
            />
          </>
        }
      />

      <Table cols={['Order #', 'Customer', 'Amount', 'Payment', 'Status', 'Update']} empty="No orders found">
        {filtered.map(o => (
          <Tr key={o._id}>
            <Td><span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: 11 }}>{o.orderNumber}</span></Td>
            <Td style={{ color: C.muted }}>{o.user?.name || 'Unknown'}</Td>
            <Td><span style={{ color: C.gold, fontWeight: 800 }}>KES {(o.totalPrice || 0).toLocaleString()}</span></Td>
            <Td><Badge text={o.paymentStatus} color={o.paymentStatus === 'paid' ? 'green' : o.paymentStatus === 'failed' ? 'red' : 'yellow'} /></Td>
            <Td><Badge text={o.orderStatus} color={orderStatusColor(o.orderStatus)} /></Td>
            <Td>
              <select
                value={o.orderStatus}
                onChange={e => changeStatus(o._id, e.target.value)}
                style={{
                  backgroundColor: C.bg, border: `1px solid ${C.border}`,
                  color: C.cream, fontSize: 11, padding: '4px 8px',
                  borderRadius: 7, outline: 'none', cursor: 'pointer',
                }}
              >
                {['pending','processing','shipped','delivered','cancelled'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Td>
          </Tr>
        ))}
      </Table>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [stock,    setStock]    = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getProducts()
      .then(r => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async id => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    await adminAPI.deleteProduct(id);
    load();
  };

  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch   = !q || (p.name || '').toLowerCase().includes(q);
    const matchCategory = category === 'all' || (p.category || '').toLowerCase() === category;
    const matchStock    = stock === 'all' || (stock === 'in' ? p.stock > 0 : p.stock === 0);
    return matchSearch && matchCategory && matchStock;
  }), [products, search, category, stock]);

  if (loading) return <Loading text="Loading products…" />;

  return (
    <>
      <PageHeader
        title="Product Management"
        subtitle={`${filtered.length} of ${products.length} products`}
        right={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search products…" />
            <FilterSelect
              value={category}
              onChange={setCategory}
              options={[
                { value: 'all',       label: 'All Categories' },
                { value: 'fashion',   label: 'Fashion'        },
                { value: 'furniture', label: 'Furniture'      },
                { value: 'beads',     label: 'Beads'          },
                { value: 'antiques',  label: 'Antiques'       },
              ]}
            />
            <FilterSelect
              value={stock}
              onChange={setStock}
              options={[
                { value: 'all', label: 'All Stock'    },
                { value: 'in',  label: 'In Stock'     },
                { value: 'out', label: 'Out of Stock' },
              ]}
            />
          </>
        }
      />

      <Table cols={['Product', 'Vendor', 'Category', 'Price', 'Stock', 'Action']} empty="No products found">
        {filtered.map(p => (
          <Tr key={p._id}>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.name} style={{ width: 36, height: 36, borderRadius: 7, objectFit: 'cover' }} />
                )}
                <span style={{ fontWeight: 700 }}>{p.name}</span>
              </div>
            </Td>
            <Td style={{ color: C.muted }}>{p.vendor?.businessName || p.vendor?.storeName || 'N/A'}</Td>
            <Td style={{ color: C.muted, textTransform: 'capitalize' }}>{p.category}</Td>
            <Td><span style={{ color: C.gold, fontWeight: 800 }}>KES {(p.price || 0).toLocaleString()}</span></Td>
            <Td>
              <Badge
                text={p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
                color={p.stock > 10 ? 'green' : p.stock > 0 ? 'yellow' : 'red'}
              />
            </Td>
            <Td><Btn onClick={() => remove(p._id)} variant="danger">Delete</Btn></Td>
          </Tr>
        ))}
      </Table>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AFFILIATES PAGE  –  includes pending-approval flow
// ═══════════════════════════════════════════════════════════════════════════════
const AffiliatesPage = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [sort,       setSort]       = useState('earned');

  // ── data loader (useCallback so approve/suspend/reinstate can refresh) ──────
  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getAffiliates()
      .then(r => setAffiliates(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── approval actions ────────────────────────────────────────────────────────
  const approve   = async id => {
    try { await adminAPI.approveAffiliate(id);  load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to approve affiliate'); }
  };
  const suspend   = async id => {
    try { await adminAPI.suspendAffiliate(id);  load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to suspend affiliate'); }
  };
  const reinstate = async id => {
    try { await adminAPI.approveAffiliate(id);  load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to reinstate affiliate'); }
  };

  // ── counts for filter badges ────────────────────────────────────────────────
  const counts = useMemo(() => ({
    all:       affiliates.length,
    pending:   affiliates.filter(a => a.status === 'pending').length,
    active:    affiliates.filter(a => a.status === 'active').length,
    suspended: affiliates.filter(a => a.status === 'suspended').length,
  }), [affiliates]);

  // ── filtered + sorted list ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...affiliates]
      .filter(a => {
        const matchSearch = !q
          || (a.user?.name     || '').toLowerCase().includes(q)
          || (a.user?.email    || '').toLowerCase().includes(q)
          || (a.affiliateCode  || '').toLowerCase().includes(q);
        const matchFilter = filter === 'all' || a.status === filter;
        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sort === 'earned') return (b.totalEarned || 0) - (a.totalEarned || 0);
        if (sort === 'clicks') return (b.totalClicks || 0) - (a.totalClicks || 0);
        if (sort === 'orders') return (b.totalOrders || 0) - (a.totalOrders || 0);
        return 0;
      });
  }, [affiliates, search, filter, sort]);

  if (loading) return <Loading text="Loading affiliates…" />;

  const totalEarned = affiliates.filter(a => a.status === 'active').reduce((s, a) => s + (a.totalEarned || 0), 0);
  const totalClicks = affiliates.filter(a => a.status === 'active').reduce((s, a) => s + (a.totalClicks || 0), 0);

  return (
    <>
      <PageHeader
        title="Affiliate Management"
        subtitle={`${counts.pending} pending approval · KES ${totalEarned.toLocaleString()} earned · ${totalClicks.toLocaleString()} clicks`}
        right={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search affiliates…" />
            <FilterSelect
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all',       label: `All (${counts.all})`             },
                { value: 'pending',   label: `Pending (${counts.pending})`     },
                { value: 'active',    label: `Active (${counts.active})`       },
                { value: 'suspended', label: `Suspended (${counts.suspended})` },
              ]}
            />
            <FilterSelect
              value={sort}
              onChange={setSort}
              options={[
                { value: 'earned', label: 'Sort: Earnings' },
                { value: 'clicks', label: 'Sort: Clicks'   },
                { value: 'orders', label: 'Sort: Orders'   },
              ]}
            />
          </>
        }
      />

      {/* ── pending-approval banner ──────────────────────────────────────────── */}
      {counts.pending > 0 && (
        <div style={{
          backgroundColor: 'rgba(245,158,11,0.08)',
          border: `1px solid rgba(245,158,11,0.3)`,
          borderRadius: 12, padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 18, fontSize: 13,
        }}>
          <span style={{ fontSize: 16 }}>⏳</span>
          <span style={{ color: C.yellow, fontWeight: 700 }}>
            {counts.pending} affiliate application{counts.pending > 1 ? 's' : ''} waiting for review.
          </span>
          <button
            onClick={() => setFilter('pending')}
            style={{
              marginLeft: 'auto', backgroundColor: 'rgba(245,158,11,0.15)',
              border: `1px solid rgba(245,158,11,0.35)`, color: C.yellow,
              borderRadius: 8, padding: '4px 12px', fontSize: 11,
              fontWeight: 800, cursor: 'pointer',
            }}
          >
            Review Now
          </button>
        </div>
      )}

      <Table
        cols={['Affiliate', 'Code', 'Channel / Audience', 'Clicks', 'Orders', 'Conv.', 'Earnings', 'Status', 'Actions']}
        empty="No affiliates found"
      >
        {filtered.map(a => {
          const conv        = a.totalClicks > 0 ? ((a.totalOrders / a.totalClicks) * 100).toFixed(1) : '0.0';
          const statusColor = { active: 'green', suspended: 'red', pending: 'yellow' }[a.status] || 'gray';
          return (
            <Tr key={a._id}>
              <Td>
                <div>
                  <p style={{ fontWeight: 700 }}>{a.user?.name  || '—'}</p>
                  <p style={{ color: C.muted, fontSize: 11 }}>{a.user?.email || '—'}</p>
                </div>
              </Td>
              <Td>
                <span style={{ fontFamily: 'monospace', color: C.gold, fontWeight: 800, fontSize: 12 }}>
                  {a.affiliateCode || '—'}
                </span>
              </Td>
              <Td style={{ color: C.muted, fontSize: 11, maxWidth: 160 }}>
                {a.applicationData?.channel
                  ? <><span style={{ color: C.cream }}>{a.applicationData.channel}</span>{a.applicationData.audience ? ` · ${a.applicationData.audience}` : ''}</>
                  : '—'}
              </Td>
              <Td style={{ color: C.muted }}>{(a.totalClicks || 0).toLocaleString()}</Td>
              <Td style={{ color: C.muted }}>{(a.totalOrders || 0).toLocaleString()}</Td>
              <Td><span style={{ color: Number(conv) > 5 ? C.green : C.muted }}>{conv}%</span></Td>
              <Td><span style={{ color: C.green, fontWeight: 800 }}>KES {(a.totalEarned || 0).toLocaleString()}</span></Td>
              <Td><Badge text={a.status} color={statusColor} /></Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  {a.status === 'pending' && (
                    <>
                      <Btn onClick={() => approve(a._id)}  variant="success">Approve</Btn>
                      <Btn onClick={() => suspend(a._id)}  variant="danger">Reject</Btn>
                    </>
                  )}
                  {a.status === 'active' && (
                    <Btn onClick={() => suspend(a._id)}    variant="danger">Suspend</Btn>
                  )}
                  {a.status === 'suspended' && (
                    <Btn onClick={() => reinstate(a._id)}  variant="default">Reinstate</Btn>
                  )}
                </div>
              </Td>
            </Tr>
          );
        })}
      </Table>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const UsersPage = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('all');
  const [status,  setStatus]  = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getUsers()
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle     = async id      => { await adminAPI.toggleUser(id);              load(); };
  const remove     = async id      => { if (!window.confirm('Delete this user? This cannot be undone.')) return; await adminAPI.deleteUser(id); load(); };
  const updateRole = async (id, r) => { await adminAPI.updateUserRole(id, r);       load(); };

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    const matchRole   = role   === 'all' || u.role === role;
    const matchStatus = status === 'all' || (status === 'active' ? u.isActive : !u.isActive);
    return matchSearch && matchRole && matchStatus;
  }), [users, search, role, status]);

  if (loading) return <Loading text="Loading users…" />;

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle={`${filtered.length} of ${users.length} users`}
        right={
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Search name / email…" />
            <FilterSelect
              value={role}
              onChange={setRole}
              options={[
                { value: 'all',       label: 'All Roles'  },
                { value: 'buyer',     label: 'Buyers'     },
                { value: 'vendor',    label: 'Vendors'    },
                { value: 'affiliate', label: 'Affiliates' },
                { value: 'admin',     label: 'Admins'     },
              ]}
            />
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all',      label: 'All Status' },
                { value: 'active',   label: 'Active'     },
                { value: 'inactive', label: 'Inactive'   },
              ]}
            />
          </>
        }
      />

      <Table cols={['User', 'Role', 'Status', 'Joined', 'Actions']} empty="No users found">
        {filtered.map(u => (
          <Tr key={u._id}>
            <Td>
              <div>
                <p style={{ fontWeight: 700 }}>{u.name}</p>
                <p style={{ color: C.muted, fontSize: 11 }}>{u.email}</p>
              </div>
            </Td>
            <Td>
              <select
                value={u.role}
                onChange={e => updateRole(u._id, e.target.value)}
                style={{
                  backgroundColor: C.bg, border: `1px solid ${C.border}`,
                  color: C.cream, fontSize: 11, padding: '4px 8px',
                  borderRadius: 7, outline: 'none', cursor: 'pointer',
                }}
              >
                {['buyer','vendor','affiliate','admin'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Td>
            <Td><Badge text={u.isActive ? 'Active' : 'Inactive'} color={u.isActive ? 'green' : 'red'} /></Td>
            <Td style={{ color: C.muted, fontSize: 11 }}>
              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
            </Td>
            <Td>
              <div style={{ display: 'flex', gap: 6 }}>
                <Btn onClick={() => toggle(u._id)} variant={u.isActive ? 'ghost' : 'success'}>
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </Btn>
                <Btn onClick={() => remove(u._id)} variant="danger">Delete</Btn>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    adminAPI.getSettings().then(r => setSettings(r.data)).catch(console.error);
  }, []);

  const toggle = async key => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await adminAPI.updateSettings({ [key]: updated[key] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <Loading text="Loading settings…" />;

  const items = [
    { key: 'maintenanceMode',        label: 'Maintenance Mode',         desc: 'Disable all platform features for users', danger: true },
    { key: 'newVendorRegistrations', label: 'New Vendor Registrations',  desc: 'Allow new vendors to register on the platform' },
  ];

  return (
    <>
      <PageHeader
        title="Platform Settings"
        subtitle="Configure global platform behaviour"
        right={saved && <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>✓ Saved</span>}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.key} style={{
            backgroundColor: C.surface,
            border: `1px solid ${item.danger && settings[item.key] ? 'rgba(224,92,92,0.4)' : C.border}`,
            borderRadius: 14, padding: '20px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'border-color 0.2s',
          }}>
            <div>
              <p style={{ color: C.cream, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.label}</p>
              <p style={{ color: C.muted, fontSize: 12 }}>{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              style={{
                width: 48, height: 26, borderRadius: 100,
                backgroundColor: settings[item.key] ? (item.danger ? C.red : C.gold) : C.border,
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background-color 0.2s', flexShrink: 0,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff',
                position: 'absolute', top: 3,
                left: settings[item.key] ? 'calc(100% - 23px)' : 3,
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  const pages = {
    'Dashboard':         <DashboardPage />,
    'Vendors':           <VendorsPage />,
    'Orders':            <OrdersPage />,
    'Products':          <ProductsPage />,
    'Affiliates':        <AffiliatesPage />,
    'User Management':   <UsersPage />,
    'Platform Settings': <SettingsPage />,
  };

  const mainLinks   = sideLinks.filter(l => l.group === 'main');
  const manageLinks = sideLinks.filter(l => l.group === 'manage');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', color: C.cream }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <div style={{
        width: 210, flexShrink: 0,
        backgroundColor: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        padding: '24px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 32 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            backgroundColor: C.gold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 11, color: '#000',
          }}>57</div>
          <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>ARTS ADMIN</span>
        </div>

        <p style={{ color: C.muted, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>
          Main Menu
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
          {mainLinks.map(l => (
            <button
              key={l.id}
              onClick={() => setActivePage(l.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, border: 'none',
                backgroundColor: activePage === l.id ? C.goldDim : 'transparent',
                color: activePage === l.id ? C.gold : C.muted,
                fontWeight: activePage === l.id ? 800 : 400,
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activePage !== l.id) { e.currentTarget.style.backgroundColor = C.hover; e.currentTarget.style.color = C.cream; } }}
              onMouseLeave={e => { if (activePage !== l.id) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.muted; } }}
            >
              <span style={{ fontSize: 15 }}>{l.icon}</span>
              {l.id}
            </button>
          ))}
        </div>

        <p style={{ color: C.muted, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>
          Management
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {manageLinks.map(l => (
            <button
              key={l.id}
              onClick={() => setActivePage(l.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, border: 'none',
                backgroundColor: activePage === l.id ? C.goldDim : 'transparent',
                color: activePage === l.id ? C.gold : C.muted,
                fontWeight: activePage === l.id ? 800 : 400,
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activePage !== l.id) { e.currentTarget.style.backgroundColor = C.hover; e.currentTarget.style.color = C.cream; } }}
              onMouseLeave={e => { if (activePage !== l.id) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.muted; } }}
            >
              <span style={{ fontSize: 15 }}>{l.icon}</span>
              {l.id}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={() => {
              localStorage.removeItem('57arts_token');
              localStorage.removeItem('57arts_user');
              window.location.href = '/login';
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 12px', borderRadius: 10,
              border: 'none', backgroundColor: 'transparent',
              color: C.muted, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(224,92,92,0.1)'; e.currentTarget.style.color = C.red; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.muted; }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '32px 36px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ color: C.muted, fontSize: 12 }}>
            Admin Panel › <span style={{ color: C.cream }}>{activePage}</span>
          </div>
          <span style={{
            backgroundColor: C.goldDim, color: C.gold,
            border: `1px solid rgba(201,168,76,0.3)`,
            fontSize: 10, fontWeight: 800, padding: '4px 10px',
            borderRadius: 100, letterSpacing: '0.1em',
          }}>
            ADMIN
          </span>
        </div>

        {pages[activePage]}
      </div>
    </div>
  );
};

export default AdminDashboard;