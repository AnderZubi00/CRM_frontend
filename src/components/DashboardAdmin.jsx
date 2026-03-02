import { useMemo, useState, useEffect } from "react";
import AdminLayout from "./admin/AdminLayout";
import AdminHome from "./admin/AdminHome";
import AdminUsers from "./admin/AdminUsers";
import AdminProducts from "./admin/AdminProducts";
import AdminReports from "./admin/AdminReports";
import AdminEmployees from "./admin/AdminEmployees";
import AdminCategories from "./admin/AdminCategories";
import AdminSuppliers from "./admin/AdminSuppliers";


function DashboardAdmin({ user, onLogout }) {
  const [section, setSection] = useState(() => {
    return localStorage.getItem("adminSection") || "home";
  });
  useEffect(() => {
    localStorage.setItem("adminSection", section);
  }, [section]);

  const content = useMemo(() => {
    switch (section) {
      case "users":
        return <AdminUsers user={user} />;
      case "products":
        return <AdminProducts user={user} onNavigate={setSection} />;
      case "categories":
        return <AdminCategories />
      case "Suppliers":
        return <AdminSuppliers />
      case "employees":
        return <AdminEmployees />;
      case "reports":
        return <AdminReports user={user} />;
      case "home":
      default:
        return <AdminHome user={user} onNavigate={setSection} />;
    }
  }, [section, user]);

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      section={section}
      onSectionChange={setSection}
    >
      {content}
    </AdminLayout>
  );
}

export default DashboardAdmin;