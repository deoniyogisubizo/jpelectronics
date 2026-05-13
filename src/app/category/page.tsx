'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import { Filter, SortAsc, Grid3X3, List, Search, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const { t } = useLanguage();
  const { addItem, setIsOpen } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    brand: '',
    size: '',
    minQuantity: '',
    maxQuantity: '',
    inStock: false,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Search suggestions error:', error);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
  const uniqueSizes = Array.from(new Set(products.map(p => p.specs?.size || '').filter(Boolean)));
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product._id] || 1;
    addItem(product._id, quantity);
    setIsOpen(true);
  };

   const filteredProducts = products
      .filter(p => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matches = (
            p.name.en.toLowerCase().includes(query) ||
            p.name.rw.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            (p.description.en || '').toLowerCase().includes(query) ||
            (p.description.rw || '').toLowerCase().includes(query) ||
            (p.tags || []).some((tag: string) => tag.toLowerCase().includes(query))
          );
          if (!matches) return false;
        }
        if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
        if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
        if (filters.category && p.category !== filters.category) return false;
        if (filters.brand && p.brand !== filters.brand) return false;
        if (filters.size && p.specs?.size !== filters.size) return false;
        if (filters.minQuantity && p.stockQuantity < parseInt(filters.minQuantity)) return false;
        if (filters.maxQuantity && p.stockQuantity > parseInt(filters.maxQuantity)) return false;
        if (filters.inStock && !p.inStock) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'newest': {
            const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : Date.parse(a.createdAt);
            const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : Date.parse(b.createdAt);
            return timeB - timeA;
          }
          default: return 0;
        }
      });

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-2 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold capitalize mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative max-w-5xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all products..."
              autoFocus
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              className="w-full h-12 px-4 pr-16 border border-gray-300 rounded-lg focus:outline-none text-sm text-gray-900 placeholder:text-black placeholder:opacity-50"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-14 w-14 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((product: any) => (
                  <div
                    key={product._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(product.name.en);
                      setSuggestions([]);
                    }}
                  >
                    <div className="font-medium">{product.name.en}</div>
                    <div className="text-sm text-gray-500">{product.brand} - {product.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow">
          {/* Filter toggle (mobile) */}
          <button className="md:hidden flex items-center gap-2 px-2 py-2 border rounded">
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Filters */}
          <div className="flex-1 flex flex-wrap gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-3 py-2 border rounded-lg w-32"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-3 py-2 border rounded-lg w-32"
            />

            {uniqueSizes.length > 0 && (
              <select
                value={filters.size}
                onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Sizes</option>
                {uniqueSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            )}

            <input
              type="number"
              placeholder="Min Quantity"
              value={filters.minQuantity}
              onChange={(e) => setFilters({ ...filters, minQuantity: e.target.value })}
              className="px-3 py-2 border rounded-lg w-32"
            />
            <input
              type="number"
              placeholder="Max Quantity"
              value={filters.maxQuantity}
              onChange={(e) => setFilters({ ...filters, maxQuantity: e.target.value })}
              className="px-3 py-2 border rounded-lg w-32"
            />

            <label className="flex items-center gap-2 px-3">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
              />
              In Stock Only
            </label>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>

            {/* View toggle */}
            <div className="flex border rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gold' : 'bg-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gold' : 'bg-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className={`grid gap-2 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => {
              const quantity = quantities[product._id] || 1;
              return (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <div className="bg-white rounded-lg overflow-hidden group cursor-pointer">
                  {/* Image - small height */}
                  <div className="relative h-32 overflow-hidden bg-beige">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Search className="w-8 h-8" />
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    {/* Brand */}
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      {product.brand}
                    </p>

                    {/* Name */}
                    <h3 className="font-semibold text-black text-sm mb-1 line-clamp-1">
                      {product.name.en}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {product.description.en}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-sm font-bold text-gold">
                        {product.price.toLocaleString()} RWF
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.compareAtPrice.toLocaleString()} RWF
                        </span>
                      )}
                    </div>

                    {/* Bottom row */}
                    <div className="grid grid-cols-2 gap-1">
                      {/* Left: Quantity controls */}
                      <div className="flex items-center justify-center gap-1 bg-gray-100 rounded px-1 py-1">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product._id, -1); }}
                          className="p-0.5 hover:bg-gray-200 rounded"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium min-w-[20px] text-center">{quantity}</span>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product._id, 1); }}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Right: Add to cart */}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                        disabled={!product.inStock}
                        className="bg-amber-800 text-white text-xs py-1 px-1 rounded hover:bg-lime-600 transition-colors disabled:bg-gray-400"
                      >
                        Add In Cart
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}