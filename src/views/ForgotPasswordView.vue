    <template>
      <div class="form-container">
        <h2>Recuperar Contraseña</h2>
        <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        <form @submit.prevent="handleForgotPassword">
          <div class="form-group">
            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Enviando...' : 'Enviar Enlace' }}
          </button>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <div class="back-to-login">
            <router-link :to="{ name: 'Login' }">Volver a Iniciar Sesión</router-link>
          </div>
        </form>
      </div>
    </template>

    <script setup>
    import { ref } from 'vue';
    import apiService from '@/services/apiService';

    const email = ref('');
    const isLoading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');

    const handleForgotPassword = async () => {
      isLoading.value = true;
      successMessage.value = '';
      errorMessage.value = '';
      try {
        const response = await apiService.forgotPassword(email.value);
        successMessage.value = response.data.message;
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Ocurrió un error. Por favor, intenta de nuevo.';
      } finally {
        isLoading.value = false;
      }
    };
    </script>

    <style scoped>
    /* Puedes reutilizar los estilos de LoginView.vue o crear unos nuevos */
    .form-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .form-container h2 { text-align: center; margin-bottom: 10px; }
    .form-container p { text-align: center; margin-bottom: 20px; font-size: 0.9em; color: #666; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
    button:disabled { background-color: #aaa; }
    .success-message, .error-message { margin-top: 15px; padding: 10px; border-radius: 4px; text-align: center; }
    .success-message { background-color: #d4edda; color: #155724; }
    .error-message { background-color: #f8d7da; color: #721c24; }
    .back-to-login { text-align: center; margin-top: 20px; }
    </style>
    