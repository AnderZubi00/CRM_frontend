import { Fragment, useEffect, useState } from "react";
import { getUsers, createUser } from "@/services/api";
import api, { getCurrentUser } from "@/services/api";
import PageHeader from "@/components/shell/PageHeader";

function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [openGroups, setOpenGroups] = useState({ 1: true, 2: false, 3: false });

  const currentUser = getCurrentUser?.() || null;
  const currentUserId = currentUser?.id_usuario ?? currentUser?.id ?? null;

  // Modal
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // "create" | "edit" | null
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Form común
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  // SOLO para CREAR (Admin o Cliente)
  const [idRol, setIdRol] = useState("3");

  // Campos adicionales (crear y/o editar)
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");

  // Usuario en edición
  const [editingUser, setEditingUser] = useState(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      const list = Array.isArray(data) ? data : data?.data || data?.rows || [];

      const roleOrder = { 1: 0, 2: 1, 3: 2 };

      const sorted = [...list].sort((a, b) => {
        const ra = Number(a.id_rol ?? a.rol);
        const rb = Number(b.id_rol ?? b.rol);

        const oa = roleOrder[ra] ?? 99;
        const ob = roleOrder[rb] ?? 99;

        if (oa !== ob) return oa - ob;

        const ea = String(a.correo ?? a.email ?? "").toLowerCase();
        const eb = String(b.correo ?? b.email ?? "").toLowerCase();
        return ea.localeCompare(eb);
      });

      setUsers(sorted);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Error cargando usuarios";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetFormCreate() {
    setCorreo("");
    setContrasena("");
    setIdRol("3");
    setNombre("");
    setApellido("");
    setTelefono("");
    setFormError("");
  }

  function closeModal() {
    if (saving) return;
    setOpen(false);
    setModalMode(null);
    setEditingUser(null);
    setFormError("");
    setCorreo("");
    setContrasena("");
    setNombre("");
    setApellido("");
    setTelefono("");
  }

  // --------- CREATE ----------
  async function handleCreate(e) {
    e.preventDefault();

    if (!correo.trim()) return setFormError("El correo es obligatorio.");
    if (!contrasena.trim()) return setFormError("La contraseña es obligatoria.");
    if (contrasena.trim().length < 6)
      return setFormError("La contraseña debe tener al menos 6 caracteres.");

    // Si quieres que sean obligatorios en el alta, descomenta:
    // if (!nombre.trim()) return setFormError("El nombre es obligatorio.");
    // if (!apellido.trim()) return setFormError("El apellido es obligatorio.");

    const rol = Number(idRol);

    if (rol === 2) {
      return setFormError(
        "La creación de usuarios Empleado se hace desde “Empleados” → “Crear usuario (Empleado)”."
      );
    }

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        correo: correo.trim(),
        contraseña: contrasena, // tu backend lo exige así (con ñ)
        id_rol: rol,
        id_empleado: null,
        // nuevos campos
        nombre: nombre.trim() || null,
        apellido: apellido.trim() || null,
        telefono: telefono.trim() || null,
      };

      await createUser(payload);

      closeModal();
      resetFormCreate();
      await loadUsers();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Error creando usuario";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  }

  // --------- EDIT ----------
  function handleEdit(user) {
    const normalized = {
      ...user,
      id_usuario: user.id_usuario ?? user.id,
      correo: user.correo ?? user.email ?? "",
      nombre: user.nombre ?? "",
      apellido: user.apellido ?? "",
      telefono: user.telefono ?? "",
    };

    setEditingUser(normalized);

    // en edición mostramos estos valores en inputs controlados
    setCorreo(normalized.correo);
    setContrasena(""); // opcional
    setNombre(normalized.nombre);
    setApellido(normalized.apellido);
    setTelefono(normalized.telefono);

    setFormError("");
    setModalMode("edit");
    setOpen(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editingUser?.id_usuario) return setFormError("No se encontró el ID del usuario.");

    // Si quieres obligarlos en edición:
    // if (!nombre.trim() || !apellido.trim()) return setFormError("Nombre y apellido no pueden estar vacíos.");

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        nombre: nombre.trim() || null,
        apellido: apellido.trim() || null,
        telefono: telefono.trim() || null,
      };

      if (contrasena.trim()) {
        if (contrasena.trim().length < 6) {
          setSaving(false);
          return setFormError("La contraseña debe tener al menos 6 caracteres.");
        }
        payload["contraseña"] = contrasena;
      }

      await api.put(`/api/users/${editingUser.id_usuario}`, payload);

      closeModal();
      await loadUsers();
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data?.error ||
        e2?.message ||
        "Error actualizando el usuario";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  }

  // --------- DELETE ----------
  async function handleDelete(user) {
    const id = user.id_usuario ?? user.id;
    if (!id) return;

    if (currentUserId != null && Number(id) === Number(currentUserId)) {
      setFormError("No puedes eliminar tu propio usuario.");
      return;
    }

    const ok = window.confirm(
      `¿Eliminar el usuario "${user.correo ?? user.email ?? ""}" (ID ${id})?`
    );
    if (!ok) return;

    try {
      setSaving(true);
      setFormError("");
      await api.delete(`/api/users/${id}`);
      await loadUsers();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Error eliminando usuario";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  }

  const rolLabel = (idRolValue) => {
    const n = Number(idRolValue);
    if (n === 1) return "Administrador";
    if (n === 2) return "Empleado";
    if (n === 3) return "Cliente";
    return String(idRolValue ?? "-");
  };

  const groups = [
    { rol: 1, title: "Administradores" },
    { rol: 2, title: "Empleados" },
    { rol: 3, title: "Clientes" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <PageHeader
        title="Usuarios"
        description="Gestión de cuentas por rol (administrador, empleado, cliente)."
        right={
          <button
            type="button"
            onClick={() => {
              resetFormCreate();
              setEditingUser(null);
              setModalMode("create");
              setOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            + Crear usuario
          </button>
        }
      />

      {loading && <p className="text-muted-foreground mt-4">Cargando usuarios...</p>}

      {!loading && error && (
        <div className="rounded-lg border p-4 mt-4">
          <p className="font-semibold text-foreground">No se pudieron cargar</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-4 overflow-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="min-w-full table-fixed text-sm">
            <colgroup>
              <col style={{ width: 100 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 200 }} />
            </colgroup>

            <thead className="sticky top-0 z-10 border-b border-border bg-muted/95 backdrop-blur-sm">
              <tr>
                <th className="text-center p-3">Rol</th>
                <th className="p-3">
                  <div className="mx-auto w-[320px] text-center">Correo</div>
                </th>
                <th className="text-center p-3">Id</th>
                <th className="text-center p-3">Nombre</th>
                <th className="text-center p-3">Apellido</th>
                <th className="text-center p-3">Teléfono</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {groups.map((g) => {
                const groupUsers = users.filter(
                  (u) => Number(u.id_rol ?? u.rol) === g.rol
                );
                if (groupUsers.length === 0) return null;

                const isOpen = !!openGroups[g.rol];

                return (
                  <Fragment key={g.rol}>
                    <tr
                      className="border-t bg-muted/20 cursor-pointer select-none"
                      onClick={() =>
                        setOpenGroups((prev) => ({ ...prev, [g.rol]: !prev[g.rol] }))
                      }
                    >
                      <td className="p-3 font-semibold text-foreground">
                        <div className="flex items-center justify-between">
                          <div style={{ paddingLeft: 58 }}>
                            {g.title}{" "}
                            <span className="text-muted-foreground font-normal">
                              ({groupUsers.length})
                            </span>
                          </div>
                          <span className="text-muted-foreground">{isOpen ? "▾" : "▸"}</span>
                        </div>
                      </td>

                      <td className="p-3" />
                      <td className="p-3" />
                      <td className="p-3" />
                      <td className="p-3" />
                      <td className="p-3" />
                      <td className="p-3" />
                    </tr>

                    {isOpen &&
                      groupUsers.map((u) => (
                        <tr key={u.id_usuario ?? u.id} className="border-t">
                          <td className="p-3 text-center">{rolLabel(u.id_rol ?? u.rol)}</td>

                          <td className="p-3">
                            <div
                              className="mx-auto w-[320px] text-left whitespace-nowrap"
                              style={{ paddingLeft: 94 }}
                            >
                              {u.correo ?? u.email ?? "-"}
                            </div>
                          </td>

                          <td className="p-3 text-center">{u.id_usuario ?? u.id}</td>

                          <td className="p-3 text-center">{u.nombre ?? "-"}</td>
                          <td className="p-3 text-center">{u.apellido ?? "-"}</td>
                          <td className="p-3 text-center">{u.telefono ?? "-"}</td>

                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  handleEdit(u);
                                }}
                                className="px-3 py-1 rounded-lg border hover:bg-muted transition"
                                disabled={saving}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  handleDelete(u);
                                }}
                                className="px-3 py-1 rounded-lg border hover:bg-muted transition"
                                disabled={saving}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })}

              {users.length === 0 && (
                <tr className="border-t">
                  <td className="p-3 text-muted-foreground text-center" colSpan={7}>
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL (create / edit) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative w-full max-w-lg bg-card border rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {modalMode === "edit" ? "Editar usuario" : "Crear usuario"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {modalMode === "edit"
                    ? "Solo puedes modificar nombre, apellido, teléfono y opcionalmente la contraseña."
                    : "Crea administradores o clientes. Para empleados, usa la sección Empleados."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="px-2 py-1 rounded-md hover:bg-muted transition"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={modalMode === "edit" ? handleEditSubmit : handleCreate}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Correo
                </label>
                <input
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 bg-background"
                  placeholder="usuario@dominio.com"
                  disabled={saving || modalMode === "edit"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Contraseña {modalMode === "edit" ? "(opcional)" : ""}
                </label>
                <input
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 bg-background"
                  placeholder="••••••••"
                  disabled={saving}
                />
              </div>

              {/* CAMPOS NUEVOS: visibles tanto en crear como editar */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nombre
                  </label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    placeholder="Nombre"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Apellido
                  </label>
                  <input
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    placeholder="Apellido"
                    disabled={saving}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Teléfono
                  </label>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    placeholder="Teléfono"
                    disabled={saving}
                  />
                </div>
              </div>

              {modalMode === "create" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Rol
                    </label>
                    <select
                      value={idRol}
                      onChange={(e) => setIdRol(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 bg-background"
                      disabled={saving}
                    >
                      <option value="1">Administrador</option>
                      <option value="3">Cliente</option>
                    </select>
                  </div>
                </div>
              )}

              {formError && (
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{formError}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border hover:bg-muted transition"
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 transition"
                  disabled={saving}
                >
                  {saving
                    ? modalMode === "edit"
                      ? "Guardando..."
                      : "Creando..."
                    : modalMode === "edit"
                    ? "Guardar cambios"
                    : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;