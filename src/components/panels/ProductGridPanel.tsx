'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import Masonry from 'react-masonry-css';

/** Shared hover cart quantity selector rendered as an overlay on the card footer. */
function HoverCartSelector({ product }: { product: any }) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const cartItem = items.find((item: CartItem) => item.productId === product._id);
  const qty = cartItem?.quantity ?? 0;
  const inCart = cartItem !== undefined;

  const handleAddStep = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    inCart ? updateQuantity(product._id, qty + 1) : addItem(product._id, 1);
  };
  const handleSubStep = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    qty > 1 ? updateQuantity(product._id, qty - 1) : removeItem(product._id);
  };

  return (
    <div className="relative h-9" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button className={`w-full h-full py-1.5 bg-black text-white rounded-lg font-medium transition-all duration-200 absolute inset-0 ${isHovered ? 'opacity-0 pointer-events-none scale-y-0' : 'opacity-100 pointer-events-auto scale-y-100'}`}>
        Add In Cart
      </button>
      <div className={`absolute inset-0 flex items-center justify-between transition-all duration-200 ${isHovered ? 'opacity-100 pointer-events-auto scale-y-100' : 'opacity-0 pointer-events-none scale-y-0'}`}>
        <button onClick={handleSubStep} className="h-full px-2.5 bg-black text-white rounded-l-lg text-sm font-bold hover:bg-black/80 transition-colors">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="h-full flex-1 flex items-center justify-center bg-black/5 border-t border-b border-black/10 text-xs font-bold text-black">
          {inCart ? qty : 'Add'}
        </div>
        <button onClick={handleAddStep} className="h-full px-2.5 bg-black text-white rounded-r-lg text-sm font-bold hover:bg-black/80 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/** Compact card for gallery grids in panels. */
function PanelCard({ product, aspect }: { product: any; aspect?: string }) {
  const formatPrice = (price: number | undefined) => price == null ? '0 RWF' : `${price.toLocaleString()} RWF`;
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-black/10 card-hover">
      <div className={`relative ${aspect ?? 'aspect-square'} overflow-hidden bg-beige-solid`}>
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name?.en || 'product'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingCart className="w-10 h-10" /></div>
        )}
        {product.hotDeal && <span className="hot-badge">HOT</span>}
        {product.discount && product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
        {!product.inStock && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white font-bold">Out of Stock</span></div>}
      </div>
      <div className="p-3">
        <p className="text-xs text-black/60 uppercase tracking-wide mb-0.5">{product.brand}</p>
        <h3 className="font-medium text-black text-sm mb-1 line-clamp-2">{product.name?.en}</h3>
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          <span className="bg-gold text-black text-xs font-bold px-1.5 py-0.5 rounded" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="bg-gray-200 text-gray-500 text-xs px-1.5 py-0.5 rounded line-through" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        {product.inStock && <HoverCartSelector product={product} />}
      </div>
    </div>
  );
}

export default function ProductGridPanel() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [products, setProducts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inView && !loaded) {
      fetch('/api/products').then(res => res.json()).then(data => { setProducts(data); setLoaded(true); }).catch(err => { console.error(err); setLoaded(true); });
    }
  }, [inView, loaded]);

  const formatPrice = (price: number | undefined) => price == null ? '0 RWF' : `${price.toLocaleString()} RWF`;

  if (!loaded) {
    return (
      <section ref={ref} className="py-2 bg-beige">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Featured Products</h2>
          <div className="text-center py-8">Loading products…</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 bg-beige">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Featured Products</h2>
        <Masonry
          breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {products.slice(0, 20).map((product: any, index: number) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group block">
              <PanelCard product={product} aspect={index % 3 === 0 ? 'aspect-[4/3]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]'} />
            </Link>
          ))}
        </Masonry>
      </div>
    </section>
  );
}
