import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllReviews } from '../lib/supabase';
import './ReviewsPage.css';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const reviewsData = await getAllReviews();
      // Only show approved reviews on public page
      const approvedReviews = reviewsData.filter(review => review.is_approved);
      setReviews(approvedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getProductName = (productId) => {
    const productNames = {
      '1': '5-Pack SoftBrace Strips',
      '2': '15-Pack SoftBrace Strips', 
      '3': '31-Pack SoftBrace Strips',
      '4': 'SoftWax',
      '5': '100-Pair Bulk Pack',
      '6': 'SoftWax + 5-Pack Bundle'
    };
    return productNames[productId] || `Product ${productId}`;
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.product_id === filter);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            ⭐ Customer Reviews
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            See what our customers are saying about SoftBrace products
          </p>
          
          {/* Product Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Products
            </button>
            {['1', '2', '3', '4', '6'].map(productId => (
              <button
                key={productId}
                onClick={() => setFilter(productId)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === productId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {getProductName(productId)}
              </button>
            ))}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold mb-4">No Reviews Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Be the first to share your experience with SoftBrace!
            </p>
            <Link
              to="/shop"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Shop SoftBrace Products
            </Link>
          </div>
        ) : (
          <div className="reviews-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="review-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  {renderStars(review.rating)}
                  <Link
                    to={`/product/${review.product_id}`}
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {getProductName(review.product_id)}
                  </Link>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {review.user_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                {review.review_text && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{review.review_text}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredReviews.length === 0 && reviews.length > 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2">No reviews for this product yet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different product or view all reviews.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Shop SoftBrace Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;