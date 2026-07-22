import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/*
|--------------------------------------------------------------------------
| vite.config.js — Tailwind v4 setup
|--------------------------------------------------------------------------
|
| In Tailwind v3, styling was wired up via postcss.config.js + a separate
| tailwind.config.js theme file. In v4, that's replaced by the
| @tailwindcss/vite plugin below — it handles scanning your files and
| generating CSS directly inside Vite's build pipeline. No
| tailwind.config.js or postcss.config.js needed.
|
*/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});