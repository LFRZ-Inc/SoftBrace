import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';

function CartPage() {
  const { t } = useTranslation();
  const { items, total, removeItem, updateQuantity } = useCart();
  
  const calculateTax = () => {
    return total * 0.08; // 8% tax
  };
  
  const calculateShipping = () => {
    // $2 shipping for orders under $5.99, free shipping for orders $5.99+
    return total < 5.99 ? 2.00 : 0.00;
  };
  
  const calculateTotal = () => {
    return total + calculateTax() + calculateShipping();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
          <p className="mb-8">{t('cart.emptyMessage')}</p>
          <Link 
            to="/shop" 
            className="bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg inline-block"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items - 2 columns on larger screens */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">{t('cart.items')}</h2>
              
              {/* Cart Item List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map(item => (
                  <div key={item.id} className="py-6 flex flex-wrap md:flex-nowrap">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 mb-4 md:mb-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="md:ml-6 flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-lg font-bold">
                          <Link to={`/product/${item.id}`} className="hover:text-primary">
                            {item.name}
                          </Link>
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-end mt-4">
                        <div className="mb-4 md:mb-0">
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {t('cart.quantity')}
                          </label>
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-l"
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center py-1 border-y border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                              min="1"
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-r"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-xl font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-right">
                <Link 
                  to="/shop" 
                  className="text-primary hover:underline"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">{t('cart.orderSummary')}</h2>
              
              {/* Shipping Policy Notice */}
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md text-sm">
                <p>🚚 Orders under $5.99 ship for $2.00. Orders $5.99+ ship free!</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${calculateShipping().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>{t('cart.tax')}</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t('cart.total')}</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  className="block w-full bg-primary hover:bg-primary-light text-white text-center py-3 px-6 rounded-lg font-bold mt-6"
                >
                  {t('cart.proceedToCheckout')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage; 