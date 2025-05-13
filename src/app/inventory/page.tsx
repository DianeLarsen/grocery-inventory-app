import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <p className="text-muted-foreground">This is the inventory page.</p>
    </div>
  );
}
