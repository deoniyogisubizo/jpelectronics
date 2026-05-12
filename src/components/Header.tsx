'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingCart, Search, Menu, Store, Globe, User, ChevronDown,
  MessageCircle, Settings, X, Home, Phone, MapPin, Package,
  HelpCircle, Briefcase, UserPlus, Info, FileText, ClipboardList
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { itemCount, setIsOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('Search components, manufacturers, or SKUs...');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = useMemo(() => [
    'STM32 Microcontrollers',
    'Voltage Regulators',
    'Tantalum Capacitors',
    'Optocouplers',
    'FPGA Development Boards',
    'Precision Resistors'
  ], []);

  const categoryData = [
    {
      name: 'Semiconductors',
      slug: 'semiconductors',
      description: 'ICs, Transistors, Diodes & Integrated Circuits',
      items: ['Microcontrollers', 'Analog ICs', 'Digital ICs', 'Power Management', 'Memory']
    },
    {
      name: 'Passive Components',
      slug: 'passives',
      description: 'Capacitors, Resistors, Inductors & Coils',
      items: ['Ceramic Capacitors', 'Aluminium Electrolytic', 'Thick Film Resistors', 'Power Inductors']
    },
    {
      name: 'Electromechanical',
      slug: 'electromechanical',
      description: 'Relays, Switches, Connectors & Hardware',
      items: ['Signal Relays', 'Pushbutton Switches', 'Board-to-Board', 'Terminal Blocks']
    },
    {
      name: 'Power Supplies',
      slug: 'power',
      description: 'AC/DC Converters, Batteries & Chargers',
      items: ['Switching Power Supplies', 'Li-Po Batteries', 'USB-C Chargers', 'DC-DC Converters']
    },
    {
      name: 'IoT & Wireless',
      slug: 'iot',
      description: 'WiFi, Bluetooth, LoRa & Zigbee Modules',
      items: ['ESP32 Modules', 'NRF52 Series', 'GSM/LTE Modems', 'ANTENNAS']
    },
    {
      name: 'Tools & Test',
      slug: 'tools',
      description: 'Oscilloscopes, Multimeters & Soldering',
      items: ['Digital Multimeters', 'Logic Analyzers', 'Soldering Stations', 'Calibration Tools']
    }
  ];

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
          timeoutId = setTimeout(() => {
            isTyping = false;
            typeText();
          }, 2000);
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

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'rw' : 'en');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleDropdownEnter = (categoryName: string) => {
    setActiveDropdown(categoryName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/250790336683', '_blank');
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm font-sans">
      {/* LAYER 1: TOP UTILITY BAR */}
      <div className="bg-[#1a202c] text-gray-300 py-1.5 hidden lg:block">
        <div className="container mx-auto px-0 flex justify-between items-center text-[12px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <span className="font-semibold text-white">USD</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div
              className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors"
              onClick={toggleLanguage}
            >
              <span className="font-semibold text-white uppercase">{language}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <MapPin className="w-3 h-3" />
              <span>Ship to Rwanda</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/orders" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <Package className="w-3 h-3" /> Track Order
            </Link>
            <Link href="/help" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Help Center
            </Link>

            <Link href="/rfq" className="bg-amber-600 text-white px-2 py-0.5 rounded hover:bg-amber-700 transition-colors font-medium">
              Bulk Order (RFQ)
            </Link>
            <Link href="/become-seller" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> Become a Seller
            </Link>
            <Link href="/about" className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" /> About Us
            </Link>
            <div className="flex items-center gap-2 ml-2 border-l border-gray-600 pl-4">
              <span className="text-[10px] opacity-50">Follow Us:</span>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 2: PRIMARY MARKETPLACE NAVIGATION */}
      <div className="container mx-auto px-0 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Brand & Category Trigger */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo/logo.svg" alt="JP Tech Logo" className="w-12 h-12 transition-transform group-hover:scale-105" />
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold font-share-tech-mono text-black leading-none">JP Tech</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Electronics Rwanda</p>
              </div>
            </Link>

            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-800 transition-colors border border-gray-300"
            >
              <Menu className="w-5 h-5" />
              <span>All Categories</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Intelligent Search Engine */}
          <form onSubmit={handleSearch} className="flex-1 max-w-3xl hidden md:flex items-center gap-0 h-12">
            <div className="relative flex-1 h-full flex">
              <select className="h-full bg-gray-50 border border-gray-300 rounded-l-lg px-3 text-xs font-medium text-gray-600 focus:outline-none hover:bg-gray-100 cursor-pointer appearance-none pr-8">
                <option>All Categories</option>
                {categoryData.map(c => <option key={c.slug}>{c.name}</option>)}
              </select>
              <div className="relative flex-1 h-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholderText}
                  className="w-full h-full px-4 border-y border-gray-300 focus:outline-none text-sm"
                />
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="h-full px-6 bg-[#0057ff] text-white rounded-r-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Procurement & Account Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden xl:flex items-center gap-2 mr-4">
              <Link href="/rfq" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-amber-500 transition-colors">
                <ClipboardList className="w-4 h-4" /> Request Quote
              </Link>
              <Link href="/bom-upload" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-amber-500 transition-colors">
                <FileText className="w-4 h-4" /> Upload BOM
              </Link>
            </div>

            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-gray-500" />
              <span className="hidden sm:inline">Account</span>
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all transform active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 border border-gray-300 rounded-lg"
            >
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
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-3 bg-blue-600 text-white rounded-lg"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* LAYER 3: CATEGORY MEGA NAVIGATION */}
      <nav className="border-t border-gray-200 hidden md:block bg-white relative">
        <div className="container mx-auto px-0">
          <div className="flex items-center justify-between h-10">
            <ul className="flex items-center gap-1 overflow-x-auto no-scrollbar h-full">
              <li className="h-full">
                <Link href="/" className="flex items-center h-full px-4 text-xs font-bold text-gray-600 hover:text-amber-500 hover:bg-gray-50 transition-all">
                  {t('nav.home')}
                </Link>
              </li>
              {categoryData.map((category) => (
                <li
                  key={category.slug}
                  className="h-full relative"
                  onMouseEnter={() => handleDropdownEnter(category.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center h-full px-4 text-xs font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all gap-1"
                  >
                    {category.name}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Link>

                  {activeDropdown === category.name && (
                    <div className="absolute top-full left-0 w-72 bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 py-4 px-4">
                      <div className="mb-3">
                        <h3 className="text-sm font-black text-gray-900">{category.name}</h3>
                        <p className="text-[11px] text-gray-500">{category.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {category.items.map((item) => (
                          <Link
                            key={item}
                            href={`/category/${category.slug}?sub=${encodeURIComponent(item.toLowerCase())}`}
                            className="text-[12px] text-gray-600 hover:text-blue-600 transition-colors py-1"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <Link
                          href={`/category/${category.slug}`}
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View All {category.name} →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}
              <li className="h-full">
                <Link href="/solutions" className="flex items-center h-full px-4 text-xs font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all gap-1">
                  Solutions
                  <span className="bg-blue-600 text-white text-[8px] px-1 rounded font-black uppercase">New</span>
                </Link>
              </li>
            </ul>

            <div className="flex items-center h-full">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 text-[11px] font-black text-gray-600 hover:text-blue-600 transition-colors px-3 h-full"
              >
                <Phone className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <img src="/logo/logo.svg" alt="JP Tech Logo" className="w-8 h-8" />
                <span className="font-bold font-share-tech-mono text-lg">JP Tech</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Marketplace</h3>
                <div className="space-y-1">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Home className="w-4 h-4 text-gray-400" /> Home
                  </Link>
                  {categoryData.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <Store className="w-4 h-4 text-gray-400" /> {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Account & Tools</h3>
                <div className="space-y-1">
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <User className="w-4 h-4 text-gray-400" /> Admin Dashboard
                  </Link>
                  <Link href="/rfq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <ClipboardList className="w-4 h-4 text-gray-400" /> Request Quote
                  </Link>
                  <Link href="/bom-upload" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <FileText className="w-4 h-4 text-gray-400" /> Upload BOM
                  </Link>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Preferences</h3>
                <button onClick={toggleLanguage} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium w-full text-left">
                  <Globe className="w-4 h-4 text-gray-400" /> Language: {language.toUpperCase()}
                </button>

                <div className="mt-6 space-y-3">
                  <button onClick={() => { handleWhatsAppClick(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors w-full">
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                  </button>
                  <div className="text-[11px] text-gray-500 text-center space-y-1 px-4">
                    <p>📍 Konombe-mubusanza & surrounding areas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

