import axios from "axios";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token y corregir Content-Type en FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Con FormData no fijar Content-Type: el navegador pone multipart/form-data + boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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
  // No fuerces logout aquí: en tu app sin router, esto provoca “me echa al F5”
  // Deja que App.jsx decida qué hacer.
  window.dispatchEvent(new Event("auth:unauthorized"));

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

export const getApiBaseURL = () => import.meta.env.VITE_API_URL || "http://localhost:4000";

// Función auxiliar para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// ==================== EMPLEADOS ====================

/**
 * Obtener todos los empleados
 * @returns {Promise} Lista de empleados
 */
export const getEmpleados = async () => {
  const res = await api.get("/api/empleados");
  return res.data;
};

/**
 * Crear un nuevo empleado
 * @param {Object} empleadoData - Datos del empleado
 * @returns {Promise} Empleado creado
 */
export const createEmpleado = async (empleadoData) => {
  const res = await api.post("/api/empleados", empleadoData);
  return res.data;
};

// ==================== CATEGORÍAS ====================

/**
 * Obtener todas las categorías
 * @returns {Promise} Lista de categorías
 */
export const getCategorias = async () => {
  const res = await api.get("/api/categorias");
  return res.data;
};

// ==================== CATÁLOGO PÚBLICO ====================

/**
 * Obtener productos del catálogo público (sin auth)
 * @returns {Promise} Lista de productos
 */
export const getCatalogoProductos = async () => {
  const res = await api.get("/api/catalogo/productos");
  return res.data;
};

// ==================== PEDIDOS ====================

/**
 * Crear un nuevo pedido
 * @param {{ items: { id_producto: number, cantidad: number }[] }} pedidoData
 * @returns {Promise} Pedido creado con detalles
 */
export const createPedido = async (pedidoData) => {
  const res = await api.post("/api/pedidos", pedidoData);
  return res.data;
};

/**
 * Obtener pedidos del usuario autenticado
 * @returns {Promise} Lista de pedidos con detalles
 */
export const getMisPedidos = async () => {
  const res = await api.get("/api/pedidos/mis-pedidos");
  return res.data;
};

export default api;

