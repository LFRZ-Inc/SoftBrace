// Shipping Logic for SoftBraceStrips.com
// Updated pricing and tracking options per product type

export const PRODUCT_TYPES = {
  FIVE_PACK: '1',      // 5-Pair Pack
  FIFTEEN_PACK: '2',   // 15-Pair Pack
  THIRTY_ONE_PACK: '3', // 31-Pair Pack
  SOFTWAX: '4',        // SoftWax
  BULK_PACK: '5',      // 100-Pair Bulk
  BUNDLE: '6'          // SoftWax + 5-Pair Bundle
};

export const SHIPPING_TYPES = {
  FLAT_MAIL: 'flat_mailer',      // $2 non-trackable
  TRACKED_MAIL: 'tracked_mailer', // $3 trackable for 5-pack
  TRACKED_STANDARD: 'tracked_standard', // $2 tracked for SoftWax
  FREE_SHIPPING: 'free_shipping'  // Free for orders $5.99+
};

// Calculate shipping options for a product
export const getShippingOptions = (productId, cartTotal = 0) => {
  const options = [];

  switch (productId) {
    case PRODUCT_TYPES.FIVE_PACK:
      // 5-Pair Pack: $2 standard shipping (no tracking for orders under $5.99)
      options.push({
        type: SHIPPING_TYPES.FLAT_MAIL,
        name: 'Standard Shipping',
        price: 2.00,
        description: '$2 standard shipping',
        trackable: false,
        estimated_days: '5-7 business days'
      });
      break;

    case PRODUCT_TYPES.SOFTWAX:
      // SoftWax: Always $2 tracked (too thick for flat mail)
      options.push({
        type: SHIPPING_TYPES.TRACKED_STANDARD,
        name: 'Tracked Shipping (Included)',
        price: 2.00,
        description: 'First-Class shipping with tracking',
        trackable: true,
        estimated_days: '3-5 business days',
        required: true
      });
      break;

    case PRODUCT_TYPES.FIFTEEN_PACK:
    case PRODUCT_TYPES.THIRTY_ONE_PACK:
    case PRODUCT_TYPES.BULK_PACK:
    case PRODUCT_TYPES.BUNDLE:
      // Larger packs: Free shipping if $5.99+, otherwise $2 tracked
      if (cartTotal >= 5.99) {
        options.push({
          type: SHIPPING_TYPES.FREE_SHIPPING,
          name: 'Free Shipping',
          price: 0.00,
          description: 'Free tracked shipping on orders $5.99+',
          trackable: true,
          estimated_days: '3-5 business days'
        });
      } else {
        options.push({
          type: SHIPPING_TYPES.TRACKED_STANDARD,
          name: 'Tracked Shipping',
          price: 2.00,
          description: 'Tracked shipping (free on orders $5.99+)',
          trackable: true,
          estimated_days: '3-5 business days'
        });
      }
      break;

    default:
      // Default case: standard shipping logic
      if (cartTotal >= 5.99) {
        options.push({
          type: SHIPPING_TYPES.FREE_SHIPPING,
          name: 'Free Shipping',
          price: 0.00,
          description: 'Free shipping on orders $5.99+',
          trackable: true,
          estimated_days: '3-5 business days'
        });
      } else {
        options.push({
          type: SHIPPING_TYPES.TRACKED_STANDARD,
          name: 'Standard Shipping',
          price: 2.00,
          description: '$2 shipping (free on orders $5.99+)',
          trackable: true,
          estimated_days: '3-5 business days'
        });
      }
  }

  return options;
};

// Calculate shipping for entire cart
export const calculateCartShipping = (cartItems, selectedShippingOptions = {}) => {
  let totalShipping = 0;
  let shippingBreakdown = [];
  let allTrackable = true;

  // Calculate cart total for free shipping threshold
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartItems.forEach(item => {
    const productId = item.id.toString();
    const options = getShippingOptions(productId, cartTotal);
    
    // Use selected shipping option or default to first option
    const selectedOption = selectedShippingOptions[productId] 
      ? options.find(opt => opt.type === selectedShippingOptions[productId])
      : options[0];

    if (selectedOption) {
      const itemShipping = selectedOption.price * item.quantity;
      totalShipping += itemShipping;
      
      shippingBreakdown.push({
        productName: item.name,
        quantity: item.quantity,
        shippingOption: selectedOption,
        cost: itemShipping
      });

      if (!selectedOption.trackable) {
        allTrackable = false;
      }
    }
  });

  return {
    totalShipping,
    shippingBreakdown,
    allTrackable,
    cartTotal
  };
};

// Generate shipping explanation text for checkout
export const getShippingExplanation = () => {
  return {
    trackingInfo: "Orders $5.99 and above include tracking. Standard shipping is $2 for orders under $5.99.",
    freeShippingThreshold: "Free shipping on orders $5.99 and up!",
    softWaxNote: "SoftWax items always include tracking due to package thickness."
  };
};

// Validate shipping selection
export const validateShippingSelection = (cartItems, selectedShippingOptions) => {
  const errors = [];

  cartItems.forEach(item => {
    const productId = item.id.toString();
    const options = getShippingOptions(productId);
    
    if (selectedShippingOptions[productId]) {
      const selectedType = selectedShippingOptions[productId];
      const validOption = options.find(opt => opt.type === selectedType);
      
      if (!validOption) {
        errors.push(`Invalid shipping option selected for ${item.name}`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}; 