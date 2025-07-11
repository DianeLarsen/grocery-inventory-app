"use client";

import { useState } from "react";
import EditInventoryModal from "./EditInventoryModal"; // you'll create this next
import type { InventoryItem } from "@/types";
import Image from "next/image";
import { updateItemQuantity, updateInventoryItem } from "@/lib/actions/updateItem";

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
const handleAdjustQuantity = async (item: InventoryItem, delta: number) => {
  const current = parseFloat(item.quantityAvailable || "0");
  const updatedQty = Math.max(current + delta, 0).toFixed(2);

  const updatedItem = { ...item, quantityAvailable: updatedQty };

  setItems((prev) =>
    prev.map((i) => (i.id === item.id ? updatedItem : i))
  );

  await updateItemQuantity(item.id, updatedQty); // persist to db
};
  
const handleSave = async (updated: InventoryItem) => {
  setItems((items) =>
    items.map((item) => (item.id === updated.id ? updated : item))
  );

  await updateInventoryItem(updated); // ✅ Persist to DB
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
  <div className="w-full border-2 border-border rounded-lg overflow-hidden">
    <div className="grid grid-cols-6 bg-muted text-sm font-semibold p-2 border-b-2 border-border">
      <div className="col-span-2">Item</div>
      <div>Quantity</div>
      <div>Unit</div>
      <div>Brand</div>
      <div>Edit</div>
    </div>
    {filteredItems.map((item, idx) => (
      <div
        key={item.id}
        className={`grid grid-cols-6 items-center p-2 border-b border-border ${
          idx % 2 === 0 ? "bg-background" : "bg-muted/50"
        }`}
      >
        <div className="col-span-2 flex items-center gap-2">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              className="w-10 h-10 object-cover rounded"
              width={40}
              height={40}
            />
          )}
          <span className="font-medium">{item.name}</span>
        </div>
        <div className="flex items-center gap-2">
  <button
    onClick={() =>
      handleAdjustQuantity(
        item,
        item.unit?.toLowerCase().includes("box") ? -0.25 : -1
      )
    }
    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
  >
    −
  </button>
  <span className="min-w-[3ch] text-center">
    {item.quantityAvailable || "-"}
  </span>
  <button
    onClick={() => handleAdjustQuantity(item, 1)}
    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
  >
    +
  </button>
</div>

        <div>{item.unit || "-"}</div>
        <div>{item.brand || "-"}</div>
        <div>
          <button
            onClick={() => setEditingItem(item)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
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
