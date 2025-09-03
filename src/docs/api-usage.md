```
# Dokumentasi API Supabase untuk 365 Shop

Dokumentasi ini menjelaskan cara menggunakan API Supabase yang telah diimplementasikan untuk aplikasi 365 Shop.

## React Hooks untuk Integrasi UI

Berikut adalah hooks React yang dapat digunakan untuk mengintegrasikan UI dengan Supabase:

### useAuth

Hook untuk mengelola autentikasi pengguna.

```javascript
import { useAuthContext } from '../context/AuthContext';

function LoginPage() {
  const { user, loading, signIn, signUp, signOut } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // Redirect setelah login berhasil
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Logout</button>
      ) : (
        <form onSubmit={handleLogin}>
          {/* Form login */}
        </form>
      )}
    </div>
  );
}
```

### useCart

Hook untuk mengelola keranjang belanja.

```javascript
import { useCart } from '../context/CartContext';

function ProductDetail({ product }) {
  const { items, loading, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <button onClick={() => addToCart(product)} disabled={loading}>
        {loading ? 'Loading...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### useProducts

Hook untuk mengambil data produk dari Supabase.

```javascript
import { useState, useEffect } from 'react';
import { getActiveProducts, getProductBySlug } from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getActiveProducts();
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const getProductDetail = async (slug) => {
    try {
      setLoading(true);
      return await getProductBySlug(slug);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, getProductDetail };
}
```

Penggunaan:

```javascript
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### useOrders

Hook untuk mengelola pesanan pengguna.

```javascript
import { useState, useEffect } from 'react';
import { getUserOrders, createOrder } from '../services/api';
import { useAuthContext } from '../context/AuthContext';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const checkout = async (email) => {
    try {
      setLoading(true);
      const order = await createOrder(email);
      await fetchOrders(); // Refresh orders after checkout
      return order;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, checkout, fetchOrders };
}
```

Penggunaan:

```javascript
import { useOrders } from '../hooks/useOrders';

function OrderHistory() {
  const { orders, loading, error, checkout } = useOrders();
  
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      <h2>Order History</h2>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

## Autentikasi

Semua endpoint yang memerlukan autentikasi harus menyertakan header `Authorization` dengan format:

```
Authorization: Bearer <access_token>
```

Access token didapatkan setelah proses login berhasil.

## Catatan Implementasi

### Row Level Security (RLS)

Database Supabase menggunakan Row Level Security (RLS) untuk membatasi akses data:

1. Produk dapat diakses publik, tetapi hanya yang `is_active = true`
2. Cart, Cart Items, dan Orders hanya dapat diakses oleh pemiliknya (`auth.uid()`)

### Supabase Functions

Beberapa operasi menggunakan fungsi Supabase khusus:

1. `ensure_cart()` - Memastikan user memiliki cart, jika belum ada akan dibuat
2. `add_to_cart(product_id, quantity)` - Menambahkan produk ke cart
3. `checkout_cart(email)` - Membuat order baru dari cart

Semua endpoint yang memerlukan autentikasi harus menyertakan header `Authorization` dengan format:

```
Authorization: Bearer <access_token>
```

Access token didapatkan setelah proses login berhasil.

## Endpoint Products

### GET Semua Produk Aktif

```javascript
import { getActiveProducts } from '../services/api';

// Penggunaan
try {
  const products = await getActiveProducts();
  console.log(products);
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
supabase
  .from('products')
  .select('*')
  .eq('is_active', true);
```

### GET Detail Produk berdasarkan Slug

```javascript
import { getProductBySlug } from '../services/api';

// Penggunaan
try {
  const product = await getProductBySlug('nama-produk-slug');
  console.log(product);
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
supabase
  .from('products')
  .select('*')
  .eq('slug', slug)
  .eq('is_active', true)
  .single();
```

## Endpoint Cart

### GET Cart User

```javascript
import { getUserCart } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  const cart = await getUserCart();
  console.log(cart);
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
// Cek apakah user sudah memiliki cart
supabase
  .from('carts')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

// Jika belum ada, buat cart baru
supabase
  .from('carts')
  .insert({
    user_id: user.id,
  })
  .select()
  .single();
```

### GET Semua Item di Cart

```javascript
import { getCartItems } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  const cartItems = await getCartItems();
  console.log(cartItems);
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
supabase
  .from('cart_items')
  .select(`
    *,
    product:product_id(id, name, slug, description, price_cents, currency, image_base64, is_active)
  `)
  .eq('cart_id', cart.id);
```

### POST Item ke Cart

```javascript
import { addToCart } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  // productId bisa string UUID atau number, quantity adalah jumlah item
  await addToCart('product-uuid', 1); // atau addToCart(123, 1);
  console.log('Item berhasil ditambahkan ke cart');
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
// Pastikan productId adalah string (UUID)
const productIdString = typeof productId === 'number' ? String(productId) : productId;

// Cek apakah produk sudah ada di cart
supabase
  .from('cart_items')
  .select('*')
  .eq('cart_id', cart.id)
  .eq('product_id', productIdString);

// Jika sudah ada, update quantity
supabase
  .from('cart_items')
  .update({ quantity: existingItems[0].quantity + quantity })
  .eq('id', existingItems[0].id);

// Jika belum ada, tambahkan item baru
supabase
  .from('cart_items')
  .insert({
    cart_id: cart.id,
    product_id: productIdString,
    quantity,
  });
```

### DELETE Item dari Cart

```javascript
import { removeFromCart } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  // cartItemId adalah ID dari cart_item yang akan dihapus
  await removeFromCart('cart-item-uuid');
  console.log('Item berhasil dihapus dari cart');
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
supabase
  .from('cart_items')
  .delete()
  .eq('id', cartItemId);
```

### UPDATE Quantity Item di Cart

```javascript
import { updateCartItemQuantity } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  // cartItemId adalah ID dari cart_item, quantity adalah jumlah baru
  await updateCartItemQuantity('cart-item-uuid', 3);
  console.log('Quantity item berhasil diupdate');
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
// Jika quantity <= 0, hapus item
if (quantity <= 0) {
  return removeFromCart(cartItemId);
}

// Update quantity
supabase
  .from('cart_items')
  .update({ quantity })
  .eq('id', cartItemId);
```

### CLEAR Cart

```javascript
import { clearCart } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  await clearCart();
  console.log('Cart berhasil dikosongkan');
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
supabase
  .from('cart_items')
  .delete()
  .eq('cart_id', cart.id);
```

## Endpoint Orders

### POST Order Baru

```javascript
import { createOrder } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  const order = await createOrder('email@example.com');
  console.log('Order berhasil dibuat:', order);
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
// Buat order baru
supabase
  .from('orders')
  .insert({
    user_id: user.id,
    email,
    status: 'pending',
    subtotal_cents: subtotalCents,
    currency: 'IDR',
  })
  .select()
  .single();

// Tambahkan order items
supabase
  .from('order_items')
  .insert(orderItems);

// Kosongkan cart
supabase
  .from('cart_items')
  .delete()
  .eq('cart_id', cart.id);
```

### GET Riwayat Orders

```javascript
import { getUserOrders } from '../services/api';

// Penggunaan (memerlukan autentikasi)
try {
  const orders = await getUserOrders();
  console.log('Riwayat orders:', orders);
} catch (error) {
  console.error('Error:', error);
}
```

Query Supabase yang digunakan:

```javascript
// Ambil semua order milik user
supabase
  .from('orders')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// Untuk setiap order, ambil order items
supabase
  .from('order_items')
  .select(`
    *,
    product:product_id(id, name, slug, description, price_cents, currency, image_base64)
  `)
  .eq('order_id', order.id);
```

## Catatan Penting

1. Semua endpoint yang memerlukan autentikasi akan melempar error jika user tidak login.
2. Pastikan untuk menangani error dengan baik di aplikasi client.
3. Untuk endpoint yang memerlukan ID produk, pastikan menggunakan format UUID yang benar.
4. Harga produk disimpan dalam satuan cents (sen) di database, tetapi dikonversi ke unit (rupiah) di aplikasi client.