'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, setIsOpen } = useCart();
  const { language } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product._id, 1);
    setIsOpen(true);
  };

   const formatPrice = (price: number | undefined) => {
     if (price === undefined || price === null) {
       return '0 RWF';
     }
     return `${price.toLocaleString()} RWF`;
   };

  return (
    <Link href={`/product/${product._id}`}>
      <div className="product-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 group">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-beige">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name[language] || product.name.en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}

          {/* Hot deal badge */}
          {product.hotDeal && (
            <span className="hot-badge">HOT</span>
          )}

          {/* Discount badge */}
          {product.discount && product.discount > 0 && (
            <span className="discount-badge">-{product.discount}%</span>
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-black mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name[language] || product.name.en}
          </h3>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-gold text-gold' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">(12)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-400 line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-2 bg-vibrant text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.inStock ? t('product.addToCart') : t('product.outOfStock')}
          </button>
        </div>
      </div>
    </Link>
  );
}

function t(key: string): string {
  return key;
}
