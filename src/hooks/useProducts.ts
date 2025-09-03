import { useState, useEffect } from 'react';
import { getActiveProducts, getProductBySlug } from '../services/api';
import { Product } from '../types/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getActiveProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const getProductDetail = async (slug: string): Promise<Product> => {
    try {
      setLoading(true);
      return await getProductBySlug(slug);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, getProductDetail };
}