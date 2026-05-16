'use client';

import Link from 'next/link';
import type { Category } from '@/types';

const defaultDescriptions: Record<string, { en: string; rw: string }> = {
  smartphones: {
    en: 'Latest Android & iOS phones. Flagships, mid-range and budget.',
    rw: 'Telefoni z\'icyumweru na iOS. Flagships, mid-range na budget.'
  },
  computers: {
    en: 'Laptops, desktops, tablets and accessories. Laptops.',
    rw: 'Laptops, desktops, tablets na ibyangombwa. Laptops.'
  },
  appliances: {
    en: 'Fridges, microwaves, irons, kettles and more.',
    rw: 'Frigo, microwave, ice, kettle na ibindi.'
  },
  solar: {
    en: 'Solar panels, inverters, batteries and lighting kits.',
    rw: 'Panero y\'izuba, inverters, batari na amatara.'
  },
  mobility: {
    en: 'e-bikes, scooters, skateboards and accessories.',
    rw: 'e-bikes, scooters, skateboards na ibyangombwa.'
  },
  'smart-tvs': {
    en: 'LED, LCD, Smart TVs and home theater systems.',
    rw: 'LED, LCD, Smart TVs na home theater.'
  },
  cameras: {
    en: 'DSLR, mirrorless, action cams and accessories.',
    rw: 'DSLR, mirrorless, action cams na ibyangombwa.'
  },
  gaming: {
    en: 'Consoles, controllers, headsets and accessories.',
    rw: 'Consoles, controllers, headsets na ibyangombwa.'
  },
  'smart-watches': {
    en: 'Fitness trackers, smartwatches and wearables.',
    rw: 'Fitness trackers, smartwatches na wearables.'
  },
  'chargers-cables': {
    en: 'USB-C, Lightning, power adapters and cables.',
    rw: 'Chargers, USB cables na power adapters.'
  },
  'keyboards-mice': {
    en: 'Mechanical keyboards, wireless mice and gaming gear.',
    rw: 'Mechanical keyboards, mice wireless na ibyangombwa by\'umukino.'
  },
  'headphones-speakers': {
    en: 'Headphones, earbuds and speakers.',
    rw: 'Headphones, earbuds na speakers.'
  }
};

interface CategoryTileProps {
  category: Category;
}

export default function CategoryTile({ category }: CategoryTileProps) {
  const description = (defaultDescriptions as any)[category.slug]?.en ||
    'Explore products in this category.';

  return (
    <div className="group relative bg-white/70 backdrop-blur-sm rounded-lg shadow hover:shadow-lg transition-all duration-300">
      <Link href={`/category/${category.slug}`} className="block p-2 md:p-4 text-center">
        <div className="text-black font-bold text-xs md:text-base" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
          {category.name.en}
        </div>
      </Link>

      <div className="absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-sm rounded-b-lg shadow-lg border-t-2 border-black/10 p-2 md:p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
        <div className="text-xs md:text-sm text-black/60 mb-2 md:mb-3 leading-relaxed">
          {description}
        </div>
        <div className="flex items-center justify-between gap-2">
          {category.featured && (
            <span className="bg-black text-gold px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-base font-semibold">
              Featured
            </span>
          )}
          <Link href={`/category/${category.slug}`} className="text-xs border border-black/20 text-black px-2 py-1 rounded hover:bg-black/5 transition-colors">
            Shop →
          </Link>
        </div>
      </div>
    </div>
  );
}
