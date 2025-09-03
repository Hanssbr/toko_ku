# 365 Shop

Aplikasi e-commerce sederhana yang terintegrasi dengan Supabase untuk manajemen produk, keranjang belanja, dan pesanan.

## Fitur

- Autentikasi pengguna (login/register)
- Katalog produk dengan filter dan pencarian
- Detail produk
- Keranjang belanja
- Checkout dan pemesanan
- Riwayat pesanan

## Teknologi

- React + Vite
- React Router
- Supabase (Authentication, Database)
- TypeScript

## Struktur Database

Aplikasi ini menggunakan Supabase dengan skema database berikut:

### 1. products
- id (uuid)
- name (text)
- slug (text, unique)
- description (text)
- price_cents (integer)
- currency (text, default: 'IDR')
- image_base64 (text)
- file_base64 (text, optional)
- is_active (boolean)
- created_at (timestamptz)

### 2. carts
- id (uuid)
- user_id (uuid, FK ke auth.users)
- created_at (timestamptz)
- updated_at (timestamptz)

### 3. cart_items
- id (uuid)
- cart_id (uuid, FK ke carts)
- product_id (uuid, FK ke products)
- quantity (integer)
- created_at (timestamptz)
- updated_at (timestamptz)

### 4. orders
- id (uuid)
- user_id (uuid, FK ke auth.users)
- email (text)
- status (text: pending/paid/failed/cancelled)
- subtotal_cents (integer)
- currency (text)
- created_at (timestamptz)

### 5. order_items
- id (uuid)
- order_id (uuid, FK ke orders)
- product_id (uuid, FK ke products)
- name (text)
- price_cents (integer)
- quantity (integer)
- created_at (timestamptz)

## Instalasi

1. Clone repositori

```bash
git clone https://github.com/username/365_shop.git
cd 365_shop
```

2. Install dependensi

```bash
npm install
```

3. Buat file `.env` dan isi dengan kredensial Supabase Anda

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Jalankan aplikasi

```bash
npm run dev
```

## Penggunaan API

Lihat [dokumentasi API](./src/docs/api-usage.md) untuk informasi tentang cara menggunakan API Supabase yang telah diimplementasikan.

## Aturan Akses

### products
- Semua user (public) bisa GET produk aktif.
- Hanya admin (service_role) yang bisa POST, PUT, DELETE produk.

### carts & cart_items
- Hanya authenticated user yang bisa GET dan POST cart miliknya.

### orders & order_items
- Hanya authenticated user yang bisa GET dan POST orders miliknya.

## Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk diskusi.

## Lisensi

MIT