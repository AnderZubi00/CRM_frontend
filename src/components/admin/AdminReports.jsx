function AdminReports({ user }) {
  return (
    <div className="bg-card rounded-2xl border shadow-xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-2">Reportes</h2>
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