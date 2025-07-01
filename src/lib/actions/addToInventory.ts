'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import type { ManualInventoryInput } from '@/types';

export async function addToInventory(item: ManualInventoryInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  await prisma.inventoryItem.create({
    data: {
      userId,
      barcode: item.upc || null,
      name: item.name,
      category: item.category || null,
      brand: item.brand || null,
      productSize: item.productSize || null,
      quantityAvailable: item.quantityAvailable || null,
      unit: item.unit || null,
      location: item.location || null,
      notes: item.notes || null,
      lowThreshold: item.lowThreshold || null,
      imageUrl: item.imageUrl || null,
      decrementStep: item.decrementStep || null,
      nutrition: Prisma.JsonNull,
      ingredients: Prisma.JsonNull,
    },
  });
}
