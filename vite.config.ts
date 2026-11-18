import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        id: "/",
        name: "Mi Refugio",
        short_name: "miRefugio",
        description:
          "Comparte, descubre y guarda la Palabra de Dios.",

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
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});