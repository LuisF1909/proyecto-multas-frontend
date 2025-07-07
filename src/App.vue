<!-- src/App.vue -->
<template>
  <div id="app-container">
    <header v-if="isAuthenticated"> <!-- Usar isAuthenticated del composable -->
      <nav>
        <router-link to="/">Inicio</router-link> |
        <router-link to="/notifications">Notificaciones</router-link> |
        <router-link to="/profile">Mi Perfil</router-link>
      </nav>
      <div class="header-actions">
        <NotificationBell />
        <button @click="handleLogout" class="logout-button" :disabled="isAuthLoading">
          {{ isAuthLoading ? 'Cerrando...' : 'Logout' }}
        </button>
      </div>
    </header>
    <hr v-if="isAuthenticated"/>

    <main>
      <router-view />
    </main>

    <footer>
      <p>&copy; {{ new Date().getFullYear() }} Sistema de Multas y Notificaciones</p>
    </footer>
  </div>
</template>

<script setup>
// Ya no necesitamos 'computed' aquí directamente para isAuthenticated, vendrá de useAuth
// Ya no necesitamos 'useRouter' aquí directamente para logout, vendrá de useAuth
import NotificationBell from './components/NotificationBell.vue';
import { useAuth } from '@/composables/useAuth'; // Importa el composable de autenticación
import { onMounted } from 'vue';

const { isAuthenticated, attemptLogout, isLoading: isAuthLoading, fetchAuthenticatedUser, user } = useAuth();

const handleLogout = async () => {
  await attemptLogout();
  // La redirección la maneja attemptLogout
};

// Al montar la app, si hay un token, intentar obtener los datos del usuario
// para asegurar que la sesión/token sigue siendo válida.
onMounted(() => {
  if (isAuthenticated.value && !user.value) { // Si hay token pero no datos de usuario (ej. después de refrescar página)
    fetchAuthenticatedUser();
  }
});
</script>

<style scoped>
/* ... (estilos existentes sin cambios) ... */
#app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e7e7e7;
}
nav {
  padding: 0;
  background-color: transparent;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}
nav a.router-link-exact-active {
  color: #42b983;
}
.header-actions {
  display: flex;
  align-items: center;
}
.logout-button {
  margin-left: 15px;
  padding: 8px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-button:hover {
  background-color: #5a6268;
}
.logout-button:disabled {
  background-color: #aaa;
}
hr {
    border: none;
    border-top: 1px solid #e7e7e7;
    margin-bottom: 20px;
}
main {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  min-height: 300px;
  background-color: #fff;
}
footer {
  margin-top: 30px;
  font-size: 0.9em;
  color: #777;
  text-align: center;
}
</style>