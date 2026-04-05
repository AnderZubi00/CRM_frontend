import { motion as Motion, useReducedMotion } from "framer-motion";
import { getApiBaseURL } from "../../services/api";
import QuantitySelector from "./QuantitySelector";

const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

/**
 * Individual item inside CartDrawer.
 */
export default function CartItem({ item, onUpdate, onRemove }) {
  const reduceMotion = useReducedMotion();
  const imgSrc = item.imagen_url ? baseUrl + item.imagen_url : null;
  const lineTotal = (item.precio || 0) * (item.quantity || 1);

  return (
    <Motion.li
      layout
      initial={reduceMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex gap-3 rounded-xl p-3"
      style={{
        background: "var(--tienda-surface-glass)",
        border: "1px solid var(--tienda-border)",
      }}
    >
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {imgSrc ? (
          <img src={imgSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <p className="truncate text-sm font-semibold" style={{ color: "var(--tienda-text)" }}>
          {item.nombre}
        </p>
        <Motion.p
          key={lineTotal}
          className="text-sm font-bold"
          style={{ color: "var(--tienda-accent)" }}
          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {lineTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
        </Motion.p>

        <div className="mt-1.5 flex items-center gap-2">
          <QuantitySelector
            value={item.quantity || 1}
            onChange={(val) => {
              const delta = val - (item.quantity || 1);
              onUpdate?.(item.id_producto, delta);
            }}
            min={1}
            max={item.stock || 999}
            size="sm"
          />

          <button
            type="button"
            onClick={() => onRemove?.(item.id_producto)}
            className="ml-auto text-xs font-semibold transition-colors hover:text-red-700 cursor-pointer"
            style={{ color: "#dc2626" }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </Motion.li>
  );
}
