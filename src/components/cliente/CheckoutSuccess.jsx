import { motion as Motion, useReducedMotion } from "framer-motion";
import ProductosSugeridos from "./ProductosSugeridos";

// Pre-computed confetti — deterministic based on index (no Math.random during render)
const CONFETTI_COLORS = ["#CA8A04", "#F59E0B", "#D97706", "#FBBF24", "#B45309"];
const CONFETTI_PARTICLES = Array.from({ length: 14 }, (_, i) => {
  // Deterministic pseudo-spread using golden ratio
  const phi = (i * 137.508) % 360;
  const rad = (phi * Math.PI) / 180;
  const dist = 80 + (i % 5) * 40;
  return {
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.cos(rad) * dist,
    y: -Math.abs(Math.sin(rad) * dist) - 40,
    rotation: phi * 2 - 360,
    size: 4 + (i % 4) * 2,
    delay: (i % 7) * 0.04,
  };
});

/**
 * Success screen after order confirmation, with confetti and product suggestions.
 */
export default function CheckoutSuccess({ pedido, onBackToShop, onViewDetail, onAddToCart }) {
  const reduceMotion = useReducedMotion();

  // Deterministic confetti particles (gold/amber palette)
  const confetti = reduceMotion ? [] : CONFETTI_PARTICLES;

  const checkAnim = reduceMotion
    ? {}
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", damping: 12, stiffness: 200, delay: 0.1 },
      };

  const textAnim = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: 0.35 },
      };

  const btnAnim = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: 0.55 },
      };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center relative">
          {/* Confetti particles */}
          {confetti.map((p) => (
            <Motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                left: "50%",
                top: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                scale: 0.3,
                rotate: p.rotation,
              }}
              transition={{
                duration: 0.8,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Check icon animado */}
          <Motion.div
            {...checkAnim}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "var(--tienda-accent-light)" }}
          >
            <svg
              className="h-10 w-10"
              style={{ color: "var(--tienda-accent)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </Motion.div>

          <Motion.div {...textAnim}>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--tienda-text)" }}>
              Pedido confirmado!
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm" style={{ color: "var(--tienda-text-muted)" }}>
              Tu pedido ha sido procesado correctamente. Recibiras mas informacion pronto.
            </p>

            {pedido?.pedido?.id_pedido && (
              <div
                className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
                style={{
                  background: "var(--tienda-accent-light)",
                  color: "var(--tienda-accent)",
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Pedido #{pedido.pedido.id_pedido}
              </div>
            )}
          </Motion.div>

          <Motion.div {...btnAnim} className="mt-8">
            <button
              type="button"
              onClick={onBackToShop}
              className="tienda-btn-accent px-8 py-3 text-sm inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver a la tienda
            </button>
          </Motion.div>
        </div>
      </div>

      {/* Suggested products */}
      {onViewDetail && onAddToCart && (
        <ProductosSugeridos
          onViewDetail={(p) => {
            onBackToShop?.();
            setTimeout(() => onViewDetail?.(p), 50);
          }}
          onAddToCart={onAddToCart}
          title="Productos que te podrian gustar"
          maxItems={4}
        />
      )}
    </div>
  );
}
