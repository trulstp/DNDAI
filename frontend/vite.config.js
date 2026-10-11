import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Port 3000 is the origin the backend's CORS setting allows
  server: { port: 3000 },
  preview: { port: 3000 },
  build: {
    // Netlify publishes the build folder
    outDir: "build",
    // Terser takes a couple of seconds longer than the default but makes the JS about 4% smaller
    minify: "terser",
  },
});
