import AdminNav from "./AdminNav";

function AdminLayout({
  user,
  onLogout,
  section,
  onSectionChange,
  children,
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav
        user={user}
        onLogout={onLogout}
        section={section}
        onSectionChange={onSectionChange}
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;