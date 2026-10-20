import { defineConfig } from 'vite';

export default defineConfig({
  // Capacitor serves files with relative paths; root '/' breaks in native WebViews
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  server: { host: true },
});
