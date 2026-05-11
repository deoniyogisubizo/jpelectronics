import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import dynamic from 'next/dynamic';
import CategoryTile from '@/components/CategoryTile';
import RepairServicesPanel from '@/components/RepairServicesPanel';
import { getCategories } from '@/lib/db';
import { Store, Truck, Shield, MessageCircle, Package, TrendingDown, Users, AlertTriangle, BarChart3, Recycle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Preloader from '@/components/Preloader';

const HeroVideo = dynamic(() => import('@/components/HeroVideo'));
const AlmostGonePanel = dynamic(() => import('@/components/panels/AlmostGonePanel'));
const PriceJustDroppedPanel = dynamic(() => import('@/components/panels/PriceJustDroppedPanel'));
const JustLandedPanel = dynamic(() => import('@/components/panels/JustLandedPanel'));
const ProductGridPanel = dynamic(() => import('@/components/panels/ProductGridPanel'));

export const revalidate = 60;

// Panel components

function LocallyPopularPanel() {
  return (
    <section className="py-2 md:py-2 bg-green-50">
      <div className="container mx-auto px-2">
        <div className="mb-4 md:mb-6">
          <h2 className="text-base md:text-xl font-bold text-green-700" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Most Popular in Kigali</h2>
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 shadow">
          <div className="md:grid md:grid-cols-3 md:gap-4">
            <div className="md:hidden flex flex-col">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2">
                  <h3 className="font-bold text-sm mb-1">Samsung Galaxy S24 Ultra</h3>
                  <p className="text-xl font-bold text-green-600">156 orders</p>
                  <p className="text-xs text-gray-500">this week in Kigali</p>
                  <Link href="/category/smartphones" className="text-gold font-bold text-xs border border-gold/50 mt-1 block px-2 py-1 rounded">I want this</Link>
                </div>
                <div className="text-center p-2">
                  <h3 className="font-bold text-sm mb-1">MacBook Air M2</h3>
                  <p className="text-xl font-bold text-green-600">89 orders</p>
                  <p className="text-xs text-gray-500">this week in Kigali</p>
                  <Link href="/category/laptops" className="text-gold font-bold text-xs border border-gold/50 mt-1 block px-2 py-1 rounded">I want this</Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="text-center p-2 w-full max-w-xs">
                  <h3 className="font-bold text-sm mb-1">iPhone 15 Pro</h3>
                  <p className="text-xl font-bold text-green-600">134 orders</p>
                  <p className="text-xs text-gray-500">this week in Kigali</p>
                  <Link href="/category/smartphones" className="text-gold font-bold text-xs border border-gold/50 mt-1 block px-2 py-1 rounded">I want this</Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block text-center p-3">
              <h3 className="font-bold text-base mb-1">Samsung Galaxy S24 Ultra</h3>
              <p className="text-2xl font-bold text-green-600">156 orders</p>
              <p className="text-xs text-gray-500">this week in Kigali</p>
              <Link href="/category/smartphones" className="text-gold font-bold text-xs border border-gold/50 mt-1 block px-2 py-1 rounded">I want this</Link>
            </div>
            <div className="hidden md:block text-center p-3">
              <h3 className="font-bold text-base mb-1">MacBook Air M2</h3>
              <p className="text-2xl font-bold text-green-600">89 orders</p>
              <p className="text-xs text-gray-500">this week in Kigali</p>
              <Link href="/category/laptops" className="text-gold font-bold text-xs border border-gold/50 mt-1 block px-2 py-1 rounded">I want this</Link>
            </div>
            <div className="hidden md:block text-center p-3">
              <h3 className="font-bold text-base mb-1">iPhone 15 Pro</h3>
              <p className="text-2xl font-bold text-green-600">134 orders</p>
              <p className="text-xs text-gray-500">this week in Kigali</p>
              <Link href="/category/smartphones" className="text-gold font-bold text-xs border border-gold/50 mt-1 block px-2 py-1 rounded">I want this</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationPanel() {
  return (
    <section className="py-2 bg-yellow-50">
      <div className="container mx-auto px-2">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-black" />
          <h2 className="text-lg md:text-3xl font-bold text-yellow-700" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Before You Buy</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-3">Buying a Laptop?</h3>
            <p className="text-sm text-gray-600 mb-3">Check: RAM (8GB+), Storage (256GB+ SSD), Processor (Intel i5/Ryzen 5+)</p>
            <Link href="/category/laptops" className="text-yellow-600 font-semibold hover:underline block text-right">Compare Laptops →</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-3">Which Smartphone?</h3>
            <p className="text-sm text-gray-600 mb-3">Priority: Camera quality, Battery life (4000mAh+), Storage (128GB+)</p>
            <Link href="/category/smartphones" className="text-yellow-600 font-semibold hover:underline block text-right">Browse Phones →</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-3">Smart TV Guide</h3>
            <p className="text-sm text-gray-600 mb-3">4K resolution, HDR support, 32"+ for living room, 40"+ for cinema feel</p>
            <Link href="/category/smart-tvs" className="text-yellow-600 font-semibold hover:underline block text-right">View TVs →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityPanel() {
  return (
    <section className="py-2 bg-teal-50">
      <div className="container mx-auto px-2">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-teal-600" />
          <h2 className="text-lg md:text-xl font-bold text-teal-700" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>📊 Community Picked</h2>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold mb-2">Which Laptop Should You Buy?</h3>
          <p className="text-sm text-gray-600 mb-4">1,427 customers compared these 3 laptops — here's what they chose</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-1 border-2 border-teal-500 rounded-lg p-3 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                89% CHOSE THIS
              </div>
              <div className="text-center pt-2">
                <div className="text-xl mb-1">💻</div>
                <h4 className="font-bold text-sm">MacBook Air M2</h4>
                <p className="text-xs text-gray-500">Best Overall</p>
                <p className="text-teal-600 font-semibold mt-1">1,267 votes</p>
              </div>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="text-xl mb-1">💻</div>
              <h4 className="font-bold text-sm">Dell XPS 15</h4>
              <p className="text-xs text-gray-500">Best Performance</p>
              <p className="text-gray-400 mt-1">112 votes (8%)</p>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="text-xl mb-1">💻</div>
              <h4 className="font-bold text-sm">ThinkPad X1</h4>
              <p className="text-xs text-gray-500">Best for Work</p>
              <p className="text-gray-400 mt-1">58 votes (4%)</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/category/laptops" className="text-teal-600 font-semibold hover:underline">
              Compare All Laptops →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RealBuyerStory() {
  return (
    <section className="py-2 bg-orange-50">
      <div className="container mx-auto px-2">
        <div className="mb-4">
          <h2 className="text-lg md:text-2xl font-bold text-orange-700" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>💬 Real Buyer Story</h2>
        </div>
        <div className="bg-white rounded-lg p-4 shadow max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-600 text-sm">S.K</div>
            <div>
              <div className="font-semibold text-sm">Samuel Kayondo</div>
              <div className="text-xs text-gray-500">Kigali — Verified Purchase</div>
            </div>
          </div>
          <h3 className="font-bold text-base mb-2">"The Samsung S24 Ultra changed my photography game"</h3>
          <p className="text-gray-600 mb-3 text-sm">
            "I researched for 3 weeks before buying. JP Tech's delivery was fast (next day in Kigali!), and the phone arrived in perfect condition.
            The camera zoom is incredible for wedding photography — I've already recommended this to 5 colleagues. Worth every RWF."
          </p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
            <span className="text-gray-500 ml-2 text-xs">100% helpful (23 people)</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rank our service:</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 cursor-pointer hover:text-yellow-500">★</span>
                ))}
              </div>
            </div>
            <button className="border border-gold/20 text-gold px-3 py-1 rounded text-sm hover:bg-gold/10">
              Add Your Review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-gradient-to-r from-black to-gray-800 text-white py-2">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-8 h-8 text-yellow-400" />
            <h3 className="font-semibold">Fast Delivery</h3>
            <p className="text-sm text-gray-400">Kigali: 1-2 days</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MessageCircle className="w-8 h-8 text-yellow-400" />
            <h3 className="font-semibold">WhatsApp Support</h3>
            <p className="text-sm text-gray-400">+250 790 336 683</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8 text-yellow-400" />
            <h3 className="font-semibold">1 Year Warranty</h3>
            <p className="text-sm text-gray-400">All products</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Store className="w-8 h-8 text-yellow-400" />
            <h3 className="font-semibold">Cash on Delivery</h3>
            <p className="text-sm text-gray-400">Pay on delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <Header />

      {/* Hero Video Section */}
      <HeroVideo />

      {/* Category Tiles */}
      <section className="py-1 md:py-2 bg-beige">
        <div className="container mx-auto px-1 md:px-2">
          <h2 className="text-xs md:text-xl font-bold my-6 md:my-12 text-center uppercase" style={{ fontFamily: 'Outfit, sans-serif' }}>
            In our shop we deliver all these category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
            {categories.map((cat: any) => (
              <CategoryTile key={cat._id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Panel 1: Almost Gone */}
      <AlmostGonePanel />

      {/* Panel 2: Price Just Dropped */}
      <PriceJustDroppedPanel />

      {/* Panel 3: Just Landed */}
      <JustLandedPanel />

      {/* Panel 4: Locally Popular */}
      <LocallyPopularPanel />

      {/* Panel 4.5: Repair Services */}
      <RepairServicesPanel />

      {/* Panel 5: Build Your Bundle */}
      <section className="py-2 bg-green-50">
        <div className="container mx-auto px-2">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700">Build Your Bundle</h2>
          </div>
          <div className="bg-white rounded-lg p-3 md:p-4 shadow">
            <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">Create your perfect tech setup and save up to 25%</p>
            <div className="md:grid md:grid-cols-4 md:gap-3 md:mb-4">
              <div className="md:hidden flex flex-col gap-2 mb-3">
                <div className="flex justify-center">
                  <div className="rounded-lg p-2 text-center w-24">
                    <div className="text-lg mb-1">💻</div>
                    <div className="font-semibold text-xs">Laptop</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="rounded-lg p-2 text-center">
                    <div className="text-lg mb-1">🎒</div>
                    <div className="font-semibold text-xs">Laptop Bag</div>
                  </div>
                  <div className="rounded-lg p-2 text-center">
                    <div className="text-lg mb-1">🖱️</div>
                    <div className="font-semibold text-xs">Mouse</div>
                  </div>
                  <div className="rounded-lg p-2 text-center">
                    <div className="text-lg mb-1">📅</div>
                    <div className="font-semibold text-xs">Warranty</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block rounded-lg p-3 text-center">
                <div className="text-xl mb-1">💻</div>
                <div className="font-semibold text-sm">Laptop</div>
              </div>
              <div className="hidden md:block rounded-lg p-3 text-center">
                <div className="text-xl mb-1">🎒</div>
                <div className="font-semibold text-sm">Laptop Bag</div>
              </div>
              <div className="hidden md:block rounded-lg p-3 text-center">
                <div className="text-xl mb-1">🖱️</div>
                <div className="font-semibold text-sm">Mouse</div>
              </div>
              <div className="hidden md:block rounded-lg p-3 text-center">
                <div className="text-xl mb-1">📅</div>
                <div className="font-semibold text-sm">Warranty</div>
              </div>
            </div>
            <Link href="/category/laptops" className="inline-block bg-green-600 text-white px-3 py-2 md:px-2 md:py-2 rounded-lg font-semibold hover:bg-green-500 text-xs md:text-sm">
              Build My Bundle - Save 18%
            </Link>
          </div>
        </div>
      </section>

      {/* Panel 6: Education */}
      <EducationPanel />

      {/* Panel 7: Community Picked */}
      <CommunityPanel />

      {/* Product Grid */}
      <ProductGridPanel />

      {/* Real Buyer Story */}
      <RealBuyerStory />

      {/* Trust Strip */}
      <TrustStrip />

      <Footer />
      <CartDrawer />
      <Preloader />
    </div>
  );
}