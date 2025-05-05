import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
// Import images directly
import smallPackImage from '../assets/5-pack.png';
import mediumPackImage from '../assets/15-pack.png';
import largePackImage from '../assets/31-pack.png';

function ProductPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // For demo purposes, we're using a hard-coded product list
  // In a real application, these would come from an API
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const productData = [
        {
          id: 1,
          name: 'SoftBrace 5-Pair Pack',
          price: 9.99,
          image: smallPackImage,
          category: 'small',
          description: t('product.packOptions.small.description'),
          longDescription: t('product.packOptions.small.longDescription'),
          features: [
            t('product.features.feature1'),
            t('product.features.feature2'),
            t('product.features.feature3')
          ],
          quantity: '5 Pairs',
          stock: 15
        },
        {
          id: 2,
          name: 'SoftBrace 15-Pair Pack',
          price: 24.99,
          image: mediumPackImage,
          category: 'medium',
          description: t('product.packOptions.medium.description'),
          longDescription: t('product.packOptions.medium.longDescription'),
          features: [
            t('product.features.feature1'),
            t('product.features.feature2'),
            t('product.features.feature3')
          ],
          quantity: '15 Pairs',
          stock: 10
        },
        {
          id: 3,
          name: 'SoftBrace 31-Pair Pack',
          price: 44.99,
          image: largePackImage,
          category: 'large',
          description: t('product.packOptions.large.description'),
          longDescription: t('product.packOptions.large.longDescription'),
          features: [
            t('product.features.feature1'),
            t('product.features.feature2'),
            t('product.features.feature3')
          ],
          quantity: '31 Pairs',
          stock: 5
        }
      ];
      
      const foundProduct = productData.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [id, t]);
  
  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
      
      // Show success message
      setAddedToCart(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="loader">{t('common.loading')}</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('common.productNotFound')}</h1>
        <p className="mb-6">{t('common.productNotFoundMessage')}</p>
        <Link to="/shop" className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg">
          {t('common.backToShop')}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <img 
              src={product.image} 
              alt={product.name}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              <Link to="/shop" className="text-primary hover:underline">
                ← {t('common.backToShop')}
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{product.quantity}</p>
            
            <div className="text-3xl font-bold mb-6">${product.price}</div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {product.description}
            </p>
            
            {product.longDescription && (
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {product.longDescription}
              </p>
            )}
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">{t('product.features.title')}</h3>
              <ul className="list-disc pl-5">
                {product.features.map((feature, index) => (
                  <li key={index} className="mb-1">{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {t('product.quantity')}
              </label>
              <div className="flex items-center">
                <button 
                  onClick={decreaseQuantity}
                  className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-l"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                  className="w-16 text-center py-1 border-y border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <button 
                  onClick={increaseQuantity}
                  className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-r"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {product.stock} {t('product.inStock')}
              </p>
            </div>
            
            {addedToCart ? (
              <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-3 rounded mb-4 text-center">
                {t('product.addedToCart')}
              </div>
            ) : null}
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary-light text-white py-3 px-6 rounded-lg font-bold transition-colors"
              >
                {t('product.addToCart')}
              </button>
              
              <button
                onClick={handleBuyNow}
                className="flex-1 border-2 border-primary hover:bg-gray-100 dark:hover:bg-gray-700 text-primary py-3 px-6 rounded-lg font-bold transition-colors"
              >
                {t('product.buyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage; 