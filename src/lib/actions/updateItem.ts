// lib/actions/updateItem.ts
'use server'
import type { InventoryItem } from '@/types';
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateItemQuantity(id: string, newQuantity: string) {
  try {
    await prisma.inventoryItem.update({
      where: { id },
      data: { quantityAvailable: newQuantity },
    })

    revalidatePath('/inventory') // if your route is /inventory
    return { success: true }
  } catch (err) {
    console.error('Update failed:', err)
    return { success: false, message: 'Failed to update quantity' }
  }
}

export async function updateInventoryItem(item: InventoryItem) {
  try {
    await prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        name: item.name,
        brand: item.brand,
        category: item.category,
        quantityAvailable: item.quantityAvailable,
        productSize: item.productSize,
        unit: item.unit,
        location: item.location,
        notes: item.notes,
        lowThreshold: item.lowThreshold,
        imageUrl: item.imageUrl,
      },
    });

    revalidatePath('/inventory');
    return { success: true };
  } catch (err) {
    console.error('Error updating item:', err);
    return { success: false, message: 'Failed to update item' };
  }
}
