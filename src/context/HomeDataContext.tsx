'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';

interface CacheEntry {
  data: any[];
  loaded: boolean;
}

interface HomeDataContextValue {
  cache: Record<string, CacheEntry>;
  ensureFetched: (endpoint: string) => Promise<any[]>;
}

const HomeDataContext = createContext<HomeDataContextValue | undefined>(undefined);

export function HomeDataProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<Record<string, CacheEntry>>({});
  const cacheRef = useRef(cache);
  const pendingFetches = useRef<Record<string, Promise<any[]>>>({});

  // Keep ref in sync for stable ensureFetched without stale closures
  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  const ensureFetched = useCallback(async (endpoint: string): Promise<any[]> => {
    // Return immediately if already loaded (using ref for latest)
    const currentEntry = cacheRef.current[endpoint];
    if (currentEntry?.loaded) {
      return currentEntry.data;
    }

    // Return existing pending promise to dedupe
    const pending = pendingFetches.current[endpoint];
    if (pending) {
      return pending;
    }

    const promise = (async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const safeData = Array.isArray(data) ? data : [];
        setCache(prev => ({
          ...prev,
          [endpoint]: { data: safeData, loaded: true }
        }));
        return safeData;
      } catch (err) {
        console.error(`Failed to fetch ${endpoint}:`, err);
        setCache(prev => ({
          ...prev,
          [endpoint]: { data: [], loaded: true }
        }));
        return [];
      } finally {
        delete pendingFetches.current[endpoint];
      }
    })();

    pendingFetches.current[endpoint] = promise;
    return promise;
  }, []);

  return (
    <HomeDataContext.Provider value={{ cache, ensureFetched }}>
      {children}
    </HomeDataContext.Provider>
  );
}

export function useHomeData() {
  const context = useContext(HomeDataContext);
  if (context === undefined) {
    throw new Error('useHomeData must be used within a HomeDataProvider');
  }
  return context;
}
