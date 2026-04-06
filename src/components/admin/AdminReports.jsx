import { useEffect, useMemo, useState } from "react";
import { getAllPedidos, getProductos } from "@/services/api";

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtEur(v) {
  return Number(v).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function pct(current, prev) {
  if (!prev) return null;
  return ((current - prev) / prev) * 100;
}

// ── UI Primitives ──────────────────────────────────────────────────────────

function SectionTitle({ children, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-foreground">{children}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

function DeltaBadge({ current, prev }) {
  const delta = pct(current, prev);
  if (delta === null) return <span className="text-xs text-muted-foreground">—</span>;
  const positive = delta >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

function KpiCard({ icon, label, value, current, prev, alert }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        >
          {icon}
        </div>
        {current !== undefined && prev !== undefined && (
          <DeltaBadge current={current} prev={prev} />
        )}
        {alert && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            Alerta
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
    </div>
  );
}

// ── Bloque 2: Gráfico de barras CSS ───────────────────────────────────────

function BarChart({ datos, metrica }) {
  const valores = datos.map((d) => d[metrica]);
  const max = Math.max(...valores, 1);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="relative">
      {/* Tooltip */}
      {hovered !== null && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-md whitespace-nowrap">
          {datos[hovered]?.label}:{" "}
          {metrica === "ingresos"
            ? fmtEur(datos[hovered]?.ingresos)
            : `${datos[hovered]?.nPedidos} pedidos`}
        </div>
      )}

      <div className="flex items-end gap-3 h-40 pt-4">
        {datos.map((d, i) => {
          const h = max > 0 ? (d[metrica] / max) * 100 : 0;
          return (
            <div
              key={i}
              className="flex flex-1 flex-col items-center gap-1"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Valor encima */}
              <span className="text-[0.6rem] text-muted-foreground leading-none">
                {metrica === "ingresos"
                  ? d.ingresos > 0
                    ? fmtEur(d.ingresos)
                    : "—"
                  : d.nPedidos > 0
                  ? d.nPedidos
                  : "—"}
              </span>
              {/* Barra */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-300 cursor-default"
                  style={{
                    height: `${h}%`,
                    minHeight: h > 0 ? 4 : 0,
                    background: hovered === i ? "hsl(var(--primary) / 0.8)" : "hsl(var(--primary))",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Línea base + etiquetas */}
      <div className="border-t border-border pt-2 flex gap-3">
        {datos.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[0.65rem] text-muted-foreground capitalize">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bloque 4: Barra horizontal ─────────────────────────────────────────────

function HorizontalBar({ label, value, max, formatter }) {
  const pctVal = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 truncate text-sm text-foreground shrink-0">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pctVal}%` }}
        />
      </div>
      <span className="w-24 text-right text-sm font-semibold text-foreground shrink-0">
        {formatter(value)}
      </span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted ${className}`}
    />
  );
}

// ── Componente principal ───────────────────────────────────────────────────

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [metricaGrafico, setMetricaGrafico] = useState("ingresos");

  useEffect(() => {
    Promise.all([getAllPedidos(), getProductos()])
      .then(([p, pr]) => {
        setPedidos(Array.isArray(p) ? p : []);
        setProductos(Array.isArray(pr) ? pr : []);
      })
      .catch((e) =>
        setError(e?.response?.data?.error || e?.message || "Error cargando datos.")
      )
      .finally(() => setLoading(false));
  }, []);

  // ── Fechas de referencia ─────────────────────────────────────────────────
  const HOY = useMemo(() => new Date(), []);
  const mesActual = HOY.getMonth();
  const anioActual = HOY.getFullYear();
  const mesPrev = mesActual === 0 ? 11 : mesActual - 1;
  const anioPrev = mesActual === 0 ? anioActual - 1 : anioActual;

  // ── Filtros de mes ───────────────────────────────────────────────────────
  const pedidosMes = useMemo(
    () =>
      pedidos.filter((p) => {
        const f = new Date(p.fecha);
        return f.getMonth() === mesActual && f.getFullYear() === anioActual;
      }),
    [pedidos, mesActual, anioActual]
  );

  const pedidosMesPrev = useMemo(
    () =>
      pedidos.filter((p) => {
        const f = new Date(p.fecha);
        return f.getMonth() === mesPrev && f.getFullYear() === anioPrev;
      }),
    [pedidos, mesPrev, anioPrev]
  );

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const ingresosMes = useMemo(
    () => pedidosMes.reduce((s, p) => s + Number(p.total || 0), 0),
    [pedidosMes]
  );
  const ingresosMesPrev = useMemo(
    () => pedidosMesPrev.reduce((s, p) => s + Number(p.total || 0), 0),
    [pedidosMesPrev]
  );
  const nPedidosMes = pedidosMes.length;
  const nPedidosMesPrev = pedidosMesPrev.length;
  const ticketMedio = nPedidosMes > 0 ? ingresosMes / nPedidosMes : 0;
  const clientesActivosMes = useMemo(
    () => new Set(pedidosMes.map((p) => p.id_cliente)).size,
    [pedidosMes]
  );
  const stockCritico = useMemo(
    () => productos.filter((p) => Number(p.stock) < 5).length,
    [productos]
  );
  const valorInventario = useMemo(
    () => productos.reduce((s, p) => s + Number(p.stock) * Number(p.precio), 0),
    [productos]
  );

  // ── Bloque 2: Evolución 6 meses ──────────────────────────────────────────
  const datosMeses = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (5 - i));
      const m = d.getMonth();
      const y = d.getFullYear();
      const del = pedidos.filter((p) => {
        const f = new Date(p.fecha);
        return f.getMonth() === m && f.getFullYear() === y;
      });
      return {
        label: d.toLocaleString("es-ES", { month: "short" }),
        ingresos: del.reduce((s, p) => s + Number(p.total || 0), 0),
        nPedidos: del.length,
      };
    });
  }, [pedidos]);

  // ── Bloque 3: Clientes ───────────────────────────────────────────────────
  const { gastosPorCliente, topClientes, clientesEnRiesgo, nuevosClientesMes, nuevosClientesMesPrev } =
    useMemo(() => {
      const map = {};
      pedidos.forEach((p) => {
        const k = p.id_cliente;
        if (!map[k]) {
          map[k] = {
            id_cliente: k,
            nombre: p.nombre_cliente,
            correo: p.correo_cliente,
            total: 0,
            nPedidos: 0,
            fechas: [],
          };
        }
        map[k].total += Number(p.total || 0);
        map[k].nPedidos += 1;
        map[k].fechas.push(new Date(p.fecha));
      });

      const todos = Object.values(map);

      // Último pedido por cliente
      todos.forEach((c) => {
        c.ultimaCompra = c.fechas.reduce((a, b) => (b > a ? b : a), c.fechas[0]);
        c.primerCompra = c.fechas.reduce((a, b) => (b < a ? b : a), c.fechas[0]);
      });

      const top = [...todos].sort((a, b) => b.total - a.total).slice(0, 5);

      const enRiesgo = todos.filter((c) => {
        const dias = (HOY - c.ultimaCompra) / (1000 * 60 * 60 * 24);
        return dias > 60;
      }).sort((a, b) => (HOY - b.ultimaCompra) - (HOY - a.ultimaCompra));

      const nuevosMes = todos.filter((c) => {
        const f = c.primerCompra;
        return f && f.getMonth() === mesActual && f.getFullYear() === anioActual;
      }).length;

      const nuevosMesPrev = todos.filter((c) => {
        const f = c.primerCompra;
        return f && f.getMonth() === mesPrev && f.getFullYear() === anioPrev;
      }).length;

      return {
        gastosPorCliente: map,
        topClientes: top,
        clientesEnRiesgo: enRiesgo,
        nuevosClientesMes: nuevosMes,
        nuevosClientesMesPrev: nuevosMesPrev,
      };
    }, [pedidos, HOY, mesActual, anioActual, mesPrev, anioPrev]);

  // ── Bloque 4: Inventario ──────────────────────────────────────────────────
  const { sinVentas, ingresosPorCategoria, productosMap } = useMemo(() => {
    const pMap = {};
    productos.forEach((p) => { pMap[p.id_producto] = p; });

    const vendidos = new Set(
      pedidos.flatMap((p) => (p.detalles || []).map((d) => d.id_producto))
    );
    const sin = productos
      .filter((p) => !vendidos.has(p.id_producto))
      .map((p) => ({ ...p, valorInmovilizado: Number(p.stock) * Number(p.precio) }))
      .sort((a, b) => b.valorInmovilizado - a.valorInmovilizado);

    const catMap = {};
    pedidos.forEach((p) => {
      (p.detalles || []).forEach((d) => {
        const prod = pMap[d.id_producto];
        const cat =
          prod?.Categorium?.nombre ||
          prod?.categoria?.nombre ||
          "Sin categoría";
        catMap[cat] = (catMap[cat] || 0) + Number(d.precio_unitario) * Number(d.cantidad);
      });
    });

    const catArr = Object.entries(catMap)
      .map(([nombre, ingresos]) => ({ nombre, ingresos }))
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5);

    return { sinVentas: sin, ingresosPorCategoria: catArr, productosMap: pMap };
  }, [pedidos, productos]);

  const stockStats = useMemo(() => ({
    critico: productos.filter((p) => Number(p.stock) < 5).length,
    bajo: productos.filter((p) => Number(p.stock) >= 5 && Number(p.stock) < 20).length,
    normal: productos.filter((p) => Number(p.stock) >= 20 && Number(p.stock) < 50).length,
    alto: productos.filter((p) => Number(p.stock) >= 50).length,
  }), [productos]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-56" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BLOQUE 1 — KPIs                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SectionTitle subtitle="Comparativa con el mes anterior">
          Resumen del mes
        </SectionTitle>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <KpiCard
            label="Ingresos este mes"
            value={fmtEur(ingresosMes)}
            current={ingresosMes}
            prev={ingresosMesPrev}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <KpiCard
            label="Pedidos este mes"
            value={nPedidosMes}
            current={nPedidosMes}
            prev={nPedidosMesPrev}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
          <KpiCard
            label="Ticket medio"
            value={fmtEur(ticketMedio)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
          <KpiCard
            label="Clientes activos"
            value={clientesActivosMes}
            current={clientesActivosMes}
            prev={new Set(pedidosMesPrev.map((p) => p.id_cliente)).size}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <KpiCard
            label="Stock crítico"
            value={stockCritico}
            alert={stockCritico > 0}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          <KpiCard
            label="Valor inventario"
            value={fmtEur(valorInventario)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BLOQUE 2 — Evolución de ventas                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-5">
          <SectionTitle subtitle="Últimos 6 meses">
            Evolución de ventas
          </SectionTitle>
          <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 shrink-0">
            {[
              { id: "ingresos", label: "Ingresos" },
              { id: "nPedidos", label: "Pedidos" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetricaGrafico(m.id)}
                className={[
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  metricaGrafico === m.id
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <BarChart datos={datosMeses} metrica={metricaGrafico} />

        {/* Resumen debajo */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <span>
            Total histórico:{" "}
            <strong className="text-foreground">
              {fmtEur(pedidos.reduce((s, p) => s + Number(p.total || 0), 0))}
            </strong>
          </span>
          <span>
            Total pedidos:{" "}
            <strong className="text-foreground">{pedidos.length}</strong>
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BLOQUE 3 — Análisis de clientes                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SectionTitle subtitle="Ranking, riesgo y nuevas altas">
          Análisis de clientes
        </SectionTitle>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 3A — Top clientes */}
          <div className="lg:col-span-1">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Top 5 por gasto total
            </h3>
            <div className="space-y-2">
              {topClientes.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin datos aún.</p>
              )}
              {topClientes.map((c, i) => (
                <div
                  key={c.id_cliente}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                  >
                    {(c.nombre || c.correo || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.nombre || c.correo || "—"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.nPedidos} {c.nPedidos === 1 ? "pedido" : "pedidos"}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-foreground shrink-0">
                    {fmtEur(c.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* 3C — Nuevos clientes */}
            <div className="mt-4 rounded-xl border border-border p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Nuevos clientes este mes</p>
                <p className="text-2xl font-bold text-foreground">{nuevosClientesMes}</p>
              </div>
              <DeltaBadge current={nuevosClientesMes} prev={nuevosClientesMesPrev} />
            </div>
          </div>

          {/* 3B — Clientes en riesgo */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
              Clientes en riesgo
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                Sin comprar +60 días
              </span>
            </h3>

            {clientesEnRiesgo.length === 0 ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Todos los clientes han comprado en los últimos 60 días.
              </div>
            ) : (
              <div className="overflow-auto rounded-xl border border-border">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-border bg-muted/60">
                    <tr>
                      <th className="p-3 text-left font-semibold text-muted-foreground">Cliente</th>
                      <th className="p-3 text-left font-semibold text-muted-foreground">Última compra</th>
                      <th className="p-3 text-center font-semibold text-muted-foreground">Días sin comprar</th>
                      <th className="p-3 text-right font-semibold text-muted-foreground">Gasto total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesEnRiesgo.map((c) => {
                      const dias = Math.floor(
                        (HOY - c.ultimaCompra) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <tr key={c.id_cliente} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <p className="font-medium text-foreground">
                              {c.nombre || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">{c.correo}</p>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {fmtDate(c.ultimaCompra)}
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                              {dias} días
                            </span>
                          </td>
                          <td className="p-3 text-right font-semibold text-foreground">
                            {fmtEur(c.total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BLOQUE 4 — Análisis de inventario                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SectionTitle subtitle="Stock, capital inmovilizado y rendimiento por categoría">
          Análisis de inventario
        </SectionTitle>

        {/* 4A — Distribución de stock */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Crítico (< 5)", val: stockStats.critico, color: "border-red-200 bg-red-50 text-red-700" },
            { label: "Bajo (5-19)", val: stockStats.bajo, color: "border-yellow-200 bg-yellow-50 text-yellow-700" },
            { label: "Normal (20-49)", val: stockStats.normal, color: "border-green-200 bg-green-50 text-green-700" },
            { label: "Alto (≥ 50)", val: stockStats.alto, color: "border-blue-200 bg-blue-50 text-blue-700" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border p-4 ${s.color}`}
            >
              <p className="text-xs font-medium opacity-80">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.val}</p>
              <p className="text-xs opacity-70 mt-0.5">productos</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 4B — Productos sin ventas */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
              Capital inmovilizado
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Productos sin ventas
              </span>
            </h3>
            {sinVentas.length === 0 ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Todos los productos tienen al menos una venta.
              </div>
            ) : (
              <div className="overflow-auto rounded-xl border border-border">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-border bg-muted/60">
                    <tr>
                      <th className="p-3 text-left font-semibold text-muted-foreground">Producto</th>
                      <th className="p-3 text-right font-semibold text-muted-foreground">Stock</th>
                      <th className="p-3 text-right font-semibold text-muted-foreground">Precio</th>
                      <th className="p-3 text-right font-semibold text-muted-foreground">Inmovilizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sinVentas.map((p) => (
                      <tr key={p.id_producto} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-foreground">{p.nombre}</td>
                        <td className="p-3 text-right text-muted-foreground">{p.stock}</td>
                        <td className="p-3 text-right text-muted-foreground">{fmtEur(p.precio)}</td>
                        <td className="p-3 text-right font-bold text-foreground">
                          {fmtEur(p.valorInmovilizado)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-border bg-muted/30">
                    <tr>
                      <td colSpan={3} className="p-3 text-sm font-semibold text-foreground">
                        Total inmovilizado
                      </td>
                      <td className="p-3 text-right font-bold text-foreground">
                        {fmtEur(sinVentas.reduce((s, p) => s + p.valorInmovilizado, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* 4C — Ingresos por categoría */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Top categorías por ingresos
            </h3>
            {ingresosPorCategoria.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin datos de ventas aún.</p>
            ) : (
              <div className="space-y-3">
                {ingresosPorCategoria.map((cat) => (
                  <HorizontalBar
                    key={cat.nombre}
                    label={cat.nombre}
                    value={cat.ingresos}
                    max={ingresosPorCategoria[0].ingresos}
                    formatter={fmtEur}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
