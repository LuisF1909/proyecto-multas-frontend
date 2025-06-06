// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Importa los componentes de las vistas
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import NotificationsView from '../views/NotificationsView.vue';
// import NotFoundView from '../views/NotFoundView.vue'; // Si creas una vista 404

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView, // Asigna el componente
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView, // Asigna el componente
        meta: { guestOnly: true }
    },
    {
        path: '/notifications',
        name: 'Notifications',
        component: NotificationsView, // Asigna el componente
        meta: { requiresAuth: true }
    }
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('user_auth_token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } }); // Guarda la ruta a la que se quería ir
    } else if (to.meta.guestOnly && isAuthenticated) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router;