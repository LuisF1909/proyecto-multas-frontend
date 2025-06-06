// src/composables/useAuth.js
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';

// Estado reactivo global para el usuario y el token
const user = ref(JSON.parse(localStorage.getItem('user_data')) || null);
const token = ref(localStorage.getItem('user_auth_token') || null);

export function useAuth() {
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const attemptLogin = async (credentials) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.login(credentials);
      token.value = response.data.access_token;
      user.value = response.data.user;
      localStorage.setItem('user_auth_token', token.value);
      localStorage.setItem('user_data', JSON.stringify(user.value));
      // Redirige a la ruta guardada en el query o a Home
      const redirectPath = router.currentRoute.value.query.redirect || '/';
      router.push(redirectPath);
      return response;
    } catch (err) {
      console.error('Error en login:', err.response?.data?.message || err.message);
      error.value = err.response?.data?.message || 'Error al iniciar sesión.';
      localStorage.removeItem('user_auth_token');
      localStorage.removeItem('user_data');
      token.value = null;
      user.value = null;
      throw err; // Relanza el error para que el componente lo maneje si es necesario
    } finally {
      isLoading.value = false;
    }
  };

  const attemptLogout = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      if (token.value) { // Solo intenta logout si hay un token
        await apiService.logout();
      }
    } catch (err) {
      console.error('Error en logout del backend:', err.response?.data?.message || err.message);
      // Incluso si el logout del backend falla, procedemos con la limpieza local
      // error.value = 'Error al cerrar sesión en el servidor, pero se limpiará localmente.';
    } finally {
      localStorage.removeItem('user_auth_token');
      localStorage.removeItem('user_data');
      token.value = null;
      user.value = null;
      isLoading.value = false;
      router.push({ name: 'Login' }); // Asegura redirección a Login
    }
  };

  const fetchAuthenticatedUser = async () => {
    if (!token.value) return; // No intentar si no hay token
    isLoading.value = true;
    try {
        const response = await apiService.fetchUser();
        user.value = response.data;
        localStorage.setItem('user_data', JSON.stringify(user.value));
    } catch (err) {
        console.error('Error al obtener datos del usuario autenticado:', err);
        // Si hay un error (ej. token inválido), podría ser buena idea desloguear
        if (err.response && err.response.status === 401) {
            await attemptLogout(); // Forzar logout si el token no es válido
        }
    } finally {
        isLoading.value = false;
    }
  };

  // Puedes añadir attemptRegister de manera similar

  return {
    user, // Usuario reactivo
    token, // Token reactivo
    isAuthenticated, // Booleano reactivo
    isLoading,
    error,
    attemptLogin,
    attemptLogout,
    fetchAuthenticatedUser,
  };
}