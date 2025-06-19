import React, { useState, useEffect } from 'react';
import { 
  getProductReviews, 
  getProductReviewStats, 
  submitProductReview 
} from '../lib/supabase';
import './ProductReviews.css';

const ProductReviews = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review_text: '',
    user_name: '',
    user_email: ''
  });

  // Load reviews and stats when component mounts
  useEffect(() => {
    loadReviews();
    loadReviewStats();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const reviewsData = await getProductReviews(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadReviewStats = async () => {
    try {
      const stats = await getProductReviewStats(productId);
      setReviewStats(stats);
    } catch (error) {
      console.error('Error loading review stats:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await submitProductReview({
        product_id: productId,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text.trim(),
        user_name: reviewForm.user_name.trim(),
        user_email: reviewForm.user_email.trim()
      });

      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewForm({
        rating: 5,
        review_text: '',
        user_name: '',
        user_email: ''
      });

      // Show success message for a few seconds
      setTimeout(() => setReviewSubmitted(false), 5000);
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

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="product-reviews mt-16 mb-12 p-8 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-xl shadow-xl border-2 border-blue-200 dark:border-blue-700">
      <div className="reviews-header flex items-center justify-between mb-8 pb-4 border-b-2 border-blue-200 dark:border-blue-700">
        <div>
          <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white flex items-center">
            <span className="text-blue-500 mr-3">⭐</span>
            Customer Reviews
          </h3>
          {reviewStats.totalReviews > 0 ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(reviewStats.averageRating, false, 'large')}
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {reviewStats.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          ) : (
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-lg font-medium">
                🌟 No reviews yet. Be the first to review {productName}!
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          ✍️ Leave a Review
        </button>
      </div>

      {reviewSubmitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg">
          <p className="font-medium">✓ Review submitted successfully!</p>
          <p className="text-sm">Your review will appear after approval. Thank you for your feedback!</p>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Write a Review for {productName}</h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating *</label>
              {renderStars(reviewForm.rating, true, 'large')}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="user_name">
                Your Name *
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={reviewForm.user_name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="user_email">
                Your Email *
              </label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                value={reviewForm.user_email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">Your email will not be displayed publicly</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="review_text">
                Your Review (Optional)
              </label>
              <textarea
                id="review_text"
                name="review_text"
                value={reviewForm.review_text}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about your experience with this product..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="reviews-list">
          <h4 className="text-lg font-semibold mb-4">Recent Reviews</h4>
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <div key={review.id} className="review-item p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(review.rating, false, 'small')}
                      <span className="text-sm font-medium">{review.user_name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {review.review_text}
                  </p>
                )}
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-4 text-primary hover:text-primary-light font-medium"
            >
              {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
            </button>
          )}
        </div>
      )}

      {reviews.length === 0 && reviewStats.totalReviews === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No reviews yet for this product.</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews; 