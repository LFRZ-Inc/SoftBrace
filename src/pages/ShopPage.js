import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import SoftLaunchBanner from '../components/SoftLaunchBanner';
import { useCart } from '../contexts/CartContext';
import { useLoading } from '../contexts/LoadingContext';
// Import images directly
import smallPackImage from '../assets/5-pack.png';
import mediumPackImage from '../assets/15-pack.png';
import largePackImage from '../assets/31-pack.png';
import softWaxImage from '../assets/SoftWax.png'; // New SoftWax image

// Preload product data
const createProductData = (t) => [
  {
    id: 1,
    name: t('product.packOptions.small.title'),
    price: 4.99,
    image: smallPackImage,
    category: 'small',
    description: "Ideal for trying out SoftBrace. Includes 5 pairs (10 strips) for top and bottom gum protection.",
    quantity: "(10 strips total)",
    shortDescription: "Ideal for trying out SoftBrace. Includes 5 pairs (10 strips) for top and bottom gum protection.",
    soldOut: false,
    badge: "Starter Pack",
    pricePerPair: "$0.99"
  },
  {
    id: 2,
    name: t('product.packOptions.medium.title'),
    price: 10.99,
    image: mediumPackImage,
    category: 'medium',
    description: "Our most popular value pack. Includes 15 pairs (30 strips) for ongoing relief.",
    quantity: "(30 strips total)",
    shortDescription: "Our most popular value pack. Includes 15 pairs (30 strips) for ongoing relief.",
    soldOut: false,
    badge: "Best Value",
    pricePerPair: "$0.73"
  },
  {
    id: 3,
    name: t('product.packOptions.large.title'),
    price: 16.99,
    image: largePackImage,
    category: 'large',
    description: t('product.packOptions.large.description'),
    quantity: t('product.packOptions.large.quantity'),
    shortDescription: t('product.packOptions.large.description'),
    soldOut: false,
    hidden: true,
    pricePerPair: "$0.55"
  },
  {
    id: 4,
    name: t('product.packOptions.wax.title'),
    price: 3.99,
    image: softWaxImage,
    category: 'wax',
    description: "Classic ortho wax with a twist—includes a free pair of SoftBrace strips for comparison.",
    quantity: "Includes 1 wax case + 1 SoftBrace pair",
    shortDescription: "Classic ortho wax with a twist—includes a free pair of SoftBrace strips for comparison.",
    soldOut: false,
    badge: "Free SoftBrace Pair Inside",
    pricePerPair: "—"
  },
  {
    id: 5,
    name: 'SoftBrace 100-Pair Bulk Pack',
    price: 49.99,
    image: largePackImage,
    category: 'bulk',
    description: 'Professional bulk pack for clinics or wholesale',
    quantity: '100 Pairs (200 strips)',
    shortDescription: 'Professional bulk pack for clinics or wholesale',
    soldOut: false,
    hidden: true,
    pricePerPair: "$0.50"
  },
  {
    id: 6,
    name: 'SoftWax + 5-Pair SoftBrace Strips Bundle',
    price: 8.99,
    image: softWaxImage,
    category: 'bundle',
    description: 'Get the best of both worlds: 1 SoftWax case and a 5-pair (10 strips) SoftBrace starter pack. Perfect for new users or as a gift!',
    quantity: '1 wax case + 5 pairs (10 strips)',
    shortDescription: 'Bundle: SoftWax + 5-pair SoftBrace Strips. Save and try both comfort solutions!',
    soldOut: false,
    badge: 'Bundle Deal',
    pricePerPair: '$0.90'
  },
];

function ShopPage() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { hideLoader } = useLoading();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState(() => createProductData(t));
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Immediately force hide any loader whenever this component mounts
  useEffect(() => {
    // Force hide loader immediately and repeatedly to ensure it's gone
    hideLoader();
    
    const forceHideInterval = setInterval(() => {
      hideLoader();
    }, 500);
    
    // Stop forcing hide after 5 seconds
    const clearForceHideInterval = setTimeout(() => {
      clearInterval(forceHideInterval);
    }, 5000);
    
    return () => {
      clearInterval(forceHideInterval);
      clearTimeout(clearForceHideInterval);
      hideLoader();
    };
  }, [hideLoader]);
  
  // Update products when translation changes
  useEffect(() => {
    setProducts(createProductData(t));
  }, [t]);

  // Filter products based on selected category and hidden status
  const filteredProducts = selectedCategory === 'all'
    ? products.filter(product => !product.hidden)
    : products.filter(product => product.category === selectedCategory && !product.hidden);

  // Comparison modal component
  const ComparisonModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Compare SoftBrace Products</h3>
          <button 
            onClick={() => setShowComparisonModal(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ideal For</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price per Pair</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">5-Pair</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">10 strips</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">First-time users</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">$0.99</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">15-Pair</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">30 strips</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Regular users</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">$0.73</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">SoftWax</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">1 wax + 2 strips</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Spot relief</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">—</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Bundle</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">1 wax + 10 strips</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Best starter combo</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">$0.90</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setShowComparisonModal(false)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SoftLaunchBanner />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center">{t('shop.title')}</h1>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {t('shop.allCategories')}
          </button>
          <button
            onClick={() => setSelectedCategory('small')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'small'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {t('shop.smallPacks')}
          </button>
          <button
            onClick={() => setSelectedCategory('medium')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'medium'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {t('shop.mediumPacks')}
          </button>
          <button
            onClick={() => setSelectedCategory('wax')}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === 'wax'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {t('shop.waxProducts')}
          </button>
        </div>
        
        {/* Add shipping threshold alert */}
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700 dark:text-yellow-200">
            <span className="font-bold">🚚 Free Shipping Available!</span> Orders under $5.99 ship for $2.00. Orders $5.99+ ship free!
          </p>
        </div>
        
        {/* Products grid */}
        <div className="flex flex-wrap justify-center gap-8 mx-auto max-w-6xl">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full sm:w-80 max-w-sm flex-grow-0 flex-shrink-0 relative"
              >
                {product.badge && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg text-sm font-bold z-10">
                    {product.badge}
                  </div>
                )}
                <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {product.soldOut && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-xl px-4 py-2 bg-red-600 rounded-lg">
                        {t('common.soldOut', 'SOLD OUT')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-1 text-gray-800 dark:text-gray-200">{product.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.quantity}</p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{product.shortDescription}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-gray-800 dark:text-blue-400">${product.price.toFixed(2)}</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="bg-primary hover:bg-primary-light text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {t('shop.viewDetails')}
                    </Link>
                  </div>
                  
                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="inline-block text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full">FDA-Compliant Silicone</span>
                    <span className="inline-block text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-200 px-2 py-1 rounded-full">Non-Toxic & One-Time Use</span>
                    <span className="inline-block text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full">Safe for Braces & Gums</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 w-full">
              <p className="text-gray-500 dark:text-gray-400">{t('shop.noProductsFound')}</p>
            </div>
          )}
        </div>
        
        {/* Compare Packs button */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setShowComparisonModal(true)}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare Packs
          </button>
        </div>
        
        {/* Coming soon section for 31-pack and 100-pack */}
        <div className="mt-12 mb-8 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">✨ Coming Soon</h2>
          <p className="text-purple-700 dark:text-purple-300">
            We're excited to announce that our 31-Pair Pack and 100-Pair Bulk Pack will be available soon! 
            Stay tuned for these larger size options.
          </p>
        </div>
        
        {/* Comparison Modal */}
        {showComparisonModal && <ComparisonModal />}
      </div>
    </>
  );
}

export default ShopPage; 