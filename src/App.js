import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ThemeProvider from './components/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import LanguageProvider from './components/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './contexts/CartContext';
import { StripeProvider } from './contexts/StripeContext';

// Lazy-load pages to improve initial loading performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));
const CheckoutCancelPage = lazy(() => import('./pages/CheckoutCancelPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <StripeProvider>
              <Router>
                <div className="App">
                  <ErrorBoundary>
                    <Header />
                  </ErrorBoundary>
                  <main className="main-content">
                    <ErrorBoundary>
                      <Suspense fallback={<Loading />}>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/shop" element={<ShopPage />} />
                          <Route path="/product/:id" element={<ProductPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </main>
                  <ErrorBoundary>
                    <Footer />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <ThemeToggle />
                    <LanguageSelector />
                  </ErrorBoundary>
                </div>
              </Router>
            </StripeProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 