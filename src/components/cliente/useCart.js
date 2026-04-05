import { useState, useCallback, useEffect } from "react";

const CART_STORAGE_KEY = "cliente_cesta";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

/**
 * Hook para gestionar la cesta de la compra.
 * Persistido en localStorage y con verificación de stock.
 */
export default function useCart() {
  const [cart, setCart] = useState(() => loadCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = useCallback((producto, quantity = 1) => {
    const qty = Math.max(1, Math.floor(quantity));
    setCart((prev) => {
      const existing = prev.find((i) => i.id_producto === producto.id_producto);
      const maxStock = producto.stock != null ? Number(producto.stock) : 999;
      if (existing) {
        return prev.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, quantity: Math.min((i.quantity || 1) + qty, maxStock) }
            : i
        );
      }
      return [
        ...prev,
        {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          imagen_url: producto.imagen_url || null,
          stock: maxStock,
          quantity: Math.min(qty, maxStock),
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id_producto, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id_producto !== id_producto) return i;
          const q = Math.max(0, (i.quantity || 1) + delta);
          return q === 0 ? null : { ...i, quantity: q };
        })
        .filter(Boolean)
    );
  }, []);

  const setQuantity = useCallback((id_producto, newQty) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id_producto !== id_producto) return i;
          const q = Math.max(0, Math.floor(newQty));
          return q === 0 ? null : { ...i, quantity: Math.min(q, i.stock || 999) };
        })
        .filter(Boolean)
    );
  }, []);

  const removeFromCart = useCallback((id_producto) => {
    setCart((prev) => prev.filter((i) => i.id_producto !== id_producto));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce(
    (acc, i) => acc + (i.precio || 0) * (i.quantity || 1),
    0
  );
  const cartCount = cart.reduce((acc, i) => acc + (i.quantity || 1), 0);

  return {
    cart,
    addToCart,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  };
}
