'use server'

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getInventory() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const items = await prisma.inventoryItem.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return items.map((item) => ({
    ...item,
    addedAt: item.addedAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    decrementStep: item.decrementStep ?? undefined,
  }));
}
