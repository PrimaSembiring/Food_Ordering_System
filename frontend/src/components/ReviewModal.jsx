import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import StarRating from './StarRating';

const ReviewModal = ({ show, onClose, orderItem, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmitReview({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {orderItem && (
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img 
              src={orderItem.image} 
              alt={orderItem.name} 
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{orderItem.name}</h3>
              <p className="text-sm text-gray-600">Rp {orderItem.price.toLocaleString()}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating *
            </label>
            <div className="flex items-center space-x-2">
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-lg font-semibold text-gray-700 ml-2">
                  {rating}.0
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Share your experience with this food..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;