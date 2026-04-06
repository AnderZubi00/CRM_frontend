import CrmSidebarNav from "../shell/CrmSidebarNav";

const NAV_ITEMS = [
  { id: "home", label: "Inicio", icon: "home" },
  { id: "users", label: "Usuarios", icon: "users" },
  { id: "products", label: "Productos", icon: "products" },
  { id: "categories", label: "Categorías", icon: "categories" },
  { id: "Suppliers", label: "Proveedores", icon: "suppliers" },
  { id: "employees", label: "Empleados", icon: "employees" },
  { id: "reports", label: "Reportes", icon: "reports" },
  { id: "consultas", label: "Consultas", icon: "consultas" },
];

function AdminLayout({
  user,
  onLogout,
  section,
  onSectionChange,
  children,
}) {
  const activeLabel = NAV_ITEMS.find((n) => n.id === section)?.label ?? "Panel";

  return (
    <div className="min-h-[100dvh] bg-muted/60">
      <div className="flex min-h-[100dvh]">
        <aside className="hidden w-72 flex-col border-r border-border bg-card shadow-sm md:flex">
          <div className="flex h-16 items-center gap-3 border-b border-border px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-foreground">ANCAMI</div>
              <div className="text-xs text-muted-foreground">Administración</div>
            </div>
          </div>

          <CrmSidebarNav
            items={NAV_ITEMS}
            section={section}
            onSectionChange={onSectionChange}
          />

          <div className="mt-auto border-t border-border p-4">
            <p className="text-xs text-muted-foreground">
              Sesión:{" "}
              <span className="font-medium text-foreground">{user?.correo ?? "—"}</span>
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
              <div className="min-w-0">
                <nav className="text-xs font-medium text-muted-foreground" aria-label="Migas">
                  <span className="text-foreground/80">Panel</span>
                  <span className="mx-1.5 text-border">/</span>
                  <span>{activeLabel}</span>
                </nav>
                <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                  {activeLabel}
                </h1>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden text-right leading-tight sm:block">
                  <div className="max-w-[220px] truncate text-sm font-medium text-foreground lg:max-w-[280px]">
                    {user?.correo ?? "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">Administrador</div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>

            <div className="border-t border-border/60 px-4 pb-3 pt-2 md:hidden">
              <div className="flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] pb-1">
                {NAV_ITEMS.map((item) => {
                  const active = item.id === section;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSectionChange?.(item.id)}
                      className={[
                        "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-muted",
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

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
