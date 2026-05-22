'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Masonry from 'react-masonry-css';
import { FeaturedSkeleton } from './SkeletonScreens';
import { useHomeData } from '@/context/HomeDataContext';
import PanelCard from './PanelCard';

export default function ProductGridPanel() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { cache, ensureFetched } = useHomeData();
  const endpoint = '/api/products/featured';
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

  if (!loaded) {
    return <FeaturedSkeleton ref={ref} />;
  }

  return (
    <section ref={ref} className="py-3 bg-beige">
      <div className="container mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="uppercase text-[10px] tracking-[2.5px] text-black/50 font-bold">HANDPICKED BY OUR TEAM</div>
            <h2 className="text-2xl md:text-3xl font-black text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>FEATURED THIS WEEK</h2>
          </div>
          <Link href="/category" className="text-xs border border-black/20 px-3 py-1 rounded hover:bg-black/5 hidden md:block">SHOP THE FULL RANGE →</Link>
        </div>

        <Masonry
          breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 3 }}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {products.slice(0, 20).map((product: any, index: number) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group block">
              <PanelCard
                product={product}
                aspect={index % 3 === 0 ? 'aspect-[4/3]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]'}
              />
            </Link>
          ))}
        </Masonry>

        <div className="text-center mt-4">
          <Link href="/category" className="inline-block text-xs border border-black/20 px-4 py-1.5 rounded hover:bg-black/5">Explore all products →</Link>
        </div>
      </div>
    </section>
  );
}
