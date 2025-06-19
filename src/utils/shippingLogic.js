// Shipping Logic for SoftBraceStrips.com
// Simple shipping options without tracking complexity

export const PRODUCT_TYPES = {
  FIVE_PACK: '1',      // 5-Pair Pack
  FIFTEEN_PACK: '2',   // 15-Pair Pack
  THIRTY_ONE_PACK: '3', // 31-Pair Pack
  SOFTWAX: '4',        // SoftWax
  BULK_PACK: '5',      // 100-Pair Bulk
  BUNDLE: '6'          // SoftWax + 5-Pair Bundle
};

export const SHIPPING_TYPES = {
  STANDARD: 'standard_shipping',
  FREE_SHIPPING: 'free_shipping'
};

// Calculate shipping options for a product
export const getShippingOptions = (productId, cartTotal = 0) => {
  const options = [];

  // Simple shipping logic for all products
  if (cartTotal >= 5.99) {
    options.push({
      type: SHIPPING_TYPES.FREE_SHIPPING,
      name: 'Free Shipping',
      price: 0.00,
      description: 'Free shipping on orders $5.99+',
      estimated_days: '3-5 business days'
    });
  } else {
    options.push({
      type: SHIPPING_TYPES.STANDARD,
      name: 'Standard Shipping',
      price: 2.00,
      description: '$2.00 shipping (free on orders $5.99+)',
      estimated_days: '3-5 business days'
    });
  }

  return options;
};

// Calculate shipping for entire cart
export const calculateCartShipping = (cartItems, selectedShippingOptions = {}) => {
  let totalShipping = 0;
  let shippingBreakdown = [];

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
    }
  });

  return {
    totalShipping,
    shippingBreakdown,
    cartTotal
  };
};

// Generate shipping explanation text for checkout
export const getShippingExplanation = () => {
  return {
    shippingInfo: "Standard shipping is $2.00 for orders under $5.99.",
    freeShippingThreshold: "Free shipping on orders $5.99 and up!"
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