import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { cn } from "@/lib/utils";

function StatusPill({ children }) {
    return (
        <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
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
            const data = e?.response?.data;
            const msg =
                (typeof data === 'string' ? data : null) ||
                data?.message ||
                data?.error ||
                e?.message ||
                "No se pudieron cargar los proveedores.";
            setError(msg);
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
            const data = e2?.response?.data;
            const msg =
                (typeof data === 'string' ? data : null) ||
                data?.message ||
                data?.error ||
                e2?.message ||
                (e2?.response ? null : "Comprueba que el servidor esté en marcha y la URL en .env (VITE_API_URL).") ||
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
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">Proveedores</h2>
                    {loading || saving ? (
                        <StatusPill>{saving ? "Guardando…" : "Cargando…"}</StatusPill>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
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
                    className={cn(
                        "mb-4 rounded-lg border p-3 text-sm whitespace-pre-wrap break-words",
                        error.startsWith("⚠️")
                            ? "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100"
                            : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100"
                    )}
                >
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="text-muted-foreground">Cargando...</div>
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
                    No hay proveedores.
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="max-h-[min(70vh,640px)] overflow-auto">
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
                                    <th className="sticky top-0 z-10 border-b border-border bg-muted/95 px-3 py-2.5 text-left text-sm font-medium text-foreground backdrop-blur-sm">
                                        ID
                                    </th>
                                    <th className="sticky top-0 z-10 border-b border-border bg-muted/95 px-3 py-2.5 text-left text-sm font-medium text-foreground backdrop-blur-sm">
                                        Nombre
                                    </th>
                                    <th className="sticky top-0 z-10 border-b border-border bg-muted/95 px-3 py-2.5 text-left text-sm font-medium text-foreground backdrop-blur-sm">
                                        Teléfono
                                    </th>
                                    <th className="sticky top-0 z-10 border-b border-border bg-muted/95 px-3 py-2.5 text-left text-sm font-medium text-foreground backdrop-blur-sm">
                                        Correo
                                    </th>
                                    <th className="sticky top-0 z-10 border-b border-border bg-muted/95 px-3 py-2.5 text-left text-sm font-medium text-foreground backdrop-blur-sm">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((p) => (
                                    <tr key={p.id_proveedor}>
                                        <td className="border-b border-border/60 px-3 py-2.5 align-middle text-sm">{p.id_proveedor}</td>
                                        <td className="border-b border-border/60 px-3 py-2.5 align-middle text-sm">{p.nombre}</td>
                                        <td className="border-b border-border/60 px-3 py-2.5 align-middle text-sm">{p.telefono ?? "-"}</td>
                                        <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-border/60 px-3 py-2.5 align-middle text-sm">
                                            {p.correo ?? "-"}
                                        </td>
                                        <td className="border-b border-border/60 px-3 py-2.5 align-middle text-sm">
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
        border: "1px solid hsl(var(--primary))",
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
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