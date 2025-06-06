// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importa nuestra configuración del router

// Si tienes un archivo CSS global (Vite usualmente crea uno como style.css o main.css)
// import './style.css' // o './assets/main.css' dependiendo de tu estructura

const app = createApp(App)

app.use(router) // Dile a la aplicación Vue que use el router

app.mount('#app')