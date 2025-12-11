# Cliente - Frontend del Proyecto

Frontend desarrollado con React, Vite y Tailwind CSS que se conecta con el backend mediante Axios.

## 📋 Tecnologías Utilizadas

### React 19.2.0
- **Descripción**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Uso en el proyecto**: Framework principal para crear componentes reutilizables y gestionar el estado de la aplicación.
- **Características**: Hooks modernos, componentes funcionales, gestión de estado.

### Vite 7.2.4
- **Descripción**: Herramienta de construcción y servidor de desarrollo ultrarrápido.
- **Uso en el proyecto**: Bundler y servidor de desarrollo que proporciona Hot Module Replacement (HMR) instantáneo.
- **Ventajas**: 
  - Inicio rápido del servidor de desarrollo
  - Recarga instantánea de cambios
  - Build optimizado para producción

### Axios 1.13.2
- **Descripción**: Cliente HTTP basado en Promesas para hacer peticiones al servidor.
- **Uso en el proyecto**: Se utiliza para todas las comunicaciones con la API del backend.

#### ¿Por qué Axios?
- **Sintaxis simple**: Más fácil de usar que `fetch()` nativo
- **Interceptores**: Permite modificar peticiones/respuestas automáticamente
- **Manejo de errores**: Mejor gestión de errores HTTP
- **Transformación automática**: Convierte JSON automáticamente
- **Cancelación de peticiones**: Permite cancelar peticiones en curso

#### Configuración de Axios en el proyecto:

```javascript
// src/services/api.js
import axios from "axios";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### Interceptores de Axios:

**Interceptor de Request (Peticiones):**
- Añade automáticamente el token JWT a todas las peticiones
- Lee el token del `localStorage` y lo incluye en el header `Authorization`

```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

**Interceptor de Response (Respuestas):**
- Maneja errores 401 (no autorizado)
- Limpia el token expirado del `localStorage`
- Redirige al login si el token es inválido

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

#### Ejemplo de uso de Axios:

```javascript
// Petición GET
const getProductos = async () => {
  const res = await api.get("/api/productos");
  return res.data;
};

// Petición POST
const login = async (email, contraseña) => {
  const res = await api.post("/api/auth/login", { email, contraseña });
  return res.data;
};

// Petición PUT
const updateUser = async (id, userData) => {
  const res = await api.put(`/api/users/${id}`, userData);
  return res.data;
};

// Petición DELETE
const deleteProducto = async (id) => {
  const res = await api.delete(`/api/productos/${id}`);
  return res.data;
};
```

### Tailwind CSS 4.1.17
- **Descripción**: Framework de CSS utility-first para diseño rápido.
- **Uso en el proyecto**: Estilos de todos los componentes usando clases utilitarias.
- **Configuración**: Usa `@tailwindcss/postcss` para v4.

### PostCSS 8.5.6
- **Descripción**: Herramienta para transformar CSS con plugins.
- **Uso en el proyecto**: Procesa Tailwind CSS y Autoprefixer.

## 🚀 Instalación

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto
   - Copia el contenido de `.env.example`:
     ```env
     VITE_API_URL=http://localhost:4000
     ```
   - Ajusta la URL según tu configuración del servidor

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

   El servidor se iniciará en `http://localhost:5173` (o el puerto disponible)

## ⚙️ Configuración

### Variables de Entorno

El proyecto usa variables de entorno con el prefijo `VITE_` para que Vite las exponga al cliente.

**Archivo `.env`:**
```env
VITE_API_URL=http://localhost:4000
```

**Uso en el código:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});
```

### Configuración de Tailwind CSS

**postcss.config.js:**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**src/index.css:**
```css
@import "tailwindcss";
```

### Configuración de Vite

**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## 📁 Estructura del Proyecto

```
Cliente/
│── src/
│   ├── components/
│   │   ├── Login.jsx          # Componente de inicio de sesión
│   │   └── Registro.jsx       # Componente de registro
│   ├── services/
│   │   └── api.js            # Configuración de Axios y funciones de API
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos globales con Tailwind
│── public/                   # Archivos estáticos
│── .env                      # Variables de entorno (no subir a git)
│── .env.example              # Ejemplo de variables de entorno
│── package.json              # Dependencias del proyecto
│── vite.config.js            # Configuración de Vite
│── tailwind.config.js        # Configuración de Tailwind
│── postcss.config.js         # Configuración de PostCSS
└── README.md                 # Este archivo
```

## 🛠️ Scripts Disponibles

### `npm run dev`
Inicia el servidor de desarrollo con Vite.
- Hot Module Replacement (HMR) activado
- Recarga automática en cambios
- Disponible en `http://localhost:5173`

### `npm run build`
Construye la aplicación para producción.
- Optimiza el código
- Minifica los archivos
- Genera la carpeta `dist/` lista para desplegar

### `npm run preview`
Previsualiza la build de producción localmente.
- Útil para probar la versión de producción antes de desplegar

### `npm run lint`
Ejecuta ESLint para verificar el código.
- Detecta errores y problemas de estilo
- Ayuda a mantener el código consistente

## 🔌 Conexión con el Backend

### Configuración de la API

El servicio de API está configurado en `src/services/api.js`:

1. **Instancia de Axios**: Se crea una instancia con la URL base del servidor
2. **Interceptores**: 
   - Añade el token JWT automáticamente a las peticiones
   - Maneja errores de autenticación
3. **Funciones exportadas**: Funciones para cada endpoint del backend

### Endpoints Disponibles

**Autenticación:**
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

**Usuarios:**
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario
- `POST /api/users/register` - Registrar nuevo usuario (público)
- `POST /api/users/create` - Crear usuario (requiere auth)
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

**Productos:**
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener un producto
- `POST /api/productos/nuevo` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para la autenticación:

1. **Login**: El usuario inicia sesión y recibe un token
2. **Almacenamiento**: El token se guarda en `localStorage`
3. **Peticiones**: Axios añade automáticamente el token en el header `Authorization`
4. **Expiración**: Si el token expira, se limpia y redirige al login

## 📝 Notas Importantes

- **Variables de entorno**: Los cambios en `.env` requieren reiniciar el servidor de desarrollo
- **CORS**: El backend debe tener CORS configurado para permitir peticiones desde el frontend
- **Token JWT**: Se almacena en `localStorage`, asegúrate de limpiarlo al cerrar sesión
- **Axios**: Todas las peticiones pasan por los interceptores configurados

## 🤝 Desarrollo

### Agregar un nuevo endpoint

1. Añade la función en `src/services/api.js`:
   ```javascript
   export const nuevaFuncion = async (data) => {
     const res = await api.post('/api/ruta', data);
     return res.data;
   };
   ```

2. Importa y usa en tu componente:
   ```javascript
   import { nuevaFuncion } from '../services/api';
   
   const handleClick = async () => {
     const data = await nuevaFuncion({ ... });
   };
   ```

## 📄 Licencia

ISC
