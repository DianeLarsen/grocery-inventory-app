"use client";

import { useState } from "react";
import EditInventoryModal from "./EditInventoryModal"; // you'll create this next
import type { InventoryItem } from "@/types";
import Image from "next/image";

export default function InventoryList({
  initialItems,
}: {
  initialItems: InventoryItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    lowStockOnly: false,
  });

  const handleSave = (updated: InventoryItem) => {
    setItems(items.map((item) => (item.id === updated.id ? updated : item)));
    setEditingItem(null);
  };
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      !filters.category || item.category === filters.category;
    const matchesLocation =
      !filters.location || item.location === filters.location;
    const isLowStock =
      !filters.lowStockOnly ||
      (item.lowThreshold &&
        parseFloat(item.quantityAvailable || "0") <=
          parseFloat(item.lowThreshold));
    return matchesCategory && matchesLocation && isLowStock;
  });

  return (
    <div className="mt-8 ">
      <h2 className="text-lg font-semibold mb-4">📦 Current Inventory</h2>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
          className="themed-select"
        >
          <option value="">All Categories</option>
          {[...new Set(items.map((i) => i.category).filter(Boolean))].map(
            (cat) => (
              <option key={cat} value={cat!}>
                {cat}
              </option>
            )
          )}
        </select>

        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((f) => ({ ...f, location: e.target.value }))
          }
          className="themed-select"
        >
          <option value="">All Locations</option>
          {[...new Set(items.map((i) => i.location).filter(Boolean))].map(
            (loc) => (
              <option key={loc} value={loc!}>
                {loc}
              </option>
            )
          )}
        </select>

        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={filters.lowStockOnly}
            onChange={(e) =>
              setFilters((f) => ({ ...f, lowStockOnly: e.target.checked }))
            }
            className="form-checkbox"
          />
          Low Stock Only
        </label>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-muted-foreground">No items match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card p-4 rounded-xl shadow flex gap-4"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                  width={16}
                  height={16}
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.quantityAvailable || "-"} {item.unit || ""} •{" "}
                  {item.brand || "No brand"}
                </p>
              </div>
              <button
                onClick={() => setEditingItem(item)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {editingItem && (
        <EditInventoryModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
