'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import {
  ShoppingCart, Menu, Store, Globe, User, ChevronDown,
  MessageCircle, X, Home, Phone, MapPin, Package,
  HelpCircle, UserPlus, Info, ClipboardList, Camera,
  Cpu, CircuitBoard, Cog, Zap, Radio, Hammer,
  Smartphone, Volume2, Laptop, Monitor, Gamepad2,
  Clock, Sun, Router, Plane, Printer, Eye, Home as HomeIcon,
  Bot, Heart, Factory, BookOpen, Search
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placeholderText, setPlaceholderText] = useState('Search components, manufacturers, or SKUs...');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(10);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    const defaultCategories = [
      { name: 'Semiconductors', slug: 'semiconductors', description: 'ICs, Transistors, Diodes & Integrated Circuits', items: ['Microcontrollers', 'Analog ICs', 'Digital ICs', 'Power Management', 'Memory'] },
      { name: 'Passive Components', slug: 'passives', description: 'Capacitors, Resistors, Inductors & Coils', items: ['Ceramic Capacitors', 'Aluminium Electrolytic', 'Thick Film Resistors', 'Power Inductors'] },
      { name: 'Electromechanical', slug: 'electromechanical', description: 'Relays, Switches, Connectors & Hardware', items: ['Signal Relays', 'Pushbutton Switches', 'Board-to-Board', 'Terminal Blocks'] },
      { name: 'Power Supplies', slug: 'power', description: 'AC/DC Converters, Batteries & Chargers', items: ['Switching Power Supplies', 'Li-Po Batteries', 'USB-C Chargers', 'DC-DC Converters'] },
      { name: 'IoT & Wireless', slug: 'iot', description: 'WiFi, Bluetooth, LoRa & Zigbee Modules', items: ['ESP32 Modules', 'NRF52 Series', 'GSM/LTE Modems', 'ANTENNAS'] },
      { name: 'Tools & Test', slug: 'tools', description: 'Oscilloscopes, Multimeters & Soldering', items: ['Digital Multimeters', 'Logic Analyzers', 'Soldering Stations', 'Calibration Tools'] },
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
      { name: 'VR/AR', slug: 'vrar', description: 'Virtual & Augmented Reality', items: ['VR Headsets', 'AR Glasses', 'VR Games', 'Motion Controllers', 'VR Accessories'] },
      { name: 'Home Automation', slug: 'homeauto', description: 'Smart Home Devices & Systems', items: ['Smart Lights', 'Smart Locks', 'Thermostats', 'Security Cameras', 'Voice Assistants'] },
      { name: 'Robotics', slug: 'robotics', description: 'Robots, Kits & Components', items: ['Robot Kits', 'Servos', 'Sensors', 'Arduino', 'Raspberry Pi'] },
      { name: 'Medical Electronics', slug: 'medical', description: 'Medical Devices & Equipment', items: ['Blood Pressure Monitors', 'Thermometers', 'Pulse Oximeters', 'ECG Machines', 'Ultrasound'] },
      { name: 'Industrial', slug: 'industrial', description: 'Industrial Electronics & Automation', items: ['PLCs', 'HMIs', 'Sensors', 'Motors', 'Industrial PCs'] },
      { name: 'Educational', slug: 'educational', description: 'Learning Kits & Educational Tools', items: ['Arduino Kits', 'Raspberry Pi Kits', 'STEM Kits', 'Educational Robots', 'Coding Boards'] }
    ];

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const fetchedCategories = data.map((cat: any) => {
          const defaultCat = defaultCategories.find((dc: any) => dc.slug === cat.slug);
          return {
            name: cat.name[language] || cat.name.en,
            slug: cat.slug,
            description: defaultCat?.description || '',
            items: defaultCat?.items || []
          };
        });
        setCategoryData(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryData(defaultCategories);
      }
    };
    fetchCategories();
  }, [language]);

  useEffect(() => {
    if (categoryData.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [categoryData.length]);

  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Search suggestions error:', error);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) setIsScrolled(true);
      else if (currentScrollY < lastScrollY.current) setIsScrolled(false);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCategoryCount = () => {
      setVisibleCategoryCount(window.innerWidth < 500 ? 3 : window.innerWidth < 1100 ? 5 : 10);
    };
    updateCategoryCount();
    window.addEventListener('resize', updateCategoryCount);
    return () => window.removeEventListener('resize', updateCategoryCount);
  }, []);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'rw' : 'en');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const handleWhatsAppClick = () => window.open('https://wa.me/250790336683', '_blank');

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-black/10 shadow-sm font-sans">
      {/* LAYER 1: TOP UTILITY BAR */}
      <div className="bg-black text-gray-400 py-1.5 hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-[12px]">
          <div className="flex items-center gap-3">
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
            <Link href="/rfq" className="bg-gold text-black px-2 py-0.5 rounded hover:bg-gold-light transition-colors font-medium text-[11px]">
              Bulk Order (RFQ)
            </Link>
            <Link href="/become-seller" className="hover:text-gold transition-colors flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> Become a Seller
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] opacity-50">Follow Us:</span>
            <a href="#" className="hover:text-gold transition-colors"><i className="fa-brands fa-facebook-f text-sm font-bold"></i></a>
            <a href="#" className="hover:text-gold transition-colors"><i className="fa-brands fa-instagram text-sm font-bold"></i></a>
            <a href="#" className="hover:text-gold transition-colors"><i className="fa-brands fa-linkedin-in text-sm font-bold"></i></a>
            <a href="#" className="hover:text-gold transition-colors"><i className="fa-brands fa-youtube text-sm font-bold"></i></a>
          </div>
        </div>
      </div>

      {/* LAYER 2: PRIMARY NAV */}
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/loading/load.png" alt="Logo" className="w-32 h-[70px] transition-transform group-hover:scale-105" />
            </Link>
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoriesHovered(true)}
                onMouseLeave={() => setIsCategoriesHovered(false)}
                className="hidden lg:flex items-center gap-1 px-2 py-1 bg-black hover:bg-black/80 rounded text-xs font-medium text-gold transition-colors"
              >
                <Menu className="w-3 h-3" />
                <span>All Categories</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {isCategoriesHovered && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                  {categoryData.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-sm text-black hover:bg-beige transition-colors"
                      onMouseEnter={() => setIsCategoriesHovered(true)}
                      onMouseLeave={() => setIsCategoriesHovered(false)}
                    >
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-black/50">{category.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-5xl hidden md:flex items-center h-14">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholderText}
                autoFocus
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                className="w-full h-12 px-4 pr-16 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-sm text-black placeholder:text-black/40 bg-white"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-14 w-14 bg-black text-gold mr-[-10] rounded-full hover:bg-black/80 transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
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
                        window.location.href = `/search?q=${encodeURIComponent(product.name.en)}`;
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
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-black hover:bg-beige rounded-lg transition-colors"
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
              onClick={() => router.push('/cart')}
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
      <nav className={`border-t border-black/10 bg-white relative transition-all duration-300 ${isScrolled ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-20'}`} style={{ scrollbarWidth: 'none' }}>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .marquee-track {
            animation: marquee 30s linear infinite;
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
              <img src="/loading/load.png" alt="Logo" className="w-32 h-10" />
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
