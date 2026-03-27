import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ── MOCK DATA ─────────────────────────────────────────────
const VENDOR = {
  name: 'Master Julian',
  avatar: 'MJ',
  shop: 'Julian\'s Atelier',
  craft: 'Furniture & Woodwork',
  rating: 4.9,
  reviews: 84,
  since: 'Oct 2023',
  verified: true,
  tier: 'Gold Artisan',
  commission: 8,
  mpesa: '+254 712 345 678',
  bankName: '',
  totalSales: 'KES 284,500',
  totalOrders: 34,
  pendingPayout: 'KES 18,200',
  nextPayout: 'Apr 1, 2026',
};

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Obsidian Throne v.2',
    category: 'Furniture',
    price: 'KES 125,000',
    priceNum: 125000,
    stock: 2,
    status: 'active',
    views: 342,
    orders: 8,
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300',
    description: 'Hand-carved teak throne with obsidian inlay and 24k gold leaf detailing.',
    materials: ['Teak Wood', '24k Gold Leaf', 'Obsidian'],
  },
  {
    id: 'p2',
    name: 'Vanguard Teak Chair',
    category: 'Furniture',
    price: 'KES 78,000',
    priceNum: 78000,
    stock: 5,
    status: 'active',
    views: 218,
    orders: 12,
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300',
    description: 'Minimalist teak chair with ergonomic design and brass accents.',
    materials: ['Teak Wood', 'Recycled Brass'],
  },
  {
    id: 'p3',
    name: 'Magma Coffee Table',
    category: 'Furniture',
    price: 'KES 54,000',
    priceNum: 54000,
    stock: 0,
    status: 'out_of_stock',
    views: 156,
    orders: 6,
    img: 'https://images.unsplash.com/photo-1493106819501-8f9e5ce02e5d?w=300',
    description: 'Sculpted walnut coffee table with lava-inspired resin fill.',
    materials: ['Black Walnut', 'Resin'],
  },
  {
    id: 'p4',
    name: 'Heritage Bookshelf',
    category: 'Furniture',
    price: 'KES 92,000',
    priceNum: 92000,
    stock: 1,
    status: 'draft',
    views: 0,
    orders: 0,
    img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300',
    description: 'Floor-to-ceiling bookshelf in reclaimed oak with cast iron brackets.',
    materials: ['Reclaimed Oak', 'Cast Iron'],
  },
];

const ORDERS = [
  {
    id: '#ORD-9921',
    buyer: 'Alex Julian',
    product: 'Obsidian Throne v.2',
    date: 'Oct 22, 2023',
    amount: 'KES 125,000',
    status: 'delivered',
    type: 'standard',
  },
  {
    id: '#ORD-9856',
    buyer: 'Sarah K.',
    product: 'Vanguard Teak Chair',
    date: 'Oct 18, 2023',
    amount: 'KES 78,000',
    status: 'shipped',
    type: 'standard',
  },
  {
    id: '#ORD-9790',
    buyer: 'David M.',
    product: 'Custom Walnut Desk',
    date: 'Oct 14, 2023',
    amount: 'KES 210,000',
    status: 'crafting',
    type: 'custom',
  },
  {
    id: '#ORD-9744',
    buyer: 'Amara O.',
    product: 'Magma Coffee Table',
    date: 'Oct 10, 2023',
    amount: 'KES 54,000',
    status: 'confirmed',
    type: 'standard',
  },
];

const CUSTOM_REQUESTS = [
  {
    id: '#CR-1021',
    buyer: 'Fatima Al-Hassan',
    title: 'Custom Akan Throne Chair',
    category: 'Furniture',
    vision: 'A sculpted throne chair inspired by Akan royal seats, with hand-carved kente patterns on the backrest and solid mahogany frame. Gold leaf on the armrests.',
    materials: ['Solid Mahogany', '24k Gold Leaf'],
    budget: 'KES 180,000',
    timeline: '6–8 weeks',
    status: 'pending',
    date: 'Oct 24, 2023',
    hasAiRender: true,
    renderImg: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300',
  },
  {
    id: '#CR-1019',
    buyer: 'Kofi Mensah',
    title: 'Reclaimed Wood Dining Table',
    category: 'Furniture',
    vision: 'Large 8-seater dining table in reclaimed oak with live edge design. Natural finish, no stain. Steel hairpin legs.',
    materials: ['Reclaimed Oak', 'Steel'],
    budget: 'KES 95,000',
    timeline: '4–6 weeks',
    status: 'quoted',
    quotedAmount: 'KES 112,000',
    date: 'Oct 20, 2023',
    hasAiRender: false,
    renderImg: null,
  },
];

const PAYOUTS = [
  { month: 'March 2026',    amount: 'KES 18,200', status: 'pending', method: 'M-Pesa' },
  { month: 'February 2026', amount: 'KES 24,500', status: 'paid',    method: 'M-Pesa' },
  { month: 'January 2026',  amount: 'KES 19,800', status: 'paid',    method: 'M-Pesa' },
  { month: 'December 2025', amount: 'KES 31,000', status: 'paid',    method: 'M-Pesa' },
];

