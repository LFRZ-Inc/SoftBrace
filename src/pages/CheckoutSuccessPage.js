import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [sessionId, setSessionId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  
  useEffect(() => {
    // Get the session_id from the URL parameters
    const params = new URLSearchParams(location.search);
    const session = params.get('session_id');
    
    if (session) {
      setSessionId(session);
      // Generate a simple order number based on the session and current time
      // In a real app, you would get this from your backend
      setOrderNumber(`SBS-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`);
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="text-green-500 text-6xl mb-6">✓</div>
        <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentSuccess')}</h1>
        
        {sessionId && (
          <>
            <p className="mb-6">{t('checkout.paymentSuccessMessage')}</p>
            
            {orderNumber && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('checkout.orderNumber')}</p>
                <p className="font-bold text-lg">{orderNumber}</p>
              </div>
            )}
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t('checkout.emailConfirmation')}
            </p>
          </>
        )}
        
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg inline-block"
          >
            {t('checkout.backToHome')}
          </Link>
          
          <Link
            to="/contact"
            className="text-primary hover:text-primary-light underline"
          >
            {t('checkout.needHelp')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccessPage; 