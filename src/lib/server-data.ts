import { connectToDatabase } from '@/lib/mongodb';

interface ProductSubset {
  _id: string;
  name: { en: string; rw: string };
  shortDescription?: { en: string; rw: string };
  description?: { en: string; rw: string };
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  discount?: number;
  hotDeal?: boolean;
  featured?: boolean;
}

async function fetchProducts(
  filter: Record<string, unknown>,
  limit: number = 10,
  sortDesc: boolean = true
): Promise<ProductSubset[]> {
  try {
    const db = await connectToDatabase();
    let cursor = db.collection('products').find(filter);
    if (sortDesc) cursor = cursor.sort({ createdAt: -1 });
    const products = await cursor.limit(limit).toArray();
    return products.map((p: any) => ({
      _id: p._id.toString(),
      name: p.name,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      images: p.images,
      category: p.category,
      categorySlug: p.categorySlug,
      brand: p.brand,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity,
      discount: p.discount,
      hotDeal: p.hotDeal,
      featured: p.featured,
    }));
  } catch {
    return [];
  }
}

export async function getAlmostGoneProducts(): Promise<ProductSubset[]> {
  return fetchProducts({ stockQuantity: { $gt: 0, $lte: 10 } }, 9, false);
}

export async function getPriceDroppedProducts(): Promise<ProductSubset[]> {
  return fetchProducts({ discount: { $gt: 0, $lte: 20 } }, 9, false);
}

export async function getJustLandedProducts(): Promise<ProductSubset[]> {
  const products = await fetchProducts({}, 20, true);
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }
  return products.slice(0, 9);
}

export async function getFeaturedProducts(): Promise<ProductSubset[]> {
  const products = await fetchProducts({ featured: true }, 20, true);
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }
  return products.slice(0, 20);
}
