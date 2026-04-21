import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: '/register1.html', // Автоматты ашылатын бет
  },
  build: {
    rollupOptions: {
      input: {
        main: 'register1.html', // Негізгі кіру нүктесі
        login: 'index1.html',
        dashboard: 'dashboard.html',
      },
    },
  },
});