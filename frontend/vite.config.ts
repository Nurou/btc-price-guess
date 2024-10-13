import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
