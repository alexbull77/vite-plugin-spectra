import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const viteEnv: Record<string, string> = {};
Object.keys(process.env).forEach((key) => {
  if (key.startsWith(`VITE_`)) {
    viteEnv[`import.meta.env.${key}`] = process.env[key] ?? "";
  }
});

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "vite-plugin-spectra",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vite"],
    },
  },
  plugins: [
    dts({
      outDir: "dist",
      insertTypesEntry: true,
    }),
  ],
  define: viteEnv,
});
