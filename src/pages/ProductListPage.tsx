import { useSearchParams } from "react-router-dom";
import {
  ProductListProvider,
  TemplatePage,
  type PageTemplate,
} from "@swell/storefront-app-sdk-react";

export default function ProductListPage({ content }: { content: PageTemplate }) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <ProductListProvider searchParams={searchParams} setSearchParams={setSearchParams}>
      <TemplatePage content={content} />
    </ProductListProvider>
  );
}
