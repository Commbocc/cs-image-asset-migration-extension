import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import ui from "@nuxt/ui/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import theme from "./ui-theme.config.ts";
import { manifestPlugin } from "./vite-plugins/manifest.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ui(theme),
    manifestPlugin((pkg) => ({
      manifest_version: 3,
      name: pkg.name || "cs-image-asset-migration-extension",
      version: pkg.version || "0.0.1",
      permissions: ["activeTab", "scripting", "storage", "tabs", "identity"],
      host_permissions: ["<all_urls>"],
      action: {
        default_popup: "index.html",
      },
      background: {
        service_worker: "assets/background.js",
        type: "module",
      },
      key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyqlwxdiZKTDO0kVBQCb6zsrpal1E8weVz33G8lz5uH5I0Ax+lC+4KHvWpt3XZ5qyVSON3C38MYZYvr63WJaOOG981cm1Zpt3U7CAM329N6I8EfcL3cOSZVfBQCZqsyxrpgVDsWb9foejAu73ixxmrpgV9kZTnNKpdSUhZFuV2eGQfKTSN2wbN12KXx5SNi7q+ViZ72LYx0nDi3JPhvSfIxa/5tUZmqkrmdUxPUdrxALRdfEQcKs1MPGD9Mo6ISu8yWV33g2M1l0b/N4wuCHtGFPlUOBNJUI8E2xRTr8+KQd4Y6ettNXVQv3Cc1v7r42QP2wNQq1GqBv90BJ5uKmvyQIDAQAB",
    })),
  ],

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
