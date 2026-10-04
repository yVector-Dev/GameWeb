/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps every asset path relative, so the contents of `dist/`
// can be served from any folder of a static host (GitHub Pages, Netlify, S3…).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // The bundle carries the full text of three languages (hundreds of
    // events), which is most of its size; it is still ~210 kB gzipped.
    chunkSizeWarningLimit: 900,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
