'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

export default function PriceJustDroppedPanel() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [products, setProducts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inView && !loaded) {
      fetch('/api/products').then(res => res.json()).then(data => {
        const dropped = data.filter((p: any) => p.discount > 0 && p.discount <= 20).sort(() => Math.random() - 0.5).slice(0, 9);
        setProducts(dropped);
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
      <section ref={ref} className="py-2 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Price Just Dropped</h2>
          </div>
          <div className="text-center py-8">Loading...</div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  const heroProduct = products[0];
  const galleryProducts = products.slice(1);

  return (
    <section className="py-2 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Price Just Dropped</h2>
        </div>
        <p className="text-gray-600 mb-6">Limited-time price reductions — save now before they go back up</p>

        {/* Mobile layout */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md group relative">
                <div className="relative aspect-[3/2] overflow-hidden bg-beige">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name.en}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.brand}
                  </p>
                  <h4 className="font-medium text-black mb-1 text-xs line-clamp-2 min-h-[1.5rem]">
                    {product.name.en}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                    {(product.description?.en || '').substring(0, 60)}...
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gold">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-[80%_20%] gap-6">
          {/* Left Column: Gallery Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-3">
            {galleryProducts.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md group relative">
                  <div className="relative aspect-[3/2] overflow-hidden bg-beige">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={300}
                        height={200}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.brand}
                    </p>
                    <h4 className="font-medium text-black mb-1 text-xs line-clamp-2 min-h-[1.5rem]">
                      {product.name.en}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {(product.description?.en || '').substring(0, 60)}...
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-gold" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column: Tall Hero Card */}
          <Link href={`/product/${heroProduct._id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
              <div className="relative aspect-[3/4] overflow-hidden bg-beige">
                {heroProduct.images && heroProduct.images.length > 0 ? (
                  <Image
                    src={heroProduct.images[0]}
                    alt={heroProduct.name.en}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  -{heroProduct.discount}%
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  {heroProduct.brand}
                </p>
                <h3 className="font-semibold text-black mb-2 text-base">
                  {heroProduct.name.en}
                </h3>
                <p className="text-gray-600 mb-3 text-xs leading-relaxed">
                  {heroProduct.description?.en || 'No description available'}
                </p>
                <div className="mb-3">
                  <span className="text-lg font-bold text-gold">
                    {formatPrice(heroProduct.price)}
                  </span>
                  {heroProduct.compareAtPrice && heroProduct.compareAtPrice > heroProduct.price && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {formatPrice(heroProduct.compareAtPrice)}
                    </span>
                  )}
                </div>
                <button className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm">
                  Shop Now - Limited Time!
                </button>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex justify-end mt-4">
          <Link href="/category" className="text-xs border border-gold/50 text-gold px-3 py-1 rounded hover:bg-gold/10 transition-colors">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}