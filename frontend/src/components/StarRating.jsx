import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition`}
          disabled={readonly}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;