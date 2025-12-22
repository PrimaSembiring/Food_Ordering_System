import React from 'react';
import { Plus, Star, MessageSquare } from 'lucide-react';
import { formatCurrency, calculateAverageRating } from '../services/api';

const MenuCard = ({ item, onAddToCart, onViewReviews, isCustomer, reviews = [] }) => {
  const averageRating = calculateAverageRating(reviews);
  const reviewCount = reviews.length;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition card-hover">
      <div className="relative">
        <img
          src={item.image || "https://via.placeholder.com/300"}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Rating Badge - Muncul di gambar jika ada review */}
        {reviewCount > 0 && (
          <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1.5 shadow-lg">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-800">{averageRating}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Rating & Review Count - Clickable */}
        {reviewCount > 0 && (
          <button
            onClick={() => onViewReviews && onViewReviews(item)}
            className="flex items-center space-x-2 mb-3 hover:bg-gray-50 px-2 py-1 -ml-2 rounded transition"
          >
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{averageRating}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-sm">({reviewCount} reviews)</span>
            </div>
          </button>
        )}

        {/* Jika belum ada review */}
        {reviewCount === 0 && (
          <div className="mb-3 text-sm text-gray-400 italic">
            No reviews yet
          </div>
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