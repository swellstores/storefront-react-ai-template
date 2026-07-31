import { Route, Routes } from "react-router-dom";

import { useStorefront } from "@/commerce";
import { NotFound } from "@/fallbacks";

function Starter() {
  const { status, error } = useStorefront();

  return (
    <main className="grid min-h-screen place-items-center px-6 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-sm uppercase tracking-[0.2em] opacity-60">Swell Storefront</p>
        <h1 className="mt-4 text-4xl font-semibold">Ready for storefront generation</h1>
        <p className="mt-4 opacity-70">
          Replace this starter route with the generated React storefront. The commerce hooks live in{" "}
          <code>src/commerce</code>.
        </p>

        {status === "unconfigured" && (
          <p className="mt-6 text-sm opacity-60">
            Waiting for Swell platform headers from the storefront proxy.
          </p>
        )}

        {status === "error" && <p className="mt-6 text-sm text-red-600">{error?.message}</p>}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Starter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
