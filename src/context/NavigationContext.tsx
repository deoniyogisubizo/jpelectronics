'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationContextValue {
  isNavigating: boolean;
  progress: number;
  startNavigation: () => void;
  endNavigation: () => void;
  navigateTo: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const startNavigation = useCallback(() => {
    clearTimers();
    setIsNavigating(true);
    setProgress(12);

    // Smooth progress that feels fast (<1s to ~92%)
    progressTimer.current = setInterval(() => {
      setProgress((p) => {
        if (p < 55) return p + 11;
        if (p < 78) return p + 6;
        if (p < 91) return p + 3.5;
        return Math.min(p + 0.8, 94);
      });
    }, 85);
  }, []);

  const endNavigation = useCallback(() => {
    clearTimers();
    setProgress(100);

    hideTimer.current = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 160);
  }, []);

  const navigateTo = useCallback((href: string) => {
    startNavigation();
    router.push(href);
  }, [router, startNavigation]);

  // Auto-end when route actually changes (new page is painting)
  useEffect(() => {
    if (isNavigating) {
      // Tiny delay so the incoming page has started rendering its content
      const t = setTimeout(() => {
        endNavigation();
      }, 70);
      return () => clearTimeout(t);
    }
  }, [pathname, isNavigating, endNavigation]);

  // Global click listener: instant loading on ANY internal link click (product cards, categories, etc.)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a) return;

      // Only same-origin, non-target, non-download, http(s) links
      if (
        a.href &&
        a.origin === window.location.origin &&
        !a.target &&
        !a.hasAttribute('download') &&
        !a.getAttribute('href')?.startsWith('#') &&
        !a.getAttribute('href')?.startsWith('mailto:') &&
        !a.getAttribute('href')?.startsWith('tel:')
      ) {
        const url = new URL(a.href);
        const targetPath = url.pathname + url.search + url.hash;

        // Don't trigger if clicking the current page link
        if (targetPath.split('#')[0] !== window.location.pathname + window.location.search) {
          startNavigation();
          // Do NOT preventDefault — let Next <Link> / browser handle real navigation + prefetch
        }
      }
    };

    // Capture phase so we catch it before other handlers
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [startNavigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <NavigationContext.Provider
      value={{ isNavigating, progress, startNavigation, endNavigation, navigateTo }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used inside NavigationProvider');
  }
  return ctx;
}

// Lightweight instant top progress bar (gold theme, feels <1s)
export function GlobalNavigationLoader() {
  const { isNavigating, progress } = useNavigation();

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-black/10 overflow-hidden pointer-events-none">
      <div
        className="h-full bg-gold transition-[width] duration-100 ease-out"
        style={{
          width: `${Math.max(8, Math.min(progress, 100))}%`,
          boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)',
        }}
      />
    </div>
  );
}

// Prefetch key routes aggressively so navigation feels instant even on slow networks
export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch the primary mobile bottom-nav + high traffic pages right after mount
    const routes = ['/', '/explore', '/search', '/cart', '/profile', '/category'];
    // Use requestIdleCallback if available for zero impact on initial load
    const prefetch = () => {
      routes.forEach((r) => {
        try {
          router.prefetch(r);
        } catch {}
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 1200 });
    } else {
      setTimeout(prefetch, 1200);
    }
  }, [router]);

  return null;
}
