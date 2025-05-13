'use server';

import { searchProduct } from '@/lib/api/searchProducts';

export async function searchProductAction(formData: FormData) {
    const query = formData.get('query')?.toString() || '';
    const brand = formData.get('brand')?.toString() || '';
    const barcode = formData.get('barcode')?.toString() || '';
    const limit = parseInt(formData.get('limit')?.toString() || '10', 10);
  
    const result = await searchProduct({ query, barcode, limit,  brand });
    return result;
  }
  
