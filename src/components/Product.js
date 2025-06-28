import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import useTranslation from '../hooks/useTranslation';
import { shouldShowProduct, shouldShowAllProducts, getReleaseDate, getDaysUntilRelease, isReleaseDay } from '../utils/releaseSchedule';
// Import images
import singleStripImage from '../assets/single-strip.png';
import smallPackImage from '../assets/5-pack.jpg';
import mediumPackImage from '../assets/15-pack.jpg';
import largePackImage from '../assets/31-pack.png';
import softWaxImage from '../assets/SoftWax.jpg';

function Product() {
  const { t } = useTranslation();
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Use scheduled release system instead of hard-coded flags
  const showLargePack = shouldShowProduct('3'); // 31-pack
  const showBulkPack = shouldShowProduct('5'); // 100-pack
  const showBundle = shouldShowProduct('6'); // $8.99 bundle
  const showAllProducts = shouldShowAllProducts();

  // Comparison modal component with updated information including bundle
  const ComparisonModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Pack Comparison</h3>
            <button 
              onClick={() => setShowComparisonModal(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Pack</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Contents</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Ideal For</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Price per Pair</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">5-Pair</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">10 strips</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">First-time users</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">$0.99</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">15-Pair</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">30 strips</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">Regular users</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">$0.73</td>
                </tr>
                {showLargePack && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">31-Pair</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">62 strips</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">Long-term users</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">$0.55</td>
                  </tr>
                )}
                {showBulkPack && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">100-Pair Bulk</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">200 strips</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">Clinics/Wholesale</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">$0.50</td>
                  </tr>
                )}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">SoftWax</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">1 wax + 2 strips</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">Spot relief</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">—</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">Bundle</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">1 wax + 10 strips</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">Best starter combo</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100 font-medium">$0.90</td>
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
    </div>
  );

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
          {/* 5-Pair Pack */}
          <div className="product-option relative">
            <div className="badge-container absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg z-10">
              <span className="text-sm font-bold">Starter Pack</span>
            </div>
            <div className="product-image relative">
              <img 
                src={smallPackImage} 
                alt="SoftBrace 5-Pair Pack" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.small.title')}</h3>
            <p className="quantity">(10 strips total)</p>
            <p className="price">{t('product.packOptions.small.price')}</p>
            <p className="description">Ideal for trying out SoftBrace. Includes 5 pairs (10 strips) for top and bottom gum protection.</p>
            <Link to="/product/1" className="product-button">
              View Details
            </Link>
            <div className="trust-badges">
              <span className="badge">FDA-Compliant Silicone</span>
              <span className="badge">Non-Toxic & One-Time Use</span>
            </div>
          </div>

          {/* 15-Pair Pack */}
          <div className="product-option relative">
            <div className="badge-container absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg z-10">
              <span className="text-sm font-bold">Best Value</span>
            </div>
            <div className="product-image relative">
              <img 
                src={mediumPackImage} 
                alt="SoftBrace 15-Pair Pack" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.medium.title')}</h3>
            <p className="quantity">(30 strips total)</p>
            <p className="price">{t('product.packOptions.medium.price')}</p>
            <p className="description">Our most popular value pack. Includes 15 pairs (30 strips) for ongoing relief.</p>
            <Link to="/product/2" className="product-button">
              View Details
            </Link>
            <div className="trust-badges">
              <span className="badge">FDA-Compliant Silicone</span>
              <span className="badge">Safe for Braces & Gums</span>
            </div>
          </div>

          {/* $8.99 Bundle - Now showing as actual product card! */}
          <div className="product-option relative">
            <div className="badge-container absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg z-10">
              <span className="text-sm font-bold">Bundle Deal</span>
            </div>
            <div className="product-image relative">
              <img 
                src={softWaxImage} 
                alt="SoftWax + SoftBrace Bundle" 
                className="package-image"
              />
            </div>
            <h3>SoftWax + 5-Pair SoftBrace Bundle</h3>
            <p className="quantity">(1 wax case + 10 strips)</p>
            <p className="price">$8.99</p>
            <p className="description">Get the best of both worlds! SoftWax case plus 5-pair SoftBrace starter pack. Perfect for new users or as a gift.</p>
            <Link to="/product/6" className="product-button">
              View Details
            </Link>
            <div className="trust-badges">
              <span className="badge">Bundle Savings</span>
              <span className="badge">Best Starter Combo</span>
            </div>
          </div>

          {/* 31-Pair Pack - Scheduled for July 13th */}
          {showLargePack && (
            <div className="product-option relative">
              {isReleaseDay() && (
                <div className="badge-container absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-bl-lg z-10">
                  <span className="text-sm font-bold">🎉 Birthday Release!</span>
                </div>
              )}
              <div className="product-image relative">
                <img 
                  src={largePackImage} 
                  alt="SoftBrace 31-Pair Pack" 
                  className="package-image"
                />
              </div>
              <h3>{t('product.packOptions.large.title')}</h3>
              <p className="quantity">(62 strips total)</p>
              <p className="price">{t('product.packOptions.large.price')}</p>
              <p className="description">Best value for long-term comfort. Perfect for extended orthodontic treatment.</p>
              <Link to="/product/3" className="product-button">
                View Details
              </Link>
              <div className="trust-badges">
                <span className="badge">FDA-Compliant Silicone</span>
                <span className="badge">Best Value</span>
              </div>
            </div>
          )}

          {/* SoftWax */}
          <div className="product-option relative">
            <div className="badge-container absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg z-10">
              <span className="text-sm font-bold">Free SoftBrace Pair Inside</span>
            </div>
            <div className="product-image relative">
              <img 
                src={softWaxImage} 
                alt="Orthodontic Wax" 
                className="package-image"
              />
            </div>
            <h3>{t('product.packOptions.wax.title')}</h3>
            <p className="quantity">Includes 1 wax case + 1 SoftBrace pair</p>
            <p className="price">{t('product.packOptions.wax.price')}</p>
            <p className="description">Classic ortho wax with a twist—includes a free pair of SoftBrace strips for comparison.</p>
            <Link to="/product/4" className="product-button">
              View Details
            </Link>
            <div className="trust-badges">
              <span className="badge">Non-Toxic</span>
              <span className="badge">Safe for Braces & Gums</span>
            </div>
          </div>

          {/* 100-Pair Bulk Pack - Scheduled for July 13th */}
          {showBulkPack && (
            <div className="product-option relative">
              {isReleaseDay() && (
                <div className="badge-container absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-bl-lg z-10">
                  <span className="text-sm font-bold">🎉 Birthday Release!</span>
                </div>
              )}
              <div className="product-image relative">
                <img 
                  src={largePackImage} 
                  alt="SoftBrace 100-Pair Bulk Pack" 
                  className="package-image"
                />
              </div>
              <h3>SoftBrace 100-Pair Bulk Pack</h3>
              <p className="quantity">(200 strips total)</p>
              <p className="price">$49.99</p>
              <p className="description">Professional bulk pack for orthodontic clinics or wholesale orders. Best value per strip.</p>
              <Link to="/product/5" className="product-button">
                View Details
              </Link>
              <div className="trust-badges">
                <span className="badge">Professional Grade</span>
                <span className="badge">Wholesale Pricing</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Compare Packs button */}
        <div className="compare-packs-container">
          <button 
            onClick={() => setShowComparisonModal(true)}
            className="compare-packs-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare Packs
          </button>
        </div>
        
        {/* Scheduled release countdown - only show if products are not yet released */}
        {!showAllProducts && (
          <div className="mt-6 mb-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">🎂 Birthday Release Coming!</h3>
            <p className="text-purple-700 dark:text-purple-300 mb-2">
              Our 31-Pair Pack and 100-Pair Bulk Pack will be released on <strong>{getReleaseDate()}</strong>!
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Only <strong>{getDaysUntilRelease()}</strong> days to go! 🎉
            </p>
          </div>
        )}

        {/* Birthday celebration message - only show on release day */}
        {isReleaseDay() && (
          <div className="mt-6 mb-8 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">🎉 Happy Birthday! All Products Now Available!</h3>
            <p className="text-orange-700 dark:text-orange-300">
              Celebrating the special day with the release of our complete product lineup! 
              The 31-Pair Pack and 100-Pair Bulk Pack are now available for purchase.
            </p>
          </div>
        )}

        <Link to="/shop" className="shop-button">
          {t('product.shopButton')}
        </Link>
        
        {/* Trust badges footer */}
        <div className="trust-badges-footer">
          <div className="badge-large">FDA-Compliant Silicone</div>
          <div className="badge-large">Non-Toxic & One-Time Use</div>
          <div className="badge-large">Safe for Braces & Gums</div>
        </div>
      </div>
      
      {/* Comparison Modal */}
      {showComparisonModal && <ComparisonModal />}
    </section>
  );
}

export default Product; 