import ClienteLayout from "./cliente/ClienteLayout";

/**
 * Dashboard del cliente — wrapper que delega toda la lógica
 * a ClienteLayout (tienda premium con cesta, detalle, checkout).
 *
 * Mantiene la misma interfaz de props que usaba App.jsx.
 */
function DashboardCliente({ user, onLogout }) {
  return <ClienteLayout user={user} onLogout={onLogout} />;
}

export default DashboardCliente;
