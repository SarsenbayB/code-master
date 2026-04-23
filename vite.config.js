import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  server: {
    open: '/register1.html',
  },
  build: {
    rollupOptions: {
      input: {
        main: 'register1.html',
        login: 'index1.html',
        dashboard: 'dashboard.html',
        b: 'b.html',
      },
    },
  },
});