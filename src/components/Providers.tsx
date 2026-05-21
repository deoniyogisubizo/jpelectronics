'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { HomeDataProvider } from '@/context/HomeDataContext';
import { NavigationProvider, GlobalNavigationLoader, RoutePrefetcher } from '@/context/NavigationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <GlobalNavigationLoader />
      <RoutePrefetcher />
      <HomeDataProvider>
        <LanguageProvider>
          <CartProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </CartProvider>
        </LanguageProvider>
      </HomeDataProvider>
    </NavigationProvider>
  );
}
