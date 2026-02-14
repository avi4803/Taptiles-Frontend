import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'worker-obtained-blonde-personals.trycloudflare.com' // Replace with the hostname you want to allow
      // You can add more hostnames to the array if needed
    ]
  }
})
