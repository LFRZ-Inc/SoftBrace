import React, { useState, useEffect } from 'react';
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
import Contact from './components/Contact';
import ReviewsPage from './pages/ReviewsPage';
import Blog from './pages/Blog';
import SoftBraceUsagePage from './pages/SoftBraceUsagePage';
import AdminPage from './pages/AdminPage';
import UserDashboard from './pages/UserDashboard';
import { CartProvider } from './contexts/CartContext';
import { StripeProvider } from './contexts/StripeContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';

// Conditionally import the Loader to avoid breaking the build
let Loader = null;
try {
  Loader = require('./components/Loader').default;
} catch (error) {
  console.warn('Could not load the Loader component:', error);
}

// Admin wrapper that bypasses customer auth context
const AdminWrapper = () => {
  return (
    <div className="admin-isolated">
      <AdminPage />
    </div>
  );
};

// Customer app wrapper with all the customer context providers
const CustomerApp = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <StripeProvider>
          <LoadingProvider>
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
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/terms-of-service" element={<TermsPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPage />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/softbrace-usage" element={<SoftBraceUsagePage />} />
                  <Route path="/insert-card" element={<SoftBraceUsagePage />} />
                  <Route path="/account" element={<UserDashboard />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </LoadingProvider>
        </StripeProvider>
      </CartProvider>
    </AuthProvider>
  );
};

// Loader component wrapper
const LoaderComponent = () => {
  const { isLoading } = useLoading();
  
  if (!Loader) {
    return null;
  }
  
  return <Loader isLoading={isLoading} />;
};

function App() {
  const [currentUrl, setCurrentUrl] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentUrl(window.location.pathname);
    };

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Route to admin in isolation or customer app
  if (currentUrl === '/admin') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <AdminWrapper />
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <CustomerApp />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;