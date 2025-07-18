interface SearchOptions {
  query: string;
  brand?: string;
  barcode?: string;
  limit?: number;
  searchType?: string;
}

export async function searchOpenFoodFacts({
  query,
  brand,
  barcode,
  limit = 10,
  searchType = undefined,
}: SearchOptions) {
  try {
    const isBarcode = Boolean(barcode || (/^\d{8,14}$/.test(query))); // 8–14 digit codes
    const searchValue = barcode || query;
    const isRaw = searchType === "raw";
  
    
    // Adjust your search URL accordingly

    const url = isBarcode
      ? `https://world.openfoodfacts.org/api/v0/product/${searchValue}.json`
      : `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          searchValue
        )}&search_simple=1&action=process&json=1&page_size=100${
          isRaw ? "&tagtype_0=ingredients" : "&tagtype_0=brands"
        }`;

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

    // ✅ Barcode lookup returns a single product object
    if (isBarcode && data?.product?.product_name) {
      return [
        {
          upc: data.product.code,
          name: data.product.product_name,
          category: data.product.categories,
          brandOwner: null,
          brand: data.product.brands,
          productSize: data.quantity || data.serving_size,
          imageUrl: data.product.image_url,
          url: `https://world.openfoodfacts.org/product/${data.product.code}`,
        },
      ];
    }

    // ✅ Fallback: search results
    const products = data.products || [];
    if (!products.length) return [];

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
      productSize: product.quantity || product.serving_size,
      imageUrl: product.image_url,
      url: `https://world.openfoodfacts.org/product/${product.code}`,
    }));
  } catch (err) {
    console.error("OpenFoodFacts lookup failed:", err);
    return [];
  }
}


