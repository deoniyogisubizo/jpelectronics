'use client';

import { useState } from 'react';
import { Product, CartItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const cartItem = items.find((item: CartItem) => item.productId === product._id);
  const qty = cartItem?.quantity ?? 0;
  const inCart = cartItem !== undefined;

  const handleAddStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      updateQuantity(product._id, qty + 1);
    } else {
      addItem(product._id, 1);
    }
  };

  const handleSubStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty > 1) {
      updateQuantity(product._id, qty - 1);
    } else {
      removeItem(product._id);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return '0 RWF';
    return `${price.toLocaleString()} RWF`;
  };

  return (
    <Link href={`/product/${product._id}`}>
      <div
        className="group bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
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
          {product.discount && product.discount > 0 && (
            <span className="discount-badge">-{product.discount}%</span>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-black/60 uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="font-semibold text-black mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name[language] || product.name.en}
          </h3>

          {/* Star rating */}
          <div className="flex items-center gap-1 mb-2">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="w-3 h-3 text-black fill-black" />
            ))}
            <Star className="w-3 h-3 text-gray-300 fill-gray-300" />
            <span className="text-xs text-black/50 ml-1">(12)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="bg-gold text-black text-sm font-bold px-2 py-0.5 rounded"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span
                className="bg-gray-200 text-gray-500 text-sm px-2 py-0.5 rounded line-through"
                style={{ fontFamily: 'var(--font-share-tech-mono)' }}
              >
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Selector */}
          {product.inStock && (
            <div className="relative h-[42px]">
              {/* Default "Add In Cart" — hidden on group-hover */}
              <button
                className={`w-full py-2 bg-black text-gold rounded-lg font-medium transition-all duration-200 absolute inset-0
                  ${isHovered ? 'opacity-0 pointer-events-none translate-y-1' : 'opacity-100 pointer-events-auto'}`}
              >
                Add In Cart
              </button>

              {/* Quantity selector — shown on group-hover */}
              <div
                className={`absolute inset-0 flex items-center justify-between transition-all duration-200
                  ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              >
                {/* ─ button */}
                <button
                  onClick={handleSubStep}
                  className="h-full px-3 bg-black text-gold rounded-l-lg text-lg font-bold hover:bg-black/80 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>

                {/* Quantity display */}
                <div className="h-full flex-1 flex items-center justify-center bg-black/5 border-t border-b border-black/10 text-sm font-bold text-black">
                  {inCart ? qty : 'Add'}
                </div>

                {/* ─ button */}
                <button
                  onClick={handleAddStep}
                  className="h-full px-3 bg-black text-gold rounded-r-lg text-lg font-bold hover:bg-black/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
