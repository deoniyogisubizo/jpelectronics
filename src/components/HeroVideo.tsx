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
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg text-left">
              The "All-in-One" Approach
            </h1>
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

          {/* Stats Panel - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-3xl font-bold text-white">119+</p>
              <p className="text-sm text-gray-300">Products</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-3xl font-bold text-white">20</p>
              <p className="text-sm text-gray-300">Categories</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-3xl font-bold text-white">Kigali</p>
              <p className="text-sm text-gray-300">Delivery Nationwide</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-gray-300">Support</p>
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
