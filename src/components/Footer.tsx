'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white mt-16">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">JP</span>
              </div>
              <h3 className="text-xl font-bold">JP Tech</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted electronics marketplace across Rwanda. Quality products, reliable delivery, excellent support.
            </p>
            <p className="text-gold font-semibold">+250 790 336 683</p>
            <p className="text-gray-400 text-sm">Konombe-mubusanza, Rwanda</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-gold transition-colors">{t('nav.home')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-gold transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-gold transition-colors">{t('nav.contact')}</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-gold transition-colors">{t('nav.faq')}</Link></li>
              <li><Link href="/track" className="text-gray-400 hover:text-gold transition-colors">{t('nav.track')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/phones" className="text-gray-400 hover:text-gold transition-colors">{t('categories.smartphones')}</Link></li>
              <li><Link href="/category/computers" className="text-gray-400 hover:text-gold transition-colors">{t('categories.computers')}</Link></li>
              <li><Link href="/category/appliances" className="text-gray-400 hover:text-gold transition-colors">{t('categories.appliances')}</Link></li>
              <li><Link href="/category/solar" className="text-gray-400 hover:text-gold transition-colors">{t('categories.solar')}</Link></li>
              <li><Link href="/category/mobility" className="text-gray-400 hover:text-gold transition-colors">{t('categories.mobility')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+250 790 336 683</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+250 796 279 847</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <span>Jndayisenga47@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>Mon-Sat: 8am - 7pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-400">© 2024 JP Tech. All rights reserved.</p>
          <p className="text-sm text-gray-400">Proudly serving Rwanda 🇷🇼</p>
        </div>
      </div>
    </footer>
  );
}
