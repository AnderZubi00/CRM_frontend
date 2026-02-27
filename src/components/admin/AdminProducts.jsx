import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatInt(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("es-ES");
}

function StatusPill({ children }) {
  return (
    <span
      style={{
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: "#f9fafb",
        opacity: 0.9,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Modal / form
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id_producto: null,
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    id_categoria: "",
    id_proveedor: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const title = useMemo(
    () => (mode === "edit" ? "Editar producto" : "Nuevo producto"),
    [mode]
  );

  const formHasErrors = Object.keys(fieldErrors).length > 0;

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/productos");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        "No se pudieron cargar los productos. Revisa backend/terminal."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadLookups() {
    try {
      // Ajusta estas rutas si tus endpoints se llaman distinto
      const [catRes, provRes] = await Promise.all([
        api.get("/api/categorias"),
        api.get("/api/proveedores"),
      ]);
      setCategorias(Array.isArray(catRes.data) ? catRes.data : []);
      setProveedores(Array.isArray(provRes.data) ? provRes.data : []);
    } catch (e) {
      console.error("Error cargando lookups:", e);
      console.log("Categorias:", catRes.data);
      console.log("Proveedores:", provRes.data);
      setError((prev) => prev || "No se pudieron cargar categorías/proveedores.");
    }
  }

  useEffect(() => {
    load();
    loadLookups();
  }, []);

  function resetForm() {
    setForm({
      id_producto: null,
      nombre: "",
      precio: "",
      stock: "",
      descripcion: "",
      id_categoria: "",
      id_proveedor: "",
    });
  }

  function validateAll(nextForm = form) {
    const errs = {};

    if (!nextForm.id_categoria) errs.id_categoria = "Selecciona una categoría.";
    if (!nextForm.id_proveedor) errs.id_proveedor = "Selecciona un proveedor.";

    const nombre = (nextForm.nombre ?? "").trim();
    if (!nombre) errs.nombre = "El nombre es obligatorio.";

    const precioRaw = nextForm.precio;
    const precioNum = Number(precioRaw);
    if (precioRaw === "" || !Number.isFinite(precioNum)) {
      errs.precio = "El precio debe ser un número.";
    } else if (precioNum < 0) {
      errs.precio = "El precio no puede ser negativo.";
    }

    const stockRaw = nextForm.stock;
    if (stockRaw !== "" && stockRaw != null) {
      const stockNum = Number(stockRaw);
      if (!Number.isFinite(stockNum)) errs.stock = "El stock debe ser un número.";
      else if (stockNum < 0) errs.stock = "El stock no puede ser negativo.";
    }

    return errs;
  }

  function openCreate() {
    setMode("create");
    resetForm();
    setFieldErrors({});
    setError("");
    setOpen(true);
  }

  function openEdit(p) {
    setMode("edit");
    setForm({
      id_producto: p.id_producto,
      nombre: p.nombre ?? "",
      precio: p.precio != null ? String(p.precio) : "",
      stock: p.stock != null ? String(p.stock) : "",
      descripcion: p.descripcion ?? "",
      id_categoria: p.id_categoria != null ? String(p.id_categoria) : "",
      id_proveedor: p.id_proveedor != null ? String(p.id_proveedor) : "",
    });
    setFieldErrors({});
    setError("");
    setOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setOpen(false);
  }

  function onChange(e) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      const errs = validateAll(next);
      setFieldErrors(errs);
      return next;
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const errs = validateAll(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError("Revisa los campos marcados.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        precio: Number(form.precio),
        id_categoria: Number(form.id_categoria),
        id_proveedor: Number(form.id_proveedor),
        ...(form.stock === "" ? {} : { stock: Number(form.stock) }),
        ...(form.descripcion.trim() === ""
          ? {}
          : { descripcion: form.descripcion.trim() }),
      };

      if (mode === "create") {
        await api.post("/api/productos/nuevo", payload);
      } else {
        await api.put(`/api/productos/${form.id_producto}`, payload);
      }

      setOpen(false);
      await load();
    } catch (e2) {
      console.error("Error guardando producto:", e2);

      const status = e2?.response?.status;
      const data = e2?.response?.data;

      let details = "";
      if (typeof data === "string") details = data;
      else if (data?.message) details = data.message;
      else if (data) details = JSON.stringify(data);
      else details = e2?.message || "Error desconocido";

      setError(`No se pudo guardar (HTTP ${status ?? "?"}). Detalle: ${details}`);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(p) {
    setError("");
    const ok = window.confirm(
      `¿Eliminar el producto "${p.nombre}" (ID ${p.id_producto})?`
    );
    if (!ok) return;

    try {
      await api.delete(`/api/productos/${p.id_producto}`);
      await load();
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        "No se pudo eliminar el producto. Revisa backend."
      );
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ margin: 0 }}>Productos</h2>
          {loading || saving ? (
            <StatusPill>{saving ? "Guardando…" : "Cargando…"}</StatusPill>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={load} disabled={loading || saving} variant="default">
            Recargar
          </Btn>
          <Btn onClick={openCreate} disabled={saving} variant="primary">
            + Nuevo
          </Btn>
        </div>
      </div>

      {error ? (
        <div
          style={{
            background: "#ffe8e8",
            border: "1px solid #ffb3b3",
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div>Cargando...</div>
      ) : items.length === 0 ? (
        <div>No hay productos.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: 70 }} />
              <col style={{ width: 260 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 320 }} />
              <col style={{ width: 220 }} />
            </colgroup>

            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th style={{ textAlign: "right" }}>Precio</Th>
                <Th style={{ textAlign: "right" }}>Stock</Th>
                <Th style={{ paddingLeft: 16 }}>Descripción</Th>
                <Th style={{ width: 220 }}>Acciones</Th>
              </tr>
            </thead>

            <tbody>
              {items.map((p) => (
                <tr key={p.id_producto}>
                  <Td>{p.id_producto}</Td>
                  <Td style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.nombre}
                  </Td>
                  <Td style={{ textAlign: "right" }}>{formatPrice(p.precio)}</Td>
                  <Td style={{ textAlign: "right" }}>
                    {p.stock == null ? "-" : formatInt(p.stock)}
                  </Td>
                  <Td
                    style={{
                      paddingLeft: 16,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {p.descripcion ?? "-"}
                  </Td>
                  <Td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn
                        onClick={() => openEdit(p)}
                        disabled={saving}
                        variant="default"
                      >
                        Editar
                      </Btn>
                      <Btn
                        onClick={() => onDelete(p)}
                        disabled={saving}
                        variant="danger"
                      >
                        Eliminar
                      </Btn>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open ? (
        <Modal title={title} onClose={closeModal}>
          <form onSubmit={onSubmit}>
            <div style={{ display: "grid", gap: 10 }}>
              <Field label="Nombre *" error={fieldErrors.nombre}>
                <TextInput
                  name="nombre"
                  value={form.nombre}
                  onChange={onChange}
                  placeholder="Ej: Portátil Lenovo"
                  autoFocus
                />
              </Field>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <Field label="Categoría *" error={fieldErrors.id_categoria}>
                  <Select
                    name="id_categoria"
                    value={form.id_categoria}
                    onChange={onChange}
                  >
                    <option value="">Selecciona…</option>
                    {categorias.map((c) => (
                      <option key={c.id_categoria} value={c.id_categoria}>
                        {c.nombre}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Proveedor *" error={fieldErrors.id_proveedor}>
                  <Select
                    name="id_proveedor"
                    value={form.id_proveedor}
                    onChange={onChange}
                  >
                    <option value="">Selecciona…</option>
                    {proveedores.map((p) => (
                      <option key={p.id_proveedor} value={p.id_proveedor}>
                        {p.nombre}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <Field label="Precio *" error={fieldErrors.precio}>
                  <TextInput
                    name="precio"
                    value={form.precio}
                    onChange={onChange}
                    placeholder="Ej: 199.99"
                    inputMode="decimal"
                  />
                </Field>

                <Field label="Stock" error={fieldErrors.stock}>
                  <TextInput
                    name="stock"
                    value={form.stock}
                    onChange={onChange}
                    placeholder="Ej: 10"
                    inputMode="numeric"
                  />
                </Field>
              </div>

              <Field label="Descripción">
                <TextArea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={onChange}
                  placeholder="Opcional"
                  rows={3}
                />
              </Field>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <Btn
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  variant="default"
                >
                  Cancelar
                </Btn>
                <Btn
                  type="submit"
                  disabled={saving || formHasErrors}
                  variant="primary"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </Btn>
              </div>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

function Th({ children, style }) {
  return (
    <th
      style={{
        textAlign: "left",
        borderBottom: "1px solid #ddd",
        padding: "10px 8px",
        ...style,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }) {
  return (
    <td
      style={{
        borderBottom: "1px solid #eee",
        padding: "10px 8px",
        verticalAlign: "top",
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, opacity: 0.8 }}>{label}</span>
      {children}
      {error ? <div style={{ color: "#b91c1c", fontSize: 12 }}>{error}</div> : null}
    </label>
  );
}

const controlStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d0d7de",
  outline: "none",
  fontSize: 14,
};

function TextInput(props) {
  return (
    <input
      {...props}
      style={controlStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#111827";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#d0d7de";
        props.onBlur?.(e);
      }}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      style={controlStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#111827";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#d0d7de";
        props.onBlur?.(e);
      }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={controlStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#111827";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#d0d7de";
        props.onBlur?.(e);
      }}
    />
  );
}

function Btn({ variant = "default", children, style, ...props }) {
  const base = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #d0d7de",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    lineHeight: 1,
    transition:
      "transform 0.02s ease, background 0.15s ease, border-color 0.15s ease",
  };

  const variants = {
    default: { background: "#fff" },
    primary: {
      background: "#111827",
      borderColor: "#111827",
      color: "#fff",
    },
    danger: { background: "#ef4444", borderColor: "#ef4444", color: "#fff" },
    ghost: { background: "transparent" },
  };

  const v = variants[variant] || variants.default;

  return (
    <button
      {...props}
      style={{
        ...base,
        ...v,
        opacity: props.disabled ? 0.6 : 1,
        cursor: props.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      onMouseDown={(e) => {
        if (!props.disabled) e.currentTarget.style.transform = "scale(0.98)";
        props.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        props.onMouseUp?.(e);
      }}
      onMouseEnter={(e) => {
        if (props.disabled) return;
        if (variant === "primary") e.currentTarget.style.background = "#0b1220";
        else if (variant === "danger") e.currentTarget.style.background = "#dc2626";
        else e.currentTarget.style.background = "#f3f4f6";
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        if (variant === "primary") e.currentTarget.style.background = "#111827";
        else if (variant === "danger") e.currentTarget.style.background = "#ef4444";
        else if (variant === "ghost") e.currentTarget.style.background = "transparent";
        else e.currentTarget.style.background = "#fff";
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}

function IconBtn({ children, ...props }) {
  return (
    <Btn
      {...props}
      style={{
        padding: "8px 10px",
        borderRadius: 10,
        ...props.style,
      }}
    >
      {children}
    </Btn>
  );
}

function Modal({ title, children, onClose }) {
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          background: "white",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <strong>{title}</strong>
          <IconBtn type="button" onClick={onClose} variant="ghost">
            ✕
          </IconBtn>
        </div>

        <div style={{ padding: 14 }}>{children}</div>
      </div>
    </div>
  );
}