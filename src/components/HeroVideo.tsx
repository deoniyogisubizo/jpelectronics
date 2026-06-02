'use client';

import { Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HeroVideo() {
  const [hovered, setHovered] = useState(1); // 0=delivery, 1=repair (default big), 2=product
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [previousHovered, setPreviousHovered] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const { data: featuredData } = useSWR('/api/products/featured', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  useEffect(() => {
    if (Array.isArray(featuredData) && featuredData.length > 0) {
      const random = featuredData[Math.floor(Math.random() * featuredData.length)];
      setPreviewProduct(random);
    }
  }, [featuredData]);

  // Auto cycle the "big" card every 5 seconds (paused when cursor is over the preview)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setHovered((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Animate top progress bar (Instagram Stories style) - restarts on every change
  useEffect(() => {
    setPreviousHovered(hovered); // remember who was big before
    setProgress(0);

    const start = Date.now();
    const duration = 4200; // fills in 4.2s, then ~0.8s visible pause before switch

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      }
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hovered]);

  const formatPrice = (p?: number) => p ? `${p.toLocaleString()} RWF` : '';

  const renderPreviewCard = (type: number, isBig: boolean) => {
    let extra = '';

    // Slide animation when big changes
    if (isBig && type !== previousHovered) {
      // This card is becoming the new big → slide in from right
      extra = 'translate-x-[6px]';
    } else if (!isBig && type === previousHovered) {
      // This card was big and is now becoming small → slide out to left
      extra = 'translate-x-[-6px]';
    }

    const sizeClass = isBig 
      ? `flex-[2.4] h-80 ${extra}` 
      : `flex-[0.8] h-56 ${extra}`;

    const baseClass = `relative overflow-hidden rounded-sm flex min-w-0 transition-[flex,height,width,transform] duration-700 ease-out ${sizeClass}`;

    // Progress bar only on the currently big card (gold color)
    const topLoadingBar = isBig ? (
      <>
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gold/30 z-10" />
        <div 
          className="absolute top-0 left-0 h-[2px] bg-gold z-20" 
          style={{ width: `${progress}%` }} 
        />
      </>
    ) : null;

    if (type === 0) {
      // Fast Delivery
      return (
        <div
          className={baseClass}
          onMouseEnter={() => setHovered(0)}
        >
          {topLoadingBar}
          <Image 
            src="/delivery.png" 
            alt="Delivery person" 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
          <div className="absolute bottom-0 left-0 p-1 text-white text-[10px] leading-[1.05]">
            <div className="font-bold tracking-wide">Fast Delivery</div>
            <div className="opacity-75">1–2 days in Kigali</div>
          </div>
        </div>
      );
    }

    if (type === 1) {
      // Expert Repair
      return (
        <div
          className={baseClass}
          onMouseEnter={() => setHovered(1)}
        >
          {topLoadingBar}
          <Image src="/images/4.jpeg" alt="Repair" fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
          <div className="absolute bottom-0 left-0 p-1 text-white text-[10px] leading-[1.05]">
            <div className="font-bold tracking-wide">Expert Repair</div>
            <div className="opacity-75">Same-day fixes</div>
          </div>
        </div>
      );
    }

    // type === 2 : New Arrival / random product
    return (
      <Link
        href={previewProduct ? `/product/${previewProduct._id}` : '#'}
        className={baseClass}
        onMouseEnter={() => setHovered(2)}
      >
        {topLoadingBar}
        {previewProduct?.images?.[0] ? (
          <Image src={previewProduct.images[0]} alt={previewProduct.name?.en || ''} fill className="object-cover" sizes="420px" />
        ) : (
          <div className="absolute inset-0 bg-white/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="absolute bottom-0 left-0 p-1 text-white text-[10px] leading-[1.05]">
          <div className="font-bold tracking-wide">New Arrival</div>
          <div className="opacity-75 line-clamp-1 text-[9px]">{previewProduct?.name?.en || 'Latest stock'}</div>
          <div className="text-gold text-xs mt-0.5">{formatPrice(previewProduct?.price)}</div>
        </div>
      </Link>
    );
  };

  return (
    <section className="relative h-[500px] md:h-[650px] overflow-hidden bg-[#1a202c]">
      {/* Background image + gradient overlay */}
      <div className="absolute inset-0 overflow-hidden bg-[#1a202c]">
        <Image
          src="/video/bg.png"
          alt="Hero Background"
          fill
          className="object-cover z-0"
          style={{ objectPosition: 'right top', maxWidth: '85%', marginLeft: 'auto' }}
          sizes="(max-width: 768px) 100vw, 85vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a202c] via-[#1a202c]/85 to-transparent z-10" />
      </div>

      {/* Main content - clean flex layout, no hacks */}
      <div className="relative z-20 h-full flex">
        {/* Left: Brand text + description + CTAs */}
        <div className="w-full md:w-[58%] flex flex-col justify-center px-6 md:pl-12 lg:pl-16">
          {/* Replaced logo image with clean text */}
          <div className="mb-3">
            <div className="text-white text-3xl md:text-5xl font-black tracking-[-1.5px] leading-[0.95]" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
              JP ELECTRONICS<br />TECH CENTER
            </div>
            <div className="text-gold text-lg md:text-2xl font-medium tracking-widest mt-1">new &amp; repair</div>
          </div>

          <p className="max-w-lg text-sm md:text-base text-gray-300 font-light italic mb-6">
            Curated technology, expert repairs and solar solutions — brought together with care, precision and genuine service from the heart of Kigali.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/category"
              className="bg-gold text-black px-7 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors shadow text-sm md:text-base inline-block text-center"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="bg-black/30 backdrop-blur-sm border border-white/30 text-white px-7 py-3 rounded-lg font-semibold hover:bg-black/50 transition-colors text-sm md:text-base inline-block text-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: only the 3-grid preview (search removed) */}
        <div className="hidden md:flex md:w-[42%] flex-col justify-center pt-6 pr-12 lg:pr-20 relative z-30">
          {/* 3 column preview: middle big by default, sides small. Hover any → it becomes big, others small */}
            <div 
              className="h-96 relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex h-full gap-4 items-center">
                {renderPreviewCard((hovered + 2) % 3, false)}
                {renderPreviewCard(hovered, true)}
                {renderPreviewCard((hovered + 1) % 3, false)}
              </div>
            </div>
        </div>
      </div>

      {/* Bottom brand strip - cleaned positioning */}
      <div className="hidden md:block absolute bottom-6 left-12 z-20">
        <div className="text-gray-100/70 uppercase text-xs font-medium tracking-[2px] mb-2">
          WHILE YOU ARE WITH JP ELECTRONICS SHOP
        </div>
        <div className="flex flex-wrap items-center gap-4 opacity-50">
          {['Apple','HP','Dell','Android','ASUS','ACER','Nokia'].map((brand) => (
            <div key={brand} className="px-3 py-0.5 bg-white/10 rounded text-white/70 text-xs font-bold">
              {brand}
            </div>
          ))}
        </div>
      </div>

      {/* Play icon bottom right */}
      <div className="absolute bottom-4 right-4 opacity-50 z-20">
        <Play className="w-8 h-8 text-black fill-white/60" />
      </div>
    </section>
  );
}
