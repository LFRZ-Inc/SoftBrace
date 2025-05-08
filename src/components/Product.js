import React from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import useTranslation from '../hooks/useTranslation';
// Import images
import singleStripImage from '../assets/single-strip.png';
import smallPackImage from '../assets/5-pack.png';
import mediumPackImage from '../assets/15-pack.png';
import largePackImage from '../assets/31-pack.png';

function Product() {
  const { t } = useTranslation();
  
  // SoftBrace strip products are sold out, but wax is available
  const stripsSoldOut = true;
  const waxSoldOut = false;

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
              {stripsSoldOut && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-bold px-4 py-2 bg-red-600 rounded-lg">
                    {t('common.soldOut', 'SOLD OUT')}
                  </span>
                </div>
              )}
            </div>
            <h3>{t('product.packOptions.small.title')}</h3>
            <p className="quantity">{t('product.packOptions.small.quantity')}</p>
            <p className="price">{t('product.packOptions.small.price')}</p>
            <p className="description">{t('product.packOptions.small.description')}</p>
            <Link to="/product/1" className={`product-button ${stripsSoldOut ? 'bg-gray-400 cursor-not-allowed' : ''}`}>
              {stripsSoldOut ? t('common.soldOut', 'SOLD OUT') : t('product.addToCart')}
            </Link>
          </div>

          <div className="product-option">
            <div className="product-image relative">
              <img 
                src={mediumPackImage} 
                alt="SoftBrace 15-Pair Pack" 
                className="package-image"
              />
              {stripsSoldOut && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-bold px-4 py-2 bg-red-600 rounded-lg">
                    {t('common.soldOut', 'SOLD OUT')}
                  </span>
                </div>
              )}
            </div>
            <h3>{t('product.packOptions.medium.title')}</h3>
            <p className="quantity">{t('product.packOptions.medium.quantity')}</p>
            <p className="price">{t('product.packOptions.medium.price')}</p>
            <p className="description">{t('product.packOptions.medium.description')}</p>
            <Link to="/product/2" className={`product-button ${stripsSoldOut ? 'bg-gray-400 cursor-not-allowed' : ''}`}>
              {stripsSoldOut ? t('common.soldOut', 'SOLD OUT') : t('product.addToCart')}
            </Link>
          </div>

          <div className="product-option">
            <div className="product-image relative">
              <img 
                src={largePackImage} 
                alt="SoftBrace 31-Pair Pack" 
                className="package-image"
              />
              {stripsSoldOut && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-bold px-4 py-2 bg-red-600 rounded-lg">
                    {t('common.soldOut', 'SOLD OUT')}
                  </span>
                </div>
              )}
            </div>
            <h3>{t('product.packOptions.large.title')}</h3>
            <p className="quantity">{t('product.packOptions.large.quantity')}</p>
            <p className="price">{t('product.packOptions.large.price')}</p>
            <p className="description">{t('product.packOptions.large.description')}</p>
            <Link to="/product/3" className={`product-button ${stripsSoldOut ? 'bg-gray-400 cursor-not-allowed' : ''}`}>
              {stripsSoldOut ? t('common.soldOut', 'SOLD OUT') : t('product.addToCart')}
            </Link>
          </div>
          
          <div className="product-option">
            <div className="product-image relative">
              <img 
                src={singleStripImage} 
                alt="Orthodontic Wax" 
                className="package-image"
              />
              {waxSoldOut && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-bold px-4 py-2 bg-red-600 rounded-lg">
                    {t('common.soldOut', 'SOLD OUT')}
                  </span>
                </div>
              )}
            </div>
            <h3>{t('product.packOptions.wax.title')}</h3>
            <p className="quantity">{t('product.packOptions.wax.quantity')}</p>
            <p className="price">{t('product.packOptions.wax.price')}</p>
            <p className="description">{t('product.packOptions.wax.description')}</p>
            <Link to="/product/4" className={`product-button ${waxSoldOut ? 'bg-gray-400 cursor-not-allowed' : ''}`}>
              {waxSoldOut ? t('common.soldOut', 'SOLD OUT') : t('product.addToCart')}
            </Link>
          </div>
        </div>

        <Link to="/shop" className="shop-button">
          {t('product.shopButton')}
        </Link>
      </div>
    </section>
  );
}

export default Product; 