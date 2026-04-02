import { useCallback, useEffect, useMemo, useState } from "react";
import api, { getApiBaseURL } from "../../services/api";
import './AdminProducts.css';

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
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export default function AdminProducts({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const initialPrefs = (() => {
    try {
      const raw = localStorage.getItem("adminProductsPrefs");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const [q, setQ] = useState(typeof initialPrefs.q === "string" ? initialPrefs.q : "");
  const [catFilter, setCatFilter] = useState(
    typeof initialPrefs.catFilter === "string" ? initialPrefs.catFilter : ""
  );
  const [provFilter, setProvFilter] = useState(
    typeof initialPrefs.provFilter === "string" ? initialPrefs.provFilter : ""
  );
  const [sortKey, setSortKey] = useState(
    typeof initialPrefs.sortKey === "string" ? initialPrefs.sortKey : "id"
  );
  const [sortDir, setSortDir] = useState(
    initialPrefs.sortDir === "asc" || initialPrefs.sortDir === "desc"
      ? initialPrefs.sortDir
      : "asc"
  );
  const [pageSize] = useState(25);
  const [page, setPage] = useState(1);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminProductsPrefs");
      if (!raw) return;
      const prefs = JSON.parse(raw);

      if (typeof prefs.q === "string") setQ(prefs.q);
      if (typeof prefs.catFilter === "string") setCatFilter(prefs.catFilter);
      if (typeof prefs.provFilter === "string") setProvFilter(prefs.provFilter);
      if (typeof prefs.sortKey === "string") setSortKey(prefs.sortKey);
      if (prefs.sortDir === "asc" || prefs.sortDir === "desc") setSortDir(prefs.sortDir);

    } catch {
      // si está corrupto, lo ignoramos
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(
        "adminProductsPrefs",
        JSON.stringify({ q, catFilter, provFilter, sortKey, sortDir })
      );
    } catch {
      // almacenamiento local opcional
    }
  }, [q, catFilter, provFilter, sortKey, sortDir]);
  const filteredItems = useMemo(() => {
    const query = q.trim().toLowerCase();

    const out = items.filter((p) => {
      if (catFilter && String(p.id_categoria) !== String(catFilter)) return false;
      if (provFilter && String(p.id_proveedor) !== String(provFilter)) return false;

      if (!query) return true;

      const n = (p.nombre ?? "").toLowerCase();
      return n.includes(query);
    });

    const dir = sortDir === "asc" ? 1 : -1;

    out.sort((a, b) => {
      switch (sortKey) {
        case "nombre": {
          const A = (a.nombre ?? "").toLowerCase();
          const B = (b.nombre ?? "").toLowerCase();
          return A.localeCompare(B) * dir;
        }
        case "precio": {
          const A = Number(a.precio ?? 0);
          const B = Number(b.precio ?? 0);
          return (A - B) * dir;
        }
        case "stock": {
          const A = Number(a.stock ?? -1);
          const B = Number(b.stock ?? -1);
          return (A - B) * dir;
        }
        case "id":
        default: {
          const A = Number(a.id_producto ?? 0);
          const B = Number(b.id_producto ?? 0);
          return (A - B) * dir;
        }
      }
    });

    return out;
  }, [items, q, catFilter, provFilter, sortKey, sortDir]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredItems.length / pageSize));
  }, [filteredItems.length, pageSize]);

  useEffect(() => {
    // Si cambian filtros/orden/tamaño, aseguramos page válida
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [q, catFilter, provFilter]);

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const categoriaMap = useMemo(
    () => new Map(categorias.map((c) => [Number(c.id_categoria), c.nombre])),
    [categorias]
  );

  const proveedorMap = useMemo(
    () => new Map(proveedores.map((p) => [Number(p.id_proveedor), p.nombre])),
    [proveedores]
  );

  // Modal / form
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id_producto: null,
    nombre: "",
    precio: "",
    stock: "",
    id_categoria: "",
    id_proveedor: "",
    imagen_url: "",
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
      const [catRes, provRes] = await Promise.all([
        api.get("/api/categorias"),
        api.get("/api/proveedores"),
      ]);

      setCategorias(Array.isArray(catRes.data) ? catRes.data : []);
      setProveedores(Array.isArray(provRes.data) ? provRes.data : []);
    } catch (e) {
      console.error("Error cargando lookups:", e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Error desconocido cargando categorías/proveedores";
      setError(`No se pudieron cargar categorías/proveedores. Detalle: ${msg}`);
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
      id_categoria: "",
      id_proveedor: "",
      imagen_url: "",
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
    loadLookups();
    setOpen(true);
  }

  function openEdit(p) {
    setMode("edit");
    setForm({
      id_producto: p.id_producto,
      nombre: p.nombre ?? "",
      precio: p.precio != null ? String(p.precio) : "",
      stock: p.stock != null ? String(p.stock) : "",
      id_categoria: p.id_categoria != null ? String(p.id_categoria) : "",
      id_proveedor: p.id_proveedor != null ? String(p.id_proveedor) : "",
      imagen_url: p.imagen_url ?? "",
    });
    setFieldErrors({});
    setError("");
    loadLookups();
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

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes iniciar sesión para subir imágenes.");
        return;
      }
      const formData = new FormData();
      formData.append("imagen", file);
      formData.append("token", token);
      const res = await api.post("/api/productos/upload-imagen", formData);
      const url = res.data?.url;
      if (!url) {
        setError("No se recibió la URL de la imagen desde el servidor.");
        return;
      }
      setForm((prev) => ({ ...prev, imagen_url: url }));
    } catch (e2) {
      const data = e2?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        data?.error ||
        e2?.message ||
        "Error subiendo la imagen. Comprueba el tamaño y formato.";
      setError(`No se pudo subir la imagen. Detalle: ${msg}`);
    }
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
        stock: form.stock === "" || form.stock == null ? 0 : Number(form.stock),
        imagen_url: form.imagen_url || null,
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
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "No se pudo eliminar el producto. Revisa backend.";

      // 409 = conflicto (lo tratamos como aviso suave)
      if (status === 409) setError(`⚠️ ${msg}`);
      else setError(String(msg));
    }
  }
  function toggleSort(key) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir(key === "precio" || key === "stock" ? "desc" : "asc");
      return;
    }

    // misma columna -> alternar
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  function exportCsv() {
    const rows = filteredItems.map((p) => ({
      ID: p.id_producto ?? "",
      Nombre: p.nombre ?? "",
      Categoria: categoriaMap.get(Number(p.id_categoria)) ?? "",
      Proveedor: proveedorMap.get(Number(p.id_proveedor)) ?? "",
      Precio: formatPrice(p.precio),
      Stock: p.stock == null ? "" : formatInt(p.stock),
    }));

    const headers = Object.keys(rows[0] || {
      ID: "", Nombre: "", Categoria: "", Proveedor: "", Precio: "", Stock: ""
    });

    const escape = (v) => {
      const s = String(v ?? "");
      const needs = /[",;\n]/.test(s);
      const safe = s.replace(/"/g, '""');
      return needs ? `"${safe}"` : safe;
    };

    const csv = [
      headers.join(";"),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(";")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `productos_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-products rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Productos</h2>
          {loading || saving ? (
            <StatusPill>{saving ? "Guardando…" : "Cargando…"}</StatusPill>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Btn onClick={load} disabled={loading || saving} variant="default">
            Actualizar inventario
          </Btn>
          <Btn onClick={exportCsv} disabled={loading || saving || filteredItems.length === 0} variant="default">
            Exportar CSV
          </Btn>
          <Btn onClick={openCreate} disabled={saving} variant="primary">
            + Nuevo
          </Btn>
        </div>
      </div>

      {onNavigate && (categorias.length === 0 || proveedores.length === 0) && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
          <strong className="font-semibold">
            Para crear productos necesitas al menos una categoría y un proveedor.
          </strong>
          <div className="mt-3 flex flex-wrap gap-2">
            {categorias.length === 0 && (
              <Btn type="button" onClick={() => onNavigate("categories")} variant="primary">
                Ir a Categorías
              </Btn>
            )}
            {proveedores.length === 0 && (
              <Btn type="button" onClick={() => onNavigate("Suppliers")} variant="primary">
                Ir a Proveedores
              </Btn>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Buscar Producto</span>
          <TextInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre o descripción..."
          />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Categoría</span>
          <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Proveedor</span>
          <Select value={provFilter} onChange={(e) => setProvFilter(e.target.value)}>
            <option value="">Todos</option>
            {proveedores.map((p) => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {p.nombre}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.75 }}>
          Mostrando <strong>{filteredItems.length}</strong> de <strong>{items.length}</strong> productos
        </div>

        <Btn
          variant="default"
          type="button"
          onClick={() => {
            setQ("");
            setCatFilter("");
            setProvFilter("");
          }}
          disabled={!q && !catFilter && !provFilter}
        >
          Limpiar filtros
        </Btn>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 13, opacity: 0.8 }}>
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>

          <Btn
            type="button"
            variant="default"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Anterior
          </Btn>

          <Btn
            type="button"
            variant="default"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </Btn>
        </div>
      </div>

      {error ? (
        <div
          style={{
            background: error.startsWith("⚠️") ? "#fff7ed" : "#ffe8e8",
            border: error.startsWith("⚠️") ? "1px solid #fdba74" : "1px solid #ffb3b3",
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
        <div className="table-card">
          <div className="table-scroll">
            <table
              className={
                sortKey === "id"
                  ? "col-id"
                  : sortKey === "nombre"
                    ? "col-nombre"
                    : sortKey === "precio"
                      ? "col-precio"
                      : sortKey === "stock"
                        ? "col-stock"
                        : ""
              }
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: 70 }} />
                <col style={{ width: 220 }} />
                <col style={{ width: 140 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 180 }} />
              </colgroup>

              <thead>
                <tr>
                  <th
                    onClick={() => toggleSort("id")}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      padding: "10px 8px",
                      cursor: "pointer",
                      userSelect: "none",
                      background: sortKey === "id" ? "#f3f4f6" : "#f9fafb",
                    }}
                  >
                    ID{sortKey === "id" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </th>

                  <th
                    onClick={() => toggleSort("nombre")}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      padding: "10px 8px",
                      cursor: "pointer",
                      userSelect: "none",
                      background: sortKey === "nombre" ? "#f3f4f6" : "#f9fafb",
                    }}
                  >
                    Nombre{sortKey === "nombre" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </th>

                  <Th>Categoría</Th>
                  <Th>Proveedor</Th>

                  <th
                    onClick={() => toggleSort("precio")}
                    style={{
                      textAlign: "right",
                      borderBottom: "1px solid #ddd",
                      padding: "10px 8px",
                      cursor: "pointer",
                      userSelect: "none",
                      background: sortKey === "precio" ? "#f3f4f6" : "#f9fafb",
                    }}
                  >
                    Precio{sortKey === "precio" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </th>

                  <th
                    onClick={() => toggleSort("stock")}
                    style={{
                      textAlign: "right",
                      borderBottom: "1px solid #ddd",
                      padding: "10px 8px",
                      cursor: "pointer",
                      userSelect: "none",
                      background: sortKey === "stock" ? "#f3f4f6" : "#f9fafb",
                    }}
                  >
                    Stock{sortKey === "stock" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </th>

                  <Th style={{ paddingLeft: 16 }}>Acciones</Th>
                </tr>
              </thead>

              <tbody>
                {pagedItems.map((p) => (
                  <tr key={p.id_producto}>
                    <Td>{p.id_producto}</Td>

                    <Td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.nombre}
                    </Td>

                    <Td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {categoriaMap.get(Number(p.id_categoria)) ?? `#${p.id_categoria ?? "-"}`}
                    </Td>

                    <Td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {proveedorMap.get(Number(p.id_proveedor)) ?? `#${p.id_proveedor ?? "-"}`}
                    </Td>

                    <Td style={{ textAlign: "right" }}>{formatPrice(p.precio)}</Td>

                    <Td style={{ textAlign: "right" }}>
                      {p.stock == null ? "-" : formatInt(p.stock)}
                    </Td>

                    <Td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn onClick={() => openEdit(p)} disabled={saving} variant="default">
                          Editar
                        </Btn>
                        <Btn onClick={() => onDelete(p)} disabled={saving} variant="danger">
                          Eliminar
                        </Btn>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                    placeholder="Ej: 10 (opcional, por defecto 0)"
                    inputMode="numeric"
                  />
                </Field>
              </div>

              <Field label="Imagen del producto (opcional)">
                <div style={{ display: "grid", gap: 6 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {form.imagen_url && (
                    <img
                      src={(getApiBaseURL() || "").replace(/\/$/, "") + form.imagen_url}
                      alt="Vista previa"
                      style={{
                        maxWidth: 160,
                        maxHeight: 120,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
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

function Th({ children, style, ...props }) {
  return (
    <th
      {...props}
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