import { swellStorefront } from "@swell/storefront-app-sdk-react/vite";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// In a scaffolded storefront, swell.json lives one level up at the app root
// (sibling of frontend/). When running this repo standalone (no parent
// swell.json), fall back to swell.dev.json at the repo root so dev/build work.
const parentSwellJson = path.resolve(__dirname, "../swell.json");
const swellConfigPath = fs.existsSync(parentSwellJson)
  ? parentSwellJson
  : path.resolve(__dirname, "./swell.dev.json");

export default swellStorefront(__dirname, { swellConfigPath });
