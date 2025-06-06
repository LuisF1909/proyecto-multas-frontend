// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // Importa el módulo 'path' de Node.js para resolver rutas

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // AÑADE ESTA SECCIÓN 'resolve' PARA CONFIGURAR LOS ALIAS
  resolve: {
    alias: {
      // La clave '@' se mapeará a la ruta del directorio '/src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})