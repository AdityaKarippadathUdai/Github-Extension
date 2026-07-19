import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(() => {
  return {
    plugins: [react()],
    publicDir: false,
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
      target: "es2020",
      rollupOptions: {
        input: {
          popup: path.resolve(__dirname, "public/popup.html")
        },
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]"
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  };
});
