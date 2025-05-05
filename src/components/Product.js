import React from 'react';
import './Product.css';
import useTranslation from '../hooks/useTranslation';

function Product() {
  const { t } = useTranslation();

  return (
    <section id="product" className="product">
      <div className="product-container">
        <h2>{t('product.title')}</h2>
        <p className="product-intro">
          {t('product.intro')}
        </p>

        <div className="product-visual">
          <img 
            src="/images/single-strip.png" 
            alt="SoftBrace Strip" 
            className="strip-image"
          />
        </div>

        <div className="product-options">
          <div className="product-option">
            <div className="product-image">
              <img 
                src="/images/5-pack.png" 
                alt="SoftBrace 5-Pair Pack" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.small.title')}</h3>
            <p className="quantity">{t('product.packOptions.small.quantity')}</p>
            <p className="price">{t('product.packOptions.small.price')}</p>
            <p className="description">{t('product.packOptions.small.description')}</p>
          </div>

          <div className="product-option">
            <div className="product-image">
              <img 
                src="/images/15-pack.png" 
                alt="SoftBrace 15-Pair Pack" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.medium.title')}</h3>
            <p className="quantity">{t('product.packOptions.medium.quantity')}</p>
            <p className="price">{t('product.packOptions.medium.price')}</p>
            <p className="description">{t('product.packOptions.medium.description')}</p>
          </div>

          <div className="product-option">
            <div className="product-image">
              <img 
                src="/images/31-pack.png" 
                alt="SoftBrace 31-Pair Pack" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.large.title')}</h3>
            <p className="quantity">{t('product.packOptions.large.quantity')}</p>
            <p className="price">{t('product.packOptions.large.price')}</p>
            <p className="description">{t('product.packOptions.large.description')}</p>
          </div>
        </div>

        <button className="shop-button" disabled>
          {t('product.shopButton')}
        </button>
      </div>
    </section>
  );
}

export default Product; 