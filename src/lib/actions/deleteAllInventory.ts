'use server';

// lib/actions/deleteAllInventory.ts
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function deleteAllInventory() {
    const { userId } = await auth();
    if (!userId) throw new Error('Not authenticated');
  try {
    const deletedItems = await prisma.inventoryItem.deleteMany({});
    console.log(`Deleted ${deletedItems.count} inventory items.`);
  } catch (error) {
    console.error("Error deleting inventory items:", error);
  }
}
