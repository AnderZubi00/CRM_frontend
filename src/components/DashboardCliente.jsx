import { Button } from "@/components/ui/button";

function DashboardCliente({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav con gradiente (misma paleta que login) */}
      <nav className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Área de Cliente
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/90 text-sm hidden sm:inline">
                <strong>{user.correo}</strong> · Cliente
              </span>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-1 border-white bg-transparent text-white hover:bg-white/20 hover:text-white"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Card principal */}
          <div className="bg-card rounded-2xl border shadow-xl p-6 border-l-4 border-l-blue-500">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Bienvenido
            </h2>
            <p className="text-muted-foreground mb-6">
              Consulta tus pedidos y realiza nuevas compras desde aquí.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-5 rounded-xl border bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground">Mis pedidos</h3>
                <p className="text-sm text-muted-foreground">Historial y estado</p>
              </div>
              <div className="p-5 rounded-xl border bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200/50 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground">Catálogo</h3>
                <p className="text-sm text-muted-foreground">Ver productos disponibles</p>
              </div>
            </div>
          </div>

          {/* Card información del usuario */}
          <div className="bg-card rounded-2xl border shadow-xl p-6">
            <h3 className="font-bold text-foreground mb-4">Tu información</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">ID</dt>
                <dd className="font-medium text-foreground">{user.id_usuario}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Correo</dt>
                <dd className="font-medium text-foreground">{user.correo}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Rol</dt>
                <dd className="font-medium text-foreground">Cliente</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCliente;
