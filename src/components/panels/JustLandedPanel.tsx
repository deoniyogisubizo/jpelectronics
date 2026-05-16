'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

export default function JustLandedPanel() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [products, setProducts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inView && !loaded) {
      fetch('/api/products').then(res => res.json()).then(data => {
        const newArrivals = [...data].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()).sort(() => Math.random() - 0.5).slice(0, 9);
        setProducts(newArrivals);
        setLoaded(true);
      }).catch(err => {
        console.error('Failed to fetch products:', err);
        setLoaded(true);
      });
    }
  }, [inView, loaded]);

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return '0 RWF';
    return `${price.toLocaleString()} RWF`;
  };

  if (!loaded) {
    return (
      <section ref={ref} className="py-2 bg-beige">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Just Landed</h2>
          </div>
          <div className="text-center py-8">Loading…</div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  const heroProduct = products[0];
  const galleryProducts = products.slice(1);

  return (
    <section className="py-2 bg-beige">
      <div className="container mx-auto">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Just Landed</h2>
          <p className="text-black/50 mt-1 text-sm">Fresh arrivals at JP Tech</p>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {products.slice(0, 4).map((product: any) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm group relative">
                <div className="relative aspect-[3/2] overflow-hidden bg-beige-solid">
                  {product.images && product.images.length > 0 ? (
                    <Image src={product.images[0]} alt={product.name.en} width={300} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingCart className="w-6 h-6" /></div>
                  )}
                  <span className="absolute top-1 left-1 bg-black text-white text-xs px-1.5 py-0.5 rounded font-semibold">New Arrival</span>
                </div>
                <div className="p-2">
                  <p className="text-xs text-black/60 uppercase tracking-wide mb-0.5">{product.brand}</p>
                  <h4 className="font-medium text-black text-xs line-clamp-2 min-h-[1.5rem]">{product.name.en}</h4>
                  <p className="text-xs text-black/50 mb-1 line-clamp-2">{(product.description?.en || '').substring(0, 60)}…</p>
                  <div className="flex items-center gap-1">
                    <span className="bg-gold text-black text-xs font-bold px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.price)}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="bg-gray-200 text-gray-500 text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.compareAtPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-[20%_80%] gap-6">
          <Link href={`/product/${heroProduct._id}`}>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-[3/4] overflow-hidden bg-beige-solid">
                {heroProduct.images && heroProduct.images.length > 0 ? (
                  <Image src={heroProduct.images[0]} alt={heroProduct.name.en} width={300} height={400} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingCart className="w-12 h-12" /></div>
                )}
                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded font-semibold">New Arrival</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-black/60 uppercase tracking-wide mb-2">{heroProduct.brand}</p>
                <h3 className="font-semibold text-black mb-2">{heroProduct.name.en}</h3>
                <p className="text-black/50 mb-3 text-xs leading-relaxed">{heroProduct.description?.en || 'No description available'}</p>
                <div className="mb-3">
                  <span className="bg-gold text-black text-xl font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(heroProduct.price)}</span>
                  {heroProduct.compareAtPrice && heroProduct.compareAtPrice > heroProduct.price && (
                    <span className="bg-gray-200 text-gray-500 text-base px-2 py-0.5 rounded ml-2" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(heroProduct.compareAtPrice)}</span>
                  )}
                </div>
                <button className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors text-sm">Shop Now — New Arrival!</button>
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-4 grid-rows-2 gap-2">
            {galleryProducts.map((product: any) => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm group relative">
                  <div className="relative aspect-[3/2] overflow-hidden bg-beige-solid">
                    {product.images && product.images.length > 0 ? (
                      <Image src={product.images[0]} alt={product.name.en} width={300} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingCart className="w-6 h-6" /></div>
                    )}
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-1 py-0.5 rounded font-semibold">New Arrival</span>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-black/60 uppercase tracking-wide mb-0.5">{product.brand}</p>
                    <h4 className="font-medium text-black text-xs line-clamp-2 min-h-[1.5rem]">{product.name.en}</h4>
                    <p className="text-xs text-black/50 mb-1 line-clamp-2">{(product.description?.en || '').substring(0, 60)}…</p>
                    <div className="flex items-center gap-1">
                      <span className="bg-gold text-black text-sm font-bold px-1 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.price)}</span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="bg-gray-200 text-gray-500 text-sm px-1 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.compareAtPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Link href="/category" className="text-xs border border-black/20 text-black px-3 py-1 rounded hover:bg-black/5 transition-colors">View More</Link>
        </div>
      </div>
    </section>
  );
}
