// src/services/apiService.js
import axios from 'axios';

// Define la URL base de tu API Laravel.
// Es buena idea tomarla de variables de entorno en un proyecto real.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ¡IMPORTANTE! Para que Sanctum funcione con cookies (sesiones)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token de autenticación a las peticiones
// si lo estamos manejando manualmente (ej. tokens Bearer).
// Si confías principalmente en las cookies de Sanctum, esto es más para tokens explícitos.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejo global de errores (opcional pero útil)
apiClient.interceptors.response.use(
  (response) => response, // Simplemente devuelve la respuesta si es exitosa
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
        // Si es un error 401 (No autenticado) y no es un reintento
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marcar como reintento
            console.warn('ApiService: Error 401 - No autenticado o token expirado.');
            // Aquí podrías intentar refrescar el token si tuvieras esa lógica.
            // Por ahora, simplemente limpiaremos y redirigiremos (o dejaremos que el componente lo haga).
            localStorage.removeItem('user_auth_token');
            localStorage.removeItem('user_data');
            // Podríamos emitir un evento global o usar router.push, pero es mejor manejarlo en el contexto del componente
            // o en el guardia de navegación que ya tenemos.
            // window.location.href = '/login'; // Redirección forzada si es necesario
        }
    }
    return Promise.reject(error);
  }
);


// Función para la cookie CSRF (necesaria para Sanctum si no es una API sin estado)
// Se llama antes de login/register o cualquier petición POST/PUT/DELETE que modifique estado.
const getCsrfCookie = async () => {
    try {
        await axios.get( `${import.meta.env.VITE_API_CSRF_URL || 'http://127.0.0.1:8000'}/sanctum/csrf-cookie`, {
            withCredentials: true, // Asegúrate de que las cookies se envíen
        });
        console.log('CSRF cookie obtenida.');
    } catch (error) {
        console.error('Error al obtener la cookie CSRF:', error);
        // Considera cómo manejar este error. Si la cookie CSRF no se obtiene,
        // las peticiones POST/PUT/DELETE probablemente fallarán.
    }
};


export default {
  getApiClient: () => apiClient, // Para acceso directo si es necesario

  // Métodos de autenticación
  async login(credentials) {
    await getCsrfCookie(); // Asegura la cookie CSRF antes del login
    return apiClient.post('/login', credentials);
  },
  async register(userData) {
    await getCsrfCookie();
    return apiClient.post('/register', userData);
  },
  async logout() {
    // Si estás usando tokens Bearer, la invalidación del token se hace en el backend.
    // Si usas sesiones de Sanctum, la llamada a este endpoint debería cerrar la sesión en el backend.
    // No siempre es necesario llamar a getCsrfCookie() para logout si es una petición GET o si el token ya es suficiente.
    // Pero si tu endpoint de logout requiere CSRF, sí.
    // await getCsrfCookie(); // Descomentar si tu endpoint de logout lo requiere
    return apiClient.post('/logout');
  },
  async fetchUser() {
    return apiClient.get('/user');
  },

  // Métodos para Multas
  async getMultas(page = 1) {
    return apiClient.get(`/multas?page=${page}`);
  },
  async createMulta(multaData) {
    await getCsrfCookie();
    return apiClient.post('/multas', multaData);
  },
  async getMulta(id) {
    return apiClient.get(`/multas/${id}`);
  },

  // Métodos para Notificaciones
  async getNotifications(page = 1) {
    return apiClient.get(`/notifications?page=${page}`);
  },
  async getUnreadNotificationCount() {
    return apiClient.get('/notifications/unread-count');
  },
  async markNotificationAsRead(notificationId) {
    await getCsrfCookie();
    return apiClient.post(`/notifications/${notificationId}/mark-as-read`);
  },
  async deleteNotification(notificationId) {
    await getCsrfCookie();
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  async getDepartments() {
  return this.getApiClient().get('/departments');
},

};