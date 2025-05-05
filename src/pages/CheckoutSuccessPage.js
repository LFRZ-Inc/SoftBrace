import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';

function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const { clearCart } = useCart();
  
  // Clear the cart when payment is successful
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentSuccess')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('checkout.paymentSuccessMessage')}
        </p>
        
        <Link
          to="/shop"
          className="inline-block bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg font-medium"
        >
          {t('checkout.continueShopping')}
        </Link>
      </div>
    </div>
  );
}

export default CheckoutSuccessPage; 