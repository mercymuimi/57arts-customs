import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import api from '../services/api';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:      '#0a0a0a',
  surface: '#111111',
  border:  '#1c1c1c',
  bHov:    '#2e2e2e',
  faint:   '#242424',
  cream:   '#f0ece4',
  muted:   '#606060',
  gold:    '#c9a84c',
  green:   '#4caf50',
  red:     '#e05c5c',
};

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const fmt = n => `KSH ${Number(n).toLocaleString()}`;

/**
 * Shared shipping rule — keep identical to Cart.js so totals always match.
 * TODO: revert threshold to 50000 before production.
 */
const calcShipping = subtotal => (subtotal < 500 ? 0 : 500);

const isValidObjectId = str => /^[a-f\d]{24}$/i.test(String(str ?? ''));

/* ─── Static data ────────────────────────────────────────────────────────────── */
const paymentMethods = [
  { id: 'mpesa',  label: 'M-Pesa',           desc: 'Safaricom M-Pesa STK push',   icon: '📱' },
  { id: 'card',   label: 'Visa / Mastercard', desc: 'Credit or debit card',        icon: '💳' },
  { id: 'paypal', label: 'PayPal',            desc: 'Pay with your PayPal account', icon: '🅿' },
  { id: 'bank',   label: 'Bank Transfer',     desc: 'Direct bank transfer',        icon: '🏦' },
];

const STEPS = ['Delivery', 'Payment', 'Verify', 'Review'];

const COUNTRIES = [
  'Kenya', 'Nigeria', 'Ghana', 'Uganda',
  'Tanzania', 'South Africa', 'Other',
];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

/** Reusable labelled input field */
const Field = ({ label, error, children }) => (
  <div>
    <label style={{
      color: C.muted, fontSize: 10, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      display: 'block', marginBottom: 7,
    }}>
      {label}
    </label>
    {children}
    {error && (
      <p style={{ color: C.red, fontSize: 11, marginTop: 4 }}>{error}</p>
    )}
  </div>
);

/** Standard text/email/tel input */
const TextInput = ({ value, onChange, placeholder, type = 'text', hasError, style = {} }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      backgroundColor: C.bg,
      border: `1px solid ${hasError ? 'rgba(224,92,92,0.4)' : C.border}`,
      borderRadius: 10,
      padding: '12px 15px',
      color: C.cream,
      fontSize: 13,
      outline: 'none',
      boxSizing: 'border-box',
      ...style,
    }}
    onFocus={e  => (e.target.style.borderColor = C.bHov)}
    onBlur={e   => (e.target.style.borderColor = hasError ? 'rgba(224,92,92,0.4)' : C.border)}
  />
);

/** Alert / status banner */
const Alert = ({ type, children }) => {
  const colors = {
    success: { bg: 'rgba(76,175,80,0.1)',   border: 'rgba(76,175,80,0.3)',   text: C.green },
    error:   { bg: 'rgba(224,92,92,0.1)',   border: 'rgba(224,92,92,0.3)',   text: C.red   },
    info:    { bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)',  text: C.gold  },
  };
  const s = colors[type] || colors.info;
  return (
    <div style={{
      marginTop: 12,
      padding: '10px 14px',
      backgroundColor: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 8,
    }}>
      <p style={{ color: s.text, fontSize: 12 }}>{children}</p>
    </div>
  );
};

/* ─── GPS hook ───────────────────────────────────────────────────────────────── */
/**
 * useGeoFill — requests GPS coordinates then reverse-geocodes via Nominatim
 * (OpenStreetMap). Free, no API key required, good coverage across Africa.
 *
 * Returns { fillFromGPS, gpsState }
 *   gpsState: 'idle' | 'locating' | 'geocoding' | 'success' | 'error'
 *   gpsError: human-readable message
 */
