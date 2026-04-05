import { useEffect, useState, useMemo } from "react";
import { getAllPedidos, getApiBaseURL } from "@/services/api";

const baseUrl = (getApiBaseURL() || "").replace(/\/$/, "");

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtEur(value) {
  return Number(value).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
}

function fmtDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function StockBadge({ stock }) {
  const n = Number(stock);
  if (n < 5)
    return (
      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
        Crítico ({n})
      </span>
    );
  if (n < 20)
    return (
      <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
        Bajo ({n})
      </span>
    );
  if (n < 50)
    return (
      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
        Normal ({n})
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
      Alto ({n})
    </span>
  );
}

// ── Sub-tab: Inventario ─────────────────────────────────────────────────────

function TabInventario({ productos }) {
  const sorted = useMemo(
    () => [...productos].sort((a, b) => Number(a.stock) - Number(b.stock)),
    [productos]
  );

  const criticos = sorted.filter((p) => Number(p.stock) < 5).length;
  const bajos = sorted.filter((p) => Number(p.stock) >= 5 && Number(p.stock) < 20).length;

  return (
    <div>
      {/* Resumen */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Total productos" value={productos.length} color="text-foreground" />
        <SummaryCard label="Stock crítico" value={criticos} color="text-red-600" />
        <SummaryCard label="Stock bajo" value={bajos} color="text-yellow-600" />
        <SummaryCard
          label="Sin problemas"
          value={productos.length - criticos - bajos}
          color="text-green-600"
        />
      </div>

      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              <th className="p-3 text-left font-semibold text-muted-foreground">Producto</th>
              <th className="p-3 text-left font-semibold text-muted-foreground">Categoría</th>
              <th className="p-3 text-right font-semibold text-muted-foreground">Precio</th>
              <th className="p-3 text-center font-semibold text-muted-foreground">Stock</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const imgSrc = p.imagen_url ? baseUrl + p.imagen_url : null;
              return (
                <tr key={p.id_producto} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {imgSrc ? (
                          <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {p.Categorium?.nombre || p.categoria?.nombre || "-"}
                  </td>
                  <td className="p-3 text-right font-semibold text-foreground">
                    {fmtEur(p.precio)}
                  </td>
                  <td className="p-3 text-center">
                    <StockBadge stock={p.stock} />
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Sub-tab: Historial de ventas ────────────────────────────────────────────

function TabVentas({ pedidos }) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    return pedidos.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        String(p.id_pedido).includes(q) ||
        (p.correo_cliente || "").toLowerCase().includes(q) ||
        (p.nombre_cliente || "").toLowerCase().includes(q);

      const fecha = new Date(p.fecha);
      const matchFrom = !dateFrom || fecha >= new Date(dateFrom);
      const matchTo = !dateTo || fecha <= new Date(dateTo + "T23:59:59");

      return matchSearch && matchFrom && matchTo;
    });
  }, [pedidos, search, dateFrom, dateTo]);

  const totalGeneral = useMemo(
    () => filtered.reduce((acc, p) => acc + Number(p.total || 0), 0),
    [filtered]
  );

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por cliente o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        {(search || dateFrom || dateTo) && (
          <button
            type="button"
            onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Resumen rápido */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span><strong className="text-foreground">{filtered.length}</strong> pedidos</span>
        <span>Total: <strong className="text-foreground">{fmtEur(totalGeneral)}</strong></span>
      </div>

      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              <th className="p-3 text-left font-semibold text-muted-foreground w-12">#</th>
              <th className="p-3 text-left font-semibold text-muted-foreground">Fecha</th>
              <th className="p-3 text-left font-semibold text-muted-foreground">Cliente</th>
              <th className="p-3 text-center font-semibold text-muted-foreground">Artículos</th>
              <th className="p-3 text-right font-semibold text-muted-foreground">Total</th>
              <th className="p-3 text-center font-semibold text-muted-foreground">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const isExpanded = expandedId === p.id_pedido;
              const artCount = p.detalles?.reduce((s, d) => s + Number(d.cantidad), 0) || 0;
              return (
                <>
                  <tr
                    key={p.id_pedido}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 text-muted-foreground font-mono text-xs">{p.id_pedido}</td>
                    <td className="p-3 text-foreground">{fmtDate(p.fecha)}</td>
                    <td className="p-3">
                      <div className="font-medium text-foreground">
                        {p.nombre_cliente || p.correo_cliente || "-"}
                      </div>
                      {p.nombre_cliente && p.correo_cliente && (
                        <div className="text-xs text-muted-foreground">{p.correo_cliente}</div>
                      )}
                    </td>
                    <td className="p-3 text-center text-muted-foreground">{artCount}</td>
                    <td className="p-3 text-right font-semibold text-foreground">
                      {fmtEur(p.total)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : p.id_pedido)}
                        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                      >
                        {isExpanded ? "Cerrar" : "Ver"}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${p.id_pedido}-detail`} className="border-t border-border bg-muted/20">
                      <td colSpan={6} className="p-4">
                        <div className="space-y-2">
                          {p.detalles?.map((d) => {
                            const imgSrc = d.imagen_url ? baseUrl + d.imagen_url : null;
                            return (
                              <div
                                key={d.id_detalle}
                                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                              >
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                  {imgSrc ? (
                                    <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground text-sm">{d.nombre_producto}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {fmtEur(d.precio_unitario)} × {d.cantidad} ud.
                                  </p>
                                </div>
                                <p className="font-semibold text-foreground text-sm">
                                  {fmtEur(Number(d.precio_unitario) * Number(d.cantidad))}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No hay pedidos para los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Sub-tab: Rendimiento por producto ───────────────────────────────────────

function TabRendimiento({ pedidos }) {
  const stats = useMemo(() => {
    const map = {};
    for (const pedido of pedidos) {
      for (const d of pedido.detalles || []) {
        if (!map[d.id_producto]) {
          map[d.id_producto] = {
            id: d.id_producto,
            nombre: d.nombre_producto,
            imagen_url: d.imagen_url,
            unidades: 0,
            ingresos: 0,
            pedidos: 0,
            ultima_venta: null,
          };
        }
        map[d.id_producto].unidades += Number(d.cantidad);
        map[d.id_producto].ingresos += Number(d.precio_unitario) * Number(d.cantidad);
        map[d.id_producto].pedidos += 1;
        const fecha = pedido.fecha;
        if (!map[d.id_producto].ultima_venta || fecha > map[d.id_producto].ultima_venta) {
          map[d.id_producto].ultima_venta = fecha;
        }
      }
    }
    return Object.values(map).sort((a, b) => b.ingresos - a.ingresos);
  }, [pedidos]);

  const maxIngresos = stats[0]?.ingresos || 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{stats.length}</strong> productos con ventas
        </span>
        <span>
          Ingresos totales:{" "}
          <strong className="text-foreground">
            {fmtEur(stats.reduce((s, p) => s + p.ingresos, 0))}
          </strong>
        </span>
        <span>
          Unidades vendidas:{" "}
          <strong className="text-foreground">
            {stats.reduce((s, p) => s + p.unidades, 0).toLocaleString("es-ES")}
          </strong>
        </span>
      </div>

      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              <th className="p-3 text-left font-semibold text-muted-foreground">#</th>
              <th className="p-3 text-left font-semibold text-muted-foreground">Producto</th>
              <th className="p-3 text-right font-semibold text-muted-foreground">Unidades</th>
              <th className="p-3 text-right font-semibold text-muted-foreground">Ingresos</th>
              <th className="p-3 text-center font-semibold text-muted-foreground">Pedidos</th>
              <th className="p-3 text-left font-semibold text-muted-foreground">Última venta</th>
              <th className="p-3 text-left font-semibold text-muted-foreground w-40">Rendimiento</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((p, idx) => {
              const imgSrc = p.imagen_url ? baseUrl + p.imagen_url : null;
              const pct = Math.round((p.ingresos / maxIngresos) * 100);
              return (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-muted-foreground font-mono text-xs">{idx + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {imgSrc ? (
                          <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right text-foreground font-semibold">
                    {p.unidades.toLocaleString("es-ES")}
                  </td>
                  <td className="p-3 text-right font-bold text-foreground">
                    {fmtEur(p.ingresos)}
                  </td>
                  <td className="p-3 text-center text-muted-foreground">{p.pedidos}</td>
                  <td className="p-3 text-muted-foreground">{fmtDate(p.ultima_venta)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {stats.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  Aún no hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Card resumen ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, color }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────────────────────

const TABS = [
  { id: "inventario", label: "Inventario" },
  { id: "ventas", label: "Historial de ventas" },
  { id: "rendimiento", label: "Rendimiento" },
];

export default function AdminProductStats({ productos = [] }) {
  const [activeTab, setActiveTab] = useState("inventario");
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoadingPedidos(true);
        setErrorPedidos("");
        const data = await getAllPedidos();
        if (mounted) setPedidos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted)
          setErrorPedidos(
            e?.response?.data?.error || e?.message || "Error cargando pedidos."
          );
      } finally {
        if (mounted) setLoadingPedidos(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {/* Sub-tab nav */}
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={[
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {activeTab === "inventario" && <TabInventario productos={productos} />}

      {activeTab !== "inventario" && loadingPedidos && (
        <div className="flex items-center gap-2 py-12 text-muted-foreground text-sm">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Cargando datos de ventas...
        </div>
      )}

      {activeTab !== "inventario" && !loadingPedidos && errorPedidos && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorPedidos}
        </div>
      )}

      {activeTab === "ventas" && !loadingPedidos && !errorPedidos && (
        <TabVentas pedidos={pedidos} />
      )}

      {activeTab === "rendimiento" && !loadingPedidos && !errorPedidos && (
        <TabRendimiento pedidos={pedidos} />
      )}
    </div>
  );
}
