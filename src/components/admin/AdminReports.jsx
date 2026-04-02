function AdminReports({ user }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">Reportes</h2>
      <p className="text-muted-foreground">
        Sección de reportes (placeholder).
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Sesión: {user?.correo}
      </p>
    </div>
  );
}

export default AdminReports;