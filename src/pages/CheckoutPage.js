import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
import { useStripe } from '../contexts/StripeContext';

function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { redirectToCheckout, isLoading, error: stripeError } = useStripe();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect to cart if there are no items
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);
  
  // Display Stripe errors if any
  useEffect(() => {
    if (stripeError) {
      setError(stripeError);
    }
  }, [stripeError]);
  
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError('');
      
      console.log('Initiating checkout with items:', items);
      
      // Call the redirectToCheckout function from our Stripe context
      const result = await redirectToCheckout(items);
      
      if (!result.success) {
        console.error('Checkout error:', result);
        setError(result.message || t('checkout.errors.paymentFailed'));
      }
      
      // No need to handle success case as Stripe will redirect to success page
    } catch (err) {
      console.error('Checkout exception:', err);
      setError(err.message || t('checkout.errors.paymentFailed'));
    } finally {
      setIsProcessing(false);
    }
  };
  
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
                      onError={(e) => {
                        console.error(`Error loading image: ${item.image}`);
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.style.display = 'none';
                        e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                        const placeholder = document.createElement('div');
                        placeholder.className = 'text-gray-400 text-xs text-center';
                        placeholder.innerHTML = 'Image<br>unavailable';
                        e.target.parentNode.appendChild(placeholder);
                      }}
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
          
          {/* Order Summary */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between">
              <span>{t('checkout.subtotal')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>{t('checkout.subtotal')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t('checkout.shippingAndTaxCalculated')}
              </p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded mb-6">
              <h3 className="font-bold mb-1">Error</h3>
              <p>{error}</p>
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
              disabled={isProcessing || isLoading || items.length === 0}
              className={`flex-1 bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg font-bold ${
                (isProcessing || isLoading || items.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing || isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                  {t('checkout.processing')}
                </span>
              ) : t('checkout.placeOrder')}
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