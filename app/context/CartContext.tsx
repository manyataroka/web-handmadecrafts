// 'use client';

// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { CartItem, addToCart as addToCartLib, removeFromCart as removeFromCartLib, updateCartQty as updateCartQtyLib, clearCart as clearCartLib, loadCart as loadCartLib, getCartCount as getCartCountLib } from '@/lib/cart';

// interface CartContextType {
//   cart: CartItem[];
//   cartCount: number;
//   addToCart: (product: { _id?: string; name: string; price: number; imagePath: string }) => Promise<CartItem[]>;
//   removeFromCart: (productId: string) => Promise<CartItem[]>;
//   updateCartQty: (productId: string, qty: number) => Promise<CartItem[]>;
//   clearCart: () => Promise<CartItem[]>;
//   loadCart: () => Promise<CartItem[]>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [cartCount, setCartCount] = useState(0);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const refreshCart = async () => {
//     if (isRefreshing) return;
//     setIsRefreshing(true);
//     try {
//       const items = await loadCartLib();
//       setCart(items);
//       setCartCount(getCartCountLib(items));
//     } catch (_err) {
//       setCart([]);
//       setCartCount(0);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     refreshCart();
//     window.addEventListener('storage', refreshCart);
//     window.addEventListener('cart-updated', refreshCart);
//     return () => {
//       window.removeEventListener('storage', refreshCart);
//       window.removeEventListener('cart-updated', refreshCart);
//     };
//   }, []);

//   const addToCart = async (product: { _id?: string; name: string; price: number; imagePath: string }) => {
//     const items = await addToCartLib(product);
//     setCart(items);
//     setCartCount(getCartCountLib(items));
//     return items;
//   };

//   const removeFromCart = async (productId: string) => {
//     const items = await removeFromCartLib(productId);
//     setCart(items);
//     setCartCount(getCartCountLib(items));
//     return items;
//   };

//   const updateCartQty = async (productId: string, qty: number) => {
//     const items = await updateCartQtyLib(productId, qty);
//     setCart(items);
//     setCartCount(getCartCountLib(items));
//     return items;
//   };

//   const clearCart = async () => {
//     const items = await clearCartLib();
//     setCart(items);
//     setCartCount(0);
//     return items;
//   };

//   const loadCart = async () => {
//     await refreshCart();
//     return cart;
//   };

//   return (
//     <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateCartQty, clearCart, loadCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within CartProvider');
//   }
//   return context;
// }
