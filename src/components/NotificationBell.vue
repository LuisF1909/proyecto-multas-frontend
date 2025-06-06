<!-- src/components/NotificationBell.vue -->
<template>
  <div class="notification-bell-container">
    <button @click="goToNotifications" class="bell-button" title="Ver notificaciones">
      <span class="icon">🔔</span>
      <span v-if="actualUnreadCount > 0" class="badge">{{ displayCount }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotifications } from '@/composables/useNotifications'; // Importa el composable

const router = useRouter();
const { unreadCount: actualUnreadCount } = useNotifications(); // Usa el contador del composable

const displayCount = computed(() => {
  return actualUnreadCount.value > 99 ? '99+' : actualUnreadCount.value;
});

const goToNotifications = () => {
  router.push({ name: 'Notifications' });
};
</script>

<style scoped>
/* ... (estilos existentes sin cambios) ... */
.notification-bell-container {
  position: relative;
  display: inline-block;
}
.bell-button {
  background: none;
  border: none;
  font-size: 1.8em;
  color: #333;
  cursor: pointer;
  position: relative;
  padding: 5px;
}
.bell-button:hover .icon {
  opacity: 0.7;
}
.icon { }
.badge {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0.1em 0.4em;
  font-size: 0.5em;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  box-sizing: border-box;
}
</style>