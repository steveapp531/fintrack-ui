// vite.config.js
// WHY: Registers the React plugin so Vite can handle JSX.
// The proxy block forwards /api/* calls to the Express backend
// during local development — no CORS preflight needed.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request to /api/* from the frontend is transparently
      // forwarded to the Express server on port 5001.
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});