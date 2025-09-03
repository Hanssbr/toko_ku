import { supabase } from '../lib/supabase';
import { Product, CartItem, Order, OrderItem } from '../types/supabase';

/**
 * Mengambil semua produk aktif
 */
export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data;
}

/**
 * Mengambil detail produk berdasarkan slug
 */
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    throw error;
  }

  return data;
}

/**
 * Mendapatkan atau membuat cart untuk user yang sedang login
 */
export async function getUserCart() {
  // Pastikan user sudah login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Cek apakah user sudah memiliki cart
  const { data: existingCart } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Jika sudah ada cart, gunakan yang ada
  if (existingCart) {
    return existingCart;
  }

  // Jika belum ada cart, buat cart baru
  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating cart:', error);
    throw error;
  }

  return newCart;
}

/**
 * Menambahkan item ke cart
 */
export async function addToCart(productId: string | number, quantity: number) {
  // Dapatkan cart user
  const cart = await getUserCart();

  // Pastikan productId adalah string (UUID)
  const productIdString = typeof productId === 'number' ? String(productId) : productId;

  // Cek apakah produk sudah ada di cart
  const { data: existingItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)
    .eq('product_id', productIdString);

  if (existingItems && existingItems.length > 0) {
    // Update quantity jika produk sudah ada di cart
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItems[0].quantity + quantity })
      .eq('id', existingItems[0].id);

    if (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  } else {
    // Tambahkan produk baru ke cart
    const { error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productIdString,
        quantity,
      });

    if (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  return getCartItems();
}

/**
 * Mengambil semua item di cart user
 */
export async function getCartItems() {
  // Dapatkan cart user
  const cart = await getUserCart();

  // Ambil semua item di cart beserta detail produk
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:product_id(id, name, slug, description, price_cents, currency, image_base64, is_active)
    `)
    .eq('cart_id', cart.id);

  if (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }

  return data;
}

/**
 * Membuat order baru dan mengisi order_items
 */
export async function createOrder(email: string) {
  // Pastikan user sudah login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Ambil item di cart
  const cartItems = await getCartItems();
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  // Hitung subtotal
  const subtotalCents = cartItems.reduce((total, item) => {
    return total + (item.product?.price_cents || 0) * item.quantity;
  }, 0);

  // Buat order baru
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      email,
      status: 'pending',
      subtotal_cents: subtotalCents,
      currency: 'IDR', // Default currency
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  // Tambahkan order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    name: item.product?.name || '',
    price_cents: item.product?.price_cents || 0,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error adding order items:', itemsError);
    throw itemsError;
  }

  // Kosongkan cart setelah order berhasil dibuat
  const cart = await getUserCart();
  await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);

  return order;
}

/**
 * Menghapus item dari cart
 */
export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }

  return getCartItems();
}

/**
 * Mengupdate quantity item di cart
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);

  if (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }

  return getCartItems();
}

/**
 * Mengosongkan cart
 */
export async function clearCart() {
  const cart = await getUserCart();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);

  if (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }

  return [];
}

/**
 * Mengambil riwayat order user
 */
export async function getUserOrders() {
  // Pastikan user sudah login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Ambil semua order milik user
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw ordersError;
  }

  // Untuk setiap order, ambil order items
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:product_id(id, name, slug, description, price_cents, currency, image_base64)
        `)
        .eq('order_id', order.id);

      if (itemsError) {
        console.error(`Error fetching items for order ${order.id}:`, itemsError);
        return { ...order, items: [] };
      }

      return { ...order, items };
    })
  );

  return ordersWithItems;
}