const useGeoFill = (onFill) => {
  const [gpsState, setGpsState] = useState('idle'); // idle | locating | geocoding | success | error
  const [gpsError, setGpsError] = useState('');

  const fillFromGPS = () => {
    if (!navigator.geolocation) {
      setGpsState('error');
      setGpsError('Your browser does not support geolocation.');
      return;
    }

    setGpsState('locating');
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setGpsState('geocoding');
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': '57ArtsCheckout/1.0 (final-year-project)',
              },
            }
          );
          if (!res.ok) throw new Error('Geocoding failed');
          const { address: a = {} } = await res.json();

          onFill({
            address: [a.road, a.house_number].filter(Boolean).join(' ') || '',
            city:    a.city || a.town || a.village || a.county || '',
            country: a.country || 'Kenya',
          });

          setGpsState('success');
        } catch {
          setGpsState('error');
          setGpsError('Could not look up address. Check your internet and try again.');
        }
      },
      err => {
        setGpsState('error');
        setGpsError(
          err.code === 1
            ? 'Location access denied. Please allow location in your browser settings.'
            : err.code === 3
            ? 'Location request timed out. Please try again.'
            : 'Unable to determine your location. Please enter manually.',
        );
      },
      { timeout: 12000, maximumAge: 60_000 },
    );
  };

  return { fillFromGPS, gpsState, gpsError };
};

/* ─── GPS button ─────────────────────────────────────────────────────────────── */
const GPSButton = ({ onFill }) => {
  const { fillFromGPS, gpsState, gpsError } = useGeoFill(onFill);

  const busy    = gpsState === 'locating' || gpsState === 'geocoding';
  const label   = {
    idle:      '📍 Use my current location',
    locating:  '⏳ Getting GPS coordinates…',
    geocoding: '🔍 Looking up address…',
    success:   '📍 Update location',
    error:     '📍 Try again',
  }[gpsState];

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        type="button"
        onClick={fillFromGPS}
        disabled={busy}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 18px',
          backgroundColor: C.surface,
          border: `1px solid ${gpsState === 'success' ? 'rgba(76,175,80,0.4)' : C.border}`,
          borderRadius: 10,
          color: gpsState === 'success' ? C.green : C.cream,
          fontSize: 13,
          fontWeight: 700,
          cursor: busy ? 'wait' : 'pointer',
          opacity: busy ? 0.7 : 1,
          transition: 'all 0.2s',
        }}
      >
        {label}
      </button>

      {gpsState === 'success' && (
        <Alert type="success">
          ✓ Address auto-filled from GPS — check and edit any field if needed.
        </Alert>
      )}
      {gpsState === 'error' && (
        <Alert type="error">{gpsError}</Alert>
      )}
    </div>
  );
};

/* ─── Step 0: Delivery ───────────────────────────────────────────────────────── */
const StepDelivery = ({ form, setForm, errors }) => {
  const handleGPSFill = ({ address, city, country }) => {
    setForm(f => ({
      ...f,
      ...(address ? { address } : {}),
      ...(city    ? { city }    : {}),
      ...(country ? { country } : {}),
    }));
  };

  const field = key => ({
    value:    form[key],
    onChange: e => setForm(f => ({ ...f, [key]: e.target.value })),
    hasError: !!errors[key],
  });

  return (
    <div>
      <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 24 }}>
        Delivery Details
      </h2>

      {/* GPS autofill */}
      <GPSButton onFill={handleGPSFill} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Full Name" error={errors.name}>
            <TextInput {...field('name')} placeholder="Your name" />
          </Field>
          <Field label="Email" error={errors.email}>
            <TextInput {...field('email')} type="email" placeholder="you@example.com" />
          </Field>
        </div>

        {/* Phone */}
        <Field label="Phone Number" error={errors.phone}>
          <TextInput {...field('phone')} type="tel" placeholder="+254 7XX XXX XXX" />
        </Field>

        {/* Street address */}
        <Field label="Street Address" error={errors.address}>
          <TextInput {...field('address')} placeholder="Street, estate or area" />
        </Field>

        {/* City + Country */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="City / Town" error={errors.city}>
            <TextInput {...field('city')} placeholder="Nairobi" />
          </Field>
          <Field label="Country">
            <select
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              style={{
                width: '100%',
                backgroundColor: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '12px 15px',
                color: C.cream,
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c} style={{ backgroundColor: C.surface }}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Notes */}
        <Field label="Order Notes (optional)">
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Any special instructions for your artisan…"
            rows={3}
            style={{
              width: '100%',
              backgroundColor: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: '12px 15px',
              color: C.cream,
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'none',
              lineHeight: 1.6,
            }}
          />
        </Field>
      </div>
    </div>
  );
};

