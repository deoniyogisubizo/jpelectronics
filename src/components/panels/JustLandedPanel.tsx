'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { JustLandedSkeleton } from './SkeletonScreens';
import { useHomeData } from '@/context/HomeDataContext';
import PanelCard from './PanelCard';
import HoverCartSelector from './HoverCartSelector';

export default function JustLandedPanel() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { cache, ensureFetched } = useHomeData();
  const endpoint = '/api/products/just-landed';
  const entry = cache[endpoint] || { data: [], loaded: false };
  const [products, setProducts] = useState<any[]>(entry.data);
  const [loaded, setLoaded] = useState<boolean>(entry.loaded);

  useEffect(() => {
    if (inView && !loaded) {
      ensureFetched(endpoint)
        .then(data => { setProducts(data); setLoaded(true); })
        .catch(() => { setLoaded(true); });
    }
  }, [inView, loaded, endpoint, ensureFetched]);

  const formatPrice = (price: number | undefined) => (price == null ? '0 RWF' : `${price.toLocaleString()} RWF`);

  const getProductDesc = (p: any) => {
    let d = p.shortDescription?.en || p.description?.en || '';
    if (!d) {
      const brand = p.brand || 'Premium';
      const category = p.category || 'Electronics';
      const niceCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      d = `High-quality ${niceCategory} from ${brand}. Perfect for your everyday needs in Rwanda.…`;
    } else if (d.length > 90) {
      d = d.substring(0, 90).trim() + '…';
    }
    return d;
  };

  if (!loaded) {
    return <JustLandedSkeleton ref={ref} />;
  }

  if (!products.length) return null;

  const heroProduct = products[0];
  const galleryProducts = products.slice(1, 9);

  return (
    <section className="py-3 bg-beige">
      <div className="container mx-auto">
        <div className="mb-3 flex items-end gap-3">
          <div>
            <div className="uppercase tracking-[3px] text-[10px] text-black/60 font-bold">JUST IN FROM SUPPLIERS</div>
            <h2 className="text-2xl md:text-3xl font-black text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
              JUST LANDED
            </h2>
            <p className="text-sm text-black/60">Brand new stock. Be the first to own it in Kigali.</p>
          </div>
          <Link href="/category" className="ml-auto hidden md:block text-xs px-3 py-1 border border-black/20 rounded hover:bg-black/5">DISCOVER NEW →</Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-1">
          {products.slice(0, 4).map((product: any) => (
            <PanelCard key={product._id} product={product} sharp />
          ))}
        </div>

        {/* Desktop: tall fresh hero + grid */}
        <div className="hidden md:grid grid-cols-[25%_75%] gap-3">
          <Link href={`/product/${heroProduct._id}`}>
            <div className="bg-white/70 backdrop-blur rounded-xl overflow-hidden shadow">
              <div className="relative aspect-[3/4] bg-beige-solid overflow-hidden">
                {heroProduct.images?.[0] ? (
                  <Image src={heroProduct.images[0]} alt={heroProduct.name?.en} width={600} height={800} className="object-cover" style={{width:'100%',height:'100%'}} priority />
                ) : <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="w-16 h-16 text-gray-400" /></div>}
                <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-0.5 rounded">NEW ARRIVAL</div>
              </div>
              <div className="p-4">
                <p className="text-xs uppercase text-black/50 tracking-widest mb-0.5">{heroProduct.brand}</p>
                <h3 className="font-bold text-lg text-black mb-2 leading-tight">{heroProduct.name?.en}</h3>
                <p className="text-black/60 text-sm mb-3 line-clamp-2">{getProductDesc(heroProduct)}</p>
                <div className="flex gap-2 items-baseline mb-3">
                  <span className="bg-gold text-black text-xl font-black px-3 py-0.5 rounded" style={{fontFamily:'var(--font-share-tech-mono)'}}>{formatPrice(heroProduct.price)}</span>
                  {heroProduct.compareAtPrice && heroProduct.compareAtPrice > heroProduct.price && (
                    <span className="line-through text-sm text-gray-400">{formatPrice(heroProduct.compareAtPrice)}</span>
                  )}
                </div>
                <HoverCartSelector product={heroProduct} ctaText="GET IT FIRST" />
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-4 grid-rows-2 gap-1">
            {galleryProducts.map((p: any) => (
              <PanelCard key={p._id} product={p} sharp />
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <Link href="/category" className="text-xs border border-black/20 text-black px-3 py-1 rounded hover:bg-black/5">See everything that just arrived →</Link>
        </div>
      </div>
    </section>
  );
}
