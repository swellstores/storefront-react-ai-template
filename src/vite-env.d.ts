/// <reference types="vite/client" />

declare module "@swell-config" {
  const config: {
    id: string;
    name: string;
    description?: string;
    type: string;
    version: string;
    storefront?: {
      theme?: {
        pages?: Array<{
          id: string;
          label: string;
          url: string;
          collection?: string;
        }>;
        design?: {
          voice: string;
          audience: string;
          mood: string;
        };
      };
    };
    [key: string]: unknown;
  };
  export default config;
}
