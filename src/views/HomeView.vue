 <!-- src/views/HomeView.vue -->
    <template>
      <div class="home-view">
        <h1 v-if="authenticatedUser">
          Bienvenido, {{ authenticatedUser.name }}
        </h1>
        <p>Desde aquí puedes gestionar el sistema y registrar nuevas multas.</p>

        <!-- Sección para crear una nueva multa -->
        <div class="create-multa-section">
          <h3>Registrar Nueva Multa</h3>
          <form @submit.prevent="handleCreateMulta">
            <div class="form-group">
              <label for="department">Departamento:</label>
              <select id="department" v-model="newMulta.department_id" required>
                <option disabled value="">Seleccione un departamento</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Descripción:</label>
              <textarea id="description" v-model="newMulta.description" rows="3" required></textarea>
            </div>

            <div class="form-group">
              <label for="amount">Monto ($):</label>
              <input type="number" id="amount" v-model.number="newMulta.amount" min="0" step="0.01" required />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit" :disabled="isLoading">
                <!-- Transición para el texto del botón -->
                <Transition name="fade" mode="out-in">
                  <span v-if="isLoading">Guardando...</span>
                  <span v-else>Guardar Multa</span>
                </Transition>
              </button>
            </div>
          </form>
        </div>

        <!-- Modal para mostrar el resultado -->
        <Modal :show="showModal" @close="showModal = false">
          <template #header>
            <h3 :class="modalIsError ? 'text-danger' : 'text-success'">
              {{ modalTitle }}
            </h3>
          </template>
          <template #body>
            <p>{{ modalMessage }}</p>
          </template>
        </Modal>

      </div>
    </template>

    <script setup>
    import { ref, onMounted, reactive } from 'vue';
    import { useAuth } from '@/composables/useAuth';
    import { useNotifications } from '@/composables/useNotifications'; // Para refrescar contador
    import apiService from '@/services/apiService';
    import Modal from '@/components/Modal.vue'; // Importa el componente Modal


    const { user: authenticatedUser } = useAuth();
    const { fetchUnreadCount } = useNotifications();

    // Estado del formulario y UI
    const departments = ref([]);
    const isLoading = ref(false);
    const newMulta = reactive({
      description: '',
      amount: null,
      department_id: ''
    });

    // Estado del Modal
    const showModal = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const modalIsError = ref(false);

    // Cargar departamentos cuando el componente se monta
    onMounted(async () => {
      try {
        const response = await apiService.getDepartments();
        departments.value = response.data;
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
        // Mostrar error en el modal
        modalTitle.value = "Error de Carga";
        modalMessage.value = "No se pudieron cargar los departamentos. Por favor, recarga la página.";
        modalIsError.value = true;
        showModal.value = true;
      }
    });

    const resetForm = () => {
      newMulta.description = '';
      newMulta.amount = null;
      newMulta.department_id = '';
    };

    const handleCreateMulta = async () => {
      isLoading.value = true;
      try {
        await apiService.createMulta(newMulta);
        
        // Mostrar modal de éxito
        modalTitle.value = "Operación Exitosa";
        modalMessage.value = "La multa ha sido registrada y se han enviado las notificaciones.";
        modalIsError.value = false;
        showModal.value = true;

        resetForm(); // Limpiar el formulario
        fetchUnreadCount(); // Actualizar el contador de notificaciones en la campana
      } catch (error) {
        console.error("Error al crear la multa:", error.response?.data);
        // Mostrar modal de error
        const apiErrors = error.response?.data?.errors;
        let errorMessage = "Ocurrió un error inesperado.";
        if (apiErrors) {
          errorMessage = Object.values(apiErrors).flat().join('\n');
        }
        modalTitle.value = "Error al Guardar";
        modalMessage.value = errorMessage;
        modalIsError.value = true;
        showModal.value = true;
      } finally {
        isLoading.value = false;
      }
    };
    </script>

    <style scoped>
    .home-view {
      max-width: 700px;
      margin: 0 auto;
    }
    .create-multa-section {
      margin-top: 30px;
      padding: 25px;
      background-color: #f9f9f9;
      border: 1px solid #e3e3e3;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 1em;
    }
    .form-actions {
      text-align: right;
    }
    .btn-submit {
      padding: 12px 25px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      font-weight: bold;
      transition: background-color 0.3s ease;
      /* Damos una altura y anchura mínima para que la transición de texto no cause un salto brusco */
      min-height: 45px;
      min-width: 130px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-submit:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
    .btn-submit:hover:not(:disabled) {
      background-color: #218838;
    }

    /* Estilos para las transiciones */
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.2s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }

    /* Clases para el color del texto del título del modal */
    
    </style>
    