import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const getKey = (user) =>
  user ? `57arts_cart_${user._id || user.id || user.email}` : '57arts_cart_guest';

const readCart = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

const writeCart = (key, items) => {
  try { localStorage.setItem(key, JSON.stringify(items)); } catch {}
};

// ── Parse price from either a number or a string like "KES 18,500" ──────────
export const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    // Remove "KES", commas, spaces — keep digits and dot
    const cleaned = price.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// ── Format a numeric price back to display string ────────────────────────────
export const formatPrice = (amount) =>
  `KES ${Number(amount).toLocaleString('en-KE')}`;

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState(() => readCart(getKey(user)));
  const storageKeyRef = useRef(getKey(user));

  // Switch cart when user logs in/out
  useEffect(() => {
    const newKey = getKey(user);
    if (newKey !== storageKeyRef.current) {
      storageKeyRef.current = newKey;
      setItems(readCart(newKey));
    }
  }, [user]);

  // Persist on every change
  useEffect(() => {
    writeCart(storageKeyRef.current, items);
  }, [items]);

  const addToCart = useCallback((product, qty = 1, selectedSize = '') => {
    setItems(prev => {
      // Support both MongoDB _id and plain string id (Fashion.js uses 'om1', 'sw1' etc.)
      const id = product._id || product.id;
      // Use size in the cart key so same product in different sizes = different line items
      const lineKey = selectedSize ? `${id}__${selectedSize}` : id;

      const existing = prev.find(i => i.lineKey === lineKey);
      if (existing) {
        return prev.map(i =>
          i.lineKey === lineKey ? { ...i, qty: i.qty + qty } : i
        );
      }

      const numericPrice = parsePrice(product.price);

      return [...prev, {
        lineKey,
        id,
        name:     product.name,
        price:    numericPrice,                         // always stored as number
        priceStr: formatPrice(numericPrice),            // display string
        img:      product.images?.[0] || product.img || '',
        category: product.category || product.catKey || '',
        slug:     product.slug || '',
        desc:     product.description || product.desc || '',
        size:     selectedSize,
        vendor:   product.vendor || '',
        qty,
      }];
    });
  }, []);

  const updateQty = useCallback((lineKey, delta) =>
    setItems(prev =>
      prev.map(i => i.lineKey === lineKey ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    ), []);

  const setQty = useCallback((lineKey, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.lineKey === lineKey ? { ...i, qty } : i));
  }, []);

  const removeItem = useCallback((lineKey) =>
    setItems(prev => prev.filter(i => i.lineKey !== lineKey)), []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback((productId) =>
    items.some(i => i.id === productId), [items]);

  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQty,
      setQty,
      removeItem,
      clearCart,
      isInCart,
      itemCount,
      subtotal,
      formatPrice,
      parsePrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export default CartContext;