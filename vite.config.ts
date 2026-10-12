import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import ui from "@nuxt/ui/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import theme from "./ui-theme.config.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), ui(theme)],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        background: resolve(import.meta.dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: (chunk) =>
          ["background"].includes(chunk.name)
            ? "assets/[name].js"
            : "assets/[name]-[hash].js",
      },
    },
  },
});
