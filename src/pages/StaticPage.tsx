import { TemplatePage, type PageTemplate } from "@swell/storefront-app-sdk-react";

export default function StaticPage({ content }: { content: PageTemplate }) {
  return <TemplatePage content={content} />;
}
