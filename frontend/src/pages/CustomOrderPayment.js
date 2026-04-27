import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c',
  cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
  green: '#4ade80', red: '#e05c5c', faint: '#242424',
};

const paymentMethods = [
  { id: 'mpesa',  label: 'M-Pesa',            desc: 'Safaricom STK push to your phone', icon: '📱' },
  { id: 'card',   label: 'Visa / Mastercard',  desc: 'Credit or debit card',             icon: '💳' },
  { id: 'paypal', label: 'PayPal',             desc: 'Pay with your PayPal account',     icon: '🅿' },
  { id: 'bank',   label: 'Bank Transfer',      desc: 'Direct bank transfer',             icon: '🏦' },
];

const CustomOrderPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [method, setMethod]             = useState('mpesa');
  const [phone, setPhone]               = useState('');
  const [paying, setPaying]             = useState(false);
  const [paid, setPaid]                 = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    api.get(`/custom-orders/my-orders`)
      .then(res => {
        const found = res.data.find(o => o._id === id);
        setOrder(found || null);
      })
      .catch(() => setError('Could not load order.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePay = async () => {
    if (method === 'mpesa' && !phone.trim()) {
      setError('Please enter your M-Pesa phone number.');
      return;
    }
    setPaying(true);
    setError('');
    try {
      await api.put(`/custom-orders/${id}/approve`, {
        paymentMethod: method,
        paymentPhone: phone,
      });
      setPaid(true);
      setTimeout(() => navigate('/vision-board'), 3000);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const centered = { backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  if (loading) return (
    <div style={centered}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: C.muted, fontSize: 13 }}>Loading order...</p>
      </div>
    </div>
  );

  if (error && !order) return (
    <div style={centered}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
        <p style={{ color: C.red, fontWeight: 700, marginBottom: 8 }}>{error}</p>
        <button onClick={() => navigate('/vision-board')}
          style={{ marginTop: 12, padding: '10px 24px', backgroundColor: C.gold, color: '#000', borderRadius: 10, border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: 13 }}>
          ← Back to Vision Board
        </button>
      </div>
    </div>
  );

  if (!order) return (
    <div style={centered}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
        <p style={{ color: C.cream, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Order not found</p>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
          We couldn't find order <span style={{ color: C.gold, fontFamily: 'monospace' }}>#{id?.slice(-8)}</span>.
        </p>
        <button onClick={() => navigate('/vision-board')}
          style={{ padding: '10px 24px', backgroundColor: C.gold, color: '#000', borderRadius: 10, border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: 13 }}>
          ← Back to Vision Board
        </button>
      </div>
    </div>
  );

  if (paid) return (
    <div style={{ ...centered, color: C.cream }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: C.green, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>Payment Confirmed!</h2>
        <p style={{ color: C.muted }}>Your artisan has been notified. Production begins shortly.</p>
        <p style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Redirecting to your Vision Board...</p>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>

        {/* Back link */}
        <button onClick={() => navigate('/vision-board')}
          style={{ background: 'none', border: 'none', color: C.muted, fontSize: 12, cursor: 'pointer', marginBottom: 24, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to Vision Board
        </button>

        <h1 style={{ fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 6 }}>
          Approve & <span style={{ color: C.gold }}>Pay</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>
          Confirm your custom order and complete payment to begin production.
        </p>

        {/* Order summary */}
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Order Summary</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>Order ID</span>
            <span style={{ fontWeight: 700, fontSize: 12, fontFamily: 'monospace', color: C.muted }}>#{id?.slice(-8).toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>Category</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{order.categoryLabel || order.category || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>Timeline</span>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{order.timeline || '—'}</span>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.muted, fontSize: 13 }}>Amount Due</span>
            <span style={{ color: C.gold, fontWeight: 900, fontSize: 22 }}>
              {order.quotedPrice ? `KES ${order.quotedPrice.toLocaleString()}` : order.basePrice || 'KES 15,000'}
            </span>
          </div>
        </div>

        {/* Payment method */}
        <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Payment Method</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {paymentMethods.map(pm => (
            <button key={pm.id} onClick={() => setMethod(pm.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, border: `2px solid ${method === pm.id ? C.gold : C.border}`, backgroundColor: method === pm.id ? 'rgba(201,168,76,0.06)' : C.surface, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 22 }}>{pm.icon}</span>
              <div>
                <p style={{ color: method === pm.id ? C.gold : C.cream, fontWeight: 800, fontSize: 13 }}>{pm.label}</p>
                <p style={{ color: C.muted, fontSize: 11 }}>{pm.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* M-Pesa phone input */}
        {method === 'mpesa' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              style={{ width: '100%', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
            <p style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>An STK push will be sent to this number.</p>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ color: C.red, fontSize: 12 }}>⚠ {error}</p>
          </div>
        )}

        <button onClick={handlePay} disabled={paying}
          style={{ width: '100%', backgroundColor: C.gold, color: '#000', padding: '14px', borderRadius: 12, fontWeight: 900, fontSize: 14, border: 'none', cursor: paying ? 'not-allowed' : 'pointer', opacity: paying ? 0.6 : 1, letterSpacing: '0.06em' }}>
          {paying ? 'Processing...' : `CONFIRM PAYMENT →`}
        </button>
      </div>
    </div>
  );
};

export default CustomOrderPayment;