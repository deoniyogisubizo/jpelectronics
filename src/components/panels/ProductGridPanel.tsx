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
    if (price === undefined || price === null) {
      return '0 RWF';
    }
    return `${price.toLocaleString()} RWF`;
  };

  if (!loaded) {
    return (
      <section ref={ref} className="py-2 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="container mx-auto px-0">
          <h2 className="text-2xl md:text-3xl font-bold text-rose-700 mb-8" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Featured Products</h2>
          <div className="text-center py-8">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 bg-gradient-to-r from-pink-50 to-rose-50">
      <div className="container mx-auto px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-rose-700 mb-8" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Featured Products</h2>
        <Masonry
          breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {products.slice(0, 20).map((product: any, index: number) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className={`relative ${index % 3 === 0 ? 'aspect-[4/3]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]'} overflow-hidden bg-beige`}>
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
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-medium text-black mb-2 text-sm line-clamp-2">
                    {product.name.en}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {product.description?.en || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gold" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
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
