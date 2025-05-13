'use server'

import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function addItem(formData: FormData) {
  const user = await currentUser()
  if (!user) throw new Error("Not authenticated")

  const name = formData.get('name')?.toString() || ''
  const quantity = parseInt(formData.get('quantity')?.toString() || '1', 10)
  const imageUrl = formData.get('imageUrl')?.toString() || ''
  const notes = formData.get('notes')?.toString() || ''

  await prisma.inventoryItem.create({
    data: {
      name,
      quantity,
      imageUrl,
      notes,
      createdBy: user.id,
    }
  })
}
