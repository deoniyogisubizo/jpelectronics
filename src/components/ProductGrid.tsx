'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  brand: string;
  name: { en: string };
  description?: { en: string };
  price: number;
  images?: string[];
}

function ProductGrid({ products }: { products: Product[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price: number) => `${price.toLocaleString()} RWF`;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {displayedProducts.map((product, index) => {
          const globalIndex = startIndex + index;
          const isTall = globalIndex % 5 === 0 || globalIndex % 5 === 4;
          return (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className={`bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow ${isTall ? 'row-span-2 flex flex-col' : ''}`}>
                <img src={product.images?.[0] || '/placeholder.png'} alt={product.name.en} className={`w-full object-cover ${isTall ? 'md:flex-1 h-20' : 'h-20 md:h-32'}`} />
                <div className="p-1 sm:p-2 flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                    <h3 className="font-medium text-sm">{product.name.en}</h3>
                    <p className="text-xs text-gray-600">{product.description?.en?.substring(0, 50)}...</p>
                    <p className="text-sm font-bold text-gold" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.price)}</p>
                  </div>
                  {isTall && (
                    <button className="mt-1 w-full bg-yellow-500/20 text-yellow-700 py-2 rounded border border-yellow-500/30">Shop Now</button>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded ${currentPage === page ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>{page}</button>
        ))}
        {currentPage < totalPages && <span className="px-3 py-1">&gt;</span>}
      </div>
    </>
  );
}

export default ProductGrid;