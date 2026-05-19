'use client';

import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Minus, Plus, Trash2, ShoppingBag, ShoppingCart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, clearCart,
    subtotal, products, loadCartItem, isItemLoading,
  } = useCart();
  const { t } = useLanguage();

  /* ─── fees ───────────────────────────────── */
  const deliveryFee = 1500;                   // fixed 1 500 RWF
  const tax = 0;                               // zero tax on cart page
  const total = subtotal + tax + deliveryFee;

  /* ─── format helper ──────────────────────── */
  const formatPrice = (price: number | undefined) =>
    `${(price ?? 0).toLocaleString()} RWF`;
  const formatPriceOrLoading = (price: number | undefined, loading: boolean) =>
    loading
      ? <span className="inline-flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…</span>
      : formatPrice(price);

  /* ─── any item currently loading? ─────────── */
  const anyLoading = items.some(item => isItemLoading(item.productId));

  return (
    <div className="min-h-screen bg-beige py-8">
      <div className="container mx-auto px-2">

        {/* ── title ───────────────────────────── */}
        <h1 className="text-sm font-bold mb-8 tracking-widest text-gold uppercase">
          __SHOPING CART
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
            <Link href="/" className="btn-primary inline-block">{t('cart.continue')}</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Cart Items ─────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = products[item.productId];
                const loading = isItemLoading(item.productId);

                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-lg p-4 shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-beige rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {product && product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name?.en || 'Product'}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            priority
                          />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {product
                            ? (product.name?.en || product.name?.rw || 'Product')
                            : 'Loading product…'}
                        </h3>

                        {/* price — shows Loading… spinner while flag is set */}
                        <p className="text-gold font-bold">
                          {product
                            ? formatPriceOrLoading(product.price, loading)
                            : '—'}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              loadCartItem(item.productId);
                              updateQuantity(item.productId, item.quantity - 1);
                            }}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-beige"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => {
                              loadCartItem(item.productId);
                              updateQuantity(item.productId, item.quantity + 1);
                            }}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-beige"
                            aria-label="Increase quantity"
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
                <button onClick={clearCart} className="text-red-500 hover:underline">Clear Cart</button>
                <Link href="/" className="text-gold hover:underline">Continue Shopping</Link>
              </div>
            </div>

            {/* ── Order Summary ───────────────────── */}
            <div className="bg-white rounded-lg p-6 shadow h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* per-item lines */}
              <div className="text-sm border-b pb-3 mb-3 space-y-2">
                {items.map((item) => {
                  const product = products[item.productId];
                  const unitPrice = product?.price ?? 0;
                  const lineTotal = unitPrice * item.quantity;
                  return (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center"
                    >
                      <span className="truncate max-w-[60%]">
                        {product
                          ? `${product.name?.en || product.name?.rw || 'Product'} × ${item.quantity}`
                          : `Loading… × ${item.quantity}`}
                      </span>
                      <span className="font-semibold whitespace-nowrap">
                        {product ? formatPrice(lineTotal) : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className={`font-semibold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                    {anyLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className={`font-semibold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                    {anyLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.delivery')}</span>
                  <span className={`font-semibold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                    {anyLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className={`border-t pt-3 flex justify-between text-lg font-bold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                  <span>{t('cart.total')}</span>
                  <span className={`text-gold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                    {anyLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="w-full btn-primary block text-center mt-6">
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
