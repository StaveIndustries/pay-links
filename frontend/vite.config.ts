import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend dev server proxies /api to the backend (see backend README).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
});
