import React from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import useTranslation from '../hooks/useTranslation';
// Import images
import singleStripImage from '../assets/single-strip.png';
import smallPackImage from '../assets/5-pack.png';
import mediumPackImage from '../assets/15-pack.png';
import largePackImage from '../assets/31-pack.png';
import softWaxImage from '../assets/SoftWax.png';

function Product() {
  const { t } = useTranslation();
  
  // Set all products as available
  const stripsSoldOut = false;
  const waxSoldOut = false;
  
  // Flag to hide the 31-pack (large pack)
  const hideLargePack = true;

  return (
    <section id="product" className="product">
      <div className="product-container">
        <h2>{t('product.title')}</h2>
        <p className="product-intro">
          {t('product.intro')}
        </p>

        <div className="product-visual">
          <img 
            src={singleStripImage} 
            alt="SoftBrace Strip" 
            className="strip-image"
          />
        </div>

        <div className="product-options">
          <div className="product-option">
            <div className="product-image relative">
              <img 
                src={smallPackImage} 
                alt="SoftBrace 5-Pair Pack" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.small.title')}</h3>
            <p className="quantity">{t('product.packOptions.small.quantity')}</p>
            <p className="price">{t('product.packOptions.small.price')}</p>
            <p className="description">{t('product.packOptions.small.description')}</p>
            <Link to="/product/1" className="product-button">
              {t('product.viewDetails')}
            </Link>
          </div>

          <div className="product-option">
            <div className="product-image relative">
              <img 
                src={mediumPackImage} 
                alt="SoftBrace 15-Pair Pack" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.medium.title')}</h3>
            <p className="quantity">{t('product.packOptions.medium.quantity')}</p>
            <p className="price">{t('product.packOptions.medium.price')}</p>
            <p className="description">{t('product.packOptions.medium.description')}</p>
            <Link to="/product/2" className="product-button">
              {t('product.viewDetails')}
            </Link>
          </div>

          {!hideLargePack && (
            <div className="product-option">
              <div className="product-image relative">
                <img 
                  src={largePackImage} 
                  alt="SoftBrace 31-Pair Pack" 
                  className="package-image"
                />
              </div>
              <h3>{t('product.packOptions.large.title')}</h3>
              <p className="quantity">{t('product.packOptions.large.quantity')}</p>
              <p className="price">{t('product.packOptions.large.price')}</p>
              <p className="description">{t('product.packOptions.large.description')}</p>
              <Link to="/product/3" className="product-button">
                {t('product.viewDetails')}
              </Link>
            </div>
          )}
          
          <div className="product-option">
            <div className="product-image relative">
              <img 
                src={softWaxImage} 
                alt="Orthodontic Wax" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.wax.title')}</h3>
            <p className="quantity">{t('product.packOptions.wax.quantity')}</p>
            <p className="price">{t('product.packOptions.wax.price')}</p>
            <p className="description">{t('product.packOptions.wax.description')}</p>
            <Link to="/product/4" className="product-button">
              {t('product.viewDetails')}
            </Link>
          </div>
        </div>
        
        {/* Add coming soon message for larger packs */}
        <div className="mt-6 mb-8 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">✨ Coming Soon</h3>
          <p className="text-purple-700 dark:text-purple-300">
            We're excited to announce that our 31-Pair Pack and 100-Pair Bulk Pack will be available soon! 
            Stay tuned for these larger size options.
          </p>
        </div>

        <Link to="/shop" className="shop-button">
          {t('product.shopButton')}
        </Link>
      </div>
    </section>
  );
}

export default Product; 