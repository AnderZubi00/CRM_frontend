import { useMemo, useState } from "react";
import AdminLayout from "./admin/AdminLayout";
import AdminHome from "./admin/AdminHome";
import AdminUsers from "./admin/AdminUsers";
import AdminProducts from "./admin/AdminProducts";
import AdminReports from "./admin/AdminReports";
import AdminEmployees from "./admin/AdminEmployees";

function DashboardAdmin({ user, onLogout }) {
  const [section, setSection] = useState("home"); // home | users | products | reports

  const content = useMemo(() => {
    switch (section) {
      case "users":
        return <AdminUsers user={user} />;
      case "products":
        return <AdminProducts user={user} />;
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