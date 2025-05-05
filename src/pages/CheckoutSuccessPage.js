import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';

function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const { clearCart } = useCart();
  
  // Clear the cart on successful checkout
  useEffect(() => {
    clearCart();
    // Log the success for debugging
    console.log('Payment successful, cart cleared');
  }, [clearCart]);
  
  // Generate a fake order number
  const orderNumber = `SB-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`;
  const orderDate = new Date().toLocaleDateString();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentSuccess')}</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">{t('checkout.paymentSuccessMessage')}</p>
        </div>
        
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{t('checkout.orderNumber')}:</span>
            <span>{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{t('checkout.orderDate')}:</span>
            <span>{orderDate}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          {t('checkout.emailConfirmation')}
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-light text-white py-2 px-6 rounded-lg"
          >
            {t('checkout.backToHome')}
          </Link>
          <Link
            to="/shop"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-6 rounded-lg"
          >
            {t('checkout.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccessPage; 