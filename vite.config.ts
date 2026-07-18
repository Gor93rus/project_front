import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Добавляем настройки сервера, чтобы он слушал ваш IP-адрес в локальной сети
  server: {
    host: true,
    port: 5173,
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
