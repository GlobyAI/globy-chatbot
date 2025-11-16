import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({command})=>({
  plugins: [ reactRouter(), tsconfigPaths()],
  build:{
    cssMinify:true,
    ssr:true
  },
  base:import.meta.env.VITE_BASE_PATH || '/',
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: true
  }
}

));
