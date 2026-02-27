import { Fragment, useEffect, useState } from "react";
import { getUsers, createUser } from "@/services/api";
import api, { getCurrentUser } from "@/services/api";

function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [openGroups, setOpenGroups] = useState({ 1: true, 2: false, 3: false });
  const currentUser = getCurrentUser?.() || null;
  const currentUserId = currentUser?.id_usuario ?? currentUser?.id ?? null;
  // Modal + form
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [idRol, setIdRol] = useState("3"); // por defecto Cliente

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
    // cargamos empleados una vez, para tenerlos listos
  }, []);

  function resetForm() {
    setCorreo("");
    setContrasena("");
    setIdRol("3");
    setFormError("");
  }

  async function handleCreate(e) {
    e.preventDefault();

    if (!correo.trim()) return setFormError("El correo es obligatorio.");
    if (!contrasena.trim()) return setFormError("La contraseña es obligatoria.")
    if (contrasena.trim().length < 6)
      return setFormError("La contraseña debe tener al menos 6 caracteres.");

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
        contraseña: contrasena, // 👈 tu backend lo exige así (con ñ)
        id_rol: rol,
        id_empleado: null,
      };

      await createUser(payload);

      setOpen(false);
      resetForm();
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
  const rolLabel = (idRol) => {
    const n = Number(idRol);
    if (n === 1) return "Administrador";
    if (n === 2) return "Empleado";
    if (n === 3) return "Cliente";
    return String(idRol ?? "-");
  };
  const groups = [
    { rol: 1, title: "Administradores", },
    { rol: 2, title: "Empleados" },
    { rol: 3, title: "Clientes" },
  ];
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
  return (
    <div className="bg-card rounded-2xl border shadow-xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Usuarios</h2>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:opacity-90 transition"
        >
          + Crear usuario
        </button>
      </div>

      {loading && (
        <p className="text-muted-foreground mt-4">Cargando usuarios...</p>
      )}

      {!loading && error && (
        <div className="rounded-lg border p-4 mt-4">
          <p className="font-semibold text-foreground">No se pudieron cargar</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-4 overflow-auto border rounded-xl">
          <table className="min-w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: 200 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 220 }} />
              <col style={{ width: 160 }} />
            </colgroup>

            <thead className="bg-muted/40">
              <tr>
                <th className="text-center p-3">Rol</th>
                {/* Correo: encabezado centrado dentro de un bloque fijo */}
                <th className="p-3">
                  <div className="mx-auto w-[320px] text-center">Correo</div>
                </th>
                <th className="text-center p-3">Id</th>
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
                    {/* Fila separadora (accordion) */}
                    <tr
                      className="border-t bg-muted/20 cursor-pointer select-none"
                      onClick={() =>
                        setOpenGroups((prev) => ({ ...prev, [g.rol]: !prev[g.rol] }))
                      }
                    >
                      {/* Rol (aquí va el título + flecha) */}
                      <td className="p-3 font-semibold text-foreground">
                        <div className="flex items-center justify-between">
                          <div style={{ paddingLeft: 58}}>
                            {g.title} <span className="text-muted-foreground font-normal">({groupUsers.length})</span>
                          </div>
                          <span className="text-muted-foreground">{isOpen ? "▾" : "▸"}</span>
                        </div>
                      </td>

                      {/* Correo vacío */}
                      <td className="p-3" />

                      {/* ID vacío */}
                      <td className="p-3" />

                      {/* Acciones vacío */}
                      <td className="p-3" />
                    </tr>

                    {/* Filas del grupo */}
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

                          <td className="p-3 text-center">
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
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })}

              {users.length === 0 && (
                <tr className="border-t">
                  <td className="p-3 text-muted-foreground text-center" colSpan={4}>
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !saving && setOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Crear usuario
                </h3>
                <p className="text-sm text-muted-foreground">
                  Crea administradores o clientes. Para empleados, usa la sección Empleados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => !saving && setOpen(false)}
                className="px-2 py-1 rounded-md hover:bg-muted transition"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
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
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Contraseña
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Rol
                  </label>
                  <select
                    value={idRol}
                    onChange={(e) => {
                      setIdRol(e.target.value);
                    }}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    disabled={saving}
                  >
                    <option value="1">Administrador</option>
                    <option value="3">Cliente</option>
                  </select>
                </div>

              </div>

              {formError && (
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{formError}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
                  {saving ? "Creando..." : "Crear"}
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