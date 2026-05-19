 
 import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import CategoryTile from '@/components/CategoryTile';
import RepairServicesPanel from '@/components/RepairServicesPanel';
import { getCategories } from '@/lib/db';
import { warmupConnection } from '@/lib/mongodb';
import { Store, Truck, Shield, MessageCircle, Package, TrendingDown, Users, AlertTriangle, BarChart3, Recycle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Preloader from '@/components/Preloader';

// Warm up the Atlas connection pool on the server as soon as this page is hit.
// Only runs when MONGODB_URI is defined; silently skipped otherwise (e.g. during local builds).
if (process.env.MONGODB_URI) {
  warmupConnection().catch(() => {});
}

const HeroVideo = dynamic(() => import('@/components/HeroVideo'));
const AlmostGonePanel = dynamic(() => import('@/components/panels/AlmostGonePanel'));
const PriceJustDroppedPanel = dynamic(() => import('@/components/panels/PriceJustDroppedPanel'));
const JustLandedPanel = dynamic(() => import('@/components/panels/JustLandedPanel'));
const ProductGridPanel = dynamic(() => import('@/components/panels/ProductGridPanel'));

export const revalidate = 60;

function LocallyPopularPanel() {
  return (
    <section className="py-2 md:py-2 bg-beige">
      <div className="container mx-auto">
        <div className="mb-4 md:mb-6">
          <h2 className="text-base md:text-xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Most Popular in Kigali</h2>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <div className="md:grid md:grid-cols-3 md:gap-4">
            <div className="md:hidden flex flex-col">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { name: 'Samsung Galaxy S24 Ultra', orders: 156, cat: 'smartphones' },
                  { name: 'MacBook Air M2', orders: 89, cat: 'laptops' },
                ].map((item) => (
                  <div key={item.name} className="text-center p-2">
                    <h3 className="font-bold text-sm text-black mb-0.5">{item.name}</h3>
                    <p className="text-xl font-bold text-black">{item.orders} orders</p>
                    <p className="text-xs text-black/50">this week in Kigali</p>
                    <Link href={`/category/${item.cat}`} className="text-gold font-bold text-xs border border-black/20 mt-2 block px-2 py-1 rounded">I want this</Link>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <div className="text-center p-2 w-full max-w-xs">
                  <h3 className="font-bold text-sm text-black mb-0.5">iPhone 15 Pro</h3>
                  <p className="text-xl font-bold text-black">134 orders</p>
                  <p className="text-xs text-black/50">this week in Kigali</p>
                  <Link href="/category/smartphones" className="text-gold font-bold text-xs border border-black/20 mt-2 block px-2 py-1 rounded">I want this</Link>
                </div>
              </div>
            </div>
            {[
              { name: 'Samsung Galaxy S24 Ultra', orders: 156, cat: 'smartphones' },
              { name: 'MacBook Air M2', orders: 89, cat: 'laptops' },
              { name: 'iPhone 15 Pro', orders: 134, cat: 'smartphones' },
            ].map((item) => (
              <div key={item.name} className="hidden md:block text-center p-3">
                <h3 className="font-bold text-base text-black mb-0.5">{item.name}</h3>
                <p className="text-2xl font-bold text-black">{item.orders} orders</p>
                <p className="text-xs text-black/50">this week in Kigali</p>
                <Link href={`/category/${item.cat}`} className="text-gold font-bold text-xs border border-black/20 mt-2 block px-2 py-1 rounded">I want this</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationPanel() {
  return (
    <section className="py-2 bg-beige-deep">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <AlertTriangle className="w-7 h-7 text-black" />
          <h2 className="text-lg md:text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Before You Buy</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            { title: 'Buying a Laptop?', desc: 'Check: RAM (8GB+), Storage (256GB+ SSD), Processor (Intel i5/Ryzen 5+)', link: '/category/laptops', linkText: 'Compare Laptops →' },
            { title: 'Which Smartphone?', desc: 'Priority: Camera quality, Battery life (4000mAh+), Storage (128GB+)', link: '/category/smartphones', linkText: 'Browse Phones →' },
            { title: 'Smart TV Guide', desc: '4K resolution, HDR support, 32"+ for living room, 40"+ for cinema feel', link: '/category/smart-tvs', linkText: 'View TVs →' },
          ].map((card) => (
            <div key={card.title} className="bg-white/70 backdrop-blur-sm p-5 md:p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-black mb-2">{card.title}</h3>
              <p className="text-sm text-black/60 mb-3">{card.desc}</p>
              <Link href={card.link} className="text-black font-semibold hover:underline block text-right">{card.linkText}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityPanel() {
  return (
    <section className="py-2 bg-beige">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-black" />
          <h2 className="text-lg md:text-xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Community Picked</h2>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-1">Which Laptop Should You Buy?</h3>
          <p className="text-sm text-black/60 mb-4">1,427 customers compared these 3 laptops — here's what they chose</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-1 border-2 border-black rounded-lg p-3 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black text-gold text-xs px-2 py-1 rounded-full font-bold">
                89% CHOSE THIS
              </div>
              <div className="text-center pt-2">
                <div className="text-xl mb-1">💻</div>
                <h4 className="font-bold text-sm text-black">MacBook Air M2</h4>
                <p className="text-xs text-black/50">Best Overall</p>
                <p className="text-gold font-semibold mt-1">1,267 votes</p>
              </div>
            </div>
            <div className="border border-black/20 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">💻</div>
              <h4 className="font-bold text-sm text-black">Dell XPS 15</h4>
              <p className="text-xs text-black/50">Best Performance</p>
              <p className="text-gray-400 mt-1">112 votes (8%)</p>
            </div>
            <div className="border border-black/20 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">💻</div>
              <h4 className="font-bold text-sm text-black">ThinkPad X1</h4>
              <p className="text-xs text-black/50">Best for Work</p>
              <p className="text-gray-400 mt-1">58 votes (4%)</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/category/laptops" className="text-gold font-semibold hover:underline">Compare All Laptops →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RealBuyerStory() {
  return (
    <section className="py-2 bg-beige-deep">
      <div className="container mx-auto">
        <div className="mb-4">
          <h2 className="text-lg md:text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>Real Buyer Story</h2>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-bold text-black text-sm">S.K</div>
            <div>
              <div className="font-semibold text-sm text-black">Samuel Kayondo</div>
              <div className="text-xs text-black/50">Kigali — Verified Purchase</div>
            </div>
          </div>
          <h3 className="font-bold text-base text-black mb-2">"The Samsung S24 Ultra changed my photography game"</h3>
          <p className="text-black/60 mb-3 text-sm">
            "I researched for 3 weeks before buying. JP Tech's delivery was fast (next day in Kigali!), and the phone arrived in perfect condition.
            The camera zoom is incredible for wedding photography — I've already recommended this to 5 colleagues. Worth every RWF."
          </p>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-gold text-sm">★</span>
            ))}
            <span className="text-black/50 ml-2 text-xs">100% helpful (23 people)</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black">Rank our service:</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold/60 cursor-pointer hover:text-gold text-sm">★</span>
                ))}
              </div>
            </div>
            <button className="border border-black/20 text-black px-3 py-1 rounded text-sm hover:bg-black/5 transition-colors">Add Your Review</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-beige-surf border-t border-black/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: Truck, title: 'Fast Delivery', desc: 'Kigali: 1–2 days' },
            { icon: MessageCircle, title: 'WhatsApp Support', desc: '+250 790 336 683' },
            { icon: Shield, title: '1 Year Warranty', desc: 'All products' },
            { icon: Store, title: 'Cash on Delivery', desc: 'Pay on delivery' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-1">
              <Icon className="w-6 h-6 text-black" />
              <h3 className="font-semibold text-sm text-black">{title}</h3>
              <p className="text-xs text-black/50">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  let categories: any[] = [];
  try {
    categories = await getCategories();
  } catch {
    // DB is unreachable (e.g. during a static build); render with empty data.
    categories = [];
  }

  return (
    <div className="min-h-screen bg-beige flex flex-col">

      <HeroVideo />

      <section className="py-1 md:py-2 bg-beige">
        <div className="container mx-auto">
          <h2 className="text-xs md:text-xl font-bold my-6 md:my-12 text-center uppercase text-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
            In our shop we deliver all these categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
            {categories.map((cat: any) => (
              <CategoryTile key={cat._id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      <AlmostGonePanel />
      <PriceJustDroppedPanel />
      <JustLandedPanel />
      <LocallyPopularPanel />
      <RepairServicesPanel />
      <EducationPanel />
      <CommunityPanel />
      <ProductGridPanel />
      <RealBuyerStory />
      <TrustStrip />
      <Footer />
      <Preloader />
    </div>
  );
}
