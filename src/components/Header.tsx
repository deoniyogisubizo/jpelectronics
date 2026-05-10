'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search, Menu, Store, Globe, User, ChevronDown, MessageCircle, Settings, X, Home, Phone } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { itemCount, setIsOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('I am looking for ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = useMemo(() => [
    'Smartphones',
    'Laptops',
    'TV & Audio',
    'Appliances',
    'Solar Panels',
    'Smartwatches',
    'Electric Scooters',
    'Gaming Consoles',
    'Cameras',
    'Headphones'
  ], []);

  const categoryData = [
    {
      name: 'Smartphones',
      slug: 'phones',
      description: 'Gets Latest smartphones from top brands',
      items: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus', 'Accessories']
    },
    {
      name: 'Computers',
      slug: 'computers',
      description: 'Laptops, desktops & computer accessories',
      items: ['Gaming Laptops', 'Business Laptops', 'Desktops', 'Monitors', 'Keyboards']
    },
    {
      name: 'TV & Audio',
      slug: 'tvs',
      description: 'Entertainment & audio equipment',
      items: ['Smart TVs', 'Soundbars', 'Headphones', 'Speakers', 'Home Theater']
    },
    {
      name: 'Appliances',
      slug: 'appliances',
      description: 'Home & kitchen appliances',
      items: ['Refrigerators', 'Washing Machines', 'Microwaves', 'Blenders', 'Coffee Makers']
    },
    {
      name: 'Solar',
      slug: 'solar',
      description: 'Solar panels & renewable energy solutions',
      items: ['Solar Panels', 'Inverters', 'Batteries', 'Solar Kits', 'Installation']
    },
    {
      name: 'Wearables',
      slug: 'wearables',
      description: 'Smart watches & wearable technology',
      items: ['Smartwatches', 'Fitness Trackers', 'Wireless Earbuds', 'Smart Glasses']
    },
    {
      name: 'Mobility',
      slug: 'mobility',
      description: 'Electric vehicles & mobility solutions',
      items: ['Electric Scooters', 'E-Bikes', 'Hoverboards', 'Electric Skateboards']
    }
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const currentCategory = categories[currentIndex];
    let currentText = 'I am looking for ..';
    let isTyping = true;
    let charIndex = 0;

    const typeText = () => {
      if (isTyping) {
        if (charIndex < currentCategory.length) {
          currentText = 'I am looking for ..' + currentCategory.substring(0, charIndex + 1);
          setPlaceholderText(currentText);
          charIndex++;
          timeoutId = setTimeout(typeText, 100);
        } else {
          // Finished typing, wait before erasing
          timeoutId = setTimeout(() => {
            isTyping = false;
            typeText();
          }, 2000);
        }
      } else {
        if (charIndex > 0) {
          currentText = 'I am looking for ..' + currentCategory.substring(0, charIndex - 1);
          setPlaceholderText(currentText);
          charIndex--;
          timeoutId = setTimeout(typeText, 50);
        } else {
          // Finished erasing, move to next category
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
    <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-gray-800 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Store className="w-4 h-4" />
              {t('trust.delivery')}: Konombe-mubusanza & surrounding areas
            </span>
            <span className="flex items-center gap-1">
              💬 {t('trust.whatsapp')}: +250 790 336 683
            </span>
          </div>
          <div className="flex gap-4">
            <span>✓ {t('trust.warranty')}</span>
            <span>✓ {t('trust.cod')}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/logo.svg" alt="JP Tech Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold font-share-tech-mono text-black">JP Tech</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Electronics Rwanda</p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholderText}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-beige transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium uppercase">{language}</span>
            </button>

            {/* Account */}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-beige transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{t('nav.admin')}</span>
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 border border-gray-300 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholderText}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </form>
      </div>

      {/* Category navigation */}
      <nav className="border-t border-gray-200 hidden md:block relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <ul className="flex gap-4 py-1 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-gold transition-colors px-2 py-1 rounded">
                  {t('nav.home')}
                </Link>
              </li>
              {categoryData.map((category) => (
                <li
                  key={category.slug}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(category.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-1 hover:text-gold transition-colors px-2 py-1 rounded hover:bg-gray-50"
                  >
                    {category.name}
                    <ChevronDown className="w-4 h-4" />
                  </Link>

                  {/* Dropdown */}
                  {activeDropdown === category.name && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {category.items.map((item) => (
                            <Link
                              key={item}
                              href={`/category/${category.slug}?sub=${encodeURIComponent(item.toLowerCase())}`}
                              className="text-sm text-gray-700 hover:text-gold transition-colors py-1"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Link
                            href={`/category/${category.slug}`}
                            className="text-sm font-medium text-vibrant hover:text-gold transition-colors"
                          >
                            View All {category.name} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Call Button */}
            <div className="flex items-center">
              <button
                onClick={() => window.open('tel:+250790336683', '_self')}
                className="flex items-center gap-2 border-2 border-gold text-gold px-3 py-1 rounded-lg hover:bg-gold hover:text-black transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-xs font-black">+250 790 336 683</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <img src="/logo/logo.svg" alt="JP Tech Logo" className="w-8 h-8" />
                  <span className="font-bold font-share-tech-mono text-lg">JP Tech</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Categories Section */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Home className="w-5 h-5 text-gray-500" />
                      <span>Home</span>
                    </Link>
                    {categoryData.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Store className="w-5 h-5 text-gray-500" />
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Account & Settings Section */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Account
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left">
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>

                {/* Language & Theme Section */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Preferences</h3>
                  <div className="space-y-2">
                    <button
                      onClick={toggleLanguage}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                    >
                      <Globe className="w-5 h-5 text-gray-500" />
                      <span>Language: {language.toUpperCase()}</span>
                    </button>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleWhatsAppClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors w-full text-left"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Chat on WhatsApp</span>
                    </button>
                    <div className="text-sm text-gray-600 mt-2">
                      <p>📍 Konombe-mubusanza & surrounding areas</p>
                      <p>📞 +250 790 336 683</p>
                    </div>
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
