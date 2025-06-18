import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
import { useStripe } from '../contexts/StripeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserPoints, 
  redeemPoints, 
  createOrderWithPoints, 
  createOrderItems 
} from '../lib/supabase';
import { 
  getShippingOptions, 
  calculateCartShipping, 
  getShippingExplanation 
} from '../utils/shippingLogic';

function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { redirectToCheckout } = useStripe();
  const { user, profile } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [usePointsRedemption, setUsePointsRedemption] = useState(false);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [showAccountDiscount, setShowAccountDiscount] = useState(false);
  const [selectedShippingOptions, setSelectedShippingOptions] = useState({});
  const [shippingCalculation, setShippingCalculation] = useState(null);
  
  // Redirect to cart if there are no items
  useEffect(() => {
    if (items.length === 0 && !paymentSuccess) {
      navigate('/cart');
    }
  }, [items, navigate, paymentSuccess]);

  // Load user points if logged in
  useEffect(() => {
    const loadUserPoints = async () => {
      if (user) {
        try {
          const points = await getUserPoints(user.id);
          setUserPoints(points);
          
          // Show account discount if user is logged in and not using points
          setShowAccountDiscount(true);
        } catch (error) {
          console.error('Error loading user points:', error);
        }
      }
    };

    loadUserPoints();
  }, [user]);

  // Calculate shipping when items or shipping options change
  useEffect(() => {
    if (items.length > 0) {
      const calculation = calculateCartShipping(items, selectedShippingOptions);
      setShippingCalculation(calculation);
    }
  }, [items, selectedShippingOptions]);
  
  const calculateTax = () => {
    return total * 0.08; // 8% tax
  };
  
  const calculateShipping = () => {
    return shippingCalculation ? shippingCalculation.totalShipping : 0.00;
  };
  
  const calculateAccountDiscount = () => {
    // 5% discount for logged-in users (only if not using points redemption)
    if (user && !usePointsRedemption) {
      return total * 0.05;
    }
    return 0;
  };

  const calculatePointsDiscount = () => {
    // Free 5-Pair Pack worth $8.99 for 50 points
    if (usePointsRedemption && userPoints >= 50) {
      return 8.99;
    }
    return 0;
  };

  const calculateSubtotalAfterDiscounts = () => {
    const accountDiscount = calculateAccountDiscount();
    const pointsDiscount = calculatePointsDiscount();
    return Math.max(0, total - accountDiscount - pointsDiscount);
  };

  const calculateTotal = () => {
    const subtotalAfterDiscounts = calculateSubtotalAfterDiscounts();
    return subtotalAfterDiscounts + calculateTax() + calculateShipping();
  };

  const canRedeemPoints = () => {
    return user && userPoints >= 50;
  };

  const handlePointsRedemption = (usePoints) => {
    setUsePointsRedemption(usePoints);
    // Can't use both discounts at the same time
    if (usePoints) {
      setShowAccountDiscount(false);
    } else {
      setShowAccountDiscount(user ? true : false);
    }
  };

  const handleShippingOptionChange = (productId, shippingType) => {
    setSelectedShippingOptions(prev => ({
      ...prev,
      [productId]: shippingType
    }));
  };
  
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError('');
      
      // Prepare items for checkout
      const lineItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Prepare checkout options with points and discount data
      const checkoutOptions = {
        pointsUsed: usePointsRedemption ? 50 : 0,
        usePointsRedemption: usePointsRedemption,
        useAccountDiscount: showAccountDiscount && !usePointsRedemption
      };
      
      // Call the redirectToCheckout function from our Stripe context
      const result = await redirectToCheckout(lineItems, checkoutOptions);
      
      if (result.success) {
        // Redirect to Stripe will happen automatically
        // The cart will be cleared after successful payment via webhook
        console.log('Checkout session created successfully:', result);
      } else {
        setError(result.message || t('checkout.errors.paymentFailed'));
      }
    } catch (err) {
      setError(err.message || t('checkout.errors.paymentFailed'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // If payment was successful, show success message
  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4">{t('checkout.paymentSuccess')}</h1>
          <p className="mb-2">{t('checkout.paymentSuccessMessage')}</p>
          <p className="mb-6 text-gray-600 dark:text-gray-400">A receipt has been sent to your email address.</p>
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
          
          {/* Shipping Options Section */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">📦 Shipping Options</h3>
            
            {/* Shipping explanation */}
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg text-sm">
              <p className="mb-1">{getShippingExplanation().trackingInfo}</p>
              <p>{getShippingExplanation().freeShippingThreshold}</p>
            </div>

            {items.map(item => {
              const productId = item.id.toString();
              const shippingOptions = getShippingOptions(productId, total);
              const selectedOption = selectedShippingOptions[productId] || (shippingOptions[0]?.type);

              return (
                <div key={item.id} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  {shippingOptions.length > 1 ? (
                    <div className="space-y-2">
                      {shippingOptions.map(option => (
                        <label key={option.type} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`shipping-${productId}`}
                            value={option.type}
                            checked={selectedOption === option.type}
                            onChange={(e) => handleShippingOptionChange(productId, e.target.value)}
                            className="mt-1 w-4 h-4 text-primary"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{option.name}</span>
                              <span className="font-bold">
                                {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              ⏱️ {option.estimated_days} • {option.trackable ? '📦 Trackable' : '📮 No tracking'}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{shippingOptions[0]?.name}</span>
                        <span className="font-bold">
                          {shippingOptions[0]?.price === 0 ? 'FREE' : `$${shippingOptions[0]?.price.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{shippingOptions[0]?.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        ⏱️ {shippingOptions[0]?.estimated_days} • 📦 Trackable
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {shippingCalculation && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg">
                <p className="font-medium">
                  {shippingCalculation.allTrackable ? '✅ All items include tracking' : '⚠️ Some items without tracking'}
                </p>
                <p className="text-sm">Total shipping: ${shippingCalculation.totalShipping.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Points Redemption Section */}
          {user && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 border border-purple-200 dark:border-purple-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-purple-800 dark:text-purple-200">🎁 Rewards & Discounts</h3>
                <span className="text-sm text-purple-600 dark:text-purple-300">
                  You have {userPoints} points
                </span>
              </div>
              
              {canRedeemPoints() ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="usePoints"
                      checked={usePointsRedemption}
                      onChange={(e) => handlePointsRedemption(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="usePoints" className="text-purple-800 dark:text-purple-200 font-medium">
                      🎉 Redeem 50 points for a FREE 5-Pair Pack (Save $8.99)
                    </label>
                  </div>
                  {usePointsRedemption && (
                    <p className="text-sm text-purple-600 dark:text-purple-300 ml-7">
                      ✨ You'll have {userPoints - 50} points remaining after this order
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-purple-700 dark:text-purple-300">
                  <p className="mb-2">💡 Earn 1 point for every $1 spent!</p>
                  <p className="text-sm">
                    You need {50 - userPoints} more points to redeem a free 5-Pair Pack
                  </p>
                </div>
              )}

              {/* Account Discount */}
              {showAccountDiscount && !usePointsRedemption && (
                <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✅</span>
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Account holder discount: 5% off your order!
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guest User Promotion */}
          {!user && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="text-center">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                  🎯 Create an account and save!
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                  • Get 5% off this order<br/>
                  • Earn 1 point per $1 spent<br/>
                  • Redeem 50 points for a free 5-Pair Pack
                </p>
                <button 
                  onClick={() => {/* This would open the auth modal */}}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Sign Up Now
                </button>
              </div>
            </div>
          )}
          
          {/* Order Summary */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between">
              <span>{t('checkout.subtotal')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            {/* Account Discount */}
            {calculateAccountDiscount() > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Account Discount (5%)</span>
                <span>-${calculateAccountDiscount().toFixed(2)}</span>
              </div>
            )}
            
            {/* Points Redemption Discount */}
            {calculatePointsDiscount() > 0 && (
              <div className="flex justify-between text-purple-600 dark:text-purple-400">
                <span>Points Redemption (50 points)</span>
                <span>-${calculatePointsDiscount().toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>{t('checkout.shipping')}</span>
              <span>${calculateShipping().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>{t('checkout.tax')}</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>{t('checkout.total')}</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              {(calculateAccountDiscount() > 0 || calculatePointsDiscount() > 0) && (
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  You saved ${(calculateAccountDiscount() + calculatePointsDiscount()).toFixed(2)}!
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 rounded mb-4">
              {error}
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
              disabled={isProcessing || items.length === 0}
              className={`flex-1 bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg font-bold ${
                (isProcessing || items.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? t('checkout.processing') : t('checkout.placeOrder')}
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