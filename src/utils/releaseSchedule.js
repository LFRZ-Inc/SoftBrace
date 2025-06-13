/**
 * Release Schedule Utility
 * Manages scheduled releases for SoftBrace products
 */

// Release date: July 13th, 2025 (User's Birthday! 🎉)
const RELEASE_DATE = new Date('2025-07-13T00:00:00');

/**
 * Check if products should be released based on the current date
 * @returns {boolean} True if current date is on or after the release date
 */
export const shouldShowAllProducts = () => {
  const now = new Date();
  return now >= RELEASE_DATE;
};

/**
 * Check if a specific product should be visible based on its release schedule
 * @param {string} productId - The product identifier
 * @returns {boolean} True if the product should be visible
 */
export const shouldShowProduct = (productId) => {
  // Products that are always available
  const alwaysAvailable = ['1', '2', '4', '6']; // 5-pack, 15-pack, SoftWax, Bundle
  
  // Products released on July 13th, 2025
  const scheduledProducts = ['3', '5']; // 31-pack, 100-pack
  
  if (alwaysAvailable.includes(String(productId))) {
    return true;
  }
  
  if (scheduledProducts.includes(String(productId))) {
    return shouldShowAllProducts();
  }
  
  return false;
};

/**
 * Get a human-readable release date string
 * @returns {string} Formatted release date
 */
export const getReleaseDate = () => {
  return RELEASE_DATE.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get days remaining until release (for countdown features)
 * @returns {number} Days remaining (negative if past release date)
 */
export const getDaysUntilRelease = () => {
  const now = new Date();
  const timeDiff = RELEASE_DATE.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Check if today is the birthday/release day
 * @returns {boolean} True if today is July 13th, 2025
 */
export const isReleaseDay = () => {
  const now = new Date();
  return now.toDateString() === RELEASE_DATE.toDateString();
}; 