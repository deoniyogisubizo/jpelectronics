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

  const formatPrice = (price: number | undefined) => (price == null ? '0 RWF' : `${price.toLocaleString()} RWF`);

  const cardClasses = sharp
    ? "group bg-textured-white overflow-hidden"
    : "group bg-[#f9f6ed]/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10";

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

          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <div className="flex flex-col items-center text-center px-1">
              <Eye className="w-4 h-4 text-white mb-0.5" />
              <span className="text-white text-[6px] font-bold tracking-[0.5px] leading-[1.1] text-center">VIEW TO GET SHELF<br />BRAND NEW ELECTRONICS DETAILED</span>
            </div>
          </div>
        </div>

        {/* Content: Brand + Review / Name / Description only */}
        <div className="p-2.5">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs text-black/60 uppercase tracking-[1px]">{product.brand}</p>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-yellow-500">★★★★☆</span>
              <span className="text-[10px] text-black/50">(124)</span>
            </div>
          </div>

          <h4 className="font-semibold text-black text-sm leading-tight line-clamp-2 min-h-[1.5rem] mb-0.5">
            {name}
          </h4>

          <p className="text-[10px] text-black/70 line-clamp-2 leading-snug">
            {desc}
          </p>
           <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm font-black text-gold" style={{fontFamily:'var(--font-share-tech-mono)'}}>{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs line-through text-gray-400" style={{fontFamily:'var(--font-share-tech-mono)'}}>{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
