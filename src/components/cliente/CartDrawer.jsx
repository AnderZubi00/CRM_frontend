import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";
import CartItem from "./CartItem";

/**
 * Drawer lateral (derecha) para la cesta de la compra.
 * Enhanced with animated totals, better empty state, and checkout hints.
 */
export default function CartDrawer({
  open,
  onClose,
  cart,
  cartTotal,
  cartCount,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onClearCart,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cesta de la compra">
          {/* Overlay */}
          <Motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 tienda-overlay"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <Motion.div
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col shadow-2xl"
            style={{
              background: "var(--tienda-bg)",
              borderLeft: "1px solid var(--tienda-border)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--tienda-border)" }}
            >
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--tienda-text)" }}>
                  Tu cesta
                </h3>
                <p className="text-xs" style={{ color: "var(--tienda-text-muted)" }}>
                  {cartCount} {cartCount === 1 ? "producto" : "productos"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-stone-100 cursor-pointer"
                style={{ color: "var(--tienda-text-muted)" }}
                aria-label="Cerrar cesta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 tienda-scroll">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Motion.div
                    animate={
                      reduceMotion
                        ? {}
                        : { scale: [1, 1.05, 1] }
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg className="mb-4 w-20 h-20" style={{ color: "var(--tienda-border)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </Motion.div>
                  <p className="text-base font-semibold" style={{ color: "var(--tienda-text)" }}>
                    Tu cesta esta vacia
                  </p>
                  <p className="mt-2 text-sm max-w-[220px]" style={{ color: "var(--tienda-text-muted)" }}>
                    Explora nuestro catalogo para encontrar productos increibles
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="tienda-btn-accent mt-6 px-6 py-2.5 text-sm"
                  >
                    Ver catalogo
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <ul className="space-y-3">
                    {cart.map((item) => (
                      <CartItem
                        key={item.id_producto}
                        item={item}
                        onUpdate={onUpdateQuantity}
                        onRemove={onRemove}
                      />
                    ))}
                  </ul>
                </AnimatePresence>
              )}
            </div>

            {/* Footer con total y botones */}
            {cart.length > 0 && (
              <div
                className="p-5"
                style={{
                  background: "var(--tienda-surface-glass)",
                  borderTop: "1px solid var(--tienda-border)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Mini step indicator */}
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: "var(--tienda-accent)" }} />
                  <div className="h-px w-6" style={{ background: "var(--tienda-border)" }} />
                  <div className="h-2 w-2 rounded-full" style={{ background: "var(--tienda-border)" }} />
                  <div className="h-px w-6" style={{ background: "var(--tienda-border)" }} />
                  <div className="h-2 w-2 rounded-full" style={{ background: "var(--tienda-border)" }} />
                </div>

                <div className="mb-1 flex items-center justify-between text-sm" style={{ color: "var(--tienda-text-muted)" }}>
                  <span>Subtotal</span>
                  <AnimatePresence mode="wait">
                    <Motion.span
                      key={cartTotal}
                      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                    >
                      {cartTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </Motion.span>
                  </AnimatePresence>
                </div>

                <p className="text-xs mb-2" style={{ color: "var(--tienda-text-muted)" }}>
                  Envio calculado al finalizar
                </p>

                <div className="tienda-divider my-3" />

                <div className="mb-4 flex items-center justify-between text-lg font-bold" style={{ color: "var(--tienda-text)" }}>
                  <span>Total</span>
                  <AnimatePresence mode="wait">
                    <Motion.span
                      key={`total-${cartTotal}`}
                      style={{ color: "var(--tienda-accent)" }}
                      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                    >
                      {cartTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </Motion.span>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={onCheckout}
                  className="tienda-btn-accent w-full py-3 text-sm inline-flex items-center justify-center gap-2"
                >
                  Finalizar compra
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={onClearCart}
                  className="mt-2 w-full rounded-xl py-2 text-xs font-medium transition-colors hover:bg-stone-100 cursor-pointer"
                  style={{ color: "var(--tienda-text-muted)" }}
                >
                  Vaciar cesta
                </button>
              </div>
            )}
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
