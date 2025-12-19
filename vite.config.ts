import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, Plugin } from "vite";
import { createServer } from "./server";


export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },


  test: {

    globals: true,

    environment: 'jsdom',

    setupFiles: [
      './client/test/setup.ts',
    ],

    include: ['client/**/*.test.tsx', 'client/**/*.spec.ts'],
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();


      server.middlewares.use(app);
    },
  };
}
