import React, { useState } from 'react';
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
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Set all products as available
  const stripsSoldOut = false;
  const waxSoldOut = false;
  
  // Flag to hide the 31-pack (large pack)
  const hideLargePack = true;

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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">$0.67</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">SoftWax</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">1 wax + 2 strips</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Spot relief</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">—</td>
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
              <p className="quantity">(62 strips total)</p>
              <p className="price">{t('product.packOptions.large.price')}</p>
              <p className="description">Best value for long-term comfort.</p>
              <Link to="/product/3" className="product-button">
                View Details
              </Link>
              <div className="trust-badges">
                <span className="badge">FDA-Compliant Silicone</span>
                <span className="badge">Safe for Braces & Gums</span>
              </div>
            </div>
          )}
          
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
            <div className="coming-soon-upsell">
              <p>Coming Soon: Combo Bundle — SoftWax + 5-Pair Pack for $8.49</p>
            </div>
          </div>
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