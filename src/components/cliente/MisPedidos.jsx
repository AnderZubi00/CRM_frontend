import { useEffect, useState } from "react";
import { getMisPedidos, getApiBaseURL } from "../../services/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFecha(fechaStr) {
  const d = new Date(fechaStr);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function calcTotal(detalles) {
  return detalles.reduce((acc, d) => acc + d.cantidad * parseFloat(d.precio_unitario), 0);
}

const ESTADO_STYLES = {
  pendiente:   { dot: "bg-amber-400",  pill: "bg-amber-50 text-amber-700 border-amber-200",  label: "Pendiente" },
  en_proceso:  { dot: "bg-blue-500",   pill: "bg-blue-50 text-blue-700 border-blue-200",     label: "En proceso" },
  enviado:     { dot: "bg-indigo-500", pill: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Enviado" },
  completado:  { dot: "bg-green-500",  pill: "bg-green-50 text-green-700 border-green-200",  label: "Completado" },
};

function EstadoBadge({ estado }) {
  const s = ESTADO_STYLES[estado] ?? ESTADO_STYLES.pendiente;
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-xs font-medium ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-40 bg-slate-100 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PedidoCard ────────────────────────────────────────────────────────────────
function PedidoCard({ pedido }) {
  const [open, setOpen] = useState(true);
  const total = calcTotal(pedido.detalles);
  const baseURL = getApiBaseURL();

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-slate-900" style={{ fontFamily: "Rubik, sans-serif" }}>
              Pedido #{pedido.id_pedido}
            </span>
            <EstadoBadge estado={pedido.estado || "pendiente"} />
          </div>
          <span className="text-xs text-slate-500">{formatFecha(pedido.fecha)}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <span className="text-sm font-semibold text-slate-700">
            {total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-7 h-7 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors duration-150 cursor-pointer"
            aria-label={open ? "Colapsar pedido" : "Expandir pedido"}
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body colapsable */}
      {open && (
        <div className="divide-y divide-slate-50">
          {pedido.detalles.map((d) => {
            const imgSrc = d.imagen_url
              ? (d.imagen_url.startsWith("http") ? d.imagen_url : `${baseURL}${d.imagen_url}`)
              : null;
            const subtotal = d.cantidad * parseFloat(d.precio_unitario);
            return (
              <div key={d.id_detalle} className="flex items-center gap-4 px-6 py-4">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {imgSrc ? (
                    <img src={imgSrc} alt={d.nombre_producto} className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-slate-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                    </svg>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{d.nombre_producto}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {d.cantidad} × {parseFloat(d.precio_unitario).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                {/* Subtotal */}
                <span className="text-sm font-semibold text-slate-700 flex-shrink-0">
                  {subtotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </span>
              </div>
            );
          })}

          {/* Footer total */}
          <div className="flex justify-end items-center gap-2 px-6 py-3 bg-slate-50">
            <span className="text-xs text-slate-500">Total del pedido</span>
            <span className="text-sm font-bold text-slate-900">
              {total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function MisPedidos({ user, onNavigate, onOpenLogin }) {
  const [pedidos, setPedidos] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  const load = async () => {
    setStatus("loading");
    try {
      const data = await getMisPedidos();
      setPedidos(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (user) load();
    else setStatus("success");
  }, [user]);

  // ── Sin sesión ──
  if (!user) {
    return (
      <div className="bg-slate-50 min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "Rubik, sans-serif" }}>
            Iniciá sesión para ver tus pedidos
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Necesitás una cuenta para acceder al historial de pedidos.
          </p>
          <button
            onClick={() => onOpenLogin?.()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer text-sm"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Hero dark ── */}
      <section className="bg-slate-900 px-6 md:px-12 py-14">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-600 mb-6">
            <button
              onClick={() => onNavigate?.("home")}
              className="hover:text-slate-400 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-slate-600"
            >
              Inicio
            </button>
            <span>/</span>
            <span className="text-slate-400">Mis pedidos</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "Rubik, sans-serif" }}>
            Mis pedidos
          </h1>
          <p className="text-slate-400 text-sm">
            {status === "success" && pedidos.length > 0
              ? `${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""} en tu historial`
              : "Historial de compras de tu cuenta"}
          </p>
        </div>
      </section>

      {/* ── Contenido ── */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 py-10">

        {/* Loading */}
        {status === "loading" && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-slate-700 font-medium mb-1">No pudimos cargar tus pedidos</p>
            <p className="text-slate-500 text-sm mb-5">Verificá tu conexión e intentalo de nuevo.</p>
            <button
              onClick={load}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-none"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty */}
        {status === "success" && pedidos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "Rubik, sans-serif" }}>
              Todavía no tenés pedidos
            </h2>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Explorá el catálogo y hacé tu primera compra.
            </p>
            <button
              onClick={() => onNavigate?.("productos")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer text-sm"
            >
              Ver catálogo
            </button>
          </div>
        )}

        {/* Lista */}
        {status === "success" && pedidos.length > 0 && (
          <div className="space-y-4">
            {pedidos.map((p) => (
              <PedidoCard key={p.id_pedido} pedido={p} />
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

export default MisPedidos;
