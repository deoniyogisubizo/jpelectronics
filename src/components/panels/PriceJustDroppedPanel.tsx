'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { HeroPlusGallerySkeleton } from './SkeletonScreens';
import { useHomeData } from '@/context/HomeDataContext';

function HoverCartSelector({ product, className }: { product: any; className?: string }) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const cartItem = items.find((item: CartItem) => item.productId === product._id);
  const qty = cartItem?.quantity ?? 0;
  const inCart = cartItem !== undefined;

  const handleAddStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      updateQuantity(product._id, qty + 1);
    } else {
      addItem(product._id, 1);
    }
  };

  const handleSubStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty > 1) {
      updateQuantity(product._id, qty - 1);
    } else {
      removeItem(product._id);
    }
  };

  return (
    <div
      className={`relative h-9 ${className ?? ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop: keep original text + hover quantity selector */}
      <div className="hidden md:block">
        <button
          className={`w-full h-full py-1.5 bg-black text-white font-medium transition-all duration-200 absolute inset-0 ${isHovered ? 'opacity-0 pointer-events-none scale-y-0' : 'opacity-90 pointer-events-auto scale-y-100'}`}
        >
          Shop Now — Limited Time!
        </button>
        <div
          className={`absolute inset-0 flex items-center transition-all duration-200 ${isHovered ? 'opacity-100 pointer-events-auto scale-y-100' : 'opacity-0 pointer-events-none scale-y-0'}`}
        >
          <button onClick={handleSubStep} className="h-full px-3 bg-black text-white text-sm font-bold hover:bg-black/80 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-full flex-1 flex items-center justify-center bg-black/5 text-xs font-bold text-black">
            {inCart ? qty : 'Add'}
          </div>
          <button onClick={handleAddStep} className="h-full px-3 bg-black text-white text-sm font-bold hover:bg-black/80 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile only: simple cart-plus icon at the right end */}
      <div className="md:hidden absolute right-0 bottom-0">
        <button
          onClick={handleAddStep}
          className="h-7 w-7 flex items-center justify-center bg-black text-gold rounded-full text-sm active:scale-95 transition-transform"
          aria-label="Add to cart"
        >
          <i className="fa-solid fa-cart-plus"></i>
        </button>
      </div>
    </div>
  );
}

function PanelCard({ product }: { product: any }) {
  const formatPrice = (price: number | undefined) => {
    if (price == null) return '0 RWF';
    return `${price.toLocaleString()} RWF`;
  };

  return (
    <div className="overflow-hidden group relative">
      <div className="relative aspect-[3/2] overflow-hidden bg-beige-solid">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name?.en || 'product'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-gold text-black text-xs px-2 py-0.5 rounded-full font-bold">-{product.discount}%</div>
      </div>
      <div className="p-2">
        <p className="text-xs text-black/60 uppercase tracking-wide mb-0.5">{product.brand}</p>
        <h4 className="font-medium text-black text-xs line-clamp-2 min-h-[1.5rem]">{product.name?.en}</h4>
        <p className="text-xs text-black/50 mb-1 line-clamp-2">
          {product.description?.en?.substring?.(0, 60) ?? ''}…
        </p>
        <div className="flex items-center gap-1">
          <span
            className="bg-gold text-black text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span
              className="bg-gray-200 text-gray-500 text-xs px-1.5 py-0.5 rounded line-through"
              style={{ fontFamily: 'var(--font-share-tech-mono)' }}
            >
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        {product.inStock && <HoverCartSelector product={product} className="mt-1" />}
      </div>
    </div>
  );
}

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

  const formatPrice = (price: number | undefined) => {
    if (price == null) return '0 RWF';
    return `${price.toLocaleString()} RWF`;
  };

  if (!loaded) {
    return <HeroPlusGallerySkeleton label="Price Just Dropped" secondaryLabel="Save now before prices go back up" ref={ref} />;
  }

  if (!products.length) return null;

  const heroProduct = products[0];
  const galleryProducts = products.slice(1);

  return (
    <section className="py-2 bg-beige">
      <div className="container mx-auto">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Price Just Dropped</h2>
          <p className="text-black/50 mt-1 text-sm">Save now before prices go back up</p>
        </div>

        {/* Mobile */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {products.slice(0, 4).map((product: any) => (
            <PanelCard key={product._id} product={product} />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-[70%_30%] gap-3">
          <div className="grid grid-cols-4 grid-rows-2 gap-3">
            {galleryProducts.map((product: any) => (
              <PanelCard key={product._id} product={product} />
            ))}
          </div>

          <Link href={`/product/${heroProduct._id}`}>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm">
              <div className="relative aspect-[3/4] overflow-hidden bg-beige-solid">
                {heroProduct.images && heroProduct.images.length > 0 ? (
                  <Image
                    src={heroProduct.images[0]}
                    alt={heroProduct.name?.en || 'product'}
                    width={1}
                    height={1}
                    sizes="(max-width: 768px) 100vw, 17vw"
                    className="object-cover"
                    style={{ width: '100%', height: '100%' }}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingCart className="w-12 h-12" /></div>
                )}
                <div className="absolute top-2 left-2 bg-gold text-black text-xs px-2 py-1 rounded font-bold">-{heroProduct.discount}%</div>
              </div>
              <div className="p-4">
                <p className="text-xs text-black/60 uppercase tracking-wide mb-2">{heroProduct.brand}</p>
                <h3 className="font-semibold text-black mb-2">{heroProduct.name?.en}</h3>
                <p className="text-black/50 mb-3 text-xs leading-relaxed">{heroProduct.description?.en || ''}</p>
                <div className="mb-3">
                  <span className="bg-gold text-black text-lg font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(heroProduct.price)}</span>
                  {heroProduct.compareAtPrice && heroProduct.compareAtPrice > heroProduct.price && (
                    <span className="bg-gray-200 text-gray-500 text-base px-2 py-0.5 rounded ml-2" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(heroProduct.compareAtPrice)}</span>
                  )}
                </div>
                <button className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors text-sm">Shop Now — Limited Time!</button>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex justify-end mt-4">
          <Link href="/category" className="text-xs border border-black/20 text-black px-3 py-1 rounded hover:bg-black/5 transition-colors">View More</Link>
        </div>
      </div>
    </section>
  );
}
