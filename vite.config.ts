import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' to load env from current directory
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Safe string replacement for API Key
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      // Disable sourcemaps to avoid 'eval' usage in some build/preview environments
      sourcemap: false
    },
    server: {
      host: true
    }
  };
});