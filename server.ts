import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Supabase 클라이언트 (서버 사이드)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseServiceKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      console.log("Supabase server-side client initialized");
    } catch (error) {
      console.error("Supabase server-side initialization failed:", error);
    }
  } else {
    console.warn("Supabase environment variables missing. Server-side Supabase features will be disabled.");
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Secure AI Proxy (Example)
  app.post("/api/ai/chat", async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    try {
      // 여기서 서버 사이드에서 Gemini SDK를 호출합니다.
      // 클라이언트는 API 키를 알 필요가 없습니다.
      res.json({ reply: "서버 사이드 프록시를 통해 안전하게 전달된 응답입니다." });
    } catch (error) {
      res.status(500).json({ error: "AI request failed" });
    }
  });

  // OAuth Callback Route (사용자가 요청한 src/app/auth/callback/route.ts의 Express 구현체)
  app.get("/auth/callback", async (req, res) => {
    const code = req.query.code as string;
    const next = (req.query.next as string) || "/";

    if (code) {
      // 클라이언트 사이드에서 세션을 처리할 수도 있지만, 
      // 서버 사이드에서 코드를 세션으로 교환하는 로직을 여기에 구현할 수 있습니다.
      // 하지만 Vite SPA에서는 보통 클라이언트에서 처리하는 것이 일반적입니다.
      // 여기서는 단순히 메인 페이지로 리다이렉트하며, 
      // 클라이언트의 Supabase SDK가 URL의 해시나 쿼리 파라미터를 감지하여 세션을 설정합니다.
      return res.redirect(`${next}`);
    }

    res.redirect("/");
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
