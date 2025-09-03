-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
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

-- Set up Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public users to view active products
CREATE POLICY "Public users can view active products" 
  ON products 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for service_role to have full access
CREATE POLICY "Service role has full access to products" 
  ON products 
  FOR ALL 
  TO service_role 
  USING (true);