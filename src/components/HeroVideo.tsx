import { Play } from 'lucide-react';
import Link from 'next/link';

export default function HeroVideo() {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Image with Horizontal Gradient Overlay */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <img
          src="/video/bg.png"
          alt="Hero Background"
          className="absolute right-0 top-0 h-full w-auto max-w-[85%] object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-left">
          {/* Main text content */}
          <div className="text-left mb-12">
            <div className="inline-block bg-yellow-500/20 text-yellow-500 text-[10px] md:text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-sm mb-3 md:mb-4">
              JP Tech Electronics New & Repair Services
            </div>
            <p className="text-xs md:text-base lg:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl text-left font-light italic leading-relaxed">
              Curated technology, expert repairs and solar solutions — brought together with care, precision and genuine service from the heart of Kigali.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link
                href="/category/smartphones"
                className="bg-yellow-400 text-black px-6 py-2 md:px-8 md:py-3 lg:px-12 lg:py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg text-sm md:text-base lg:text-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2 md:px-8 md:py-3 lg:px-12 lg:py-4 rounded-lg font-semibold hover:bg-white-20 transition-colors text-sm md:text-base lg:text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* New Info Panel - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* First Column - 3 Layers */}
            <div className="space-y-4">
              {/* Layer 1: Main heading */}
              <div className="text-gray-400/60 uppercase text-sm font-medium tracking-wide">
                WHILE YOU ARE WITH JP ELECTRONIC SHOP
              </div>

              {/* Layer 2: Bordered description */}
              <div className="border border-white/20 rounded-lg p-4 bg-black/20 backdrop-blur-sm">
                <p className="text-white text-sm leading-relaxed">
                  all electronic shop center , all electronic tools and components repair services on best quality
                </p>
              </div>

              {/* Layer 3: Contact and location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-sm">📍 Kigali, Rwanda</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-sm">📞 +250 790 336 683</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-sm">✉️ info@jpelectronics.rw</span>
                </div>
              </div>
            </div>

            {/* Second Column - Brand Icons */}
            <div className="flex flex-wrap items-center justify-center gap-6 opacity-20">
              <div className="text-white/30 text-2xl font-bold"></div>
              <div className="text-white/30 text-2xl font-bold">HP</div>
              <div className="text-white/30 text-2xl font-bold">DELL</div>
              <div className="text-white/30 text-2xl font-bold">🤖</div>
              <div className="text-white/30 text-2xl font-bold">ASUS</div>
              <div className="text-white/30 text-2xl font-bold">ACER</div>
              <div className="text-white/30 text-2xl font-bold">NOKIA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Play button overlay for visual appeal */}
      <div className="absolute bottom-4 right-4 opacity-50">
        <Play className="w-8 h-8 text-white fill-white" />
      </div>
    </section>
  );
}
