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
 * Extracts a valid MongoDB ObjectId string from a product object.
 * Prefers _id, falls back to id — but ONLY if it looks like an ObjectId (24 hex chars).
 * Never returns a slug.
 */
const extractProductId = (product) => {
  const candidates = [product._id, product.id];
  for (const candidate of candidates) {
    if (candidate && /^[a-f\d]{24}$/i.test(String(candidate))) {
      return String(candidate);
    }
  }
  // If neither is a valid ObjectId, warn and return null so the caller can handle it
  console.warn('[CartContext] Could not extract a valid MongoDB ObjectId from product:', product);
  return null;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Initialize directly from localStorage
  const [items, setItems] = useState(() => readCart(getKey(user)));
  const [storageKey, setStorageKey] = useState(() => getKey(user));

  // When user logs in/out, switch to their cart immediately
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
    // ✅ FIX: Always extract a real MongoDB ObjectId — never a slug
    const id = extractProductId(product);

    if (!id) {
      console.error(
        '[CartContext] addToCart: product is missing a valid MongoDB _id. ' +
        'Make sure you pass the full product object from the API response. ' +
        'Product received:', product
      );
      return; // Don't add invalid items to cart
    }

    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, {
        id,                                              // ✅ always a MongoDB ObjectId string
        _id:      id,                                    // ✅ explicit alias for safety
        name:     product.name,
        price:    product.price,
        img:      product.images?.[0] || product.img || '',
        category: product.category,
        slug:     product.slug || '',                   // kept for navigation/links only
        vendorId: product.vendor?._id                   // ✅ store vendor ObjectId if present
                    || product.vendor
                    || product.vendorId
                    || null,
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
    return items.some(i => i.id === productId || i._id === productId);
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