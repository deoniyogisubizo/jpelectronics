'use client';

import Link from 'next/link';
import React from 'react';
import { ShoppingCart } from 'lucide-react';

/** Base shimmer skeleton card — matches the exact PanelCard UI of each panel. */
function SkeletonCard({
  aspect = 'aspect-[3/2]',
  banner,
  delay = 0,
  linked = true,
}: {
  aspect?: string;
  banner?: React.ReactNode;
  delay?: number;
  linked?: boolean;
}) {
  const inner = (
    <div
      className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm relative group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className={`relative ${aspect} overflow-hidden bg-beige-solid`}>
        <div className="w-full h-full animate-pulse bg-gradient-to-r from-beige-solid via-beige/80 to-beige-solid bg-[length:200%_100%]" />
        {banner}
      </div>
      {/* Content */}
      <div className="p-2 space-y-1">
        {/* brand */}
        <div className="h-3 w-14 rounded-sm animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
        {/* name (two-line clamp proxy) */}
        <div className="h-3 w-full rounded-sm animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
        <div className="h-3 w-2/3 rounded-sm animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
        {/* price */}
        <div className="h-[18px] w-16 rounded-sm animate-pulse bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40 bg-[length:200%_100%]" />
        {/* cart selector bar (mimics HoverCartSelector resting state) */}
        <div className="h-9 w-full rounded-lg animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
      </div>
    </div>
  );

  if (!linked) return inner;
  return <div>{inner}</div>;
}

/** Hero-placeholder for Almost Gone / Price Dropped / Just Landed hero slot. */
function SkeletonHeroCard({ banner = null }: { banner?: React.ReactNode }) {
  return (
    <div
      className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm"
      style={{ borderRadius: 'inherit' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-beige-solid">
        <div className="w-full h-full animate-pulse bg-gradient-to-r from-beige-solid via-beige/80 to-beige-solid bg-[length:200%_100%]" />
        {banner}
      </div>
      <div className="p-4 space-y-2">
        <div className="h-3 w-14 rounded-sm animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
        <div className="h-5 w-3/4 rounded-sm animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
        <div className="h-3 w-full rounded-sm animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
        <div className="h-3 w-full rounded-sm animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
        <div className="h-7 w-28 rounded-sm animate-pulse bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40 bg-[length:200%_100%]" />
        <div className="h-10 w-full rounded-lg animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10 bg-[length:200%_100%]" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FeaturedSkeleton — mirrors ProductGridPanel layout
   ══════════════════════════════════════════════════════ */
export function FeaturedSkeleton({ ref }: { ref?: React.Ref<HTMLElement> }) {
  return (
    <section ref={ref} className="py-2 bg-beige">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
          Featured Products
        </h2>
        <div
          className="flex -ml-4 gap-4 flex-wrap w-full"
          style={{
            animation: 'growIn 300ms ease-out',
          }}
        >
          {/* Use a CSS-grid that's wide enough; each card gets its aspect ratio inline */}
          <style>{`
            .featured-skel-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
              gap: 1rem;
            }
            @keyframes growIn {
              from { opacity: 0; transform: scaleY(0.97) translateY(8px); }
              to   { opacity: 1; transform: scaleY(1) translateY(0); }
            }
          `}</style>
          <div className="featured-skel-grid" style={{ width: '100%' }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const isWide = i % 3 === 0;
              const isTall = i % 3 === 2;
              let aspect = 'aspect-square';
              if (isWide) aspect = 'aspect-[4/3]';
              else if (isTall) aspect = 'aspect-[3/4]';
              return (
                <SkeletonCard key={i} aspect={aspect} delay={i * 50} />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   HeroPlusGallerySkeleton — mirrors AlmostGonePanel / PriceJustDroppedPanel layout
   ══════════════════════════════════════════════════════ */
export function HeroPlusGallerySkeleton({
  label,
  secondaryLabel,
  ref,
}: {
  label: string;
  secondaryLabel?: string;
  ref?: React.Ref<HTMLElement>;
}) {
  const isAlmostGone = label.includes('order soon');

  return (
    <section
      ref={ref}
      className="py-2 bg-beige"
      style={isAlmostGone ? { borderLeft: '4px solid rgba(0,0,0,0.2)' } : undefined}
    >
      <div className="container mx-auto">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
            {label}
          </h2>
          {secondaryLabel && (
            <p className="text-black/50 mt-1 text-sm">{secondaryLabel}</p>
          )}
        </div>

        {/* ── Mobile: 3-column strip of PanelCard-style skels ── */}
        <div className="md:hidden grid grid-cols-3 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} aspect="aspect-[3/2]" delay={i * 50} />
          ))}
        </div>

        {/* ── Desktop: hero (30%) + gallery grid (70%) ── */}
        <div className="hidden md:grid grid-cols-[30%_70%] gap-3">
          {/* Hero */}
          <SkeletonHeroCard />

          {/* Gallery — 4 columns × 2 rows = 8 cards, each PanelCard-style */}
          <div className="grid grid-cols-4 grid-rows-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} aspect="aspect-[3/2]" delay={i * 60} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   JustLandedSkeleton — mirrors JustLandedPanel layout
   ══════════════════════════════════════════════════════ */
export function JustLandedSkeleton({ ref }: { ref?: React.Ref<HTMLElement> }) {
  return (
    <section ref={ref} className="py-2 bg-beige">
      <div className="container mx-auto">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
            Just Landed
          </h2>
          <p className="text-black/50 mt-1 text-sm">Fresh arrivals at JP Tech</p>
        </div>

        {/* ── Mobile: 2-column strip of PanelCard-style skels ── */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} aspect="aspect-[3/2]" delay={i * 50} />
          ))}
        </div>

        {/* ── Desktop: hero (20%) + gallery grid (80%) ── */}
        <div className="hidden md:grid grid-cols-[20%_80%] gap-6">
          {/* Hero */}
          <SkeletonHeroCard />

          {/* Gallery — 4 columns × 2 rows = 8 cards */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} aspect="aspect-[3/2]" delay={i * 60} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
