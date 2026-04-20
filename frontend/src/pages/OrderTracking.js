import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c',
  cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
  green: '#4ade80', red: '#f87171', blue: '#60a5fa',
};

const fmt = (n) => `KSH ${Number(n).toLocaleString()}`;

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_LABELS = {
  pending:    'Order Placed',
  confirmed:  'Confirmed',
  processing: 'Crafting',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};
const STATUS_ICONS = {
  pending:    '📋',
  confirmed:  '✓',
  processing: '🎨',
  shipped:    '🚚',
  delivered:  '📦',
  cancelled:  '✕',
};
const STATUS_COLOR = {
  pending:    C.gold,
  confirmed:  C.blue,
  processing: C.gold,
  shipped:    C.blue,
  delivered:  C.green,
  cancelled:  C.red,
};

/* ─── MODAL ─── */
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}
    onClick={onClose}>
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
      onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 15 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

/* ─── CANCEL MODAL ─── */
const CancelModal = ({ order, onClose, onCancelled }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const reasons = ['Changed my mind', 'Found a better price elsewhere', 'Ordered by mistake', 'Delivery time too long', 'Other'];

  const handleSubmit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      await orderAPI.cancel(order._id, reason);
      setDone(true);
      onCancelled();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Cancel Order" onClose={onClose}>
      {!done ? (
        <>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
            Cancel order <strong style={{ color: C.cream }}>#{order.orderNumber}</strong>? This may affect your refund eligibility.
          </p>
          <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Reason</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {reasons.map(r => (
              <button key={r} onClick={() => setReason(r)}
                style={{ textAlign: 'left', fontSize: 12, padding: '10px 14px', borderRadius: 10, border: `1px solid ${reason === r ? C.red : C.border}`, backgroundColor: reason === r ? 'rgba(248,113,113,0.08)' : 'transparent', color: reason === r ? C.red : C.muted, cursor: 'pointer', fontWeight: 700 }}>
                {r}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose}
              style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.cream, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
              Keep Order
            </button>
            <button onClick={handleSubmit} disabled={!reason || loading}
              style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', backgroundColor: reason && !loading ? C.red : C.muted, color: '#000', fontWeight: 900, fontSize: 12, cursor: reason && !loading ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>✓</p>
          <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 8 }}>Cancellation Submitted</p>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Our team will process it within 24 hours.</p>
          <button onClick={onClose}
            style={{ padding: '11px 24px', borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.cream, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

/* ─── INVOICE MODAL ─── */
const InvoiceModal = ({ order, onClose }) => (
  <Modal title="Invoice" onClose={onClose}>
    <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16, fontSize: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
          <div>
            <p style={{ color: C.cream, fontWeight: 900 }}>57 Arts & Customs</p>
            <p style={{ color: C.muted, fontSize: 10 }}>info@57artscustoms.com</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: C.gold, fontWeight: 900 }}>INVOICE</p>
          <p style={{ color: C.muted }}>#{order.orderNumber}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <p style={{ color: C.muted, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Bill To</p>
          <p style={{ color: C.cream, fontWeight: 900 }}>{order.shippingAddress?.fullName}</p>
          <p style={{ color: C.muted }}>{order.shippingAddress?.street}</p>
          <p style={{ color: C.muted }}>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: C.muted, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Date</p>
          <p style={{ color: C.cream, fontWeight: 900 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
          <p style={{ color: C.muted, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8, marginBottom: 4 }}>Payment</p>
          <p style={{ color: C.cream, fontWeight: 900, textTransform: 'capitalize' }}>{order.paymentMethod}</p>
        </div>
      </div>

      <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '8px 12px', backgroundColor: C.surface, color: C.muted, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span>Item</span><span>Amount</span>
        </div>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 12px', borderTop: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.cream, fontWeight: 900 }}>{item.name}</p>
              <p style={{ color: C.muted, fontSize: 10 }}>{item.category} · Qty {item.quantity}</p>
            </div>
            <span style={{ color: C.cream, fontWeight: 900 }}>{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 12px', borderTop: `1px solid ${C.border}` }}>
          <span style={{ color: C.muted }}>Shipping</span>
          <span style={{ color: order.shippingPrice === 0 ? C.green : C.cream, fontWeight: 900 }}>{order.shippingPrice === 0 ? 'Free' : fmt(order.shippingPrice)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${C.border}` }}>
        <span style={{ color: C.cream, fontWeight: 900 }}>TOTAL</span>
        <span style={{ color: C.gold, fontWeight: 900, fontSize: 15 }}>{fmt(order.totalPrice)}</span>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={onClose}
        style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.cream, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
        Close
      </button>
      <button onClick={() => window.print()}
        style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', backgroundColor: C.gold, color: '#000', fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
        🖨 Print / PDF
      </button>
    </div>
  </Modal>
);

/* ═══════════════ MAIN PAGE ═══════════════ */
const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [order, setOrder]           = useState(null);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeTab, setActiveTab]   = useState('timeline');
  const [modal, setModal]           = useState(null);
  // ✅ FIX: removed unused selectedOrder / setSelectedOrder state

  // ✅ FIX: wrapped in useCallback so it can be safely listed as a useEffect dependency
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (id) {
        const { data } = await orderAPI.getById(id);
        setOrder(data.order);
      } else {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data.orders || []);
        if (data.orders?.length > 0) setOrder(data.orders[0]);
      }
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ✅ FIX: fetchData and navigate are now properly listed as dependencies
  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    fetchData();
  }, [id, isLoggedIn, fetchData, navigate]);

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

  const buildTimeline = (o) => {
    const events = [];
    const stepsDone = getStepIndex(o.orderStatus);
    STATUS_STEPS.forEach((s, i) => {
      if (i <= stepsDone) {
        events.unshift({
          icon:  STATUS_ICONS[s],
          title: STATUS_LABELS[s],
          desc:  s === 'pending'    ? 'Payment received.'
               : s === 'confirmed'  ? 'Artisan accepted the commission.'
               : s === 'processing' ? 'Your piece is being handcrafted.'
               : s === 'shipped'    ? 'On its way to you.'
               :                     'Delivered successfully.',
          time: new Date(o.createdAt).toLocaleDateString(),
          done: true,
        });
      }
    });
    return events;
  };

  if (loading) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: C.muted, fontSize: 13 }}>Loading orders...</p>
    </div>
  );

  if (error) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <p style={{ color: C.muted, fontSize: 13 }}>{error}</p>
      <Link to="/shop" style={{ backgroundColor: C.gold, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none' }}>Browse Shop</Link>
    </div>
  );

  if (!order && orders.length === 0) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 48 }}>◻</p>
      <p style={{ color: C.cream, fontWeight: 900, fontSize: 18 }}>No Orders Yet</p>
      <p style={{ color: C.muted, fontSize: 13 }}>Your orders will appear here after checkout.</p>
      <Link to="/shop" style={{ backgroundColor: C.gold, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none' }}>Browse Shop →</Link>
    </div>
  );

  const timeline   = order ? buildTimeline(order) : [];
  const stepIndex  = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* MODALS */}
      {modal === 'cancel' && order && (
        <CancelModal order={order} onClose={() => setModal(null)} onCancelled={fetchData} />
      )}
      {modal === 'invoice' && order && (
        <InvoiceModal order={order} onClose={() => setModal(null)} />
      )}

      {/* BREADCRUMB */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '14px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted }}>
          <Link to="/" style={{ color: C.muted, textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/profile" style={{ color: C.muted, textDecoration: 'none' }}>My Account</Link>
          <span>›</span>
          <span style={{ color: C.gold }}>Order Tracking</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 48px 80px', display: 'grid', gridTemplateColumns: orders.length > 1 ? '220px 1fr' : '1fr', gap: 28 }}>

        {/* ORDER LIST SIDEBAR */}
        {orders.length > 1 && (
          <div>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Your Orders</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.map(o => (
                <button key={o._id} onClick={() => setOrder(o)}
                  style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 10, border: `1px solid ${order?._id === o._id ? C.gold : C.border}`, backgroundColor: order?._id === o._id ? 'rgba(201,168,76,0.06)' : 'transparent', cursor: 'pointer' }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 3 }}>#{o.orderNumber}</p>
                  <p style={{ color: C.muted, fontSize: 11 }}>{o.items?.[0]?.name}</p>
                  <p style={{ color: STATUS_COLOR[o.orderStatus] || C.muted, fontSize: 10, fontWeight: 700, marginTop: 4 }}>{STATUS_LABELS[o.orderStatus]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        {order && (
          <div>
            {/* ORDER HEADER */}
            <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 28px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 20 }}>Order #{order.orderNumber}</h1>
                  <span style={{ backgroundColor: `${STATUS_COLOR[order.orderStatus]}18`, color: STATUS_COLOR[order.orderStatus], border: `1px solid ${STATUS_COLOR[order.orderStatus]}44`, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {STATUS_LABELS[order.orderStatus]}
                  </span>
                </div>
                <p style={{ color: C.muted, fontSize: 12 }}>
                  {order.items?.[0]?.name}{order.items?.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                </p>
                <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                  Placed {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {order.paymentMethod?.toUpperCase()} · {fmt(order.totalPrice)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Delivery Est.</p>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 16 }}>
                  {order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleDateString()
                    : `${order.items?.[0]?.deliveryTime || '5-7 Business Days'}`}
                </p>
              </div>
            </div>

            {/* PROGRESS STEPS */}
            {order.orderStatus !== 'cancelled' && (
              <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
                <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Current Status</p>
                <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 22, marginBottom: 24 }}>{STATUS_LABELS[order.orderStatus]}</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {STATUS_STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, backgroundColor: i <= stepIndex ? C.gold : 'transparent', border: `2px solid ${i <= stepIndex ? C.gold : C.border}`, color: i <= stepIndex ? '#000' : C.muted, boxShadow: i === stepIndex ? `0 0 0 4px rgba(201,168,76,0.2)` : 'none' }}>
                          {i < stepIndex ? '✓' : i + 1}
                        </div>
                        <p style={{ fontSize: 10, fontWeight: 900, color: i === stepIndex ? C.gold : i < stepIndex ? C.cream : C.muted, textAlign: 'center', width: 70 }}>{STATUS_LABELS[s]}</p>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{ flex: 1, height: 2, backgroundColor: i < stepIndex ? C.gold : C.border, margin: '0 4px', marginBottom: 24, borderRadius: 2 }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* TWO COLUMN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

              {/* LEFT — TABS */}
              <div>
                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
                    {[['timeline','Timeline'], ['details','Order Details'], ['shipping','Shipping']].map(([key, label]) => (
                      <button key={key} onClick={() => setActiveTab(key)}
                        style={{ flex: 1, padding: '13px', fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === key ? C.gold : 'transparent'}`, color: activeTab === key ? C.gold : C.muted, cursor: 'pointer', marginBottom: -1 }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* TIMELINE */}
                  {activeTab === 'timeline' && (
                    <div style={{ padding: 20 }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 1, backgroundColor: C.border }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          {timeline.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: item.done ? C.gold : C.surface, border: `1px solid ${item.done ? C.gold : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, zIndex: 1, color: item.done ? '#000' : C.muted }}>
                                {item.icon}
                              </div>
                              <div style={{ paddingTop: 4 }}>
                                <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 2 }}>{item.title}</p>
                                <p style={{ color: C.muted, fontSize: 12, marginBottom: 2 }}>{item.desc}</p>
                                <p style={{ color: C.muted, fontSize: 11 }}>{item.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ORDER DETAILS */}
                  {activeTab === 'details' && (
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 14px', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                            {item.image && <img src={item.image} alt={item.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                            <div style={{ flex: 1 }}>
                              <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 2 }}>{item.name}</p>
                              <p style={{ color: C.muted, fontSize: 11 }}>{item.category} · Qty {item.quantity}</p>
                            </div>
                            <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{fmt(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                      {[
                        ['Order Number',   `#${order.orderNumber}`],
                        ['Payment Method', order.paymentMethod?.toUpperCase()],
                        ['Payment Status', order.paymentStatus?.toUpperCase()],
                        ['Date Placed',    new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
                        ['Items Total',    fmt(order.itemsPrice)],
                        ['Shipping',       order.shippingPrice === 0 ? 'Free' : fmt(order.shippingPrice)],
                        ['Total',          fmt(order.totalPrice)],
                      ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                          <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                          <span style={{ color: label === 'Total' ? C.gold : label === 'Payment Status' && value === 'PAID' ? C.green : C.cream, fontWeight: 900, fontSize: 12 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SHIPPING */}
                  {activeTab === 'shipping' && (
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                        <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Delivery Address</p>
                        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{order.shippingAddress?.fullName}</p>
                        <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{order.shippingAddress?.street}</p>
                        <p style={{ color: C.muted, fontSize: 12 }}>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                        <p style={{ color: C.muted, fontSize: 12 }}>{order.shippingAddress?.phone}</p>
                      </div>
                      <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                        <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Shipping</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>Standard Delivery</p>
                          <span style={{ color: order.shippingPrice === 0 ? C.green : C.cream, fontWeight: 900, fontSize: 12 }}>{order.shippingPrice === 0 ? 'Free' : fmt(order.shippingPrice)}</span>
                        </div>
                      </div>
                      {order.orderStatus === 'shipped' && (
                        <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                          <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Tracking</p>
                          <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57AC-{order.orderNumber}</p>
                          <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Track via courier partner</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.border}` }}>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Need Help?</p>
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Link to="/artisan-chat"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.gold, color: '#000', padding: '10px 14px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none' }}>
                      💬 Chat with Artisan
                    </Link>
                    <Link to="/contact"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.border}`, color: C.cream, padding: '10px 14px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none' }}>
                      📞 Contact Support
                    </Link>
                  </div>
                </div>

                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                  <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Order Actions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={() => setModal('invoice')}
                      style={{ textAlign: 'left', fontSize: 12, padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', fontWeight: 700 }}>
                      📄 Download Invoice
                    </button>
                    {!['delivered', 'cancelled', 'shipped'].includes(order.orderStatus) && (
                      <button onClick={() => setModal('cancel')}
                        style={{ textAlign: 'left', fontSize: 12, padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.red, cursor: 'pointer', fontWeight: 700 }}>
                        ✕ Cancel Order
                      </button>
                    )}
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

export default OrderTracking;