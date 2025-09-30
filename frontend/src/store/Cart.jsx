import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
const increase = (productId) => {
  setItems(prev =>
    prev.map(i =>
      i._id === productId ? { ...i, qty: i.qty + 1 } : i
    )
  );
};

const decrease = (productId) => {
  setItems(prev =>
    prev.map(i =>
      i._id === productId ? { ...i, qty: i.qty - 1 } : i
    ).filter(i => i.qty > 0) // remove if qty becomes 0
  );
};

 const add = (product, qty = 1) => {
  setItems(prev => {
    const idx = prev.findIndex(p => p._id === product._id);
    if (idx === -1) {
      // Product not in cart, add as new
      return [...prev, { ...product, qty }];
    } else {
      // Product already in cart, increase only its qty
      return prev.map((p, i) =>
        i === idx ? { ...p, qty: p.qty + qty } : p
      );
    }
  });
};

  const remove = (productId) => setItems(prev => prev.filter(i => i._id !== productId));
  const clear = () => setItems([]);
  const total = items.reduce((s,i) => s + (i.price * i.qty), 0);

  return <CartContext.Provider value={{ items, add, remove, clear, total, increase, decrease }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
