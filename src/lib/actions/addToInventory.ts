'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

export async function addToInventory(item: {
  upc: string;
  name: string;
  category?: string;
  brandOwner?: string;
  brand?: string;
  quantity?: string;
  imageUrl?: string;
  url?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  await prisma.inventoryItem.create({
    data: {
      userId,
      barcode: item.upc || null,
      name: item.name,
      category: item.category || null,
      brand: item.brand || null,
      product_quantity: item.quantity || null,
      imageUrl: item.imageUrl || null,
      nutrition: Prisma.JsonNull, // optional, unless you’re storing raw JSON from API
      ingredients: Prisma.JsonNull, // same

    },
  });
}
