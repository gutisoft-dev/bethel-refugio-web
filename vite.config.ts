
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Aplicación publicada en la raíz del dominio
  base: "/",

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      // Actualización automática de la PWA
      registerType: "autoUpdate",

      // Manifest de Mi Refugio
      manifest: {
        id: "/",
        name: "Mi Refugio",
        short_name: "Mi Refugio",
        description:
          "Comparte, descubre y guarda la Palabra de Dios.",

        lang: "es",
        dir: "ltr",

        theme_color: "#6D28D9",
        background_color: "#FFFFFF",

        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/bethel-refugio-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/bethel-refugio-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/bethel-refugio-icon-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      // Configuración de Workbox
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],

  // Alias para importaciones
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },

  // Configuración de compilación
  build: {
    sourcemap: false,
  },
});
