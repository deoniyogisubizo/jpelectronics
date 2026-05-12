'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState<null | {
    status: string;
    date: string;
    items: string;
    total: string;
    tracking: string;
  }>(null);

  const handleTrack = () => {
    // Demo tracking
    if (orderNumber.length >= 6) {
      setOrderDetails({
        status: 'In Transit',
        date: '2024-04-20',
        items: '2 items',
        total: '450,000 RWF',
        tracking: 'JP' + orderNumber.slice(-8),
      });
    }
  };

  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-beige flex flex-col">
          <Header />

          <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-8 text-center">Track Your Order</h1>

              {/* Track Form */}
              <div className="max-w-lg mx-auto mb-12">
                <div className="bg-white rounded-lg p-6 shadow">
                  <label className="block text-sm font-medium mb-2">
                    Enter your Order Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g., JP123456"
                      className="flex-1 px-4 py-3 border rounded-lg"
                    />
                    <button
                      onClick={handleTrack}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Track
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              {orderDetails && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-lg p-6 shadow mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold">Order #{orderNumber}</h2>
                        <p className="text-gray-500 text-sm">{orderDetails.date}</p>
                      </div>
                      <span className="bg-gold text-black px-4 py-2 rounded-full font-semibold">
                        {orderDetails.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Items</span>
                        <span>{orderDetails.items}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total</span>
                        <span className="font-semibold">{orderDetails.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tracking Number</span>
                        <span className="font-mono font-semibold">{orderDetails.tracking}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h3 className="font-bold mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-3 h-3 bg-gold rounded-full mt-1"></div>
                        <div>
                          <p className="font-medium">Order Confirmed</p>
                          <p className="text-sm text-gray-500">{orderDetails.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-3 h-3 bg-gold rounded-full mt-1"></div>
                        <div>
                          <p className="font-medium">Processing</p>
                          <p className="text-sm text-gray-500">{orderDetails.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1 animate-pulse"></div>
                        <div>
                          <p className="font-medium">In Transit - <span className="text-green-600">Out for delivery</span></p>
                          <p className="text-sm text-gray-500">Estimated: Tomorrow</p>
                        </div>
                      </div>
                      <div className="flex gap-4 opacity-50">
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full mt-1"></div>
                        <div>
                          <p className="font-medium">Delivered</p>
                          <p className="text-sm text-gray-500">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
