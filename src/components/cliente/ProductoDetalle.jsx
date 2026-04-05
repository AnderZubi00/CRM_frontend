import { useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { getApiBaseURL } from "../../services/api";
import { fadeUp } from "./motion";
import ImageGallery from "./ImageGallery";
import Breadcrumb from "./Breadcrumb";
import QuantitySelector from "./QuantitySelector";
import ProductosSugeridos from "./ProductosSugeridos";

const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

/**
 * Premium product detail page with image gallery, breadcrumbs,
 * quantity selector, and related products.
 */
export default function ProductoDetalle({ producto, onAddToCart, onBack, onViewDetail }) {
  const reduceMotion = useReducedMotion();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!producto) return null;

  const stock = producto.stock != null ? Number(producto.stock) : null;
  const canAdd = stock === null || stock > 0;
  const maxQty = stock ?? 999;
  const imgSrc = producto.imagen_url ? baseUrl + producto.imagen_url : null;

  const handleAdd = () => {
    if (!canAdd) return;
    onAddToCart?.(producto, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const breadcrumbItems = [
    { label: "Catalogo", onClick: onBack },
    { label: producto.nombre },
  ];

  return (
    <Motion.div
      {...fadeUp(reduceMotion)}
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <ImageGallery src={imgSrc} alt={producto.nombre} />

        {/* Product Info */}
        <Motion.div
          {...fadeUp(reduceMotion, 0.1)}
          className="flex flex-col justify-center"
        >
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--tienda-text)" }}
          >
            {producto.nombre}
          </h1>

          <p
            className="mt-4 text-3xl font-bold"
            style={{ color: "var(--tienda-accent)" }}
          >
            {Number(producto.precio).toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: "var(--tienda-text-muted)" }}
            >
              por unidad
            </span>
          </p>

          {/* Stock badge */}
          {stock !== null && (
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                  stock > 5
                    ? "bg-emerald-50 text-emerald-700"
                    : stock > 0
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    stock > 5 ? "bg-emerald-500" : stock > 0 ? "bg-amber-500" : "bg-red-500"
                  }`}
                />
                {stock > 0 ? `${stock} disponibles` : "Agotado"}
              </span>
            </div>
          )}

          <div className="tienda-divider my-6" />

          {/* Description (conditional, future-proof) */}
          {producto.descripcion && (
            <>
              <div className="mb-6">
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--tienda-text)" }}
                >
                  Descripcion
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--tienda-text-muted)" }}
                >
                  {producto.descripcion}
                </p>
              </div>
              <div className="tienda-divider my-6" />
            </>
          )}

          {/* Trust signals */}
          <div className="space-y-3 text-sm" style={{ color: "var(--tienda-text-muted)" }}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: "var(--tienda-accent-light)" }}
              >
                <svg className="w-4 h-4" style={{ color: "var(--tienda-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Envio rapido disponible</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: "var(--tienda-accent-light)" }}
              >
                <svg className="w-4 h-4" style={{ color: "var(--tienda-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>Garantia de calidad ANCAMI</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: "var(--tienda-accent-light)" }}
              >
                <svg className="w-4 h-4" style={{ color: "var(--tienda-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span>Devolucion en 14 dias</span>
            </div>
          </div>

          <div className="tienda-divider my-6" />

          {/* Quantity + Add to cart */}
          {canAdd && (
            <div className="flex flex-wrap items-center gap-4">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={maxQty}
                size="md"
              />

              <Motion.button
                type="button"
                onClick={handleAdd}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="tienda-btn-accent flex-1 py-3 text-sm sm:flex-none sm:px-10"
              >
                {added ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Añadido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Añadir a la cesta
                  </span>
                )}
              </Motion.button>
            </div>
          )}

          {!canAdd && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Este producto esta agotado actualmente.
            </p>
          )}
        </Motion.div>
      </div>

      {/* Related products */}
      <ProductosSugeridos
        categoriaId={producto.id_categoria}
        currentProductId={producto.id_producto}
        onViewDetail={(p) => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          onViewDetail?.(p);
        }}
        onAddToCart={onAddToCart}
        title="Productos relacionados"
      />
    </Motion.div>
  );
}
