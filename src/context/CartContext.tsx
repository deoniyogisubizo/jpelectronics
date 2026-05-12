'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [duplicateProductId, setDuplicateProductId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jptech-cart');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jptech-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        // Product already in cart, show duplicate alert
        setDuplicateProductId(productId);
        setShowDuplicateAlert(true);
        return prev; // Don't add
      }
      return [...prev, { productId, quantity }];
    });
    if (!items.find(item => item.productId === productId)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
    }
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      setIsOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
    }}>
      {children}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
          <div className="bg-beige bg-opacity-30 p-6 rounded-lg shadow-lg text-center max-w-sm mx-4 relative">
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-2 right-2 text-black hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            <p className="text-black text-lg font-semibold mb-4">
              Your product added to cart successfully! You can view there to proceed payment.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="bg-black text-beige px-4 py-2 rounded hover:bg-gray-800"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showDuplicateAlert && duplicateProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
          <div className="bg-beige bg-opacity-30 p-6 rounded-lg shadow-lg text-center max-w-sm mx-4 relative">
            <button
              onClick={() => {
                setShowDuplicateAlert(false);
                setDuplicateProductId(null);
              }}
              className="absolute top-2 right-2 text-black hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            <p className="text-black text-lg font-semibold mb-4">
              Your product is already in the cart. Do you want to remove it or proceed to checkout?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  removeItem(duplicateProductId);
                  setShowDuplicateAlert(false);
                  setDuplicateProductId(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
              <button
                onClick={() => {
                  setIsOpen(true); // Open cart drawer
                  setShowDuplicateAlert(false);
                  setDuplicateProductId(null);
                }}
                className="bg-black text-beige px-4 py-2 rounded hover:bg-gray-800"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

