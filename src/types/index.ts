// Legacy Product interface for compatibility
export interface Product {
  id: string;
  name: string;
  price_cents: number;
  image_base64: string;
  description: string;
  slug: string;
  currency: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutForm {
  name: string;
  email: string;
  paymentMethod: string;
}