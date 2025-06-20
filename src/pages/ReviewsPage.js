import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApprovedReviews, submitProductReview } from '../lib/supabase';
import './ReviewsPage.css';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({
    product_id: '1', // Default to 5-pack
    rating: 5,
    review_text: '',
    user_name: '',
    user_email: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading reviews...');
      
      const reviewsData = await getAllApprovedReviews();
      console.log('Reviews loaded:', reviewsData);
      
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError(`Failed to load reviews: ${error.message}`);
      setReviews([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await submitProductReview({
        product_id: reviewForm.product_id,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text.trim(),
        user_name: reviewForm.user_name.trim(),
        user_email: reviewForm.user_email.trim()
      });

      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewForm({
        product_id: '1',
        rating: 5,
        review_text: '',
        user_name: '',
        user_email: ''
      });

      // Reload reviews to show the new one (if approved)
      loadReviews();

      // Show success message for a few seconds
      setTimeout(() => setReviewSubmitted(false), 8000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStars = (rating, interactive = false, size = 'medium') => {
    const sizeClass = size === 'large' ? 'text-2xl' : size === 'small' ? 'text-sm' : 'text-lg';
    
    return (
      <div className={`flex items-center ${sizeClass}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : 'button'}
            disabled={!interactive}
            className={`${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-300 dark:text-gray-600'
            } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'}`}
            onClick={interactive ? () => setReviewForm(prev => ({ ...prev, rating: star })) : undefined}
          >
            ★
          </button>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-xl">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 mb-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Reviews</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={loadReviews}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Customer Reviews
          </h1>
          <p className="text-xl text-gray-800 dark:text-gray-100 mb-8 font-medium">
            See what our customers say about SoftBrace strips
          </p>
          
          {/* Add Review Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              ✍️ Leave a Review
            </button>
          </div>
          
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

        {/* Review Submission Success Message */}
        {reviewSubmitted && (
          <div className="mb-8 p-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-xl text-center border border-green-200 dark:border-green-700">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-lg mb-2">Review submitted successfully!</p>
            <p className="text-sm">Your review will appear after approval. Thank you for your feedback!</p>
          </div>
        )}

        {/* Review Submission Form */}
        {showReviewForm && (
          <div className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Share Your SoftBrace Experience
            </h3>
            <form onSubmit={handleReviewSubmit} className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Product *
                  </label>
                  <select
                    name="product_id"
                    value={reviewForm.product_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="1">5-Pack SoftBrace Strips</option>
                    <option value="2">15-Pack SoftBrace Strips</option>
                    <option value="3">31-Pack SoftBrace Strips</option>
                    <option value="4">SoftWax</option>
                    <option value="6">SoftWax + 5-Pack Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Rating *
                  </label>
                  <div className="pt-2">
                    {renderStars(reviewForm.rating, true, 'large')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    value={reviewForm.user_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    value={reviewForm.user_email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your email"
                  />
                  <p className="text-xs text-gray-700 dark:text-gray-200 mt-1 font-medium">Your email will not be displayed publicly</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Your Review (Optional)
                </label>
                <textarea
                  name="review_text"
                  value={reviewForm.review_text}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your experience with this product..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-8 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Display */}
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold mb-4">No Reviews Yet</h2>
            <p className="text-gray-800 dark:text-gray-200 mb-8 font-medium">
              Be the first to share your experience with SoftBrace!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-block bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                ✍️ Write First Review
              </button>
              <Link
                to="/shop"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop SoftBrace Products
              </Link>
            </div>
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
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                {review.review_text && (
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
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
            <p className="text-gray-800 dark:text-gray-200 mb-6 font-medium">
              Try selecting a different product or view all reviews.
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="inline-block bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              ✍️ Be the First to Review This Product
            </button>
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

        <div className="text-center py-8">
          <p className="text-gray-800 dark:text-gray-200 mb-8 font-medium">
            No reviews yet. Be the first to share your experience!
          </p>
          <p className="text-gray-800 dark:text-gray-200 mb-6 font-medium">
            Submit your own review above and help others make informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;
