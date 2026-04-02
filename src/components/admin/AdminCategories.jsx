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

export default function AdminCategories() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("create"); // create | edit
    const [form, setForm] = useState({ id_categoria: null, nombre: "" });
    const [fieldError, setFieldError] = useState("");

    const title = useMemo(
        () => (mode === "edit" ? "Editar categoría" : "Nueva categoría"),
        [mode]
    );

    async function load() {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/api/categorias");
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            const data = e?.response?.data;
            const msg =
                (typeof data === 'string' ? data : null) ||
                data?.message ||
                data?.error ||
                e?.message ||
                "No se pudieron cargar las categorías.";
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
        setForm({ id_categoria: null, nombre: "" });
        setFieldError("");
        setError("");
        setOpen(true);
    }

    function openEdit(c) {
        setMode("edit");
        setForm({ id_categoria: c.id_categoria, nombre: c.nombre ?? "" });
        setFieldError("");
        setError("");
        setOpen(true);
    }

    function closeModal() {
        if (saving) return;
        setOpen(false);
    }

    function validate(nombre) {
        const n = (nombre ?? "").trim();
        if (!n) return "El nombre es obligatorio.";
        if (n.length > 50) return "Máximo 50 caracteres.";
        return "";
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        const err = validate(form.nombre);
        setFieldError(err);
        if (err) return;

        setSaving(true);
        try {
            const payload = { nombre: form.nombre.trim() };

            if (mode === "create") {
                await api.post("/api/categorias", payload);
            } else {
                await api.put(`/api/categorias/${form.id_categoria}`, payload);
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
                "Error guardando categoría";
            setError(`No se pudo guardar. Detalle: ${msg}`);
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(c) {
        setError("");
        const ok = window.confirm(
            `¿Eliminar la categoría "${c.nombre}" (ID ${c.id_categoria})?`
        );
        if (!ok) return;

        try {
            await api.delete(`/api/categorias/${c.id_categoria}`);
            await load();
        } catch (e) {
            const status = e?.response?.status;
            const msg =
                e?.response?.data?.message ||
                "No se pudo eliminar la categoría.";

            if (status === 409) {
                // conflicto por productos asociados -> aviso suave
                setError(`⚠️ ${msg}`);
            } else {
                setError(msg);
            }
        }
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">Categorías</h2>
                    {loading || saving ? (
                        <StatusPill>{saving ? "Guardando…" : "Cargando…"}</StatusPill>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                    <Btn onClick={load} disabled={loading || saving} variant="default">
                        Recargar
                    </Btn>
                    <Btn onClick={openCreate} disabled={saving} variant="primary">
                        + Nueva
                    </Btn>
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
                    No hay categorías.
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="max-h-[min(70vh,640px)] overflow-auto">
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                tableLayout: "fixed",
                            }}
                        >
                            <colgroup>
                                <col style={{ width: 90 }} />
                                <col />
                                <col style={{ width: 200 }} />
                            </colgroup>

                            <thead>
                                <tr>
                                    <Th>ID</Th>
                                    <Th>Nombre</Th>
                                    <Th>Acciones</Th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((c) => (
                                    <tr key={c.id_categoria}>
                                        <Td>{c.id_categoria}</Td>
                                        <Td
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {c.nombre}
                                        </Td>
                                        <Td>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <Btn
                                                    onClick={() => openEdit(c)}
                                                    disabled={saving}
                                                    variant="default"
                                                >
                                                    Editar
                                                </Btn>
                                                <Btn
                                                    onClick={() => onDelete(c)}
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
                </div>
            )}

            {open ? (
                <Modal title={title} onClose={closeModal}>
                    <form onSubmit={onSubmit}>
                        <div style={{ display: "grid", gap: 10 }}>
                            <Field label="Nombre *" error={fieldError}>
                                <TextInput
                                    value={form.nombre}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setForm((p) => ({ ...p, nombre: v }));
                                        setFieldError(validate(v));
                                    }}
                                    placeholder="Ej: Informática"
                                    autoFocus
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
                                <Btn type="submit" disabled={saving || !!fieldError} variant="primary">
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
            className="sticky top-0 z-10 border-b border-border bg-muted/95 px-3 py-2.5 text-left text-sm font-medium text-foreground backdrop-blur-sm"
            style={style}
        >
            {children}
        </th>
    );
}

function Td({ children, style }) {
    return (
        <td
            className="border-b border-border/60 px-3 py-2.5 align-middle text-sm"
            style={style}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = "#111827")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d0d7de")}
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
    };

    const variants = {
        default: { background: "#fff" },
        primary: { background: "#111827", borderColor: "#111827", color: "#fff" },
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
                    width: "min(620px, 100%)",
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