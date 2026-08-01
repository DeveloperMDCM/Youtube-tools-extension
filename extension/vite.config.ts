import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  base: process.env.EXT_BUILD === '1' ? './' : '/',
  // Avoid picking up root postcss.config.js (Tailwind v3 leftover)
  css: {
    postcss: {
      plugins: [],
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@popup': path.resolve(__dirname, 'src/popup'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/dev-build'),
    emptyOutDir: true,
    sourcemap: true,
  },
});
