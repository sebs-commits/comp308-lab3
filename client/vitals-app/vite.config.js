// product-app/vite.config.js for productApp
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  server: {
    port: 3002, // Specify the port to avoid conflicts
  },
  plugins: [
    react(),
    federation({
      name: "vitalsApp",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App", // Adjust the path to your main App or specific component
      },
      shared: ["react", "react-dom", "@apollo/client", "graphql"],
    }),
    tailwindcss(),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