/* ─── Step 1: Payment ────────────────────────────────────────────────────────── */
const StepPayment = ({
  payMethod, setPayMethod,
  mpesaPhone, setMpesaPhone,
  stkSent, setStkSent,
  stkLoading, sendSTK,
  cardForm, setCardForm,
  verifyError, setVerifyError,
  setCheckoutRequestId,
  total,
}) => (
  <div>
    <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 28 }}>
      Payment Method
    </h2>

    {/* Method selector */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
      {paymentMethods.map(m => (
        <div
          key={m.id}
          onClick={() => {
            setPayMethod(m.id);
            setStkSent(false);
            setVerifyError('');
            setCheckoutRequestId('');
          }}
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${payMethod === m.id ? C.gold : C.border}`,
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            backgroundColor: C.faint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>
            {m.icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 2 }}>{m.label}</p>
            <p style={{ color: C.muted, fontSize: 11 }}>{m.desc}</p>
          </div>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            border: `2px solid ${payMethod === m.id ? C.gold : C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {payMethod === m.id && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.gold }} />
            )}
          </div>
        </div>
      ))}
    </div>

    {/* M-Pesa */}
    {payMethod === 'mpesa' && (
      <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 6 }}>M-Pesa STK Push</p>
        <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
          Enter your Safaricom number. We'll send an STK push — confirm on your phone, then continue.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="tel"
            value={mpesaPhone}
            onChange={e => setMpesaPhone(e.target.value)}
            placeholder="+254 7XX XXX XXX"
            style={{
              flex: 1, backgroundColor: C.bg,
              border: `1px solid ${C.border}`, borderRadius: 9,
              padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none',
            }}
          />
          <button
            onClick={sendSTK}
            disabled={!mpesaPhone.trim() || stkLoading}
            style={{
              backgroundColor: mpesaPhone.trim() && !stkLoading ? C.gold : C.faint,
              color:           mpesaPhone.trim() && !stkLoading ? '#000' : C.muted,
              border: 'none', borderRadius: 9, padding: '11px 18px',
              fontWeight: 900, fontSize: 12,
              cursor: mpesaPhone.trim() && !stkLoading ? 'pointer' : 'not-allowed',
            }}
          >
            {stkLoading ? 'Sending…' : stkSent ? 'Resend' : 'Send STK'}
          </button>
        </div>
        {stkSent && (
          <Alert type="success">
            ✓ STK push sent to {mpesaPhone}. Enter your PIN on your phone, then click Continue.
          </Alert>
        )}
      </div>
    )}

    {/* Card */}
    {payMethod === 'card' && (
      <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 16 }}>Card Details</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Cardholder Name"
            value={cardForm.holder}
            onChange={e => setCardForm(f => ({ ...f, holder: e.target.value }))}
            style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }}
          />
          <input
            placeholder="Card Number"
            value={cardForm.number}
            onChange={e => setCardForm(f => ({ ...f, number: e.target.value }))}
            maxLength={19}
            style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              placeholder="MM / YY"
              value={cardForm.expiry}
              onChange={e => setCardForm(f => ({ ...f, expiry: e.target.value }))}
              maxLength={5}
              style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }}
            />
            <input
              placeholder="CVV"
              value={cardForm.cvv}
              onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value }))}
              maxLength={4}
              type="password"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 14px', color: C.cream, fontSize: 13, outline: 'none' }}
            />
          </div>
        </div>
      </div>
    )}

    {/* PayPal */}
    {payMethod === 'paypal' && (
      <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, textAlign: 'center' }}>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>
          You'll be redirected to PayPal to complete payment securely.
        </p>
        <div style={{ backgroundColor: '#003087', borderRadius: 9, padding: '12px 24px', display: 'inline-block', color: '#fff', fontWeight: 900, fontSize: 13 }}>
          🅿 Continue with PayPal
        </div>
      </div>
    )}

    {/* Bank */}
    {payMethod === 'bank' && (
      <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 12 }}>Bank Transfer Details</p>
        {[
          ['Bank',        'Equity Bank Kenya'],
          ['Account Name','57 Arts & Customs Ltd'],
          ['Account No.', '0123456789'],
          ['Branch',      'Nairobi CBD'],
        ].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
            <span style={{ color: C.cream, fontWeight: 700, fontSize: 12 }}>{val}</span>
          </div>
        ))}
      </div>
    )}

    {verifyError && <Alert type="error">{verifyError}</Alert>}
  </div>
);

