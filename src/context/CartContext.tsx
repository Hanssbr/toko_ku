import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { CartItem as LocalCartItem } from '../types';
import { Product } from '../types/supabase';
import { useAuthContext } from './AuthContext';
import { getCartItems, addToCart as addToCartApi, removeFromCart as removeFromCartApi, updateCartItemQuantity, clearCart as clearCartApi } from '../services/api';

interface CartState {
  items: LocalCartItem[];
  total: number;
  loading: boolean;
}

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] };

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotal = (items: LocalCartItem[]): number => {
  return items.reduce((total, item) => total + ((item.price_cents / 100) * item.quantity), 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        // Convert Supabase Product to LocalCartItem
        const cartItem: LocalCartItem = {
          id: action.payload.id,
          name: action.payload.name,
          price_cents: action.payload.price_cents,
          image_base64: action.payload.image_base64,
          description: action.payload.description,
          slug: action.payload.slug,
          quantity: 1
        };
        
        const newItems = [...state.items, cartItem];
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems)
        };
      }

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems)
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };

    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };
      
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_CART_ITEMS':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload)
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, loading: false });
  const { user } = useAuthContext();

  const refreshCart = async () => {
    if (!user) {
      return;
    }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartItems = await getCartItems();
      
      if (cartItems) {
        const formattedItems: LocalCartItem[] = cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price_cents: item.product.price_cents,
          image_base64: item.product.image_base64,
          description: item.product.description,
          slug: item.product.slug,
          quantity: item.quantity
        }));
        
        dispatch({ type: 'SET_CART_ITEMS', payload: formattedItems });
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      // Reset to empty cart when logged out
      dispatch({ type: 'SET_CART_ITEMS', payload: [] });
    }
  }, [user]);

  const addToCart = async (product: Product) => {
    if (user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await addToCartApi(product.id, 1);
        await refreshCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // Fallback to local cart if not logged in
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await removeFromCartApi(productId);
        await refreshCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // Fallback to local cart if not logged in
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await updateCartItemQuantity(productId, quantity);
        await refreshCart();
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // Fallback to local cart if not logged in
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity }
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await clearCartApi();
        dispatch({ type: 'SET_CART_ITEMS', payload: [] });
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      // Fallback to local cart if not logged in
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};