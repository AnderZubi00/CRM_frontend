import { Button } from "@/components/ui/button";

function NavItem({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "px-3 py-2 rounded-lg text-sm font-medium transition",
                active
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/15 hover:text-white",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function AdminNav({ user, onLogout, section, onSectionChange }) {
    return (
        <nav className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">
                            Panel de Administración
                        </h1>

                        {/* Menú */}
                        <div className="hidden md:flex items-center gap-1 ml-6">
                            <NavItem
                                active={section === "home"}
                                onClick={() => onSectionChange("home")}
                            >
                                Inicio
                            </NavItem>
                            <NavItem
                                active={section === "users"}
                                onClick={() => onSectionChange("users")}
                            >
                                Usuarios
                            </NavItem>
                            <NavItem
                                active={section === "products"}
                                onClick={() => onSectionChange("products")}
                            >
                                Productos
                            </NavItem>
                            <NavItem
                                active={section === "categories"}
                                onClick={() => onSectionChange("categories")}
                            >
                                Categorías
                            </NavItem>
                            <NavItem
                                active={section === "Suppliers"}
                                onClick={() => onSectionChange("Suppliers")}
                            >
                                Proveedores
                            </NavItem>
                            <NavItem
                                active={section === "employees"}
                                onClick={() => onSectionChange("employees")}
                            >
                                Empleados
                            </NavItem>
                            <NavItem
                                active={section === "reports"}
                                onClick={() => onSectionChange("reports")}
                            >
                                Reportes
                            </NavItem>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-white/90 text-sm hidden sm:inline">
                            <strong>{user?.correo}</strong> · Administrador
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
    );
}

export default AdminNav;