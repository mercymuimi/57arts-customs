import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    num: 1,
    label: 'Order Placed',
    desc: 'Your order has been received',
    date: 'Oct 22, 2023 · 9:14 AM',
    done: true,
  },
  {
    num: 2,
    label: 'Order Confirmed',
    desc: 'Artisan accepted your request',
    date: 'Oct 22, 2023 · 11:30 AM',
    done: true,
  },
  {
    num: 3,
    label: 'Crafting',
    desc: 'Your piece is being handcrafted',
    date: 'Oct 24, 2023 · 8:00 AM',
    done: true,
    active: true,
  },
  {
    num: 4,
    label: 'Shipped',
    desc: 'On the way to you',
    date: 'Est. Oct 28, 2023',
    done: false,
  },
  {
    num: 5,
    label: 'Delivered',
    desc: 'Enjoy your masterpiece',
    date: 'Est. Oct 30 – Nov 1',
    done: false,
  },
];

const timeline = [
  {
    time: 'Oct 24 · 8:00 AM',
    title: 'Crafting Started',
    desc: 'Master Julian has begun work on your piece.',
    icon: '🎨',
    done: true,
  },
  {
    time: 'Oct 23 · 3:45 PM',
    title: 'Materials Sourced',
    desc: '24k gold leaf and teak wood confirmed.',
    icon: '📦',
    done: true,
  },
  {
    time: 'Oct 22 · 11:30 AM',
    title: 'Order Confirmed',
    desc: 'Your artisan accepted the commission.',
    icon: '✓',
    done: true,
  },
  {
    time: 'Oct 22 · 9:14 AM',
    title: 'Order Placed',
    desc: 'Payment received via M-Pesa.',
    icon: '💳',
    done: true,
  },
];

