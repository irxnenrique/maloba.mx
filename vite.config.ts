import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
      '@app-types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@admin-page': fileURLToPath(new URL('./src/pages/admin-page', import.meta.url)),
      '@home-page': fileURLToPath(new URL('./src/pages/home-page', import.meta.url)),
      '@not-found-page': fileURLToPath(new URL('./src/pages/not-found-page', import.meta.url)),
      '@project-page': fileURLToPath(new URL('./src/pages/project-page', import.meta.url)),
      '@projects-archive-page': fileURLToPath(
        new URL('./src/pages/projects-archive-page', import.meta.url),
      ),
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:4000',
      '/uploads': 'http://127.0.0.1:4000',
    },
  },
});
