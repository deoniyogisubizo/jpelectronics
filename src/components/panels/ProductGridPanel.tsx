'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import Masonry from 'react-masonry-css';

export default function ProductGridPanel() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [products, setProducts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inView && !loaded) {
      fetch('/api/products').then(res => res.json()).then(data => {
        setProducts(data);
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
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Featured Products</h2>
          <div className="text-center py-8">Loading products…</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 bg-beige">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Featured Products</h2>
        <Masonry
          breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {products.slice(0, 20).map((product: any, index: number) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group block">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10 card-hover">
                <div className={`relative ${index % 3 === 0 ? 'aspect-[4/3]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]'} overflow-hidden bg-beige-solid`}>
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name.en}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-black/60 uppercase tracking-wide mb-1">{product.brand}</p>
                  <h3 className="font-medium text-black mb-2 text-sm line-clamp-2">{product.name.en}</h3>
                  <p className="text-xs text-black/50 mb-2 line-clamp-2">{product.description?.en || 'No description available'}</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-gold text-black text-sm font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="bg-gray-200 text-gray-500 text-sm px-2 py-0.5 rounded line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Masonry>
      </div>
    </section>
  );
}
