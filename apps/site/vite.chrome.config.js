import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The website header + footer as <primo-site-header>/<primo-site-footer> for the panel's pages.
// Runs after the main build and adds public-site/site-chrome.js next to it.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: '../../public-site',
    emptyOutDir: false,
    copyPublicDir: false,
    chunkSizeWarningLimit: 1500,
    lib: { entry: 'src/chrome.jsx', formats: ['es'], fileName: () => 'site-chrome.js' },
    assetsInlineLimit: 100000,
  },
})
