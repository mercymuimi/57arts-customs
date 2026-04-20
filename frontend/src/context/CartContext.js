import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const getKey = (user) =>
  user ? `57arts_cart_${user._id || user.id || user.email}` : '57arts_cart_guest';

const readCart = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeCart = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
};

/**
 * Resolves the best available image from any product shape:
 * - MongoDB products:          product.images[0]
 * - Static/featured products:  product.img
 * - AI recommendation items:   product.image  (sometimes returned by AI API)
 * - Already-normalised items:  product.img    (set by normalizeProduct in Home.js)
 */
const resolveImg = (product) =>
  product.images?.[0] ||
  product.img        ||
  product.image      ||
  '';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems]           = useState(() => readCart(getKey(user)));
  const [storageKey, setStorageKey] = useState(() => getKey(user));

  // Switch cart when user logs in / out
  useEffect(() => {
    const newKey = getKey(user);
    if (newKey !== storageKey) {
      setStorageKey(newKey);
      setItems(readCart(newKey));
    }
  }, [user]);

  // Persist on every change
  useEffect(() => {
    writeCart(storageKey, items);
  }, [items, storageKey]);

  const addToCart = useCallback((product, qty = 1) => {
    setItems(prev => {
      const id = product._id || product.id;
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        id,
        name:     product.name,
        price:    product.price,
        // ✅ FIX: resolveImg checks all possible image fields in priority order
        // so items added from homepage, product detail, or AI recs all get an image
        img:      resolveImg(product),
        category: product.category,
        slug:     product.slug,
        desc:     product.description || product.desc || '',
        qty,
      }];
    });
  }, []);

  const updateQty = useCallback((id, delta) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  }, []);

  const setQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((productId) => {
    return items.some(i => i.id === productId);
  }, [items]);

  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, updateQty, setQty,
      removeItem, clearCart, isInCart,
      itemCount, subtotal,
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