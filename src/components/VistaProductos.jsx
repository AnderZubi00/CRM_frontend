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
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
          <p className="text-slate-600 mt-1">
            Productos disponibles. Inicia sesión como cliente para añadirlos a la cesta y comprar.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">Aún no hay productos en el catálogo.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((p) => {
              const stock = p.stock != null ? Number(p.stock) : null;
              return (
                <article
                  key={p.id_producto}
                  className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    {p.imagen_url ? (
                      <img
                        src={baseUrl + p.imagen_url}
                        alt={p.nombre}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <h2 className="font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem]">
                      {p.nombre}
                    </h2>
                    <p className="mt-2 text-lg font-bold text-blue-600">
                      {Number(p.precio).toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                    {stock !== null && (
                      <p className="text-xs text-slate-500 mt-1">
                        {stock > 0 ? (
                          <span>{stock} en stock</span>
                        ) : (
                          <span className="text-amber-600">Sin stock</span>
                        )}
                      </p>
                    )}
                    {onOpenLogin && (
                      <button
                        type="button"
                        onClick={onOpenLogin}
                        className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 shadow-sm transition"
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
