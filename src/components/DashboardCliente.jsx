import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import api, { getApiBaseURL } from "../services/api";

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

function DashboardCliente({ user, onLogout }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => loadCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/productos");
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setProductos(list);
      } catch (e) {
        if (!isMounted) return;
        const data = e?.response?.data;
        const msg =
          typeof data === "string"
            ? data
            : data?.message || data?.error || e?.message || "No se pudieron cargar los productos.";
        setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = useCallback((producto, quantity = 1) => {
    const qty = Math.max(1, Math.floor(quantity));
    setCart((prev) => {
      const existing = prev.find((i) => i.id_producto === producto.id_producto);
      if (existing) {
        return prev.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, quantity: Math.min((i.quantity || 1) + qty, producto.stock != null ? Number(producto.stock) : 999) }
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
          quantity: Math.min(qty, producto.stock != null ? Number(producto.stock) : 999),
        },
      ];
    });
  }, []);

  const updateCartQuantity = useCallback((id_producto, delta) => {
    setCart((prev) => {
      const next = prev
        .map((i) => {
          if (i.id_producto !== id_producto) return i;
          const q = Math.max(0, (i.quantity || 1) + delta);
          return q === 0 ? null : { ...i, quantity: q };
        })
        .filter(Boolean);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id_producto) => {
    setCart((prev) => prev.filter((i) => i.id_producto !== id_producto));
  }, []);

  const cartTotal = cart.reduce((acc, i) => acc + (i.precio || 0) * (i.quantity || 1), 0);
  const cartCount = cart.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const filteredProducts = search.trim()
    ? productos.filter((p) =>
        (p.nombre || "").toLowerCase().includes(search.trim().toLowerCase())
      )
    : productos;

  const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header tipo tienda */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-800 truncate">Tienda</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Productos disponibles</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block flex-1 max-w-xs">
                <input
                  type="search"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-3 pr-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Buscar productos"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Ver cesta (${cartCount} productos)`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:block h-6 w-px bg-slate-200" />
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-800 truncate max-w-[140px]">{user?.correo}</span>
                <span className="text-slate-400">·</span>
                <span>Cliente</span>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Catálogo</h2>
          <p className="text-slate-600 mt-1">Añade productos a la cesta y realiza tu pedido.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">
              {search.trim() ? "No hay productos que coincidan con tu búsqueda." : "No hay productos disponibles."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => {
              const stock = p.stock != null ? Number(p.stock) : null;
              const canAdd = stock === null || stock > 0;
              return (
                <article
                  key={p.id_producto}
                  className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    {p.imagen_url ? (
                      <img
                        src={baseUrl + p.imagen_url}
                        alt={p.nombre}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem]">
                      {p.nombre}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-blue-600">
                      {Number(p.precio).toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                    {stock !== null && (
                      <p className="text-xs text-slate-500 mt-1">
                        {stock > 0 ? (
                          <span>{stock} en stock</span>
                        ) : (
                          <span className="text-amber-600">Sin stock</span>
                        )}
                      </p>
                    )}
                    <Button
                      onClick={() => canAdd && addToCart(p)}
                      disabled={!canAdd}
                      className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-sm"
                    >
                      {canAdd ? "Añadir a la cesta" : "Sin stock"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bloque información usuario */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-800 mb-3">Tu cuenta</h3>
          <dl className="grid gap-2 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-slate-500">ID</dt>
              <dd className="font-medium text-slate-800">{user?.id_usuario}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Correo</dt>
              <dd className="font-medium text-slate-800 truncate">{user?.correo}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Rol</dt>
              <dd className="font-medium text-slate-800">Cliente</dd>
            </div>
          </dl>
        </div>
      </main>

      {/* Drawer cesta */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cesta de la compra"
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">Tu cesta</h3>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Cerrar cesta"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <p className="text-slate-500 text-center py-8">La cesta está vacía.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id_producto}
                    className="flex gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50/50"
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                      {item.imagen_url ? (
                        <img
                          src={baseUrl + item.imagen_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{item.nombre}</p>
                      <p className="text-sm text-blue-600 font-semibold">
                        {Number(item.precio).toLocaleString("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id_producto, -1)}
                          className="w-7 h-7 rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm font-medium disabled:opacity-50"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium text-slate-800 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id_producto, 1)}
                          className="w-7 h-7 rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm font-medium"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id_producto)}
                          className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-5 bg-slate-50/80">
              <div className="flex justify-between items-center text-lg font-bold text-slate-800 mb-4">
                <span>Total</span>
                <span>
                  {cartTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </span>
              </div>
              <Button
                onClick={() => setCartOpen(false)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white"
              >
                Seguir comprando
              </Button>
              <p className="text-xs text-slate-500 mt-3 text-center">
                El proceso de pago se implementará en una siguiente fase.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCliente;
