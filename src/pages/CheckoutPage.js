import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
import { useStripe } from '../contexts/StripeContext';

function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { redirectToCheckout } = useStripe();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Redirect to cart if there are no items
  useEffect(() => {
    if (items.length === 0 && !paymentSuccess) {
      navigate('/cart');
    }
  }, [items, navigate, paymentSuccess]);
  
  const calculateTax = () => {
    return total * 0.08; // 8% tax
  };
  
  const calculateShipping = () => {
    return 5.99; // Flat shipping rate
  };
  
  const calculateTotal = () => {
    return total + calculateTax() + calculateShipping();
  };
  
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError('');
      
      // Prepare items for checkout
      const lineItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Call the redirectToCheckout function from our Stripe context
      const result = await redirectToCheckout(lineItems);
      
      if (result.success) {
        // In a real implementation, this would redirect to Stripe
        // For demo purposes, we'll simulate a successful payment
        setPaymentSuccess(true);
        clearCart();
        
        // In a real app, we wouldn't immediately clear the cart
        // That would happen after the user completes payment on Stripe and returns
      } else {
        setError(result.message || t('checkout.errors.paymentFailed'));
      }
    } catch (err) {
      setError(err.message || t('checkout.errors.paymentFailed'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // If payment was successful, show success message
  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentSuccess')}</h1>
          <p className="mb-6">{t('checkout.paymentSuccessMessage')}</p>
          <Link
            to="/"
            className="bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg inline-block"
          >
            {t('checkout.backToHome')}
          </Link>
        </div>
      </div>
    );
  }
  
  // Show checkout summary with button to proceed to Stripe
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>
          
          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">{t('cart.items')}</h3>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-start border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mr-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('checkout.quantity')}: {item.quantity}
                    </p>
                    <p className="font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shipping Policy Announcement */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg">
            <p className="text-center font-medium">
              🚚 Orders under $9.99 ship for $1. Orders $9.99+ ship free!
            </p>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between">
              <span>{t('checkout.subtotal')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>{t('checkout.shipping')}</span>
              <span>${calculateShipping().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>{t('checkout.tax')}</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>{t('checkout.total')}</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/cart" 
              className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-lg"
            >
              {t('checkout.backToCart')}
            </Link>
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
              className={`flex-1 bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg font-bold ${
                (isProcessing || items.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? t('checkout.processing') : t('checkout.placeOrder')}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {t('checkout.stripeMessage')}
            </p>
            <div className="flex justify-center items-center space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-3 py-1 rounded font-bold">
                Visa
              </div>
              <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-100 px-3 py-1 rounded font-bold">
                Mastercard
              </div>
              <div className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-100 px-3 py-1 rounded font-bold">
                AmEx
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage; 