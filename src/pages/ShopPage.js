import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
// Import images directly
import smallPackImage from '../assets/5-pack.png';
import mediumPackImage from '../assets/15-pack.png';
import largePackImage from '../assets/31-pack.png';

function ShopPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample product data - will be replaced with actual data
  const products = [
    {
      id: 1,
      name: 'SoftBrace 5-Pair Pack',
      price: 9.99,
      image: smallPackImage,
      category: 'small',
      description: t('product.packOptions.small.description'),
      quantity: '5 Pairs (10 strips)',
      shortDesc: 'Perfect starter pack for first-time users'
    },
    {
      id: 2,
      name: 'SoftBrace 15-Pair Pack',
      price: 24.99,
      image: mediumPackImage,
      category: 'medium',
      description: t('product.packOptions.medium.description'),
      quantity: '15 Pairs (30 strips)',
      shortDesc: 'Most popular choice for regular users'
    },
    {
      id: 3,
      name: 'SoftBrace 31-Pair Pack',
      price: 44.99,
      image: largePackImage,
      category: 'large',
      description: t('product.packOptions.large.description'),
      quantity: '31 Pairs (62 strips)',
      shortDesc: 'Best value for long-term comfort'
    }
  ];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-bold mb-8 text-center">{t('shop.title')}</h1>
      
      {/* Category filter */}
      <div className="flex justify-center mb-8 space-x-4">
        <button 
          className={`px-4 py-2 rounded-lg ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          onClick={() => setSelectedCategory('all')}
        >
          {t('shop.allCategories')}
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${selectedCategory === 'small' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          onClick={() => setSelectedCategory('small')}
        >
          {t('shop.smallPacks')}
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${selectedCategory === 'medium' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          onClick={() => setSelectedCategory('medium')}
        >
          {t('shop.mediumPacks')}
        </button>
        <button 
          className={`px-4 py-2 rounded-lg ${selectedCategory === 'large' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          onClick={() => setSelectedCategory('large')}
        >
          {t('shop.largePacks')}
        </button>
      </div>
      
      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <Link to={`/product/${product.id}`} className="block h-full">
              <div className="h-64 bg-gray-700 flex items-center justify-center p-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-blue-400">{product.name}</h2>
                <p className="text-gray-300 mb-2">{product.quantity}</p>
                <p className="text-gray-400 mb-4">{product.shortDesc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-400">${product.price.toFixed(2)}</span>
                  <button className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded">
                    {t('shop.viewDetails')}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xl">{t('shop.noProductsFound')}</p>
        </div>
      )}
    </div>
  );
}

export default ShopPage; 