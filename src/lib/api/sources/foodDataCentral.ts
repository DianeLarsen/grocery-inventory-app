interface SearchOptions {
    query: string;
    brand?: string;
    barcode?: string;
    limit?: number;
  }
  
  export async function searchFoodDataCentral({
    query,
    brand,
    barcode,
  }: SearchOptions) {
    const key = process.env.NEXT_PUBLIC_USDA_API_KEY;
    if (!key) throw new Error("Missing USDA_API_KEY");
  
    let finalQuery = "";
  
    if (barcode) {
      finalQuery = barcode; // Don't mix with query or brand
    } else if (brand && query) {
      finalQuery = `${query} ${brand}`;
    } else {
      finalQuery = query;
    }
  
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      finalQuery
    )}&dataType=Branded&pageSize=100&api_key=${key}`;
  
    console.log("🔍 USDA search:", url);
  
    const res = await fetch(url);
    const data = await res.json();
  
    if (!data.foods) {
      console.warn("⚠️ USDA returned no 'foods' for:", finalQuery);
      return [];
    }
  
    let items = data.foods;
  
    // Exact barcode match
    if (barcode) {
      items = items.filter((item: any) => item.gtinUpc === barcode);
    }
  
    // Brand filter
    if (brand && !barcode) {
      items = items.filter((item: any) =>
        item.brandName?.toLowerCase().includes(brand.toLowerCase())
      );
    }
  
    if (items.length === 0) {
      console.warn("⚠️ No USDA matches after filtering.");
      return [];
    }
  
    return items.map((item: any) => ({
      upc: item.gtinUpc,
      name: item.description,
      category: item.foodCategory,
      brandOwner: item.brandOwner,
      brand: item.brandName,
      quantity: item.packageWeight || "",
      imageUrl: null,
      url: `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${item.fdcId}/branded`,
    }));
  }
  