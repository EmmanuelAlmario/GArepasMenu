import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cliente del menu digital (desacoplado del backend Spring Boot).
// La URL de la API se configura con VITE_API_URL (ver .env.example).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})