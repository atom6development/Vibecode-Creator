import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // o mesmo alias precisa existir no jsconfig.json, para o editor
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
