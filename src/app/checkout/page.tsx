'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { rwandaDistricts } from '@/i18n';
import { Store, CreditCard, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLanguage();

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

  const deliveryFee = rwandaDistricts.find(d => d.name === form.district)?.deliveryFee || 3000;
  const tax = subtotal * 0.18;
  const total = subtotal + tax + deliveryFee;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Create order (without backend for now)
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-beige py-12">
        <div className="container mx-auto px-0 text-center">
          <div className="bg-white rounded-lg p-8 max-w-lg mx-auto">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Your order number: JP{Date.now().toString().slice(-8)}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We'll contact you shortly to confirm delivery.
            </p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige py-8">
      <div className="container mx-auto px-0 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

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
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    {t('checkout.shipping')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="px-2 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="px-2 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-2 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value, sector: '' })}
                    className="w-full px-2 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select District</option>
                    {rwandaDistricts.map(d => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    className="w-full px-2 py-2 border rounded-lg"
                    required
                    disabled={!form.district}
                  >
                    <option value="">Select Sector</option>
                    {rwandaDistricts.find(d => d.name === form.district)?.sectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Full Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-2 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full btn-primary"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {t('checkout.payment')}
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-beige">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={form.paymentMethod === 'cash'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-beige">
                      <input
                        type="radio"
                        name="payment"
                        value="mtn"
                        checked={form.paymentMethod === 'mtn'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">MTN Mobile Money</p>
                        <p className="text-sm text-gray-500">Pay via MTN MoMo</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-beige">
                      <input
                        type="radio"
                        name="payment"
                        value="airtel"
                        checked={form.paymentMethod === 'airtel'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">Airtel Money</p>
                        <p className="text-sm text-gray-500">Pay via Airtel Money</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 btn-primary">
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">{t('checkout.review')}</h2>
                  <div className="bg-beige-light p-4 rounded">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p>{form.firstName} {form.lastName}</p>
                    <p>{form.phone}</p>
                    <p>{form.address}, {form.sector}, {form.district}</p>
                  </div>
                  <div className="bg-beige-light p-4 rounded">
                    <h3 className="font-semibold mb-2">Payment</h3>
                    <p className="capitalize">{form.paymentMethod}</p>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(2)} className="btn-outline">
                      Back
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      {t('checkout.placeOrder')}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="text-sm space-y-2 mb-4">
                {items.slice(0, 3).map(item => (
                  <div key={item.productId} className="flex justify-between">
                    <span>Product × {item.quantity}</span>
                    <span>{(subtotal / items.reduce((a, b) => a + b.quantity, 1)).toFixed(0)} RWF</span>
                  </div>
                ))}
                {items.length > 3 && <p className="text-gray-500">+{items.length - 3} more items</p>}
              </div>
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.tax')}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.delivery')}</span>
                  <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t('cart.total')}</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

