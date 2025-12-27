import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures assets are loaded correctly from root
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    // No proxy needed anymore, direct DB connection via @neondatabase/serverless
  }
});