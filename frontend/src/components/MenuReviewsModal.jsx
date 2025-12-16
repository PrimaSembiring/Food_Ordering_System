import React from 'react';
import { X, Star } from 'lucide-react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import { calculateAverageRating } from '../services/api';

const MenuReviewsModal = ({ show, onClose, menuItem, reviews }) => {
  if (!show) return null;

  const averageRating = calculateAverageRating(reviews);
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(r => r.rating === rating).length
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {menuItem && (
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center space-x-4">
              <img 
                src={menuItem.image} 
                alt={menuItem.name} 
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{menuItem.name}</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
                  </div>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${reviews.length > 0 ? (ratingCounts[index] / reviews.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{ratingCounts[index]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to review this item!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuReviewsModal;