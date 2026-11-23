import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The page and its sample document are the ones in `../source`; only the packages differ.
export default defineConfig({
  base: './',
  publicDir: '../source/public',
  plugins: [react()],
});
