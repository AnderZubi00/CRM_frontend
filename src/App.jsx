import Header from './components/Header';
import Home from './components/Home';
import VistaProductos from './components/VistaProductos';
import SobreNosotros from './components/SobreNosotros';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Politica from './components/Politica';
import Login from './components/Login';
import Registro from './components/Registro';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardEmpleado from './components/DashboardEmpleado';
import DashboardCliente from './components/DashboardCliente';
import { getCurrentUser, logout, verifyAuth } from "./services/api";
import { useEffect, useState } from "react";
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
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      setUser(null);
      setCurrentView("home");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    // Revalidar token al refrescar (F5)
    const token = localStorage.getItem("token");
    if (token) {
      verifyAuth()
        .then((data) => {
          // Ajusta según lo que devuelva tu /api/auth/verify
          // Si devuelve { user: {...} }:
          const verifiedUser = data.user ?? data;
          setUser(verifiedUser);
          setCurrentView("dashboard");
        })
        .catch(() => {
          handleUnauthorized();
        });
    }

    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);
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
      <Header
        onOpenLogin={() => setShowLoginModal(true)}
        onNavigate={(view) => setCurrentView(view)}
        currentView={currentView}
      />

      {currentView === 'home' && (
        <Home
          onOpenLogin={() => setShowLoginModal(true)}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}
      {currentView === 'productos' && (
        <VistaProductos onOpenLogin={() => setShowLoginModal(true)} />
      )}
      {currentView === 'sobre-nosotros' && <SobreNosotros />}
      {currentView === 'contacto' && <Contact />}
      {currentView === 'politica-privacidad' && <Politica />}
      <Footer
        onNavigate={(view) => setCurrentView(view)}
      />


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
