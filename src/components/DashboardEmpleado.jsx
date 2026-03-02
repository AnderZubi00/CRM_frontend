import { useMemo, useState, useEffect } from "react";
import EmployeeLayout from "./employee/EmployeeLayout";
import AdminHome from "./admin/AdminHome";
import AdminUsers from "./admin/AdminUsers";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminSuppliers from "./admin/AdminSuppliers";

function DashboardEmpleado({ user, onLogout }) {
  const [section, setSection] = useState(() => {
    return localStorage.getItem("employeeSection") || "home";
  });

  useEffect(() => {
    localStorage.setItem("employeeSection", section);
  }, [section]);

  const content = useMemo(() => {
    switch (section) {
      case "users":
        return <AdminUsers user={user} />;
      case "products":
        return <AdminProducts user={user} onNavigate={setSection} />;
      case "categories":
        return <AdminCategories />;
      case "Suppliers":
        return <AdminSuppliers />;
      case "home":
      default:
        return (
          <AdminHome
            user={user}
            onNavigate={setSection}
            title="Bienvenido, Empleado"
            subtitle="Gestiona usuarios, productos, categorías y proveedores desde aquí."
            showReportes={false}
            roleLabel="Empleado"
          />
        );
    }
  }, [section, user]);

  return (
    <EmployeeLayout
      user={user}
      onLogout={onLogout}
      section={section}
      onSectionChange={setSection}
    >
      {content}
    </EmployeeLayout>
  );
}

export default DashboardEmpleado;
