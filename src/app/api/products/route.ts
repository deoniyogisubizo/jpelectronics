import { NextResponse } from 'next/server';
import { getAllProducts, getProductById, createProduct } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const categorySlug = searchParams.get('categorySlug') || searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const hotDeal = searchParams.get('hotDeal') === 'true' ? true : undefined;

    const filter: any = {};
    if (category) filter.category = category;
    if (categorySlug) filter.categorySlug = categorySlug;
    if (brand) filter.brand = brand;
    if (featured) filter.featured = true;
    if (hotDeal) filter.hotDeal = true;

    const products = await getAllProducts(filter);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productData = {
      name: body.name,
      description: body.description || { en: 'New product description', rw: 'Umwirondoro mushya' },
      shortDescription: body.shortDescription || { en: 'Short description', rw: 'Umwirondoro muto' },
      price: body.price,
      images: body.images || [],
      category: body.category,
      categorySlug: body.categorySlug || body.category.toLowerCase().replace(/\s+/g, '-'),
      brand: body.brand,
      inStock: body.inStock !== undefined ? body.inStock : true,
      stockQuantity: body.stockQuantity,
      tags: body.tags || [],
      featured: body.featured || false,
      hotDeal: body.hotDeal || false,
    };

    const result = await createProduct(productData);
    return NextResponse.json({ success: true, id: result.toString() });
  } catch (error) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
