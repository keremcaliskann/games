import { defineConfig } from 'vite';

export default defineConfig({
  // Capacitor serves files with relative paths; root '/' breaks in native WebViews
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        // Split large vendor libraries into independent chunks
        manualChunks: {
          three: ['three'],
          rapier: ['@dimforge/rapier3d-compat'],
        },
      },
    },
  },
  // Allows testing on mobile devices over local Wi-Fi
  server: { host: true },
});
