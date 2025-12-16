import React from 'react';
import { Plus, Star } from 'lucide-react';
import { formatCurrency, calculateAverageRating } from '../services/api';

const MenuCard = ({ item, onAddToCart, onViewReviews, isCustomer, reviews = [] }) => {
  const averageRating = calculateAverageRating(reviews);
  const reviewCount = reviews.length;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition card-hover">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Rating Display */}
        {reviewCount > 0 && (
          <button
            onClick={() => onViewReviews && onViewReviews(item)}
            className="flex items-center space-x-1 mb-2 hover:underline"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">{averageRating}</span>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </button>
        )}
        
        <p className="text-2xl font-bold text-orange-600 mb-4">
          {formatCurrency(item.price)}
        </p>
        
        {isCustomer && (
          <button
            onClick={() => onAddToCart(item)}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;