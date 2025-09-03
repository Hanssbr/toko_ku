import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../types/supabase';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <img
          src={`data:image/png;base64,${product.image_base64}`}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
            <Link
              to={`/detail/product/${product.slug}`}
              className="bg-white text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </Link>
            <button
              onClick={handleAddToCart}
              className="bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-900 text-white px-2 py-1 rounded text-xs font-semibold">
            Digital Product
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-900">
            ${(product.price_cents / 100).toFixed(2)}
          </span>
          <Link
            to={`/detail/product/${product.slug}`}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;