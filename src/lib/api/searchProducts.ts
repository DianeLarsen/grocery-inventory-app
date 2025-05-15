import { searchFoodDataCentral } from "./sources/foodDataCentral";
import { searchOpenFoodFacts } from "./sources/openFoodFacts";
import { searchFatSecret } from "./sources/fatSecret";

interface SearchOptions {
  query: string;
  brand?: string;
  barcode?: string;
  limit?: number; // This now controls display limit only, not data retrieval
  searchType?: "branded" | "raw" | undefined;
  
}


export async function searchProduct({ query, brand = undefined, barcode = undefined, searchType = "branded" }: SearchOptions) {
  const sources = [searchFatSecret, searchFoodDataCentral, searchOpenFoodFacts];

  let allResults: any[] = [];

  for (const source of sources) {
    try {
      const results = await source({
        query,
        brand,
        barcode,
        limit: 100,
        searchType,
      });

      if (Array.isArray(results) && results.length > 0) {
        allResults = [...allResults, ...results];
        // Do NOT break early — continue gathering from all sources
      }
    } catch (err) {
      console.warn(`⚠️ Search source failed: ${source.name}`, err);
    }
  }

  // ✅ Barcode and brand filtering can happen here — but DO NOT slice
  if (barcode) {
    console.log("There is a barcode", barcode);
    allResults = allResults.filter((item) => item.upc === barcode);
  }

  if (brand) {
    allResults = allResults.filter((item) =>
      item.brand?.toLowerCase().includes(brand.toLowerCase())
    );
  }

  return allResults;
}
