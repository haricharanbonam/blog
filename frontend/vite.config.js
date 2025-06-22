import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import typography from "@tailwindcss/typography";

// https://vite.dev/config/
export default defineConfig({
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
              primary: "#4F46E5", // Indigo 600
              secondary: "#6B7280", // Gray 500
              accent: "#F59E0B", // Amber 500
            },
          },
        },
      // Add the typography plugin here
      },
    }),
  ],
});
