import { useState, useCallback, useEffect, useRef } from "react";
import { LazyMotion, domAnimation, motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";
import useCart from "./useCart";
import TiendaCatalogo from "./TiendaCatalogo";
import ProductoDetalle from "./ProductoDetalle";
import CartDrawer from "./CartDrawer";
import Checkout from "./Checkout";
import CheckoutSuccess from "./CheckoutSuccess";

/**
 * Shell principal de la tienda.
 * Funciona tanto para usuarios logueados (panel cliente) como para
 * visitantes públicos (pestaña Productos).
 *
 * Props:
 * - user: objeto usuario (null si no logueado)
 * - onLogout: callback para cerrar sesión
 * - onRequestLogin: callback para pedir login (público)
 * - hideHeader: si true, oculta el header flotante y muestra FAB de cesta
 *
 * Vistas: catalogo | detalle | checkout | success
 */
export default function ClienteLayout({ user, onLogout, onRequestLogin, hideHeader = false }) {
  const reduceMotion = useReducedMotion();

  // Navegación interna
  const [view, setView] = useState("catalogo");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  // Cesta
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [badgeKey, setBadgeKey] = useState(0);

  // Floating navbar scroll behavior (only when header is shown)
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (hideHeader) return;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setNavVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideHeader]);

  const handleAddToCart = useCallback(
    (producto, qty = 1) => {
      addToCart(producto, qty);
      setBadgeKey((k) => k + 1);
    },
    [addToCart]
  );

  const handleViewDetail = useCallback((producto) => {
    setSelectedProduct(producto);
    setView("detalle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToCatalog = useCallback(() => {
    setSelectedProduct(null);
    setView("catalogo");
  }, []);

  const handleGoCheckout = useCallback(() => {
    if (!user && onRequestLogin) {
      setCartOpen(false);
      onRequestLogin();
      return;
    }
    setCartOpen(false);
    setView("checkout");
  }, [user, onRequestLogin]);

  const handleCheckoutSuccess = useCallback(
    (result) => {
      setOrderResult(result);
      clearCart();
      setView("success");
    },
    [clearCart]
  );

  const handleBackToShop = useCallback(() => {
    setOrderResult(null);
    setView("catalogo");
  }, []);

  const pageTransition = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.2, ease: "easeOut" },
      };

  return (
    <LazyMotion features={domAnimation}>
      <div className={hideHeader ? "min-h-[50vh]" : "tienda-theme min-h-screen min-h-dvh"}>
        {/* ═══ FLOATING HEADER (only when not embedded in public page) ═══ */}
        {!hideHeader && (
          <Motion.header
            className="tienda-navbar-float tienda-glass-strong"
            animate={
              reduceMotion
                ? {}
                : {
                    y: navVisible ? 0 : "-120%",
                    opacity: navVisible ? 1 : 0,
                  }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="px-4 sm:px-6">
              <div className="flex h-14 items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
                    style={{ background: "var(--tienda-accent)" }}
                  >
                    <span className="text-base font-bold text-white">A</span>
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <h1
                      className="truncate text-base font-bold leading-tight"
                      style={{ color: "var(--tienda-text)" }}
                    >
                      ANCAMI
                    </h1>
                    <p className="text-[0.65rem] leading-tight" style={{ color: "var(--tienda-text-muted)" }}>
                      Tienda
                    </p>
                  </div>
                </div>

                {/* Nav central */}
                {view !== "catalogo" && view !== "success" && (
                  <button
                    type="button"
                    onClick={handleBackToCatalog}
                    className="hidden rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-stone-100 sm:inline-flex items-center gap-1.5 cursor-pointer"
                    style={{ color: "var(--tienda-text-muted)" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Catalogo
                  </button>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Cart button */}
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-stone-100 cursor-pointer"
                    style={{
                      border: "1px solid var(--tienda-border)",
                      color: "var(--tienda-text)",
                    }}
                    aria-label={`Ver cesta (${cartCount} productos)`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartCount > 0 && (
                      <span
                        key={badgeKey}
                        className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-bold text-white tienda-badge-pop"
                        style={{ background: "var(--tienda-accent)" }}
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </button>

                  <div className="hidden h-6 w-px sm:block" style={{ background: "var(--tienda-border)" }} />

                  {/* User info or login button */}
                  {user ? (
                    <>
                      <div className="hidden items-center gap-2 sm:flex">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: "var(--tienda-accent)" }}
                        >
                          {(user.correo || "U")[0].toUpperCase()}
                        </div>
                        <span className="max-w-[120px] truncate text-sm font-medium" style={{ color: "var(--tienda-text)" }}>
                          {user.correo}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onLogout}
                        className="tienda-btn-outline px-3 py-1.5 text-xs sm:text-sm"
                      >
                        Salir
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={onRequestLogin}
                      className="tienda-btn-accent px-4 py-1.5 text-xs sm:text-sm inline-flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="hidden sm:inline">Iniciar sesion</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Motion.header>
        )}

        {/* ═══ FAB Cart Button (when header is hidden / public mode) ═══ */}
        {hideHeader && (
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer"
            style={{
              background: "var(--tienda-accent, hsl(var(--primary)))",
              color: "#fff",
            }}
            aria-label={`Ver cesta (${cartCount} productos)`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span
                key={badgeKey}
                className="absolute -right-1 -top-1 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white tienda-badge-pop"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        )}

        {/* ═══ CONTENIDO ═══ */}
        <main className={hideHeader ? "pb-8" : "pt-24 pb-8"}>
          <AnimatePresence mode="wait">
            {view === "catalogo" && (
              <Motion.div key="catalogo" {...pageTransition}>
                <TiendaCatalogo
                  onViewDetail={handleViewDetail}
                  onAddToCart={handleAddToCart}
                />
              </Motion.div>
            )}

            {view === "detalle" && selectedProduct && (
              <Motion.div key="detalle" {...pageTransition}>
                <ProductoDetalle
                  producto={selectedProduct}
                  onAddToCart={handleAddToCart}
                  onBack={handleBackToCatalog}
                  onViewDetail={handleViewDetail}
                />
              </Motion.div>
            )}

            {view === "checkout" && (
              <Motion.div key="checkout" {...pageTransition}>
                <Checkout
                  cart={cart}
                  cartTotal={cartTotal}
                  user={user}
                  onSuccess={handleCheckoutSuccess}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onRequestLogin={onRequestLogin}
                  onBack={() => {
                    setCartOpen(true);
                    setView("catalogo");
                  }}
                  onBackToShop={handleBackToCatalog}
                />
              </Motion.div>
            )}

            {view === "success" && (
              <Motion.div key="success" {...pageTransition}>
                <CheckoutSuccess
                  pedido={orderResult}
                  onBackToShop={handleBackToShop}
                  onViewDetail={handleViewDetail}
                  onAddToCart={handleAddToCart}
                />
              </Motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ═══ CART DRAWER ═══ */}
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          cartTotal={cartTotal}
          cartCount={cartCount}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleGoCheckout}
          onClearCart={clearCart}
        />
      </div>
    </LazyMotion>
  );
}
