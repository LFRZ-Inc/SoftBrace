import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [sessionId, setSessionId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Get the session_id from the URL parameters
    const params = new URLSearchParams(location.search);
    const session = params.get('session_id');
    
    if (session) {
      setSessionId(session);
      fetchOrderData(session);
    } else {
      setError('No session ID found');
    }
  }, [location]);

  const fetchOrderData = async (sessionId) => {
    try {
      setLoading(true);
      
      // Try to fetch order data from Supabase using the Stripe session ID
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product_name
          )
        `)
        .eq('stripe_session_id', sessionId)
        .single();

      if (orderError) {
        console.log('Order not found in database yet, showing generic success message');
        // If order not found, show generic success message (webhook might still be processing)
        setOrderData(null);
      } else {
        console.log('Order found:', order);
        setOrderData(order);
      }
    } catch (err) {
      console.error('Error fetching order data:', err);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="text-green-500 text-6xl mb-6">✓</div>
        <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentSuccess')}</h1>
        
        {sessionId && (
          <>
            <p className="mb-6">{t('checkout.paymentSuccessMessage')}</p>
            
            {orderData ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 mb-6">
                <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">{t('checkout.orderNumber')}</p>
                <p className="font-bold text-lg">{orderData.order_number}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Order Date: {new Date(orderData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {orderData.points_earned > 0 && (
                  <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                    <p className="text-purple-800 dark:text-purple-200 font-medium text-sm">
                      🎉 You earned {orderData.points_earned} points!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 mb-6">
                <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                  🎉 Payment Successful!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Purchase Date: {currentDate}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Your order has been received and is being processed. Order details will be available in your dashboard shortly.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-800 dark:text-gray-100 mb-6 font-medium">
              {user ? 
                `A confirmation email will be sent to ${user.email}` : 
                'A confirmation email will be sent to your provided email address'
              }
            </p>
          </>
        )}
        
        {/* Shipping Information Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📦 Shipping Information</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>• Orders under $5.99: $2.00 standard shipping</p>
            <p>• Orders $5.99+: Free standard shipping</p>
            <p>• Laredo, TX local delivery: Free (1-2 business days)</p>
            <p>• All orders are verified before shipping (1-2 business days)</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg inline-block"
          >
            {t('checkout.backToHome')}
          </Link>
          
          {user && (
            <Link
              to="/dashboard"
              className="text-primary hover:text-primary-light underline"
            >
              View Order in Dashboard
            </Link>
          )}
          
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