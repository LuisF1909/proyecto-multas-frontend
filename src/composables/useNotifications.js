// src/composables/useNotifications.js
import { ref, onMounted, onUnmounted, watch } from 'vue';
import apiService from '@/services/apiService';
import { useAuth } from './useAuth'; // Para reaccionar a cambios de autenticación

// Estado reactivo global para las notificaciones y el contador
const notifications = ref([]);
const unreadCount = ref(0);
const isLoadingNotifications = ref(false);
const notificationError = ref(null);
let pollingIntervalId = null;

export function useNotifications() {
  const { isAuthenticated, token } = useAuth(); // Obtener estado de autenticación

  const fetchUnreadCount = async () => {
    if (!isAuthenticated.value) { // Solo intentar si está autenticado
        unreadCount.value = 0; // Resetea si no está autenticado
        return;
    }
    try {
      // console.log('Polling: Fetching unread count...');
      const response = await apiService.getUnreadNotificationCount();
      unreadCount.value = response.data.unread_count;
      notificationError.value = null;
    } catch (err) {
      console.error("Error fetching unread notification count:", err.response?.data?.message || err.message);
      // No necesariamente un error fatal para el polling, podría ser temporal
      // notificationError.value = 'Error al obtener contador de notificaciones.';
      if (err.response && err.response.status === 401) {
        unreadCount.value = 0; // Si es 401, probablemente ya no está autenticado
      }
    }
  };

  const fetchUserNotifications = async () => {
    if (!isAuthenticated.value) {
        notifications.value = [];
        return;
    }
    isLoadingNotifications.value = true;
    notificationError.value = null;
    try {
      const response = await apiService.getNotifications(); // Asume que este endpoint devuelve las no leídas paginadas
      notifications.value = response.data.data; // Ajusta si la estructura de tu API es diferente
      // El contador se actualiza por polling o se podría deducir aquí también
    } catch (err) {
      console.error("Error fetching user notifications:", err.response?.data?.message || err.message);
      notificationError.value = 'Error al cargar las notificaciones.';
       if (err.response && err.response.status === 401) {
        notifications.value = [];
      }
    } finally {
      isLoadingNotifications.value = false;
    }
  };

  const markNotificationAsReadAndRemove = async (notificationId) => {
    if (!isAuthenticated.value) return;
    try {
      await apiService.markNotificationAsRead(notificationId);
      // Eliminar de la lista local y actualizar contador
      notifications.value = notifications.value.filter(n => n.id !== notificationId);
      await fetchUnreadCount(); // Re-calcula el contador
    } catch (err) {
      console.error("Error marking notification as read:", err.response?.data?.message || err.message);
      notificationError.value = 'Error al marcar notificación como leída.';
    }
  };

  const deleteNotificationFromList = async (notificationId) => {
    if (!isAuthenticated.value) return;
    try {
      await apiService.deleteNotification(notificationId);
      // Eliminar de la lista local y actualizar contador
      notifications.value = notifications.value.filter(n => n.id !== notificationId);
      await fetchUnreadCount();
    } catch (err) {
      console.error("Error deleting notification:", err.response?.data?.message || err.message);
      notificationError.value = 'Error al eliminar notificación.';
    }
  };

  // Iniciar polling cuando el composable se usa por primera vez y el usuario está autenticado
  // y detenerlo cuando ya no se usa o el usuario se desloguea.
  const startPolling = () => {
    if (pollingIntervalId) clearInterval(pollingIntervalId); // Limpiar intervalo existente
    if (isAuthenticated.value) {
      fetchUnreadCount(); // Llamada inicial
      pollingIntervalId = setInterval(fetchUnreadCount, 15000); // Polling cada 15 segundos
      // console.log('Notification polling started. Interval ID:', pollingIntervalId);
    }
  };

  const stopPolling = () => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
      // console.log('Notification polling stopped.');
    }
  };

  // Observar cambios en el estado de autenticación para iniciar/detener el polling
  watch(isAuthenticated, (newValue, oldValue) => {
    if (newValue) {
        // console.log('User authenticated, starting polling and fetching notifications.');
        fetchUserNotifications(); // Cargar notificaciones al loguearse
        startPolling();
    } else {
        // console.log('User logged out, stopping polling and clearing notifications.');
        stopPolling();
        notifications.value = [];
        unreadCount.value = 0;
    }
  }, { immediate: true }); // immediate: true para ejecutar al montar si ya está autenticado


  // Limpiar el intervalo cuando el componente que lo usa se desmonta (si es el último)
  // Aunque con el watch en isAuthenticated, esto se maneja mejor.
  // onUnmounted(() => {
  //   stopPolling();
  // });

  // Esto es más para asegurar que al cargar la app, si ya está autenticado, inicie.
  // onMounted(() => {
  //   if(isAuthenticated.value) {
  //      startPolling();
  //      fetchUserNotifications();
  //   }
  // });


  return {
    notifications, // Lista de notificaciones para la vista de notificaciones
    unreadCount,   // Contador para la campana
    isLoadingNotifications,
    notificationError,
    fetchUserNotifications,
    markNotificationAsReadAndRemove,
    deleteNotificationFromList,
    fetchUnreadCount, // Exponer para refresco manual si es necesario
  };
}