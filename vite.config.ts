import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

console.log(path.resolve(__dirname, "./lib"));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@lib/*": path.resolve(__dirname, "./lib"),
      "@constants/*": path.resolve(__dirname, "./constants"),
      "@context/*": path.resolve(__dirname, "./context"),
      "@features/*": path.resolve(__dirname, "./features"),
      "@utils/*": path.resolve(__dirname, "./utils"),
    },
  },
});
