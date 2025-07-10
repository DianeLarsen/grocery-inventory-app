import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { InventoryItem, ManualInventoryInput } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const requiredFields: (keyof ManualInventoryInput)[] = [
  "name",
  "category",
  "productSize",
  "quantityAvailable",
  "unit",
  "location",
  "notes",
  "lowThreshold",
  "decrementStep",
];


export function hasMissingFields(item: Partial<ManualInventoryInput>): boolean {
  return requiredFields.some((field) => !item[field] || item[field]?.toString().trim() === "");
}

export function guessDecrementStep(productSize?: string | null, unit?: string | null): string {
  if (!productSize || !unit) return "1";

  const sizeMatch = productSize.match(/([\d.]+)/);
  const sizeValue = sizeMatch ? parseFloat(sizeMatch[1]) : 1;

  if (unit.toLowerCase().includes("oz") || productSize.toLowerCase().includes("oz")) {
    return (Math.max(0.1, sizeValue / 10)).toFixed(1);
  }

  if (unit.toLowerCase().includes("ml") || productSize.toLowerCase().includes("ml")) {
    return (Math.max(1, sizeValue / 100)).toFixed(1);
  }

  if (productSize.toLowerCase().includes("count")) {
    return "1";
  }

  return "1";
}

export function normalizeToManualInput(
  data: Partial<InventoryItem>
): ManualInventoryInput {
  return {
    name: data.name ?? "Unnamed Item", // or throw an error if this is unacceptable
    upc: data.upc ?? undefined,
    brand: data.brand ?? "",
    category: data.category ?? "",
    productSize: data.productSize ?? "",
    quantityAvailable: data.quantityAvailable ?? "",
    unit: data.unit ?? "",
    location: data.location ?? "",
    notes: data.notes ?? "",
    lowThreshold: data.lowThreshold ?? "",
    imageUrl: data.imageUrl ?? "",
    decrementStep: data.decrementStep ?? "1",
  };
}