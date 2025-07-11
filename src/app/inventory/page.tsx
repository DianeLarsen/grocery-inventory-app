// app/inventory/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProductSearch from "@/components/ProductSearch";
import InventoryList from "@/components/InventoryList";
import { getInventory } from "@/lib/actions/getInventory";
import ManualAddForm from "@/components/ManualAddForm";
import ReceiptParser from "@/components/ReceiptParser";
import DeleteInventoryButton from "@/components/DeleteInventoryButton";

export default async function InventoryPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const items = await getInventory();
  if (!items) {

  }

 return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">View and manage your inventory.</p>
      </div>

      <div className="bg-card p-4 rounded-xl shadow space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">🔎 Search & Add Products</h2>
          <ProductSearch />
        </div>

        <hr />

        <div>
          <h2 className="text-lg font-semibold mb-4">🧾 Add Groceries from Receipt</h2>
          <ReceiptParser initialInventory={items} />
        </div>

        <hr />

        <div>
          <h2 className="text-lg font-semibold mb-4">📝 Add Product Manually</h2>
          <ManualAddForm />
        </div>
      </div>

      <InventoryList initialItems={items} />
      <DeleteInventoryButton />

    </div>
  );
}
