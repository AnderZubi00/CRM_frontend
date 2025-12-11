import { useState } from 'react';
import { login, getProductos, isAuthenticated } from '../services/api';

/**
 * Componente de ejemplo para mostrar cómo usar el API
 * Puedes usar este como referencia para crear tus propios componentes
 */
function LoginExample() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [productos, setProductos] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await login(email, contraseña);
      setSuccess(`Login exitoso! Bienvenido ${response.user.nombre}`);
      console.log('Usuario autenticado:', response.user);
      console.log('Token guardado en localStorage');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetProductos = async () => {
    if (!isAuthenticated()) {
      setError('Debes iniciar sesión primero');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getProductos();
      setProductos(data);
      setSuccess(`Se obtuvieron ${data.length} productos`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener productos');
      console.error('Error al obtener productos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ejemplo de Conexión API</h2>
      
      {/* Formulario de Login */}
      <form onSubmit={handleLogin} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Botón para obtener productos */}
      <button
        onClick={handleGetProductos}
        disabled={loading || !isAuthenticated()}
        className="w-full mb-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Cargando...' : 'Obtener Productos'}
      </button>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Lista de productos */}
      {productos.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Productos:</h3>
          <ul className="list-disc list-inside">
            {productos.map((producto) => (
              <li key={producto.id}>
                {producto.nombre} - ${producto.precio}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LoginExample;

