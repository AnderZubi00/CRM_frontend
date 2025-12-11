import axios from "axios";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirigir al login si es necesario
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTENTICACIÓN ====================

/**
 * Iniciar sesión
 * @param {string} correo - Correo del usuario
 * @param {string} contraseña - Contraseña del usuario
 * @returns {Promise} Datos del usuario y token
 */
export const login = async (correo, contraseña) => {
  const res = await api.post("/api/auth/login", { correo, contraseña });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
};

/**
 * Verificar token actual
 * @returns {Promise} Datos del usuario
 */
export const verifyAuth = async () => {
  const res = await api.get("/api/auth/verify");
  return res.data;
};

/**
 * Cerrar sesión
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ==================== USUARIOS ====================

/**
 * Obtener todos los usuarios
 * @returns {Promise} Lista de usuarios
 */
export const getUsers = async () => {
  const res = await api.get("/api/users");
  return res.data;
};

/**
 * Obtener un usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Promise} Datos del usuario
 */
export const getUserById = async (id) => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};

/**
 * Crear un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise} Usuario creado
 */
export const createUser = async (userData) => {
  const res = await api.post("/api/users/create", userData);
  return res.data;
};

/**
 * Actualizar un usuario
 * @param {number} id - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise} Usuario actualizado
 */
export const updateUser = async (id, userData) => {
  const res = await api.put(`/api/users/${id}`, userData);
  return res.data;
};

/**
 * Eliminar un usuario
 * @param {number} id - ID del usuario
 * @returns {Promise} Confirmación
 */
export const deleteUser = async (id) => {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};

// ==================== PRODUCTOS ====================

/**
 * Obtener todos los productos
 * @returns {Promise} Lista de productos
 */
export const getProductos = async () => {
  const res = await api.get("/api/productos");
  return res.data;
};

/**
 * Obtener un producto por ID
 * @param {number} id - ID del producto
 * @returns {Promise} Datos del producto
 */
export const getProductoById = async (id) => {
  const res = await api.get(`/api/productos/${id}`);
  return res.data;
};

/**
 * Crear un nuevo producto
 * @param {Object} productoData - Datos del producto
 * @returns {Promise} Producto creado
 */
export const createProducto = async (productoData) => {
  const res = await api.post("/api/productos/nuevo", productoData);
  return res.data;
};

/**
 * Actualizar un producto
 * @param {number} id - ID del producto
 * @param {Object} productoData - Datos a actualizar
 * @returns {Promise} Producto actualizado
 */
export const updateProducto = async (id, productoData) => {
  const res = await api.put(`/api/productos/${id}`, productoData);
  return res.data;
};

/**
 * Eliminar un producto
 * @param {number} id - ID del producto
 * @returns {Promise} Confirmación
 */
export const deleteProducto = async (id) => {
  const res = await api.delete(`/api/productos/${id}`);
  return res.data;
};


// Función auxiliar para obtener el usuario actual del localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Función auxiliar para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default api;
