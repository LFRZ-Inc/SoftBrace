import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

function CheckoutCancelPage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentCancelled')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('checkout.paymentCancelledMessage')}
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link
            to="/cart"
            className="inline-block bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg font-medium"
          >
            {t('checkout.backToCart')}
          </Link>
          
          <Link
            to="/contact"
            className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-lg font-medium"
          >
            {t('checkout.needHelp')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCancelPage; 