import Header from './components/Header';
import Home from './components/Home';
import ClienteLayout from './components/cliente/ClienteLayout';
import SobreNosotros from './components/SobreNosotros';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Politica from './components/Politica';
import Login from './components/Login';
import Registro from './components/Registro';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardEmpleado from './components/DashboardEmpleado';
import MisPedidos from './components/cliente/MisPedidos';
import { getCurrentUser, logout, verifyAuth } from "./services/api";
import { useEffect, useState, useRef } from "react";
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInitialCorreo, setLoginInitialCorreo] = useState('');
  const [loginPostRegisterMessage, setLoginPostRegisterMessage] = useState('');
  const [user, setUser] = useState(getCurrentUser());

  // Track where the user was before login, so we can return them there
  const preLoginView = useRef(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    setLoginInitialCorreo('');
    setLoginPostRegisterMessage('');

    // Clients go to productos (the shop); admin/employee go to dashboard
    const rol = userData?.id_rol;
    if (rol === 1 || rol === 2) {
      setCurrentView('dashboard');
    } else if (preLoginView.current) {
      // Return to where they were (e.g. productos/checkout)
      setCurrentView(preLoginView.current);
      preLoginView.current = null;
    } else {
      setCurrentView('productos');
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      setUser(null);
      setCurrentView("home");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    const token = localStorage.getItem("token");
    if (token) {
      verifyAuth()
        .then((data) => {
          const verifiedUser = data.user ?? data;
          setUser(verifiedUser);
          const rol = verifiedUser?.id_rol;
          // Admin/Employee → dashboard; Client → productos (shop)
          if (rol === 1 || rol === 2) {
            setCurrentView("dashboard");
          } else {
            setCurrentView("productos");
          }
        })
        .catch(() => {
          handleUnauthorized();
        });
    }

    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setLoginInitialCorreo('');
    setLoginPostRegisterMessage('');
  };

  const handleRegisterSuccess = ({ correo } = {}) => {
    setCurrentView('home');
    setLoginInitialCorreo(typeof correo === 'string' ? correo : '');
    setLoginPostRegisterMessage(
      'Cuenta creada. Inicia sesión con tu correo y contraseña para entrar a tu panel.'
    );
    setShowLoginModal(true);
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

  // Open login modal and remember where we were
  const handleRequestLogin = () => {
    preLoginView.current = currentView;
    setShowLoginModal(true);
  };

  // Admin and Employee get their own full-screen dashboards (no public header)
  if (user && currentView === 'dashboard') {
    const esAdmin = user.id_rol === 1;
    const esEmpleado = user.id_rol === 2;

    if (esAdmin) return <DashboardAdmin user={user} onLogout={handleLogout} />;
    if (esEmpleado) return <DashboardEmpleado user={user} onLogout={handleLogout} />;
  }

  // Everyone else (clients, visitors) gets the public layout with Header + Footer
  return (
    <div className="w-full min-w-full">
      <Header
        user={user}
        onOpenLogin={handleRequestLogin}
        onLogout={handleLogout}
        onNavigate={(view) => setCurrentView(view)}
        currentView={currentView}
      />

      {currentView === 'home' && (
        <Home
          onOpenLogin={handleRequestLogin}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}
      {currentView === 'productos' && (
        <ClienteLayout
          user={user}
          onLogout={handleLogout}
          onRequestLogin={handleRequestLogin}
          hideHeader
        />
      )}
      {currentView === 'sobre-nosotros' && <SobreNosotros onNavigate={(view) => setCurrentView(view)} />}
      {currentView === 'contacto' && <Contact onNavigate={(view) => setCurrentView(view)} />}
      {currentView === 'mis-pedidos' && <MisPedidos user={user} onNavigate={(view) => setCurrentView(view)} onOpenLogin={handleRequestLogin} />}
      {currentView === 'politica-privacidad' && <Politica />}
      <Footer
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Modal de registro */}
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
              onGoToLogin={() => {
                setCurrentView('home');
                setLoginPostRegisterMessage('');
                setShowLoginModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de login */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseLoginModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Login
              initialCorreo={loginInitialCorreo}
              postRegisterMessage={loginPostRegisterMessage}
              onClose={handleCloseLoginModal}
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