/* ─── Step 2: Verify ─────────────────────────────────────────────────────────── */
const StepVerify = ({
  payMethod, mpesaPhone,
  verified, verifying, verifyError,
  pollCount, total,
  handleVerifyPayment,
}) => {
  const icons = { mpesa: '📱', card: '💳', paypal: '🅿', bank: '🏦' };
  const hints = {
    mpesa:  `STK push sent to ${mpesaPhone}. After entering your PIN, click verify below.`,
    card:   'Click below to verify your card payment.',
    paypal: 'Complete your PayPal payment, then click verify.',
    bank:   'After completing the bank transfer, click verify.',
  };

  return (
    <div>
      <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 8 }}>
        Verify Payment
      </h2>
      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
        {hints[payMethod]}
      </p>

      <div style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 28,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          {verified ? '✅' : verifying ? '⏳' : icons[payMethod]}
        </div>

        {!verified ? (
          <>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 15, marginBottom: 8 }}>
              {verifying
                ? `Checking payment… (${pollCount}/12)`
                : payMethod === 'mpesa'
                ? 'Waiting for M-Pesa confirmation'
                : 'Confirm Payment'}
            </p>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 22 }}>
              Amount: <strong style={{ color: C.gold }}>{fmt(total)}</strong>
              {payMethod === 'mpesa' && ` · ${mpesaPhone}`}
            </p>
            {!verifying && (
              <button
                onClick={handleVerifyPayment}
                style={{
                  backgroundColor: C.gold, color: '#000',
                  border: 'none', borderRadius: 10,
                  padding: '14px 32px', fontWeight: 900, fontSize: 13, cursor: 'pointer',
                }}
              >
                I Have Paid — Verify Now
              </button>
            )}
            {verifying && payMethod === 'mpesa' && (
              <p style={{ color: C.muted, fontSize: 11, marginTop: 12 }}>
                Checking every 5 seconds. Up to 60 seconds.
              </p>
            )}
          </>
        ) : (
          <>
            <p style={{ color: C.green, fontWeight: 900, fontSize: 15, marginBottom: 8 }}>
              Payment Verified!
            </p>
            <p style={{ color: C.muted, fontSize: 12 }}>
              {fmt(total)} confirmed. You can now place your order.
            </p>
          </>
        )}

        {verifyError && (
          <div style={{ marginTop: 14, textAlign: 'left' }}>
            <Alert type="error">{verifyError}</Alert>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Step 3: Review ─────────────────────────────────────────────────────────── */
const StepReview = ({ form, payMethod, items, placeError, setStep }) => (
  <div>
    <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 20, textTransform: 'uppercase', marginBottom: 28 }}>
      Review Order
    </h2>

    {/* Delivery summary */}
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>Delivery</p>
        <button
          onClick={() => setStep(0)}
          style={{ background: 'none', border: 'none', color: C.gold, fontSize: 12, cursor: 'pointer', fontWeight: 700 }}
        >
          Edit
        </button>
      </div>
      <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>
        {form.name} · {form.email}<br />
        {form.address}, {form.city}, {form.country}
      </p>
    </div>

    {/* Payment summary */}
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>Payment</p>
        <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>✓ Verified</span>
      </div>
      <p style={{ color: C.muted, fontSize: 12 }}>
        {paymentMethods.find(m => m.id === payMethod)?.label}
      </p>
    </div>

    {/* Items */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(item => (
        <div
          key={item.id}
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '14px 18px',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
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
      <div style={{ marginTop: 16 }}>
        <Alert type="error">{placeError}</Alert>
      </div>
    )}
  </div>
);

/* ─── Order Summary sidebar ──────────────────────────────────────────────────── */
const OrderSummary = ({ items, subtotal, shipping, total, verified, step }) => (
  <div style={{
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: 24,
    position: 'sticky',
    top: 24,
  }}>
    <h3 style={{
      color: C.cream, fontWeight: 900, fontSize: 14,
      textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 18,
    }}>
      Order Summary
    </h3>

    {items.map(item => (
      <div key={item.id} style={{
        display: 'flex', gap: 12, marginBottom: 14,
        paddingBottom: 14, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={item.img} alt={item.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} />
          <span style={{
            position: 'absolute', top: -6, right: -6,
            backgroundColor: C.faint, border: `1px solid ${C.border}`,
            color: C.cream, fontSize: 10, fontWeight: 900,
            width: 18, height: 18, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {item.qty}
          </span>
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
        <span style={{ color: shipping === 0 ? C.green : C.cream, fontWeight: 700, fontSize: 12 }}>
          {shipping === 0 ? 'Free' : fmt(shipping)}
        </span>
      </div>
      {shipping > 0 && (
        <p style={{ color: C.muted, fontSize: 11 }}>Free shipping on orders under KSH 500</p>
      )}
      <div style={{
        borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>Total</span>
        <span style={{ color: C.gold, fontWeight: 900, fontSize: 16 }}>{fmt(total)}</span>
      </div>
    </div>

    {step >= 2 && (
      <div style={{ marginTop: 14 }}>
        <Alert type={verified ? 'success' : 'info'}>
          {verified ? '✓ Payment Verified' : '⏳ Awaiting payment verification'}
        </Alert>
      </div>
    )}
  </div>
);

/* ─── Main Checkout component ────────────────────────────────────────────────── */
const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  /* step state */
  const [step, setStep] = useState(0);

  /* delivery form */
  const [form, setForm] = useState({
    name:    user?.name             || '',
    email:   user?.email            || '',
    phone:   user?.phone            || '',
    address: user?.address?.street  || '',
    city:    user?.address?.city    || '',
    country: user?.address?.country || 'Kenya',
    notes:   '',
  });
  const [errors, setErrors] = useState({});

  /* payment */
  const [payMethod,          setPayMethod]          = useState('mpesa');
  const [mpesaPhone,         setMpesaPhone]         = useState(user?.phone || '');
  const [stkSent,            setStkSent]            = useState(false);
  const [stkLoading,         setStkLoading]         = useState(false);
  const [checkoutRequestId,  setCheckoutRequestId]  = useState('');
  const [cardForm,           setCardForm]           = useState({ number: '', expiry: '', cvv: '', holder: '' });

  /* verify */
  const [verifying,   setVerifying]   = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verified,    setVerified]    = useState(false);
  const [pollCount,   setPollCount]   = useState(0);
  const pollRef = useRef(null);

  /* place order */
  const [placed,      setPlaced]      = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [placing,     setPlacing]     = useState(false);
  const [placeError,  setPlaceError]  = useState('');

  /* derived */
  const shipping = calcShipping(subtotal);
  const total    = subtotal + shipping;

  /* cleanup polling on unmount */
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  /* ── Validation ──────────────────────────────────────────────────────────── */
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

  /* ── Step navigation ─────────────────────────────────────────────────────── */
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

  const handleBack = () => {
    setStep(s => s - 1);
    setVerifyError('');
    setPlaceError('');
  };

  /* ── M-Pesa STK ──────────────────────────────────────────────────────────── */
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

  /* ── Payment polling ─────────────────────────────────────────────────────── */
  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setPollCount(0);
    pollRef.current = setInterval(async () => {
      setPollCount(c => {
        if (c >= 12) {
          clearInterval(pollRef.current);
          setVerifying(false);
          setVerifyError('Payment not confirmed. Please check your phone and try again.');
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
      } catch { /* ignore transient errors */ }
    }, 5000);
  };

  /* ── Verify payment ──────────────────────────────────────────────────────── */
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
      } catch { /* fall through to polling */ }
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

    /* PayPal / Bank — simulate verification */
    setTimeout(() => { setVerified(true); setVerifying(false); }, 1500);
  };

  /* ── Place order ─────────────────────────────────────────────────────────── */
  const placeOrder = async () => {
    if (!verified) {
      setPlaceError('Please verify your payment before placing the order.');
      return;
    }

    const invalidItems = items.filter(item => !isValidObjectId(item.id));
    if (invalidItems.length > 0) {
      setPlaceError(
        `Some items have an invalid product ID (${invalidItems.map(i => i.name).join(', ')}). ` +
        'Please remove them from your cart and add them again.',
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
        'Failed to place order. Please try again.',
      );
    } finally {
      setPlacing(false);
    }
  };

  /* ── Order confirmed screen ──────────────────────────────────────────────── */
  if (placed && placedOrder) return (
    <div style={{
      backgroundColor: C.bg, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 460, padding: '0 24px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          border: `2px solid ${C.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <span style={{ color: C.gold, fontSize: 28 }}>✓</span>
        </div>
        <h2 style={{
          color: C.cream, fontWeight: 900, fontSize: 28,
          textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          Order Confirmed!
        </h2>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
          Order <strong style={{ color: C.cream }}>#{placedOrder.orderNumber}</strong> confirmed and payment verified.
        </p>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 32 }}>
          Confirmation sent to <strong style={{ color: C.cream }}>{form.email}</strong>. Artisan will contact you within 24 hours.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link to="/order-tracking" style={{
            backgroundColor: C.gold, color: '#000',
            padding: '12px 24px', borderRadius: 10,
            fontWeight: 900, fontSize: 13, textDecoration: 'none',
          }}>
            Track Order →
          </Link>
          <Link to="/shop" style={{
            backgroundColor: 'transparent', color: C.cream,
            padding: '12px 24px', borderRadius: 10,
            fontWeight: 900, fontSize: 13, textDecoration: 'none',
            border: `1px solid ${C.border}`,
          }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  /* ── Empty cart screen ───────────────────────────────────────────────────── */
  if (items.length === 0) return (
    <div style={{
      backgroundColor: C.bg, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <p style={{ color: C.muted, fontSize: 14 }}>Your cart is empty.</p>
      <Link to="/shop" style={{
        backgroundColor: C.gold, color: '#000',
        padding: '12px 24px', borderRadius: 10,
        fontWeight: 900, fontSize: 13, textDecoration: 'none',
      }}>
        Browse Shop →
      </Link>
    </div>
  );

  /* ── Main layout ─────────────────────────────────────────────────────────── */
  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ── Header / stepper ─────────────────────────────────────────────── */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '24px 48px',
        backgroundColor: C.surface,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              backgroundColor: C.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 10, color: '#000',
            }}>
              57
            </div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57 ARTS & CUSTOMS</span>
          </Link>

          {/* Step indicators */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: `1px solid ${i <= step ? C.gold : C.border}`,
                    backgroundColor: i < step ? C.gold : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900,
                    color: i < step ? '#000' : i === step ? C.gold : C.muted,
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{
                    color: i === step ? C.cream : C.muted,
                    fontSize: 12,
                    fontWeight: i === step ? 900 : 400,
                  }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 28, height: 1,
                    backgroundColor: i < step ? C.gold : C.border,
                    margin: '0 8px',
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <Link to="/cart" style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}>
            ← Back to Cart
          </Link>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '40px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: 40,
      }}>

        {/* Left — active step */}
        <div>
          {step === 0 && (
            <StepDelivery form={form} setForm={setForm} errors={errors} />
          )}
          {step === 1 && (
            <StepPayment
              payMethod={payMethod}         setPayMethod={setPayMethod}
              mpesaPhone={mpesaPhone}       setMpesaPhone={setMpesaPhone}
              stkSent={stkSent}             setStkSent={setStkSent}
              stkLoading={stkLoading}       sendSTK={sendSTK}
              cardForm={cardForm}           setCardForm={setCardForm}
              verifyError={verifyError}     setVerifyError={setVerifyError}
              setCheckoutRequestId={setCheckoutRequestId}
              total={total}
            />
          )}
          {step === 2 && (
            <StepVerify
              payMethod={payMethod}
              mpesaPhone={mpesaPhone}
              verified={verified}
              verifying={verifying}
              verifyError={verifyError}
              pollCount={pollCount}
              total={total}
              handleVerifyPayment={handleVerifyPayment}
            />
          )}
          {step === 3 && (
            <StepReview
              form={form}
              payMethod={payMethod}
              items={items}
              placeError={placeError}
              setStep={setStep}
            />
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${C.border}`,
                  color: C.cream, padding: '13px 24px',
                  borderRadius: 10, fontWeight: 900, fontSize: 13, cursor: 'pointer',
                }}
              >
                ← Back
              </button>
            )}

            {step === 2 ? (
              <button
                onClick={() => verified && setStep(3)}
                disabled={!verified}
                style={{
                  flex: 1,
                  backgroundColor: verified ? C.cream : C.faint,
                  color:           verified ? '#000'  : C.muted,
                  border: 'none', borderRadius: 10,
                  padding: '13px', fontWeight: 900, fontSize: 13,
                  cursor: verified ? 'pointer' : 'not-allowed',
                }}
              >
                {verified ? 'Continue to Review →' : 'Verify Payment to Continue'}
              </button>
            ) : step < 3 ? (
              <button
                onClick={handleNext}
                style={{
                  flex: 1,
                  backgroundColor: C.cream, color: '#000',
                  border: 'none', borderRadius: 10,
                  padding: '13px', fontWeight: 900, fontSize: 13, cursor: 'pointer',
                }}
              >
                Continue to {STEPS[step + 1]} →
              </button>
            ) : (
              <button
                onClick={placeOrder}
                disabled={placing}
                style={{
                  flex: 1,
                  backgroundColor: placing ? C.faint : C.gold,
                  color:           placing ? C.muted  : '#000',
                  border: 'none', borderRadius: 10,
                  padding: '13px', fontWeight: 900, fontSize: 14,
                  cursor: placing ? 'not-allowed' : 'pointer',
                }}
              >
                {placing ? 'Placing Order…' : `Place Order · ${fmt(total)} →`}
              </button>
            )}
          </div>
        </div>

        {/* Right — order summary */}
        <OrderSummary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          verified={verified}
          step={step}
        />
      </div>
    </div>
  );
};

export default Checkout;