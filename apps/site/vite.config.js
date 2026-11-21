import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `npm run build` writes the website to ../../public-site, which Nginx serves (see deploy/).
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: '../../public-site',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    watch: {
      usePolling: true,
    },
    // the panel API, when one runs locally (npm run dev in apps/api)
    proxy: { '/api': 'http://127.0.0.1:4000' },
  },
})
