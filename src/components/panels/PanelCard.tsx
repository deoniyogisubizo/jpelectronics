'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';

interface PanelCardProps {
  product: any;
  aspect?: string;
  sharp?: boolean;
}

export default function PanelCard({ product, aspect = 'aspect-[3/2]', sharp = false }: PanelCardProps) {
  const name = product.name?.en || 'Product';
  let desc = product.shortDescription?.en || '';
  if (!desc && product.description?.en) {
    desc = product.description.en.substring(0, 95).trim();
    if (desc.length > 0 && !desc.endsWith('…')) desc += '…';
  }
  if (!desc) {
    const brand = product.brand || 'Premium';
    const category = product.category || 'Electronics';
    const niceCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    desc = `High-quality ${niceCategory} from ${brand}. Perfect for your everyday needs in Rwanda.…`;
  }

  const cardClasses = sharp
    ? "group bg-white overflow-hidden"
    : "group bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10";

  return (
    <Link href={`/product/${product._id}`} className="block">
      <div className={cardClasses}>
        {/* Image with eye on hover */}
        <div className={`relative ${aspect} overflow-hidden bg-beige-solid`}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={name}
              width={600}
              height={400}
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              style={{ width: '100%', height: '100%' }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}

          {/* Eye icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <div className="bg-white/95 rounded-full p-2.5 shadow">
              <Eye className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        {/* Content: Brand + Review / Name / Description only */}
        <div className="p-2.5">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-[10px] text-black/60 uppercase tracking-[1px]">{product.brand}</p>
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-yellow-500">★★★★☆</span>
              <span className="text-[9px] text-black/50">(124)</span>
            </div>
          </div>

          <h4 className="font-semibold text-black text-xs leading-tight line-clamp-2 min-h-[1.5rem] mb-0.5">
            {name}
          </h4>

          <p className="text-[10px] text-black/70 line-clamp-2 leading-snug">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}
