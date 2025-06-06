<!-- src/views/LoginView.vue -->
<template>
  <div class="login-view">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
      </button>
      <p v-if="authError" class="error-message">{{ authError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth'; // Importa el composable

const { attemptLogin, isLoading, error: authError } = useAuth(); // Obtén las funciones y estado del composable

const email = ref('it.user@example.com'); // Para pruebas, usa un usuario del seeder
const password = ref('password'); // Contraseña del seeder

const handleLogin = async () => {
  try {
    await attemptLogin({ email: email.value, password: password.value });
    // La redirección la maneja attemptLogin
  } catch (error) {
    // El error ya se maneja y se muestra a través de authError en el template
    console.log("LoginView: El error de login fue manejado por useAuth.");
  }
};
</script>

<style scoped>
/* ... (estilos existentes sin cambios) ... */
.login-view {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.login-view h2 {
  text-align: center;
  margin-bottom: 20px;
}
.login-view div {
  margin-bottom: 15px;
}
.login-view label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.login-view input[type="email"],
.login-view input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
.login-view button {
  width: 100%;
  padding: 10px 15px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.login-view button:disabled {
  background-color: #aaa;
}
.login-view button:hover:not(:disabled) {
  background-color: #4cae4c;
}
.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}
</style>