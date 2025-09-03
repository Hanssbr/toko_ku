import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Calendar, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';

const Header: React.FC = () => {
  const { items } = useCart();
  const { user, signOut } = useAuthContext();
  const location = useLocation();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Calendar className="h-8 w-8 text-blue-900 group-hover:text-blue-700 transition-colors" />
            <span className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
              365 Days
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-900 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/product"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/product') 
                  ? 'text-blue-900 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              Products
            </Link>
            <Link
              to="/checkout"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                isActive('/checkout') 
                  ? 'text-blue-900 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-1">
                <ShoppingCart className="h-4 w-4" />
                <span>Checkout</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden md:inline">
                  {user.email}
                </span>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-900"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-900"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
            
            <div className="md:hidden">
              <Link to="/checkout" className="relative">
                <ShoppingCart className="h-6 w-6 text-blue-900" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;