import { useState, useCallback } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { getApiBaseURL } from "../../services/api";

const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

/**
 * Product card with glass effect, hover micro-animations,
 * add-to-cart feedback, and keyboard focus states.
 */
export default function ProductoCard({ producto, onAddToCart, onViewDetail }) {
  const reduceMotion = useReducedMotion();
  const [added, setAdded] = useState(false);
  const stock = producto.stock != null ? Number(producto.stock) : null;
  const canAdd = stock === null || stock > 0;
  const imgSrc = producto.imagen_url ? baseUrl + producto.imagen_url : null;

  const handleAdd = useCallback(
    (e) => {
      e.stopPropagation();
      if (!canAdd) return;
      onAddToCart?.(producto);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    },
    [canAdd, onAddToCart, producto]
  );

  return (
    <Motion.article
      initial={false}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer tienda-glass focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        borderRadius: "var(--tienda-radius-lg)",
        outlineColor: "var(--tienda-accent)",
      }}
      onClick={() => onViewDetail?.(producto)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onViewDetail?.(producto);
      }}
      role="link"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={producto.nombre}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
          <span className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-stone-900 opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
            Ver detalle
          </span>
        </div>

        {/* Stock badge */}
        {stock !== null && (
          <span
            className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm backdrop-blur ${
              stock > 5
                ? "bg-emerald-500/90 text-white"
                : stock > 0
                ? "bg-amber-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {stock > 0 ? `${stock} en stock` : "Agotado"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 min-h-[2.5rem] text-[0.95rem] font-semibold leading-snug"
          style={{ color: "var(--tienda-text)" }}
        >
          {producto.nombre}
        </h3>

        <p
          className="mt-2 text-lg font-bold"
          style={{ color: "var(--tienda-accent)" }}
        >
          {Number(producto.precio).toLocaleString("es-ES", {
            style: "currency",
            currency: "EUR",
          })}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="tienda-btn-accent mt-4 w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? (
            <span className="inline-flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Añadido
            </span>
          ) : canAdd ? (
            "Añadir a la cesta"
          ) : (
            "Sin stock"
          )}
        </button>
      </div>
    </Motion.article>
  );
}
