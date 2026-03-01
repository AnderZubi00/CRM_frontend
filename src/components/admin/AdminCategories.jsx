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
            setError(
                e?.response?.data?.message || "No se pudieron cargar las categorías."
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
            const msg =
                e2?.response?.data?.message ||
                e2?.response?.data ||
                e2?.message ||
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
                    <h2 style={{ margin: 0 }}>Categorías</h2>
                    {loading || saving ? (
                        <StatusPill>{saving ? "Guardando…" : "Cargando…"}</StatusPill>
                    ) : null}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
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
                <div>No hay categorías.</div>
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
            style={{
                textAlign: "left",
                borderBottom: "1px solid #e5e7eb",
                padding: "10px 12px",
                background: "#f9fafb",
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
                padding: "10px 12px",
                verticalAlign: "middle",
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