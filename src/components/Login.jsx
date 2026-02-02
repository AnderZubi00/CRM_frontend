import { useState } from 'react';
import { login } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login({ onLoginSuccess, onGoToRegister, onClose }) {
  const isModal = Boolean(onClose);
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(correo, contraseña);
      if (response.token) {
        if (onLoginSuccess) {
          onLoginSuccess(response.user);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div className={`bg-card rounded-2xl p-8 border shadow-xl animate-login-in ${isModal ? 'relative' : ''}`}>
      {isModal && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      )}
      
      {/* Icono circular con gradiente */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Bienvenido
        </h2>
        <p className="text-muted-foreground text-sm">Inicia sesión en tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Correo electrónico */}
        <div className="space-y-2">
          <Label htmlFor="correo">Correo Electrónico</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <Input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="pl-10"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="space-y-2">
          <Label htmlFor="contraseña">Contraseña</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <Input
              type={mostrarContraseña ? 'text' : 'password'}
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="pl-10 pr-10"
              placeholder="••••••••"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMostrarContraseña(!mostrarContraseña)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              aria-label={mostrarContraseña ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarContraseña ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Recordarme + Olvidaste contraseña */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
              className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
            />
            <span className="text-sm text-foreground">Recordarme</span>
          </label>
          <Button type="button" variant="link" className="px-0 text-sm">
            ¿Olvidaste tu contraseña?
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/15 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Botón Iniciar Sesión */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>

        {/* ¿No tienes cuenta? */}
        {onGoToRegister && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿No tienes una cuenta?{' '}
            <Button
              type="button"
              variant="link"
              onClick={onGoToRegister}
              className="px-0"
            >
              Regístrate aquí
            </Button>
          </p>
        )}
      </form>
      
      {/* Footer legal */}
      <p className="text-center mt-4 text-muted-foreground text-xs">
        Al iniciar sesión, aceptas nuestros{' '}
        <a href="#" className="underline hover:text-foreground">Términos de Servicio</a>
        {' '}y{' '}
        <a href="#" className="underline hover:text-foreground">Política de Privacidad</a>.
      </p>
    </div>
  );

  if (isModal) {
    return cardContent;
  }

  return (
    <div className="min-h-screen min-h-dvh w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {cardContent}
      </div>
    </div>
  );
}

export default Login;
