import { Play } from 'lucide-react';
import Link from 'next/link';

export default function HeroVideo() {
  return (
    <section className="relative h-[450px] md:h-[550px] overflow-hidden">
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
      <div className="relative z-10 h-full flex flex-col items-center justify-start pt-4">
        <img src="/loading/load.png" alt="Logo" className="h-40 ml-[-1100] absolute w-auto mb-6" />
        <div className="container mx-auto px-2 text-left">
          {/* Main text content */}
          <div className="text-left mt-[150]">
            <p className="text-xs md:text-base lg:text-lg text-gray-300 mt-[-10] mb-6 md:mb-8 max-w-2xl text-left font-light italic leading-relaxed">
              Curated technology, expert repairs and solar solutions — brought together with care, precision and genuine service from the heart of Kigali.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link
                href="/category"
                className="bg-yellow-400 h-15 text-black px-6 py-2 md:px-8 md:py-3 lg:px-12 lg:py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg text-sm md:text-base lg:text-lg"
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
          <div className="hidden md:flex flex-col gap-4 max-w-6xl mx-auto mt-[-10] absolute bottom-0 left-0 transform translate-x-0 mb-15 px-2">
            {/* First Column - Brand Icons with heading */}
            <div className="space-y-4 mt-0 mb-8">
              {/* Main heading */}
              <div className="text-gray-100/80 uppercase text-sm font-medium tracking-wide ml-20 text-left opacity-80">
                WHILE YOU ARE WITH JP ELECTRONICS SHOP
              </div>

              {/* Brand Icons */}
              <div className="flex flex-wrap items-center gap-6 opacity-40 ml-20">
                {/* Apple */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <i className="fab fa-apple text-white/60 text-lg"></i>
                </div>
                {/* HP */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-xs font-bold">
                  HP
                </div>
                {/* Dell */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-laptop text-white/60 text-lg"></i>
                </div>
                {/* Android */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <i className="fab fa-android text-white/60 text-lg"></i>
                </div>
                {/* Asus */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-xs font-bold">
                  ASUS
                </div>
                {/* Acer - Note: FontAwesome doesn't have a specific Acer icon, using generic brand icon */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-xs font-bold">
                  ACER
                </div>
                {/* Nokia */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-phone text-white/60 text-lg"></i>
                </div>
              </div>
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
