'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { ShoppingCart, Heart } from 'lucide-react';

export default function ExplorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const allProducts = await response.json();
        // Shuffle for discovery feel
        const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: any) => {
    addItem(product._id, 1);
  };

  const trendingProducts = products.filter(p => p.discount > 0).slice(0, 8);
  const featuredProducts = products.slice(8, 16);
  const sustainableProducts = products.filter(p => p.category?.toLowerCase().includes('solar') || p.category?.toLowerCase().includes('wearable')).slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige pt-16">
        <div className="container mx-auto px-0 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige pt-16">
      <div className="container mx-auto px-0 py-8">
        <h1 className="text-3xl font-bold text-black mb-2">Explore</h1>
        <p className="text-gray-600 mb-8">Discover trending products and curated picks</p>

        {/* Trending Now */}
        {trendingProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-gold rounded-full"></span>
              Trending Now
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md group relative">
                  <div className="relative aspect-square overflow-hidden bg-beige">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-black mb-2 text-sm line-clamp-2">
                      {product.name.en}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                        {product.price.toLocaleString()} RWF
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                          {product.compareAtPrice.toLocaleString()} RWF
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gold text-black py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors text-sm"
                    >
                      Quick Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Editor's Picks */}
        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-gold rounded-full"></span>
              Editor's Picks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md group relative">
                  <div className="relative aspect-square overflow-hidden bg-beige">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-black mb-2 text-sm line-clamp-2">
                      {product.name.en}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                        {product.price.toLocaleString()} RWF
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                          {product.compareAtPrice.toLocaleString()} RWF
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gold text-black py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors text-sm"
                    >
                      Quick Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sustainable Essentials */}
        {sustainableProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-gold rounded-full"></span>
              Sustainable Essentials
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sustainableProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md group relative">
                  <div className="relative aspect-square overflow-hidden bg-beige">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-black mb-2 text-sm line-clamp-2">
                      {product.name.en}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                        {product.price.toLocaleString()} RWF
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                          {product.compareAtPrice.toLocaleString()} RWF
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gold text-black py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors text-sm"
                    >
                      Quick Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Load More Button */}
        <div className="text-center">
          <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Load More Discoveries
          </button>
        </div>
      </div>
    </div>
  );
}
