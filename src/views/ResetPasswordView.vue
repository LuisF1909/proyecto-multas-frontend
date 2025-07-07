    <template>
      <div class="form-container">
        <h2>Restablecer Contraseña</h2>
        <form @submit.prevent="handleResetPassword">
          <!-- Campo oculto para el token -->
          <input type="hidden" v-model="credentials.token" />

          <div class="form-group">
            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" v-model="credentials.email" required />
          </div>
          <div class="form-group">
            <label for="password">Nueva Contraseña:</label>
            <input type="password" id="password" v-model="credentials.password" required />
          </div>
          <div class="form-group">
            <label for="password_confirmation">Confirmar Nueva Contraseña:</label>
            <input type="password" id="password_confirmation" v-model="credentials.password_confirmation" required />
          </div>

          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Guardando...' : 'Restablecer Contraseña' }}
          </button>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <div v-if="successMessage" class="back-to-login">
            <router-link :to="{ name: 'Login' }">Ir a Iniciar Sesión</router-link>
          </div>
        </form>
      </div>
    </template>

    <script setup>
    import { reactive, ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import apiService from '@/services/apiService';

    const route = useRoute();
    const router = useRouter();

    const credentials = reactive({
      token: '',
      email: '',
      password: '',
      password_confirmation: '',
    });

    const isLoading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');

    // Al montar el componente, obtenemos el token y el email de la URL
    onMounted(() => {
      credentials.token = route.params.token || '';
      credentials.email = route.query.email || '';
      if (!credentials.token || !credentials.email) {
        errorMessage.value = "Enlace inválido o incompleto.";
      }
    });

    const handleResetPassword = async () => {
      isLoading.value = true;
      successMessage.value = '';
      errorMessage.value = '';
      try {
        const response = await apiService.resetPassword(credentials);
        successMessage.value = response.data.message;
        // Opcional: redirigir al login después de unos segundos
        setTimeout(() => {
            router.push({ name: 'Login' });
        }, 3000);
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'No se pudo restablecer la contraseña.';
      } finally {
        isLoading.value = false;
      }
    };
    </script>

    <style scoped>
    /* Puedes reutilizar los estilos de LoginView.vue */
    .form-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .form-container h2 { text-align: center; margin-bottom: 20px; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 10px 15px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
    button:disabled { background-color: #aaa; }
    .success-message, .error-message { margin-top: 15px; padding: 10px; border-radius: 4px; text-align: center; }
    .success-message { background-color: #d4edda; color: #155724; }
    .error-message { background-color: #f8d7da; color: #721c24; }
    .back-to-login { text-align: center; margin-top: 20px; }
    </style>
    