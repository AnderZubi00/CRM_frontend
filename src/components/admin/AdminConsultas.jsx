import { useEffect, useState, useCallback } from "react";
import { getConsultas, updateConsultaEstado, deleteConsulta } from "../../services/api";

const ASUNTO_LABELS = {
  cotizacion: "Cotización empresarial",
  stock: "Disponibilidad",
  soporte: "Soporte técnico",
  garantia: "Garantías / Devoluciones",
  otro: "Otro",
};

const ESTADO_CONFIG = {
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  vista: {
    label: "Vista",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  resuelta: {
    label: "Resuelta",
    className: "bg-green-100 text-green-800 border-green-200",
  },
};

function EstadoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, className: "bg-slate-100 text-slate-700 border-slate-200" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function formatFecha(fechaStr) {
  if (!fechaStr) return "—";
  const d = new Date(fechaStr);
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ConsultaCard({ consulta, isAdmin, onEstadoChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEstado = async (nuevoEstado) => {
    setLoading(true);
    try {
      await onEstadoChange(consulta.id_consulta, nuevoEstado);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar la consulta de ${consulta.nombre}?`)) return;
    setLoading(true);
    try {
      await onDelete(consulta.id_consulta);
    } finally {
      setLoading(false);
    }
  };

  const siguienteEstado = {
    pendiente: "vista",
    vista: "resuelta",
    resuelta: null,
  }[consulta.estado];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Info principal */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <EstadoBadge estado={consulta.estado} />
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {ASUNTO_LABELS[consulta.asunto] ?? consulta.asunto}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">{consulta.nombre}</p>
          <p className="text-xs text-muted-foreground">{consulta.correo}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatFecha(consulta.fecha_creacion)}</p>
        </div>

        {/* Acciones */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {siguienteEstado && (
            <button
              onClick={() => handleEstado(siguienteEstado)}
              disabled={loading}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-50"
            >
              Marcar como {ESTADO_CONFIG[siguienteEstado]?.label}
            </button>
          )}
          {consulta.estado !== "pendiente" && (
            <button
              onClick={() => handleEstado("pendiente")}
              disabled={loading}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-muted disabled:opacity-50"
            >
              Reabrir
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            {expanded ? "Ocultar" : "Ver mensaje"}
          </button>
        </div>
      </div>

      {/* Mensaje expandible */}
      {expanded && (
        <div className="border-t border-border bg-muted/40 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Mensaje</p>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{consulta.mensaje}</p>
          {consulta.telefono && (
            <p className="mt-3 text-xs text-muted-foreground">
              Teléfono: <span className="font-medium text-foreground">{consulta.telefono}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const FILTROS = ["todos", "pendiente", "vista", "resuelta"];

function AdminConsultas({ user }) {
  const isAdmin = user?.id_rol === 1;

  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getConsultas();
      setConsultas(data);
    } catch (err) {
      setError(err?.response?.data?.error || "No se pudieron cargar las consultas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleEstadoChange = async (id, estado) => {
    await updateConsultaEstado(id, estado);
    setConsultas((prev) =>
      prev.map((c) => (c.id_consulta === id ? { ...c, estado } : c))
    );
  };

  const handleDelete = async (id) => {
    await deleteConsulta(id);
    setConsultas((prev) => prev.filter((c) => c.id_consulta !== id));
  };

  const consultasFiltradas = filtro === "todos"
    ? consultas
    : consultas.filter((c) => c.estado === filtro);

  const conteo = {
    todos: consultas.length,
    pendiente: consultas.filter((c) => c.estado === "pendiente").length,
    vista: consultas.filter((c) => c.estado === "vista").length,
    resuelta: consultas.filter((c) => c.estado === "resuelta").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Consultas de clientes</h2>
          <p className="text-sm text-muted-foreground">
            {consultas.length === 0
              ? "No hay consultas recibidas todavía."
              : `${consultas.length} consulta${consultas.length !== 1 ? "s" : ""} en total`}
          </p>
        </div>
        <button
          onClick={cargar}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-50 self-start sm:self-auto"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={[
              "rounded-full border px-3 py-1.5 text-sm font-medium transition",
              filtro === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted",
            ].join(" ")}
          >
            {f === "todos" ? "Todas" : ESTADO_CONFIG[f]?.label}
            <span className="ml-1.5 rounded-full bg-current/10 px-1.5 py-0.5 text-xs tabular-nums">
              {conteo[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Estados */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 animate-spin text-muted-foreground">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
      )}

      {!loading && !error && consultasFiltradas.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-muted-foreground mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <p className="text-sm font-medium text-muted-foreground">
            {filtro === "todos" ? "No hay consultas todavía." : `No hay consultas con estado "${ESTADO_CONFIG[filtro]?.label}".`}
          </p>
        </div>
      )}

      {!loading && !error && consultasFiltradas.length > 0 && (
        <div className="space-y-3">
          {consultasFiltradas.map((c) => (
            <ConsultaCard
              key={c.id_consulta}
              consulta={c}
              isAdmin={isAdmin}
              onEstadoChange={handleEstadoChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminConsultas;
