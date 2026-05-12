'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { Search, Filter, X, ShoppingCart, Heart } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    brand: ''
  });
  const [recentSearches] = useState(['iPhone', 'Samsung', 'Laptop', 'Solar Panel']);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const allProducts = await response.json();
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Text search
    if (query) {
      filtered = filtered.filter(p =>
        p.name.en.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        (p.description?.en || '').toLowerCase().includes(query.toLowerCase())
      );
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(p =>
        p.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(p =>
        p.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    return filtered;
  }, [products, query, filters]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return cats;
  }, [products]);

  const brands = useMemo(() => {
    const brs = [...new Set(products.map(p => p.brand).filter(Boolean))];
    return brs;
  }, [products]);

  const addToCart = (product: any) => {
    addItem(product._id, 1);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      category: '',
      brand: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  if (loading) {
    return (
      <div className="min-h-screen bg-beige pt-16">
        <div className="animate-pulse">
          <div className="h-16 bg-white border-b mb-8"></div>
          <div className="container mx-auto px-2">
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
      {/* Fixed Search Bar */}
      <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="container mx-auto px-2 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for brands, styles, categories..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`p-3 border rounded-lg transition-colors ${
                hasActiveFilters ? 'border-gold text-gold' : 'border-gray-300 text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20">
        <div className="container mx-auto px-2">
          {/* Recent & Popular Searches */}
          {!query && !hasActiveFilters && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-black mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="px-2 py-2 bg-white border border-gray-300 rounded-full text-sm hover:border-gold transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-black mb-4">Popular Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 8).map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilters(prev => ({ ...prev, category }))}
                    className="p-4 bg-white border border-gray-300 rounded-lg text-center hover:border-gold transition-colors"
                  >
                    <h3 className="font-medium text-black">{category}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {(query || hasActiveFilters) && (
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredProducts.length} results {query && `for "${query}"`}
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
          )}

          {filteredProducts.length === 0 && (query || hasActiveFilters) ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters, or check out these popular items
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {products.slice(0, 8).map((product) => (
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
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-black text-sm line-clamp-2 mb-1">
                        {product.name.en}
                      </h4>
                      <span className="text-gold font-bold text-sm" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                        {product.price.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
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
                      <button className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
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
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}></div>
          <div className="w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2 bg-gold text-black rounded font-medium hover:bg-yellow-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}