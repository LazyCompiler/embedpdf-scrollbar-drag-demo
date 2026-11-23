import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Relative base: the build is served from a GitHub Pages project path.
export default defineConfig({
  base: './',
  plugins: [react()],
});
