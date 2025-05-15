'use client';

export default function CardTest() {
  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]
 bg-cover bg-center p-8 text-foreground">
      <h1 className="text-2xl font-bold mb-6">Card Background Comparison</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tailwind config-based */}
        <div className="border border-border bg-card text-card-foreground p-6 rounded-xl shadow-lg backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-2">Using <code>bg-card</code></h2>
          <p>This card uses Tailwind&apos;s theme class <code>bg-card text-card-foreground</code>.</p>
        </div>

        {/* Arbitrary value */}
        <div className="border border-border bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 rounded-xl shadow-lg backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-2">Using <code>bg-[hsl(var(--card))]</code></h2>
          <p>This card uses <code>bg-[hsl(var(--card))]</code> and may behave differently on theme change.</p>
        </div>
      </div>
    </div>
  );
}
