import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://server-ancient-night-8092.fly.dev",//change this to site where backend is hosted
                changeOrigin: true
            }
        }
    }
})
