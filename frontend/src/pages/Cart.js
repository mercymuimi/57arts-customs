import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const initialCartItems = [
  {
    id: 1,
    name: 'Distressed Artisanal Denim',
    desc: 'Hand-painted Limited Edition • Size: M',
    price: 450.00,
    qty: 1,
    category: 'Fashion',
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200',
    slug: 'distressed-artisanal-denim',
  },
  {
    id: 2,
    name: 'Gold-Infused Obsidian Beads',
    desc: 'Hand-threaded Jewelry • 18"',
    price: 185.00,
    qty: 1,
    category: 'Beads',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200',
    slug: 'gold-infused-obsidian-beads',
  },
  {
    id: 3,
    name: 'Vanguard Teak Chair',
    desc: 'Bespoke Furniture Line • Standard',
    price: 1200.00,
    qty: 1,
    category: 'Furniture',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200',
    slug: 'vanguard-teak-chair',
  },
];

const recommended = [
  { name: 'Midnight Velvet Blazer', price: '$590', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300', slug: 'midnight-velvet-blazer' },
  { name: 'Linen Riviera Set', price: '$320', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300', slug: 'linen-riviera-set' },
  { name: 'Kente Bead Stack', price: '$85', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300', slug: 'kente-bead-stack' },
];

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialCartItems);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const saveForLater = (id) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      removeItem(id);
    }
  };

  const moveToCart = (item) => {
    setItems(prev => [...prev, item]);
    setSavedItems(prev => prev.filter(i => i.id !== item.id));
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === '57ARTS') {
      setCouponApplied(true);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: '#1a1500' }}>
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl font-black mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mb-8 text-center max-w-sm">
          Looks like you haven't added anything yet. Explore our collections!
        </p>
        <div className="flex gap-4">
          <Link to="/shop"
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black hover:bg-yellow-500 transition">
            Browse Shop
          </Link>
          <Link to="/custom-order"
            className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl font-black hover:bg-yellow-400 hover:text-black transition">
            Custom Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Your Cart</h1>
            <p className="text-gray-500 text-sm mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link to="/shop"
            className="text-yellow-400 text-sm hover:underline font-semibold flex items-center gap-1">
            ← Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8">

          {/* LEFT - Cart Items */}
          <div className="col-span-2 space-y-4">

            {items.map((item) => (
              <div key={item.id}
                className="rounded-2xl p-5 border border-gray-800 flex gap-5"
                style={{ backgroundColor: '#1a1a00' }}>

                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/product/${item.slug}`)}>
                  <img src={item.img} alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-yellow-600 text-xs uppercase tracking-wide">{item.category}</span>
                      <h3 className="text-white font-black text-base cursor-pointer hover:text-yellow-400 transition"
                        onClick={() => navigate(`/product/${item.slug}`)}>
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                    </div>
                    <p className="text-yellow-400 font-black text-lg ml-4">
                      ${(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 text-white hover:text-yellow-400 transition font-black text-lg">
                        −
                      </button>
                      <span className="text-white font-black text-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 text-white hover:text-yellow-400 transition font-black text-lg">
                        +
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button onClick={() => saveForLater(item.id)}
                        className="text-gray-500 text-xs hover:text-yellow-400 transition">
                        Save for Later
                      </button>
                      <button onClick={() => removeItem(item.id)}
                        className="text-gray-500 text-xs hover:text-red-400 transition flex items-center gap-1">
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div>
                <h3 className="text-gray-400 font-black text-sm uppercase tracking-wide mb-3 mt-6">
                  Saved for Later ({savedItems.length})
                </h3>
                {savedItems.map((item) => (
                  <div key={item.id}
                    className="rounded-2xl p-4 border border-gray-800 flex gap-4 mb-3 opacity-70"
                    style={{ backgroundColor: '#1a1a00' }}>
                    <img src={item.img} alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-white font-black text-sm">{item.name}</p>
                      <p className="text-yellow-400 font-black text-sm">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => moveToCart(item)}
                      className="border border-yellow-400 text-yellow-400 text-xs font-black px-3 py-1 rounded-lg hover:bg-yellow-400 hover:text-black transition self-center">
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recommended */}
            <div className="mt-8">
              <h3 className="text-white font-black text-sm uppercase tracking-wide mb-4">
                You May Also Like
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {recommended.map((rec) => (
                  <div key={rec.name}
                    onClick={() => navigate(`/product/${rec.slug}`)}
                    className="group cursor-pointer rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition"
                    style={{ backgroundColor: '#1a1a00' }}>
                    <div style={{ height: '120px' }}>
                      <img src={rec.img} alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-3">
                      <p className="text-white text-xs font-black">{rec.name}</p>
                      <p className="text-yellow-400 text-xs font-black mt-1">{rec.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="space-y-4">

            {/* Coupon */}
            <div className="rounded-2xl p-5 border border-gray-800"
              style={{ backgroundColor: '#1a1a00' }}>
              <h3 className="font-black text-sm uppercase tracking-wide mb-3">Promo Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 bg-gray-900 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                />
                <button onClick={applyCoupon}
                  className="bg-yellow-400 text-black px-3 py-2 rounded-lg font-black text-xs hover:bg-yellow-500 transition">
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-green-400 text-xs mt-2 font-semibold">
                  ✓ 10% discount applied!
                </p>
              )}
              <p className="text-gray-600 text-xs mt-2">Try: <span className="text-yellow-600">57ARTS</span></p>
            </div>

            {/* Summary */}
            <div className="rounded-2xl p-5 border border-gray-800"
              style={{ backgroundColor: '#1a1a00' }}>
              <h3 className="font-black text-sm uppercase tracking-wide mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span className="text-white">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount (10%)</span>
                    <span className="text-green-400">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400 font-black">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm uppercase">Total</span>
                  <span className="text-yellow-400 font-black text-2xl">
                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-yellow-500 transition mb-3">
                Proceed to Checkout →
              </button>
              <Link to="/shop"
                className="block text-center border border-gray-700 text-gray-400 py-3 rounded-xl font-black text-xs uppercase hover:border-yellow-400 hover:text-yellow-400 transition">
                Continue Shopping
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl p-5 border border-yellow-900"
              style={{ backgroundColor: '#1a1a00' }}>
              <div className="space-y-3">
                {[
                  { icon: '🔒', text: 'Secure 256-bit SSL Encryption' },
                  { icon: '✦', text: 'Certificate of Authenticity Included' },
                  { icon: '🚚', text: 'Free White-glove Delivery' },
                  { icon: '↩', text: '14-Day Return Policy' },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-3">
                    <span className="text-yellow-400 text-sm">{badge.icon}</span>
                    <p className="text-gray-400 text-xs">{badge.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0d0d00' }}
        className="border-t border-yellow-900 px-8 py-8 mt-16">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/shop" className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/custom-order" className="hover:text-yellow-400 transition">Custom Orders</Link>
            <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
          </div>
          <p className="text-gray-600 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default Cart;