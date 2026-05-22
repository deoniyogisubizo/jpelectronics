'use client';

import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface RelatedProductCardProps {
  product: Product;
}

export default function RelatedProductCard({ product }: RelatedProductCardProps) {
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
      <div className="group bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-beige-solid">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}

          {/* Eye on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
            <div className="bg-white/95 rounded-full p-3 shadow">
              <Eye className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-black/60 uppercase tracking-wide">{product.brand}</p>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-yellow-500">★★★★☆</span>
              <span className="text-[10px] text-black/50">(124)</span>
            </div>
          </div>

          <h3 className="font-semibold text-black text-sm mb-1 line-clamp-2 leading-snug">
            {name}
          </h3>

          <p className="text-xs text-black/70 line-clamp-2">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}
