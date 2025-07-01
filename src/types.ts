// src/types.ts

export type InventoryItem = {
    id: string;
    upc?: string | null;
    name: string;
    brand?: string | null;
    category?: string | null;
    quantityAvailable?: string | null;  // e.g., "1/2"
    productSize?: string | null;        // e.g., "32oz bag"
    unit?: string | null;               // e.g., "bag"
    location?: string | null;
    notes?: string | null;
    lowThreshold?: string | null;
    imageUrl?: string | null;
    addedAt?: string;                   // ISO strings if fetched from JSON/REST
    updatedAt?: string;
    userId?: string;
    decrementStep?: string;
  };
  
  export type ProductResult = {
    upc: string;
    name: string;
    category?: string;
    brandOwner?: string;
    brand?: string;
    productSize?: string;         // e.g. "32oz box"
    quantityAvailable?: string;   // e.g. "1/2"
    imageUrl?: string;
    url?: string;
  };

  export type ManualInventoryInput = {
    upc?: string;
    name: string;
    brand?: string;
    category?: string;
    productSize?: string;
    quantityAvailable?: string;
    unit?: string;
    location?: string;
    notes?: string;
    lowThreshold?: string;
    imageUrl?: string;
    decrementStep: string;
  };
  
  export type SelectOption = { value: string; label: string };
