'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '@/types';
import { useNavigation } from '@/context/NavigationContext';

/* ── cache constants ─────────────────────────── */
const CACHE_KEY = 'jptech-products';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedPayload {
  ts: number;
  map: Record<string, Product>;
}

function readCache(): CachedPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(map: Record<string, Product>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), map }));
  } catch { /* quota exceeded — silently ignored */ }
}

/* ── context type ────────────────────────────── */
interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCartItem: (productId: string) => void;
  isItemLoading: (productId: string) => boolean;
  itemCount: number;
  subtotal: number;
  products: Record<string, Product>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ── provider ────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { navigateTo } = useNavigation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [duplicateProductId, setDuplicateProductId] = useState<string | null>(null);

  // loading flags: keyed by productId, `true` while the 3-sec spinner is active
  const [loadingCartItems, setLoadingCartItems] = useState<Record<string, boolean>>({});

  // in-flight / cached deduplication guard
  const fetchRef = useRef<Promise<void> | null>(null);

  /* restore cart items once on mount */
  useEffect(() => {
    let cancelled = false;
    const saved = localStorage.getItem('jptech-cart');
    if (saved) {
      queueMicrotask(() => {
        if (!cancelled) setItems(JSON.parse(saved));
      });
    }
    return () => { cancelled = true; };
  }, []);

  /* persist items to localStorage */
  useEffect(() => {
    localStorage.setItem('jptech-cart', JSON.stringify(items));
  }, [items]);

  const extraRef = useRef<(() => void) | null>(null);

  /* ─── eager product hydration & refresh ─────── */
  useEffect(() => {
    if (items.length === 0) return;
    const snapshot = items;

    extraRef.current = () => {
      queueMicrotask(() => {
        const cached = readCache();
        if (cached) {
          const missingIds = snapshot.filter(i => !cached.map[i.productId]).map(i => i.productId);
          if (missingIds.length === 0 && Object.keys(cached.map).length > 0) {
            setProducts(prev => {
              if (Object.keys(prev).length === Object.keys(cached.map).length) return prev;
              return { ...cached.map, ...prev };
            });
          } else if (Object.keys(cached.map).length > 0) {
            setProducts(prev => ({ ...prev, ...cached.map }));
          }
        }

        const stale = Date.now() - (cached?.ts ?? 0) > CACHE_TTL_MS || !cached;
        if (stale) {
          (async () => {
            if (fetchRef.current) return;
            fetchRef.current = (async () => {
              try {
                const res = await fetch('/api/products', { cache: 'no-store' });
                const data: Product[] = await res.json();
                const map: Record<string, Product> = {};
                data.forEach(p => { map[p._id] = p; });
                writeCache(map);
                setProducts(map);
              } catch { /* noop */ }
              finally { fetchRef.current = null; }
            })();
          })();
        }
      });
    };

    queueMicrotask(() => extraRef.current?.());
    return () => { extraRef.current = null; };
  }, [items]);

  /* ─── cart mutations ────────────────────────── */
  const addItem = (productId: string, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        setDuplicateProductId(productId);
        setShowDuplicateAlert(true);
        return prev;
      }
      return [...prev, { productId, quantity }];
    });
    if (!items.find(item => item.productId === productId)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  /**
   * Call `loadCartItem` **before** clicking + or –.
   * It sets a 3-second loading flag on the item; the cart page listens
   * via `isItemLoading()` and shows a spinner + "Updating…" label.
   * The flag auto-clears after 3 s regardless.
   */
  const loadCartItem = (productId: string) => {
    setLoadingCartItems(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setLoadingCartItems(prev => {
        if (!prev[productId]) return prev;
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }, 3000);
  };

  // thin wrapper: flag → update → flag clears automatically after 3 s
  const updateQuantity = (productId: string, quantity: number) => {
    loadCartItem(productId);
    if (quantity <= 0) { removeItem(productId); return; }
    setItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);

  /* ─── helpers ──────────────────────────────── */
  const isItemLoading = (productId: string): boolean => !!loadingCartItems[productId];

  /* ─── derived values ────────────────────────── */
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart,
      loadCartItem, isItemLoading,
      itemCount, subtotal, products,
    }}>
      {children}

      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
          <div className="bg-beige bg-opacity-30 p-6 rounded-lg shadow-lg text-center max-w-sm mx-4 relative">
            <button onClick={() => setShowAlert(false)} className="absolute top-2 right-2 text-black hover:text-gray-600 text-xl font-bold">×</button>
            <p className="text-black text-lg font-semibold mb-4">Your product added to cart successfully! You can view there to proceed payment.</p>
            <button onClick={() => setShowAlert(false)} className="bg-black text-beige px-4 py-2 rounded hover:bg-gray-800">OK</button>
          </div>
        </div>
      )}

      {showDuplicateAlert && duplicateProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
          <div className="bg-beige bg-opacity-30 p-6 rounded-lg shadow-lg text-center max-w-sm mx-4 relative">
            <button onClick={() => { setShowDuplicateAlert(false); setDuplicateProductId(null); }} className="absolute top-2 right-2 text-black hover:text-gray-600 text-xl font-bold">×</button>
            <p className="text-black text-lg font-semibold mb-4">Your product is already in the cart. Do you want to remove it or proceed to checkout?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { removeItem(duplicateProductId); setShowDuplicateAlert(false); setDuplicateProductId(null); }} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Remove</button>
              <button onClick={() => { navigateTo('/cart'); setShowDuplicateAlert(false); setDuplicateProductId(null); }} className="bg-black text-beige px-4 py-2 rounded hover:bg-gray-800">Go to Cart</button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
