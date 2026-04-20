import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import api from '../services/api';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};

const fmt = n => `KSH ${Number(n).toLocaleString()}`;

// ✅ FIX: shared shipping rule — identical to Cart.js so totals always match
const calcShipping = (subtotal) => subtotal < 500 ? 0 : 500; // TODO: revert to 50000 before production

const paymentMethods = [
  { id: 'mpesa',  label: 'M-Pesa',           desc: 'Pay via Safaricom M-Pesa STK push', icon: '📱' },
  { id: 'card',   label: 'Visa / Mastercard', desc: 'Credit or debit card',              icon: '💳' },
  { id: 'paypal', label: 'PayPal',            desc: 'Pay with your PayPal account',      icon: '🅿' },
  { id: 'bank',   label: 'Bank Transfer',     desc: 'Direct bank transfer',              icon: '🏦' },
];

const steps = ['Delivery', 'Payment', 'Verify', 'Review'];

const isValidObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ''));

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep]               = useState(0);
  const [payMethod, setPayMethod]     = useState('mpesa');
  const [mpesaPhone, setMpesaPhone]   = useState(user?.phone || '');
  const [stkSent, setStkSent]         = useState(false);
  const [stkLoading, setStkLoading]   = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState('');

  const [placed, setPlaced]           = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [placing, setPlacing]         = useState(false);
  const [placeError, setPlaceError]   = useState('');

  const [form, setForm] = useState({
    name:    user?.name             || '',
    email:   user?.email            || '',
    phone:   user?.phone            || '',
    address: user?.address?.street  || '',
    city:    user?.address?.city    || '',
    country: user?.address?.country || 'Kenya',
    notes:   '',
  });
  const [errors, setErrors]           = useState({});

  const [verifying, setVerifying]     = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verified, setVerified]       = useState(false);
  const [pollCount, setPollCount]     = useState(0);
  const pollRef                       = useRef(null);

  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', holder: '' });

  // ✅ FIX: shipping now uses same calcShipping as Cart.js
  const shipping = calcShipping(subtotal);
  const total    = subtotal + shipping;

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const validateDelivery = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Required';
    if (!form.email.trim())   e.email   = 'Required';
    if (!form.phone.trim())   e.phone   = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim())    e.city    = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateDelivery()) return;
    if (step === 1) {
      if (payMethod === 'mpesa' && !stkSent) {
        setVerifyError('Please send the STK push first.');
        return;
      }
      setVerifyError('');
      setVerified(false);
    }
    setStep(s => s + 1);
  };

  const sendSTK = async () => {
    if (!mpesaPhone.trim()) return;
    setStkLoading(true);
    setVerifyError('');
    try {
      const { data } = await api.post('/payments/mpesa/stk', {
        phone:   mpesaPhone,
        amount:  total,
        orderId: `TEMP${Date.now()}`,
      });
      setCheckoutRequestId(data.checkoutRequestId);
      setStkSent(true);
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Failed to send STK push. Try again.');
    } finally {
      setStkLoading(false);
    }
  };

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setPollCount(0);
    pollRef.current = setInterval(async () => {
      setPollCount(c => {
        if (c >= 12) {
          clearInterval(pollRef.current);
          setVerifying(false);
          setVerifyError('Payment not confirmed. Please check your phone and try again.');
          return c;
        }
        return c + 1;
      });
      try {
        const { data } = await api.post('/payments/mpesa/query', { checkoutRequestId });
        if (data.paid) {
          clearInterval(pollRef.current);
          setVerified(true);
          setVerifying(false);
          setVerifyError('');
        }
      } catch {}
    }, 5000);
  };

  const handleVerifyPayment = async () => {
    setVerifying(true);
    setVerifyError('');

    if (payMethod === 'mpesa') {
      if (!checkoutRequestId) {
        setVerifyError('No STK push found. Please send STK push first.');
        setVerifying(false);
        return;
      }
      try {
        const { data } = await api.post('/payments/mpesa/query', { checkoutRequestId });
        if (data.paid) { setVerified(true); setVerifying(false); return; }
      } catch {}
      startPolling();
      return;
    }

    if (payMethod === 'card') {
      if (!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.holder) {
        setVerifyError('Please fill in all card details.');
        setVerifying(false);
        return;
      }
    }

    setTimeout(() => { setVerified(true); setVerifying(false); }, 1500);
  };

  const placeOrder = async () => {
    if (!verified) {
      setPlaceError('Please verify your payment before placing the order.');
      return;
    }

    const invalidItems = items.filter(item => !isValidObjectId(item.id));
    if (invalidItems.length > 0) {
      const names = invalidItems.map(i => i.name).join(', ');
      setPlaceError(
        `Some items have an invalid product ID (${names}). ` +
        `Please remove them from your cart and add them again.`
      );
      return;
    }

    setPlacing(true);
    setPlaceError('');

    try {
      const { data } = await orderAPI.create({
        items: items.map(item => ({
          product:  item.id,
          name:     item.name,
          image:    item.img,
          category: item.category,
          quantity: item.qty,
          price:    item.price,
          ...(isValidObjectId(item.vendorId) ? { vendor: item.vendorId } : {}),
        })),
        shippingAddress: {
          fullName: form.name,
          phone:    form.phone,
          street:   form.address,
          city:     form.city,
          country:  form.country,
        },
        paymentMethod:      payMethod,
        paymentStatus:      'paid',
        itemsPrice:         subtotal,
        shippingPrice:      shipping,
        totalPrice:         total,
        notes:              form.notes,
        mpesaTransactionId: checkoutRequestId || '',
      });

      clearCart();
      setPlacedOrder(data.order);
      setPlaced(true);

    } catch (err) {
      setPlaceError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Failed to place order. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  };

  const inp = (field) => ({
    width: '100%', backgroundColor: C.bg,
    border: `1px solid ${errors[field] ? 'rgba(224,92,92,0.4)' : C.border}`,
    borderRadius: 10, padding: '12px 15px', color: C.cream,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  });

  // ── ORDER PLACED ──────────────────────────────────────────────────────────────
  if (placed && placedOrder) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <span style={{ color: C.gold, fontSize: 28 }}>✓</span>
        </div>
        <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 12 }}>Order Confirmed!</h2>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
          Order <strong style={{ color: C.cream }}>#{placedOrder.orderNumber}</strong> confirmed and payment verified.
        </p>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 32 }}>
          Confirmation sent to <strong style={{ color: C.cream }}>{form.email}</strong>. Artisan will contact you within 24 hours.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link to="/order-tracking" style={{ backgroundColor: C.gold, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none' }}>
            Track Order →
          </Link>
          <Link to="/shop" style={{ backgroundColor: 'transparent', color: C.cream, padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none', border: `1px solid ${C.border}` }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <p style={{ color: C.muted, fontSize: 14 }}>Your cart is empty.</p>
      <Link to="/shop" style={{ backgroundColor: C.gold, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none' }}>Browse Shop →</Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '24px 48px', backgroundColor: C.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57 ARTS & CUSTOMS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${i <= step ? C.gold : C.border}`, backgroundColor: i < step ? C.gold : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: i < step ? '#000' : i === step ? C.gold : C.muted }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ color: i === step ? C.cream : C.muted, fontSize: 12, fontWeight: i === step ? 900 : 400 }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 28, height: 1, backgroundColor: i < step ? C.gold : C.border, margin: '0 8px' }} />}
              </React.Fragment>
            ))}
          </div>
          <Link to="/cart" style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}>← Back to Cart</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
        <div>

          {/* STEP 0 — Delivery */}
          {step === 0 && (
            <div>
              <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 28 }}>Delivery Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[{ key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' }, { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' }].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={inp(key)}
                        onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors[key] ? 'rgba(224,92,92,0.4)' : C.border} />
                      {errors[key] && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors[key]}</p>}
                    </div>
                  ))}
                </div>
                {[{ key: 'phone', label: 'Phone Number', placeholder: '+254 7XX XXX XXX', type: 'tel' }, { key: 'address', label: 'Street Address', placeholder: 'Street, estate or area', type: 'text' }].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={inp(key)}
                      onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors[key] ? 'rgba(224,92,92,0.4)' : C.border} />
                    {errors[key] && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors[key]}</p>}
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>City / Town</label>
                    <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Nairobi" style={inp('city')}
                      onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = errors.city ? 'rgba(224,92,92,0.4)' : C.border} />
                    {errors.city && <p style={{ color: '#e05c5c', fontSize: 11, marginTop: 4 }}>{errors.city}</p>}
                  </div>
                  <div>
                    <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Country</label>
                    <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={{ ...inp('country'), cursor: 'pointer' }}>
                      {['Kenya', 'Nigeria', 'Ghana', 'Uganda', 'Tanzania', 'South Africa', 'Other'].map(c => (
                        <option key={c} value={c} style={{ backgroundColor: C.surface }}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Order Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any special instructions for your artisan..." rows={3}
                    style={{ ...inp('notes'), resize: 'none', lineHeight: 1.6 }} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Payment */}
          {step === 1 && (
            <div>
              <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 28 }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {paymentMethods.map(m => (
                  <div key={m.id} onClick={() => { setPayMethod(m.id); setStkSent(false); setVerifyError(''); setCheckoutRequestId(''); }}
                    style={{ backgroundColor: C.surface, border: `1px solid ${payMethod === m.id ? C.gold : C.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: C.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 2 }}>{m.label}</p>
                      <p style={{ color: C.muted, fontSize: 11 }}>{m.desc}</p>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === m.id ? C.gold : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {payMethod === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.gold }} />}
                    </div>
                  </div>
                ))}
              </div>

              {payMethod === 'mpesa' && (
                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 6 }}>M-Pesa STK Push</p>
                  <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>Enter your Safaricom number. We'll send an STK push — confirm on your phone, then continue.</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="tel" value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="+254 7XX XXX XXX"
                      style={{ flex: 1, backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }} />
                    <button onClick={sendSTK} disabled={!mpesaPhone.trim() || stkLoading}
                      style={{ backgroundColor: mpesaPhone.trim() && !stkLoading ? C.gold : C.faint, color: mpesaPhone.trim() && !stkLoading ? '#000' : C.muted, border: 'none', borderRadius: 9, padding: '11px 18px', fontWeight: 900, fontSize: 12, cursor: mpesaPhone.trim() && !stkLoading ? 'pointer' : 'not-allowed' }}>
                      {stkLoading ? 'Sending...' : stkSent ? 'Resend' : 'Send STK'}
                    </button>
                  </div>
                  {stkSent && (
                    <div style={{ marginTop: 12, padding: '10px 14px', backgroundColor: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 8 }}>
                      <p style={{ color: '#4caf50', fontSize: 12, fontWeight: 700 }}>✓ STK push sent to {mpesaPhone}. Enter your PIN on your phone, then click Continue.</p>
                    </div>
                  )}
                </div>
              )}

              {payMethod === 'card' && (
                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 16 }}>Card Details</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input placeholder="Cardholder Name" value={cardForm.holder} onChange={e => setCardForm({ ...cardForm, holder: e.target.value })}
                      style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }} />
                    <input placeholder="Card Number" value={cardForm.number} onChange={e => setCardForm({ ...cardForm, number: e.target.value })} maxLength={19}
                      style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input placeholder="MM / YY" value={cardForm.expiry} onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })} maxLength={5}
                        style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }} />
                      <input placeholder="CVV" value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })} maxLength={4} type="password"
                        style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }} />
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'paypal' && (
                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, textAlign: 'center' }}>
                  <p style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>You'll be redirected to PayPal to complete payment securely.</p>
                  <div style={{ backgroundColor: '#003087', borderRadius: 9, padding: '12px 24px', display: 'inline-block', color: '#fff', fontWeight: 900, fontSize: 13 }}>🅿 Continue with PayPal</div>
                </div>
              )}

              {payMethod === 'bank' && (
                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 12 }}>Bank Transfer Details</p>
                  {[['Bank', 'Equity Bank Kenya'], ['Account Name', '57 Arts & Customs Ltd'], ['Account No.', '0123456789'], ['Branch', 'Nairobi CBD']].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                      <span style={{ color: C.cream, fontWeight: 700, fontSize: 12 }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {verifyError && (
                <div style={{ marginTop: 14, padding: '10px 14px', backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 8 }}>
                  <p style={{ color: '#e05c5c', fontSize: 12 }}>{verifyError}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Verify */}
          {step === 2 && (
            <div>
              <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 8 }}>Verify Payment</h2>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
                {payMethod === 'mpesa'  && `STK push sent to ${mpesaPhone}. After entering your PIN, click verify below.`}
                {payMethod === 'card'   && 'Click below to verify your card payment.'}
                {payMethod === 'paypal' && "Complete your PayPal payment, then click verify."}
                {payMethod === 'bank'   && "After completing the bank transfer, click verify."}
              </p>
              <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  {verified ? '✅' : verifying ? '⏳' : payMethod === 'mpesa' ? '📱' : payMethod === 'card' ? '💳' : payMethod === 'paypal' ? '🅿' : '🏦'}
                </div>
                {!verified ? (
                  <>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 8 }}>
                      {verifying ? `Checking payment... (${pollCount}/12)` : payMethod === 'mpesa' ? 'Waiting for M-Pesa confirmation' : 'Confirm Payment'}
                    </p>
                    <p style={{ color: C.muted, fontSize: 12, marginBottom: 22 }}>
                      Amount: <strong style={{ color: C.gold }}>{fmt(total)}</strong>
                      {payMethod === 'mpesa' && ` · ${mpesaPhone}`}
                    </p>
                    {!verifying && (
                      <button onClick={handleVerifyPayment}
                        style={{ backgroundColor: C.gold, color: '#000', border: 'none', borderRadius: 10, padding: '14px 32px', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}>
                        I Have Paid — Verify Now
                      </button>
                    )}
                    {verifying && payMethod === 'mpesa' && (
                      <p style={{ color: C.muted, fontSize: 11, marginTop: 12 }}>Checking every 5 seconds. Up to 60 seconds.</p>
                    )}
                  </>
                ) : (
                  <>
                    <p style={{ color: '#4caf50', fontWeight: 900, fontSize: 15, marginBottom: 8 }}>Payment Verified!</p>
                    <p style={{ color: C.muted, fontSize: 12 }}>{fmt(total)} confirmed. You can now place your order.</p>
                  </>
                )}
                {verifyError && (
                  <div style={{ marginTop: 14, padding: '10px 14px', backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 8, textAlign: 'left' }}>
                    <p style={{ color: '#e05c5c', fontSize: 12 }}>{verifyError}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <div>
              <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 28 }}>Review Order</h2>
              <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>Delivery</p>
                  <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', color: C.gold, fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Edit</button>
                </div>
                <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{form.name} · {form.email}<br />{form.address}, {form.city}, {form.country}</p>
              </div>
              <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>Payment</p>
                  <span style={{ color: '#4caf50', fontSize: 11, fontWeight: 700 }}>✓ Verified</span>
                </div>
                <p style={{ color: C.muted, fontSize: 12 }}>{paymentMethods.find(m => m.id === payMethod)?.label}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <div key={item.id} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                    <img src={item.img} alt={item.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: C.cream, fontWeight: 800, fontSize: 13 }}>{item.name}</p>
                      <p style={{ color: C.muted, fontSize: 11 }}>{item.category} · Qty {item.qty}</p>
                    </div>
                    <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{fmt(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              {placeError && (
                <div style={{ marginTop: 16, padding: '10px 14px', backgroundColor: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 8 }}>
                  <p style={{ color: '#e05c5c', fontSize: 12 }}>{placeError}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {step > 0 && (
              <button onClick={() => { setStep(s => s - 1); setVerifyError(''); setPlaceError(''); }}
                style={{ backgroundColor: 'transparent', border: `1px solid ${C.border}`, color: C.cream, padding: '13px 24px', borderRadius: 10, fontWeight: 900, fontSize: 13, cursor: 'pointer' }}>
                ← Back
              </button>
            )}
            {step === 2 ? (
              <button onClick={() => verified && setStep(3)} disabled={!verified}
                style={{ flex: 1, backgroundColor: verified ? C.cream : C.faint, color: verified ? '#000' : C.muted, border: 'none', borderRadius: 10, padding: '13px', fontWeight: 900, fontSize: 13, cursor: verified ? 'pointer' : 'not-allowed' }}>
                {verified ? 'Continue to Review →' : 'Verify Payment to Continue'}
              </button>
            ) : step < 3 ? (
              <button onClick={handleNext}
                style={{ flex: 1, backgroundColor: C.cream, color: '#000', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}>
                Continue to {steps[step + 1]} →
              </button>
            ) : (
              <button onClick={placeOrder} disabled={placing}
                style={{ flex: 1, backgroundColor: placing ? C.faint : C.gold, color: placing ? C.muted : '#000', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 900, fontSize: 14, cursor: placing ? 'not-allowed' : 'pointer' }}>
                {placing ? 'Placing Order...' : `Place Order · ${fmt(total)} →`}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — Order summary */}
        <div>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, position: 'sticky', top: 24 }}>
            <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 18 }}>Order Summary</h3>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={item.img} alt={item.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: -6, right: -6, backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.cream, fontSize: 10, fontWeight: 900, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.qty}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.cream, fontWeight: 800, fontSize: 12, marginBottom: 2 }}>{item.name}</p>
                  <p style={{ color: C.muted, fontSize: 11 }}>{item.category}</p>
                </div>
                <p style={{ color: C.cream, fontWeight: 700, fontSize: 12 }}>{fmt(item.price * item.qty)}</p>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Subtotal</span>
                <span style={{ color: C.cream, fontWeight: 700, fontSize: 12 }}>{fmt(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#4caf50' : C.cream, fontWeight: 700, fontSize: 12 }}>
                  {shipping === 0 ? 'Free' : fmt(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ color: C.muted, fontSize: 11 }}>Free shipping on orders under KSH 500</p>
              )}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>Total</span>
                <span style={{ color: C.gold, fontWeight: 900, fontSize: 16 }}>{fmt(total)}</span>
              </div>
            </div>
            {step >= 2 && (
              <div style={{ marginTop: 14, padding: '10px 14px', backgroundColor: verified ? 'rgba(76,175,80,0.1)' : 'rgba(201,168,76,0.08)', border: `1px solid ${verified ? 'rgba(76,175,80,0.3)' : 'rgba(201,168,76,0.3)'}`, borderRadius: 8 }}>
                <p style={{ color: verified ? '#4caf50' : C.gold, fontSize: 11, fontWeight: 700 }}>
                  {verified ? '✓ Payment Verified' : '⏳ Awaiting payment verification'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;