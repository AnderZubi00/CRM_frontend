import { useState } from 'react';
import api from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Registro({ onRegisterSuccess, onGoToLogin, onClose }) {
  const isModal = Boolean(onClose);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contraseña: '',
    confirmarContraseña: '',
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

    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es obligatorio');
      setLoading(false);
      return;
    }
    if (!formData.telefono.trim()) {
      setError('El teléfono es obligatorio');
      setLoading(false);
      return;
    }

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
      const userData = {
        correo: formData.correo.trim(),
        contraseña: formData.contraseña,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim(),
      };
      await api.post('/api/users/register', userData);

      if (onRegisterSuccess) {
        onRegisterSuccess({ correo: userData.correo });
        return;
      }

      setSuccess('Usuario registrado exitosamente');
      setTimeout(() => {
        setFormData({
          nombre: '',
          apellido: '',
          correo: '',
          telefono: '',
          contraseña: '',
          confirmarContraseña: '',
        });
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
    <div
      className={`animate-login-in rounded-2xl border border-border bg-card shadow-sm ${isModal ? 'relative max-h-[min(88dvh,720px)] overflow-y-auto overscroll-contain p-5 sm:p-6' : 'p-8'}`}
    >
      {isModal && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 h-8 w-8 sm:right-3 sm:top-3"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      )}
      <div className="mb-3 flex justify-center pt-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary shadow-sm sm:h-12 sm:w-12">
          <svg className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
      </div>

          <div className="mb-4 text-center">
            <h2 id="registro-title" className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Crear cuenta
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">Completa tus datos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-xs sm:text-sm">Nombre</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <Input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="h-9 pl-9 text-sm sm:h-10 sm:pl-10"
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  required
                />
              </div>
            </div>

            {/* Apellido */}
            <div className="space-y-1.5">
              <Label htmlFor="apellido" className="text-xs sm:text-sm">Apellido</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <Input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="h-9 pl-9 text-sm sm:h-10 sm:pl-10"
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
            </div>

            {/* Correo electrónico */}
            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-xs sm:text-sm">Correo Electrónico</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <Input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="h-9 pl-9 text-sm sm:h-10 sm:pl-10"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <Label htmlFor="telefono" className="text-xs sm:text-sm">Teléfono</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <Input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="h-9 pl-9 text-sm sm:h-10 sm:pl-10"
                  placeholder="Ej. 600 000 000"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <Label htmlFor="contraseña" className="text-xs sm:text-sm">Contraseña</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <Input
                  type={mostrarContraseña ? 'text' : 'password'}
                  id="contraseña"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className="h-9 pl-9 pr-9 text-sm sm:h-10 sm:pl-10 sm:pr-10"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMostrarContraseña(!mostrarContraseña)}
                  className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2 sm:right-1 sm:h-7 sm:w-7"
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
            <div className="space-y-1.5">
              <Label htmlFor="confirmarContraseña" className="text-xs sm:text-sm">Confirmar contraseña</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <Input
                  type={mostrarConfirmar ? 'text' : 'password'}
                  id="confirmarContraseña"
                  name="confirmarContraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                  className="h-9 pl-9 pr-9 text-sm sm:h-10 sm:pl-10 sm:pr-10"
                  placeholder="Repite la contraseña"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2 sm:right-1 sm:h-7 sm:w-7"
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
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/15 px-3 py-2 text-xs text-destructive sm:text-sm">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/15 px-3 py-2 text-xs text-green-700 dark:text-green-300 sm:text-sm">
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
              className="mt-1 w-full"
              size="default"
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
              <p className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">
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
          <p className="mt-3 text-center text-[11px] leading-snug text-muted-foreground sm:text-xs">
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
