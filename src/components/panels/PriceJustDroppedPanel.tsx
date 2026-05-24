'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { HeroPlusGallerySkeleton } from './SkeletonScreens';
import { useHomeData } from '@/context/HomeDataContext';
import PanelCard from './PanelCard';
import HoverCartSelector from './HoverCartSelector';

export default function PriceJustDroppedPanel() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { cache, ensureFetched } = useHomeData();
  const endpoint = '/api/products/price-dropped';
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
    return <HeroPlusGallerySkeleton label="PRICE JUST DROPPED — FLASH SAVINGS" secondaryLabel="Lock it in before prices rise again" ref={ref} />;
  }

  if (!products.length) return null;

  const heroProduct = products[0];
  const galleryProducts = products.slice(1, 7);

  return (
    <section className="py-3 bg-beige">
      <div className="container mx-auto">
        <div className="mb-3 flex items-end gap-3">
          <div>
            <div className="uppercase tracking-[3px] text-[10px] text-gold font-bold">TODAY ONLY</div>
            <h2 className="text-2xl md:text-3xl font-black text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
              PRICE JUST DROPPED
            </h2>
            <p className="text-sm text-black/60">Biggest drops of the week. Prices can go back up anytime.</p>
          </div>
          <Link href="/category" className="ml-auto hidden md:block text-xs px-3 py-1 border border-black/20 rounded hover:bg-black/5">ALL DEALS →</Link>
        </div>

        {/* Mobile direct */}
        <div className="md:hidden grid grid-cols-2 gap-1">
          {products.slice(0, 4).map((product: any) => (
            <PanelCard key={product._id} product={product} sharp />
          ))}
        </div>

        {/* Desktop: gallery first (deals feel) then big hero on right */}
        <div className="hidden md:grid grid-cols-[72%_28%] gap-3">
           <div className="grid grid-cols-3 grid-rows-2 gap-1">
             {galleryProducts.map((p: any) => (
               <PanelCard key={p._id} product={p} sharp />
             ))}
           </div>


          {/* Hero deal spotlight */}
          <Link href={`/product/${heroProduct._id}`}>
            <div className="bg-[#f9f6ed]/70 backdrop-blur rounded-xl overflow-hidden shadow border border-gold/30">
              <div className="relative aspect-[4/3] bg-beige-solid overflow-hidden">
                {heroProduct.images?.[0] ? (
                  <Image src={heroProduct.images[0]} alt={heroProduct.name?.en} width={800} height={600} className="object-cover" style={{width:'100%',height:'100%'}} priority />
                ) : <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="w-16 h-16 text-gray-400" /></div>}
                <div className="absolute top-3 left-3 bg-gold text-black text-sm font-black px-3 py-0.5 rounded">-{heroProduct.discount}% OFF</div>
              </div>
              <div className="p-4">
                <div className="uppercase text-gold text-xs tracking-widest font-bold mb-1">MASSIVE DROP</div>
                <h3 className="font-bold text-xl text-black mb-1">{heroProduct.name?.en}</h3>
                <p className="text-black/60 text-sm mb-3 line-clamp-2">{getProductDesc(heroProduct)}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gold text-black text-2xl font-black px-3 py-0.5 rounded" style={{fontFamily:'var(--font-share-tech-mono)'}}>{formatPrice(heroProduct.price)}</span>
                  {heroProduct.compareAtPrice && <span className="line-through text-lg text-gray-400" style={{fontFamily:'var(--font-share-tech-mono)'}}>{formatPrice(heroProduct.compareAtPrice)}</span>}
                </div>
                <HoverCartSelector product={heroProduct} ctaText="LOCK IN THIS PRICE" />
              </div>
            </div>
          </Link>
        </div>

        <div className="flex justify-end mt-3">
          <Link href="/category" className="text-xs border border-black/20 text-black px-3 py-1 rounded hover:bg-black/5">View every price drop →</Link>
        </div>
      </div>
    </section>
  );
}
