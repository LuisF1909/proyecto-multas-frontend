 <!-- src/components/Modal.vue -->
    <template>
      <!-- La transición 'modal-fade' anima la aparición del fondo y el modal -->
      <Transition name="modal-fade">
        <div v-if="show" class="modal-backdrop" @click="close">
          <div class="modal-content" @click.stop>
            <header class="modal-header">
              <!-- Slot para el título del modal -->
              <slot name="header">
                <h3>Mensaje del Sistema</h3>
              </slot>
              <button type="button" class="btn-close" @click="close">×</button>
            </header>

            <section class="modal-body">
              <!-- Slot para el contenido principal del modal -->
              <slot name="body">
                Contenido por defecto del cuerpo del modal.
              </slot>
            </section>

            <footer class="modal-footer">
              <!-- Slot para el pie de página del modal -->
              <slot name="footer">
                <button type="button" class="btn-green" @click="close">Cerrar</button>
              </slot>
            </footer>
          </div>
        </div>
      </Transition>
    </template>

    <script setup>
    // Define los props que el componente padre puede pasarle.
    // 'show' controla la visibilidad del modal.
    const props = defineProps({
      show: {
        type: Boolean,
        default: false,
      },
    });

    // Define los eventos que este componente puede emitir al padre.
    // 'close' se emite cuando el usuario quiere cerrar el modal.
    const emit = defineEmits(['close']);

    // Función para emitir el evento 'close'.
    const close = () => {
      emit('close');
    };
    </script>

    <style scoped>
    .modal-backdrop {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: #FFFFFF;
      box-shadow: 2px 2px 20px 1px;
      overflow-x: auto;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }

    .modal-header,
    .modal-footer {
      padding: 15px;
      display: flex;
    }

    .modal-header {
      position: relative;
      border-bottom: 1px solid #eeeeee;
      color: #4AAE9B;
      justify-content: space-between;
    }

    .modal-footer {
      border-top: 1px solid #eeeeee;
      flex-direction: column;
      justify-content: flex-end;
    }

    .modal-body {
      position: relative;
      padding: 20px 15px;
    }

    .btn-close {
      position: absolute;
      top: 0;
      right: 0;
      border: none;
      font-size: 20px;
      padding: 10px;
      cursor: pointer;
      font-weight: bold;
      color: #4AAE9B;
      background: transparent;
    }

    .btn-green {
      color: white;
      background: #4AAE9B;
      border: 1px solid #4AAE9B;
      border-radius: 2px;
      padding: 8px 15px;
      cursor: pointer;
      align-self: flex-end; /* Alinea el botón a la derecha */
    }

    /* Estilos para la transición del modal */
    .modal-fade-enter-from,
    .modal-fade-leave-to {
      opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
      transition: opacity 0.3s ease;
    }

    /* Animación para el contenido del modal (opcional) */
    .modal-fade-enter-from .modal-content,
    .modal-fade-leave-to .modal-content {
      transform: translateY(-20px);
    }

    .modal-fade-enter-active .modal-content,
    .modal-fade-leave-active .modal-content {
      transition: all 0.3s ease;
    }
    </style>
    