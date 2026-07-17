import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Keep the file-linked validators package under the client's dependency
    // tree so its runtime imports (notably zod) resolve on clean CI builds.
    preserveSymlinks: true,
    dedupe: ["zod"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@validators": path.resolve(__dirname, "../shared/validators/src"),
    },
  },
});
