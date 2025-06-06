<!-- src/views/NotificationsView.vue -->
<template>
  <div class="notifications-view">
    <h2>Mis Notificaciones</h2>
    <button @click="refreshNotifications" :disabled="isLoading" class="refresh-button">
      <span class="icon-refresh">🔄</span> Actualizar
    </button>
    <div v-if="isLoading" class="loading-indicator">
      Cargando notificaciones...
    </div>
    <div v-else-if="currentNotifications.length === 0" class="no-notifications">
      No tienes notificaciones nuevas.
    </div>
    <ul v-else class="notification-list">
      <li v-for="notification in currentNotifications" :key="notification.id" class="notification-item">
        <div class="message-content">
          <p><strong>{{ notification.multa?.description || 'Notificación del sistema' }}</strong></p>
          <p>{{ notification.message }}</p>
        </div>
        <div class="details">
          <small>Recibida: {{ new Date(notification.created_at).toLocaleString() }}</small>
          <div class="actions">
              <button @click="handleMarkAsRead(notification.id)" title="Marcar como leída">✔️ Marcar Leída</button>
              <button @click="handleDeleteNotification(notification.id)" class="delete-btn" title="Eliminar notificación">🗑️ Eliminar</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="viewError" class="error-message">{{ viewError }}</p>
  </div>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications';
import { computed, onMounted } from 'vue'; // onMounted para la carga inicial

// Obtén las funciones y el estado del composable de notificaciones
const {
  notifications: currentNotifications, // Renombrado para evitar conflicto si se usa 'notifications' localmente
  isLoadingNotifications: isLoading, // Renombrado
  notificationError: viewError,      // Renombrado
  fetchUserNotifications,
  markNotificationAsReadAndRemove,
  deleteNotificationFromList,
} = useNotifications();

const handleMarkAsRead = async (id) => {
  await markNotificationAsReadAndRemove(id);
};

const handleDeleteNotification = async (id) => {
  await deleteNotificationFromList(id);
};

const refreshNotifications = () => {
    fetchUserNotifications(); // Llama a la función del composable para recargar
}

// Carga las notificaciones cuando el componente se monta
// El watch en useNotifications también se encarga de esto si el usuario se loguea.
// Pero si ya está logueado y navega aquí, esto asegura la carga.
onMounted(() => {
  fetchUserNotifications();
});
</script>

<style scoped>
.notifications-view {
  padding: 20px;
}
.notifications-view h2 {
  margin-bottom: 15px;
}
.refresh-button {
  margin-bottom: 20px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}
.refresh-button:hover {
  background-color: #0056b3;
}
.refresh-button .icon-refresh {
  margin-right: 5px;
}
.loading-indicator, .no-notifications {
  text-align: center;
  padding: 20px;
  color: #777;
}
.notification-list {
  list-style-type: none;
  padding: 0;
}
.notification-item {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* Para responsiveness */
}
.message-content {
    flex-basis: 100%; /* Ocupa todo el ancho inicialmente */
    margin-bottom: 10px;
}
.message-content p {
  margin: 0 0 5px 0;
}
.details {
    flex-basis: 100%;
    text-align: right; /* Alinea las acciones a la derecha */
}
.details small {
  color: #777;
  font-size: 0.9em;
  display: block; /* Para que las acciones se pongan debajo */
  margin-bottom: 5px;
}
.actions button {
    margin-left: 10px; /* Espacio entre botones */
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85em;
}
.actions button.delete-btn {
    background-color: #fdd;
    border-color: #fbb;
    color: #c00;
}
.actions button.delete-btn:hover {
    background-color: #fcc;
}
.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}

/* Para pantallas más grandes, podemos poner el contenido y las acciones en línea */
@media (min-width: 600px) {
    .notification-item {
        flex-wrap: nowrap; /* Evita que los elementos se envuelvan */
        align-items: center; /* Centra verticalmente */
    }
    .message-content {
        flex-basis: auto; /* Permite que crezca según el contenido */
        flex-grow: 1; /* Ocupa el espacio disponible */
        margin-bottom: 0; /* Sin margen inferior */
    }
    .details {
        flex-basis: auto; /* Tamaño según contenido */
        text-align: right;
    }
     .details small {
        display: inline; /* Muestra la fecha en línea */
        margin-right: 15px; /* Espacio antes de los botones */
        margin-bottom: 0;
    }
}
</style>