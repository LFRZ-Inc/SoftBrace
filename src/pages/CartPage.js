import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useStripe } from '../contexts/StripeContext';
import Auth from '../components/Auth';

function CartPage() {
  const { t } = useTranslation();
  const { items, total, removeItem, updateQuantity } = useCart();
  const { user, profile } = useAuth();
  const { isUserLoggedIn } = useStripe();
  const [showAuth, setShowAuth] = useState(false);
  
  const calculateTax = () => {
    return total * 0.08; // 8% tax
  };
  
  const calculateShipping = () => {
    // $2 shipping for orders under $5.99, free shipping for orders $5.99+
    return total < 5.99 ? 2.00 : 0.00;
  };

  const calculateDiscount = () => {
    // 5% discount for registered users
    return isUserLoggedIn ? total * 0.05 : 0;
  };
  
  const calculateTotal = () => {
    const subtotal = total;
    const discount = calculateDiscount();
    const discountedSubtotal = subtotal - discount;
    return discountedSubtotal + calculateTax() + calculateShipping();
  };
  
  return (
    <>
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
                            <label className="block text-sm text-gray-800 dark:text-gray-100 mb-1 font-medium">
                              {t('cart.quantity')}
                            </label>
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className={`px-3 py-1 rounded-l ${
                                  item.id === 7 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' 
                                    : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                                disabled={item.id === 7}
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => item.id !== 7 ? updateQuantity(item.id, parseInt(e.target.value) || 1) : null}
                                className={`w-12 text-center py-1 border-y border-gray-300 dark:border-gray-600 ${
                                  item.id === 7 
                                    ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
                                    : 'dark:bg-gray-700'
                                }`}
                                min="1"
                                readOnly={item.id === 7}
                              />
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className={`px-3 py-1 rounded-r ${
                                  item.id === 7 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' 
                                    : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                                disabled={item.id === 7}
                              >
                                +
                              </button>
                            </div>
                            {item.id === 7 && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                ⚠️ Trial pack: 1 per order limit
                              </p>
                            )}
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
                
                {/* Registered User Discount Banner */}
                {isUserLoggedIn ? (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md text-sm">
                    <p>🎉 <strong>5% Registered User Discount Applied!</strong></p>
                    <p>Thanks for being a member, {profile?.full_name || user?.email?.split('@')[0] || 'valued customer'}!</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md text-sm">
                    <p>💡 <strong>Sign up and save 5%!</strong></p>
                    <p>Create an account to get 5% off this order plus faster checkout.</p>
                    <button 
                      onClick={() => setShowAuth(true)}
                      className="mt-2 text-blue-600 dark:text-blue-300 underline hover:no-underline"
                    >
                      Sign up now →
                    </button>
                  </div>
                )}
                
                {/* Shipping Policy Notice */}
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-md text-sm">
                  {items.some(item => item.id === 7) ? (
                    <div>
                      <p>🎁 <strong>Trial Pack Special:</strong> Only $1.00 shipping!</p>
                      <p>📦 Trial packs ship via standard delivery (3-5 business days)</p>
                    </div>
                  ) : (
                    <div>
                      <p>🚚 Orders under $5.99 ship for $2.00. Orders $5.99+ ship free!</p>
                      <p>📍 <strong>Laredo, TX residents:</strong> Free local delivery available!</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  {isUserLoggedIn && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Registered User Discount (5%)</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
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
                  
                  {/* Pricing Disclaimer */}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg text-sm">
                    <p className="font-medium mb-1">💡 <strong>Important:</strong></p>
                    <p>• Final pricing and shipping will be calculated in Stripe checkout</p>
                    <p>• You can select your preferred shipping option during checkout</p>
                    <p>• All discounts will be automatically applied</p>
                  </div>
                  
                  <Link
                    to="/checkout"
                    className="block w-full bg-primary hover:bg-primary-light text-white text-center py-3 px-6 rounded-lg font-bold mt-6"
                  >
                    {t('cart.proceedToCheckout')}
                  </Link>
                  
                  {!isUserLoggedIn && (
                    <p className="text-xs text-gray-700 dark:text-gray-200 text-center mt-2 font-medium">
                      No account required • Sign up during checkout to save 5%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <Auth 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)} 
      />
    </>
  );
}

export default CartPage; 