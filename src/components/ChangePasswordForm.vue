    <!-- src/components/ChangePasswordForm.vue -->
    <template>
      <div class="change-password-form-container">
        <h3>Cambiar Contraseña</h3>
        <p>Al cambiar tu contraseña, se cerrará la sesión en todos los demás dispositivos.</p>
        <form @submit.prevent="handleChangePassword">
          <div class="form-group">
            <label for="current_password">Contraseña Actual:</label>
            <input type="password" id="current_password" v-model="passwords.current_password" required />
          </div>
          <div class="form-group">
            <label for="new_password">Nueva Contraseña:</label>
            <input type="password" id="new_password" v-model="passwords.password" required />
          </div>
          <div class="form-group">
            <label for="password_confirmation">Confirmar Nueva Contraseña:</label>
            <input type="password" id="password_confirmation" v-model="passwords.password_confirmation" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit" :disabled="isLoading">
              <Transition name="fade" mode="out-in">
                <span v-if="isLoading">Actualizando...</span>
                <span v-else>Actualizar Contraseña</span>
              </Transition>
            </button>
          </div>
        </form>

        <!-- Mensajes de resultado -->
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </template>

    <script setup>
    import { reactive, ref } from 'vue';
    import apiService from '@/services/apiService';

    const passwords = reactive({
      current_password: '',
      password: '',
      password_confirmation: '',
    });

    const isLoading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');

    const resetForm = () => {
      passwords.current_password = '';
      passwords.password = '';
      passwords.password_confirmation = '';
    };

    const handleChangePassword = async () => {
      isLoading.value = true;
      successMessage.value = '';
      errorMessage.value = '';

      try {
        const response = await apiService.changePassword(passwords);
        successMessage.value = response.data.message;
        resetForm();
      } catch (error) {
        if (error.response && error.response.data.errors) {
          // Concatena todos los errores de validación de la API
          errorMessage.value = Object.values(error.response.data.errors).flat().join(' ');
        } else {
          errorMessage.value = error.response?.data?.message || 'Ocurrió un error inesperado.';
        }
      } finally {
        isLoading.value = false;
      }
    };
    </script>

    <style scoped>
    .change-password-form-container {
      margin-top: 30px;
      padding: 25px;
      background-color: #f9f9f9;
      border: 1px solid #e3e3e3;
      border-radius: 8px;
      max-width: 500px;
    }
    .change-password-form-container > p {
        font-size: 0.9em;
        color: #6c757d;
        margin-bottom: 20px;
    }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .form-actions { text-align: right; }
    .btn-submit { padding: 12px 25px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; min-height: 45px; min-width: 180px; display: inline-flex; align-items: center; justify-content: center; }
    .btn-submit:disabled { background-color: #aaa; cursor: not-allowed; }
    .btn-submit:hover:not(:disabled) { background-color: #0056b3; }
    .success-message, .error-message { margin-top: 15px; padding: 10px; border-radius: 4px; }
    .success-message { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .error-message { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }
    </style>
    