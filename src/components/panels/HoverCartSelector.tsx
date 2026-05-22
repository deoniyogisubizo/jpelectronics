'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types';
import { Minus, Plus } from 'lucide-react';

interface HoverCartSelectorProps {
  product: any;
  className?: string;
  ctaText?: string; // custom broadcast style text like "GRAB IT NOW"
  urgency?: boolean;
}

export default function HoverCartSelector({ product, className, ctaText = 'Add In Cart', urgency = false }: HoverCartSelectorProps) {
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
      {/* Desktop: broadcast style CTA + hover qty */}
      <div className="hidden md:block">
        <button
          className={`w-full h-full py-1.5 ${urgency ? 'bg-red-600' : 'bg-black'} text-white font-semibold transition-all duration-200 absolute inset-0 rounded ${isHovered ? 'opacity-0 pointer-events-none scale-y-0' : 'opacity-95 pointer-events-auto scale-y-100'}`}
        >
          {ctaText}
        </button>
        <div
          className={`absolute inset-0 flex items-center transition-all duration-200 rounded overflow-hidden ${isHovered ? 'opacity-100 pointer-events-auto scale-y-100' : 'opacity-0 pointer-events-none scale-y-0'}`}
        >
          <button onClick={handleSubStep} className="h-full px-3 bg-black text-white text-sm font-bold hover:bg-black/80 active:bg-black transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-full flex-1 flex items-center justify-center bg-black/5 text-xs font-bold text-black">
            {inCart ? qty : '1'}
          </div>
          <button onClick={handleAddStep} className="h-full px-3 bg-black text-white text-sm font-bold hover:bg-black/80 active:bg-black transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile: gold cart icon */}
      <div className="md:hidden absolute right-0 bottom-0">
        <button
          onClick={handleAddStep}
          className="h-8 w-8 flex items-center justify-center bg-black text-gold rounded-full text-sm active:scale-95 transition-transform shadow"
          aria-label="Add to cart"
        >
          <i className="fa-solid fa-cart-plus"></i>
        </button>
      </div>
    </div>
  );
}
