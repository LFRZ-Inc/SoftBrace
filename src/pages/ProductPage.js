import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useCart } from '../contexts/CartContext';
import SoftLaunchBanner from '../components/SoftLaunchBanner';
import ProductSchema from '../components/ProductSchema';
// Import images directly
import smallPackImage from '../assets/5-pack.png';
import mediumPackImage from '../assets/15-pack.png';
import largePackImage from '../assets/31-pack.png';
import softWaxImage from '../assets/SoftWax.png'; // New SoftWax image

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
          price: 4.99,
          image: smallPackImage,
          category: 'small',
          description: t('product.packOptions.small.description'),
          longDescription: t('product.packOptions.small.longDescription'),
          features: [
            t('product.features.feature1'),
            t('product.features.feature2'),
            t('product.features.feature3')
          ],
          quantity: '5 Pairs (10 strips)',
          stock: 15,
          soldOut: false
        },
        {
          id: 2,
          name: 'SoftBrace 15-Pair Pack',
          price: 10.99,
          image: mediumPackImage,
          category: 'medium',
          description: t('product.packOptions.medium.description'),
          longDescription: t('product.packOptions.medium.longDescription'),
          features: [
            t('product.features.feature1'),
            t('product.features.feature2'),
            t('product.features.feature3')
          ],
          quantity: '15 Pairs (30 strips)',
          stock: 10,
          soldOut: false
        },
        {
          id: 3,
          name: 'SoftBrace 31-Pair Pack',
          price: 16.99,
          image: largePackImage,
          category: 'large',
          description: t('product.packOptions.large.description'),
          longDescription: t('product.packOptions.large.longDescription'),
          features: [
            t('product.features.feature1'),
            t('product.features.feature2'),
            t('product.features.feature3')
          ],
          quantity: '31 Pairs (62 strips)',
          stock: 5,
          soldOut: false,
          hidden: true,
          comingSoon: true
        },
        {
          id: 4,
          name: t('product.packOptions.wax.title'),
          price: 3.99,
          image: softWaxImage, // Using the new SoftWax image
          category: 'wax',
          description: t('product.packOptions.wax.description'),
          longDescription: t('product.packOptions.wax.longDescription'),
          features: [
            'Medical-grade orthodontic wax for braces',
            'Easy to apply and remove',
            'Discreet clear color to blend with braces',
            'Compact container for on-the-go use'
          ],
          quantity: t('product.packOptions.wax.quantity'),
          stock: 25,
          soldOut: false
        },
        {
          id: 5,
          name: 'SoftBrace 100-Pair Bulk Pack',
          price: 49.99,
          image: largePackImage, // Reusing the large pack image
          category: 'bulk',
          description: 'Professional bulk pack for clinics or wholesale',
          longDescription: 'Our professional bulk pack contains 100 pairs (200 strips) of SoftBrace strips, perfect for orthodontic clinics or wholesale orders. The ideal solution for practices that want to offer superior comfort to their patients.',
          features: [
            t('product.features.feature1'),
            t('product.features.feature2'),
            t('product.features.feature3'),
            'Perfect for orthodontic clinics and professionals'
          ],
          quantity: '100 Pairs (200 strips)',
          stock: 3,
          soldOut: false,
          hidden: true,
          comingSoon: true
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
      <>
        <SoftLaunchBanner />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="loader">{t('common.loading')}</div>
        </div>
      </>
    );
  }
  
  if (!product) {
    return (
      <>
        <SoftLaunchBanner />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('common.productNotFound')}</h1>
          <p className="mb-6">{t('common.productNotFoundMessage')}</p>
          <Link to="/shop" className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg">
            {t('common.backToShop')}
          </Link>
        </div>
      </>
    );
  }
  
  if (product.hidden) {
    return (
      <>
        <SoftLaunchBanner />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
          <div className="mb-6 max-w-xl mx-auto">
            <img 
              src={product.image} 
              alt={product.name}
              className="max-w-full max-h-64 object-contain mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
            <p className="mb-6">
              This product will be available soon! We're working hard to make our larger packs available for purchase.
              Check back later or sign up for our newsletter to be notified when it's ready.
            </p>
            <Link to="/shop" className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg">
              {t('common.backToShop')}
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <SoftLaunchBanner />
      <ProductSchema product={product} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 relative">
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
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                      onClick={decreaseQuantity} 
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button 
                      onClick={increaseQuantity} 
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              {addedToCart ? (
                <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-3 rounded mb-4 text-center">
                  {t('product.addedToCart')}
                </div>
              ) : null}
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleAddToCart} 
                  className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white"
                >
                  {t('product.addToCart')}
                </button>
                
                <button 
                  onClick={handleBuyNow} 
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {t('product.buyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage; 