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
    if (price === undefined || price === null) return '0 RWF';
    return `${price.toLocaleString()} RWF`;
  };

  return (
    <Link href={`/product/${product._id}`}>
      <div className="group bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10 card-hover">
        <div className="relative aspect-square overflow-hidden bg-beige-solid">
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

          {product.hotDeal && <span className="hot-badge">HOT</span>}
          {product.discount && product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-black/60 uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="font-semibold text-black mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name[language] || product.name.en}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="w-3 h-3 text-black fill-black" />
            ))}
            <Star className="w-3 h-3 text-gray-300 fill-gray-300" />
            <span className="text-xs text-black/50 ml-1">(12)</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-gold text-black text-sm font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="bg-gray-200 text-gray-500 text-sm px-2 py-0.5 rounded line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-2 bg-black text-gold rounded-lg font-medium hover:bg-black/80 transition-colors disabled:bg-gray-300/50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {product.inStock ? 'Add To Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
}
