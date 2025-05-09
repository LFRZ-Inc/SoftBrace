import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

function SuccessPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get session ID from URL
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        // In a real application, you would fetch order details from your backend
        // based on the Stripe session ID
        // For demo purposes, we'll just simulate a successful order
        
        // Simulated API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set dummy order details
        const subtotal = 4.99;
        // Calculate shipping based on our policy - free for orders $5.99+
        const shipping = subtotal >= 5.99 ? 0.00 : 1.00;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;
        
        // Use order number 1 (first order)
        const orderNum = "0000001";
        
        setOrderDetails({
          id: `ORD-${orderNum}`,
          date: new Date().toLocaleDateString(),
          items: [
            { name: 'SoftBrace 5-Pair Pack', quantity: 1, price: 4.99 }
          ],
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="loader mb-4"></div>
          <p>{t('checkout.loadingOrderDetails')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">✗</div>
          <h1 className="text-2xl font-bold mb-4">{t('checkout.orderError')}</h1>
          <p className="mb-6">{error}</p>
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

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-green-500 text-5xl mb-4 text-center">✓</div>
        <h1 className="text-2xl font-bold mb-4 text-center">{t('checkout.paymentSuccess')}</h1>
        <p className="mb-2 text-center">{t('checkout.paymentSuccessMessage')}</p>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">A receipt has been sent to your email address.</p>
        
        {orderDetails && (
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold mb-2">{t('checkout.orderDetails')}</h2>
              <p><strong>{t('checkout.orderNumber')}:</strong> {orderDetails.id}</p>
              <p><strong>{t('checkout.orderDate')}:</strong> {orderDetails.date}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">{t('checkout.items')}</h3>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <div>
                    {item.name} x {item.quantity}
                  </div>
                  <div>${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <div>{t('checkout.subtotal')}</div>
                <div>${orderDetails.subtotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div>{t('checkout.shipping')}</div>
                <div>${orderDetails.shipping.toFixed(2)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div>{t('checkout.tax')}</div>
                <div>${orderDetails.tax.toFixed(2)}</div>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>{t('checkout.total')}</div>
                <div>${orderDetails.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg inline-block"
          >
            {t('checkout.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage; 