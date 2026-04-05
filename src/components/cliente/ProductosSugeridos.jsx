import { useEffect, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import api, { getApiBaseURL } from "../../services/api";

const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

/**
 * Horizontal scrollable row of related/suggested products.
 *
 * @param {{
 *   categoriaId?: number,
 *   currentProductId?: number,
 *   productos?: Array,
 *   onViewDetail: (p: any) => void,
 *   onAddToCart: (p: any) => void,
 *   title?: string,
 *   maxItems?: number,
 * }} props
 */
export default function ProductosSugeridos({
  categoriaId,
  currentProductId,
  productos: productosProp,
  onViewDetail,
  onAddToCart,
  title = "Productos relacionados",
  maxItems = 4,
}) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState(productosProp || []);
  const [loading, setLoading] = useState(!productosProp);

  useEffect(() => {
    if (productosProp) {
      setItems(productosProp);
      setLoading(false);
      return;
    }
    let mounted = true;
    async function load() {
      try {
        const res = await api.get("/api/catalogo/productos");
        if (!mounted) return;
        const all = Array.isArray(res.data) ? res.data : [];
        let filtered = all.filter((p) => p.id_producto !== currentProductId);
        if (categoriaId != null) {
          const sameCat = filtered.filter((p) => p.id_categoria === categoriaId);
          filtered = sameCat.length > 0 ? sameCat : filtered;
        }
        setItems(filtered.slice(0, maxItems));
      } catch {
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [categoriaId, currentProductId, productosProp, maxItems]);

  if (loading) {
    return (
      <div className="mt-12">
        <div className="h-6 w-48 tienda-skeleton rounded-lg mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-56">
              <div className="aspect-[4/3] tienda-skeleton rounded-xl" />
              <div className="mt-3 h-4 w-3/4 tienda-skeleton rounded" />
              <div className="mt-2 h-5 w-1/3 tienda-skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <h3
        className="text-lg font-bold mb-4"
        style={{ color: "var(--tienda-text)" }}
      >
        {title}
      </h3>
      <div className="relative">
        {/* Fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-r from-[var(--tienda-bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-l from-[var(--tienda-bg)] to-transparent" />

        <div className="flex gap-4 overflow-x-auto pb-4 tienda-scroll snap-x snap-mandatory px-1">
          {items.map((p, idx) => {
            const imgSrc = p.imagen_url ? baseUrl + p.imagen_url : null;
            const stock = p.stock != null ? Number(p.stock) : null;
            const canAdd = stock === null || stock > 0;

            return (
              <Motion.article
                key={p.id_producto}
                className="flex-shrink-0 w-52 sm:w-56 snap-start cursor-pointer group"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.22,
                  ease: "easeOut",
                  delay: reduceMotion ? 0 : idx * 0.06,
                }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                onClick={() => onViewDetail?.(p)}
              >
                <div className="overflow-hidden rounded-xl tienda-glass aspect-[4/3] relative">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={p.nombre}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone-100">
                      <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h4
                  className="mt-2.5 text-sm font-semibold line-clamp-2 leading-snug"
                  style={{ color: "var(--tienda-text)" }}
                >
                  {p.nombre}
                </h4>
                <p
                  className="mt-1 text-sm font-bold"
                  style={{ color: "var(--tienda-accent)" }}
                >
                  {Number(p.precio).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canAdd) onAddToCart?.(p);
                  }}
                  disabled={!canAdd}
                  className="tienda-btn-accent mt-2 w-full py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {canAdd ? "Añadir" : "Agotado"}
                </button>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
