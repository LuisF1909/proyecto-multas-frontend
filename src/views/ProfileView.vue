<template>
  <div class="profile-view">
    <h2>Mi Perfil</h2>
    <p>Aquí puedes gestionar los ajustes de tu cuenta.</p>

    <ChangePasswordForm />
  </div>
</template>

<script setup>
// Importamos el componente del formulario para usarlo en esta vista
import ChangePasswordForm from '@/components/ChangePasswordForm.vue';
</script>

<style scoped>
.profile-view {
  max-width: 700px;
  margin: 0 auto;
}
</style>