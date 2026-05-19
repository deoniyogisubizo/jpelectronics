import { NextResponse } from 'next/server';
import { getProductSubset } from '@/lib/db';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET() {
  try {
    // ⚡ All 4 queries fire in parallel → 1 pool checkout → 1 network round-trip
    // `shuffle()` is called synchronously after each `await` so every caller sees
    // a fresh randomised order (exactly what the per-panel sort(() => -0.5) did).
    const [rawFeatured, rawAlmostGone, rawPriceDropped, rawJustLanded] = await Promise.all([
      getProductSubset({ featured: true }, 20, true),
      getProductSubset({ stockQuantity: { $gt: 0, $lte: 10 } }, 9, false),
      getProductSubset({ discount: { $gt: 0, $lte: 20 } }, 9, false),
      getProductSubset({}, 9, true),
    ]);

    return NextResponse.json({
      featured: rawFeatured,
      almostGone: shuffle(rawAlmostGone),
      priceDropped: shuffle(rawPriceDropped),
      justLanded: shuffle(rawJustLanded),
    });
  } catch (error) {
    console.error('Batch products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
