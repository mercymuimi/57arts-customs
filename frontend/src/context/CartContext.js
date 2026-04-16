import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // ── Storage key is per-user so different accounts don't share a cart ─────
  const storageKey = user ? `57arts_cart_${user._id || user.id || user.email}` : '57arts_cart_guest';

  // ── Load cart from localStorage whenever the user changes ────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  // ── Persist cart to localStorage on every change ─────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // localStorage full or unavailable — fail silently
    }
  }, [items, storageKey]);

  // ── Add item (or increment qty if already in cart) ───────────────────────
  const addToCart = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === (product._id || product.id));
      if (existing) {
        return prev.map(i =>
          i.id === existing.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, {
        id:       product._id || product.id,
        name:     product.name,
        price:    product.price,
        img:      product.images?.[0] || product.img || '',
        category: product.category,
        slug:     product.slug,
        desc:     product.description || '',
        qty,
      }];
    });
  }, []);

  // ── Update quantity ───────────────────────────────────────────────────────
  const updateQty = useCallback((id, delta) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  }, []);

  // ── Set quantity directly ────────────────────────────────────────────────
  const setQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  // ── Remove item ──────────────────────────────────────────────────────────
  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  // ── Clear entire cart (e.g. after order placed) ──────────────────────────
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // ── Check if a product is already in cart ────────────────────────────────
  const isInCart = useCallback((productId) => {
    return items.some(i => i.id === productId);
  }, [items]);

  // ── Computed values ──────────────────────────────────────────────────────
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