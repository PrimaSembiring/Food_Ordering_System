import React from 'react';
import { User } from 'lucide-react';
import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{review.customerName}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="sm" />
      </div>
      
      {review.comment && (
        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
};

export default ReviewCard;