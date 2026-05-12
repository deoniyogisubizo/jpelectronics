'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <CartProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </CartProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}