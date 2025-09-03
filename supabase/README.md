# Supabase Setup for 365 Shop

## Database Setup

Untuk mengatur database Supabase untuk aplikasi 365 Shop, ikuti langkah-langkah berikut:

1. Buat project baru di [Supabase](https://supabase.com)
2. Salin URL dan Anon Key dari project settings ke file `.env` di root project
3. Jalankan migrasi SQL untuk membuat tabel dan menambahkan data

## Migrasi SQL

Folder `migrations` berisi file SQL yang perlu dijalankan untuk mengatur database:

1. `create_products_table.sql` - Membuat tabel products dengan Row Level Security
2. `insert_sample_products.sql` - Menambahkan data produk sampel

## Cara Menjalankan Migrasi

1. Buka Supabase Dashboard untuk project Anda
2. Pilih menu "SQL Editor"
3. Buat query baru
4. Copy-paste isi file SQL dari folder migrations
5. Jalankan query

Atau gunakan Supabase CLI:

```bash
supabase db push
```

## Struktur Tabel

### Products

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  image_base64 TEXT NOT NULL,
  file_base64 TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security

Tabel products memiliki kebijakan Row Level Security sebagai berikut:

- Pengguna publik (anon) dapat melihat produk yang aktif (is_active = true)
- Role service_role memiliki akses penuh ke semua produk