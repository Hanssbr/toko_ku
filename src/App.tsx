import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ProductsPage from './pages/ProductsPage';
import Auth from './pages/Auth';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/product" element={<ProductsPage />} />
              <Route path="/detail/product/:slug" element={<ProductDetail />} />
              <Route path="/checkout/product/:slug" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;