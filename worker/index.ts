// Making changes to this file is **STRICTLY** forbidden.

import { Hono } from "hono";
import { logger } from "hono/logger";

import { Env, extractSwellConfig } from "./swell";

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());

app.notFound((c) => c.json({ success: false, error: "Not Found" }, 404));
app.onError((err, c) => {
  console.error(`[ERROR] ${err}`);
  return c.json({ success: false, error: "Internal Server Error" }, 500);
});

console.log(`Server is running`);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // API routes go through Hono
    if (pathname.startsWith("/api/")) {
      return app.fetch(request, env, ctx);
    }

    // Static assets: fetch from ASSETS binding, inject __SWELL__ into HTML
    const assetResponse = await env.ASSETS.fetch(request);

    const contentType = assetResponse.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return assetResponse;
    }

    // Extract public config from Swell platform headers, inject into HTML
    const swellConfig = extractSwellConfig(request);

    const html = await assetResponse.text();
    const injectedHtml = html.replace(
      "</head>",
      `<script>window.__SWELL__=${JSON.stringify(swellConfig)};</script>\n</head>`,
    );

    const headers = new Headers(assetResponse.headers);
    headers.set("content-type", "text/html; charset=utf-8");

    return new Response(injectedHtml, {
      status: assetResponse.status,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
