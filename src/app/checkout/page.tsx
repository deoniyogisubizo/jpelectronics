'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigation } from '@/context/NavigationContext';
import { rwandaDistricts } from '@/i18n';
import { Store, CreditCard, CheckCircle, Minus, Plus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, loadCartItem, isItemLoading, subtotal, products, clearCart } = useCart();
  const { t } = useLanguage();
  const { navigateTo } = useNavigation();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    district: '',
    sector: '',
    address: '',
    paymentMethod: 'cash',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => `JP${Date.now().toString().slice(-8)}`);

  /* ─── fees (match cart page) ───────────────── */
  const deliveryFee = 1500;   // fixed 1500 RWF
  const tax = 0;               // zero tax
  const total = subtotal + tax + deliveryFee;

  const formatPrice = (price: number | undefined) =>
    `${(price ?? 0).toLocaleString()} RWF`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-beige py-12">
        <div className="container mx-auto px-2 text-center">
          <div className="bg-white rounded-lg p-8 max-w-lg mx-auto">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-4">
                Your order number: {orderNumber}
              </p>
            <p className="text-sm text-gray-500 mb-6">
              We will contact you shortly to confirm delivery.
            </p>
            <button onClick={() => navigateTo('/')} className="btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── any item currently loading? ─────────── */
  const anyLoading = items.some(item => isItemLoading(item.productId));

  return (
    <div className="min-h-screen bg-beige py-8">
      <div className="container mx-auto px-2 max-w-4xl">

        {/* ── title ───────────────────────────── */}
        <h1 className="text-sm font-bold mb-8 tracking-widest text-gold uppercase">
          {t('checkout.title').toUpperCase()}
        </h1>

        {/* Steps */}
        <div className="flex mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 pb-2 ${s <= step ? 'border-b-2 border-gold' : 'border-b border-gray-300'}`}>
              <span className={`text-sm ${s <= step ? 'text-gold font-semibold' : 'text-gray-500'}`}>
                {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* ── Form ────────────────────────────── */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow space-y-4">

              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    {t('checkout.shipping')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="px-2 py-2 border rounded-lg" required />
                    <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="px-2 py-2 border rounded-lg" required />
                  </div>
                  <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-2 py-2 border rounded-lg" required />
                  <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-2 py-2 border rounded-lg" />
                  <select value={form.district} onChange={e => setForm({ ...form, district: e.target.value, sector: '' })} className="w-full px-2 py-2 border rounded-lg" required>
                    <option value="">Select District</option>
                    {rwandaDistricts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                  <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} className="w-full px-2 py-2 border rounded-lg" required disabled={!form.district}>
                    <option value="">Select Sector</option>
                    {rwandaDistricts.find(d => d.name === form.district)?.sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
                  </select>
                  <textarea placeholder="Full Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-2 py-2 border rounded-lg" rows={3} required />
                  <button type="button" onClick={() => setStep(2)} className="w-full btn-primary">Continue to Payment</button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {t('checkout.payment')}
                  </h2>
                  <div className="space-y-3">
                    {[
                      { value: 'cash', label: 'Cash on Delivery', sub: 'Pay when you receive your order' },
                      { value: 'mtn', label: 'MTN Mobile Money', sub: 'Pay via MTN MoMo' },
                      { value: 'airtel', label: 'Airtel Money', sub: 'Pay via Airtel Money' },
                    ].map(opt => (
                      <label key={opt.value} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-beige">
                        <input type="radio" name="payment" value={opt.value} checked={form.paymentMethod === opt.value} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{opt.label}</p>
                          <p className="text-sm text-gray-500">{opt.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 btn-primary">Review Order</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-xl font-bold mb-4">{t('checkout.review')}</h2>
                  <div className="bg-beige-light p-4 rounded space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1">Shipping Address</h3>
                      <p>{form.firstName} {form.lastName}</p>
                      <p>{form.phone}</p>
                      <p>{form.address}, {form.sector}, {form.district}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Payment</h3>
                      <p className="capitalize">{form.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(2)} className="btn-outline">Back</button>
                    <button type="submit" className="flex-1 btn-primary">{t('checkout.placeOrder')}</button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* ── Order Summary ──────────────────── */}
          {/*
            Mirrors the cart page's Order Summary:
            • real product name + image per item
            • real price × qty per line (no average bug)
            • tax = 0, deliveryFee = 1500 RWF
            • 3-sec spinner (± click) via isItemLoading / loadCartItem
            • Remove button per item
            • Update Quantity via ± icons
          */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow sticky top-24">

              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* product lines — real data from products map */}
              <div className="space-y-3 mb-3">
                {items.map((item) => {
                  const product = products[item.productId];
                  const loading = isItemLoading(item.productId);
                  const unitPrice = product?.price ?? 0;
                  const lineTotal = unitPrice * item.quantity;
                  return (
                    <div
                      key={item.productId}
                      className={`flex gap-3 items-start ${loading ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      {/* thumbnail */}
                      <div className="w-12 h-12 bg-beige rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {product && product.images?.length > 0 ? (
                          <Image src={product.images[0]} alt={product.name?.en || 'Product'} width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      {/* name + qty adjuster */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {product
                            ? (product.name?.en || product.name?.rw || 'Product')
                            : `Product ${item.productId.slice(-4)}`}
                        </p>

                        {/* ± quantity controls */}
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            type="button"
                            onClick={() => { loadCartItem(item.productId); updateQuantity(item.productId, item.quantity - 1); }}
                            className="w-6 h-6 border rounded flex items-center justify-center hover:bg-beige text-xs"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => { loadCartItem(item.productId); updateQuantity(item.productId, item.quantity + 1); }}
                            className="w-6 h-6 border rounded flex items-center justify-center hover:bg-beige text-xs"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* line total + remove */}
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-semibold ${loading ? 'inline-flex items-center gap-1' : ''}`}>
                          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                          {product ? formatPrice(lineTotal) : '—'}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 text-xs hover:underline flex items-center gap-0.5 ml-auto mt-0.5"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className={`font-semibold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                    {anyLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.tax')}</span>
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
                <div className={`border-t pt-2 flex justify-between text-lg font-bold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                  <span>{t('cart.total')}</span>
                  <span className={`text-gold ${anyLoading ? 'inline-flex items-center gap-1' : ''}`}>
                    {anyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Link href="/cart" className="text-xs text-gray-500 underline block text-center mt-4">
                ← Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
