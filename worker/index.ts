import { Env, extractSwellConfig } from "./swell";

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.startsWith("/api/")) {
      return Response.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    // Static assets: fetch from ASSETS binding, inject public Swell config.
    const assetResponse = await env.ASSETS.fetch(request);

    const contentType = assetResponse.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return assetResponse;
    }

    // Extract public config from Swell platform headers, inject into HTML
    const swellConfig = extractSwellConfig(request);

    const html = stripViteDevClient(await assetResponse.text());
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

function stripViteDevClient(html: string) {
  return html.replace(/\s*<script\b[^>]*\bsrc=["']\/@vite\/client["'][^>]*><\/script>\s*/g, "\n");
}
