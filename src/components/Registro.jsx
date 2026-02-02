import { useState } from 'react';
import api from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Registro({ onRegisterSuccess, onGoToLogin, onClose }) {
  const isModal = Boolean(onClose);
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { confirmarContraseña, ...userData } = formData;
      const response = await api.post('/api/users/register', userData);
      setSuccess('Usuario registrado exitosamente');

      if (onRegisterSuccess) {
        onRegisterSuccess(response.data.user || response.data);
      }

      setTimeout(() => {
        setFormData({ correo: '', contraseña: '', confirmarContraseña: '' });
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
      console.error('Error de registro:', err);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Crear cuenta
            </h2>
            <p className="text-muted-foreground text-sm">Completa tus datos para registrarte</p>
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
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
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
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
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

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmarContraseña">Confirmar Contraseña</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <Input
                  type={mostrarConfirmar ? 'text' : 'password'}
                  id="confirmarContraseña"
                  name="confirmarContraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  placeholder="Repite la contraseña"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  aria-label={mostrarConfirmar ? 'Ocultar' : 'Mostrar'}
                >
                  {mostrarConfirmar ? (
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

            {error && (
              <div className="bg-destructive/15 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/15 border border-green-500/50 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            {/* Botón Registrarse */}
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
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </Button>

            {/* ¿Ya tienes cuenta? */}
            {onGoToLogin && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                ¿Ya tienes una cuenta?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={onGoToLogin}
                  className="px-0"
                >
                  Iniciar Sesión
                </Button>
              </p>
            )}
          </form>

          {/* Footer legal */}
          <p className="text-center mt-4 text-muted-foreground text-xs">
            Al registrarte, aceptas nuestros{' '}
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

export default Registro;
