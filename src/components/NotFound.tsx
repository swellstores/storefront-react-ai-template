export function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center bg-background text-foreground">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
    </main>
  );
}
