import { Button } from "@/components/ui/button";

function NavItem({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg px-3 py-2 text-sm font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Header({ user, onOpenLogin, onLogout, onNavigate, currentView }) {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full min-w-full bg-background border-b shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">ANCAMI</span>
          </div>

          {/* Navegación */}
          <nav className="hidden sm:flex items-center gap-1">
            <NavItem active={currentView === "home"} onClick={() => onNavigate?.("home")}>
              Inicio
            </NavItem>
            <NavItem active={currentView === "productos"} onClick={() => onNavigate?.("productos")}>
              Productos
            </NavItem>
            <NavItem active={currentView === "sobre-nosotros"} onClick={() => onNavigate?.("sobre-nosotros")}>
              Sobre nosotros
            </NavItem>
            <NavItem active={currentView === "contacto"} onClick={() => onNavigate?.("contacto")}>
              Contacto
            </NavItem>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* User avatar */}
                <div className="hidden sm:flex items-center gap-2 mr-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {(user.correo || "U")[0].toUpperCase()}
                  </div>
                  <span className="max-w-[140px] truncate text-sm font-medium text-foreground">
                    {user.correo}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Salir
                </Button>
              </>
            ) : (
              <Button onClick={onOpenLogin} size="default" className="gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Iniciar Sesion
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
