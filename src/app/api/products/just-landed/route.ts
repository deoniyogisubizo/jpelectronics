import { NextResponse } from 'next/server';
import { getProductSubset, connectToDatabase } from '@/lib/db';

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
    const products = await withRetry(() => getProductSubset({}, 9, true));
    for (let i = products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [products[i], products[j]] = [products[j], products[i]];
    }
    return NextResponse.json(products);
  } catch (error) {
    console.error('Just landed API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
