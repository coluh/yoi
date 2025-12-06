import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: "/index.html",
        idea: "/idea.html",
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3200",
        changeOrigin: true,
      },
    },
  },
});
