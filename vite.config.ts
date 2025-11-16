import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [reactRouter(), tsconfigPaths()],
    base: env.VITE_BASE_PATH || '/',
    build: {
      ssr: true,
      outDir: 'build',
      cssMinify: true,
    },
    server: {
      port: 5173,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});