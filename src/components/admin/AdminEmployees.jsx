import { useEffect, useState } from "react";
import { getEmpleados } from "@/services/api";
import api from "@/services/api";
import PageHeader from "@/components/shell/PageHeader";

function AdminEmployees() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [empleados, setEmpleados] = useState([]);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  async function loadEmpleados() {
    try {
      setLoading(true);
      setError("");
      const data = await getEmpleados();
      const list = Array.isArray(data) ? data : data?.data || data?.rows || [];
      setEmpleados(list);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Error cargando empleados";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmpleados();
  }, []);

  function resetForm() {
    setCorreo("");
    setContrasena("");
    setNombre("");
    setApellido("");
    setTelefono("");
    setDni("");
    setFormError("");

  }

  async function handleCreate(e) {
    e.preventDefault();

    if (!nombre.trim()) return setFormError("El nombre es obligatorio.");
    if (!correo.trim()) return setFormError("El correo es obligatorio.");
    if (!contrasena.trim()) return setFormError("La contraseña es obligatoria.");
    if (contrasena.trim().length < 6)
      return setFormError("La contraseña debe tener al menos 6 caracteres.");

    try {
      setSaving(true);
      setFormError("");

      await api.post("/api/users/create-empleado", {
        correo: correo.trim(),
        contraseña: contrasena.trim(), // OJO: va con ñ
        empleado: {
          nombre: nombre.trim(),
          apellido: apellido.trim() ? apellido.trim() : null,
          telefono: telefono.trim() ? telefono.trim() : null,
          dni: dni.trim() ? dni.trim() : null,
        },
      });

      setOpen(false);
      resetForm();
      await loadEmpleados();
    } catch (e) {
      const msg =
        e?.response?.data?.details ||
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Error creando empleado y usuario";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <PageHeader
        title="Empleados"
        description="Alta de usuarios con rol empleado y datos laborales."
        right={
          <button
            type="button"
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            + Crear usuario (empleado)
          </button>
        }
      />

      {loading && <p className="text-muted-foreground mt-4">Cargando empleados...</p>}

      {!loading && error && (
        <div className="rounded-lg border p-4 mt-4">
          <p className="font-semibold text-foreground">No se pudieron cargar</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-4 overflow-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted/95 backdrop-blur-sm">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Apellido</th>
                <th className="text-left p-3">Teléfono</th>
                <th className="text-left p-3">DNI</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((e) => (
                <tr key={e.id_empleado ?? e.id_usuario} className="border-t">
                  <td className="p-3">{e.id_empleado ?? e.id_usuario ?? '-'}</td>
                  <td className="p-3">{e.nombre ?? "-"}</td>
                  <td className="p-3">{e.apellido ?? "-"}</td>
                  <td className="p-3">{e.telefono ?? "-"}</td>
                  <td className="p-3">{e.dni ?? "-"}</td>
                </tr>
              ))}
              {empleados.length === 0 && (
                <tr className="border-t">
                  <td className="p-3 text-muted-foreground" colSpan={5}>
                    No hay empleados para mostrar.
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
                <h3 className="text-lg font-bold text-foreground">Crear Usuario (Empleado)</h3>
                <p className="text-sm text-muted-foreground">
                  Se creará el usuario con rol Empleado y su registro de empleado asociado.
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nombre *
                  </label>
                  <input
                    value={nombre}
                    onChange={(ev) => setNombre(ev.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Apellido
                  </label>
                  <input
                    value={apellido}
                    onChange={(ev) => setApellido(ev.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Teléfono
                  </label>
                  <input
                    value={telefono}
                    onChange={(ev) => setTelefono(ev.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    DNI
                  </label>
                  <input
                    value={dni}
                    onChange={(ev) => setDni(ev.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Correo *
                  </label>
                  <input
                    value={correo}
                    onChange={(ev) => setCorreo(ev.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    disabled={saving}
                    type="email"
                    placeholder="empleado@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Contraseña 
                  </label>
                  <input
                    value={contrasena}
                    onChange={(ev) => setContrasena(ev.target.value)}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                    disabled={saving}
                    type="password"
                    placeholder="********"
                  />
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

export default AdminEmployees;