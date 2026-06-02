'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useNavigation } from '@/context/NavigationContext';
import {
  ShoppingCart, Menu, Store, Globe, User, ChevronDown,
  MessageCircle, X, Home, Phone, MapPin, Package,
  HelpCircle, UserPlus, Info, ClipboardList, Camera,
  Cpu, CircuitBoard, Cog, Zap, Radio, Hammer,
  Smartphone, Volume2, Laptop, Monitor, Gamepad2,
  Clock, Sun, Router, Plane, Printer, Eye, Home as HomeIcon,
  Bot, Heart, Factory, BookOpen, Search, ExternalLink
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const { navigateTo, startNavigation } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [placeholderText, setPlaceholderText] = useState('Search components, manufacturers, or SKUs...');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const categories = useMemo(() => [
    'STM32 Microcontrollers',
    'Voltage Regulators',
    'Tantalum Capacitors',
    'Optocouplers',
    'FPGA Development Boards',
    'Precision Resistors'
  ], []);

  const categoryIcons: Record<string, React.ComponentType<any>> = {
    semiconductors: Cpu,
    passives: CircuitBoard,
    electromechanical: Cog,
    power: Zap,
    iot: Radio,
    tools: Hammer,
    mobilephone: Phone,
    speakers: Volume2,
    laptops: Laptop,
    tvs: Monitor,
    cameras: Camera,
    gaming: Gamepad2,
    wearables: Clock,
    solar: Sun,
    networking: Router,
    drones: Plane,
    '3dprinters': Printer,
    vrar: Eye,
    homeauto: HomeIcon,
    robotics: Bot,
    medical: Heart,
    industrial: Factory,
    educational: BookOpen
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const currentCategory = categories[currentIndex];
    let currentText = 'Search for ';
    let isTyping = true;
    let charIndex = 0;

    const typeText = () => {
      if (isTyping) {
        if (charIndex < currentCategory.length) {
          currentText = 'Search for ' + currentCategory.substring(0, charIndex + 1);
          setPlaceholderText(currentText);
          charIndex++;
          timeoutId = setTimeout(typeText, 80);
        } else {
          timeoutId = setTimeout(() => { isTyping = false; typeText(); }, 2000);
        }
      } else {
        if (charIndex > 0) {
          currentText = 'Search for ' + currentCategory.substring(0, charIndex - 1);
          setPlaceholderText(currentText);
          charIndex--;
          timeoutId = setTimeout(typeText, 40);
        } else {
          setCurrentIndex((prev) => (prev + 1) % categories.length);
          isTyping = true;
          timeoutId = setTimeout(typeText, 500);
        }
      }
    };
    timeoutId = setTimeout(typeText, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentIndex, categories]);

  const { data: rawCategories } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    onError: () => {},
  });

  const defaultCategories = [
    { name: 'Semiconductors', slug: 'semiconductors', description: 'ICs, Transistors, Diodes & Integrated Circuits', items: ['Microcontrollers', 'Analog ICs', 'Digital ICs', 'Power Management', 'Memory'] },
    { name: 'Passive Components', slug: 'passives', description: 'Capacitors, Resistors, Inductors & Coils', items: ['Ceramic Capacitors', 'Aluminium Electrolytic', 'Thick Film Resistors', 'Power Inductors'] },
    { name: 'Electromechanical', slug: 'electromechanical', description: 'Relays, Switches, Connectors & Hardware', items: ['Signal Relays', 'Pushbutton Switches', 'Board-to-Board', 'Terminal Blocks'] },
    { name: 'Power Supplies', slug: 'power', description: 'AC/DC Converters, Batteries & Chargers', items: ['Switching Power Supplies', 'Li-Po Batteries', 'USB-C Chargers', 'DC-DC Converters'] },
    { name: 'IoT & Wireless', slug: 'iot', description: 'WiFi, Bluetooth, LoRa & Zigbee Modules', items: ['ESP32 Modules', 'NRF52 Series', 'GSM/LTE Modems', 'ANTENNAS'] },
    { name: 'Mobile Phones', slug: 'mobilephone', description: 'Smartphones, Accessories & Parts', items: ['Android Phones', 'iPhones', 'Phone Cases', 'Chargers', 'Screens'] },
    { name: 'Speakers', slug: 'speakers', description: 'Audio Equipment & Sound Systems', items: ['Bluetooth Speakers', 'Home Theater', 'Microphones', 'Amplifiers', 'Headphones'] },
    { name: 'Laptops', slug: 'laptops', description: 'Notebooks, Ultrabooks & Accessories', items: ['Gaming Laptops', 'Business Laptops', 'Chromebooks', 'Laptop Bags', 'Cooling Pads'] },
    { name: 'TVs', slug: 'tvs', description: 'LED, OLED & Smart Televisions', items: ['4K TVs', 'Smart TVs', 'LED TVs', 'Curved TVs', 'TV Mounts'] },
    { name: 'Cameras', slug: 'cameras', description: 'Digital Cameras & Photography', items: ['DSLR Cameras', 'Mirrorless', 'Action Cameras', 'Security Cameras', 'Lenses'] },
    { name: 'Gaming', slug: 'gaming', description: 'Consoles, Accessories & Games', items: ['PlayStation', 'Xbox', 'Nintendo', 'Gaming PCs', 'Controllers'] },
    { name: 'Wearables', slug: 'wearables', description: 'Smartwatches, Fitness Trackers', items: ['Apple Watch', 'Samsung Galaxy Watch', 'Fitbit', 'Smart Bands', 'Earbuds'] },
    { name: 'Solar Products', slug: 'solar', description: 'Solar Panels, Inverters & Batteries', items: ['Solar Panels', 'Inverters', 'Solar Batteries', 'Charge Controllers', 'Solar Lights'] },
    { name: 'Networking', slug: 'networking', description: 'Routers, Switches & Cables', items: ['WiFi Routers', 'Ethernet Switches', 'Network Cables', 'Access Points', 'Modems'] },
    { name: 'Drones', slug: 'drones', description: 'UAVs, Quadcopters & Accessories', items: ['Consumer Drones', 'Professional Drones', 'Drone Cameras', 'Batteries', 'Propellers'] },
    { name: '3D Printers', slug: '3dprinters', description: '3D Printing Equipment & Supplies', items: ['FDM Printers', 'Resin Printers', 'Filament', 'Resin', '3D Scanner'] },
    { name: 'Home Automation', slug: 'homeauto', description: 'Smart Home Devices & Systems', items: ['Smart Lights', 'Smart Locks', 'Thermostats', 'Security Cameras', 'Voice Assistants'] },
    { name: 'Robotics', slug: 'robotics', description: 'Robots, Kits & Components', items: ['Robot Kits', 'Servos', 'Sensors', 'Arduino', 'Raspberry Pi'] },
    { name: 'Industrial', slug: 'industrial', description: 'Industrial Electronics & Automation', items: ['PLCs', 'HMIs', 'Sensors', 'Motors', 'Industrial PCs'] },
    { name: 'Educational', slug: 'educational', description: 'Learning Kits & Educational Tools', items: ['Arduino Kits', 'Raspberry Pi Kits', 'STEM Kits', 'Educational Robots', 'Coding Boards'] },
  ];

  useEffect(() => {
    if (rawCategories && Array.isArray(rawCategories)) {
      const mapped = rawCategories.map((cat: any) => {
        const def = defaultCategories.find(d => d.slug === cat.slug);
        return {
          name: cat.name?.[language] || cat.name?.en || cat.slug,
          slug: cat.slug,
          description: def?.description || '',
          items: def?.items || [],
        };
      });
      setCategoryData(mapped);
    }
  }, [rawCategories, language]);

  useEffect(() => {
    if (categoryData.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [categoryData.length]);

  const { data: searchResults } = useSWR(
    searchQuery.length >= 2 ? `/api/products/search?q=${encodeURIComponent(searchQuery)}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  );

  useEffect(() => {
    setSuggestions(Array.isArray(searchResults) ? searchResults : []);
  }, [searchResults]);

  useEffect(() => {
    const SCROLL_THRESHOLD = 80; // ~2cm to prevent jitter on rapid scrolling
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY.current;
          if (delta > SCROLL_THRESHOLD) {
            setIsScrolled(true);
            lastScrollY.current = currentScrollY;
          } else if (delta < -SCROLL_THRESHOLD) {
            setIsScrolled(false);
            lastScrollY.current = currentScrollY;
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'rw' : 'en');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigateTo(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleWhatsAppClick = () => window.open('https://wa.me/250790336683', '_blank');

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-black/10 shadow-sm font-sans">
      {/* LAYER 1: TOP UTILITY BAR */}
      <div className="bg-black text-gray-400 py-3 hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-[13px]">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1 font-semibold text-white">
              <Home className="w-3 h-3" /> Home
            </Link>
            <div className="flex items-center gap-1 hover:text-gold cursor-pointer transition-colors">
              <span className="font-semibold text-white">USD</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1 hover:text-gold cursor-pointer transition-colors" onClick={toggleLanguage}>
              <span className="font-semibold text-white uppercase">{language}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1 hover:text-gold cursor-pointer transition-colors mr-8">
              <MapPin className="w-3 h-3" />
              <span>Ship to Rwanda</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <Link href="/orders" className="hover:text-gold transition-colors flex items-center gap-1">
              <Package className="w-3 h-3" /> Track Order
            </Link>
            <Link href="/help" className="hover:text-gold transition-colors flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Help Center
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> +250 790 336 683
            </Link>
            <Link href="/rfq" className="bg-gold text-black px-3 py-1 rounded hover:bg-gold-light transition-colors font-medium text-[12px]">
              Bulk Order (RFQ)
            </Link>
            <Link href="/admin" className="hover:text-gold transition-colors flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> Become a Supplier
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400">Follow Us:</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* LAYER 2: PRIMARY NAV */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <Image src="/loading/load.png" alt="Logo" width={80} height={48} className="w-14 h-9 md:w-20 scale-170 md:h-12 object-contain transition-transform group-hover:scale-105 md:group-hover:scale-205" priority />
              <div className="flex flex-col justify-center leading-none font-mono">
                <span className="font-black text-lg md:text-xl tracking-[1.5px] md:tracking-[2.5px] text-black">JP TECH</span>
                <span className="font-bold text-[7px] md:text-[9px] text-black/70 tracking-[0.5px] md:tracking-[1px]">Electronic shop & repair services</span>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-5xl hidden md:flex items-center h-16">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholderText}
                autoFocus
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                className="w-full h-14 px-4 pr-20 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-sm text-black placeholder:text-black/40 bg-white"
              />
              <button
                type="submit"
                className="absolute right-[-18] top-1/2 transform -translate-y-1/2 h-16  w-16 bg-black text-gold rounded-full hover:bg-black/80 transition-colors flex items-center justify-center"
              >
                <Search className="w-6 h-6" />
              </button>
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/20 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((product: any) => (
                    <div
                      key={product._id}
                      className="px-4 py-2 hover:bg-beige cursor-pointer"
                      onClick={() => {
                        setSearchQuery(product.name.en);
                        setSuggestions([]);
                        navigateTo(`/search?q=${encodeURIComponent(product.name.en)}`);
                      }}
                    >
                      <div className="font-medium text-black">{product.name.en}</div>
                      <div className="text-sm text-black/50">{product.brand} — {product.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden xl:flex items-center gap-2 mr-4">
              <Link href="/rfq" className="flex items-center gap-1 text-xs font-bold text-black hover:text-gold transition-colors">
                <ClipboardList className="w-4 h-4" /> Request Quote
              </Link>
            </div>

            <Link href="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-base font-medium text-black hover:bg-beige rounded-lg transition-colors"
            >
              {user ? (
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-black/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full"></div>
                </div>
              ) : (
                <User className="w-5 h-5 text-gray-500" />
              )}
              <span className="hidden sm:inline">Account</span>
            </Link>

            <button
              onClick={() => navigateTo('/cart')}
              className="relative flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-all transform active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 border border-black/20 rounded-lg">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholderText}
            className="w-full px-4 py-3 pr-12 border border-black/20 rounded-xl text-sm focus:ring-2 focus:ring-gold focus:outline-none bg-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-3 bg-black text-gold rounded-lg"
          >
            <Camera className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* LAYER 3: CATEGORY MEGA NAV — Marquee */}
      <nav className={`border-t border-black/10 bg-beige-solid relative opacity-100 ${isScrolled ? 'md:opacity-0 md:max-h-0 md:overflow-hidden' : 'max-h-20'}`} style={{ scrollbarWidth: 'none' }}>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .marquee-track {
            animation: marquee 60s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="h-10 overflow-hidden">
          <div className="marquee-track flex items-center h-full gap-2 whitespace-nowrap w-max">
            {categoryData.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex items-center h-full px-2 text-[10px] sm:text-xs font-medium text-black hover:text-gold hover:bg-beige transition-all mr-4"
                title={category.description}
              >
                {(() => {
                  const Icon = categoryIcons[category.slug] || CircuitBoard;
                  return <Icon className="w-3 h-3 mr-1" />;
                })()}
                {category.name}
              </Link>
            ))}
            {/* Duplicate set for seamless loop */}
            {categoryData.map((category) => (
              <Link
                key={'dup-' + category.slug}
                href={`/category/${category.slug}`}
                className="flex items-center h-full px-2 text-[10px] sm:text-xs font-medium text-black hover:text-gold hover:bg-beige transition-all mr-4"
                title={category.description}
              >
                {(() => {
                  const Icon = categoryIcons[category.slug] || CircuitBoard;
                  return <Icon className="w-3 h-3 mr-1" />;
                })()}
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-black/10">
              <Image src="/loading/load.png" alt="Logo" width={128} height={40} className="w-32 h-10" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-beige rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-black/10">
                <h3 className="text-xs font-black text-black/40 uppercase tracking-widest mb-4">Marketplace</h3>
                <div className="space-y-1">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-beige transition-colors text-sm font-medium text-black">
                    <Home className="w-4 h-4 text-gray-400" /> Home
                  </Link>
                  {categoryData.map((category) => (
                    <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-beige transition-colors text-sm font-medium text-black"
                    >
                      <Store className="w-4 h-4 text-gray-400" /> {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="p-4 border-b border-black/10">
                <h3 className="text-xs font-black text-black/40 uppercase tracking-widest mb-4">Account & Tools</h3>
                <div className="space-y-1">
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-beige transition-colors text-sm font-medium text-black">
                    <User className="w-4 h-4 text-gray-400" /> Profile
                  </Link>
                  <Link href="/rfq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-beige transition-colors text-sm font-medium text-black">
                    <ClipboardList className="w-4 h-4 text-gray-400" /> Request Quote
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xs font-black text-black/40 uppercase tracking-widest mb-4">Preferences</h3>
                <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-beige transition-colors text-sm font-medium w-full text-left text-black">
                  <Globe className="w-4 h-4 text-gray-400" /> Language: {language.toUpperCase()}
                </button>
                <div className="mt-6 space-y-3">
                  <button onClick={() => { handleWhatsAppClick(); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-black text-gold font-bold text-sm hover:bg-black/80 transition-colors w-full">
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                  </button>
                  <p className="text-[11px] text-black/40 text-center space-y-1 px-4">
                    📍 Konombe-mubusanza & surrounding areas
                  </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </header>
  );
}
