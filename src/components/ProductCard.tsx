'use client';

import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage();

  const name = product.name[language] || product.name.en;
  let descText = product.shortDescription?.[language] || product.description?.[language] || product.shortDescription?.en || product.description?.en || '';
  if (!descText) {
    const brand = product.brand || 'Premium';
    const category = product.category || 'Electronics';
    const niceCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    descText = `High-quality ${niceCategory} from ${brand}. Perfect for your everyday needs in Rwanda.…`;
  }
  const desc = descText;

  return (
    <Link href={`/product/${product._id}`}>
      <div className="group bg-[#f9f6ed]/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10">
        <div className="relative aspect-square overflow-hidden bg-beige-solid">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <div className="flex flex-col items-center text-center px-2">
              <Eye className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-[8px] font-bold tracking-[0.5px] leading-[1.1] text-center">VIEW TO GET SHELF<br />BRAND NEW ELECTRONICS DETAILED</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Brand + Review on the right */}
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-black/60 uppercase tracking-wide">{product.brand}</p>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-yellow-500">★★★★☆</span>
              <span className="text-[10px] text-black/50">(124)</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-black text-sm mb-1 line-clamp-2 leading-snug min-h-[2.1rem]">
            {name}
          </h3>

          {/* Description only */}
          <p className="text-xs text-black/70 line-clamp-2 leading-snug">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}
