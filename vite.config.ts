// Critical Vite + Cloudflare Workers wiring — modifications can break Swell SDK integration.

import { defineConfig } from "vite";
import fs from "node:fs";
import path from "path";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// In a scaffolded storefront, swell.json lives one level up at the app root
// (sibling of frontend/). When running this repo standalone (no parent
// swell.json), fall back to swell.dev.json at the repo root so dev/build work.
const parentSwellJson = path.resolve(__dirname, "../swell.json");
const swellConfigPath = fs.existsSync(parentSwellJson)
  ? parentSwellJson
  : path.resolve(__dirname, "./swell.dev.json");

export default defineConfig({
  plugins: [react(), cloudflare()],
  build: {
    sourcemap: "hidden",
    rollupOptions: {
      output: {
        sourcemapExcludeSources: false,
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@theme": path.resolve(__dirname, "./theme"),
      "@swell-config": swellConfigPath,
    },
    // Force a single React copy when the SDK is symlinked from a workspace
    // that has its own dev react in node_modules. Include subpath modules
    // like `react/jsx-runtime` so JSX runtime helpers also dedupe.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router-dom",
    ],
  },
  optimizeDeps: {
    // Pre-bundle React-family deps so the SDK + app share the same copy
    // even when the SDK is symlinked from a workspace.
    //
    // The SDK is `exclude`d below (so source edits HMR), which means Vite does
    // NOT crawl it during the initial dep scan and never sees its transitive
    // deps up front. Without this, those deps get discovered lazily on the
    // first SDK import, Vite re-optimizes mid-session and reloads, and the
    // first page load 504s on stale `.vite/deps/chunk-*.js?v=` URLs. Listing
    // them here pre-bundles them on the cold start, so there is no re-optimize.
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand",
      "framer-motion",
      "swell-js",
      "immer",
      "clsx",
      "tailwind-merge",
    ],
    // Keep the SDK out of pre-bundling so source edits propagate via HMR
    // without needing `--force` or wiping node_modules/.vite. React dedup
    // is handled by `resolve.dedupe` above.
    exclude: [
      "@swell/storefront-app-sdk-core",
      "@swell/storefront-app-sdk-react",
    ],
  },
  // Allow dev server to serve files from the parent directory so that
  // `@swell-config` (../swell.json) is reachable in a scaffolded app.
  // `allowedHosts` covers the public preview tunnels used by swell dev.
  server: {
    fs: { allow: [".."] },
    allowedHosts: [".trycloudflare.com", ".swell.store"],
  },
});
