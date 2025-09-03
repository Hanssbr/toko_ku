import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, Lock, Check, ShoppingCart, Download, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutForm } from '../types';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items, total, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    paymentMethod: 'credit-card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  useEffect(() => {
    // Refresh cart when component mounts
    refreshCart();
  }, [refreshCart]);
  
  useEffect(() => {
    // Jika ada ID produk di URL, tambahkan produk tersebut ke keranjang
    if (id) {
      const productId = parseInt(id);
      if (!items.some(item => item.id === productId)) {
        // Fetch product from API and add to cart
        fetch(`/api/products/${productId}`)
          .then(res => res.json())
          .then(product => {
            if (product) {
              addToCart(product);
            }
          })
          .catch(err => console.error('Error fetching product:', err));
      }
    }
  }, [id, addToCart, items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create order using Supabase API
      const { createOrder } = await import('../services/api');
      await createOrder(form.email);
      
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Complete!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You will receive download links via email shortly.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-blue-900 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center items-center">
              <Loader className="h-12 w-12 text-blue-900 animate-spin" />
            </div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Add some products to your cart to continue with checkout
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.shortDescription}</p>
                      <p className="text-blue-900 font-semibold">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-blue-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank-transfer">Bank Transfer</option>
                  </select>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-sm text-gray-600">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>

                {/* What You'll Get */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    What You'll Get:
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Instant download access after payment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Email receipt and download links</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Lifetime access to your purchases</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>
                    {isSubmitting ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;