import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Serves /api/* from the local `api/` folder during `npm run dev`, the way Vercel does in production.
// Secrets come from .env.local (git-ignored) and stay on the server; they are never sent to the browser.
function localApi() {
  return {
    name: "local-api",
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ""));
      server.middlewares.use("/api/contact", async (req, res) => {
        try {
          const mod = await server.ssrLoadModule("/api/contact.js");
          await mod.default(req, res);
        } catch (err) {
          server.config.logger.error(String(err?.message ?? err));
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "Local API error." }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localApi()],
  server: {
    port: 5173,
    host: true,
  },
});
