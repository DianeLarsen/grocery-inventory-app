import ProductSearch from "@/components/ProductSearch";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipes Section */}
        <div className="bg-card shadow-md rounded-xl p-4 col-span-2">
          <h2 className="text-lg font-semibold mb-2">🍽️ Recipes You Can Make</h2>
          <p className="text-muted-foreground text-sm">
            Recipes using ingredients currently in stock.
          </p>
          <div className="mt-4 text-sm italic text-muted">Coming soon...</div>
        </div>

        {/* Grocery List */}
        <div className="bg-card shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">🛒 Grocery List</h2>
          <p className="text-muted-foreground text-sm">
            Items you&apos;ve added for your next grocery trip.
          </p>
          <div className="mt-4 text-sm italic text-muted">Coming soon...</div>
        </div>

        {/* Low Inventory Alerts */}
        <div className="bg-card shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">⚠️ Low Inventory</h2>
          <p className="text-muted-foreground text-sm">
            Things you&apos;re running low on.
          </p>
          <div className="mt-4 text-sm italic text-muted">Coming soon...</div>
        </div>

        {/* Product Search */}
        <div className="bg-card shadow-md rounded-xl p-4 col-span-2">
          <h2 className="text-lg font-semibold mb-2">🔎 Add to Inventory</h2>
          <ProductSearch />
        </div>
      </div>
    </div>
  );
}
