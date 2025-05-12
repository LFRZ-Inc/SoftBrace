import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeProvider from './components/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import LanguageProvider from './components/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import WebsiteSchema from './components/WebsiteSchema';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import Blog from './pages/Blog';
import { CartProvider } from './contexts/CartContext';
import { StripeProvider } from './contexts/StripeContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';

// Conditionally import the Loader to avoid breaking the build
let Loader = null;
try {
  Loader = require('./components/Loader').default;
} catch (error) {
  console.warn('Could not load the Loader component:', error);
}

// Wrapper component that uses the loading context
const LoaderComponent = () => {
  const { isLoading } = useLoading();
  if (Loader && isLoading) {
    return <Loader />;
  }
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <StripeProvider>
            <LoadingProvider>
              <Router>
                <div className="App">
                  <WebsiteSchema />
                  <Header />
                  <LoaderComponent />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/success" element={<SuccessPage />} />
                      <Route path="/terms-of-service" element={<TermsPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPage />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ThemeToggle />
                  <LanguageSelector />
                </div>
              </Router>
            </LoadingProvider>
          </StripeProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 