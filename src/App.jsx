import { useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Registro from './components/Registro';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardEmpleado from './components/DashboardEmpleado';
import DashboardCliente from './components/DashboardCliente';
import { getCurrentUser, logout } from './services/api';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' o 'registro'
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(getCurrentUser());

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('home');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentView('home');
  };

  const handleGoToRegister = () => {
    setShowLoginModal(false);
    setCurrentView('registro');
  };

  // Si el usuario está logueado, mostrar el dashboard correspondiente a su rol
  if (user && currentView === 'dashboard') {
    const esAdmin = user.id_rol === 1;
    const esEmpleado = user.id_rol === 2;
    const esCliente = user.id_rol === 3;

    if (esAdmin) return <DashboardAdmin user={user} onLogout={handleLogout} />;
    if (esEmpleado) return <DashboardEmpleado user={user} onLogout={handleLogout} />;
    if (esCliente) return <DashboardCliente user={user} onLogout={handleLogout} />;
  }

  // Vista principal: solo Header (y registro si aplica)
  return (
    <div className="w-full min-w-full">
      <Header onOpenLogin={() => setShowLoginModal(true)} />

      {/* Modal de registro (mismo estilo que login: overlay oscuro + formulario centrado) */}
      {currentView === 'registro' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setCurrentView('home')}
          role="dialog"
          aria-modal="true"
          aria-labelledby="registro-title"
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Registro
              onClose={() => setCurrentView('home')}
              onRegisterSuccess={handleRegisterSuccess}
              onGoToLogin={() => { setCurrentView('home'); setShowLoginModal(true); }}
            />
          </div>
        </div>
      )}

      {/* Modal de login */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Login
              onClose={() => setShowLoginModal(false)}
              onLoginSuccess={handleLoginSuccess}
              onGoToRegister={handleGoToRegister}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
