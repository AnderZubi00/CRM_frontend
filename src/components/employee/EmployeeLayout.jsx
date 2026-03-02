function EmployeeLayout({ user, onLogout, section, onSectionChange, children }) {
  const navItems = [
    { id: "home", label: "Inicio" },
    { id: "users", label: "Usuarios" },
    { id: "products", label: "Productos" },
    { id: "categories", label: "Categorías" },
    { id: "Suppliers", label: "Proveedores" },
  ];

  const activeLabel = navItems.find((n) => n.id === section)?.label ?? "Panel";

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <div className="flex min-h-[100dvh]">
        {/* Sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-r bg-background">
          <div className="h-16 px-5 flex items-center gap-3 border-b">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold">A</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground">Panel de empleado</div>
              <div className="text-xs text-muted-foreground">Gestión diaria</div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = item.id === section;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSectionChange?.(item.id)}
                  className={[
                    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-muted text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {active ? (
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t">
            <div className="text-xs text-muted-foreground">
              Sesión iniciada como{" "}
              <span className="font-medium text-foreground">{user?.correo ?? "-"}</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">
                  Empleado <span className="mx-1">/</span> {activeLabel}
                </div>
                <div className="text-base sm:text-lg font-semibold text-foreground truncate">
                  {activeLabel}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right leading-tight">
                  <div className="text-sm font-medium text-foreground truncate max-w-[260px]">
                    {user?.correo ?? "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">Empleado</div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>

            {/* Navegación móvil */}
            <div className="md:hidden px-4 sm:px-6 pb-3">
              <div className="flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch]">
                {navItems.map((item) => {
                  const active = item.id === section;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSectionChange?.(item.id)}
                      className={[
                        "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium border transition",
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:bg-muted",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLayout;

