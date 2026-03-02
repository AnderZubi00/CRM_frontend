function AdminHome({ user, onNavigate, title = "Bienvenido, Administrador", subtitle = "Tienes acceso completo al sistema. Gestiona usuarios, productos y consulta reportes.", showReportes = true, roleLabel = "Administrador" }) {
  const CardAction = ({ title: cardTitle, desc, icon, goTo }) => (
    <button
      type="button"
      onClick={() => onNavigate?.(goTo)}
      className="text-left p-5 rounded-xl border bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200/50 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400/50"
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{cardTitle}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Card principal */}
      <div className="bg-card rounded-2xl border shadow-xl p-6 border-l-4 border-l-blue-500">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground mb-6">
          {subtitle}
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardAction
            title="Usuarios"
            desc="Gestionar usuarios y roles"
            goTo="users"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />

          <CardAction
            title="Productos"
            desc="Catálogo y stock"
            goTo="products"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />

          <CardAction
            title="Categorías"
            desc="Gestionar categorías"
            goTo="categories"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />

          <CardAction
            title="Proveedores"
            desc="Gestionar proveedores"
            goTo="Suppliers"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />

          {showReportes && (
            <CardAction
              title="Reportes"
              desc="Estadísticas y pedidos"
              goTo="reports"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          )}
        </div>
      </div>

      {/* Card información del usuario */}
      <div className="bg-card rounded-2xl border shadow-xl p-6">
        <h3 className="font-bold text-foreground mb-4">Tu información</h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">ID</dt>
            <dd className="font-medium text-foreground">{user?.id_usuario}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Correo</dt>
            <dd className="font-medium text-foreground">{user?.correo}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Rol</dt>
            <dd className="font-medium text-foreground">{roleLabel}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default AdminHome;