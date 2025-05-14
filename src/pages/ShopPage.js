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

function ShopPage() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isLoading, showLoader, hideLoader } = useLoading();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Show loader when fetching products
    showLoader();
    
    // Simulate product loading
    const timer = setTimeout(() => {
      hideLoader();
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, [showLoader, hideLoader]);

  useEffect(() => {
    // Simulate products fetch
    const productData = [
      {
        id: 1,
        name: t('product.packOptions.small.title'),
        price: 4.99,
        image: smallPackImage,
        category: 'small',
        description: t('product.packOptions.small.description'),
        quantity: t('product.packOptions.small.quantity'),
        shortDescription: t('product.packOptions.small.description'),
        soldOut: false
      },
      {
        id: 2,
        name: t('product.packOptions.medium.title'),
        price: 9.99,
        image: mediumPackImage,
        category: 'medium',
        description: t('product.packOptions.medium.description'),
        quantity: t('product.packOptions.medium.quantity'),
        shortDescription: t('product.packOptions.medium.description'),
        soldOut: false
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
        hidden: true
      },
      {
        id: 4,
        name: t('product.packOptions.wax.title'),
        price: 3.99,
        image: softWaxImage, // Using the new SoftWax image
        category: 'wax',
        description: t('product.packOptions.wax.description'),
        quantity: t('product.packOptions.wax.quantity'),
        shortDescription: t('product.packOptions.wax.description'),
        soldOut: false
      },
      {
        id: 5,
        name: 'SoftBrace 100-Pair Bulk Pack',
        price: 49.99,
        image: largePackImage, // Reusing the large pack image
        category: 'bulk',
        description: 'Professional bulk pack for clinics or wholesale',
        quantity: '100 Pairs (200 strips)',
        shortDescription: 'Professional bulk pack for clinics or wholesale',
        soldOut: false,
        hidden: true
      }
    ];
    
    setProducts(productData);
  }, [t]);

  // Filter products based on selected category and hidden status
  const filteredProducts = selectedCategory === 'all'
    ? products.filter(product => !product.hidden)
    : products.filter(product => product.category === selectedCategory && !product.hidden);

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
            <span className="font-bold">🚚 {t('shop.freeShippingAlert')}</span> {t('shop.freeShippingMessage')}
          </p>
        </div>
        
        {/* Coming soon section for 31-pack and 100-pack */}
        <div className="mb-8 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">✨ Coming Soon</h2>
          <p className="text-purple-700 dark:text-purple-300">
            We're excited to announce that our 31-Pair Pack and 100-Pair Bulk Pack will be available soon! 
            Stay tuned for these larger size options.
          </p>
        </div>
        
        {/* Products grid */}
        <div className="flex flex-wrap justify-center gap-8 mx-auto max-w-6xl">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full sm:w-80 max-w-sm flex-grow-0 flex-shrink-0"
              >
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
                  <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{product.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{product.shortDescription}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800 dark:text-blue-400">${product.price.toFixed(2)}</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="bg-primary hover:bg-primary-light text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {t('shop.viewDetails')}
                    </Link>
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
      </div>
    </>
  );
}

export default ShopPage; 