import { Button } from "@/components/ui/button";

function Header({ onOpenLogin }) {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full min-w-full bg-background border-b shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-foreground">Mi App</span>
          </div>

          {/* Navegación */}
          <nav className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" asChild>
              <a href="#inicio">Inicio</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#productos">Productos</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#sobre-nosotros">Sobre Nosotros</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#contacto">Contacto</a>
            </Button>
          </nav>

          {/* Cesta y Iniciar Sesión */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild title="Cesta de compra">
              <a href="#cesta" className="h-9 w-9">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </a>
            </Button>
            <Button onClick={onOpenLogin} size="default" className="gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
