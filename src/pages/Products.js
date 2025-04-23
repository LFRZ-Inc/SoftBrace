import React from 'react';
import './Products.css';

const Products = () => {
  const productData = [
    {
      id: 1,
      name: 'Knee Support Strips',
      description: 'Flexible strips designed to provide targeted support for knee joints.',
      price: '$19.99',
      features: [
        'Flexible and breathable material',
        'Strong adhesive for all-day wear',
        'Provides targeted knee joint support',
        'Water-resistant'
      ]
    },
    {
      id: 2,
      name: 'Ankle Support Strips',
      description: 'Specially designed strips for ankle stability and comfort.',
      price: '$17.99',
      features: [
        'Ergonomic design for ankle mobility',
        'Firm support without restricting movement',
        'Sweat-resistant adhesive',
        'Can be worn with socks and shoes'
      ]
    },
    {
      id: 3,
      name: 'Wrist Support Strips',
      description: 'Supportive strips for wrist pain relief and prevention.',
      price: '$15.99',
      features: [
        'Slim profile fits under watch bands',
        'Reduces wrist strain during typing and lifting',
        'Hypoallergenic material',
        'Comfortable for all-day wear'
      ]
    },
    {
      id: 4,
      name: 'Elbow Support Strips',
      description: 'Effective support for tennis elbow and general elbow pain.',
      price: '$16.99',
      features: [
        'Targeted support for tennis and golfer\'s elbow',
        'Reduces strain during arm movements',
        'Breathable fabric allows skin to breathe',
        'Low profile design fits under clothing'
      ]
    },
    {
      id: 5,
      name: 'Shoulder Support Strips',
      description: 'Supportive strips for shoulder stability and pain relief.',
      price: '$21.99',
      features: [
        'Extra strong adhesive for complex joint movements',
        'Wider strips for more coverage',
        'Helps maintain proper shoulder positioning',
        'Ideal for rotator cuff issues'
      ]
    },
    {
      id: 6,
      name: 'Back Support Strips',
      description: 'Strips designed to provide support for lower back pain.',
      price: '$24.99',
      features: [
        'Extra-long strips for comprehensive back support',
        'Reduces strain during bending and lifting',
        'Breathable material for all-day comfort',
        'Multiple strips for customizable support'
      ]
    }
  ];

  return (
    <div className="products">
      <div className="container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p className="subtitle">
            Explore our range of innovative joint support strips
          </p>
        </div>

        <div className="product-grid">
          {productData.map(product => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                {/* Placeholder for product image */}
                <div className="image-placeholder">Product Image</div>
              </div>
              <div className="product-details">
                <h2>{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-features">
                  <h3>Features:</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="product-price-action">
                  <p className="product-price">{product.price}</p>
                  <button className="btn">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="custom-order">
          <h2>Need Custom Support?</h2>
          <p>
            We offer custom support strips tailored to your specific needs. 
            Contact us to discuss your requirements.
          </p>
          <button className="btn">Contact for Custom Order</button>
        </div>
      </div>
    </div>
  );
};

export default Products; 