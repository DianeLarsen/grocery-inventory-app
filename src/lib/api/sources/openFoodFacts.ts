interface SearchOptions {
  query: string;
  brand?: string;
  barcode?: string;
  limit?: number;
}

export async function searchOpenFoodFacts({
  query,
  brand,
  barcode,
  limit = 10,
}: SearchOptions) {
  try {
    const isBarcode = barcode || /^\d+$/.test(query);
    const searchValue = barcode || query;

    const url = isBarcode
      ? `https://world.openfoodfacts.org/api/v0/product/${searchValue}.json`
      : `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          searchValue
        )}&search_simple=1&action=process&json=1&page_size=100`; // Get more to filter from

    const res = await fetch(url, {
      headers: {
        "User-Agent": "GroceryInventoryApp/1.0 (+https://yourdomain.com)",
      },
    });

    if (!res.ok) {
      console.error(`❌ OpenFoodFacts error ${res.status}: ${res.statusText}`);
      return [];
    }

    const data = await res.json();

    const products = isBarcode
      ? [data.product]
      : data.products || [];

    if (!products || products.length === 0) return [];

    // Filter by name and optional brand
    const filtered = products
      .filter((p: any) => p?.product_name)
      .filter((p: any) => {
        if (!brand) return true;
        return p.brands?.toLowerCase().includes(brand.toLowerCase());
      });
      return filtered.map((product: any) => ({
        upc: product.code,
        name: product.product_name,
        category: product.categories,
        brandOwner: null,
        brand: product.brands,
        quantity: product.quantity || product.serving_size,
        imageUrl: product.image_url,
        url: `https://world.openfoodfacts.org/product/${product.code}`, // ✅ add link
      }));
      
  } catch (err) {
    console.error("OpenFoodFacts lookup failed:", err);
    return [];
  }
}

