import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Star, Shield, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const Homepage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Premium Digital Products
              <span className="block text-blue-200">Every Day of the Year</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover high-quality digital resources, courses, and tools designed to elevate your business and creative projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose 365 Days?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide premium digital products with exceptional quality and support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Download</h3>
              <p className="text-gray-600">
                Get immediate access to your digital products after purchase. No waiting, no delays.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                All products are carefully curated and tested to ensure the highest quality standards.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Payment</h3>
              <p className="text-gray-600">
                Your transactions are protected with bank-level security and encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular digital products and resources
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-10 w-10 text-blue-900 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">Error loading products. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of satisfied customers who have upgraded their workflow with our premium digital products
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Start Shopping Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;