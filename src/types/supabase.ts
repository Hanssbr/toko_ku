export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price_cents: number;
          currency: string;
          image_base64: string;
          file_base64: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          price_cents: number;
          currency?: string;
          image_base64: string;
          file_base64?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          price_cents?: number;
          currency?: string;
          image_base64?: string;
          file_base64?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          status: 'pending' | 'paid' | 'failed' | 'cancelled';
          subtotal_cents: number;
          currency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          subtotal_cents: number;
          currency: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          subtotal_cents?: number;
          currency?: string;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          name: string;
          price_cents: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          name: string;
          price_cents: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          name?: string;
          price_cents?: number;
          quantity?: number;
          created_at?: string;
        };
      };
    };
  };
}

// Tipe yang lebih mudah digunakan dalam aplikasi
export type Product = Database['public']['Tables']['products']['Row'];
export type Cart = Database['public']['Tables']['carts']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'] & {
  product?: Product;
};
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  product?: Product;
};