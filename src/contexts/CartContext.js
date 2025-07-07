import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define the initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0
};

// Create the context
const CartContext = createContext(initialState);

// Cart reducer to handle different actions
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, name, price, image, quantity = 1 } = action.payload;
      
      // Special handling for trial pack (ID 7) - limit to 1 total
      if (id === 7) {
        console.log('🎯 TRIAL PACK CART ADD - Input data:', { id, name, price, image, quantity });
        const existingTrialPack = state.items.find(item => item.id === 7);
        if (existingTrialPack) {
          // Trial pack already in cart, don't add more
          console.log('❌ Trial pack already in cart - not adding more');
          return state;
        }
        // Add trial pack with quantity 1 only
        const newCartState = {
          ...state,
          items: [...state.items, { id, name, price, image, quantity: 1 }],
          total: state.total + price,
          itemCount: state.itemCount + 1
        };
        console.log('✅ TRIAL PACK ADDED TO CART:', newCartState.items);
        return newCartState;
      }
      
      // Check if the item is already in the cart
      const existingItemIndex = state.items.findIndex(item => item.id === id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        return {
          ...state,
          items: updatedItems,
          total: state.total + (price * quantity),
          itemCount: state.itemCount + quantity
        };
      } else {
        // Item doesn't exist, add it
        return {
          ...state,
          items: [...state.items, { id, name, price, image, quantity }],
          total: state.total + (price * quantity),
          itemCount: state.itemCount + quantity
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      const itemToRemove = state.items.find(item => item.id === id);
      
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== id),
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
        itemCount: state.itemCount - itemToRemove.quantity
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }
      
      const existingItemIndex = state.items.findIndex(item => item.id === id);
      
      if (existingItemIndex === -1) return state;
      
      const item = state.items[existingItemIndex];
      const quantityDiff = quantity - item.quantity;
      
      const updatedItems = [...state.items];
      updatedItems[existingItemIndex] = {
        ...item,
        quantity
      };
      
      return {
        ...state,
        items: updatedItems,
        total: state.total + (item.price * quantityDiff),
        itemCount: state.itemCount + quantityDiff
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
}

// Create the provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  // Helper functions for cart management
  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value = {
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for using the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext; 