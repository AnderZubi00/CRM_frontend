import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

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

export default function AdminSuppliers() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("create"); // create | edit
    const [form, setForm] = useState({
        id_proveedor: null,
        nombre: "",
        telefono: "",
        correo: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const title = useMemo(
        () => (mode === "edit" ? "Editar proveedor" : "Nuevo proveedor"),
        [mode]
    );

    function validate(next = form) {
        const errs = {};
        const nombre = (next.nombre ?? "").trim();
        const telefono = (next.telefono ?? "").trim();
        const correo = (next.correo ?? "").trim();

        if (!nombre) errs.nombre = "El nombre es obligatorio.";
        else if (nombre.length > 50) errs.nombre = "Máximo 50 caracteres.";

        if (telefono && telefono.length > 20) errs.telefono = "Máximo 20 caracteres.";
        if (correo && correo.length > 100) errs.correo = "Máximo 100 caracteres.";

        // validación ligera de email (si hay)
        if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            errs.correo = "Correo no válido.";
        }

        return errs;
    }

    async function load() {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/api/proveedores");
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            setError(
                e?.response?.data?.message || "No se pudieron cargar los proveedores."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setMode("create");
        setForm({ id_proveedor: null, nombre: "", telefono: "", correo: "" });
        setFieldErrors({});
        setError("");
        setOpen(true);
    }

    function openEdit(p) {
        setMode("edit");
        setForm({
            id_proveedor: p.id_proveedor,
            nombre: p.nombre ?? "",
            telefono: p.telefono ?? "",
            correo: p.correo ?? "",
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
            setFieldErrors(validate(next));
            return next;
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        const errs = validate(form);
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSaving(true);
        try {
            const payload = {
                nombre: form.nombre.trim(),
                telefono: form.telefono.trim(),
                correo: form.correo.trim(),
            };

            // manda null si está vacío para que el backend lo guarde como null
            if (!payload.telefono) payload.telefono = null;
            if (!payload.correo) payload.correo = null;

            if (mode === "create") {
                await api.post("/api/proveedores", payload);
            } else {
                await api.put(`/api/proveedores/${form.id_proveedor}`, payload);
            }

            setOpen(false);
            await load();
        } catch (e2) {
            const msg =
                e2?.response?.data?.message ||
                e2?.response?.data ||
                e2?.message ||
                "Error guardando proveedor";
            setError(`No se pudo guardar. Detalle: ${msg}`);
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(p) {
        setError("");
        const ok = window.confirm(
            `¿Eliminar el proveedor "${p.nombre}" (ID ${p.id_proveedor})?`
        );
        if (!ok) return;

        try {
            await api.delete(`/api/proveedores/${p.id_proveedor}`);
            await load();
        } catch (e) {
            const status = e?.response?.status;
            const msg =
                e?.response?.data?.message ||
                "No se pudo eliminar el proveedor.";

            if (status === 409) setError(`⚠️ ${msg}`);
            else setError(msg);
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
                    <h2 style={{ margin: 0 }}>Proveedores</h2>
                    {loading || saving ? (
                        <StatusPill>{saving ? "Guardando…" : "Cargando…"}</StatusPill>
                    ) : null}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={load} disabled={loading || saving} style={btnDefault(loading || saving)}>
                        Recargar
                    </button>
                    <button type="button" onClick={openCreate} disabled={saving} style={btnPrimary(saving)}>
                        + Nuevo
                    </button>
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
                <div>No hay proveedores.</div>
            ) : (
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 16,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                            <colgroup>
                                <col style={{ width: 90 }} />
                                <col style={{ width: 260 }} />
                                <col style={{ width: 180 }} />
                                <col />
                                <col style={{ width: 220 }} />
                            </colgroup>

                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Nombre</th>
                                    <th style={thStyle}>Teléfono</th>
                                    <th style={thStyle}>Correo</th>
                                    <th style={thStyle}>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((p) => (
                                    <tr key={p.id_proveedor}>
                                        <td style={tdStyle}>{p.id_proveedor}</td>
                                        <td style={tdStyle}>{p.nombre}</td>
                                        <td style={tdStyle}>{p.telefono ?? "-"}</td>
                                        <td style={{ ...tdStyle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {p.correo ?? "-"}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button type="button" onClick={() => openEdit(p)} disabled={saving} style={btnDefault(saving)}>
                                                    Editar
                                                </button>
                                                <button type="button" onClick={() => onDelete(p)} disabled={saving} style={btnDanger(saving)}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
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
                                <input
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={onChange}
                                    placeholder="Ej: TechDistribuciones SL"
                                    autoFocus
                                    style={controlStyle}
                                />
                            </Field>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <Field label="Teléfono" error={fieldErrors.telefono}>
                                    <input
                                        name="telefono"
                                        value={form.telefono}
                                        onChange={onChange}
                                        placeholder="+34 910 123 456"
                                        style={controlStyle}
                                    />
                                </Field>

                                <Field label="Correo" error={fieldErrors.correo}>
                                    <input
                                        name="correo"
                                        value={form.correo}
                                        onChange={onChange}
                                        placeholder="ventas@proveedor.es"
                                        style={controlStyle}
                                    />
                                </Field>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                                <button type="button" onClick={closeModal} disabled={saving} style={btnDefault(saving)}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving || Object.keys(fieldErrors).length > 0} style={btnPrimary(saving || Object.keys(fieldErrors).length > 0)}>
                                    {saving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>
            ) : null}
        </div>
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

const thStyle = {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
};

const tdStyle = {
    padding: "10px 12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
};

const controlStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d0d7de",
    outline: "none",
    fontSize: 14,
};

function btnDefault(disabled) {
    return {
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #d0d7de",
        background: "#fff",
        fontWeight: 600,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
    };
}

function btnPrimary(disabled) {
    return {
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #111827",
        background: "#111827",
        color: "#fff",
        fontWeight: 600,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
    };
}

function btnDanger(disabled) {
    return {
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ef4444",
        background: "#ef4444",
        color: "#fff",
        fontWeight: 600,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
    };
}

function Modal({ title, children, onClose }) {
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
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 10,
                            border: "1px solid transparent",
                            background: "transparent",
                            cursor: "pointer",
                            fontWeight: 700,
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ padding: 14 }}>{children}</div>
            </div>
        </div>
    );
}