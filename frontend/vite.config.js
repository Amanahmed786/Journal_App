import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Default to 8081 (dev profile port in application-dev.yml) or 8080 if specified
  const backendTarget = env.VITE_BACKEND_URL || 'http://localhost:8081';

  return {
    plugins: [react()],
    base: './', // Ensures relative asset paths work anywhere including Spring Boot static serving
    server: {
      port: 5173,
      proxy: {
        '/public': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/user': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/Journal': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health-check': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: process.env.VERCEL ? 'dist' : path.resolve(__dirname, '../src/main/resources/static'),
      emptyOutDir: true,
    },
  };
});
