'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Minus, Plus, Trash2, ShoppingBag, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { t } = useLanguage();

  const deliveryFee = subtotal > 500000 ? 0 : (items.length > 0 ? 3000 : 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax + deliveryFee;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  return (
    <div className="min-h-screen bg-beige py-8">
      <div className="container mx-auto px-0">
        <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
            <Link href="/" className="btn-primary inline-block">
              {t('cart.continue')}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                // We'll fetch product data in a real app; using placeholder for now
                return (
                  <div key={item.productId} className="bg-white rounded-lg p-4 shadow">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-beige rounded flex items-center justify-center">
                        <Store className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Product Name</h3>
                        <p className="text-gold font-bold">Unknown price</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-beige"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-beige"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="ml-auto text-red-500 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between">
                <button onClick={clearCart} className="text-red-500 hover:underline">
                  Clear Cart
                </button>
                <Link href="/" className="text-gold hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 shadow h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.tax')} (18%)</span>
                  <span className="font-semibold">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.delivery')}</span>
                  <span className="font-semibold">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn-primary block text-center mt-6"
              >
                {t('cart.checkout')}
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Free delivery on orders above 500,000 RWF
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

