'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import { Filter, SortAsc, Grid3X3, List } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const { t } = useLanguage();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    inStock: false,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`/api/products?category=${slug}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [slug]);

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));

   const filteredProducts = products
     .filter(p => {
       if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
       if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
       if (filters.brand && p.brand !== filters.brand) return false;
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
            {slug.replace('-', ' ')}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
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
          <div className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
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
