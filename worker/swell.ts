/**
 * Swell infrastructure — header extraction and HTML config injection.
 *
 * The Swell platform proxy forwards request headers; this module reads only
 * the public ones (swell-store-id, swell-storefront-id, swell-public-key,
 * swell-admin-url) for injection into HTML as window.__SWELL__, which the
 * SDK uses to initialize.
 * Server-only credentials (e.g. swell-access-token) are intentionally not
 * exposed to the client.
 */

export interface Env {
  ASSETS: Fetcher;
}

/** Public Swell config injected into HTML as window.__SWELL__. */
export interface SwellClientConfig {
  storeId: string;
  storefrontId: string;
  publicKey: string;
  url: string;
}

/** Extract public Swell config from platform-injected request headers. */
export function extractSwellConfig(request: Request): SwellClientConfig {
  const storeId = request.headers.get("swell-store-id") || "";
  const storefrontId = request.headers.get("swell-storefront-id") || "";
  const publicKey = request.headers.get("swell-public-key") || "";
  const url = request.headers.get("swell-admin-url") || `https://${storeId}.swell.store`;
  return { storeId, storefrontId, publicKey, url };
}
