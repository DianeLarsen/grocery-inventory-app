import { getFatSecretToken } from "./fatSecretAuth";

interface SearchOptions {
    query: string;
    brand?: string;
    barcode?: string;
    limit?: number; // This now controls display limit only, not data retrieval
    searchType?: "branded" | "raw" | undefined;
    
  }

export async function searchFatSecret({ query,  brand = undefined,
    barcode = undefined, limit = 10, searchType = "raw" }: SearchOptions) {
console.log("Searching FatSecret...")
  const token = await getFatSecretToken();
  if (barcode) {
    console.log("FatSecret: skipping  barcode-specific search");
    return [];
  }
  console.log("Still Searching FatSecret...")
  const res = await fetch(
    `https://platform.fatsecret.com/rest/server.api?method=foods.search&format=json&search_expression=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
//   console.log(res)
  if (!res.ok) {
    console.error(`❌ FatSecret API failed: ${res.statusText}`);
    return [];
  }
  
  const data = await res.json();
if (data.error) {
    console.error(`❌ FatSecret API failed: ${data.message}`);
    return []
}
  const foods = data?.foods?.food || [];
console.log(foods[0])
  return foods.slice(0, limit).map((item: any) => ({
    upc: null,
    name: item.food_name,
    category: item.food_type,
    brandOwner: null,
    brand: item.brand_name || null,
    productSize: null,
    imageUrl: null,
    url: item.food_url 
    ? item.food_url 
    : null,
  }));
}
