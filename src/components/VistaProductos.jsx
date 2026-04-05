import { useEffect, useState, useMemo, useCallback } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";
import api, { getApiBaseURL } from "../services/api";
import Breadcrumb from "./cliente/Breadcrumb";
import ImageGallery from "./cliente/ImageGallery";

const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

/**
 * Public product catalog with detail view.
 * Visitors can browse and see full product details.
 * Purchase requires login — CTA redirects to login modal.
 */
function VistaProductos({ onOpenLogin }) {
  const reduceMotion = useReducedMotion();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Internal navigation: "catalogo" | "detalle"
  const [view, setView] = useState("catalogo");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(null);
  const [sortBy, setSortBy] = useState("reciente");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/catalogo/productos");
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setProductos(list);

        // Extract unique categories from products
        const catMap = new Map();
        list.forEach((p) => {
          if (p.id_categoria && p.Categorium?.nombre) {
            catMap.set(p.id_categoria, { id_categoria: p.id_categoria, nombre: p.Categorium.nombre });
          } else if (p.id_categoria && p.categoria?.nombre) {
            catMap.set(p.id_categoria, { id_categoria: p.id_categoria, nombre: p.categoria.nombre });
          }
        });
        setCategorias(Array.from(catMap.values()));
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
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...productos];
    if (catFilter !== null) {
      list = list.filter((p) => p.id_categoria === catFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => (p.nombre || "").toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "precio_asc":
        list.sort((a, b) => Number(a.precio) - Number(b.precio));
        break;
      case "precio_desc":
        list.sort((a, b) => Number(b.precio) - Number(a.precio));
        break;
      case "nombre":
        list.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
        break;
      default:
        list.sort((a, b) => b.id_producto - a.id_producto);
    }
    return list;
  }, [productos, catFilter, search, sortBy]);

  const handleViewDetail = useCallback((producto) => {
    setSelectedProduct(producto);
    setView("detalle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToCatalog = useCallback(() => {
    setSelectedProduct(null);
    setView("catalogo");
  }, []);

  // Related products for detail view
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return productos
      .filter(
        (p) =>
          p.id_producto !== selectedProduct.id_producto &&
          p.id_categoria === selectedProduct.id_categoria
      )
      .slice(0, 4);
  }, [selectedProduct, productos]);

  const pageAnim = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.2, ease: "easeOut" },
      };

  // Stagger variants for grid
  const containerVariants = reduceMotion
    ? {}
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      };

  const itemVariants = reduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.22, ease: "easeOut" },
        },
      };

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* ═══ CATALOG VIEW ═══ */}
          {view === "catalogo" && (
            <Motion.div key="catalogo" {...pageAnim}>
              <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Productos
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Explora nuestro catalogo. Haz click en cualquier producto para ver todos los detalles.
                </p>
              </div>

              {/* Filter bar */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-xs flex-1">
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/30"
                    aria-label="Buscar productos"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {!loading && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
                    </span>
                  )}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border border-border bg-card py-2.5 px-4 text-sm text-foreground outline-none cursor-pointer"
                    aria-label="Ordenar productos"
                  >
                    <option value="reciente">Mas recientes</option>
                    <option value="precio_asc">Precio: menor a mayor</option>
                    <option value="precio_desc">Precio: mayor a menor</option>
                    <option value="nombre">Nombre A-Z</option>
                  </select>
                </div>
              </div>

              {/* Category tabs */}
              {categorias.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCatFilter(null)}
                    className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer hover:bg-muted"
                    style={{
                      color: catFilter === null ? "#fff" : undefined,
                    }}
                  >
                    {catFilter === null && (
                      <Motion.div
                        layoutId="pub-cat-pill"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 22, stiffness: 300 }}
                      />
                    )}
                    <span className={`relative z-10 ${catFilter === null ? "text-white" : "text-muted-foreground"}`}>
                      Todas
                    </span>
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat.id_categoria}
                      type="button"
                      onClick={() => setCatFilter(cat.id_categoria)}
                      className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer hover:bg-muted border border-border"
                      style={{
                        color: catFilter === cat.id_categoria ? "#fff" : undefined,
                        borderColor: catFilter === cat.id_categoria ? "transparent" : undefined,
                      }}
                    >
                      {catFilter === cat.id_categoria && (
                        <Motion.div
                          layoutId="pub-cat-pill"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 22, stiffness: 300 }}
                        />
                      )}
                      <span className={`relative z-10 ${catFilter === cat.id_categoria ? "text-white" : "text-muted-foreground"}`}>
                        {cat.nombre}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Grid */}
              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                      <div className="aspect-[4/3] animate-pulse bg-muted" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-5 w-1/3 rounded bg-muted animate-pulse" />
                        <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                  <svg className="mx-auto mb-3 w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="font-medium text-muted-foreground">
                    {search.trim() ? "No hay productos que coincidan con tu busqueda." : "No hay productos disponibles."}
                  </p>
                </div>
              ) : (
                <Motion.div
                  className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key={`${catFilter}-${sortBy}`}
                >
                  {filtered.map((p) => {
                    const stock = p.stock != null ? Number(p.stock) : null;
                    const imgSrc = p.imagen_url ? baseUrl + p.imagen_url : null;
                    return (
                      <Motion.article
                        key={p.id_producto}
                        variants={itemVariants}
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                        className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                        onClick={() => handleViewDetail(p)}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") handleViewDetail(p); }}
                        role="link"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={p.nombre}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                              Sin imagen
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

                        <div className="flex flex-col p-4">
                          <h2 className="line-clamp-2 min-h-[2.5rem] font-semibold text-foreground">
                            {p.nombre}
                          </h2>
                          <p className="mt-2 text-lg font-bold text-primary">
                            {Number(p.precio).toLocaleString("es-ES", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLogin?.();
                            }}
                            className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 cursor-pointer"
                          >
                            Iniciar sesion para comprar
                          </button>
                        </div>
                      </Motion.article>
                    );
                  })}
                </Motion.div>
              )}
            </Motion.div>
          )}

          {/* ═══ DETAIL VIEW ═══ */}
          {view === "detalle" && selectedProduct && (
            <Motion.div key="detalle" {...pageAnim}>
              <ProductDetailPublic
                producto={selectedProduct}
                relatedProducts={relatedProducts}
                onBack={handleBackToCatalog}
                onOpenLogin={onOpenLogin}
                onViewDetail={handleViewDetail}
                reduceMotion={reduceMotion}
              />
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/**
 * Public product detail — shows full info but requires login to purchase.
 */
function ProductDetailPublic({
  producto,
  relatedProducts,
  onBack,
  onOpenLogin,
  onViewDetail,
  reduceMotion,
}) {
  const stock = producto.stock != null ? Number(producto.stock) : null;
  const canAdd = stock === null || stock > 0;
  const imgSrc = producto.imagen_url ? baseUrl + producto.imagen_url : null;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Productos", onClick: onBack },
          { label: producto.nombre },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <ImageGallery src={imgSrc} alt={producto.nombre} />

        {/* Info */}
        <Motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {producto.nombre}
          </h1>

          <p className="mt-4 text-3xl font-bold text-primary">
            {Number(producto.precio).toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              por unidad
            </span>
          </p>

          {/* Stock */}
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

          <div className="my-6 h-px bg-border" />

          {/* Description (conditional) */}
          {producto.descripcion && (
            <>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Descripcion
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {producto.descripcion}
                </p>
              </div>
              <div className="my-6 h-px bg-border" />
            </>
          )}

          {/* Trust signals */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Envio rapido disponible</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>Garantia de calidad ANCAMI</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span>Devolucion en 14 dias</span>
            </div>
          </div>

          <div className="my-6 h-px bg-border" />

          {/* CTA — Login to purchase */}
          {canAdd ? (
            <button
              type="button"
              onClick={onOpenLogin}
              className="w-full rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Iniciar sesion para comprar
            </button>
          ) : (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Este producto esta agotado actualmente.
            </p>
          )}

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Necesitas una cuenta para añadir productos a la cesta y realizar pedidos.
          </p>
        </Motion.div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Productos relacionados
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => {
              const rImgSrc = p.imagen_url ? baseUrl + p.imagen_url : null;
              return (
                <Motion.article
                  key={p.id_producto}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    onViewDetail(p);
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {rImgSrc ? (
                      <img
                        src={rImgSrc}
                        alt={p.nombre}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-foreground line-clamp-2">
                      {p.nombre}
                    </h4>
                    <p className="mt-1 text-sm font-bold text-primary">
                      {Number(p.precio).toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                  </div>
                </Motion.article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default VistaProductos;
