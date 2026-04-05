import { useEffect, useState, useMemo } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion";
import api from "../../services/api";
import ProductoCard from "./ProductoCard";

/**
 * Product catalog with staggered grid animation, animated category pills,
 * search, sort, and skeleton loading.
 */
export default function TiendaCatalogo({ onViewDetail, onAddToCart }) {
  const reduceMotion = useReducedMotion();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(null);
  const [sortBy, setSortBy] = useState("reciente");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/catalogo/productos");
        if (!mounted) return;

        const list = Array.isArray(res.data) ? res.data : [];
        setProductos(list);

        // Extract categories from products (public endpoint includes them)
        const catMap = new Map();
        list.forEach((p) => {
          const catName = p.Categorium?.nombre || p.categoria?.nombre;
          if (p.id_categoria && catName) {
            catMap.set(p.id_categoria, { id_categoria: p.id_categoria, nombre: catName });
          }
        });
        setCategorias(Array.from(catMap.values()));
      } catch {
        if (mounted) setError("Error al cargar el catalogo.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
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

  const SkeletonCard = () => (
    <div className="overflow-hidden rounded-2xl" style={{ borderRadius: "var(--tienda-radius-lg)", border: "1px solid var(--tienda-border)" }}>
      <div className="aspect-[4/3] tienda-skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 tienda-skeleton" />
        <div className="h-5 w-1/3 tienda-skeleton" />
        <div className="h-10 w-full tienda-skeleton" style={{ borderRadius: "0.75rem" }} />
      </div>
    </div>
  );

  // Stagger variants
  const containerVariants = reduceMotion
    ? {}
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.04 },
        },
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--tienda-text)" }}>
          Catalogo
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--tienda-text-muted)" }}>
          Explora nuestros productos y anade los que quieras a tu cesta.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--tienda-text-muted)" }}
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
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
            style={{
              background: "var(--tienda-surface)",
              border: "1px solid var(--tienda-border)",
              color: "var(--tienda-text)",
            }}
            aria-label="Buscar productos"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Results count */}
          {!loading && (
            <span className="text-xs font-medium" style={{ color: "var(--tienda-text-muted)" }}>
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            </span>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl py-2.5 px-4 text-sm outline-none cursor-pointer"
            style={{
              background: "var(--tienda-surface)",
              border: "1px solid var(--tienda-border)",
              color: "var(--tienda-text)",
            }}
            aria-label="Ordenar productos"
          >
            <option value="reciente">Mas recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Category tabs with animated pill */}
      {categorias.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 relative">
          <button
            type="button"
            onClick={() => setCatFilter(null)}
            className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer hover:bg-stone-100"
            style={{
              color: catFilter === null ? "#fff" : "var(--tienda-text-muted)",
              border: catFilter === null ? "none" : "1px solid var(--tienda-border)",
            }}
          >
            {catFilter === null && (
              <Motion.div
                layoutId="cat-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--tienda-accent)" }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 22, stiffness: 300 }}
              />
            )}
            <span className="relative z-10">Todas</span>
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id_categoria}
              type="button"
              onClick={() => setCatFilter(cat.id_categoria)}
              className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer hover:bg-stone-100"
              style={{
                color: catFilter === cat.id_categoria ? "#fff" : "var(--tienda-text-muted)",
                border: catFilter === cat.id_categoria ? "none" : "1px solid var(--tienda-border)",
              }}
            >
              {catFilter === cat.id_categoria && (
                <Motion.div
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--tienda-accent)" }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 22, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{cat.nombre}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="mb-6 rounded-xl px-4 py-3 text-sm"
          style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}
        >
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center tienda-glass"
          style={{ borderRadius: "var(--tienda-radius-lg)" }}
        >
          <svg className="mx-auto mb-3 w-12 h-12" style={{ color: "var(--tienda-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="font-medium" style={{ color: "var(--tienda-text-muted)" }}>
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
          {filtered.map((p) => (
            <Motion.div key={p.id_producto} variants={itemVariants}>
              <ProductoCard
                producto={p}
                onAddToCart={onAddToCart}
                onViewDetail={onViewDetail}
              />
            </Motion.div>
          ))}
        </Motion.div>
      )}
    </div>
  );
}
