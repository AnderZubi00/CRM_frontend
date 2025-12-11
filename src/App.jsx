import { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import { getCurrentUser, logout } from './services/api';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' o 'registro'
  const [user, setUser] = useState(getCurrentUser());

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = () => {
    // Después de registrar, cambiar a login
    setCurrentView('login');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentView('login');
  };

  // Si el usuario está logueado, mostrar dashboard
  if (user && currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Bienvenido, <strong>{user.correo}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Información del Usuario</h2>
              <div className="space-y-2">
                <p><strong>ID:</strong> {user.id_usuario}</p>
                <p><strong>Correo:</strong> {user.correo}</p>
                <p><strong>Rol:</strong> {user.id_rol === 1 ? 'Administrador' : user.id_rol === 2 ? 'Empleado' : 'Cliente'}</p>
                {user.id_empleado && <p><strong>ID Empleado:</strong> {user.id_empleado}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de login o registro
  return (
    <div>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setCurrentView('login')}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentView === 'login'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setCurrentView('registro')}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentView === 'registro'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Registrarse
        </button>
      </div>

      {currentView === 'login' ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Registro onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
}

export default App;
