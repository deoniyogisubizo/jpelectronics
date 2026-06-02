import { NextResponse } from 'next/server';
import { getCategories, createCategory, connectToDatabase } from '@/lib/db';

async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (attempts > 1 && err.message?.includes('Topology is closed')) {
      await connectToDatabase({ timeoutMS: 5000 });
      return fn();
    }
    throw err;
  }
}

export async function GET() {
  try {
    const categories = await withRetry(() => getCategories());
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoryData = {
      name: body.name,
      slug: body.slug,
      image: body.image,
      featured: body.featured || false,
      productCount: body.productCount || 0
    };

    const result = await createCategory(categoryData);
    return NextResponse.json({ success: true, id: result.toString() });
  } catch (error) {
    console.error('Create category API error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