const chartData = [
  { month: 'Oct', sales: 54000  },
  { month: 'Nov', sales: 78000  },
  { month: 'Dec', sales: 125000 },
  { month: 'Jan', sales: 92000  },
  { month: 'Feb', sales: 110000 },
  { month: 'Mar', sales: 125000 },
];
const maxSales = Math.max(...chartData.map(d => d.sales));

const statusConfig = {
  active:       { label: 'Active',        color: 'text-green-400',  bg: 'bg-green-900 bg-opacity-30',  border: 'border-green-800'  },
  out_of_stock: { label: 'Out of Stock',  color: 'text-red-400',    bg: 'bg-red-900 bg-opacity-30',    border: 'border-red-800'    },
  draft:        { label: 'Draft',         color: 'text-gray-400',   bg: 'bg-gray-800 bg-opacity-50',   border: 'border-gray-700'   },
  delivered:    { label: 'Delivered',     color: 'text-green-400',  bg: 'bg-green-900 bg-opacity-30',  border: 'border-green-800'  },
  shipped:      { label: 'Shipped',       color: 'text-blue-400',   bg: 'bg-blue-900 bg-opacity-30',   border: 'border-blue-800'   },
  crafting:     { label: 'Crafting',      color: 'text-yellow-400', bg: 'bg-yellow-900 bg-opacity-30', border: 'border-yellow-800' },
  confirmed:    { label: 'Confirmed',     color: 'text-purple-400', bg: 'bg-purple-900 bg-opacity-30', border: 'border-purple-800' },
  pending:      { label: 'Pending Quote', color: 'text-yellow-400', bg: 'bg-yellow-900 bg-opacity-30', border: 'border-yellow-800' },
  quoted:       { label: 'Quote Sent',    color: 'text-blue-400',   bg: 'bg-blue-900 bg-opacity-30',   border: 'border-blue-800'   },
};

const navItems = [
  { key: 'overview',  label: 'Overview',         icon: '▦'  },
  { key: 'products',  label: 'My Products',       icon: '◈'  },
  { key: 'orders',    label: 'Orders',            icon: '◎'  },
  { key: 'custom',    label: 'Custom Requests',   icon: '✦'  },
  { key: 'analytics', label: 'Analytics',         icon: '↗'  },
  { key: 'payouts',   label: 'Payouts',           icon: '◈'  },
  { key: 'settings',  label: 'Shop Settings',     icon: '⚙'  },
];

