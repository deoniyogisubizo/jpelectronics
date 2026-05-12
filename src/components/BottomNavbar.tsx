'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { House, Sparkles, Search, ShoppingBag, User } from 'lucide-react';

export default function BottomNavbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  const navItems = [
    { icon: House, label: 'Home', href: '/', key: 'home' },
    { icon: Sparkles, label: 'Explore', href: '/explore', key: 'explore' },
    { icon: Search, label: 'Search', href: '/search', key: 'search' },
    { icon: ShoppingBag, label: 'Cart', href: '/cart', key: 'cart' },
    { icon: User, label: 'Profile', href: '/profile', key: 'profile' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-beige/80 backdrop-blur-lg border-t border-black/10 shadow-xl">
      <div className="flex items-center justify-around py-1 px-4">
        {navItems.map(({ icon: Icon, label, href, key }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              className={`relative flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 ${
                active
                  ? 'text-gold transform scale-105'
                  : 'text-black hover:text-gold/70'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${key === 'search' ? 'w-6 h-6' : ''}`} />
                {key === 'explore' && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></div>
                )}
                {key === 'cart' && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                {key === 'search' && (
                  <div className="absolute inset-0 border-2 border-gold rounded-full opacity-30"></div>
                )}
              </div>
              <span className={`text-xs mt-0.5 font-medium ${active ? 'text-gold' : 'text-black'}`}>
                {label}
              </span>
              {active && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-gold rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}