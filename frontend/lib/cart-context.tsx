'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  collectionId: string;
  collectionName: string;
  collectionNameEn: string;
  image: string;
  brand: string;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'addedAt'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // 从本地存储加载购物车
  useEffect(() => {
    const savedCart = localStorage.getItem('piccola-cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem('piccola-cart', JSON.stringify(items));
  }, [items]);

  // 添加到购物车
  const addToCart = (item: Omit<CartItem, 'quantity' | 'addedAt'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, addedAt: new Date() }];
    });
    setIsOpen(true);
  };

  // 从购物车移除
  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // 更新数量
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => 
      prev.map(i => i.id === id ? { ...i, quantity } : i)
    );
  };

  // 清空购物车
  const clearCart = () => {
    setItems([]);
  };

  // 总商品数
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
