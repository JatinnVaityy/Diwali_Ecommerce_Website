import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = (product, qty=1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p._id === product._id);
      if (idx === -1) return [...prev, { ...product, qty }];
      const cp = [...prev]; cp[idx].qty += qty; return cp;
    });
  };

  const remove = (productId) => setItems(prev => prev.filter(i => i._id !== productId));
  const clear = () => setItems([]);
  const total = items.reduce((s,i) => s + (i.price * i.qty), 0);

  return <CartContext.Provider value={{ items, add, remove, clear, total }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
