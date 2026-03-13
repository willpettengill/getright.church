export const metadata = {
  title: "Blunch — Get Right Church",
  description: "Coming soon.",
};

export default function BlunchPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-8 md:px-6">
      <div className="text-center">
        <p className="label-mono mb-4">Coming Soon</p>
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
          Blunch
        </h1>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
          Something is brewing here. Check back soon.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:0.2s]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}
