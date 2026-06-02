import { NextResponse } from 'next/server';
import { getProductSubset, connectToDatabase } from '@/lib/db';

async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (attempts > 1 && err.message?.includes('Topology is closed')) {
      // Force a fresh connection and retry once.
      await connectToDatabase({ timeoutMS: 5000 });
      return fn();
    }
    throw err;
  }
}

export async function GET() {
  try {
    const products = await withRetry(() => getProductSubset(
      { stockQuantity: { $gt: 0, $lte: 10 } },
      9,
      false
    ));
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Almost gone API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
