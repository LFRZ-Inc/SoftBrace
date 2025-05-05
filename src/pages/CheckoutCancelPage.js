import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

function CheckoutCancelPage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentCancelled')}</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">{t('checkout.paymentCancelledMessage')}</p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/cart"
            className="bg-primary hover:bg-primary-light text-white py-2 px-6 rounded-lg"
          >
            {t('checkout.backToCart')}
          </Link>
          <Link
            to="/"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-6 rounded-lg"
          >
            {t('checkout.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCancelPage; 