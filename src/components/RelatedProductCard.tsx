'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface RelatedProductCardProps {
  product: Product;
}

export default function RelatedProductCard({ product }: RelatedProductCardProps) {
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
      <div className="bg-gold rounded-lg p-4 h-48 flex flex-col justify-between hover:opacity-90 transition-opacity">
        {/* Brand */}
        <p className="text-xs text-black uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="font-bold text-black text-sm mb-2 line-clamp-2">
          {product.name[language] || product.name.en}
        </h3>

        {/* Description */}
        <p className="text-xs text-black/80 mb-2 line-clamp-2">
          {product.shortDescription?.[language] || product.shortDescription?.en || product.description?.[language] || product.description?.en || ''}
        </p>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg font-bold text-black">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-2 bg-black text-white rounded font-medium hover:opacity-90 transition-opacity disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}