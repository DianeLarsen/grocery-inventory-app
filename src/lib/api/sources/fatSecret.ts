import { getFatSecretToken } from "./fatSecretAuth";

interface SearchOptions {
  query: string;
  limit?: number;
}

export async function searchFatSecret({ query, limit = 10 }: SearchOptions) {
  const token = await getFatSecretToken();

  const res = await fetch(
    `https://platform.fatsecret.com/rest/server.api?method=foods.search&format=json&search_expression=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  const foods = data?.foods?.food || [];

  return foods.slice(0, limit).map((item: any) => ({
    upc: null,
    name: item.food_name,
    category: item.food_type,
    brandOwner: null,
    brand: item.brand_name || null,
    productSize: null,
    imageUrl: null,
    url: `https://www.fatsecret.com/calories-nutrition/${item.food_url}`,
  }));
}
