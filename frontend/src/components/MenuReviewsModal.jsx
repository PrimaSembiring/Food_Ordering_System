import React from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { calculateAverageRating } from '../services/api';

const MenuReviewsModal = ({ show, onClose, menuItem, reviews }) => {
  if (!show || !menuItem) return null;

  const averageRating = calculateAverageRating(reviews);
  const reviewCount = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(r => r.rating === rating).length
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-orange-50 to-red-50">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b bg-white">
          <div className="flex items-start space-x-4">
            <img 
              src={menuItem.image} 
              alt={menuItem.name} 
              className="w-24 h-24 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{menuItem.name}</h3>
              
              {reviewCount > 0 ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-3xl font-bold text-gray-800">{averageRating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">({reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating, index) => {
                      const count = ratingCounts[index];
                      const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-12 flex items-center">
                            {rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-1" />
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-yellow-400 h-2.5 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {reviewCount === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to review this item!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 mb-3">All Reviews ({reviewCount})</h4>
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