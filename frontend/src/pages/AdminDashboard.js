import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';

const sideLinks = ['Dashboard', 'Vendors', 'Orders', 'Products', 'Affiliates', 'User Management', 'Platform Settings'];

// ── Reusable badge ────────────────────────────────────────────────────────────
const Badge = ({ text, color }) => {
  const styles = {
    green:  'bg-green-900 text-green-400',
    red:    'bg-red-900 text-red-400',
    yellow: 'bg-yellow-900 text-yellow-400',
    blue:   'bg-blue-900 text-blue-400',
    gray:   'bg-gray-800 text-gray-400',
  };
  return (
    <span className={`text-xs font-black px-2 py-0.5 rounded ${styles[color] || styles.gray}`}>
      {text}
    </span>
  );
};

// ── Status color helper ───────────────────────────────────────────────────────
const orderStatusColor = (s) => ({ pending:'yellow', processing:'blue', shipped:'blue', delivered:'green', cancelled:'red' }[s] || 'gray');

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500 text-sm">Loading stats…</p>;
  if (!stats)  return <p className="text-red-400 text-sm">Failed to load stats.</p>;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxRev = Math.max(...(stats.revenueData.map(d => d.total)), 1);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Platform Overview</h1>
        <p className="text-gray-500 text-sm">Real-time tracking of 57 Arts & Customs business health.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue',    value: `KES ${stats.totalRevenue.toLocaleString()}`, icon: '💰' },
          { label: 'Active Vendors',   value: stats.totalVendors,   icon: '🏪' },
          { label: 'Total Orders',     value: stats.totalOrders,    icon: '📦' },
          { label: 'Total Users',      value: stats.totalUsers,     icon: '👥' },
          { label: 'Total Products',   value: stats.totalProducts,  icon: '🛍️' },
          { label: 'Total Affiliates', value: stats.totalAffiliates,icon: '🔗' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-white font-black text-2xl mt-2">{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="rounded-2xl p-6 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
          <h2 className="font-black text-sm uppercase tracking-wide mb-5">Revenue by Month</h2>
          <div className="flex items-end gap-2 h-28">
            {stats.revenueData.length > 0 ? stats.revenueData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-yellow-400 bg-opacity-80"
                  style={{ height: `${(d.total / maxRev) * 100}%` }}></div>
                <span className="text-gray-600 text-xs">{months[d._id - 1]}</span>
              </div>
            )) : (
              <p className="text-gray-600 text-xs self-center mx-auto">No revenue data yet</p>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl p-6 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
          <h2 className="font-black text-sm uppercase tracking-wide mb-5">Recent Orders</h2>
          {stats.recentOrders.length === 0
            ? <p className="text-gray-600 text-xs">No orders yet</p>
            : stats.recentOrders.map(o => (
              <div key={o._id} className="flex justify-between items-center mb-3 pb-3 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white text-xs font-black">{o.orderNumber}</p>
                  <p className="text-gray-500 text-xs">{o.user?.name || 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-yellow-400 text-xs font-black">KES {o.totalPrice}</p>
                  <Badge text={o.orderStatus} color={orderStatusColor(o.orderStatus)} />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// VENDORS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getVendors().then(r => setVendors(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id) => { await adminAPI.approveVendor(id); load(); };
  const reject  = async (id) => { await adminAPI.rejectVendor(id);  load(); };

  if (loading) return <p className="text-gray-500 text-sm">Loading vendors…</p>;

  return (
    <>
      <h1 className="text-2xl font-black mb-6">Vendor Management</h1>
      <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
              <th className="text-left p-4">Vendor</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0
              ? <tr><td colSpan={4} className="p-4 text-gray-600 text-xs">No vendors yet</td></tr>
              : vendors.map(v => (
                <tr key={v._id} className="border-b border-gray-800 last:border-0 hover:bg-white hover:bg-opacity-5">
                  <td className="p-4 text-white font-semibold">{v.businessName || v.user?.name}</td>
                  <td className="p-4 text-gray-400">{v.user?.email}</td>
                  <td className="p-4">
                    <Badge
                      text={v.isApproved ? 'Approved' : v.status === 'suspended' ? 'Rejected' : 'Pending'}
                      color={v.isApproved ? 'green' : v.status === 'suspended' ? 'red' : 'yellow'}
                    />
                  </td>
                  <td className="p-4 flex gap-2">
                    {!v.isApproved && v.status !== 'suspended' && (
                      <button onClick={() => approve(v._id)}
                        className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-lg hover:bg-yellow-500">
                        Approve
                      </button>
                    )}
                    {v.isApproved && (
                      <button onClick={() => reject(v._id)}
                        className="bg-red-800 text-red-300 text-xs font-black px-3 py-1 rounded-lg hover:bg-red-700">
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getOrders().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    await adminAPI.updateOrderStatus(id, status);
    load();
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading orders…</p>;

  return (
    <>
      <h1 className="text-2xl font-black mb-6">Order Management</h1>
      <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
              <th className="text-left p-4">Order #</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0
              ? <tr><td colSpan={6} className="p-4 text-gray-600 text-xs">No orders yet</td></tr>
              : orders.map(o => (
                <tr key={o._id} className="border-b border-gray-800 last:border-0 hover:bg-white hover:bg-opacity-5">
                  <td className="p-4 text-white font-black text-xs">{o.orderNumber}</td>
                  <td className="p-4 text-gray-400 text-xs">{o.user?.name || 'Unknown'}</td>
                  <td className="p-4 text-yellow-400 font-black text-xs">KES {o.totalPrice}</td>
                  <td className="p-4"><Badge text={o.paymentStatus} color={o.paymentStatus === 'paid' ? 'green' : 'yellow'} /></td>
                  <td className="p-4"><Badge text={o.orderStatus} color={orderStatusColor(o.orderStatus)} /></td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={e => changeStatus(o._id, e.target.value)}
                      className="bg-gray-900 border border-gray-700 text-white text-xs px-2 py-1 rounded focus:outline-none">
                      {['pending','processing','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getProducts().then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await adminAPI.deleteProduct(id);
    load();
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading products…</p>;

  return (
    <>
      <h1 className="text-2xl font-black mb-6">Product Management</h1>
      <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Vendor</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0
              ? <tr><td colSpan={6} className="p-4 text-gray-600 text-xs">No products yet</td></tr>
              : products.map(p => (
                <tr key={p._id} className="border-b border-gray-800 last:border-0 hover:bg-white hover:bg-opacity-5">
                  <td className="p-4 text-white font-semibold">{p.name}</td>
                  <td className="p-4 text-gray-400 text-xs">{p.vendor?.businessName || 'N/A'}</td>
                  <td className="p-4 text-gray-400 text-xs capitalize">{p.category}</td>
                  <td className="p-4 text-yellow-400 font-black text-xs">KES {p.price}</td>
                  <td className="p-4"><Badge text={p.stock > 0 ? `${p.stock} left` : 'Out'} color={p.stock > 0 ? 'green' : 'red'} /></td>
                  <td className="p-4">
                    <button onClick={() => remove(p._id)}
                      className="bg-red-900 text-red-400 text-xs font-black px-3 py-1 rounded-lg hover:bg-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AFFILIATES PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const AffiliatesPage = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    adminAPI.getAffiliates().then(r => setAffiliates(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500 text-sm">Loading affiliates…</p>;

  return (
    <>
      <h1 className="text-2xl font-black mb-6">Affiliate Management</h1>
      <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4">Earnings</th>
              <th className="text-left p-4">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.length === 0
              ? <tr><td colSpan={5} className="p-4 text-gray-600 text-xs">No affiliates yet</td></tr>
              : affiliates.map(a => (
                <tr key={a._id} className="border-b border-gray-800 last:border-0 hover:bg-white hover:bg-opacity-5">
                  <td className="p-4 text-white font-semibold">{a.user?.name}</td>
                  <td className="p-4 text-gray-400 text-xs">{a.user?.email}</td>
                  <td className="p-4 text-yellow-400 font-black text-xs">{a.affiliateCode}</td>
                  <td className="p-4 text-green-400 font-black text-xs">KES {a.totalEarnings || 0}</td>
                  <td className="p-4 text-gray-400 text-xs">{a.totalClicks || 0}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const UsersPage = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getUsers().then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle  = async (id) => { await adminAPI.toggleUser(id); load(); };
  const remove  = async (id) => { if (!window.confirm('Delete user?')) return; await adminAPI.deleteUser(id); load(); };
  const setRole = async (id, role) => { await adminAPI.updateUserRole(id, role); load(); };

  if (loading) return <p className="text-gray-500 text-sm">Loading users…</p>;

  return (
    <>
      <h1 className="text-2xl font-black mb-6">User Management</h1>
      <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0
              ? <tr><td colSpan={5} className="p-4 text-gray-600 text-xs">No users yet</td></tr>
              : users.map(u => (
                <tr key={u._id} className="border-b border-gray-800 last:border-0 hover:bg-white hover:bg-opacity-5">
                  <td className="p-4 text-white font-semibold">{u.name}</td>
                  <td className="p-4 text-gray-400 text-xs">{u.email}</td>
                  <td className="p-4">
                    <select value={u.role} onChange={e => setRole(u._id, e.target.value)}
                      className="bg-gray-900 border border-gray-700 text-white text-xs px-2 py-1 rounded focus:outline-none">
                      {['buyer','vendor','affiliate','admin'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <Badge text={u.isActive ? 'Active' : 'Inactive'} color={u.isActive ? 'green' : 'red'} />
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => toggle(u._id)}
                      className={`text-xs font-black px-3 py-1 rounded-lg ${u.isActive ? 'bg-yellow-900 text-yellow-400 hover:bg-yellow-800' : 'bg-green-900 text-green-400 hover:bg-green-800'}`}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => remove(u._id)}
                      className="bg-red-900 text-red-400 text-xs font-black px-3 py-1 rounded-lg hover:bg-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    adminAPI.getSettings().then(r => setSettings(r.data)).catch(console.error);
  }, []);

  const toggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await adminAPI.updateSettings({ [key]: updated[key] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <p className="text-gray-500 text-sm">Loading settings…</p>;

  const items = [
    { key: 'maintenanceMode',        label: 'Maintenance Mode',          desc: 'Disable all platform features for users' },
    { key: 'newVendorRegistrations', label: 'New Vendor Registrations',   desc: 'Allow new vendors to register on the platform' },
  ];

  return (
    <>
      <h1 className="text-2xl font-black mb-2">Platform Settings</h1>
      {saved && <p className="text-green-400 text-xs mb-4">✅ Settings saved!</p>}
      <div className="rounded-2xl border border-gray-800 p-6" style={{ backgroundColor: '#1a1a00' }}>
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between mb-6 pb-6 border-b border-gray-800 last:border-0 last:mb-0 last:pb-0">
            <div>
              <p className="text-white font-semibold text-sm">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </div>
            <button onClick={() => toggle(item.key)}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings[item.key] ? 'bg-yellow-400' : 'bg-gray-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${settings[item.key] ? 'right-0.5' : 'left-0.5'}`}></div>
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
    'Dashboard':        <DashboardPage />,
    'Vendors':          <VendorsPage />,
    'Orders':           <OrdersPage />,
    'Products':         <ProductsPage />,
    'Affiliates':       <AffiliatesPage />,
    'User Management':  <UsersPage />,
    'Platform Settings':<SettingsPage />,
  };

  const mainMenu   = sideLinks.slice(0, 3);
  const mgmtMenu   = sideLinks.slice(3);

  return (
    <div className="min-h-screen text-white flex" style={{ backgroundColor: '#1a1500' }}>

      {/* SIDEBAR */}
      <div className="w-52 flex-shrink-0 border-r border-gray-800 py-8 px-4" style={{ backgroundColor: '#0d0d00' }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="bg-yellow-400 text-black w-7 h-7 rounded flex items-center justify-center text-xs font-black">57</span>
          <span className="text-white font-black text-sm">ARTS ADMIN</span>
        </div>

        <p className="text-gray-600 text-xs uppercase tracking-widest px-2 mb-3">Main Menu</p>
        <div className="space-y-1 mb-6">
          {mainMenu.map(link => (
            <button key={link} onClick={() => setActivePage(link)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                activePage === link ? 'bg-yellow-400 bg-opacity-20 text-yellow-400 font-black' : 'text-gray-500 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}>{link}</button>
          ))}
        </div>

        <p className="text-gray-600 text-xs uppercase tracking-widest px-2 mb-3">Management</p>
        <div className="space-y-1">
          {mgmtMenu.map(link => (
            <button key={link} onClick={() => setActivePage(link)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                activePage === link ? 'bg-yellow-400 bg-opacity-20 text-yellow-400 font-black' : 'text-gray-500 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}>{link}</button>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <button onClick={() => { localStorage.removeItem('57arts_token'); localStorage.removeItem('57arts_user'); window.location.href = '/login'; }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-500 text-xs">Admin Panel</div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded">ADMIN</span>
          </div>
        </div>
        {pages[activePage]}
      </div>
    </div>
  );
};

export default AdminDashboard;