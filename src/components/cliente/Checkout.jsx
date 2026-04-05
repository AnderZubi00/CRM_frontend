import { useState, useCallback } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createPedido, getApiBaseURL } from "../../services/api";
import StepIndicator from "./StepIndicator";
import QuantitySelector from "./QuantitySelector";
import Breadcrumb from "./Breadcrumb";

const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");
const STEPS = ["Revision", "Datos", "Confirmar"];

/**
 * Multi-step checkout: Review → Info → Confirm.
 * Backend is still a single POST /api/pedidos — steps are UI only.
 */
export default function Checkout({
  cart,
  cartTotal,
  user,
  onSuccess,
  onUpdateQuantity,
  onRemove,
  onRequestLogin,
  onBack,
  onBackToShop,
}) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [direccion, setDireccion] = useState("");
  const [direccionError, setDireccionError] = useState("");

  const stepAnim = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2, ease: "easeOut" },
      };

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = cart.map((i) => ({
        id_producto: i.id_producto,
        cantidad: i.quantity || 1,
      }));
      const result = await createPedido({ items });
      onSuccess?.(result);
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Error al procesar el pedido.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [cart, onSuccess]);

  // If cart becomes empty during checkout, go back
  if (cart.length === 0 && step === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg font-semibold" style={{ color: "var(--tienda-text)" }}>
          Tu cesta esta vacia
        </p>
        <button
          type="button"
          onClick={onBackToShop}
          className="tienda-btn-accent mt-4 px-6 py-2.5 text-sm"
        >
          Volver al catalogo
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Catalogo", onClick: onBackToShop },
          { label: "Checkout" },
        ]}
      />

      {/* Step indicator */}
      <StepIndicator steps={STEPS} currentStep={step} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content - 2/3 */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* ═══ STEP 0: Cart Review ═══ */}
            {step === 0 && (
              <Motion.div key="step-0" {...stepAnim}>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--tienda-text)" }}>
                  Revisa tu pedido
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--tienda-text-muted)" }}>
                  Puedes ajustar cantidades o eliminar productos.
                </p>

                <div className="space-y-3">
                  {cart.map((item) => {
                    const imgSrc = item.imagen_url ? baseUrl + item.imagen_url : null;
                    const lineTotal = (item.precio || 0) * (item.quantity || 1);
                    return (
                      <div
                        key={item.id_producto}
                        className="flex items-center gap-4 rounded-xl p-4"
                        style={{
                          border: "1px solid var(--tienda-border)",
                          background: "var(--tienda-surface)",
                        }}
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          {imgSrc ? (
                            <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-stone-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold" style={{ color: "var(--tienda-text)" }}>
                            {item.nombre}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--tienda-text-muted)" }}>
                            {Number(item.precio).toLocaleString("es-ES", { style: "currency", currency: "EUR" })} / ud.
                          </p>
                        </div>
                        <QuantitySelector
                          value={item.quantity || 1}
                          onChange={(val) => {
                            const delta = val - (item.quantity || 1);
                            onUpdateQuantity?.(item.id_producto, delta);
                          }}
                          min={1}
                          max={item.stock || 999}
                          size="sm"
                        />
                        <p className="text-sm font-bold w-20 text-right" style={{ color: "var(--tienda-accent)" }}>
                          {lineTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                        </p>
                        <button
                          type="button"
                          onClick={() => onRemove?.(item.id_producto)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-50 cursor-pointer"
                          aria-label="Eliminar producto"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Motion.div>
            )}

            {/* ═══ STEP 1: Shipping/Contact Info ═══ */}
            {step === 1 && (
              <Motion.div key="step-1" {...stepAnim}>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--tienda-text)" }}>
                  Datos de envio
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--tienda-text-muted)" }}>
                  Confirma tus datos de contacto.
                </p>

                <div className="space-y-4">
                  {!user ? (
                    <div className="rounded-xl p-6 tienda-glass text-center">
                      <svg className="mx-auto w-12 h-12 mb-3" style={{ color: "var(--tienda-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-sm font-semibold mb-1" style={{ color: "var(--tienda-text)" }}>
                        Inicia sesion para continuar
                      </p>
                      <p className="text-xs mb-4" style={{ color: "var(--tienda-text-muted)" }}>
                        Necesitas una cuenta para completar tu pedido.
                      </p>
                      <button
                        type="button"
                        onClick={onRequestLogin}
                        className="tienda-btn-accent px-6 py-2.5 text-sm inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Iniciar sesion
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-xl p-4 tienda-glass">
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--tienda-text-muted)" }}>
                          Email de contacto
                        </label>
                        <p className="text-sm font-semibold" style={{ color: "var(--tienda-text)" }}>
                          {user.correo}
                        </p>
                      </div>

                      {user.nombre && (
                        <div className="rounded-xl p-4 tienda-glass">
                          <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--tienda-text-muted)" }}>
                            Nombre
                          </label>
                          <p className="text-sm font-semibold" style={{ color: "var(--tienda-text)" }}>
                            {user.nombre} {user.apellido || ""}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Required address field */}
                  {user && (
                    <div>
                      <label
                        htmlFor="checkout-direccion"
                        className="text-xs font-semibold mb-1.5 block"
                        style={{ color: "var(--tienda-text-muted)" }}
                      >
                        Direccion de entrega <span style={{ color: "var(--tienda-accent)" }}>*</span>
                      </label>
                      <input
                        id="checkout-direccion"
                        type="text"
                        value={direccion}
                        onChange={(e) => {
                          setDireccion(e.target.value);
                          if (e.target.value.trim()) setDireccionError("");
                        }}
                        placeholder="Calle, numero, piso, ciudad..."
                        className="w-full rounded-xl p-3 text-sm outline-none transition-all"
                        style={{
                          background: "var(--tienda-surface)",
                          border: `1px solid ${direccionError ? "#ef4444" : "var(--tienda-border)"}`,
                          color: "var(--tienda-text)",
                        }}
                      />
                      {direccionError && (
                        <p className="mt-1 text-xs text-red-500">{direccionError}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="checkout-notes"
                      className="text-xs font-semibold mb-1.5 block"
                      style={{ color: "var(--tienda-text-muted)" }}
                    >
                      Notas del pedido (opcional)
                    </label>
                    <textarea
                      id="checkout-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Instrucciones especiales..."
                      rows={3}
                      className="w-full rounded-xl p-3 text-sm outline-none resize-none transition-all"
                      style={{
                        background: "var(--tienda-surface)",
                        border: "1px solid var(--tienda-border)",
                        color: "var(--tienda-text)",
                      }}
                    />
                  </div>
                </div>
              </Motion.div>
            )}

            {/* ═══ STEP 2: Confirmation ═══ */}
            {step === 2 && (
              <Motion.div key="step-2" {...stepAnim}>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--tienda-text)" }}>
                  Confirmar pedido
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--tienda-text-muted)" }}>
                  Revisa el resumen y confirma.
                </p>

                {/* Compact item list */}
                <div className="space-y-2 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.id_producto}
                      className="flex items-center justify-between py-2 text-sm"
                      style={{ borderBottom: "1px solid var(--tienda-border)" }}
                    >
                      <span style={{ color: "var(--tienda-text)" }}>
                        {item.nombre}
                        <span className="ml-1" style={{ color: "var(--tienda-text-muted)" }}>
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="font-semibold" style={{ color: "var(--tienda-accent)" }}>
                        {((item.precio || 0) * (item.quantity || 1)).toLocaleString("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Buyer info */}
                <div className="rounded-xl p-4 tienda-glass mb-6 space-y-1.5">
                  <p className="text-xs" style={{ color: "var(--tienda-text-muted)" }}>
                    Comprador: <strong style={{ color: "var(--tienda-text)" }}>{user?.correo}</strong>
                  </p>
                  {direccion && (
                    <p className="text-xs" style={{ color: "var(--tienda-text-muted)" }}>
                      Entrega: <strong style={{ color: "var(--tienda-text)" }}>{direccion}</strong>
                    </p>
                  )}
                  {notes && (
                    <p className="text-xs" style={{ color: "var(--tienda-text-muted)" }}>
                      Notas: {notes}
                    </p>
                  )}
                </div>

                <div className="tienda-divider my-4" />

                {/* Total */}
                <div className="flex items-center justify-between text-xl font-bold mb-6" style={{ color: "var(--tienda-text)" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--tienda-accent)" }}>
                    {cartTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Confirm button or login CTA */}
                {!user ? (
                  <div className="rounded-xl p-5 tienda-glass text-center">
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--tienda-text)" }}>
                      Inicia sesion para confirmar tu pedido
                    </p>
                    <button
                      type="button"
                      onClick={onRequestLogin}
                      className="tienda-btn-accent w-full py-3.5 text-base inline-flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Iniciar sesion y confirmar
                    </button>
                  </div>
                ) : (
                  <Motion.button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading || cart.length === 0}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    className="tienda-btn-accent w-full py-3.5 text-base disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirmar pedido
                      </>
                    )}
                  </Motion.button>
                )}
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-4" style={{ borderTop: "1px solid var(--tienda-border)" }}>
            <button
              type="button"
              onClick={() => {
                if (step === 0) {
                  onBack?.();
                } else {
                  setStep((s) => s - 1);
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors hover:bg-stone-100 cursor-pointer"
              style={{ color: "var(--tienda-text-muted)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {step === 0 ? "Volver a la cesta" : "Anterior"}
            </button>

            {step < 2 && (
              <button
                type="button"
                onClick={() => {
                  // Validate direccion when leaving step 1
                  if (step === 1 && user && !direccion.trim()) {
                    setDireccionError("La direccion de entrega es obligatoria.");
                    return;
                  }
                  setStep((s) => s + 1);
                }}
                disabled={cart.length === 0}
                className="tienda-btn-accent px-6 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ═══ Order Summary Sidebar (lg+) ═══ */}
        <div className="hidden lg:block">
          <div
            className="sticky top-28 rounded-2xl p-5 tienda-glass"
            style={{ borderRadius: "var(--tienda-radius-lg)" }}
          >
            <h3 className="text-sm font-bold mb-4" style={{ color: "var(--tienda-text)" }}>
              Resumen del pedido
            </h3>

            <div className="space-y-3 mb-4">
              {cart.map((item) => {
                const imgSrc = item.imagen_url ? baseUrl + item.imagen_url : null;
                return (
                  <div key={item.id_producto} className="flex items-center gap-2.5">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {imgSrc ? (
                        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-300 text-[0.6rem]">
                          —
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium" style={{ color: "var(--tienda-text)" }}>
                        {item.nombre}
                      </p>
                      <p className="text-[0.65rem]" style={{ color: "var(--tienda-text-muted)" }}>
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "var(--tienda-accent)" }}>
                      {((item.precio || 0) * (item.quantity || 1)).toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="tienda-divider my-3" />

            <div className="flex items-center justify-between text-xs mb-1" style={{ color: "var(--tienda-text-muted)" }}>
              <span>Subtotal</span>
              <span>{cartTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-3" style={{ color: "var(--tienda-text-muted)" }}>
              <span>Envio</span>
              <span>Gratuito</span>
            </div>

            <div className="tienda-divider my-3" />

            <div className="flex items-center justify-between font-bold" style={{ color: "var(--tienda-text)" }}>
              <span>Total</span>
              <span style={{ color: "var(--tienda-accent)" }}>
                {cartTotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
