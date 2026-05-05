import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import typography from "@tailwindcss/typography";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL, // ✅ correct
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [
      react(),
      tailwindcss({
        config: {
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
            "./public/index.html",
          ],
          theme: {
            extend: {
              colors: {
                primary: "#4F46E5",
                secondary: "#6B7280",
                accent: "#F59E0B",
              },
            },
          },
        },
      }),
    ],
  });
};