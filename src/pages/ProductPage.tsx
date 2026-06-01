import { useParams } from "react-router-dom";
import {
  ProductProvider,
  TemplatePage,
  type PageTemplate,
} from "@swell/storefront-app-sdk-react";

export default function ProductPage({ content }: { content: PageTemplate }) {
  const { slug } = useParams<{ slug: string }>();

  return (
    <ProductProvider slug={slug}>
      <TemplatePage content={content} />
    </ProductProvider>
  );
}
