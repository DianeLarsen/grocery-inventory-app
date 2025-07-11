"use client";

import { useState } from "react";
import { addToInventory } from "@/lib/actions/addToInventory";
import type { InventoryItem, ManualInventoryInput } from "@/types";
import {
  convertParsedToManual,
  parseReceiptText,
  isProductSizeCompatible,
  findMatchingInventoryItem,
} from "@/lib/utils";
import { updateInventoryQuantity } from "@/lib/actions/updateInventoryQuantity";

type ItemAction = "add" | "replace" | "skip";

type ParsedItemWithAction = {
  item: ManualInventoryInput;
  action: ItemAction;
  match?: InventoryItem;
  conflict?: string;
};

export default function ReceiptParser({
  initialInventory,
}: {
  initialInventory: InventoryItem[];
}) {
  const [text, setText] = useState("");
  const [parsedItems, setParsedItems] = useState<ParsedItemWithAction[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [store, setStore] = useState("fredmeyer");

  const handleParse = () => {
    const rawItems = parseReceiptText(text, store);
    const items = rawItems.map((parsed) => {
      const manual = convertParsedToManual(parsed, initialInventory);
      // console.log("after converted", manual)
      // console.log(initialInventory)
      const { match } = findMatchingInventoryItem(manual, initialInventory);
      // console.log(match)
      const conflict =
        match && !isProductSizeCompatible(manual.productSize, match.productSize)
          ? "Product size mismatch"
          : undefined;
      if (!match) {
        console.log("No match found for:", manual.name, "UPC:", manual.upc);
      }

      return {
        item: manual,
        action: (conflict ? "skip" : "add") as ItemAction,
        match,
        conflict,
      };
    });

    setParsedItems(items);
  };

  // const handleRemoveItem = (index: number) => {
  //   setParsedItems((prev) => prev.filter((_, i) => i !== index));
  // };
  const handleAddAll = async () => {
    setSubmitting(true);
    for (const entry of parsedItems) {
      if (entry.action === "add" || entry.action === "replace") {
        await addToInventory(entry.item);
      }
    }

    setSubmitting(false);
    setText("");
    setParsedItems([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <label className="text-sm font-medium">Store:</label>
        <select
          className="border px-3 py-2 rounded-md"
          value={store}
          onChange={(e) => setStore(e.target.value)}
        >
          <option value="fredmeyer">Fred Meyer</option>
          <option value="walmart">Walmart</option>
          <option value="safeway">Safeway</option>
        </select>
      </div>

      <textarea
        className="w-full min-h-[150px] p-3 border rounded-md"
        placeholder="Paste your receipt here (Fred Meyer, Walmart, Safeway, etc.)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          onClick={handleParse}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Parse Receipt
        </button>
        {parsedItems.length > 0 && (
          <button
            onClick={handleAddAll}
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            {submitting ? "Adding..." : `Add ${parsedItems.length} Items`}
          </button>
        )}
      </div>
      {parsedItems.length > 0 && (
        <div className="mt-4 space-y-2">
          {parsedItems.map((entry, i) => (
            <div
              key={i}
              className="p-3 border rounded bg-muted/50 text-sm flex justify-between items-start gap-4"
            >
              <div className="flex-1">
                <strong>{entry.item.name}</strong> — Qty:{" "}
                {entry.item.quantityAvailable} {entry.item.unit || ""} — Cost: $
                {entry.item.cost} <br />
                {entry.item.upc && (
                  <span className="text-muted-foreground">
                    UPC: {entry.item.upc}
                  </span>
                )}
                {entry.match && (
                  <div className="text-xs text-amber-700 mt-1">
                    {entry.conflict ? (
                      <>⚠️ Conflict: {entry.conflict}</>
                    ) : (
                      <>
                        Matched to <strong>{entry.match?.name}</strong>
                        {entry.match?.unit && ` (${entry.match.unit})`}
                        {entry.match?.location && ` in ${entry.match.location}`}
                        . Choose action:
                      </>
                    )}
                  </div>
                )}
                <div className="flex gap-2 mt-1">
                  {entry.match && (
                    <button
                      onClick={async () => {
                        try {
                          const qty = parseFloat(
                            entry.item.quantityAvailable || "0"
                          );
                          const result = await updateInventoryQuantity(
                            entry.item.upc,
                            entry.item.name,
                            qty
                          );
                          if (result.success) {
                            setParsedItems((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            );
                          } else {
                            alert(
                              result.message || "Failed to update quantity."
                            );
                          }
                        } catch (err) {
                          console.error("Failed to add to current:", err);
                          alert("Something went wrong.");
                        }
                      }}
                      className="text-xs px-2 py-1 rounded border bg-green-500 text-white hover:bg-green-600"
                    >
                      Add to current
                    </button>
                  )}

                  {entry.match && (
                    <button
                      onClick={() =>
                        setParsedItems((prev) =>
                          prev.map((p, idx) =>
                            idx === i ? { ...p, action: "replace" } : p
                          )
                        )
                      }
                      className={`text-xs px-2 py-1 rounded border ${
                        entry.action === "replace"
                          ? "bg-blue-500 text-white"
                          : "hover:bg-blue-100"
                      }`}
                    >
                      Replace
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setParsedItems((prev) =>
                        prev.map((p, idx) =>
                          idx === i ? { ...p, action: "skip" } : p
                        )
                      )
                    }
                    className={`text-xs px-2 py-1 rounded border ${
                      entry.action === "skip"
                        ? "bg-red-500 text-white"
                        : "hover:bg-red-100"
                    }`}
                  >
                    Skip
                  </button>
                </div>
              </div>
              <button
                onClick={() =>
                  setParsedItems((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="text-red-600 hover:underline text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
