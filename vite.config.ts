import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_PROXY_TARGET?.trim() || "http://127.0.0.1:8080";

  return {
    plugins: [react(), isDev && screenGraphPlugin()],
    publicDir: "./static",
    base: "./",
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    server: {
      // 仅开发时启用代理；目标由 VITE_PROXY_TARGET 控制（.env.development / .env.production）
      ...(isDev && {
        proxy: {
          "/api": {
            target: proxyTarget,
            changeOrigin: true,
            secure: false,
            timeout: 30000,
            configure: (proxy) => {
              proxy.on("error", (err, _req, res) => {
                console.warn("[vite proxy] 后端未启动或连接被重置，请先运行后端: cd wukeda-backend && make run");
              });
            },
          },
        },
      }),
    },
  };
});
