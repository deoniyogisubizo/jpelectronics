'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Plus, Minus, ShoppingBag, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const productMap: Record<string, Product> = {};
        data.forEach((p: Product) => {
          productMap[p._id] = p;
        });
        setProducts(productMap);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleCheckout = () => {
    setIsOpen(false);
    window.location.href = '/checkout';
  };

  const deliveryFee = subtotal > 50000 ? 0 : (items.length > 0 ? 3000 : 0);
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'cart-drawer-open' : 'cart-drawer-closed'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            {t('cart.title')}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-beige rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('cart.empty')}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-gold font-semibold hover:underline"
              >
                {t('cart.continue')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex gap-3 bg-beige-light p-3 rounded-lg">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name.en}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-beige rounded flex items-center justify-center">
                          <Store className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{product.name.en}</h4>
                      <p className="text-gold font-semibold mt-1">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-beige"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-beige"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-auto text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.delivery')}</span>
                <span className="font-semibold">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>{t('cart.total')}</span>
                <span className="text-gold">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary"
            >
              {t('cart.checkout')}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full btn-outline"
            >
              {t('cart.continue')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
