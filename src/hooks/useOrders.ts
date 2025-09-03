import { useState, useEffect } from 'react';
import { createOrder, getUserOrders } from '../services/api';
import { Order } from '../types/supabase';
import { useAuthContext } from '../context/AuthContext';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (email: string) => {
    if (!user) {
      throw new Error('User must be logged in to checkout');
    }
    
    try {
      setLoading(true);
      const order = await createOrder(email);
      setOrders(prev => [order, ...prev]);
      return order;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create order');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, checkout, fetchOrders };
}