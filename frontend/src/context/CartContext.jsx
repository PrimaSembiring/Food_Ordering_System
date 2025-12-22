import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (menu) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === menu.id);
      if (found) {
        return prev.map((i) =>
          i.id === menu.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...menu, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
