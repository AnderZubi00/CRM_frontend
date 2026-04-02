import { useEffect, useState } from "react";
import api, { getApiBaseURL } from "../services/api";

function VistaProductos({ onOpenLogin }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return () => {
      isMounted = false;
    };
  }, []);

  const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Productos</h1>
          <p className="mt-1 text-muted-foreground">
            Productos disponibles. Inicia sesión como cliente para añadirlos a la cesta y comprar.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <p className="text-muted-foreground">Aún no hay productos en el catálogo.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((p) => {
              const stock = p.stock != null ? Number(p.stock) : null;
              return (
                <article
                  key={p.id_producto}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {p.imagen_url ? (
                      <img
                        src={baseUrl + p.imagen_url}
                        alt={p.nombre}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        Sin imagen
                      </div>
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
                    {stock !== null && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stock > 0 ? (
                          <span>{stock} en stock</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">Sin stock</span>
                        )}
                      </p>
                    )}
                    {onOpenLogin && (
                      <button
                        type="button"
                        onClick={onOpenLogin}
                        className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                      >
                        Iniciar sesión para comprar
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default VistaProductos;
