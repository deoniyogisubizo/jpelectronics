'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import { Filter, SortAsc, Grid3X3, List, Search, Plus, Minus, Eye } from 'lucide-react';
import Link from 'next/link';

interface CategoryBrowserProps {
  initialCategorySlug?: string;
  title?: string;
}

export default function CategoryBrowser({ initialCategorySlug, title }: CategoryBrowserProps) {
  const { t } = useLanguage();
  const { addItem, setIsOpen } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',           // always start empty — server-side ?categorySlug already scopes the results for slug pages
    brand: '',
    size: '',
    minQuantity: '',
    maxQuantity: '',
    inStock: false,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [visibleCount, setVisibleCount] = useState(50);

  // In-stock category counts for the desktop sidebar (only on main /category page)
  const inStockCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      if (p.inStock) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Reset visible count when filters/search/sort change (for "Load More")
  useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery, filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.size, filters.minQuantity, filters.maxQuantity, filters.inStock, sortBy]);

  // Fetch products - use DB-level filter when a specific category slug is provided
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let url = '/api/products';
      if (initialCategorySlug) {
        url += `?categorySlug=${encodeURIComponent(initialCategorySlug)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [initialCategorySlug]);

  // Search suggestions
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
          // If scoped to a category, keep only relevant suggestions
          const filtered = initialCategorySlug 
            ? data.filter((p: any) => (p.categorySlug || p.category) === initialCategorySlug)
            : data;
          setSuggestions(filtered);
        }
      } catch (error) {
        console.error('Search suggestions error:', error);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, initialCategorySlug]);

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
  const uniqueSizes = Array.from(new Set(products.map(p => p.specs?.size || '').filter(Boolean)));
  const uniqueCategories = initialCategorySlug 
    ? [] // no need to show category filter when already scoped
    : Array.from(new Set(products.map(p => p.category)));

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

  const clearAllFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      category: '',
      brand: '',
      size: '',
      minQuantity: '',
      maxQuantity: '',
      inStock: false,
    });
    setSearchQuery('');
    setSortBy('newest');
  };

  const filteredProducts = products
    .filter(p => {
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
      if (filters.category && p.category !== filters.category && p.categorySlug !== filters.category) return false;
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
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : Date.parse(a.createdAt as any);
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : Date.parse(b.createdAt as any);
          return timeB - timeA;
        }
        default: return 0;
      }
    });

  const displayedProducts = filteredProducts.slice(0, visibleCount);


  const displayTitle = title || (initialCategorySlug ? initialCategorySlug.replace(/-/g, ' ') : 'All Products');

  return (
    <div className="min-h-screen bg-beige pt-4">
      <div className="container mx-auto px-2 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold capitalize mb-2" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
            {displayTitle}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found {searchQuery && `for "${searchQuery}"`}
            {initialCategorySlug && !searchQuery && ' in this category'}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-5xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${displayTitle}...`}
              autoFocus
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              className="w-full h-12 px-4 pr-16 border border-gray-300 rounded-lg focus:outline-none text-sm text-gray-900 placeholder:text-black placeholder:opacity-50"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-14 w-14 bg-black text-gold rounded-full hover:bg-black/80 transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((product: any) => (
                  <div
                    key={product._id}
                    className="px-4 py-2 hover:bg-beige cursor-pointer"
                    onClick={() => {
                      setSearchQuery(product.name.en);
                      setSuggestions([]);
                    }}
                  >
                    <div className="font-medium text-black">{product.name.en}</div>
                    <div className="text-sm text-black/50">{product.brand} — {product.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
         </div>

        {/* Desktop layout: main content on left, sidebar on right */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column (products + mobile filters) */}
          <div className="flex-1 min-w-0">


        {/* Mobile / tablet filter bar (hidden on desktop when sidebar is active) */}
        <div className="lg:hidden flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow">
           <div className="flex-1 flex flex-wrap gap-3 items-center">
             {/* Category filter - shown on small screens for the main /category page */}
             {uniqueCategories.length > 0 && (
               <select
                 value={filters.category}
                 onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                 className="px-3 py-2 border rounded-lg min-w-[140px]"
               >
                 <option value="">All Categories</option>
                 {uniqueCategories.map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
             )}

             {/* Brand filter */}
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

          {/* Sort + View */}
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

        {/* Products Grid - exact same card design as /category page */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
         ) : (
           <>
             <div className={`grid gap-2 ${
               viewMode === 'grid'
                 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                 : 'grid-cols-1'
             }`}>
               {displayedProducts.map((product) => {

                const quantity = quantities[product._id] || 1;
                return (
                  <Link key={product._id} href={`/product/${product._id}`}>
                    <div className="bg-white rounded-lg overflow-hidden group cursor-pointer">
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
                         <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                           <div className="flex flex-col items-center text-center px-1">
                             <Eye className="w-5 h-5 text-white mb-0.5" />
                             <span className="text-white text-[7px] font-bold tracking-[0.5px] leading-[1.1] text-center">VIEW TO GET SHELF<br />BRAND NEW ELECTRONICS DETAILED</span>
                           </div>
                         </div>

                      </div>

                      <div className="p-2">
                        <p className="text-xs text-gray-500 uppercase mb-1">
                          {product.brand}
                        </p>

                        <h3 className="font-semibold text-black text-sm mb-1 line-clamp-1">
                          {product.name.en}
                        </h3>

                        <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                          {product.description.en}
                        </p>

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

                        <div className="grid grid-cols-2 gap-1">
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

                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                            disabled={!product.inStock}
                            className="bg-black text-white text-xs py-1 px-1 rounded hover:bg-black/80 transition-colors disabled:bg-gray-400"
                          >
                            Add In Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
               })}
             </div>

             {/* Load More button after 50 products */}
             {visibleCount < filteredProducts.length && (
               <div className="flex justify-center mt-8">
                 <button
                   onClick={() => setVisibleCount(v => v + 50)}
                   className="px-10 py-3 bg-black text-gold font-medium rounded-lg hover:bg-black/80 active:scale-[0.985] transition-all"
                 >
                   Load More ({filteredProducts.length - visibleCount} more)
                 </button>
               </div>
             )}
           </>
         )}



        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your filters.</p>
          </div>
        )}
          </div> {/* end of flex-1 content column */}

          {/* Right sidebar filter - Desktop only on main /category page */}
          {!initialCategorySlug && (
            <aside className="hidden lg:block w-72 flex-shrink-0 self-start">
              <div className="sticky top-6 bg-white rounded-2xl border border-black/10 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xs uppercase tracking-[2px] text-black/60">Categories</h3>
                  <button 
                    onClick={clearAllFilters}
                    className="text-[11px] text-gold hover:underline font-medium"
                  >
                    Clear all
                  </button>
                </div>

                {/* Clickable category list with in-stock counts */}
                <div className="space-y-px text-sm mb-6">
                  <button
                    onClick={() => setFilters(f => ({ ...f, category: '' }))}
                    className={`w-full flex justify-between px-3 py-2 rounded-lg text-left transition-colors ${!filters.category ? 'bg-gold text-black font-semibold' : 'hover:bg-beige'}`}
                  >
                    <span>All Categories</span>
                    <span className="text-black/50 tabular-nums">{products.filter(p => p.inStock).length}</span>
                  </button>

                  {inStockCategoryCounts.map(({ category, count }) => (
                    <button
                      key={category}
                      onClick={() => setFilters(f => ({ ...f, category }))}
                      className={`w-full flex justify-between px-3 py-2 rounded-lg text-left transition-colors ${filters.category === category ? 'bg-gold text-black font-semibold' : 'hover:bg-beige'}`}
                    >
                      <span>{category}</span>
                      <span className="text-black/50 tabular-nums">({count})</span>
                    </button>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  {/* Brand */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-black/60">Brand</div>
                    <select
                      value={filters.brand}
                      onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-black/20 rounded-lg text-sm"
                    >
                      <option value="">All Brands</option>
                      {uniqueBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-black/60">Price (RWF)</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="px-3 py-2 border border-black/20 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="px-3 py-2 border border-black/20 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Size */}
                  {uniqueSizes.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-black/60">Size</div>
                      <select
                        value={filters.size}
                        onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 rounded-lg text-sm"
                      >
                        <option value="">All Sizes</option>
                        {uniqueSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Stock Quantity */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-black/60">Stock Qty</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minQuantity}
                        onChange={(e) => setFilters({ ...filters, minQuantity: e.target.value })}
                        className="px-3 py-2 border border-black/20 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxQuantity}
                        onChange={(e) => setFilters({ ...filters, maxQuantity: e.target.value })}
                        className="px-3 py-2 border border-black/20 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* In Stock */}
                  <label className="flex items-center gap-2 text-sm cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="accent-gold"
                    />
                    <span className="text-sm">In stock only</span>
                  </label>
                </div>
              </div>
            </aside>
          )}
        </div> {/* end of lg:flex row */}
      </div>
    </div>
  );
}
