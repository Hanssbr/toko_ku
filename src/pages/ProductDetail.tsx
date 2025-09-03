import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CreditCard, Check, Star, Download, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/supabase';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { getProductDetail } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      
      try {
        setLoading(true);
        const productData = await getProductDetail(slug);
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load product'));
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [slug, getProductDetail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? `Error: ${error.message}` : 'Product Not Found'}
          </h2>
          <Link to="/products" className="text-blue-900 hover:text-blue-700">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const features = [
    "Instant digital download",
    "High-quality files included",
    "Lifetime access",
    "Commercial license included",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-blue-900 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={`data:image/jpeg;base64,${product.image_base64}`}
                alt={product.name}
                className="w-full h-96 lg:h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Digital Product
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-600">(4.8/5 - 234 reviews)</span>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-blue-900">
                    ${(product.price_cents / 100).toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${((product.price_cents * 1.5) / 100).toFixed(2)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    Save 33%
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">What's Included:</h3>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-6">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <Link to={`/checkout/product/${product.slug}`} className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Buy Now - Instant Access</span>
                  </Link>
                </div>

                {/* Trust Signals */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>Instant Download</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;