import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const cartItems = [
  {
    id: 1,
    name: 'Distressed Artisanal Denim',
    price: 450,
    qty: 1,
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200',
    category: 'Fashion',
  },
  {
    id: 2,
    name: 'Gold-Infused Obsidian Beads',
    price: 185,
    qty: 2,
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200',
    category: 'Beads',
  },
];

const paymentMethods = [
  {
    id: 'mpesa',
    label: 'M-Pesa',
    icon: '📱',
    desc: 'Pay via Safaricom M-Pesa',
    color: '#00A651',
  },
  {
    id: 'visa',
    label: 'Visa / Mastercard',
    icon: '💳',
    desc: 'Credit or debit card',
    color: '#1A1F71',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: '🅿',
    desc: 'Pay with your PayPal account',
    color: '#003087',
  },
  {
    id: 'crypto',
    label: 'Crypto',
    icon: '₿',
    desc: 'Bitcoin, USDT, Ethereum',
    color: '#F7931A',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: '🏦',
    desc: 'Direct bank transfer',
    color: '#6B7280',
  },
];

const Checkout = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = shipping, 2 = payment, 3 = review
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(`ART-${Math.floor(10000 + Math.random() * 90000)}`);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [errors, setErrors] = useState({});

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postal: '', country: 'Kenya',
  });

  // Card fields
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  // M-Pesa fields
  const [mpesa, setMpesa] = useState({ phone: '' });

  // PayPal fields
  const [paypal, setPaypal] = useState({ email: '' });

  // Crypto fields
  const [crypto, setCrypto] = useState({ coin: 'BTC' });

  // Bank fields
  const [bank] = useState({
    name: '57 Arts & Customs Ltd',
    account: '1234567890',
    bank: 'Equity Bank Kenya',
    branch: 'Westlands',
    code: 'EQBLKENA',
  });

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping_fee = subtotal > 500 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping_fee + tax;

  const formatCard = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = 'Required';
    if (!shipping.lastName.trim()) e.lastName = 'Required';
    if (!shipping.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) e.email = 'Invalid email';
    if (!shipping.phone.trim()) e.phone = 'Required';
    if (!shipping.address.trim()) e.address = 'Required';
    if (!shipping.city.trim()) e.city = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!selectedPayment) { e.payment = 'Please select a payment method'; setErrors(e); return false; }

    if (selectedPayment === 'visa') {
      const raw = card.number.replace(/\s/g, '');
      if (raw.length !== 16) e.cardNumber = 'Card number must be 16 digits';
      if (!card.name.trim()) e.cardName = 'Required';
      if (!card.expiry || card.expiry.length < 5) e.expiry = 'Invalid expiry';
      else {
        const [mm, yy] = card.expiry.split('/');
        const now = new Date();
        const expDate = new Date(2000 + parseInt(yy), parseInt(mm) - 1);
        if (expDate < now) e.expiry = 'Card has expired';
      }
      if (!card.cvv || card.cvv.length < 3) e.cvv = 'Invalid CVV';
    }

    if (selectedPayment === 'mpesa') {
      const phone = mpesa.phone.replace(/\s/g, '');
      if (!phone) e.mpesaPhone = 'Required';
      else if (!/^(07|01|2547|2541)\d{8,}$/.test(phone)) e.mpesaPhone = 'Enter a valid Safaricom number';
    }

    if (selectedPayment === 'paypal') {
      if (!paypal.email.trim()) e.paypalEmail = 'Required';
      else if (!/\S+@\S+\.\S+/.test(paypal.email)) e.paypalEmail = 'Invalid email';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
    }, 2000);
  };

  // ── SUCCESS STATE ──
  if (orderPlaced) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-8"
        style={{ backgroundColor: '#1a1500' }}
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h2 className="text-white font-black text-3xl uppercase mb-2">Order Placed!</h2>
          <p className="text-gray-400 text-sm mb-1">
            Your order <span className="text-yellow-400 font-black">#{orderNumber}</span> has been confirmed.
          </p>
          <p className="text-gray-600 text-xs mb-8">
            {selectedPayment === 'mpesa' && 'Check your phone for the M-Pesa STK push prompt.'}
            {selectedPayment === 'visa' && 'Your card has been charged successfully.'}
            {selectedPayment === 'paypal' && 'Payment confirmed via PayPal.'}
            {selectedPayment === 'crypto' && 'Send your crypto to the address provided via email.'}
            {selectedPayment === 'bank' && 'Please complete your bank transfer within 24 hours.'}
          </p>
          <div
            className="rounded-2xl p-5 border border-gray-800 mb-8 text-left"
            style={{ backgroundColor: '#1a1a00' }}
          >
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Order Summary</p>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                <p className="text-white text-sm">{item.name}</p>
                <p className="text-yellow-400 font-black text-sm">${(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
            <div className="flex justify-between items-center mt-3 pt-2">
              <p className="text-white font-black">Total Paid</p>
              <p className="text-yellow-400 font-black text-xl">${total.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/order-tracking')}
              className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
            >
              Track Order
            </button>
            <Link
              to="/shop"
              className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* BREADCRUMB + STEPS */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <span>›</span>
            <Link to="/cart" className="hover:text-yellow-400 transition">Cart</Link>
            <span>›</span>
            <span className="text-yellow-400">Checkout</span>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition ${
                      step >= s.num
                        ? 'bg-yellow-400 text-black'
                        : 'border border-gray-700 text-gray-600'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wide ${step >= s.num ? 'text-white' : 'text-gray-600'}`}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-px max-w-16 ${step > s.num ? 'bg-yellow-400' : 'bg-gray-800'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 grid grid-cols-3 gap-8">

        {/* LEFT - FORM */}
        <div className="col-span-2 space-y-6">

          {/* ── STEP 1: SHIPPING ── */}
          {step === 1 && (
            <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
              <div className="p-5 border-b border-gray-800 flex items-center gap-3">
                <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-xs">1</div>
                <h2 className="text-white font-black text-sm uppercase tracking-widest">Shipping Information</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'firstName', label: 'First Name', placeholder: 'Alex' },
                    { key: 'lastName', label: 'Last Name', placeholder: 'Julian' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">{f.label}</label>
                      <input
                        type="text"
                        value={shipping[f.key]}
                        onChange={e => setShipping({ ...shipping, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                          errors[f.key] ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                        }`}
                        style={{ backgroundColor: '#2a2000' }}
                      />
                      {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Email</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={e => setShipping({ ...shipping, email: e.target.value })}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                        errors.email ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      style={{ backgroundColor: '#2a2000' }}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Phone</label>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="+254 712 345 678"
                      className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                        errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      style={{ backgroundColor: '#2a2000' }}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Street Address</label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={e => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="123 Artisan Lane"
                    className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                      errors.address ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                    }`}
                    style={{ backgroundColor: '#2a2000' }}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">City</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={e => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="Nairobi"
                      className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                        errors.city ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      style={{ backgroundColor: '#2a2000' }}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={shipping.postal}
                      onChange={e => setShipping({ ...shipping, postal: e.target.value })}
                      placeholder="00100"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }}
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Country</label>
                    <select
                      value={shipping.country}
                      onChange={e => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                      style={{ backgroundColor: '#2a2000' }}
                    >
                      {['Kenya', 'Uganda', 'Tanzania', 'Nigeria', 'South Africa', 'Ghana', 'USA', 'UK', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => { if (validateShipping()) setStep(2); }}
                  className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition mt-2"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === 2 && (
            <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
              <div className="p-5 border-b border-gray-800 flex items-center gap-3">
                <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-xs">2</div>
                <h2 className="text-white font-black text-sm uppercase tracking-widest">Payment Method</h2>
              </div>
              <div className="p-5 space-y-4">

                {/* Payment method selector */}
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => { setSelectedPayment(method.id); setErrors({}); }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition ${
                        selectedPayment === method.id
                          ? 'border-yellow-400 bg-yellow-400 bg-opacity-5'
                          : 'border-gray-800 hover:border-gray-600'
                      }`}
                      style={{ backgroundColor: selectedPayment === method.id ? undefined : '#2a2000' }}
                    >
                      <span className="text-2xl w-8 text-center">{method.icon}</span>
                      <div className="flex-1">
                        <p className={`font-black text-sm ${selectedPayment === method.id ? 'text-yellow-400' : 'text-white'}`}>
                          {method.label}
                        </p>
                        <p className="text-gray-500 text-xs">{method.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id ? 'border-yellow-400' : 'border-gray-600'
                      }`}>
                        {selectedPayment === method.id && (
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {errors.payment && (
                  <p className="text-red-400 text-xs">{errors.payment}</p>
                )}

                {/* ── VISA/MASTERCARD FORM ── */}
                {selectedPayment === 'visa' && (
                  <div
                    className="rounded-xl p-5 border border-yellow-900 space-y-4 mt-2"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">Card Details</p>

                    <div>
                      <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Card Number</label>
                      <input
                        type="text"
                        value={card.number}
                        onChange={e => setCard({ ...card, number: formatCard(e.target.value) })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 font-mono tracking-widest ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                        }`}
                        style={{ backgroundColor: '#1a1a00' }}
                      />
                      {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={card.name}
                        onChange={e => setCard({ ...card, name: e.target.value })}
                        placeholder="ALEX JULIAN"
                        className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 uppercase ${
                          errors.cardName ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                        }`}
                        style={{ backgroundColor: '#1a1a00' }}
                      />
                      {errors.cardName && <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={card.expiry}
                          onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                            errors.expiry ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                          }`}
                          style={{ backgroundColor: '#1a1a00' }}
                        />
                        {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">CVV</label>
                        <input
                          type="password"
                          value={card.cvv}
                          onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          placeholder="•••"
                          maxLength={4}
                          className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                            errors.cvv ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                          }`}
                          style={{ backgroundColor: '#1a1a00' }}
                        />
                        {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-green-400 text-xs">🔒</span>
                      <p className="text-gray-600 text-xs">256-bit SSL encrypted. Your card info is never stored.</p>
                    </div>
                  </div>
                )}

                {/* ── MPESA FORM ── */}
                {selectedPayment === 'mpesa' && (
                  <div
                    className="rounded-xl p-5 border border-yellow-900 space-y-4 mt-2"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">M-Pesa Details</p>
                    <div
                      className="flex items-start gap-3 p-3 rounded-xl border border-green-900"
                      style={{ backgroundColor: '#0d1a0d' }}
                    >
                      <span className="text-green-400 text-lg mt-0.5">📱</span>
                      <div>
                        <p className="text-green-400 font-black text-xs">How it works</p>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                          Enter your Safaricom number. You'll receive an STK push notification on your phone.
                          Enter your M-Pesa PIN to complete payment.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                        Safaricom Phone Number
                      </label>
                      <div className="flex gap-2">
                        <div
                          className="flex items-center px-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-black flex-shrink-0"
                          style={{ backgroundColor: '#1a1a00' }}
                        >
                          🇰🇪 +254
                        </div>
                        <input
                          type="tel"
                          value={mpesa.phone}
                          onChange={e => setMpesa({ phone: e.target.value.replace(/\D/g, '') })}
                          placeholder="712 345 678"
                          className={`flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                            errors.mpesaPhone ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                          }`}
                          style={{ backgroundColor: '#1a1a00' }}
                        />
                      </div>
                      {errors.mpesaPhone && <p className="text-red-400 text-xs mt-1">{errors.mpesaPhone}</p>}
                    </div>
                    <p className="text-gray-600 text-xs">
                      Amount to be charged: <span className="text-yellow-400 font-black">KES {(total * 130).toLocaleString()}</span>
                      <span className="text-gray-700"> (approx. ${total})</span>
                    </p>
                  </div>
                )}

                {/* ── PAYPAL FORM ── */}
                {selectedPayment === 'paypal' && (
                  <div
                    className="rounded-xl p-5 border border-yellow-900 space-y-4 mt-2"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">PayPal Details</p>
                    <div>
                      <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                        PayPal Email Address
                      </label>
                      <input
                        type="email"
                        value={paypal.email}
                        onChange={e => setPaypal({ email: e.target.value })}
                        placeholder="your@paypal.com"
                        className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 ${
                          errors.paypalEmail ? 'border-red-500' : 'border-gray-700 focus:border-yellow-400'
                        }`}
                        style={{ backgroundColor: '#1a1a00' }}
                      />
                      {errors.paypalEmail && <p className="text-red-400 text-xs mt-1">{errors.paypalEmail}</p>}
                    </div>
                    <p className="text-gray-500 text-xs">
                      You'll be redirected to PayPal to complete your payment of{' '}
                      <span className="text-yellow-400 font-black">${total}</span>
                    </p>
                  </div>
                )}

                {/* ── CRYPTO FORM ── */}
                {selectedPayment === 'crypto' && (
                  <div
                    className="rounded-xl p-5 border border-yellow-900 space-y-4 mt-2"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">Crypto Payment</p>
                    <div>
                      <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Select Coin</label>
                      <div className="flex gap-2">
                        {['BTC', 'ETH', 'USDT'].map(coin => (
                          <button
                            key={coin}
                            onClick={() => setCrypto({ coin })}
                            className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition ${
                              crypto.coin === coin
                                ? 'border-yellow-400 text-yellow-400'
                                : 'border-gray-700 text-gray-500 hover:border-gray-500'
                            }`}
                            style={{ backgroundColor: '#1a1a00' }}
                          >
                            {coin}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div
                      className="p-4 rounded-xl border border-gray-700 text-center"
                      style={{ backgroundColor: '#1a1a00' }}
                    >
                      <p className="text-gray-500 text-xs mb-2">Send exactly</p>
                      <p className="text-yellow-400 font-black text-lg">
                        {crypto.coin === 'BTC' ? '0.0087' : crypto.coin === 'ETH' ? '0.213' : total.toString()} {crypto.coin}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">≈ ${total}</p>
                      <p className="text-gray-500 text-xs mt-3 font-black">Wallet address will be emailed after confirmation.</p>
                    </div>
                  </div>
                )}

                {/* ── BANK TRANSFER ── */}
                {selectedPayment === 'bank' && (
                  <div
                    className="rounded-xl p-5 border border-yellow-900 space-y-3 mt-2"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">Bank Transfer Details</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Account Name', value: bank.name },
                        { label: 'Account Number', value: bank.account },
                        { label: 'Bank', value: bank.bank },
                        { label: 'Branch', value: bank.branch },
                        { label: 'SWIFT Code', value: bank.code },
                      ].map(f => (
                        <div key={f.label} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                          <span className="text-gray-500 text-xs">{f.label}</span>
                          <span className="text-white text-xs font-black">{f.value}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex items-start gap-2 p-3 rounded-xl border border-yellow-900 mt-2"
                      style={{ backgroundColor: '#1a1a00' }}
                    >
                      <span className="text-yellow-400">⚠️</span>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Use order <span className="text-yellow-400 font-black">#{orderNumber}</span> as your payment reference.
                        Transfer must be completed within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-700 text-gray-400 py-3.5 rounded-xl font-black text-xs uppercase hover:border-yellow-400 hover:text-yellow-400 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => { if (validatePayment()) setStep(3); }}
                    className="flex-1 bg-yellow-400 text-black py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: REVIEW ── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Shipping summary */}
              <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-black">✓</div>
                    <p className="text-white font-black text-sm uppercase tracking-wide">Shipping</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-yellow-400 text-xs font-black hover:underline">Edit</button>
                </div>
                <div className="p-4">
                  <p className="text-white text-sm font-black">{shipping.firstName} {shipping.lastName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{shipping.address}, {shipping.city}, {shipping.country}</p>
                  <p className="text-gray-400 text-xs">{shipping.email} · {shipping.phone}</p>
                </div>
              </div>

              {/* Payment summary */}
              <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ backgroundColor: '#1a1a00' }}>
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-black">✓</div>
                    <p className="text-white font-black text-sm uppercase tracking-wide">Payment</p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-yellow-400 text-xs font-black hover:underline">Edit</button>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{paymentMethods.find(p => p.id === selectedPayment)?.icon}</span>
                  <div>
                    <p className="text-white text-sm font-black">{paymentMethods.find(p => p.id === selectedPayment)?.label}</p>
                    {selectedPayment === 'visa' && card.number && (
                      <p className="text-gray-500 text-xs">•••• •••• •••• {card.number.replace(/\s/g, '').slice(-4)}</p>
                    )}
                    {selectedPayment === 'mpesa' && mpesa.phone && (
                      <p className="text-gray-500 text-xs">+254 {mpesa.phone}</p>
                    )}
                    {selectedPayment === 'paypal' && paypal.email && (
                      <p className="text-gray-500 text-xs">{paypal.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🔒', text: 'SSL Secured' },
                  { icon: '✦', text: 'Authenticity Guaranteed' },
                  { icon: '↩', text: '14-Day Returns' },
                ].map(b => (
                  <div
                    key={b.text}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-800 text-center"
                    style={{ backgroundColor: '#1a1a00' }}
                  >
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-gray-500 text-xs">{b.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-700 text-gray-400 py-3.5 rounded-xl font-black text-xs uppercase hover:border-yellow-400 hover:text-yellow-400 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-yellow-400 text-black py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin text-sm">⟳</span> Processing...
                    </>
                  ) : (
                    `Place Order · $${total.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-800 overflow-hidden sticky top-24" style={{ backgroundColor: '#1a1a00' }}>
            <div className="p-5 border-b border-gray-800">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Order Summary</h3>
            </div>
            <div className="p-5 space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-black truncate">{item.name}</p>
                    <p className="text-gray-600 text-xs">{item.category}</p>
                  </div>
                  <p className="text-white text-xs font-black flex-shrink-0">${(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 space-y-2">
              <div className="h-px bg-gray-800 my-3" />
              {[
                { label: 'Subtotal', value: `$${subtotal.toLocaleString()}` },
                { label: 'Shipping', value: shipping_fee === 0 ? 'FREE' : `$${shipping_fee}` },
                { label: 'Tax (8%)', value: `$${tax}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500 text-xs">{row.label}</span>
                  <span className={`text-xs font-black ${row.value === 'FREE' ? 'text-green-400' : 'text-white'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="h-px bg-gray-800 my-3" />
              <div className="flex justify-between items-center">
                <span className="text-white font-black text-sm">Total</span>
                <span className="text-yellow-400 font-black text-xl">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Link
            to="/cart"
            className="flex items-center justify-center gap-2 border border-gray-800 text-gray-500 py-3 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            ← Edit Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;