// ── COMPONENT ─────────────────────────────────────────────
const VendorDashboard = () => {
  const [activePage, setActivePage]   = useState('overview');
  const [products, setProducts]       = useState(PRODUCTS);
  const [orders, setOrders]           = useState(ORDERS);
  const [customRequests, setCustomRequests] = useState(CUSTOM_REQUESTS);

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct]     = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Furniture', price: '', stock: '', description: '', materials: '', status: 'active',
  });

  // Quote modal
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quotingRequest, setQuotingRequest] = useState(null);
  const [quoteForm, setQuoteForm]           = useState({ amount: '', timeline: '', notes: '' });

  // Order status update
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Payout modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm]           = useState({ method: 'M-Pesa', number: VENDOR.mpesa });
  const [payoutSaved, setPayoutSaved]         = useState(false);

  // ── PRODUCT HANDLERS ──────────────────────────────────
  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Furniture', price: '', stock: '', description: '', materials: '', status: 'active' });
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.priceNum.toString(),
      stock: product.stock.toString(),
      description: product.description,
      materials: product.materials.join(', '),
      status: product.status,
    });
    setShowProductModal(true);
  };

  const saveProduct = () => {
    if (!productForm.name.trim() || !productForm.price) return;
    if (editingProduct) {
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id ? {
          ...p,
          name: productForm.name,
          category: productForm.category,
          price: `KES ${Number(productForm.price).toLocaleString()}`,
          priceNum: Number(productForm.price),
          stock: Number(productForm.stock),
          description: productForm.description,
          materials: productForm.materials.split(',').map(m => m.trim()),
          status: productForm.status,
        } : p
      ));
    } else {
      const newProduct = {
        id: `p${Date.now()}`,
        name: productForm.name,
        category: productForm.category,
        price: `KES ${Number(productForm.price).toLocaleString()}`,
        priceNum: Number(productForm.price),
        stock: Number(productForm.stock),
        status: productForm.status,
        views: 0,
        orders: 0,
        img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300',
        description: productForm.description,
        materials: productForm.materials.split(',').map(m => m.trim()),
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setShowProductModal(false);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const toggleProductStatus = (id) => {
    setProducts(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'active' ? 'draft' : 'active' }
        : p
    ));
  };

  // ── ORDER HANDLERS ────────────────────────────────────
  const ORDER_STATUSES = ['confirmed', 'crafting', 'shipped', 'delivered'];

  const advanceOrder = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const idx = ORDER_STATUSES.indexOf(o.status);
      const next = ORDER_STATUSES[Math.min(idx + 1, ORDER_STATUSES.length - 1)];
      return { ...o, status: next };
    }));
    setUpdatingOrder(null);
  };

  // ── CUSTOM REQUEST HANDLERS ───────────────────────────
  const openQuoteModal = (request) => {
    setQuotingRequest(request);
    setQuoteForm({ amount: '', timeline: '', notes: '' });
    setShowQuoteModal(true);
  };

  const sendQuote = () => {
    if (!quoteForm.amount.trim()) return;
    setCustomRequests(prev => prev.map(r =>
      r.id === quotingRequest.id
        ? { ...r, status: 'quoted', quotedAmount: `KES ${quoteForm.amount}` }
        : r
    ));
    setShowQuoteModal(false);
  };

  const declineRequest = (id) => {
    setCustomRequests(prev => prev.filter(r => r.id !== id));
  };

  // ── PAYOUT HANDLER ────────────────────────────────────
  const savePayoutDetails = () => {
    setPayoutSaved(true);
    setTimeout(() => { setPayoutSaved(false); setShowPayoutModal(false); }, 1500);
  };

  // ── SHARED HELPERS ────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const sc = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${sc.color} ${sc.bg} ${sc.border}`}>
        {sc.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen text-white flex" style={{ backgroundColor: '#1a1500' }}>

      {/* ── PRODUCT MODAL ─────────────────────────────── */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="rounded-2xl border border-gray-800 w-full max-w-lg" style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h3 className="text-white font-black text-lg uppercase">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Product Name</label>
                  <input type="text" value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Obsidian Throne v.3"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Category</label>
                  <select value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                    style={{ backgroundColor: '#2a2000' }}>
                    <option>Furniture</option>
                    <option>Fashion</option>
                    <option>Beads & Jewelry</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Status</label>
                  <select value={productForm.status}
                    onChange={e => setProductForm({ ...productForm, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                    style={{ backgroundColor: '#2a2000' }}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Price (KES)</label>
                  <input type="number" value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 125000"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Stock Quantity</label>
                  <input type="number" value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="e.g. 3"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
                <div className="col-span-2">
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Description</label>
                  <textarea value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition resize-none placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
                <div className="col-span-2">
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                    Materials (comma-separated)
                  </label>
                  <input type="text" value={productForm.materials}
                    onChange={e => setProductForm({ ...productForm, materials: e.target.value })}
                    placeholder="e.g. Teak Wood, 24k Gold Leaf, Obsidian"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowProductModal(false)}
                  className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition">
                  Cancel
                </button>
                <button onClick={saveProduct}
                  disabled={!productForm.name.trim() || !productForm.price}
                  className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition disabled:opacity-40">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QUOTE MODAL ───────────────────────────────── */}
      {showQuoteModal && quotingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl border border-gray-800 w-full max-w-md" style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h3 className="text-white font-black text-lg uppercase">Send Quote</h3>
              <button onClick={() => setShowQuoteModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6">
              <div className="rounded-xl border border-gray-800 p-4 mb-5" style={{ backgroundColor: '#2a2000' }}>
                <p className="text-yellow-400 font-black text-xs mb-1">{quotingRequest.id} · {quotingRequest.buyer}</p>
                <p className="text-white font-black text-sm mb-1">{quotingRequest.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{quotingRequest.vision}</p>
                <p className="text-gray-500 text-xs mt-2">Buyer's budget: <span className="text-yellow-400 font-black">{quotingRequest.budget}</span></p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Your Quote (KES)</label>
                  <input type="number" value={quoteForm.amount}
                    onChange={e => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                    placeholder="e.g. 185000"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Timeline</label>
                  <select value={quoteForm.timeline}
                    onChange={e => setQuoteForm({ ...quoteForm, timeline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                    style={{ backgroundColor: '#2a2000' }}>
                    <option value="">Select timeline</option>
                    <option>1–2 weeks</option>
                    <option>2–4 weeks</option>
                    <option>4–6 weeks</option>
                    <option>6–8 weeks</option>
                    <option>8–12 weeks</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Message to Buyer (optional)</label>
                  <textarea value={quoteForm.notes}
                    onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    placeholder="Add any notes about your approach, materials, or process..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition resize-none placeholder-gray-700"
                    style={{ backgroundColor: '#2a2000' }} />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowQuoteModal(false)}
                  className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-sm hover:border-yellow-400 transition">
                  Cancel
                </button>
                <button onClick={sendQuote}
                  disabled={!quoteForm.amount}
                  className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition disabled:opacity-40">
                  Send Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl border border-gray-800 p-8 max-w-sm w-full text-center" style={{ backgroundColor: '#1a1a00' }}>
            <p className="text-3xl mb-4">🗑</p>
            <h3 className="text-white font-black text-lg mb-2">Delete this product?</h3>
            <p className="text-gray-400 text-sm mb-6">This cannot be undone. The product will be permanently removed from your shop.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-sm hover:border-yellow-400 transition">
                Cancel
              </button>
              <button onClick={() => deleteProduct(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-sm hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDER STATUS MODAL ────────────────────────── */}
      {updatingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl border border-gray-800 p-6 max-w-sm w-full" style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black text-sm uppercase">Update Order Status</h3>
              <button onClick={() => setUpdatingOrder(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <p className="text-gray-400 text-xs mb-4">
              Order <span className="text-yellow-400 font-black">{updatingOrder.id}</span> — {updatingOrder.product}
            </p>
            <div className="space-y-2 mb-5">
              {ORDER_STATUSES.map(status => {
                const sc = statusConfig[status];
                const isCurrent = updatingOrder.status === status;
                const isDone = ORDER_STATUSES.indexOf(status) < ORDER_STATUSES.indexOf(updatingOrder.status);
                return (
                  <div key={status}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                      isCurrent ? 'border-yellow-400 bg-yellow-400 bg-opacity-10' :
                      isDone ? 'border-green-800 bg-green-900 bg-opacity-20' :
                      'border-gray-800'
                    }`}>
                    <span className={`text-sm ${isDone ? 'text-green-400' : isCurrent ? 'text-yellow-400' : 'text-gray-600'}`}>
                      {isDone ? '✓' : isCurrent ? '●' : '○'}
                    </span>
                    <span className={`text-sm font-black ${isCurrent ? 'text-yellow-400' : isDone ? 'text-green-400' : 'text-gray-600'}`}>
                      {sc.label}
                    </span>
                    {isCurrent && <span className="text-yellow-400 text-xs ml-auto">Current</span>}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => advanceOrder(updatingOrder.id)}
              disabled={updatingOrder.status === 'delivered'}
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition disabled:opacity-40">
              {updatingOrder.status === 'delivered' ? 'Order Complete' : `Mark as ${statusConfig[ORDER_STATUSES[ORDER_STATUSES.indexOf(updatingOrder.status) + 1]]?.label || 'Complete'}`}
            </button>
          </div>
        </div>
      )}

      {/* ── PAYOUT MODAL ──────────────────────────────── */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl border border-gray-800 p-6 max-w-md w-full" style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black text-lg uppercase">Payout Settings</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Payout Method</label>
                <select value={payoutForm.method}
                  onChange={e => setPayoutForm({ ...payoutForm, method: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                  style={{ backgroundColor: '#2a2000' }}>
                  <option>M-Pesa</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              {payoutForm.method === 'M-Pesa' && (
                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Safaricom Number</label>
                  <div className="flex items-center border border-gray-700 focus-within:border-yellow-400 rounded-xl overflow-hidden transition"
                    style={{ backgroundColor: '#2a2000' }}>
                    <span className="text-gray-500 text-sm px-4 border-r border-gray-700 py-3">+254</span>
                    <input type="text"
                      value={payoutForm.number.replace('+254', '').trim()}
                      onChange={e => setPayoutForm({ ...payoutForm, number: `+254 ${e.target.value}` })}
                      placeholder="7XX XXX XXX"
                      className="flex-1 bg-transparent text-white text-sm px-4 py-3 outline-none placeholder-gray-700" />
                  </div>
                </div>
              )}
              {payoutForm.method === 'Bank Transfer' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Bank Name</label>
                    <input type="text" placeholder="e.g. Equity Bank Kenya"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Account Number</label>
                    <input type="text" placeholder="Your account number"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                </div>
              )}
              <p className="text-gray-600 text-xs">Payouts are processed on the 1st of each month after the platform's 8% commission is deducted.</p>
              <button onClick={savePayoutDetails}
                className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                {payoutSaved ? '✓ Settings Saved!' : 'Save Payout Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ───────────────────────────────────── */}
      <div className="w-56 flex-shrink-0 border-r border-gray-800 flex flex-col py-6"
        style={{ backgroundColor: '#0d0d00' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-5 mb-8">
          <span className="bg-yellow-400 text-black w-7 h-7 rounded flex items-center justify-center text-xs font-black">57</span>
          <span className="text-white font-black text-sm">Vendor Portal</span>
        </Link>

        {/* Nav */}
        <div className="flex-1 space-y-0.5 px-3">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActivePage(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                activePage === item.key
                  ? 'bg-yellow-400 bg-opacity-15 text-yellow-400 font-black'
                  : 'text-gray-500 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}>
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              {item.label}
              {item.key === 'custom' && customRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-auto bg-yellow-400 text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {customRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
              {item.key === 'orders' && orders.filter(o => o.status === 'confirmed').length > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {orders.filter(o => o.status === 'confirmed').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Vendor info */}
        <div className="px-3 pt-4 border-t border-gray-800 mt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-xs flex-shrink-0">
              {VENDOR.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-xs truncate">{VENDOR.name}</p>
              <p className="text-gray-600 text-xs truncate">{VENDOR.tier}</p>
            </div>
          </div>
          <Link to="/"
            className="mt-3 w-full flex items-center justify-center gap-1 text-gray-600 text-xs hover:text-yellow-400 transition px-2 py-2">
            ← Back to store
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* ══ OVERVIEW ════════════════════════════════ */}
        {activePage === 'overview' && (
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-white font-black text-2xl uppercase mb-1">Shop Overview</h1>
                <p className="text-gray-500 text-sm">Welcome back, {VENDOR.name}. Here's your shop performance.</p>
              </div>
              <button onClick={openNewProduct}
                className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                + Add Product
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Revenue',   value: VENDOR.totalSales,  sub: 'All time',         icon: '💰', color: 'text-yellow-400' },
                { label: 'Total Orders',    value: VENDOR.totalOrders, sub: 'Completed + active', icon: '📦', color: 'text-white'      },
                { label: 'Pending Payout',  value: VENDOR.pendingPayout, sub: `Due ${VENDOR.nextPayout}`, icon: '⏳', color: 'text-green-400' },
                { label: 'Shop Rating',     value: `${VENDOR.rating}/5`, sub: `${VENDOR.reviews} reviews`, icon: '⭐', color: 'text-white'  },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-5 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-gray-600 text-xs">{s.sub}</span>
                  </div>
                  <p className={`font-black text-2xl mb-1 ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-5">

              {/* Revenue chart */}
              <div className="col-span-2 rounded-2xl border border-gray-800 p-6" style={{ backgroundColor: '#1a1a00' }}>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-white font-black text-sm uppercase tracking-widest">Revenue — Last 6 Months</p>
                  <span className="text-gray-600 text-xs">KES</span>
                </div>
                <div className="flex items-end gap-3" style={{ height: '140px' }}>
                  {chartData.map(d => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-yellow-400 bg-opacity-80 hover:bg-opacity-100 transition cursor-pointer"
                        style={{ height: `${(d.sales / maxSales) * 120}px` }}
                        title={`KES ${d.sales.toLocaleString()}`}
                      />
                      <span className="text-gray-600 text-xs">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-gray-800 p-6" style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-white font-black text-sm uppercase tracking-widest mb-4">Quick Actions</p>
                <div className="space-y-3">
                  {[
                    { label: 'Add new product',       action: openNewProduct,                icon: '+' },
                    { label: 'View custom requests',  action: () => setActivePage('custom'), icon: '✦' },
                    { label: 'Update order status',   action: () => setActivePage('orders'), icon: '↑' },
                    { label: 'Check payouts',         action: () => setActivePage('payouts'), icon: '₹' },
                    { label: 'View analytics',        action: () => setActivePage('analytics'), icon: '↗' },
                  ].map(qa => (
                    <button key={qa.label} onClick={qa.action}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-800 text-left hover:border-yellow-400 hover:text-yellow-400 transition text-gray-400 text-sm"
                      style={{ backgroundColor: '#2a2000' }}>
                      <span className="text-yellow-400 font-black w-4 text-center">{qa.icon}</span>
                      {qa.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent orders */}
              <div className="col-span-2 rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                  <p className="text-white font-black text-sm uppercase tracking-widest">Recent Orders</p>
                  <button onClick={() => setActivePage('orders')} className="text-yellow-400 text-xs font-black hover:underline">
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-800">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div>
                        <p className="text-white font-black text-xs">{order.product}</p>
                        <p className="text-gray-600 text-xs">{order.id} · {order.buyer}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <span className="text-yellow-400 font-black text-xs">{order.amount}</span>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending custom requests */}
              <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                  <p className="text-white font-black text-sm uppercase tracking-widest">Custom Requests</p>
                  <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {customRequests.filter(r => r.status === 'pending').length} pending
                  </span>
                </div>
                <div className="divide-y divide-gray-800">
                  {customRequests.slice(0, 2).map(req => (
                    <div key={req.id} className="px-5 py-4">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-white font-black text-xs">{req.title}</p>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-gray-500 text-xs mb-2">from {req.buyer} · {req.budget}</p>
                      {req.status === 'pending' && (
                        <button onClick={() => { setActivePage('custom'); openQuoteModal(req); }}
                          className="text-yellow-400 text-xs font-black hover:underline">
                          Send Quote →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ PRODUCTS ════════════════════════════════ */}
        {activePage === 'products' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white font-black text-2xl uppercase mb-1">My Products</h1>
                <p className="text-gray-500 text-sm">{products.length} products in your shop</p>
              </div>
              <button onClick={openNewProduct}
                className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                + Add Product
              </button>
            </div>

            {/* Product status summary */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total',        count: products.length,                                  color: 'text-white'      },
                { label: 'Active',       count: products.filter(p => p.status === 'active').length,        color: 'text-green-400'  },
                { label: 'Out of Stock', count: products.filter(p => p.status === 'out_of_stock').length,  color: 'text-red-400'    },
                { label: 'Drafts',       count: products.filter(p => p.status === 'draft').length,         color: 'text-gray-400'   },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-gray-800 p-4 text-center" style={{ backgroundColor: '#1a1a00' }}>
                  <p className={`font-black text-2xl ${s.color}`}>{s.count}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 gap-5">
              {products.map(product => (
                <div key={product.id}
                  className="rounded-2xl border border-gray-800 overflow-hidden group"
                  style={{ backgroundColor: '#1a1a00' }}>
                  <div className="relative" style={{ height: '180px' }}>
                    <img src={product.img} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={product.status} />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button onClick={() => openEditProduct(product)}
                        className="w-8 h-8 bg-black bg-opacity-60 rounded-lg flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition text-xs font-black">
                        ✎
                      </button>
                      <button onClick={() => setDeleteConfirm(product.id)}
                        className="w-8 h-8 bg-black bg-opacity-60 rounded-lg flex items-center justify-center text-white hover:bg-red-500 transition text-xs font-black">
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-black text-sm">{product.name}</p>
                        <p className="text-gray-500 text-xs">{product.category}</p>
                      </div>
                      <p className="text-yellow-400 font-black text-sm">{product.price}</p>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>👁 {product.views}</span>
                        <span>📦 {product.orders} orders</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                      <button
                        onClick={() => toggleProductStatus(product.id)}
                        className="text-xs border border-gray-700 text-gray-400 px-3 py-1 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition font-black">
                        {product.status === 'active' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add product card */}
              <button onClick={openNewProduct}
                className="rounded-2xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center p-10 hover:border-yellow-400 hover:bg-yellow-400 hover:bg-opacity-5 transition group"
                style={{ minHeight: '280px' }}>
                <span className="text-4xl mb-3 group-hover:scale-110 transition">+</span>
                <p className="text-gray-500 font-black text-sm group-hover:text-yellow-400 transition">Add New Product</p>
              </button>
            </div>
          </div>
        )}

        {/* ══ ORDERS ══════════════════════════════════ */}
        {activePage === 'orders' && (
          <div className="p-8">
            <h1 className="text-white font-black text-2xl uppercase mb-1">Orders</h1>
            <p className="text-gray-500 text-sm mb-6">{orders.length} orders total</p>

            {/* Status filter chips */}
            <div className="flex gap-2 mb-6">
              {['All', 'confirmed', 'crafting', 'shipped', 'delivered'].map(f => (
                <span key={f}
                  className="px-3 py-1.5 rounded-full text-xs font-black border border-gray-700 text-gray-400 cursor-default">
                  {f === 'All' ? `All (${orders.length})` : `${statusConfig[f]?.label} (${orders.filter(o => o.status === f).length})`}
                </span>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
              {/* Table header */}
              <div className="grid grid-cols-6 px-5 py-3 border-b border-gray-800 bg-gray-800 bg-opacity-30">
                {['Order ID', 'Product', 'Buyer', 'Amount', 'Status', 'Action'].map(h => (
                  <p key={h} className="text-gray-500 text-xs font-black uppercase tracking-widest">{h}</p>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-800">
                {orders.map(order => (
                  <div key={order.id} className="grid grid-cols-6 px-5 py-4 items-center hover:bg-white hover:bg-opacity-5 transition">
                    <div>
                      <p className="text-white font-black text-xs">{order.id}</p>
                      <p className="text-gray-600 text-xs">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-white text-xs font-black">{order.product}</p>
                      {order.type === 'custom' && (
                        <span className="text-yellow-600 text-xs font-black">Custom</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">{order.buyer}</p>
                    <p className="text-yellow-400 font-black text-xs">{order.amount}</p>
                    <StatusBadge status={order.status} />
                    <button
                      onClick={() => setUpdatingOrder(order)}
                      disabled={order.status === 'delivered'}
                      className="border border-gray-700 text-gray-400 px-3 py-1.5 rounded-xl text-xs font-black hover:border-yellow-400 hover:text-yellow-400 transition disabled:opacity-30 disabled:cursor-not-allowed">
                      {order.status === 'delivered' ? 'Done ✓' : 'Update Status'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ CUSTOM REQUESTS ═════════════════════════ */}
        {activePage === 'custom' && (
          <div className="p-8">
            <h1 className="text-white font-black text-2xl uppercase mb-1">Custom Requests</h1>
            <p className="text-gray-500 text-sm mb-6">
              {customRequests.filter(r => r.status === 'pending').length} pending · {customRequests.filter(r => r.status === 'quoted').length} quotes sent
            </p>

            <div className="space-y-5">
              {customRequests.map(req => (
                <div key={req.id} className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
                  <div className="grid grid-cols-3">

                    {/* AI Render or placeholder */}
                    <div className="relative" style={{ height: '200px' }}>
                      {req.hasAiRender && req.renderImg ? (
                        <img src={req.renderImg} alt="AI Render" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center"
                          style={{ backgroundColor: '#2a2000' }}>
                          <span className="text-4xl mb-2">🎨</span>
                          <p className="text-gray-600 text-xs">No AI render</p>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>

                    {/* Request details */}
                    <div className="col-span-2 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-gray-500 text-xs font-black">{req.id} · {req.date}</p>
                          <h3 className="text-white font-black text-base mt-0.5">{req.title}</h3>
                          <p className="text-yellow-400 text-xs font-black">from {req.buyer} · Budget: {req.budget}</p>
                        </div>
                      </div>

                      <p className="text-gray-400 text-xs leading-relaxed mb-3">{req.vision}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {req.materials.map(m => (
                          <span key={m} className="text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-400"
                            style={{ backgroundColor: '#2a2000' }}>
                            {m}
                          </span>
                        ))}
                      </div>

                      {req.status === 'quoted' && (
                        <div className="rounded-xl border border-blue-800 p-3 mb-3"
                          style={{ backgroundColor: '#0a1520' }}>
                          <p className="text-blue-400 text-xs font-black">✓ Quote sent: {req.quotedAmount}</p>
                          <p className="text-gray-500 text-xs mt-0.5">Waiting for buyer to accept</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={() => openQuoteModal(req)}
                              className="flex-1 bg-yellow-400 text-black py-2.5 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                              Send Quote
                            </button>
                            <button onClick={() => declineRequest(req.id)}
                              className="border border-red-800 text-red-400 px-4 py-2.5 rounded-xl font-black text-xs hover:bg-red-500 hover:bg-opacity-20 transition">
                              Decline
                            </button>
                          </>
                        )}
                        {req.status === 'quoted' && (
                          <button onClick={() => openQuoteModal(req)}
                            className="border border-gray-700 text-gray-400 px-4 py-2.5 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
                            Revise Quote
                          </button>
                        )}
                        <Link to="/artisan-chat"
                          className="flex items-center gap-1 border border-gray-700 text-gray-400 px-4 py-2.5 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
                          💬 Message Buyer
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {customRequests.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
                  style={{ backgroundColor: '#1a1a00' }}>
                  <p className="text-gray-500 text-sm">No custom requests yet. They'll appear here when buyers submit briefs for your shop.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ ANALYTICS ═══════════════════════════════ */}
        {activePage === 'analytics' && (
          <div className="p-8">
            <h1 className="text-white font-black text-2xl uppercase mb-1">Analytics</h1>
            <p className="text-gray-500 text-sm mb-6">Shop performance insights</p>

            {/* Top level metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total product views', value: products.reduce((a, b) => a + b.views, 0), sub: 'All products combined' },
                { label: 'Avg conversion rate',  value: '11.4%', sub: 'Views → orders'           },
                { label: 'Top selling product',  value: 'Vanguard Teak Chair', sub: '12 orders'  },
              ].map(m => (
                <div key={m.label} className="rounded-2xl border border-gray-800 p-5" style={{ backgroundColor: '#1a1a00' }}>
                  <p className="text-gray-500 text-xs mb-2">{m.label}</p>
                  <p className="text-white font-black text-2xl mb-0.5">{m.value}</p>
                  <p className="text-gray-600 text-xs">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="rounded-2xl border border-gray-800 p-6 mb-5" style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-white font-black text-sm uppercase tracking-widest mb-6">Monthly Revenue (KES)</p>
              <div className="flex items-end gap-4" style={{ height: '160px' }}>
                {chartData.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-gray-600 text-xs">{(d.sales / 1000).toFixed(0)}K</p>
                    <div className="w-full rounded-t-md bg-yellow-400 bg-opacity-70 hover:bg-opacity-100 transition"
                      style={{ height: `${(d.sales / maxSales) * 110}px` }} />
                    <span className="text-gray-600 text-xs">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product performance table */}
            <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
              <div className="p-5 border-b border-gray-800">
                <p className="text-white font-black text-sm uppercase tracking-widest">Product Performance</p>
              </div>
              <div className="grid grid-cols-5 px-5 py-3 border-b border-gray-800 bg-gray-800 bg-opacity-30">
                {['Product', 'Views', 'Orders', 'Revenue', 'Conversion'].map(h => (
                  <p key={h} className="text-gray-500 text-xs font-black uppercase tracking-widest">{h}</p>
                ))}
              </div>
              <div className="divide-y divide-gray-800">
                {products.map(p => (
                  <div key={p.id} className="grid grid-cols-5 px-5 py-3.5 items-center">
                    <p className="text-white font-black text-xs">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.views}</p>
                    <p className="text-gray-400 text-xs">{p.orders}</p>
                    <p className="text-yellow-400 font-black text-xs">
                      KES {(p.priceNum * p.orders).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${p.views > 0 ? Math.min((p.orders / p.views) * 100 * 3, 100) : 0}%` }} />
                      </div>
                      <span className="text-gray-500 text-xs">
                        {p.views > 0 ? ((p.orders / p.views) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ PAYOUTS ═════════════════════════════════ */}
        {activePage === 'payouts' && (
          <div className="p-8">
            <h1 className="text-white font-black text-2xl uppercase mb-1">Payouts</h1>
            <p className="text-gray-500 text-sm mb-6">Monthly payout history and settings</p>

            <div className="grid grid-cols-2 gap-5 mb-6">

              {/* Next payout */}
              <div className="rounded-2xl border border-yellow-900 p-6" style={{ backgroundColor: '#2a2000' }}>
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-3">Next Payout</p>
                <p className="text-white font-black text-3xl mb-1">{VENDOR.pendingPayout}</p>
                <p className="text-gray-400 text-sm mb-1">Scheduled for {VENDOR.nextPayout}</p>
                <p className="text-gray-600 text-xs mb-4">After platform commission: 8% = KES 1,456 deducted</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-yellow-900">
                  <span>📱</span>
                  <span>M-Pesa · {VENDOR.mpesa}</span>
                </div>
              </div>

              {/* Payout settings */}
              <div className="rounded-2xl border border-gray-800 p-6" style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-gray-500 font-black text-xs uppercase tracking-widest mb-4">Payout Settings</p>
                <div className="space-y-3 mb-5">
                  {[
                    { label: 'Method',          value: 'M-Pesa'             },
                    { label: 'Number',           value: VENDOR.mpesa         },
                    { label: 'Schedule',         value: 'Monthly (1st)'      },
                    { label: 'Commission rate',  value: `${VENDOR.commission}%` },
                    { label: 'Minimum payout',   value: 'KES 1,000'          },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between border-b border-gray-800 pb-2.5 last:border-0">
                      <span className="text-gray-500 text-xs">{s.label}</span>
                      <span className="text-white font-black text-xs">{s.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowPayoutModal(true)}
                  className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
                  Update Payout Settings
                </button>
              </div>
            </div>

            {/* Payout history */}
            <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
              <div className="p-5 border-b border-gray-800">
                <p className="text-white font-black text-sm uppercase tracking-widest">Payout History</p>
              </div>
              <div className="divide-y divide-gray-800">
                {PAYOUTS.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${
                        p.status === 'paid'
                          ? 'bg-green-500 bg-opacity-20 text-green-400'
                          : 'bg-yellow-400 bg-opacity-20 text-yellow-400'
                      }`}>
                        {p.status === 'paid' ? '✓' : '⏳'}
                      </div>
                      <div>
                        <p className="text-white font-black text-sm">{p.month}</p>
                        <p className="text-gray-600 text-xs">{p.method} · {VENDOR.mpesa}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-yellow-400 font-black text-sm">{p.amount}</p>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        p.status === 'paid'
                          ? 'bg-green-500 bg-opacity-20 text-green-400'
                          : 'bg-yellow-400 bg-opacity-20 text-yellow-400'
                      }`}>
                        {p.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ SETTINGS ════════════════════════════════ */}
        {activePage === 'settings' && (
          <div className="p-8">
            <h1 className="text-white font-black text-2xl uppercase mb-1">Shop Settings</h1>
            <p className="text-gray-500 text-sm mb-6">Manage your shop profile and preferences</p>

            <div className="grid grid-cols-2 gap-5">

              {/* Shop profile */}
              <div className="rounded-2xl border border-gray-800 p-6" style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-white font-black text-sm uppercase tracking-widest mb-5">Shop Profile</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Shop Name</label>
                    <input defaultValue={VENDOR.shop}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Craft Category</label>
                    <select defaultValue={VENDOR.craft}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                      style={{ backgroundColor: '#2a2000' }}>
                      <option>Furniture & Woodwork</option>
                      <option>Fashion & Apparel</option>
                      <option>Beads & Jewellery</option>
                      <option>Metalwork & Sculpture</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Shop Bio</label>
                    <textarea rows={4} defaultValue="Master craftsman specialising in teak furniture with obsidian and gold leaf detailing. 20+ years of experience."
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition resize-none"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <button className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                    Save Shop Profile
                  </button>
                </div>
              </div>

              {/* Notifications + preferences */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-gray-800 p-6" style={{ backgroundColor: '#1a1a00' }}>
                  <p className="text-white font-black text-sm uppercase tracking-widest mb-4">Notifications</p>
                  <div className="space-y-3">
                    {[
                      { label: 'New orders',          desc: 'Get notified when a buyer places an order'      },
                      { label: 'Custom requests',     desc: 'Get notified when a brief is submitted'         },
                      { label: 'Buyer messages',      desc: 'Get notified of new chat messages'              },
                      { label: 'Payout notifications', desc: 'Get notified when a payout is processed'      },
                    ].map((n, i) => (
                      <div key={n.label} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                        <div>
                          <p className="text-white font-black text-xs">{n.label}</p>
                          <p className="text-gray-600 text-xs">{n.desc}</p>
                        </div>
                        <div className="w-10 h-5 bg-yellow-400 rounded-full relative cursor-pointer flex-shrink-0">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-800 p-6" style={{ backgroundColor: '#1a1a00' }}>
                  <p className="text-white font-black text-sm uppercase tracking-widest mb-4">Account Info</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Vendor since',  value: VENDOR.since          },
                      { label: 'Tier',          value: VENDOR.tier           },
                      { label: 'Commission',    value: `${VENDOR.commission}% per sale` },
                      { label: 'Rating',        value: `${VENDOR.rating}/5 (${VENDOR.reviews} reviews)` },
                      { label: 'Verified',      value: VENDOR.verified ? '✓ Verified' : 'Pending'       },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between border-b border-gray-800 pb-2 last:border-0">
                        <span className="text-gray-500 text-xs">{r.label}</span>
                        <span className={`text-xs font-black ${r.value.startsWith('✓') ? 'text-green-400' : 'text-white'}`}>
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;