/* ─── MODAL OVERLAY ─── */
const Modal = ({ onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-md rounded-2xl border border-gray-700 p-6"
      style={{ backgroundColor: '#1a1a00' }}
      onClick={e => e.stopPropagation()}
    >
      {/* close btn */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white text-lg leading-none"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

/* ─── CANCEL ORDER MODAL ─── */
const CancelModal = ({ onClose }) => {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Delivery time too long',
    'Other',
  ];

  const handleSubmit = () => {
    if (!reason) return;
    setSubmitted(true);
  };

  return (
    <Modal onClose={onClose}>
      {!submitted ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-400 text-xl">⚠</span>
            <h2 className="text-white font-black text-lg">Cancel Order</h2>
          </div>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            Are you sure you want to cancel <span className="text-white font-black">#AC-98234</span>?
            Since your order is currently in production, cancellation may not be fully refundable.
          </p>

          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">
            Reason for cancellation
          </p>
          <div className="space-y-2 mb-5">
            {reasons.map(r => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`w-full text-left text-xs px-4 py-3 rounded-xl border font-black transition ${
                  reason === r
                    ? 'border-red-500 text-red-400 bg-red-500 bg-opacity-10'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-black text-xs hover:border-gray-500 hover:text-white transition"
            >
              Keep Order
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason}
              className={`flex-1 py-3 rounded-xl font-black text-xs transition ${
                reason
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              Confirm Cancellation
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h2 className="text-white font-black text-lg mb-2">Request Submitted</h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-5">
            Your cancellation request has been sent. Our team will review it and respond within
            24 hours. You'll receive a confirmation via email.
          </p>
          <p className="text-gray-600 text-xs mb-5">
            ℹ️ This is a UI simulation — backend integration required to process cancellations.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-700 text-gray-300 font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

/* ─── REQUEST CHANGES MODAL ─── */
const ChangesModal = ({ onClose }) => {
  const [changeType, setChangeType] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const changeTypes = [
    { label: '🎨 Design / Style', value: 'design' },
    { label: '📐 Size / Dimensions', value: 'size' },
    { label: '🪵 Materials', value: 'materials' },
    { label: '📦 Shipping Address', value: 'shipping' },
    { label: '✍️ Other', value: 'other' },
  ];

  const handleSubmit = () => {
    if (!changeType || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <Modal onClose={onClose}>
      {!submitted ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-xl">↩</span>
            <h2 className="text-white font-black text-lg">Request Changes</h2>
          </div>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            Send a change request to your artisan for order{' '}
            <span className="text-white font-black">#AC-98234</span>. Note that changes
            during crafting may affect delivery time.
          </p>

          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">
            Type of Change
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {changeTypes.map(ct => (
              <button
                key={ct.value}
                onClick={() => setChangeType(ct.value)}
                className={`text-left text-xs px-3 py-2.5 rounded-xl border font-black transition ${
                  changeType === ct.value
                    ? 'border-yellow-400 text-yellow-400 bg-yellow-400 bg-opacity-10'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">
            Describe the Change
          </p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="E.g. Please use a slightly darker wood stain on the frame..."
            rows={4}
            className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-yellow-400 resize-none placeholder-gray-700 mb-5"
          />

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-black text-xs hover:border-gray-500 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!changeType || !message.trim()}
              className={`flex-1 py-3 rounded-xl font-black text-xs transition ${
                changeType && message.trim()
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              Send Request
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h2 className="text-white font-black text-lg mb-2">Request Sent!</h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-5">
            Your change request has been forwarded to Master Julian. They'll review
            it and respond within 12 hours via the artisan chat.
          </p>
          <p className="text-gray-600 text-xs mb-5">
            ℹ️ This is a UI simulation — backend integration required to send requests.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-black text-xs hover:bg-yellow-500 transition"
          >
            Go to Chat
          </button>
        </div>
      )}
    </Modal>
  );
};

/* ─── INVOICE MODAL ─── */
const InvoiceModal = ({ onClose }) => {
  const handlePrint = () => window.print();

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400 text-xl">📄</span>
        <h2 className="text-white font-black text-lg">Invoice</h2>
      </div>

      {/* Invoice preview */}
      <div
        className="rounded-xl border border-gray-700 p-4 mb-4 text-xs"
        style={{ backgroundColor: '#0d0d00' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-7 h-7 rounded flex items-center justify-center font-black text-xs">57</span>
            <div>
              <p className="text-white font-black text-sm">57 Arts & Customs</p>
              <p className="text-gray-600 text-xs">info@57artscustoms.com</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-400 font-black">INVOICE</p>
            <p className="text-gray-500">#AC-98234</p>
          </div>
        </div>

        {/* Bill to / dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 uppercase tracking-widest mb-1" style={{ fontSize: '9px' }}>Bill To</p>
            <p className="text-white font-black">Michael Henderson</p>
            <p className="text-gray-400">1245 Artisan Way</p>
            <p className="text-gray-400">San Francisco, CA 94103</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 uppercase tracking-widest mb-1" style={{ fontSize: '9px' }}>Date Issued</p>
            <p className="text-white font-black">Oct 22, 2023</p>
            <p className="text-gray-500 uppercase tracking-widest mt-2 mb-1" style={{ fontSize: '9px' }}>Payment Method</p>
            <p className="text-white font-black">M-Pesa</p>
          </div>
        </div>

        {/* Line items */}
        <div className="border border-gray-800 rounded-lg overflow-hidden mb-3">
          <div className="grid grid-cols-3 bg-gray-900 px-3 py-2 text-gray-500 uppercase tracking-widest" style={{ fontSize: '9px' }}>
            <span className="col-span-2">Item</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="grid grid-cols-3 px-3 py-2.5 border-t border-gray-800">
            <div className="col-span-2">
              <p className="text-white font-black">Custom Gold Leaf Portrait</p>
              <p className="text-gray-500">Bespoke · 24k Gold on Teak</p>
            </div>
            <span className="text-white font-black text-right">$4,000.00</span>
          </div>
          <div className="grid grid-cols-3 px-3 py-2.5 border-t border-gray-800">
            <div className="col-span-2 text-gray-400">Expedited Global Handling</div>
            <span className="text-green-400 font-black text-right">FREE</span>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-1 text-right">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span><span>$4,000.00</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax (6.25%)</span><span>$250.00</span>
          </div>
          <div className="flex justify-between text-yellow-400 font-black pt-2 border-t border-gray-800 mt-2">
            <span>TOTAL</span><span>$4,250.00</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-800 text-center text-gray-600" style={{ fontSize: '9px' }}>
          Thank you for your order · 57 Arts & Customs · © 2024
        </div>
      </div>

      <p className="text-gray-600 text-xs mb-4 text-center">
        ℹ️ PDF download requires backend integration. Use print to save as PDF.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-black text-xs hover:border-gray-500 hover:text-white transition"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-black text-xs hover:bg-yellow-500 transition"
        >
          🖨 Print / Save PDF
        </button>
      </div>
    </Modal>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
const OrderTracking = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [modal, setModal] = useState(null); // 'cancel' | 'changes' | 'invoice' | null

  const currentStep = steps.find(s => s.active) || steps[0];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* MODALS */}
      {modal === 'cancel'  && <CancelModal  onClose={() => setModal(null)} />}
      {modal === 'changes' && <ChangesModal onClose={() => setModal(null)} />}
      {modal === 'invoice' && <InvoiceModal onClose={() => setModal(null)} />}

      {/* BREADCRUMB */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <span>›</span>
          <Link to="/profile" className="hover:text-yellow-400 transition">My Account</Link>
          <span>›</span>
          <span className="text-yellow-400">Order Tracking</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* ORDER HEADER */}
        <div
          className="rounded-2xl p-6 border border-gray-800 mb-6 flex items-center justify-between"
          style={{ backgroundColor: '#1a1a00' }}
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-white font-black text-xl">Order #AC-98234</h1>
              <span className="bg-yellow-400 bg-opacity-20 text-yellow-400 border border-yellow-900 text-xs font-black px-3 py-1 rounded-full">
                IN PRODUCTION
              </span>
            </div>
            <p className="text-gray-400 text-sm">Custom Gold Leaf Portrait — by Master Julian</p>
            <p className="text-gray-600 text-xs mt-1">Placed Oct 22, 2023 · Paid via M-Pesa · $4,250.00</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Est. Delivery</p>
            <p className="text-yellow-400 font-black text-lg">Oct 30 – Nov 1</p>
            <p className="text-gray-600 text-xs">Expedited Global Handling</p>
          </div>
        </div>

        {/* PROGRESS STEPS */}
        <div
          className="rounded-2xl p-6 border border-gray-800 mb-6"
          style={{ backgroundColor: '#1a1a00' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-px bg-yellow-400" />
            <p className="text-yellow-400 text-xs font-black uppercase tracking-widest">Current Status</p>
          </div>

          <h2 className="text-white font-black text-2xl mb-6">
            {currentStep.label === 'Crafting' ? 'In Production & Crafting' : currentStep.label}
          </h2>

          <div className="flex items-center gap-0 mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center gap-2 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                      step.done
                        ? 'bg-yellow-400 text-black'
                        : 'border-2 border-gray-700 text-gray-600'
                    } ${step.active ? 'ring-4 ring-yellow-400 ring-opacity-30' : ''}`}
                  >
                    {step.done ? '✓' : step.num}
                  </div>
                  <div className="text-center" style={{ width: '80px' }}>
                    <p className={`text-xs font-black ${
                      step.active ? 'text-yellow-400' : step.done ? 'text-white' : 'text-gray-600'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-6 rounded transition-all ${
                      steps[index + 1].done || steps[index + 1].active
                        ? 'bg-yellow-400'
                        : 'bg-gray-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div
            className="rounded-xl p-4 border border-yellow-900 flex items-center gap-3"
            style={{ backgroundColor: '#2a2000' }}
          >
            <span className="text-2xl">🎨</span>
            <div>
              <p className="text-yellow-400 font-black text-sm">Currently: Handcrafting Phase</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Your artisan is actively working on your piece. Expected to ship Oct 28.
              </p>
            </div>
          </div>
        </div>

        {/* TWO COLUMN */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT - TABS */}
          <div className="col-span-2 space-y-4">

            {/* Artisan Update Card */}
            <div
              className="rounded-2xl border border-gray-800 overflow-hidden"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <div className="p-5 border-b border-gray-800 flex items-center gap-2">
                <span className="text-yellow-400">✦</span>
                <h3 className="text-white font-black text-sm uppercase tracking-widest">
                  Artisan Crafting Update
                </h3>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-sm flex-shrink-0">
                    MJ
                  </div>
                  <div className="flex-1">
                    <div
                      className="rounded-xl p-4 mb-3 border border-gray-700 relative"
                      style={{ backgroundColor: '#2a2000' }}
                    >
                      <div className="absolute -left-2 top-4 w-3 h-3 rotate-45 border-l border-b border-gray-700"
                        style={{ backgroundColor: '#2a2000' }} />
                      <p className="text-gray-300 text-sm leading-relaxed italic">
                        "The first sketch is complete. I've started applying the first layer of 24k gold
                        leaf to the frame detailing. It's looking beautiful!"
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 font-black text-sm">— Julian, Master Artisan</p>
                        <p className="text-gray-600 text-xs">Last updated: 4 hours ago</p>
                      </div>
                      <Link
                        to="/artisan-chat"
                        className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition"
                      >
                        💬 Reply
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              className="rounded-2xl border border-gray-800 overflow-hidden"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <div className="flex border-b border-gray-800">
                {[
                  { key: 'timeline', label: 'Timeline' },
                  { key: 'details', label: 'Order Details' },
                  { key: 'shipping', label: 'Shipping Info' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3.5 font-black text-xs uppercase tracking-widest transition border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? 'text-yellow-400 border-yellow-400'
                        : 'text-gray-600 border-transparent hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="p-5">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />
                    <div className="space-y-5">
                      {timeline.map((item, i) => (
                        <div key={i} className="flex items-start gap-4 relative pl-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                              item.done
                                ? 'bg-yellow-400 text-black font-black'
                                : 'border border-gray-700 text-gray-600'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-white font-black text-sm">{item.title}</p>
                              <span className="text-gray-600 text-xs">{item.time}</span>
                            </div>
                            <p className="text-gray-400 text-xs">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ORDER DETAILS */}
              {activeTab === 'details' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-800" style={{ backgroundColor: '#2a2000' }}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200"
                        alt="Order"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-black text-sm">Custom Gold Leaf Portrait</p>
                      <p className="text-gray-400 text-xs mt-0.5">Bespoke Commission · 24k Gold Leaf on Teak</p>
                      <p className="text-yellow-400 font-black mt-1">$4,250.00</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'Order Number', value: '#AC-98234' },
                      { label: 'Artisan', value: 'Master Julian' },
                      { label: 'Category', value: 'Custom Furniture' },
                      { label: 'Payment Method', value: 'M-Pesa' },
                      { label: 'Payment Status', value: 'PAID ✓' },
                      { label: 'Date Placed', value: 'October 22, 2023' },
                    ].map(row => (
                      <div
                        key={row.label}
                        className="flex justify-between py-2.5 border-b border-gray-800 last:border-0"
                      >
                        <span className="text-gray-500 text-xs">{row.label}</span>
                        <span className={`text-xs font-black ${
                          row.value.includes('PAID') ? 'text-green-400' : 'text-white'
                        }`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SHIPPING */}
              {activeTab === 'shipping' && (
                <div className="p-5 space-y-4">
                  <div
                    className="rounded-xl p-4 border border-gray-800"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
                      Delivery Address
                    </p>
                    <p className="text-white font-black text-sm">Michael Henderson</p>
                    <p className="text-gray-400 text-xs mt-1">1245 Artisan Way</p>
                    <p className="text-gray-400 text-xs">San Francisco, CA 94103</p>
                    <p className="text-gray-400 text-xs">United States</p>
                  </div>

                  <div
                    className="rounded-xl p-4 border border-gray-800"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
                      Shipping Method
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-black text-sm">Expedited Global Art Handling</p>
                        <p className="text-gray-400 text-xs mt-0.5">3–5 business days · Fully insured</p>
                      </div>
                      <span className="text-green-400 font-black text-xs">FREE</span>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 border border-gray-800"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
                      Tracking Number
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-black text-sm font-mono tracking-widest">
                        EGA-2023-AC98234
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText('EGA-2023-AC98234')}
                        className="text-yellow-400 text-xs font-black hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">Available once shipped</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-4">

            {/* Need Assistance */}
            <div
              className="rounded-2xl border border-gray-800 overflow-hidden"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <div className="p-5 border-b border-gray-800">
                <h3 className="text-white font-black text-sm uppercase tracking-widest">
                  Need Assistance?
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <Link
                  to="/artisan-chat"
                  className="flex items-center gap-3 w-full bg-yellow-400 text-black px-4 py-3 rounded-xl font-black text-xs hover:bg-yellow-500 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Chat with Artisan
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-3 w-full border border-gray-700 text-gray-300 px-4 py-3 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Delivery estimate */}
            <div
              className="rounded-2xl border border-yellow-900 p-5"
              style={{ backgroundColor: '#2a2000' }}
            >
              <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-3">
                📅 Delivery Estimate
              </p>
              <p className="text-white font-black text-2xl mb-1">Oct 30 – Nov 1</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Based on current crafting progress. Your artisan will notify
                you once the piece is shipped.
              </p>
              <div className="mt-3 pt-3 border-t border-yellow-900">
                <p className="text-gray-600 text-xs">
                  ⚠️ Delivery dates update when backend is connected.
                </p>
              </div>
            </div>

            {/* Order actions — now all wired up */}
            <div
              className="rounded-2xl border border-gray-800 p-5"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
                Order Actions
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setModal('invoice')}
                  className="w-full text-left text-xs text-gray-400 py-2.5 px-3 rounded-xl border border-gray-800 hover:border-yellow-400 hover:text-yellow-400 transition font-black"
                >
                  📄 Download Invoice
                </button>
                <button
                  onClick={() => setModal('changes')}
                  className="w-full text-left text-xs text-gray-400 py-2.5 px-3 rounded-xl border border-gray-800 hover:border-yellow-400 hover:text-yellow-400 transition font-black"
                >
                  ↩ Request Changes
                </button>
                <button
                  onClick={() => setModal('cancel')}
                  className="w-full text-left text-xs text-red-500 py-2.5 px-3 rounded-xl border border-gray-800 hover:border-red-500 transition font-black"
                >
                  ✕ Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0d0d00' }} className="border-t border-yellow-900 px-8 py-8 mt-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/shop" className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/custom-order" className="hover:text-yellow-400 transition">Custom Orders</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default OrderTracking;