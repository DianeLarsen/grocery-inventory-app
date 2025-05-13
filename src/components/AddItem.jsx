'use client'

import { addItem } from '@/lib/addItem'
import { useRef } from 'react'

export default function AddItem() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addItem(formData)
        formRef.current?.reset()
      }}
      className="flex flex-col p-4 space-y-4"
    >
      <input name="name" placeholder="Item name" className="input" required />
      <input name="quantity" placeholder="Quantity" type="number" className="input" />
      <input name="imageUrl" placeholder="Cloudinary image URL" className="input" />
      <textarea name="notes" placeholder="Notes..." className="input" />
      <button type="submit" className="btn">Add Item</button>
    </form>
  )
}
