// components/DeleteInventoryButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAllInventory } from "@/lib/actions/deleteAllInventory";

export default function DeleteInventoryButton() {
  const [confirmText, setConfirmText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    await deleteAllInventory();

    setLoading(false);
    setIsOpen(false); // ✅ Close the modal
    router.refresh();
  };

  return (
    <div className="mt-6">
      <button
        className="text-red-600 hover:underline text-sm"
        onClick={() => setIsOpen(true)}
      >
        ⚠️ Delete ALL Inventory
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              Are you sure you want to delete ALL inventory items?
            </h2>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. Type <strong>DELETE</strong> below
              to confirm.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full border px-3 py-2 rounded-md"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md bg-zinc-200 dark:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                disabled={confirmText !== "DELETE" || loading}
                onClick={handleDelete}
                className={`px-4 py-2 rounded-md text-white ${
                  confirmText === "DELETE"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
